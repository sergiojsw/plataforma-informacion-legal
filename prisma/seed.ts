import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Crear usuario administrador
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@legal.cl' },
    update: {},
    create: {
      email: 'admin@legal.cl',
      nombre: 'Administrador',
      password: adminPassword,
      rol: 'ADMIN'
    }
  })

  // Crear usuario normal
  const userPassword = await bcrypt.hash('usuario123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'usuario@legal.cl' },
    update: {},
    create: {
      email: 'usuario@legal.cl',
      nombre: 'Usuario Demo',
      password: userPassword,
      rol: 'USUARIO'
    }
  })

  // Crear documentos de ejemplo
  const documentos = [
    {
      titulo: 'Ley 21.389 - Registro Nacional de Deudores de Pensiones de Alimentos',
      categoria: 'LEGISLACION' as const,
      resumen: 'Crea el Registro Nacional de Deudores de Pensiones de Alimentos y establece mecanismos de cumplimiento.',
      contenido: `Artículo 1°.- Créase el Registro Nacional de Deudores de Pensiones de Alimentos, en adelante también "el Registro", que será administrado por el Servicio de Registro Civil e Identificación.

Artículo 2°.- Serán incorporadas al Registro las personas que adeuden, total o parcialmente, una o más pensiones alimenticias decretadas judicialmente, una vez que el tribunal competente oficie dicha circunstancia al Servicio de Registro Civil e Identificación.

Artículo 3°.- La incorporación al Registro producirá los siguientes efectos:
a) El deudor no podrá ser designado en cargos de la Administración del Estado.
b) El deudor no podrá renovar su licencia de conducir.
c) El deudor no podrá obtener pasaporte.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1165084'
    },
    {
      titulo: 'Procedimiento Sumario - Artículos 680 a 692 CPC',
      categoria: 'DOCTRINA' as const,
      resumen: 'Análisis del procedimiento sumario en el Código de Procedimiento Civil chileno.',
      contenido: `El procedimiento sumario es un procedimiento breve y concentrado para casos que requieren una tramitación rápida.

CARACTERÍSTICAS:
1. Aplicación: Casos determinados por ley y cuando la acción requiera tramitación rápida.
2. Plazos: Reducidos respecto al juicio ordinario.
3. Audiencias: Concentración de actuaciones.

TRAMITACIÓN:
- Demanda y notificación
- Audiencia de contestación y conciliación (5° día hábil)
- Período probatorio (8 días)
- Sentencia (10 días desde citación para oír sentencia)

RECURSOS: Apelación en el solo efecto devolutivo, salvo excepciones.`
    },
    {
      titulo: 'Recurso de Protección - Artículo 20 Constitución',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Jurisprudencia relevante sobre el recurso de protección y su aplicación práctica.',
      contenido: `El recurso de protección es una acción constitucional que permite a cualquier persona acudir a la Corte de Apelaciones respectiva cuando, por causa de actos u omisiones arbitrarios o ilegales, sufra privación, perturbación o amenaza en el legítimo ejercicio de los derechos garantizados en el artículo 19 de la Constitución.

PLAZO: 30 días corridos desde que se tuvo conocimiento del acto u omisión.

LEGITIMACIÓN ACTIVA: El afectado o cualquier persona en su nombre.

TRIBUNAL COMPETENTE: Corte de Apelaciones respectiva.

PROCEDIMIENTO:
1. Interposición del recurso
2. Informe del recurrido
3. Orden de no innovar (facultativa)
4. Vista de la causa
5. Sentencia (en 5 días)`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=242302'
    },
    {
      titulo: 'Modelo de Contestación de Demanda Civil',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Estructura y elementos esenciales de una contestación de demanda en juicio civil ordinario.',
      contenido: `ESTRUCTURA DE CONTESTACIÓN DE DEMANDA

EN LO PRINCIPAL: Contesta demanda.
PRIMER OTROSÍ: Opone excepciones dilatorias.
SEGUNDO OTROSÍ: Patrocinio y poder.

REQUISITOS:
1. Individualización del demandado
2. Excepciones dilatorias (si corresponde)
3. Contestación de hechos
4. Defensas y alegaciones
5. Petición concreta

PLAZOS:
- Juicio ordinario: 15 días (término de emplazamiento)
- Si no contesta: Rebeldía y traslado para réplica

RECOMENDACIONES:
- Negar expresamente cada hecho de la demanda
- Fundamentar jurídicamente las defensas
- Ofrecer medios de prueba`
    }
  ]

  for (const doc of documentos) {
    await prisma.documento.create({
      data: doc
    })
  }

  console.log('Seed completado:')
  console.log('- Admin:', admin.email)
  console.log('- Usuario:', user.email)
  console.log('- Documentos:', documentos.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
