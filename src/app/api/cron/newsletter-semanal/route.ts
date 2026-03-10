import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function verificarAutorizacion(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) {
    return true
  }
  if (process.env.NODE_ENV === 'development') {
    return true
  }
  return false
}

async function enviarEmail(to: string[], subject: string, html: string): Promise<boolean> {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[CRON] RESEND_API_KEY no configurada')
    return false
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const lotes = []
    for (let i = 0; i < to.length; i += 50) {
      lotes.push(to.slice(i, i + 50))
    }

    for (const lote of lotes) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'Plataforma Legal <noreply@legal.cl>',
        to: lote,
        subject,
        html
      })
    }

    return true
  } catch (error) {
    console.error('[CRON] Error enviando email:', error)
    return false
  }
}

export async function GET(request: NextRequest) {
  if (!verificarAutorizacion(request)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const hoy = new Date()
    const hace7Dias = new Date(hoy.getTime() - 7 * 24 * 60 * 60 * 1000)

    // Obtener estadisticas de la semana
    const [
      documentosNuevos,
      totalDocumentos,
      newslettersEnviados,
      usuarios
    ] = await Promise.all([
      prisma.documento.count({
        where: { createdAt: { gte: hace7Dias } }
      }),
      prisma.documento.count(),
      prisma.newsletter.count({
        where: {
          enviadoAt: { gte: hace7Dias },
          tipo: 'DIARIO'
        }
      }),
      prisma.user.findMany({ select: { email: true, nombre: true } })
    ])

    // Obtener documentos destacados de la semana
    const documentosDestacados = await prisma.documento.findMany({
      where: { updatedAt: { gte: hace7Dias } },
      take: 10,
      orderBy: { updatedAt: 'desc' }
    })

    // Agrupar por categoria
    const porCategoria = await prisma.documento.groupBy({
      by: ['categoria'],
      _count: true
    })

    const contenido = `
      <div style="margin-bottom: 32px;">
        <h2 style="color: #1e40af; margin: 0 0 16px 0;">Resumen de la Semana</h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
          <div style="background: #dbeafe; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #1e40af;">${documentosNuevos}</div>
            <div style="color: #1e40af; font-size: 14px;">Documentos nuevos</div>
          </div>
          <div style="background: #dcfce7; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #16a34a;">${totalDocumentos}</div>
            <div style="color: #16a34a; font-size: 14px;">Total en biblioteca</div>
          </div>
          <div style="background: #fef3c7; padding: 16px; border-radius: 8px; text-align: center;">
            <div style="font-size: 32px; font-weight: bold; color: #d97706;">${newslettersEnviados}</div>
            <div style="color: #d97706; font-size: 14px;">Boletines enviados</div>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 32px;">
        <h2 style="color: #1e40af; margin: 0 0 16px 0;">Distribucion por Categoria</h2>
        ${porCategoria.map(cat => `
          <div style="display: flex; align-items: center; margin-bottom: 8px;">
            <div style="width: 140px; font-size: 14px; color: #64748b;">${cat.categoria.replace('_', ' ')}</div>
            <div style="flex: 1; background: #e2e8f0; border-radius: 4px; height: 24px; overflow: hidden;">
              <div style="background: #3b82f6; height: 100%; width: ${Math.min((cat._count / totalDocumentos) * 100, 100)}%;"></div>
            </div>
            <div style="width: 40px; text-align: right; font-size: 14px; color: #1e293b; font-weight: 500;">${cat._count}</div>
          </div>
        `).join('')}
      </div>

      ${documentosDestacados.length > 0 ? `
        <div>
          <h2 style="color: #1e40af; margin: 0 0 16px 0;">Documentos Destacados</h2>
          ${documentosDestacados.slice(0, 5).map(doc => `
            <div style="margin-bottom: 16px; padding: 16px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #3b82f6;">
              <h3 style="margin: 0 0 8px 0; color: #1e293b; font-size: 16px;">${doc.titulo}</h3>
              <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.5;">${doc.resumen}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <div style="margin-top: 32px; padding: 20px; background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); border-radius: 8px; text-align: center;">
        <p style="color: white; margin: 0 0 12px 0; font-size: 16px;">Accede a la plataforma para explorar todo el contenido</p>
        <a href="${process.env.NEXTAUTH_URL || 'https://plataforma-informacion-legal.vercel.app'}"
           style="display: inline-block; background: white; color: #1e40af; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Ir a la Plataforma
        </a>
      </div>
    `

    // Crear y enviar newsletter semanal
    const newsletter = await prisma.newsletter.create({
      data: {
        tipo: 'SEMANAL',
        asunto: `Resumen Semanal Legal - Semana del ${hace7Dias.toLocaleDateString('es-CL')}`,
        contenido
      }
    })

    if (usuarios.length > 0) {
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f1f5f9;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Resumen Semanal</h1>
              <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 14px;">
                Semana del ${hace7Dias.toLocaleDateString('es-CL')} al ${hoy.toLocaleDateString('es-CL')}
              </p>
            </div>
            <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px;">
              ${contenido}
            </div>
            <div style="text-align: center; padding: 24px; color: #64748b; font-size: 12px;">
              <p>Plataforma de Informacion Legal - Direccion Juridica Municipal</p>
            </div>
          </div>
        </body>
        </html>
      `

      const enviado = await enviarEmail(
        usuarios.map(u => u.email),
        newsletter.asunto,
        html
      )

      if (enviado) {
        await prisma.newsletter.update({
          where: { id: newsletter.id },
          data: { enviadoAt: new Date() }
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Newsletter semanal enviado',
      stats: {
        documentosNuevos,
        totalDocumentos,
        usuariosNotificados: usuarios.length
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[CRON] Error en newsletter semanal:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
