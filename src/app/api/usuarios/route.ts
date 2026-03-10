import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Listar usuarios (solo admin)
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true,
        createdAt: true,
        _count: {
          select: {
            chatHistory: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ usuarios })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 })
  }
}

// PATCH - Actualizar rol de usuario (solo admin)
export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { userId, rol } = body

    if (!userId || !rol) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    if (!['ADMIN', 'USUARIO'].includes(rol)) {
      return NextResponse.json({ error: 'Rol invalido' }, { status: 400 })
    }

    // No permitir que un admin se quite su propio rol de admin
    if (userId === session.user.id && rol !== 'ADMIN') {
      return NextResponse.json({ error: 'No puedes cambiar tu propio rol' }, { status: 400 })
    }

    const usuario = await prisma.user.update({
      where: { id: userId },
      data: { rol },
      select: {
        id: true,
        email: true,
        nombre: true,
        rol: true
      }
    })

    return NextResponse.json({ usuario, message: 'Rol actualizado' })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 })
  }
}

// DELETE - Eliminar usuario (solo admin)
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: 'ID de usuario requerido' }, { status: 400 })
    }

    // No permitir auto-eliminacion
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'No puedes eliminarte a ti mismo' }, { status: 400 })
    }

    // Eliminar historial de chat primero
    await prisma.chatHistory.deleteMany({
      where: { userId }
    })

    // Eliminar usuario
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ message: 'Usuario eliminado' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 })
  }
}
