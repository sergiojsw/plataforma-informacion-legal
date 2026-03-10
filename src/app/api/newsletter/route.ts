import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Solo importar Resend cuando se necesite
async function sendEmail(to: string[], subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY no configurada, email no enviado')
    return false
  }

  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    await resend.emails.send({
      from: 'Plataforma Legal <noreply@tudominio.com>',
      to,
      subject,
      html
    })
    return true
  } catch (error) {
    console.error('Error enviando email:', error)
    return false
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const tipo = searchParams.get('tipo')

  const newsletters = await prisma.newsletter.findMany({
    where: tipo ? { tipo: tipo as any } : {},
    orderBy: { createdAt: 'desc' },
    take: 20
  })

  return NextResponse.json({ newsletters })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await request.json()
  const { tipo, asunto, contenido, enviar } = body

  if (!tipo || !asunto || !contenido) {
    return NextResponse.json({ error: 'Campos requeridos faltantes' }, { status: 400 })
  }

  const newsletter = await prisma.newsletter.create({
    data: {
      tipo,
      asunto,
      contenido,
      enviadoAt: enviar ? new Date() : null
    }
  })

  // Si se solicita enviar inmediatamente
  if (enviar) {
    const usuarios = await prisma.user.findMany({
      select: { email: true }
    })

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #1e40af;">${asunto}</h1>
        <div style="line-height: 1.6;">
          ${contenido}
        </div>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 12px;">
          Plataforma de Información Legal - Dirección Jurídica Municipal
        </p>
      </div>
    `

    await sendEmail(usuarios.map(u => u.email), asunto, html)
  }

  return NextResponse.json(newsletter, { status: 201 })
}
