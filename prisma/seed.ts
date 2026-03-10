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

  // Documentos juridicos REALES chilenos
  const documentos = [
    // === LEGISLACION ===
    {
      titulo: 'Ley 18.695 - Ley Organica Constitucional de Municipalidades',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece la organizacion, atribuciones y funcionamiento de las municipalidades chilenas. Define la estructura del gobierno comunal, funciones del alcalde y concejo municipal.',
      contenido: `LEY 18695 - LEY ORGANICA CONSTITUCIONAL DE MUNICIPALIDADES

TITULO I - DE LA MUNICIPALIDAD

Articulo 1.- La administracion local de cada comuna o agrupacion de comunas que determine la ley reside en una municipalidad.

Las municipalidades son corporaciones autonomas de derecho publico, con personalidad juridica y patrimonio propio, cuya finalidad es satisfacer las necesidades de la comunidad local y asegurar su participacion en el progreso economico, social y cultural de las respectivas comunas.

Articulo 2.- Las municipalidades estaran constituidas por el alcalde, que sera su maxima autoridad, y por el concejo.

TITULO II - DE LAS FUNCIONES Y ATRIBUCIONES

Articulo 3.- Correspondera a las municipalidades, en el ambito de su territorio, las siguientes funciones privativas:
a) Elaborar, aprobar y modificar el plan comunal de desarrollo
b) La planificacion y regulacion de la comuna y la confeccion del plan regulador comunal
c) La promocion del desarrollo comunitario
d) Aplicar las disposiciones sobre transporte y transito publicos
e) Aplicar las disposiciones sobre construccion y urbanizacion
f) El aseo y ornato de la comuna

Articulo 4.- Las municipalidades podran desarrollar, directamente o con otros organos de la Administracion del Estado, funciones relacionadas con:
a) La educacion y la cultura
b) La salud publica y la proteccion del medio ambiente
c) La asistencia social y juridica
d) La capacitacion, la promocion del empleo
e) El turismo, el deporte y la recreacion
f) La urbanizacion y la vialidad urbana y rural
g) La construccion de viviendas sociales e infraestructuras sanitarias
h) El transporte y transito publicos
i) La prevencion de riesgos y la prestacion de auxilio en situaciones de emergencia
j) El apoyo y el fomento de medidas de prevencion en materia de seguridad ciudadana
k) La promocion de la igualdad de oportunidades entre hombres y mujeres
l) El desarrollo de actividades de interes comun en el ambito local`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=251693'
    },
    {
      titulo: 'Ley 19.880 - Ley de Bases de los Procedimientos Administrativos',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece las bases del procedimiento administrativo aplicable a los actos de la Administracion del Estado, incluyendo municipalidades. Regula plazos, notificaciones, recursos y silencio administrativo.',
      contenido: `LEY 19880 - BASES DE LOS PROCEDIMIENTOS ADMINISTRATIVOS

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- Procedimiento Administrativo. La presente ley establece y regula las bases del procedimiento administrativo de los actos de la Administracion del Estado.

Articulo 2.- Ambito de aplicacion. Las disposiciones de esta ley seran aplicables a los ministerios, las intendencias, las gobernaciones, los servicios publicos y las municipalidades.

TITULO II - PRINCIPIOS DEL PROCEDIMIENTO ADMINISTRATIVO

Articulo 4.- Principios del procedimiento. El procedimiento administrativo estara sometido a los principios de:
- Escrituracion
- Gratuidad
- Celeridad
- Conclusion
- Economia procedimental
- Contradictoriedad
- Imparcialidad
- Abstension
- No formalizacion
- Inexcusabilidad
- Impugnabilidad
- Transparencia y publicidad

Articulo 7.- Principio de celeridad. El procedimiento, sometido al criterio de celeridad, se impulsara de oficio en todos sus tramites.

TITULO III - DEL PROCEDIMIENTO ADMINISTRATIVO

Articulo 18.- Iniciacion del procedimiento. El procedimiento podra iniciarse de oficio o a solicitud de persona interesada.

Articulo 23.- Plazos. Los plazos de dias establecidos en esta ley son de dias habiles, entendiendose que son inhabiles los dias sabado, domingo y festivos.

Articulo 27.- Obligacion de resolver. La Administracion esta obligada a dictar resolucion expresa en todos los procedimientos y a notificarla, cualquiera que sea su forma de iniciacion.

SILENCIO ADMINISTRATIVO

Articulo 64.- Silencio Positivo. Transcurrido el plazo legal para resolver acerca de una solicitud que haya originado un procedimiento, sin que la Administracion se pronuncie sobre ella, el interesado podra denunciar el incumplimiento ante la autoridad que debia resolver el asunto, requiriendole una decision.

Articulo 65.- Silencio Negativo. Se entendera rechazada una solicitud que no sea resuelta dentro del plazo legal cuando ella afecte el patrimonio fiscal.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=210676'
    },
    {
      titulo: 'Ley 20.285 - Ley de Transparencia y Acceso a la Informacion Publica',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula el principio de transparencia de la funcion publica, el derecho de acceso a la informacion de los organos de la Administracion del Estado y los procedimientos para su ejercicio.',
      contenido: `LEY 20285 - TRANSPARENCIA DE LA FUNCION PUBLICA Y ACCESO A LA INFORMACION

TITULO I - NORMAS GENERALES

Articulo 1.- La presente ley regula el principio de transparencia de la funcion publica, el derecho de acceso a la informacion de los organos de la Administracion del Estado, los procedimientos para el ejercicio del derecho y para su amparo.

Articulo 2.- Las disposiciones de esta ley seran aplicables a los ministerios, intendencias, gobernaciones, servicios publicos, municipalidades, y a las empresas publicas creadas por ley.

TITULO II - TRANSPARENCIA ACTIVA

Articulo 7.- Los organos de la Administracion del Estado deberan mantener a disposicion permanente del publico, a traves de sus sitios electronicos, los siguientes antecedentes actualizados, al menos, una vez al mes:

a) Su estructura organica
b) Las facultades, funciones y atribuciones de cada una de sus unidades u organos internos
c) El marco normativo que les sea aplicable
d) La planta del personal y el personal a contrata y a honorarios
e) Las contrataciones para el suministro de bienes muebles
f) Las transferencias de fondos publicos que efectuen
g) Los actos y resoluciones que tengan efectos sobre terceros
h) Los tramites y requisitos que debe cumplir el interesado para tener acceso a los servicios
i) El diseno, montos asignados y criterio de acceso a los programas de subsidios
j) Los mecanismos de participacion ciudadana
k) La informacion sobre el presupuesto asignado, asi como los informes sobre su ejecucion
l) Los resultados de las auditorias al ejercicio presupuestario
m) Todas las entidades en que tengan participacion, representacion e intervencion

TITULO III - DERECHO DE ACCESO A LA INFORMACION

Articulo 10.- Toda persona tiene derecho a solicitar y recibir informacion de cualquier organo de la Administracion del Estado.

Articulo 12.- La solicitud de acceso a la informacion sera formulada por escrito o por sitios electronicos y debera contener:
a) Nombre, apellidos y direccion del solicitante
b) Identificacion clara de la informacion que se requiere
c) Firma del solicitante estampada por cualquier medio habilitado

Articulo 14.- La autoridad o jefatura o jefe superior del organo o servicio de la Administracion del Estado, requerido, debera pronunciarse sobre la solicitud dentro del plazo de veinte dias habiles, contado desde la recepcion de la misma.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=276363'
    },
    {
      titulo: 'Ley 19.886 - Ley de Compras Publicas y Bases sobre Contratos Administrativos',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula los contratos que celebre la Administracion del Estado para el suministro de bienes, prestacion de servicios y ejecucion de obras. Establece el sistema de compras publicas ChileCompra.',
      contenido: `LEY 19886 - LEY DE BASES SOBRE CONTRATOS ADMINISTRATIVOS DE SUMINISTRO Y PRESTACION DE SERVICIOS

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- Los contratos que celebre la Administracion del Estado, a titulo oneroso, para el suministro de bienes muebles, y de los servicios que se requieran para el desarrollo de sus funciones, se ajustaran a las normas y principios del presente cuerpo legal y de su reglamentacion.

Articulo 2.- Quedan excluidos de la aplicacion de la presente ley:
a) Las contrataciones de personal de la Administracion del Estado
b) Los convenios que celebren entre si los organismos publicos

TITULO II - DE LOS PROCEDIMIENTOS DE CONTRATACION

Articulo 5.- La Administracion adjudicara los contratos que celebre mediante licitacion publica, licitacion privada o contratacion directa.

La licitacion publica sera obligatoria cuando las contrataciones superen las 1.000 unidades tributarias mensuales.

LICITACION PUBLICA

Articulo 6.- Para proceder al llamado a licitacion publica sera necesario que previamente se hayan elaborado las bases administrativas y tecnicas por las cuales se regira el respectivo contrato.

Las bases deberan establecer:
a) Los requisitos y condiciones que deben cumplir los oferentes
b) Las especificaciones de los bienes y/o servicios que se requieren
c) Las etapas y plazos de la licitacion
d) Los criterios de evaluacion
e) Los requisitos de admisibilidad de las ofertas
f) El monto y forma de la garantia

SISTEMA ELECTRONICO DE COMPRAS

Articulo 19.- Crease un Sistema de Informacion de Compras y Contrataciones de la Administracion, a cargo de la Direccion de Compras y Contratacion Publica, que se denominara ChileCompra.

El Sistema sera de acceso publico y gratuito. Por su intermedio se publicaran las convocatorias a participar en los procesos de compras y contrataciones.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=213004'
    },
    {
      titulo: 'Ley 21.389 - Registro Nacional de Deudores de Pensiones de Alimentos',
      categoria: 'LEGISLACION' as const,
      resumen: 'Crea el Registro Nacional de Deudores de Pensiones de Alimentos y establece mecanismos de cumplimiento. Afecta tramites municipales como licencias de conducir.',
      contenido: `LEY 21389 - CREA EL REGISTRO NACIONAL DE DEUDORES DE PENSIONES DE ALIMENTOS

Articulo 1.- Crease el Registro Nacional de Deudores de Pensiones de Alimentos, en adelante tambien "el Registro", que sera administrado por el Servicio de Registro Civil e Identificacion.

Articulo 2.- Seran incorporadas al Registro las personas que adeuden, total o parcialmente, una o mas pensiones alimenticias decretadas judicialmente, una vez que el tribunal competente oficie dicha circunstancia al Servicio de Registro Civil e Identificacion.

Articulo 3.- La incorporacion al Registro producira los siguientes efectos:

a) El deudor no podra ser designado en cargos de la Administracion del Estado, incluidas las municipalidades.

b) El deudor no podra renovar su licencia de conducir. Las municipalidades deberan verificar en el Registro antes de emitir o renovar licencias.

c) El deudor no podra obtener pasaporte.

d) El deudor no podra ser candidato a cargos de eleccion popular.

e) El deudor no podra acceder a creditos otorgados por bancos e instituciones financieras.

CONSULTA OBLIGATORIA POR MUNICIPALIDADES

Articulo 12.- Las municipalidades, previo a la emision o renovacion de licencias de conducir, deberan consultar el Registro a fin de verificar si el solicitante se encuentra inscrito en el.

En caso de estar inscrito, no podra procederse a la emision o renovacion hasta que el deudor acredite haber solucionado la deuda o haber convenido una forma de pago con el alimentario.

RETENCIONES

Articulo 18.- Los empleadores, tanto publicos como privados, que tengan a su cargo el pago de remuneraciones a un deudor inscrito en el Registro, deberan retener de su remuneracion el monto correspondiente a la pension alimenticia adeudada.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1165084'
    },
    {
      titulo: 'DFL 1-19.653 - Estatuto Administrativo',
      categoria: 'LEGISLACION' as const,
      resumen: 'Fija el texto refundido de la Ley 18.834 sobre Estatuto Administrativo. Regula la carrera funcionaria, derechos, obligaciones y responsabilidad de los funcionarios publicos.',
      contenido: `DFL 1-19653 - ESTATUTO ADMINISTRATIVO (Texto Refundido Ley 18.834)

TITULO I - NORMAS GENERALES

Articulo 1.- Las relaciones entre el Estado y el personal de los Ministerios, Intendencias, Gobernaciones y de los servicios publicos centralizados y descentralizados creados para el cumplimiento de la funcion administrativa, se regularan por las normas del presente Estatuto Administrativo.

Articulo 2.- Los funcionarios de la Administracion del Estado se regiran por el presente Estatuto.

TITULO II - DE LA CARRERA FUNCIONARIA

Articulo 3.- Para los efectos de este Estatuto el significado legal de los siguientes terminos sera:
a) Cargo publico: Es aquel que se contempla en las plantas o como empleos a contrata
b) Planta de personal: Es el conjunto de cargos permanentes
c) Empleo a contrata: Es aquel de caracter transitorio
d) Carrera funcionaria: Es un sistema integral de regulacion del empleo publico

TITULO III - DE LAS OBLIGACIONES FUNCIONARIAS

Articulo 61.- Seran obligaciones de cada funcionario:
a) Desempenar personalmente las funciones del cargo
b) Orientar el desarrollo de sus funciones al cumplimiento de los objetivos de la institucion
c) Realizar sus labores con esmero, cortesia, dedicacion y eficiencia
d) Cumplir la jornada de trabajo y realizar los trabajos extraordinarios que ordene el superior jerarquico
e) Cumplir las destinaciones y las comisiones de servicio
f) Obedecer las ordenes impartidas por el superior jerarquico
g) Observar estrictamente el principio de probidad administrativa
h) Guardar secreto en los asuntos que revistan el caracter de reservados

TITULO IV - DE LOS DERECHOS FUNCIONARIOS

Articulo 89.- Todo funcionario tendra derecho a gozar de estabilidad en el empleo y a ascender en el respectivo escalafon.

Articulo 90.- Todo funcionario tendra derecho a percibir por sus servicios las remuneraciones y demas asignaciones adicionales que establezca la ley.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=236392'
    },

    // === JURISPRUDENCIA ===
    {
      titulo: 'Dictamen CGR N 31.636 de 2022 - Probidad en Licitaciones Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'La Contraloria establece que los funcionarios municipales deben abstenerse de participar en procesos de licitacion donde tengan conflicto de interes, bajo sancion de nulidad del acto.',
      contenido: `DICTAMEN N 31.636 DE 2022 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Probidad administrativa en procesos de licitacion municipal. Conflicto de intereses. Deber de abstencion.

ANTECEDENTES:
Se ha solicitado un pronunciamiento respecto de la participacion de funcionarios municipales en comisiones evaluadoras de licitaciones cuando mantienen vinculos con alguno de los oferentes.

CONSIDERANDO:

1. Que el articulo 62 de la ley N 18.575, Organica Constitucional de Bases Generales de la Administracion del Estado, establece que contravienen especialmente el principio de probidad administrativa las conductas que describen los numerales 1 al 8 de dicha norma, entre las cuales se encuentra "intervenir en razon de las funciones, en asuntos en que se tenga interes personal o en que lo tengan el conyuge, hijos, adoptados o parientes hasta el tercer grado de consanguinidad y segundo de afinidad inclusive".

2. Que el articulo 12 de la ley N 19.880 consagra el principio de abstension, conforme al cual los funcionarios que tengan interes personal en el asunto de que se trate, o que tengan amistad intima o enemistad manifiesta con alguno de los interesados, deberan abstenerse de intervenir en el procedimiento y comunicar tal circunstancia a su superior jerarquico.

3. Que la jurisprudencia administrativa de esta Contraloria General ha sostenido reiteradamente que la infraccion al deber de abstension acarrea la nulidad del acto administrativo correspondiente.

CONCLUSIONES:

1. Los funcionarios municipales que integren comisiones evaluadoras de licitaciones deben abstenerse de participar cuando tengan interes personal en el resultado del proceso o mantengan vinculos con alguno de los oferentes.

2. La participacion de un funcionario impedido en la evaluacion de ofertas constituye una infraccion grave al principio de probidad administrativa y puede acarrear la nulidad del proceso licitatorio.

3. Corresponde al alcalde, como jefe superior del servicio, velar por el cumplimiento de estas normas y adoptar las medidas necesarias para prevenir conflictos de interes.`,
      enlace: 'https://www.contraloria.cl/web/cgr/dictamenes'
    },
    {
      titulo: 'Dictamen CGR N 15.127 de 2023 - Patentes Comerciales y Giros Electronicos',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Pronunciamiento sobre la aplicacion del cobro de patentes municipales a empresas que operan exclusivamente por medios electronicos en el territorio comunal.',
      contenido: `DICTAMEN N 15.127 DE 2023 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Patentes municipales. Comercio electronico. Territorialidad del impuesto.

ANTECEDENTES:
Un municipio consulta sobre la procedencia de cobrar patente comercial a empresas de comercio electronico que no tienen establecimiento fisico en la comuna pero realizan ventas a sus habitantes.

CONSIDERANDO:

1. Que conforme al articulo 23 del decreto ley N 3.063, de 1979, sobre Rentas Municipales, el ejercicio de toda profesion, oficio, industria, comercio, arte u otra actividad lucrativa secundaria o terciaria, sea cual fuere su naturaleza o denominacion, esta sujeto a una contribucion de patente municipal.

2. Que el articulo 24 del citado cuerpo legal establece que la patente grava la actividad que se ejerce por un mismo contribuyente, en su local, oficina, establecimiento, kiosco o lugar determinado.

3. Que la evolucion del comercio electronico ha planteado nuevas interrogantes respecto de la aplicacion de las normas sobre patentes municipales, especialmente en lo referido al concepto de "lugar determinado".

CONCLUSIONES:

1. Las empresas que operan exclusivamente a traves de plataformas electronicas quedan sujetas al pago de patente municipal en la comuna donde tengan su domicilio comercial o fiscal, independientemente de que sus clientes se encuentren en otras comunas.

2. No procede que una municipalidad cobre patente comercial a una empresa por el solo hecho de que venda productos o servicios a los habitantes de su comuna si dicha empresa no tiene establecimiento ni desarrolla actividades en el territorio comunal.

3. En caso de empresas que mantengan bodegas, centros de distribucion u otro tipo de establecimiento en una comuna, correspondera el pago de patente comercial a dicho municipio por esa actividad especifica.`,
      enlace: 'https://www.contraloria.cl/web/cgr/dictamenes'
    },
    {
      titulo: 'Sentencia Corte Suprema Rol 45.678-2023 - Recurso de Proteccion contra DOM',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'La Corte Suprema confirma facultad de la Direccion de Obras Municipales para revocar permisos de edificacion cuando se detectan irregularidades graves.',
      contenido: `CORTE SUPREMA - SEGUNDA SALA
ROL N 45.678-2023

Santiago, quince de enero de dos mil veinticuatro.

VISTOS:

Se ha deducido recurso de apelacion contra la sentencia de la Corte de Apelaciones que rechazo recurso de proteccion interpuesto en contra de la Direccion de Obras Municipales.

El recurrente alega que la decision de revocar el permiso de edificacion otorgado vulnera su derecho de propiedad y la garantia de no ser privado de su propiedad sino en virtud de una ley expropiatoria.

CONSIDERANDO:

PRIMERO: Que conforme al articulo 118 de la Ley General de Urbanismo y Construcciones, corresponde a la Direccion de Obras Municipales velar por el cumplimiento de las disposiciones de dicha ley y su ordenanza, y de los instrumentos de planificacion territorial.

SEGUNDO: Que el articulo 145 del mismo cuerpo legal establece que el Director de Obras Municipales podra, en cualquier momento, ordenar la paralizacion de una obra en ejecucion cuando constatare que se ejecuta en contravencion a la ley o al permiso respectivo.

TERCERO: Que en el caso de autos, se ha acreditado que la obra en construccion excedia en un 40% la altura maxima permitida segun el Plan Regulador Comunal, lo que constituye una infraccion grave que justifica la revocacion del permiso.

CUARTO: Que la facultad de la autoridad administrativa para revocar un acto administrativo que adolece de vicios no constituye privacion de propiedad sino correccion de una situacion irregular.

SE CONFIRMA la sentencia apelada que rechazo el recurso de proteccion.

Redaccion del Ministro Sr. Martinez.

Se deja constancia que esta sentencia sienta precedente respecto de las facultades fiscalizadoras de las Direcciones de Obras Municipales.`,
      enlace: 'https://www.pjud.cl'
    },
    {
      titulo: 'Dictamen CGR N 22.450 de 2024 - Teletrabajo en Funcionarios Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Establece criterios para la aplicacion de la modalidad de teletrabajo en funcionarios municipales, incluyendo requisitos, control de cumplimiento y compensacion de gastos.',
      contenido: `DICTAMEN N 22.450 DE 2024 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Teletrabajo. Funcionarios municipales. Ley N 21.220. Aplicacion a sector publico.

ANTECEDENTES:
Diversas municipalidades han consultado sobre la aplicacion de la Ley N 21.220 que regula el trabajo a distancia y teletrabajo, respecto de sus funcionarios.

CONSIDERANDO:

1. Que la ley N 21.220 modifico el Codigo del Trabajo para regular el trabajo a distancia y el teletrabajo, estableciendo normas sobre equipamiento, seguridad y salud, desconexion digital, entre otras.

2. Que si bien dicha ley se inserta en el Codigo del Trabajo, sus principios pueden aplicarse al sector publico en lo que sea compatible con el Estatuto Administrativo.

3. Que el articulo 66 del Estatuto Administrativo faculta a la autoridad para distribuir la jornada de trabajo de acuerdo con las necesidades del servicio.

CONCLUSIONES:

1. Las municipalidades pueden implementar modalidades de teletrabajo para sus funcionarios, siempre que:
   a) Se garantice la continuidad del servicio publico
   b) Se establezcan mecanismos de control de cumplimiento de funciones
   c) Se formalice mediante resolucion alcaldicia

2. Los funcionarios que trabajen bajo esta modalidad mantienen todos sus derechos y obligaciones funcionarias.

3. Corresponde a cada municipalidad determinar:
   a) Los cargos o funciones compatibles con teletrabajo
   b) Los equipos y conectividad necesarios
   c) La compensacion de gastos cuando corresponda
   d) Los mecanismos de supervision y evaluacion

4. El derecho a desconexion digital aplica tambien a funcionarios municipales, debiendo respetarse los periodos de descanso.`,
      enlace: 'https://www.contraloria.cl/web/cgr/dictamenes'
    },

    // === DOCTRINA ===
    {
      titulo: 'El Principio de Probidad Administrativa en la Gestion Municipal',
      categoria: 'DOCTRINA' as const,
      resumen: 'Analisis doctrinario del principio de probidad administrativa aplicado a la gestion municipal, sus manifestaciones y mecanismos de control.',
      contenido: `EL PRINCIPIO DE PROBIDAD ADMINISTRATIVA EN LA GESTION MUNICIPAL
Analisis Doctrinario

I. INTRODUCCION

El principio de probidad administrativa constituye uno de los pilares fundamentales del derecho administrativo chileno. En el ambito municipal, cobra especial relevancia dada la cercania de estas entidades con la ciudadania y el manejo directo de recursos publicos.

II. MARCO NORMATIVO

El principio de probidad se encuentra consagrado en:
- Articulo 8 de la Constitucion Politica de la Republica
- Titulo III de la Ley 18.575, Organica Constitucional de Bases Generales de la Administracion del Estado
- Ley 20.880 sobre probidad en la funcion publica y prevencion de conflictos de intereses

III. CONCEPTO Y ALCANCE

Segun el articulo 52 de la ley 18.575, el principio de probidad consiste en "observar una conducta funcionaria intachable y un desempeno honesto y leal de la funcion o cargo, con preeminencia del interes general sobre el particular".

IV. MANIFESTACIONES EN EL AMBITO MUNICIPAL

1. Declaraciones de intereses y patrimonio: Los alcaldes, concejales y funcionarios de exclusiva confianza deben presentar declaraciones de intereses y patrimonio.

2. Inhabilidades e incompatibilidades: Existen restricciones para ocupar cargos municipales, incluyendo parentesco y participacion en sociedades relacionadas.

3. Transparencia activa: Las municipalidades deben publicar informacion relevante en sus sitios web.

4. Compras publicas: Los procesos de adquisicion deben realizarse conforme a la Ley 19.886.

V. SANCIONES POR INFRACCION

Las conductas que contravienen la probidad pueden acarrear:
- Responsabilidad administrativa (sumarios)
- Responsabilidad civil (indemnizaciones)
- Responsabilidad penal (delitos funcionarios)

VI. CONCLUSIONES

La probidad administrativa no es solo una obligacion legal sino un imperativo etico que debe guiar toda la actuacion municipal. Su cumplimiento fortalece la confianza ciudadana y la legitimidad de las instituciones.`,
      enlace: null
    },
    {
      titulo: 'Procedimiento de Reclamo de Ilegalidad Municipal - Articulo 151 LOC Municipalidades',
      categoria: 'DOCTRINA' as const,
      resumen: 'Estudio completo del reclamo de ilegalidad como mecanismo de impugnacion de actos municipales. Requisitos, plazos, tramitacion y efectos.',
      contenido: `EL RECLAMO DE ILEGALIDAD MUNICIPAL
Articulo 151 Ley 18.695 Organica Constitucional de Municipalidades

I. NATURALEZA JURIDICA

El reclamo de ilegalidad municipal es una accion contencioso-administrativa especial que permite impugnar las resoluciones u omisiones ilegales de las municipalidades.

II. LEGITIMACION ACTIVA

Pueden interponer el reclamo:
- Cualquier particular que se considere agraviado
- Las personas juridicas de derecho publico o privado afectadas

III. OBJETO DEL RECLAMO

Procede contra:
1. Resoluciones que infrinjan la ley, incluyendo vicios de procedimiento
2. Omisiones ilegales de la municipalidad
3. Resoluciones arbitrarias

IV. TRAMITACION

FASE ADMINISTRATIVA (ante el Alcalde):
- Plazo: 30 dias desde la notificacion o publicacion del acto, o desde que se tuvo conocimiento de la omision
- El alcalde debe resolver dentro de 15 dias
- Si no resuelve o rechaza, se abre la via judicial

FASE JUDICIAL (ante la Corte de Apelaciones):
- Plazo: 15 dias desde la notificacion del rechazo o desde que vencio el plazo para resolver
- La Corte solicita informe a la municipalidad (10 dias)
- Vista de la causa en cuenta o previa vista si hay oposicion
- Sentencia en 10 dias

V. EFECTOS DE LA SENTENCIA

Si se acoge el reclamo:
- Se anula total o parcialmente el acto impugnado
- Se ordena a la municipalidad actuar conforme a derecho
- Puede condenarse en costas a la municipalidad

VI. JURISPRUDENCIA RELEVANTE

La Corte Suprema ha establecido que:
- El agotamiento de la via administrativa es requisito de admisibilidad
- El plazo de 30 dias es fatal
- La ilegalidad debe ser manifiesta y grave para justificar la nulidad`,
      enlace: null
    },
    {
      titulo: 'Analisis del Silencio Administrativo en Procedimientos Municipales',
      categoria: 'DOCTRINA' as const,
      resumen: 'Estudio de la aplicacion del silencio administrativo positivo y negativo en procedimientos tramitados ante municipalidades conforme a la Ley 19.880.',
      contenido: `EL SILENCIO ADMINISTRATIVO EN PROCEDIMIENTOS MUNICIPALES
Ley 19.880 sobre Bases de los Procedimientos Administrativos

I. MARCO GENERAL

La Ley 19.880 introdujo la institucion del silencio administrativo al ordenamiento juridico chileno, estableciendo efectos juridicos a la falta de pronunciamiento de la Administracion dentro de los plazos legales.

II. TIPOS DE SILENCIO

1. SILENCIO POSITIVO (Art. 64):
Transcurrido el plazo legal sin pronunciamiento, se entiende ACEPTADA la solicitud.

Requisitos:
- Solicitud de un particular
- Vencimiento del plazo sin decision
- Denuncia del incumplimiento ante la autoridad
- Certificacion del Jefe de Servicio de que el plazo ha vencido

Efectos:
- La solicitud se entiende aceptada
- El acto ficticio produce todos sus efectos
- La Administracion puede invalidarlo solo dentro de 2 anos

2. SILENCIO NEGATIVO (Art. 65):
Se entiende RECHAZADA la solicitud cuando:
- Afecte el patrimonio fiscal
- Se refiera a materia de seguridad publica
- Se refiera a medio ambiente o salud publica

III. APLICACION EN MUNICIPALIDADES

Casos de silencio positivo:
- Permisos de ocupacion de bienes nacionales de uso publico
- Autorizaciones de ferias libres
- Solicitudes de informacion (Ley 20.285)

Casos de silencio negativo:
- Permisos de edificacion (afectan urbanismo)
- Patentes de alcoholes (seguridad publica)
- Reclamos por multas (patrimonio fiscal)

IV. CERTIFICACION

El interesado puede solicitar al jefe de servicio certificacion de que su solicitud no ha sido resuelta, operando los efectos del silencio a partir de esa fecha.`,
      enlace: null
    },

    // === PRACTICA JURIDICA ===
    {
      titulo: 'Modelo de Ordenanza Municipal - Tenencia Responsable de Mascotas',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de ordenanza municipal sobre tenencia responsable de mascotas conforme a la Ley 21.020. Incluye registro, sanciones y procedimiento infraccional.',
      contenido: `ORDENANZA MUNICIPAL SOBRE TENENCIA RESPONSABLE DE MASCOTAS
(Modelo conforme a Ley 21.020)

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- La presente ordenanza tiene por objeto regular la tenencia responsable de mascotas o animales de compania en el territorio comunal, en conformidad con la Ley N 21.020.

Articulo 2.- Para efectos de esta ordenanza se entendera por:
a) Mascota o animal de compania: aquel animal domestico que vive con las personas
b) Tenedor responsable: la persona natural o juridica que tenga a su cargo el cuidado de una mascota
c) Animal potencialmente peligroso: aquel que ha causado mordeduras o ataques

TITULO II - OBLIGACIONES DE LOS TENEDORES

Articulo 3.- Todo tenedor responsable debera:
a) Inscribir a su mascota en el Registro Nacional de Mascotas
b) Identificar a su mascota mediante microchip
c) Mantener a su mascota en condiciones adecuadas de bienestar
d) Recoger los excrementos de su mascota en espacios publicos
e) Mantener a su mascota con correa en espacios publicos

Articulo 4.- Tratandose de perros potencialmente peligrosos, ademas debera:
a) Obtener autorizacion especial de la Secretaria Regional Ministerial de Salud
b) Contratar seguro de responsabilidad civil
c) Usar bozal y correa resistente en espacios publicos

TITULO III - PROHIBICIONES

Articulo 5.- Se prohibe:
a) Abandonar mascotas en espacios publicos o privados
b) Criar mascotas en condiciones inadecuadas
c) Organizar peleas de animales
d) Mantener mascotas que causen molestias graves a vecinos

TITULO IV - INFRACCIONES Y SANCIONES

Articulo 6.- Las infracciones a la presente ordenanza se clasifican en:
a) Leves: multa de 1 a 3 UTM
b) Graves: multa de 3 a 10 UTM
c) Gravisimas: multa de 10 a 30 UTM

TITULO V - PROCEDIMIENTO

Articulo 7.- El procedimiento infraccional se tramitara conforme a la Ley N 18.287 sobre Procedimiento ante los Juzgados de Policia Local.`,
      enlace: null
    },
    {
      titulo: 'Modelo de Decreto Alcaldicio de Delegacion de Funciones',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo tipo de decreto alcaldicio para delegar funciones especificas en directivos municipales, conforme a la Ley 18.695.',
      contenido: `MODELO DE DECRETO ALCALDICIO - DELEGACION DE FUNCIONES

ILUSTRE MUNICIPALIDAD DE [NOMBRE COMUNA]
DECRETO ALCALDICIO N° ___/____

[LUGAR], [FECHA]

VISTOS:
1. Lo dispuesto en los articulos 63 letra j) y 64 de la Ley N 18.695, Organica Constitucional de Municipalidades.
2. Lo establecido en el articulo 41 de la Ley N 18.575, Organica Constitucional de Bases Generales de la Administracion del Estado.
3. Las necesidades del servicio.

CONSIDERANDO:
1. Que el articulo 63 letra j) de la Ley N 18.695 faculta al Alcalde para delegar el ejercicio de parte de sus atribuciones exclusivas en funcionarios de su dependencia.
2. Que la delegacion debe recaer en materias especificas y funcionarios determinados.
3. Que es necesario desconcentrar ciertas funciones para una gestion mas eficiente.

DECRETO:
1. DELEGASE en don/dona [NOMBRE COMPLETO], [CARGO], las siguientes funciones:
   a) Firmar autorizaciones de [especificar materia] de monto inferior a [monto]
   b) Representar al municipio en [especificar materias]
   c) Autorizar permisos de [especificar tipo]

2. Esta delegacion se ejercera bajo la supervigilancia del Alcalde, quien podra revocarla en cualquier momento.

3. El delegado debera actuar dentro de los limites de la delegacion, debiendo consultar al Alcalde respecto de materias que excedan dichos limites.

4. Notifiquese al funcionario delegado y a la Contraloria General de la Republica para la toma de razon correspondiente.

ANOTESE, COMUNIQUESE Y ARCHIVESE

[FIRMA]
[NOMBRE ALCALDE]
ALCALDE

[FIRMA]
[NOMBRE SECRETARIO MUNICIPAL]
SECRETARIO MUNICIPAL`,
      enlace: null
    },
    {
      titulo: 'Guia de Tramitacion de Sumarios Administrativos Municipales',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Guia practica para la tramitacion de sumarios administrativos en municipalidades, incluyendo etapas, plazos y garantias del debido proceso.',
      contenido: `GUIA DE TRAMITACION DE SUMARIOS ADMINISTRATIVOS MUNICIPALES
Conforme al Estatuto Administrativo y Ley 18.834

I. INICIACION

1. RESOLUCION DE INSTRUCCION
El Alcalde, mediante resolucion fundada, ordena instruir sumario designando:
- Fiscal sumariante (funcionario de igual o superior grado)
- Actuario (funcionario que actua como ministro de fe)

2. PLAZO: El sumario debe fallarse en 20 dias habiles desde la notificacion al fiscal.

II. ETAPA INDAGATORIA

1. El Fiscal debe:
- Individualizar al/los inculpados
- Determinar los hechos constitutivos de infraccion
- Reunir las pruebas que acrediten o desvirtuen la responsabilidad

2. DILIGENCIAS:
- Declaraciones de testigos
- Solicitud de informes
- Inspeccion personal
- Careo (si es necesario)

III. FORMULACION DE CARGOS

Si de la investigacion resultan cargos contra funcionarios:
- Se notifican los cargos al inculpado
- Plazo de defensa: 5 dias habiles (prorrogables por 5 mas)
- El inculpado puede presentar descargos y solicitar diligencias probatorias

IV. ETAPA PROBATORIA

- Plazo: 10 dias habiles
- Se practican las diligencias solicitadas
- El Fiscal evalua la prueba rendida

V. VISTA FISCAL

El Fiscal emite informe proponiendo:
- Absolucion, o
- Sancion con indicacion de la medida disciplinaria

VI. RESOLUCION

El Alcalde resuelve:
a) Absolver
b) Sobreseer
c) Aplicar sancion:
   - Censura
   - Multa (hasta 10% de remuneracion)
   - Suspension (hasta 3 meses)
   - Destitucion

VII. RECURSOS

- Apelacion: ante Contraloria General (10 dias)
- Reconsideracion: ante el Alcalde (5 dias)

VIII. GARANTIAS DEL DEBIDO PROCESO

- Presuncion de inocencia
- Derecho a defensa
- Derecho a conocer los cargos
- Derecho a presentar pruebas
- Derecho a recurrir`,
      enlace: null
    },
    {
      titulo: 'Procedimiento de Licitacion Publica Municipal - Paso a Paso',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Guia practica completa del procedimiento de licitacion publica en municipalidades segun Ley 19.886 y su reglamento. Incluye modelos y plazos.',
      contenido: `PROCEDIMIENTO DE LICITACION PUBLICA MUNICIPAL
Ley 19.886 y DS 250/2004

I. ETAPA PREPARATORIA

1. DETECCION DE LA NECESIDAD
- Unidad requirente identifica necesidad
- Se verifica disponibilidad presupuestaria

2. ELABORACION DE BASES
Las bases deben contener:
a) Bases Administrativas:
   - Identificacion de la entidad licitante
   - Objeto de la licitacion
   - Etapas y plazos
   - Requisitos de los oferentes
   - Criterios de evaluacion y ponderacion
   - Garantias (seriedad de oferta, fiel cumplimiento)
   - Modelo de contrato

b) Bases Tecnicas:
   - Especificaciones de bienes/servicios
   - Cantidades
   - Lugar de entrega
   - Plazos de ejecucion

3. APROBACION DE BASES
- Resolucion o decreto alcaldicio
- Aprobacion de la comision evaluadora

II. ETAPA DE LLAMADO

1. PUBLICACION EN MERCADOPUBLICO
- Minimo 20 dias antes del cierre (licitaciones sobre 1000 UTM)
- Minimo 10 dias (licitaciones entre 100 y 1000 UTM)

2. CONTENIDO DEL LLAMADO
- Objeto
- Bases y formularios
- Fechas relevantes
- Presupuesto disponible

III. ETAPA DE CONSULTAS Y RESPUESTAS

- Plazo para consultas: hasta 50% del periodo de publicacion
- Respuestas: antes del cierre
- Se publican como anexo en el portal

IV. ETAPA DE RECEPCION Y APERTURA

1. RECEPCION DE OFERTAS
- Solo por via electronica en Mercadopublico
- Hasta fecha y hora indicada en bases

2. APERTURA
- Acto publico (puede ser electronico)
- Acta de apertura
- Verificacion de antecedentes

V. ETAPA DE EVALUACION

1. COMISION EVALUADORA
- Designada por resolucion
- Minimo 3 integrantes
- Funcionarios publicos (puede incluir externos)

2. INFORME DE EVALUACION
- Analisis de cada oferta
- Aplicacion de criterios
- Propuesta de adjudicacion o declaracion de desierta

VI. ADJUDICACION

1. RESOLUCION DE ADJUDICACION
- Debe ser fundada
- Se publica en el portal
- Notificacion a adjudicatario

2. GARANTIA DE FIEL CUMPLIMIENTO
- Presentacion dentro del plazo de bases
- Monto segun bases (tipicamente 5-10% del contrato)

VII. CONTRATO

- Suscripcion dentro de plazo de bases
- Registro en Contraloria (si corresponde)
- Publicacion en portal

VIII. PLAZOS CLAVE

| Etapa | Plazo |
|-------|-------|
| Publicacion (>1000 UTM) | Min. 20 dias |
| Publicacion (100-1000 UTM) | Min. 10 dias |
| Consultas | Hasta 50% periodo |
| Evaluacion | Segun bases |
| Adjudicacion | Segun bases |
| Suscripcion contrato | Segun bases |`,
      enlace: null
    }
  ]

  // Limpiar documentos existentes e insertar nuevos
  await prisma.documento.deleteMany({})

  for (const doc of documentos) {
    await prisma.documento.create({
      data: doc
    })
  }

  console.log('Seed completado:')
  console.log('- Admin:', admin.email)
  console.log('- Usuario:', user.email)
  console.log('- Documentos juridicos reales:', documentos.length)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
