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

    // Enviar en lotes de 50 para evitar limites
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

  // Solo ejecutar de lunes a viernes
  const hoy = new Date()
  const diaSemana = hoy.getDay()
  if (diaSemana === 0 || diaSemana === 6) {
    return NextResponse.json({
      success: true,
      message: 'Fin de semana, no se envia newsletter diario',
      skipped: true
    })
  }

  try {
    // Buscar el ultimo newsletter diario no enviado
    const newsletterPendiente = await prisma.newsletter.findFirst({
      where: {
        tipo: 'DIARIO',
        enviadoAt: null
      },
      orderBy: { createdAt: 'desc' }
    })

    if (!newsletterPendiente) {
      // Crear uno con contenido por defecto si no hay pendientes
      const documentosRecientes = await prisma.documento.findMany({
        take: 5,
        orderBy: { updatedAt: 'desc' }
      })

      if (documentosRecientes.length === 0) {
        return NextResponse.json({
          success: true,
          message: 'No hay contenido para enviar',
          skipped: true
        })
      }

      const contenido = `
        <h2 style="color: #1e40af; margin-bottom: 20px;">Documentos Destacados</h2>
        ${documentosRecientes.map(doc => `
          <div style="margin-bottom: 16px; padding: 16px; background: #f8fafc; border-radius: 8px;">
            <h3 style="margin: 0 0 8px 0; color: #1e293b;">${doc.titulo}</h3>
            <p style="margin: 0; color: #64748b; font-size: 14px;">${doc.resumen}</p>
            <span style="display: inline-block; margin-top: 8px; padding: 4px 12px; background: #dbeafe; color: #1e40af; border-radius: 20px; font-size: 12px;">
              ${doc.categoria.replace('_', ' ')}
            </span>
          </div>
        `).join('')}
        <p style="margin-top: 24px; color: #64748b; font-size: 14px;">
          Accede a la plataforma para ver el contenido completo.
        </p>
      `

      const nuevoNewsletter = await prisma.newsletter.create({
        data: {
          tipo: 'DIARIO',
          asunto: `Boletin Legal Diario - ${hoy.toLocaleDateString('es-CL')}`,
          contenido
        }
      })

      // Continuar con este newsletter
      await enviarNewsletter(nuevoNewsletter)
    } else {
      await enviarNewsletter(newsletterPendiente)
    }

    return NextResponse.json({
      success: true,
      message: 'Newsletter diario enviado',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('[CRON] Error en newsletter diario:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

async function enviarNewsletter(newsletter: any) {
  // Obtener todos los usuarios
  const usuarios = await prisma.user.findMany({
    select: { email: true }
  })

  if (usuarios.length === 0) {
    console.log('[CRON] No hay usuarios para enviar newsletter')
    return
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #f1f5f9;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #0f172a 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Boletin Legal Diario</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 14px;">
            ${new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 12px 12px;">
          ${newsletter.contenido}
        </div>
        <div style="text-align: center; padding: 24px; color: #64748b; font-size: 12px;">
          <p>Plataforma de Informacion Legal - Direccion Juridica Municipal</p>
          <p>Este correo fue enviado automaticamente. Para dejar de recibir estos correos, contacte al administrador.</p>
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
    console.log(`[CRON] Newsletter enviado a ${usuarios.length} usuarios`)
  }
}
