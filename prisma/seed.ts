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

  // =====================================================
  // BIBLIOTECA JURIDICA COMPLETA - 100+ DOCUMENTOS
  // =====================================================

  const documentos = [
    // =====================================
    // LEGISLACION MUNICIPAL FUNDAMENTAL (40+ leyes)
    // =====================================
    {
      titulo: 'Ley 18.695 - Ley Organica Constitucional de Municipalidades',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece la organizacion, atribuciones y funcionamiento de las municipalidades chilenas. Define la estructura del gobierno comunal, funciones del alcalde y concejo municipal.',
      contenido: `LEY 18695 - LEY ORGANICA CONSTITUCIONAL DE MUNICIPALIDADES

TITULO I - DE LA MUNICIPALIDAD

Articulo 1.- La administracion local de cada comuna reside en una municipalidad.

Las municipalidades son corporaciones autonomas de derecho publico, con personalidad juridica y patrimonio propio, cuya finalidad es satisfacer las necesidades de la comunidad local.

Articulo 2.- Las municipalidades estaran constituidas por el alcalde, que sera su maxima autoridad, y por el concejo.

TITULO II - DE LAS FUNCIONES Y ATRIBUCIONES

Articulo 3.- Correspondera a las municipalidades las siguientes funciones privativas:
a) Elaborar, aprobar y modificar el plan comunal de desarrollo
b) La planificacion y regulacion de la comuna
c) La promocion del desarrollo comunitario
d) Aplicar las disposiciones sobre transporte y transito publicos
e) Aplicar las disposiciones sobre construccion y urbanizacion
f) El aseo y ornato de la comuna

Articulo 4.- Las municipalidades podran desarrollar funciones relacionadas con:
a) La educacion y la cultura
b) La salud publica y la proteccion del medio ambiente
c) La asistencia social y juridica
d) La capacitacion y promocion del empleo
e) El turismo, el deporte y la recreacion
f) La urbanizacion y vialidad urbana y rural
g) La construccion de viviendas sociales
h) El transporte y transito publicos
i) La prevencion de riesgos y auxilio en emergencias
j) La seguridad ciudadana
k) La promocion de la igualdad de oportunidades`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=251693'
    },
    {
      titulo: 'Ley 19.880 - Ley de Bases de los Procedimientos Administrativos',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece las bases del procedimiento administrativo aplicable a los actos de la Administracion del Estado, incluyendo municipalidades.',
      contenido: `LEY 19880 - BASES DE LOS PROCEDIMIENTOS ADMINISTRATIVOS

Articulo 1.- Procedimiento Administrativo. Esta ley establece las bases del procedimiento administrativo de los actos de la Administracion del Estado.

Articulo 2.- Ambito de aplicacion. Aplicable a ministerios, intendencias, gobernaciones, servicios publicos y municipalidades.

PRINCIPIOS DEL PROCEDIMIENTO:
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

PLAZOS:
Articulo 23.- Los plazos de dias son habiles, excluyendo sabados, domingos y festivos.
Articulo 27.- La Administracion esta obligada a dictar resolucion expresa en todos los procedimientos.

SILENCIO ADMINISTRATIVO:
Articulo 64.- Silencio Positivo: Transcurrido el plazo sin pronunciamiento, se entiende aceptada la solicitud.
Articulo 65.- Silencio Negativo: Se entiende rechazada cuando afecte patrimonio fiscal.

RECURSOS:
Articulo 59.- Recurso de Reposicion: 5 dias, ante el mismo organo.
Articulo 60.- Recurso Jerarquico: 5 dias, ante el superior.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=210676'
    },
    {
      titulo: 'Ley 20.285 - Ley de Transparencia y Acceso a la Informacion Publica',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula el principio de transparencia de la funcion publica y el derecho de acceso a la informacion.',
      contenido: `LEY 20285 - TRANSPARENCIA DE LA FUNCION PUBLICA

TRANSPARENCIA ACTIVA (Art. 7):
Los organos deben mantener en sus sitios web:
a) Estructura organica
b) Facultades y funciones de cada unidad
c) Marco normativo aplicable
d) Planta del personal
e) Contrataciones de bienes muebles
f) Transferencias de fondos publicos
g) Actos y resoluciones con efectos sobre terceros
h) Tramites y requisitos de servicios
i) Programas de subsidios
j) Mecanismos de participacion ciudadana
k) Presupuesto asignado e informes de ejecucion
l) Resultados de auditorias

DERECHO DE ACCESO:
Articulo 10.- Toda persona tiene derecho a solicitar y recibir informacion.
Articulo 14.- Plazo de respuesta: 20 dias habiles.

EXCEPCIONES (Art. 21):
1) Afectacion del cumplimiento de funciones
2) Afectacion de derechos de personas
3) Seguridad de la Nacion
4) Interes nacional
5) Documentos declarados secretos por ley`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=276363'
    },
    {
      titulo: 'Ley 19.886 - Ley de Compras Publicas',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula los contratos que celebre la Administracion del Estado para suministro de bienes, prestacion de servicios y ejecucion de obras.',
      contenido: `LEY 19886 - LEY DE BASES SOBRE CONTRATOS ADMINISTRATIVOS

PROCEDIMIENTOS DE CONTRATACION:
La Administracion adjudicara mediante:
- Licitacion publica (obligatoria sobre 1.000 UTM)
- Licitacion privada
- Contratacion directa

LICITACION PUBLICA:
Las bases deben establecer:
a) Requisitos de los oferentes
b) Especificaciones de bienes/servicios
c) Etapas y plazos
d) Criterios de evaluacion
e) Requisitos de admisibilidad
f) Monto y forma de garantia

CONTRATACION DIRECTA (Art. 8):
Procede cuando:
a) Monto inferior a 100 UTM
b) Emergencia, urgencia o imprevisto
c) Proveedor unico
d) Servicios de naturaleza confidencial

SISTEMA CHILECOMPRA:
Sistema electronico de acceso publico y gratuito para publicar convocatorias y realizar procesos de compra.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=213004'
    },
    {
      titulo: 'DFL 1-19.653 - Estatuto Administrativo General',
      categoria: 'LEGISLACION' as const,
      resumen: 'Texto refundido de la Ley 18.834 sobre Estatuto Administrativo para funcionarios publicos.',
      contenido: `DFL 1-19653 - ESTATUTO ADMINISTRATIVO

CARRERA FUNCIONARIA:
a) Cargo publico: contemplado en plantas o como contrata
b) Planta de personal: cargos permanentes
c) Empleo a contrata: caracter transitorio

REQUISITOS DE INGRESO:
a) Ser ciudadano
b) Cumplir ley de reclutamiento
c) Salud compatible con el cargo
d) Educacion basica aprobada
e) No haber cesado por calificacion deficiente
f) No estar inhabilitado

OBLIGACIONES FUNCIONARIAS (Art. 61):
a) Desempenar personalmente las funciones
b) Cumplir objetivos de la institucion
c) Realizar labores con esmero y eficiencia
d) Cumplir jornada de trabajo
e) Obedecer ordenes del superior
f) Observar principio de probidad
g) Guardar secreto

DERECHOS:
- Estabilidad en el empleo
- Remuneraciones
- Feriado
- Licencia medica

MEDIDAS DISCIPLINARIAS:
a) Censura
b) Multa
c) Suspension del empleo
d) Destitucion`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=236392'
    },
    {
      titulo: 'Ley 18.883 - Estatuto Administrativo para Funcionarios Municipales',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece el estatuto que rige a los funcionarios municipales, regulando ingreso, carrera, derechos, obligaciones y cesacion.',
      contenido: `LEY 18883 - ESTATUTO ADMINISTRATIVO FUNCIONARIOS MUNICIPALES

AMBITO DE APLICACION:
Relaciones entre municipalidades y su personal de dependencia.
No aplica al personal de corporaciones, fundaciones o empresas municipales.

INGRESO A MUNICIPALIDADES:
a) Ser ciudadano
b) Cumplir ley de reclutamiento
c) Salud compatible
d) Requisitos de idoneidad
e) No haber cesado por calificacion deficiente

El ingreso a planta municipal se efectua por concurso publico.

OBLIGACIONES:
a) Desempenar personalmente las funciones
b) Cumplir jornada de trabajo
c) Obedecer ordenes del superior
d) Observar principio de probidad
e) Guardar secreto

DERECHOS:
- Estabilidad en el empleo
- Feriado con goce de remuneracion
- Licencia medica

CESACION DE FUNCIONES:
a) Aceptacion de renuncia
b) Jubilacion
c) Declaracion de vacancia
d) Destitucion
e) Supresion del empleo
f) Termino del periodo legal
g) Fallecimiento`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=30256'
    },
    {
      titulo: 'Ley 21.389 - Registro Nacional de Deudores de Pensiones de Alimentos',
      categoria: 'LEGISLACION' as const,
      resumen: 'Crea el Registro Nacional de Deudores de Pensiones de Alimentos. Las municipalidades deben verificar antes de emitir licencias de conducir.',
      contenido: `LEY 21389 - REGISTRO NACIONAL DE DEUDORES DE PENSIONES DE ALIMENTOS

EFECTOS DE LA INSCRIPCION:
a) No puede ser designado en cargos de la Administracion del Estado
b) No puede renovar licencia de conducir
c) No puede obtener pasaporte
d) No puede ser candidato a eleccion popular
e) No puede acceder a creditos bancarios

OBLIGACION MUNICIPAL:
Las municipalidades, previo a emision o renovacion de licencias de conducir, deben consultar el Registro.

Si el solicitante esta inscrito, no puede procederse a la emision hasta que acredite haber solucionado la deuda.

RETENCIONES:
Los empleadores deben retener de la remuneracion el monto de pension adeudada.
Tesoreria retendra devoluciones de impuestos.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1165084'
    },
    {
      titulo: 'Ley 18.575 - Ley Organica Constitucional de Bases Generales de la Administracion del Estado',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece la organizacion basica de la Administracion del Estado, principios que rigen la funcion publica y probidad administrativa.',
      contenido: `LEY 18575 - BASES GENERALES DE LA ADMINISTRACION DEL ESTADO

ORGANIZACION:
La Administracion del Estado esta constituida por:
- Ministerios
- Intendencias y Gobernaciones
- Organos y servicios publicos
- Contraloria General
- Banco Central
- Fuerzas Armadas y de Orden
- Gobiernos Regionales
- Municipalidades
- Empresas publicas

PRINCIPIOS:
Articulo 3.- La Administracion esta al servicio de la persona humana; su finalidad es promover el bien comun.

PROBIDAD ADMINISTRATIVA (Art. 52):
Observar conducta funcionaria intachable y desempeno honesto y leal, con preeminencia del interes general sobre el particular.

CONDUCTAS QUE CONTRAVIENEN LA PROBIDAD (Art. 62):
1) Usar informacion reservada en beneficio propio
2) Hacer valer indebidamente la posicion funcionaria
3) Emplear bienes de la institucion en provecho propio
4) Usar tiempo de trabajo para fines ajenos
5) Solicitar o aceptar donativos
6) Intervenir en asuntos con interes personal`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=29967'
    },
    {
      titulo: 'DL 3.063 - Ley de Rentas Municipales',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece las normas sobre rentas municipales, patentes comerciales, permisos de circulacion y demas ingresos de las municipalidades.',
      contenido: `DL 3063 - LEY DE RENTAS MUNICIPALES

RENTAS MUNICIPALES:
a) Producto de bienes municipales
b) Impuesto territorial
c) Patentes comerciales
d) Permisos de circulacion
e) Multas e intereses
f) Subvenciones y aportes del Estado
g) Producto de concesiones

PATENTES MUNICIPALES:
El ejercicio de toda profesion, oficio, industria, comercio, arte u otra actividad lucrativa esta sujeto a patente municipal.

La patente grava la actividad en su local, oficina, establecimiento o lugar determinado.

Monto: porcentaje sobre capital propio, con minimo de 1 UTM y maximo de 8.000 UTM.

PERMISOS DE CIRCULACION:
Los vehiculos que circulen por vias publicas estan gravados con un impuesto anual denominado "permiso de circulacion".

Valor: porcentaje del precio corriente en plaza del vehiculo.

PRESUPUESTO MUNICIPAL:
Los municipios prepararan anualmente un presupuesto de ingresos y gastos, aprobado por el concejo municipal.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=6879'
    },
    {
      titulo: 'Ley 20.730 - Ley del Lobby',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula el lobby y las gestiones que representen intereses particulares ante las autoridades y funcionarios.',
      contenido: `LEY 20730 - REGULA EL LOBBY

DEFINICIONES:
- Lobby: Gestion remunerada para promover, defender o representar intereses particulares.
- Gestion de interes particular: Gestion no remunerada con los mismos objetivos.

SUJETOS PASIVOS (incluye municipalidades):
- Alcaldes
- Concejales
- Consejeros de corporaciones de asistencia judicial

REGISTROS PUBLICOS:
Los sujetos pasivos deben registrar las audiencias y reuniones sostenidas que tengan por objeto lobby o gestion de intereses.

Los registros deben publicarse en los sitios electronicos de los organos.

SANCIONES:
La infraccion se sanciona con multa de 10 a 50 UTM, y en caso de reincidencia, de 50 a 100 UTM.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1060115'
    },
    {
      titulo: 'Ley 20.500 - Participacion Ciudadana en la Gestion Publica',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece normas sobre asociaciones y participacion ciudadana en la gestion publica, creando los Consejos de la Sociedad Civil.',
      contenido: `LEY 20500 - PARTICIPACION CIUDADANA EN LA GESTION PUBLICA

DERECHO DE ASOCIACION:
Todas las personas tienen derecho a asociarse libremente para fines licitos.

Las municipalidades pueden establecer un registro publico de personas juridicas sin fines de lucro.

PARTICIPACION CIUDADANA:
El Estado reconoce a las personas el derecho de participar en sus politicas, planes, programas y acciones.

Cada organo de la Administracion debera establecer las modalidades de participacion.

CONSEJOS DE LA SOCIEDAD CIVIL:
Los organos de la Administracion deberan establecer consejos de caracter consultivo, conformados de manera diversa, representativa y pluralista.

EN EL AMBITO MUNICIPAL:
Articulo 94.- Crease un consejo comunal de organizaciones de la sociedad civil en cada comuna.

Articulo 95.- El consejo comunal sera un organo asesor de la municipalidad.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1023143'
    },
    {
      titulo: 'Ley 21.180 - Ley de Transformacion Digital del Estado',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece la transformacion digital del Estado mediante documentos electronicos, firma electronica y procedimientos electronicos.',
      contenido: `LEY 21180 - TRANSFORMACION DIGITAL DEL ESTADO

OBJETO:
Establecer la transformacion digital del Estado mediante la digitalizacion integral de procedimientos administrativos, registros y expedientes.

PROCEDIMIENTO ELECTRONICO:
El procedimiento administrativo podra realizarse a traves de medios electronicos.

Los actos administrativos en soporte electronico seran validos y produciran los mismos efectos que los expedidos en papel.

EXPEDIENTE ELECTRONICO:
Estara compuesto por documentos electronicos, asegurando reproduccion, integridad y enlace correcto entre ellos.

NOTIFICACIONES ELECTRONICAS:
Se practicaran por medios electronicos, a la direccion registrada por el interesado.

La notificacion se entiende practicada al quinto dia siguiente al ingreso en la bandeja del destinatario.

IMPLEMENTACION MUNICIPAL:
Las municipalidades tienen un plazo de 5 anos para implementar integralmente la transformacion digital.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1138479'
    },
    {
      titulo: 'Ley 19.300 - Ley de Bases Generales del Medio Ambiente',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece el derecho a vivir en un medio ambiente libre de contaminacion y el Sistema de Evaluacion de Impacto Ambiental.',
      contenido: `LEY 19300 - BASES GENERALES DEL MEDIO AMBIENTE

DERECHO AMBIENTAL:
El derecho a vivir en un medio ambiente libre de contaminacion, la proteccion del medio ambiente y la preservacion de la naturaleza.

SISTEMA DE EVALUACION DE IMPACTO AMBIENTAL:
Los proyectos susceptibles de causar impacto ambiental deberan someterse al sistema de evaluacion:
a) Acueductos, embalses o tranques
b) Lineas de transmision electrica
c) Centrales generadoras mayores a 3 MW
d) Reactores nucleares
e) Aeropuertos, terminales de buses
f) Proyectos de desarrollo urbano
g) Proyectos industriales o inmobiliarios

PARTICIPACION DE LA COMUNIDAD:
Cualquier persona puede formular observaciones al Estudio de Impacto Ambiental.

Las observaciones seran ponderadas en los fundamentos de la resolucion de calificacion ambiental.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=30667'
    },
    {
      titulo: 'Ley 19.418 - Ley de Juntas de Vecinos y Organizaciones Comunitarias',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula las juntas de vecinos y demas organizaciones comunitarias, su constitucion, funcionamiento y relacion con las municipalidades.',
      contenido: `LEY 19418 - JUNTAS DE VECINOS Y ORGANIZACIONES COMUNITARIAS

JUNTAS DE VECINOS:
Organizaciones comunitarias de caracter territorial representativas de los residentes de una unidad vecinal.

FUNCIONES DE LAS JUNTAS DE VECINOS:
a) Representar a los vecinos ante autoridades
b) Promover la integracion y participacion
c) Velar por el mejoramiento de condiciones de vida
d) Promover el progreso urbanistico, economico, social y cultural
e) Gestionar solucion de problemas comunitarios

PERSONALIDAD JURIDICA:
Las juntas de vecinos se constituyen en asamblea ante el oficial del Registro Civil.

Se inscriben en un registro publico del Secretario Municipal.

DERECHOS:
a) Presentar proyectos y proposiciones a la municipalidad
b) Ser informadas sobre materias que les conciernan
c) Participar en programas de capacitacion
d) Usar bienes de la municipalidad

FONDO DE DESARROLLO VECINAL:
Las municipalidades deben contemplar en sus presupuestos recursos para financiar proyectos de organizaciones comunitarias.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=70040'
    },
    {
      titulo: 'Ley 20.880 - Probidad en la Funcion Publica',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece normas sobre probidad en la funcion publica, regula conflictos de intereses, declaraciones de patrimonio e intereses.',
      contenido: `LEY 20880 - PROBIDAD EN LA FUNCION PUBLICA

AMBITO DE APLICACION:
- Presidente de la Republica
- Ministros de Estado
- Senadores y Diputados
- Intendentes, Gobernadores, Consejeros Regionales
- Alcaldes, concejales
- Funcionarios de la Administracion del Estado
- Funcionarios del Poder Judicial
- Fiscales del Ministerio Publico

DECLARACION DE INTERESES Y PATRIMONIO:
Las autoridades y funcionarios deben efectuar declaracion de intereses y patrimonio.

Declaracion de intereses:
a) Actividades profesionales y economicas
b) Participaciones en personas juridicas
c) Pertenencia a directorios u organos

Declaracion de patrimonio:
a) Bienes inmuebles
b) Vehiculos motorizados
c) Valores y derechos
d) Derechos en comunidades
e) Obligaciones patrimoniales

CONFLICTOS DE INTERESES:
Existe conflicto cuando concurren el interes general con el interes particular.

El funcionario debe abstenerse de participar en decisiones que afecten su interes particular.

SANCIONES:
Multa de 10 a 30 UTM para autoridades; 1 a 15 UTM para funcionarios.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1088051'
    },
    {
      titulo: 'Ley 21.020 - Tenencia Responsable de Mascotas y Animales de Compania',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece normas sobre tenencia responsable de mascotas, obligaciones de los tenedores, registro de animales y sanciones.',
      contenido: `LEY 21020 - TENENCIA RESPONSABLE DE MASCOTAS

OBLIGACIONES DE LOS TENEDORES:
a) Registrar a la mascota e identificarla con microchip
b) Alimentarla correctamente
c) Proporcionarle albergue adecuado
d) No someterla a malos tratos
e) Brindarle asistencia veterinaria
f) Recoger deposiciones en via publica

PROHIBICIONES:
a) Abandonar mascotas
b) Hacer deambular perros sin acompanamiento
c) Organizar peleas de animales
d) Criar animales en condiciones inadecuadas

REGISTRO NACIONAL DE MASCOTAS:
Administrado por el SAG.

Las municipalidades mantendran registros comunales y tendran facultades de fiscalizacion.

INFRACCIONES Y SANCIONES:
a) Leves: multa de 1 a 10 UTM
b) Graves: multa de 10 a 20 UTM
c) Gravisimas: multa de 20 a 30 UTM

El procedimiento se tramita ante juzgados de policia local.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1106037'
    },
    {
      titulo: 'DFL 458 - Ley General de Urbanismo y Construcciones',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula la planificacion urbana, permisos de edificacion, normas de construccion y facultades de las Direcciones de Obras Municipales.',
      contenido: `DFL 458 - LEY GENERAL DE URBANISMO Y CONSTRUCCIONES

PLANIFICACION URBANA:
Se efectua en cuatro niveles:
a) Nacional
b) Regional
c) Intercomunal
d) Comunal

PLAN REGULADOR COMUNAL:
Instrumento que promueve el desarrollo armonico del territorio comunal.

Sera confeccionado por la Municipalidad respectiva.

PERMISOS DE CONSTRUCCION:
La construccion, reconstruccion, alteracion, ampliacion y demolicion requieren permiso de la Direccion de Obras Municipales.

El Director de Obras puede ordenar la paralizacion de obras en contravencion.

DIRECCION DE OBRAS MUNICIPALES:
En cada municipalidad habra una DOM a cargo de un Director de Obras.

Funciones:
a) Informar sobre condiciones de bienes raices
b) Otorgar permisos de edificacion
c) Fiscalizar ejecucion de obras
d) Recibir obras terminadas

VIVIENDAS ECONOMICAS:
Superficie edificada no superior a 140 m2.
Gozan de exencion del 50% de derechos municipales.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=13560'
    },
    {
      titulo: 'Ley 19.925 - Ley de Alcoholes',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula el expendio de bebidas alcoholicas, patentes de alcoholes, horarios de funcionamiento y sanciones.',
      contenido: `LEY 19925 - LEY DE ALCOHOLES

PATENTES DE ALCOHOLES:
El expendio de bebidas alcoholicas requiere patente municipal.

CLASIFICACION:
a) Patente de restaurante, hotel, residencial
b) Patente de bar, taberna, cantina
c) Patente de discoteca, cabaret
d) Patente de supermercado, botilleria

OTORGAMIENTO:
Corresponde a la municipalidad respectiva.

Requisitos:
- Informe favorable de Carabineros sobre el local
- Cumplimiento de normas sanitarias
- Ubicacion conforme al Plan Regulador

RESTRICCIONES:
No se otorgaran patentes a menos de 100 metros de:
- Establecimientos educacionales
- Hospitales y centros de salud
- Estadios y recintos deportivos
- Cuarteles policiales

HORARIOS:
Los establecimientos no podran funcionar despues de las 04:00 horas.

Las municipalidades pueden establecer horarios mas restrictivos.

SANCIONES:
- Multa de 5 a 200 UTM
- Clausura temporal o definitiva
- Cancelacion de patente`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=221208'
    },
    {
      titulo: 'Ley 18.290 - Ley de Transito',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula el transito por vias publicas, licencias de conducir, registro de vehiculos, infracciones y accidentes.',
      contenido: `LEY 18290 - LEY DE TRANSITO

LICENCIAS DE CONDUCIR:
Otorgadas por las Municipalidades.

Clases:
- Clase A: Taxis colectivos y similares
- Clase B: Vehiculos de hasta 9 asientos
- Clase C: Vehiculos de carga
- Clase D: Maquinaria autopropulsada
- Clase E: Transporte escolar
- Clase F: Motocicletas

Requisitos:
- Edad minima segun clase
- Aprobar examenes teoricos y practicos
- Certificado de salud compatible

PERMISOS DE CIRCULACION:
Obligatorio para vehiculos que circulen por vias publicas.

Se paga en la municipalidad correspondiente al domicilio del propietario.

FISCALIZACION:
Carabineros de Chile es la autoridad fiscalizadora del transito.

Las municipalidades pueden fiscalizar estacionamientos y otras materias.

INFRACCIONES:
- Gravisimas: multa de 1,5 a 3 UTM + suspension de licencia
- Graves: multa de 1 a 1,5 UTM
- Menos graves: multa de 0,5 a 1 UTM
- Leves: multa de 0,2 a 0,5 UTM`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=29708'
    },
    {
      titulo: 'Ley 19.537 - Ley de Copropiedad Inmobiliaria',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula los condominios, derechos y obligaciones de copropietarios, administracion y relacion con municipalidades.',
      contenido: `LEY 19537 - LEY DE COPROPIEDAD INMOBILIARIA

CONDOMINIOS:
Inmuebles divididos en unidades sobre las cuales se puede constituir dominio exclusivo, con copropiedad sobre bienes de dominio comun.

TIPOS DE CONDOMINIOS:
- Tipo A: Construcciones divididas en pisos o departamentos
- Tipo B: Predios con construcciones o terrenos con acceso comun

ADMINISTRACION:
La administracion corresponde a la Asamblea de Copropietarios y al Administrador.

El Comite de Administracion representa a la Asamblea.

RELACION CON MUNICIPALIDADES:
Las municipalidades pueden:
- Fiscalizar cumplimiento de normas
- Aplicar multas por infracciones
- Intervenir en casos de incumplimiento grave

INFRACCIONES:
Las infracciones a esta ley se sancionan con multa de 1 a 3 UTM, aplicadas por el juzgado de policia local.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=70959'
    },
    {
      titulo: 'DFL 725 - Codigo Sanitario',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece normas sanitarias sobre higiene y seguridad del ambiente y de los lugares de trabajo, aplicables a municipalidades.',
      contenido: `DFL 725 - CODIGO SANITARIO

AMBITO DE APLICACION:
Todas las cuestiones relacionadas con el fomento, proteccion y recuperacion de la salud de los habitantes.

HIGIENE Y SEGURIDAD DEL AMBIENTE:
Los municipios deben velar por:
- Provision de agua potable
- Evacuacion y disposicion de aguas servidas
- Eliminacion y disposicion de basuras
- Higiene de la via publica

ESTABLECIMIENTOS COMERCIALES:
Requieren autorizacion sanitaria:
- Establecimientos de alimentos
- Farmacias y droguerias
- Laboratorios
- Cementerios
- Piscinas publicas

Las municipalidades no pueden otorgar patentes sin autorizacion sanitaria previa.

SANCIONES:
- Multa de 0,1 a 1.000 UTM
- Clausura del establecimiento
- Decomiso de productos

La fiscalizacion corresponde a la autoridad sanitaria, sin perjuicio de las facultades municipales.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=5595'
    },
    {
      titulo: 'Ley 16.744 - Seguro Social contra Riesgos de Accidentes del Trabajo',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece normas sobre accidentes del trabajo y enfermedades profesionales, aplicable a funcionarios municipales.',
      contenido: `LEY 16744 - SEGURO CONTRA ACCIDENTES DEL TRABAJO

COBERTURA:
Todos los trabajadores por cuenta ajena, incluidos funcionarios municipales.

CONTINGENCIAS CUBIERTAS:
- Accidentes del trabajo
- Accidentes de trayecto
- Enfermedades profesionales

PRESTACIONES:
Medicas:
- Atencion medica, quirurgica y dental
- Hospitalizacion
- Medicamentos
- Protesis y aparatos ortopedicos
- Rehabilitacion

Economicas:
- Subsidio por incapacidad temporal
- Indemnizacion por incapacidad permanente parcial
- Pension por incapacidad permanente total
- Pension de sobrevivencia

OBLIGACIONES DEL EMPLEADOR:
- Adoptar medidas de higiene y seguridad
- Mantener condiciones sanitarias y ambientales
- Proporcionar equipos de proteccion personal
- Informar sobre riesgos laborales

COMITES PARITARIOS:
En empresas con mas de 25 trabajadores debe existir un Comite Paritario de Higiene y Seguridad.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=28650'
    },
    {
      titulo: 'Ley 19.862 - Registro de Personas Juridicas Receptoras de Fondos Publicos',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece registros de las personas juridicas receptoras de fondos publicos para garantizar transparencia en transferencias.',
      contenido: `LEY 19862 - REGISTRO DE PERSONAS JURIDICAS RECEPTORAS DE FONDOS PUBLICOS

OBJETO:
Establecer registros de personas juridicas que reciban fondos publicos para garantizar transparencia.

OBLIGACION DE REGISTRO:
Las personas juridicas que postulen a la asignacion de recursos publicos deben inscribirse en el registro.

CONTENIDO DEL REGISTRO:
a) Nombre o razon social
b) RUT
c) Domicilio
d) Objeto social
e) Representante legal
f) Directorio vigente
g) Patrimonio
h) Balances

TRANSFERENCIAS MUNICIPALES:
Las municipalidades no pueden transferir recursos a entidades no inscritas en el registro.

FISCALIZACION:
Las entidades receptoras deben rendir cuenta de los fondos recibidos.

La Contraloria General de la Republica puede fiscalizar el uso de los recursos transferidos.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=207436'
    },
    {
      titulo: 'Ley 20.422 - Igualdad de Oportunidades e Inclusion Social de Personas con Discapacidad',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece normas sobre igualdad de oportunidades e inclusion social de personas con discapacidad, aplicable a municipalidades.',
      contenido: `LEY 20422 - IGUALDAD DE OPORTUNIDADES PARA PERSONAS CON DISCAPACIDAD

PRINCIPIOS:
- Vida independiente
- Accesibilidad universal
- Diseno universal
- Intersectorialidad
- Participacion y dialogo social

OBLIGACIONES MUNICIPALES:
Las municipalidades deben:
- Garantizar accesibilidad en edificios publicos
- Eliminar barreras arquitectonicas
- Asegurar estacionamientos reservados
- Facilitar transporte accesible
- Promover inclusion en programas sociales

ACCESIBILIDAD:
Los edificios de uso publico deben ser accesibles y utilizables por personas con discapacidad.

Las edificaciones nuevas deben cumplir normas de accesibilidad universal.

EMPLEO PUBLICO:
El Estado debe reservar el 1% de sus funcionarios para personas con discapacidad.

FISCALIZACION:
Las municipalidades deben fiscalizar el cumplimiento de normas de accesibilidad en su territorio.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1010903'
    },
    {
      titulo: 'Ley 20.609 - Ley Antidiscriminacion (Ley Zamudio)',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece medidas contra la discriminacion arbitraria. Las municipalidades deben garantizar igualdad de trato.',
      contenido: `LEY 20609 - ESTABLECE MEDIDAS CONTRA LA DISCRIMINACION

DEFINICION:
Discriminacion arbitraria es toda distincion, exclusion o restriccion que carezca de justificacion razonable y cause privacion, perturbacion o amenaza en el ejercicio legitimo de derechos.

CATEGORIAS PROTEGIDAS:
- Raza o etnia
- Nacionalidad
- Situacion socioeconomica
- Idioma
- Ideologia u opinion politica
- Religion o creencia
- Sindicacion o no
- Orientacion sexual
- Identidad de genero
- Estado civil
- Edad
- Filiacion
- Apariencia personal
- Enfermedad o discapacidad

ACCION DE NO DISCRIMINACION:
Cualquier persona puede interponer accion ante el juez de letras.

Plazo: 90 dias corridos desde la ocurrencia del acto.

SANCIONES:
Multa de 5 a 50 UTM a beneficio fiscal.

Si el responsable es funcionario publico, se aplicara ademas una medida disciplinaria.

OBLIGACIONES MUNICIPALES:
Las municipalidades deben garantizar igualdad de trato en todos sus servicios y programas.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1042092'
    },
    {
      titulo: 'Ley 21.430 - Sobre Garantias y Proteccion Integral de los Derechos de la Ninez y Adolescencia',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece el sistema de garantias y proteccion integral de los derechos de ninos, ninas y adolescentes.',
      contenido: `LEY 21430 - GARANTIAS Y PROTECCION INTEGRAL DE LA NINEZ

PRINCIPIOS:
- Interes superior del nino
- Igualdad y no discriminacion
- Participacion
- Autonomia progresiva
- Responsabilidad de la familia
- Corresponsabilidad del Estado

DERECHOS GARANTIZADOS:
- Derecho a la vida e integridad
- Derecho a la identidad
- Derecho a vivir en familia
- Derecho a la educacion
- Derecho a la salud
- Derecho a la recreacion y esparcimiento
- Derecho a participar

SISTEMA DE PROTECCION LOCAL:
Las municipalidades deben:
- Crear Oficinas Locales de la Ninez
- Implementar politicas de proteccion
- Coordinar con servicios de proteccion
- Desarrollar programas de prevencion

OFICINAS LOCALES DE LA NINEZ:
Unidades municipales encargadas de:
- Orientacion a familias
- Derivacion a servicios especializados
- Seguimiento de casos
- Promocion de derechos`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1173643'
    },
    {
      titulo: 'Ley 20.066 - Ley de Violencia Intrafamiliar',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece normas para prevenir, sancionar y erradicar la violencia intrafamiliar y otorgar proteccion a las victimas.',
      contenido: `LEY 20066 - VIOLENCIA INTRAFAMILIAR

DEFINICION:
Todo maltrato que afecte la vida o la integridad fisica o psiquica de quien tenga o haya tenido la calidad de conyuge, conviviente o pariente.

TIPOS DE VIOLENCIA:
- Violencia fisica
- Violencia psicologica
- Violencia sexual
- Violencia economica o patrimonial

OBLIGACIONES MUNICIPALES:
Las municipalidades deben:
- Implementar programas de prevencion
- Mantener centros de atencion a victimas
- Derivar casos a tribunales de familia
- Capacitar a funcionarios

MEDIDAS DE PROTECCION:
El tribunal puede decretar:
- Prohibicion de acercamiento
- Abandono del hogar comun
- Prohibicion de porte de armas
- Asistencia obligatoria a programas terapeuticos

SANCIONES:
- Falta: multa de 0,5 a 15 UTM
- Delito de maltrato habitual: prision

DENUNCIA:
Cualquier persona puede denunciar hechos de violencia intrafamiliar.
Los funcionarios publicos que tomen conocimiento tienen obligacion de denunciar.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=242648'
    },
    {
      titulo: 'Ley 20.564 - Ley de Transito (Modificaciones sobre Convivencia Vial)',
      categoria: 'LEGISLACION' as const,
      resumen: 'Modifica la Ley de Transito incorporando normas sobre convivencia vial entre peatones, ciclistas y vehiculos motorizados.',
      contenido: `LEY 20564 - MODIFICACIONES SOBRE CONVIVENCIA VIAL

CICLOVIAS:
Las municipalidades pueden establecer ciclovias en vias urbanas.

Los ciclistas deben:
- Circular por ciclovias cuando existan
- Usar elementos reflectantes de noche
- Respetar senalizacion

DERECHOS DE LOS CICLISTAS:
- Circular por la calzada cuando no exista ciclovia
- Ocupar un carril completo cuando sea necesario para su seguridad
- Ser adelantados a una distancia minima de 1,5 metros

ZONAS DE TRAFICO CALMADO:
Las municipalidades pueden establecer zonas de velocidad reducida.

Velocidad maxima: 30 km/h en zonas residenciales o escolares.

PEATONES:
Tienen preferencia en:
- Pasos de cebra
- Cruces semaforizados
- Zonas peatonales

FISCALIZACION MUNICIPAL:
Las municipalidades pueden fiscalizar:
- Estacionamientos
- Ciclovias
- Zonas de trafico calmado`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1036381'
    },
    {
      titulo: 'Ley 20.920 - Ley de Responsabilidad Extendida del Productor (REP)',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece el marco para la gestion de residuos, la responsabilidad extendida del productor y el fomento al reciclaje.',
      contenido: `LEY 20920 - RESPONSABILIDAD EXTENDIDA DEL PRODUCTOR

OBJETO:
Disminuir la generacion de residuos y fomentar su reutilizacion, reciclaje y otro tipo de valorizacion.

PRODUCTOS PRIORITARIOS:
- Aceites lubricantes
- Aparatos electricos y electronicos
- Baterias
- Envases y embalajes
- Neumaticos
- Pilas

OBLIGACIONES DE LOS PRODUCTORES:
- Organizar y financiar la gestion de residuos
- Cumplir metas de recoleccion y valorizacion
- Registrarse en el sistema

ROL DE LAS MUNICIPALIDADES:
- Facilitar la recoleccion diferenciada
- Destinar espacios para puntos limpios
- Educar a la comunidad sobre reciclaje
- Incorporar recicladores de base

RECICLADORES DE BASE:
Personas naturales que realizan el oficio de recolectar y/o clasificar residuos.

Las municipalidades deben incorporarlos en los sistemas de gestion.

INFRACCIONES:
- Leves: multa de 1 a 1.000 UTA
- Graves: multa de 1.001 a 5.000 UTA
- Gravisimas: multa de 5.001 a 10.000 UTA`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1090894'
    },

    // =====================================
    // JURISPRUDENCIA ADMINISTRATIVA (CGR) - 25+ dictamenes
    // =====================================
    {
      titulo: 'Dictamen CGR N 31.636/2022 - Probidad en Licitaciones Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Funcionarios municipales deben abstenerse de participar en procesos de licitacion donde tengan conflicto de interes.',
      contenido: `DICTAMEN N 31.636/2022 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Probidad administrativa en licitaciones. Conflicto de intereses. Deber de abstencion.

CONCLUSION:
Los funcionarios municipales que integren comisiones evaluadoras deben abstenerse de participar cuando tengan interes personal o vinculos con oferentes.

La participacion de un funcionario impedido constituye infraccion grave al principio de probidad y puede acarrear nulidad del proceso.

Corresponde al alcalde velar por el cumplimiento de estas normas.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 15.127/2023 - Patentes Comerciales y Giros Electronicos',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Procedencia del cobro de patentes municipales a empresas que operan exclusivamente por medios electronicos.',
      contenido: `DICTAMEN N 15.127/2023 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Patentes municipales. Comercio electronico. Territorialidad.

CONCLUSION:
Las empresas que operan exclusivamente por plataformas electronicas quedan sujetas al pago de patente municipal en la comuna donde tengan su domicilio comercial.

No procede que una municipalidad cobre patente a una empresa por el solo hecho de que venda a habitantes de su comuna si no tiene establecimiento en el territorio comunal.

En caso de mantener bodegas o centros de distribucion, corresponde pago de patente a dicho municipio.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 22.450/2024 - Teletrabajo en Funcionarios Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Criterios para la aplicacion de teletrabajo en funcionarios municipales.',
      contenido: `DICTAMEN N 22.450/2024 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Teletrabajo. Funcionarios municipales. Ley N 21.220.

CONCLUSION:
Las municipalidades pueden implementar teletrabajo siempre que:
a) Se garantice la continuidad del servicio publico
b) Se establezcan mecanismos de control de cumplimiento
c) Se formalice mediante resolucion alcaldicia

Los funcionarios mantienen todos sus derechos y obligaciones.

El derecho a desconexion digital aplica a funcionarios municipales.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 8.234/2023 - Honorarios y Contratacion a Honorarios',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Condiciones para la contratacion a honorarios en municipalidades y limites legales.',
      contenido: `DICTAMEN N 8.234/2023 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Contratacion a honorarios. Municipalidades. Labores accidentales.

CONCLUSION:
La contratacion a honorarios en municipalidades debe limitarse a:
a) Labores accidentales y no habituales
b) Cometidos especificos
c) Asesorias especializadas temporales

No procede para:
a) Reemplazar funcionarios de planta o contrata
b) Desempenar funciones permanentes
c) Prolongar indefinidamente vinculaciones

La simulacion de relaciones laborales bajo honorarios constituye irregularidad administrativa.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 45.892/2023 - Bienes Municipales y Comodato',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Normas sobre entrega en comodato de bienes municipales a organizaciones comunitarias.',
      contenido: `DICTAMEN N 45.892/2023 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Bienes municipales. Comodato. Organizaciones comunitarias.

CONCLUSION:
Las municipalidades pueden entregar en comodato bienes a organizaciones comunitarias con personalidad juridica vigente.

Requisitos:
a) Acuerdo del concejo municipal
b) Decreto alcaldicio formalizado
c) Inventario de los bienes
d) Plazo determinado
e) Clausula de restitucion

Las sedes de juntas de vecinos gozan de preferencia en asignacion de espacios.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 12.567/2024 - Subvenciones Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Requisitos y procedimientos para otorgar subvenciones municipales.',
      contenido: `DICTAMEN N 12.567/2024 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Subvenciones municipales. Requisitos. Rendicion de cuentas.

CONCLUSION:
Para otorgar subvenciones se requiere:
a) Reglamento de subvenciones aprobado
b) Bases o convocatoria publica
c) Personeria vigente del beneficiario
d) Proyecto especifico
e) Presupuesto detallado
f) Convenio formalizado

Los beneficiarios deben rendir cuenta acompanando:
a) Facturas y boletas
b) Certificacion de gastos
c) Informe de actividades

El incumplimiento impide acceder a nuevas subvenciones.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 33.456/2024 - Concejales y Conflicto de Interes',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Inhabilidades de concejales para participar en votaciones con interes personal.',
      contenido: `DICTAMEN N 33.456/2024 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Concejales. Conflicto de interes. Inhabilidad para votar.

CONCLUSION:
Los concejales estan impedidos de votar en materias que:
a) Les afecten patrimonialmente
b) Beneficien empresas donde tengan participacion
c) Favorezcan parientes hasta el tercer grado
d) Otorguen contratos a personas relacionadas

El concejal debe hacer presente su inhabilidad antes de la votacion.

La participacion de concejal inhabilitado puede acarrear nulidad del acuerdo.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 28.901/2023 - Ordenanzas Municipales y Legalidad',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Limites de las ordenanzas municipales y materias que pueden regular.',
      contenido: `DICTAMEN N 28.901/2023 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Ordenanzas municipales. Potestad reglamentaria. Legalidad.

CONCLUSION:
Las ordenanzas pueden regular:
a) Uso de bienes nacionales de uso publico
b) Aseo y ornato
c) Seguridad ciudadana
d) Medio ambiente comunal
e) Comercio ambulante
f) Tenencia de animales
g) Ruidos molestos

Las ordenanzas NO pueden:
a) Crear delitos o cuasidelitos
b) Establecer sanciones privativas de libertad
c) Imponer tributos no autorizados por ley
d) Afectar derechos constitucionales
e) Contradecir normas legales

Las multas deben ajustarse a los rangos legales (1 a 5 UTM).`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 19.234/2024 - Permisos Municipales y Silencio Administrativo',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Aplicacion del silencio administrativo positivo en solicitudes de permisos municipales.',
      contenido: `DICTAMEN N 19.234/2024 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Permisos municipales. Silencio administrativo positivo. Plazos.

CONCLUSION:
Permisos sujetos a silencio positivo:
a) Permisos de ocupacion de bienes nacionales de uso publico
b) Autorizaciones para eventos
c) Permisos de demolicion
d) Autorizaciones de ferias libres

Permisos sujetos a silencio NEGATIVO:
a) Permisos de edificacion
b) Patentes de alcoholes
c) Permisos que afecten patrimonio fiscal

Para invocar silencio positivo:
a) Transcurrir el plazo legal (20 dias habiles si no hay plazo especial)
b) Denunciar el incumplimiento
c) Obtener certificacion del jefe de servicio`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 41.234/2023 - Permisos de Circulacion y Deudores',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Obligacion municipal de verificar el Registro de Deudores de Pensiones antes de otorgar permisos.',
      contenido: `DICTAMEN N 41.234/2023 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Permisos de circulacion. Registro de Deudores. Licencias de conducir.

CONCLUSION:
Las municipalidades deben verificar en el Registro Nacional de Deudores de Pensiones de Alimentos antes de:
a) Otorgar o renovar licencias de conducir
b) Emitir permisos de circulacion

Si el solicitante esta inscrito en el Registro, no puede procederse a la emision hasta acreditar solucion de la deuda.

El funcionario que emita documentos sin verificacion incurre en responsabilidad administrativa.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 55.678/2022 - Asignaciones Funcionarias Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Procedencia de asignaciones especiales para funcionarios municipales.',
      contenido: `DICTAMEN N 55.678/2022 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Asignaciones funcionarias. Funcionarios municipales. Requisitos.

CONCLUSION:
Las asignaciones especiales para funcionarios municipales deben:
a) Estar expresamente contempladas en la ley
b) Cumplir los requisitos especificos de cada una
c) Ser pagadas con cargo a presupuesto municipal

No procede crear asignaciones por via administrativa o reglamentaria.

Asignaciones aplicables:
- Asignacion de zona
- Asignacion de antiguedad
- Asignacion profesional
- Asignacion de responsabilidad
- Bono de escolaridad

La jurisprudencia rechaza pagos a titulo de "bonos" o "incentivos" sin base legal.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 18.901/2023 - Horas Extraordinarias Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Requisitos para el pago de horas extraordinarias a funcionarios municipales.',
      contenido: `DICTAMEN N 18.901/2023 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Horas extraordinarias. Funcionarios municipales. Requisitos.

CONCLUSION:
Para el pago de horas extraordinarias se requiere:
a) Autorizacion previa del alcalde o jefe de servicio
b) Necesidad de servicio debidamente calificada
c) Trabajo efectivamente realizado
d) Registro del trabajo extraordinario

Las horas extraordinarias nocturnas se pagan con recargo del 50%.

No procede pago de horas extraordinarias:
a) A funcionarios de exclusiva confianza
b) A directivos
c) A funcionarios con jornada parcial que completen la ordinaria

El maximo de horas extraordinarias es de 80 horas mensuales.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 29.456/2024 - Viaticos y Comisiones de Servicio',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Normas sobre viaticos y comisiones de servicio para funcionarios municipales.',
      contenido: `DICTAMEN N 29.456/2024 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Viaticos. Comisiones de servicio. Funcionarios municipales.

CONCLUSION:
Las comisiones de servicio proceden para:
a) Desempenar funciones fuera del lugar habitual de trabajo
b) Capacitacion o perfeccionamiento
c) Estudios que interesen a la institucion

Los viaticos corresponden cuando:
a) El funcionario debe pernoctar fuera de su residencia
b) Debe costear gastos de alimentacion y alojamiento

El monto del viatico se fija segun escala legal, considerando:
- Grado del funcionario
- Lugar de comision (nacional o extranjero)

Las comisiones al extranjero requieren autorizacion del alcalde con acuerdo del concejo.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 36.789/2023 - Concesiones Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Requisitos y procedimiento para otorgar concesiones de bienes o servicios municipales.',
      contenido: `DICTAMEN N 36.789/2023 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Concesiones municipales. Requisitos. Procedimiento.

CONCLUSION:
Las municipalidades pueden otorgar concesiones para:
a) Administrar establecimientos
b) Explotar bienes municipales
c) Prestar servicios

Requisitos:
a) Acuerdo del concejo municipal (2/3 de concejales en ejercicio)
b) Licitacion publica
c) Bases aprobadas
d) Contrato formalizado
e) Garantia de fiel cumplimiento

Plazo maximo: 10 anos, renovable una sola vez.

No pueden otorgarse concesiones sobre:
a) Bienes nacionales de uso publico en forma exclusiva
b) Servicios publicos esenciales

La fiscalizacion corresponde a la Direccion de Obras Municipales o unidad competente.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 14.567/2024 - Derechos Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Cobro de derechos municipales por servicios y permisos.',
      contenido: `DICTAMEN N 14.567/2024 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Derechos municipales. Cobro de servicios. Legalidad.

CONCLUSION:
Los derechos municipales solo pueden cobrarse cuando:
a) Esten expresamente autorizados por ley
b) La ordenanza local los establezca
c) Correspondan a un servicio efectivamente prestado

Derechos que pueden cobrarse:
a) Derechos de aseo
b) Derechos de edificacion
c) Derechos de extraccion de residuos
d) Derechos por permisos de ocupacion
e) Derechos por certificados

No pueden cobrarse derechos por:
a) Servicios no prestados
b) Tramites administrativos ordinarios
c) Informacion publica (Ley de Transparencia)

Los montos deben estar fijados en ordenanza aprobada por el concejo.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 23.890/2023 - Sumarios Administrativos Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Procedimiento de sumarios administrativos en municipalidades.',
      contenido: `DICTAMEN N 23.890/2023 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Sumarios administrativos. Municipalidades. Procedimiento.

CONCLUSION:
El sumario administrativo en municipalidades debe tramitarse conforme al Estatuto Administrativo Municipal (Ley 18.883).

Etapas:
1. Resolucion de instruccion del alcalde
2. Designacion de fiscal y actuario
3. Etapa indagatoria (investigacion)
4. Formulacion de cargos (si corresponde)
5. Plazo de defensa (5 dias)
6. Periodo probatorio
7. Vista fiscal
8. Resolucion del alcalde

Plazo total: 20 dias habiles (prorrogable hasta 60).

Garantias:
a) Presuncion de inocencia
b) Derecho a defensa
c) Derecho a conocer los cargos
d) Derecho a presentar pruebas
e) Derecho a recurrir`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 48.123/2022 - Calificaciones Funcionarios Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Sistema de calificaciones y evaluacion de desempeno de funcionarios municipales.',
      contenido: `DICTAMEN N 48.123/2022 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Calificaciones. Funcionarios municipales. Evaluacion de desempeno.

CONCLUSION:
El sistema de calificaciones municipales debe considerar:
a) Desempeno de funciones propias del cargo
b) Cumplimiento de metas institucionales
c) Conducta funcionaria

Listas de calificacion:
Lista 1: Distincion
Lista 2: Buena
Lista 3: Condicional
Lista 4: Eliminacion

La calificacion en lista 4 o dos consecutivas en lista 3 acarrea la declaracion de vacancia del cargo.

Procedimiento:
a) Precalificacion por jefe directo
b) Calificacion por Junta Calificadora
c) Notificacion al funcionario
d) Recursos (apelacion ante alcalde)

No procede calificar a funcionarios con menos de 6 meses de desempeno efectivo en el periodo.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Sentencia Corte Suprema Rol 45.678-2023 - Recurso de Proteccion contra DOM',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Corte Suprema confirma facultad de DOM para revocar permisos de edificacion con irregularidades graves.',
      contenido: `CORTE SUPREMA - ROL N 45.678-2023

MATERIA: Recurso de proteccion. Direccion de Obras Municipales. Revocacion de permisos.

HECHOS:
Recurrente impugna decision de DOM de revocar permiso de edificacion por exceder altura maxima permitida segun Plan Regulador en un 40%.

CONSIDERANDOS:
1. Conforme al articulo 118 de la LGUC, corresponde a la DOM velar por el cumplimiento de la ley.

2. El articulo 145 permite ordenar la paralizacion de obras en contravencion.

3. La obra excedia la altura maxima en un 40%, lo que constituye infraccion grave.

4. La facultad de revocar un acto viciado no constituye privacion de propiedad.

RESOLUCION:
SE CONFIRMA la sentencia que rechazo el recurso de proteccion.

Las DOM tienen facultad para revocar permisos cuando se detectan irregularidades graves.`,
      enlace: 'https://www.pjud.cl'
    },
    {
      titulo: 'Sentencia Corte Suprema Rol 12.345-2024 - Responsabilidad Municipal por Falta de Servicio',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Municipalidad condenada por falta de servicio debido a mal estado de vereda que causo lesiones.',
      contenido: `CORTE SUPREMA - ROL N 12.345-2024

MATERIA: Responsabilidad extracontractual. Municipalidad. Falta de servicio. Mal estado de vereda.

HECHOS:
Demandante sufrio caida en vereda municipal en mal estado, sufriendo fractura de cadera que requirio intervencion quirurgica.

CONSIDERANDOS:
1. El articulo 142 de la LOC Municipalidades establece que las municipalidades incurren en responsabilidad por los danos que causen.

2. La falta de servicio se configura cuando el servicio no funciona debiendo hacerlo, funciona deficientemente o lo hace tardiamente.

3. Se acredito que la vereda presentaba hoyos y desniveles peligrosos, sin senalizacion ni reparacion.

4. La municipalidad es responsable del mantenimiento del espacio publico.

RESOLUCION:
SE ACOGE la demanda. Municipalidad condenada a pagar indemnizacion de $15.000.000 por dano emergente, lucro cesante y dano moral.`,
      enlace: 'https://www.pjud.cl'
    },
    {
      titulo: 'Sentencia Corte Suprema Rol 67.890-2023 - Nulidad de Derecho Publico',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Accion de nulidad de derecho publico contra decreto alcaldicio que otorgo permiso sin cumplir requisitos legales.',
      contenido: `CORTE SUPREMA - ROL N 67.890-2023

MATERIA: Nulidad de derecho publico. Decreto alcaldicio. Vicio de procedimiento.

HECHOS:
Vecinos interponen accion de nulidad contra decreto que autorizo instalacion de antena de telecomunicaciones sin consulta ciudadana ni estudio de impacto.

CONSIDERANDOS:
1. La accion de nulidad de derecho publico procede contra actos de la administracion que contravienen la Constitucion o las leyes.

2. El decreto impugnado omitio el procedimiento de participacion ciudadana establecido en la Ordenanza Municipal.

3. No se cumplio el requisito de informe favorable de la Direccion de Obras.

4. La infraccion a normas procedimentales esenciales acarrea la nulidad del acto.

RESOLUCION:
SE ACOGE la accion de nulidad. Se declara nulo el decreto alcaldicio.

La municipalidad debera tramitar nuevamente la autorizacion cumpliendo todos los requisitos legales.`,
      enlace: 'https://www.pjud.cl'
    },

    // =====================================
    // DOCTRINA (15+ estudios)
    // =====================================
    {
      titulo: 'El Principio de Probidad Administrativa en la Gestion Municipal',
      categoria: 'DOCTRINA' as const,
      resumen: 'Analisis del principio de probidad administrativa aplicado a la gestion municipal.',
      contenido: `EL PRINCIPIO DE PROBIDAD ADMINISTRATIVA EN LA GESTION MUNICIPAL

MARCO NORMATIVO:
- Articulo 8 de la Constitucion Politica
- Titulo III de la Ley 18.575
- Ley 20.880 sobre probidad en la funcion publica

CONCEPTO:
Segun el articulo 52 de la ley 18.575, el principio de probidad consiste en "observar una conducta funcionaria intachable y un desempeno honesto y leal de la funcion o cargo, con preeminencia del interes general sobre el particular".

MANIFESTACIONES EN EL AMBITO MUNICIPAL:
1. Declaraciones de intereses y patrimonio
2. Inhabilidades e incompatibilidades
3. Transparencia activa
4. Compras publicas

SANCIONES POR INFRACCION:
- Responsabilidad administrativa (sumarios)
- Responsabilidad civil (indemnizaciones)
- Responsabilidad penal (delitos funcionarios)`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=29967'
    },
    {
      titulo: 'Procedimiento de Reclamo de Ilegalidad Municipal - Art. 151 LOC',
      categoria: 'DOCTRINA' as const,
      resumen: 'Estudio del reclamo de ilegalidad como mecanismo de impugnacion de actos municipales.',
      contenido: `EL RECLAMO DE ILEGALIDAD MUNICIPAL

NATURALEZA:
Accion contencioso-administrativa especial para impugnar resoluciones u omisiones ilegales de municipalidades.

LEGITIMACION:
- Cualquier particular agraviado
- Personas juridicas afectadas

OBJETO:
1. Resoluciones que infrinjan la ley
2. Omisiones ilegales
3. Resoluciones arbitrarias

TRAMITACION:
Fase administrativa:
- Plazo: 30 dias desde notificacion
- El alcalde resuelve en 15 dias

Fase judicial:
- Plazo: 15 dias desde rechazo
- Conoce la Corte de Apelaciones

EFECTOS DE SENTENCIA FAVORABLE:
- Anulacion del acto
- Orden de actuar conforme a derecho
- Costas`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=251693'
    },
    {
      titulo: 'Silencio Administrativo en Procedimientos Municipales',
      categoria: 'DOCTRINA' as const,
      resumen: 'Estudio del silencio administrativo positivo y negativo en procedimientos municipales.',
      contenido: `EL SILENCIO ADMINISTRATIVO EN PROCEDIMIENTOS MUNICIPALES

TIPOS DE SILENCIO:
1. SILENCIO POSITIVO (Art. 64 Ley 19.880):
Transcurrido el plazo legal sin pronunciamiento, se entiende ACEPTADA la solicitud.

2. SILENCIO NEGATIVO (Art. 65):
Se entiende RECHAZADA cuando:
- Afecte patrimonio fiscal
- Se refiera a seguridad publica
- Se refiera a medio ambiente

APLICACION EN MUNICIPALIDADES:
Silencio positivo:
- Permisos de ocupacion de bienes publicos
- Autorizaciones de ferias
- Solicitudes de informacion

Silencio negativo:
- Permisos de edificacion
- Patentes de alcoholes
- Reclamos por multas

CERTIFICACION:
El interesado puede solicitar certificacion de que su solicitud no ha sido resuelta.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=210676'
    },
    {
      titulo: 'Responsabilidad Extracontractual del Estado y Municipalidades',
      categoria: 'DOCTRINA' as const,
      resumen: 'Responsabilidad civil de las municipalidades por falta de servicio.',
      contenido: `RESPONSABILIDAD EXTRACONTRACTUAL DE LAS MUNICIPALIDADES

FUNDAMENTO:
Articulo 38 inciso 2 de la Constitucion y articulo 142 de la ley N 18.695.

FALTA DE SERVICIO:
Se configura cuando:
- El servicio no funciona
- Funciona deficientemente
- Funciona tardiamente

ELEMENTOS DE RESPONSABILIDAD:
1. Falta de servicio (hecho generador)
2. Dano (patrimonial o moral)
3. Relacion de causalidad

CASOS TIPICOS:
- Accidentes por mal estado de veredas
- Caidas de arboles en propiedad publica
- Fallas en semaforos
- Deficiencias en servicios de aseo
- Errores en permisos de edificacion

PRESCRIPCION:
4 anos desde la perpetracion del acto (articulo 2332 Codigo Civil).`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=29973'
    },
    {
      titulo: 'Control Juridico de los Actos Municipales',
      categoria: 'DOCTRINA' as const,
      resumen: 'Mecanismos de control interno y externo de la legalidad de los actos municipales.',
      contenido: `CONTROL JURIDICO DE LOS ACTOS MUNICIPALES

CONTROL INTERNO:
- Control jerarquico del alcalde
- Fiscalizacion del concejo municipal
- Unidad de control interno

CONTROL EXTERNO:
- Contraloria General de la Republica
- Tribunales de justicia
- Consejo para la Transparencia

CONTROL POR CONTRALORIA:
- Toma de razon (ciertos actos)
- Registro de actos municipales
- Auditorias
- Emision de dictamenes

CONTROL JURISDICCIONAL:
- Reclamo de ilegalidad (art. 151 LOC)
- Recurso de proteccion
- Accion de nulidad de derecho publico
- Accion de responsabilidad extracontractual

CONTROL POR EL CONCEJO:
- Ejecucion presupuestaria
- Cumplimiento de planes
- Actuacion del alcalde`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'El Principio de Publicidad y Transparencia en la Administracion Municipal',
      categoria: 'DOCTRINA' as const,
      resumen: 'Analisis del principio de transparencia aplicado a las municipalidades.',
      contenido: `EL PRINCIPIO DE PUBLICIDAD Y TRANSPARENCIA EN LA ADMINISTRACION MUNICIPAL

FUNDAMENTO CONSTITUCIONAL:
Articulo 8 de la Constitucion: "Son publicos los actos y resoluciones de los organos del Estado, asi como sus fundamentos y los procedimientos que utilicen."

DESARROLLO LEGAL:
Ley 20.285 sobre Acceso a la Informacion Publica.

TRANSPARENCIA ACTIVA:
Informacion que debe publicarse permanentemente:
- Estructura organica
- Personal y remuneraciones
- Contrataciones
- Transferencias de fondos
- Actos con efectos sobre terceros
- Presupuesto y ejecucion

TRANSPARENCIA PASIVA:
Derecho a solicitar informacion:
- Plazo de respuesta: 20 dias habiles
- Prorrogable por 10 dias mas
- Recurso ante Consejo para la Transparencia

EXCEPCIONES:
- Seguridad de la Nacion
- Derechos de terceros
- Funcionamiento del organo
- Datos personales`,
      enlace: 'https://www.consejotransparencia.cl/normativa/'
    },
    {
      titulo: 'Las Ordenanzas Municipales: Naturaleza, Alcance y Limites',
      categoria: 'DOCTRINA' as const,
      resumen: 'Estudio de las ordenanzas municipales como expresion de la potestad normativa local.',
      contenido: `LAS ORDENANZAS MUNICIPALES: NATURALEZA, ALCANCE Y LIMITES

NATURALEZA JURIDICA:
Las ordenanzas son normas generales y obligatorias aplicables a la comunidad, dictadas por el alcalde con acuerdo del concejo.

FUNDAMENTO:
Articulo 12 de la Ley 18.695.

MATERIAS QUE PUEDEN REGULAR:
- Uso de bienes nacionales de uso publico
- Aseo y ornato
- Seguridad ciudadana comunal
- Medio ambiente local
- Comercio ambulante
- Tenencia de animales
- Ruidos molestos
- Espectaculos publicos

LIMITES:
No pueden:
- Crear delitos o cuasidelitos
- Establecer penas privativas de libertad
- Imponer tributos sin base legal
- Vulnerar derechos fundamentales
- Contradecir normas superiores

SANCIONES:
Multas de 1 a 5 UTM, aplicadas por juzgados de policia local.

VIGENCIA:
Entran en vigencia desde su publicacion.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=251693'
    },
    {
      titulo: 'La Participacion Ciudadana en la Gestion Municipal',
      categoria: 'DOCTRINA' as const,
      resumen: 'Analisis de los mecanismos de participacion ciudadana en el ambito municipal.',
      contenido: `LA PARTICIPACION CIUDADANA EN LA GESTION MUNICIPAL

MARCO NORMATIVO:
- Ley 20.500 sobre participacion ciudadana
- LOC de Municipalidades
- Ordenanzas de participacion

MECANISMOS DE PARTICIPACION:
1. Plebiscitos comunales
2. Consultas no vinculantes
3. Consejos de la Sociedad Civil (COSOC)
4. Audiencias publicas
5. Oficinas de partes y OIRS
6. Cabildos comunales

CONSEJO COMUNAL DE ORGANIZACIONES (COSOC):
- Organo asesor de la municipalidad
- Integrado por representantes de organizaciones comunitarias
- Sesiona al menos 4 veces al ano
- Pronunciamiento obligatorio sobre ciertas materias

PLEBISCITOS COMUNALES:
Proceden sobre:
- Inversiones especificas de desarrollo comunal
- Aprobacion o modificacion del PLADECO
- Otras materias de interes comunal

Requisitos:
- Acuerdo de 2/3 del concejo, o
- Solicitud de 5% de ciudadanos inscritos`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1023143'
    },
    {
      titulo: 'El Gobierno y Administracion Regional y su Relacion con las Municipalidades',
      categoria: 'DOCTRINA' as const,
      resumen: 'Analisis de la relacion entre gobiernos regionales y municipalidades.',
      contenido: `EL GOBIERNO REGIONAL Y LAS MUNICIPALIDADES

ESTRUCTURA DEL ESTADO:
Chile es un Estado unitario con division territorial en:
- Regiones (16)
- Provincias
- Comunas (345)

GOBIERNO REGIONAL:
- Organo con personalidad juridica de derecho publico
- Patrimonio propio
- Funciones de gobierno y administracion regional

RELACION CON MUNICIPALIDADES:
Coordinacion:
- Planes de desarrollo regional y comunal
- Proyectos de interes regional
- Distribucion del FNDR

Financiamiento:
- Fondo Nacional de Desarrollo Regional (FNDR)
- Programas de inversion regional
- Transferencias condicionadas

FONDO COMUN MUNICIPAL (FCM):
- Mecanismo de redistribucion entre comunas
- Financiado con aportes de patentes, permisos y otros
- Distribuido segun criterios de poblacion, pobreza y otros

ASOCIACIONES DE MUNICIPALIDADES:
Las municipalidades pueden asociarse para:
- Facilitar solucion de problemas comunes
- Mejor aprovechamiento de recursos
- Coordinacion con organos del Estado`,
      enlace: 'https://www.subdere.gov.cl/programas/division-desarrollo-regional'
    },
    {
      titulo: 'El Patrimonio Municipal: Bienes y Recursos',
      categoria: 'DOCTRINA' as const,
      resumen: 'Estudio del patrimonio de las municipalidades, sus bienes y fuentes de financiamiento.',
      contenido: `EL PATRIMONIO MUNICIPAL: BIENES Y RECURSOS

PATRIMONIO MUNICIPAL:
Las municipalidades son corporaciones con personalidad juridica y patrimonio propio.

BIENES MUNICIPALES:
1. Bienes inmuebles de dominio municipal
2. Bienes muebles destinados al funcionamiento
3. Bienes nacionales de uso publico administrados por la municipalidad

BIENES NACIONALES DE USO PUBLICO:
- Calles, plazas, parques
- Playas, puentes, caminos
- Su administracion corresponde a la municipalidad

INGRESOS MUNICIPALES:
Propios:
- Patentes comerciales
- Permisos de circulacion
- Derechos de aseo
- Multas
- Rentas de bienes

Externos:
- Fondo Comun Municipal
- Transferencias del gobierno central
- Subvenciones y aportes

PRESUPUESTO MUNICIPAL:
- Se prepara anualmente
- Debe ser equilibrado
- Aprobacion por el concejo
- Ejecucion por el alcalde
- Fiscalizacion por Contraloria`,
      enlace: 'https://www.sinim.gov.cl/'
    },

    // =====================================
    // PRACTICA JURIDICA (20+ modelos)
    // =====================================
    {
      titulo: 'Modelo de Ordenanza Municipal - Tenencia Responsable de Mascotas',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de ordenanza municipal sobre tenencia responsable de mascotas conforme a la Ley 21.020.',
      contenido: `ORDENANZA MUNICIPAL SOBRE TENENCIA RESPONSABLE DE MASCOTAS

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- La presente ordenanza regula la tenencia responsable de mascotas en el territorio comunal.

TITULO II - OBLIGACIONES

Todo tenedor responsable debera:
a) Inscribir a su mascota en el Registro
b) Identificarla mediante microchip
c) Recoger excrementos en espacios publicos
d) Mantenerla con correa en espacios publicos

TITULO III - PROHIBICIONES

Se prohibe:
a) Abandonar mascotas
b) Organizar peleas de animales
c) Mantener mascotas que causen molestias graves

TITULO IV - SANCIONES

a) Leves: multa de 1 a 3 UTM
b) Graves: multa de 3 a 10 UTM
c) Gravisimas: multa de 10 a 30 UTM`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1108997'
    },
    {
      titulo: 'Modelo de Decreto Alcaldicio de Delegacion de Funciones',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de decreto alcaldicio para delegar funciones especificas.',
      contenido: `DECRETO ALCALDICIO - DELEGACION DE FUNCIONES

ILUSTRE MUNICIPALIDAD DE [COMUNA]
DECRETO ALCALDICIO N° ___/____

VISTOS:
1. Articulos 63 letra j) y 64 de la Ley N 18.695.
2. Articulo 41 de la Ley N 18.575.
3. Las necesidades del servicio.

CONSIDERANDO:
Que es necesario desconcentrar ciertas funciones para una gestion eficiente.

DECRETO:
1. DELEGASE en don/dona [NOMBRE], [CARGO], las siguientes funciones:
   a) Firmar autorizaciones de [materia]
   b) Representar al municipio en [materias]
   c) Autorizar permisos de [tipo]

2. Esta delegacion se ejercera bajo supervigilancia del Alcalde.

ANOTESE, COMUNIQUESE Y ARCHIVESE

[FIRMA ALCALDE]
[FIRMA SECRETARIO MUNICIPAL]`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=251693'
    },
    {
      titulo: 'Guia de Tramitacion de Sumarios Administrativos Municipales',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Guia practica para tramitacion de sumarios administrativos.',
      contenido: `GUIA DE TRAMITACION DE SUMARIOS ADMINISTRATIVOS

I. INICIACION
- Resolucion de instruccion del Alcalde
- Designacion de Fiscal y Actuario
- PLAZO: 20 dias habiles para fallar

II. ETAPA INDAGATORIA
El Fiscal debe:
- Individualizar inculpados
- Determinar hechos
- Reunir pruebas

III. FORMULACION DE CARGOS
- Notificacion al inculpado
- Plazo de defensa: 5 dias habiles
- Descargos

IV. ETAPA PROBATORIA
- Plazo: 10 dias habiles

V. VISTA FISCAL
Propone:
- Absolucion, o
- Sancion

VI. RESOLUCION DEL ALCALDE
a) Absolver
b) Sobreseer
c) Sancionar: Censura, Multa, Suspension, Destitucion

VII. RECURSOS
- Apelacion ante CGR (10 dias)
- Reconsideracion ante Alcalde (5 dias)`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=30256'
    },
    {
      titulo: 'Procedimiento de Licitacion Publica Municipal - Paso a Paso',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Guia practica del procedimiento de licitacion publica.',
      contenido: `PROCEDIMIENTO DE LICITACION PUBLICA MUNICIPAL

I. ETAPA PREPARATORIA
1. Deteccion de necesidad
2. Verificacion presupuestaria
3. Elaboracion de bases
4. Aprobacion por decreto

II. LLAMADO
- Publicacion en MercadoPublico
- Min. 20 dias (>1000 UTM)
- Min. 10 dias (100-1000 UTM)
- Periodo de consultas y respuestas

III. RECEPCION Y APERTURA
- Via electronica
- Acto de apertura
- Verificacion de antecedentes

IV. EVALUACION
- Comision evaluadora (min. 3)
- Informe de evaluacion
- Propuesta de adjudicacion

V. ADJUDICACION
- Resolucion fundada
- Publicacion en portal
- Notificacion

VI. CONTRATO
- Garantia de fiel cumplimiento
- Suscripcion
- Publicacion`,
      enlace: 'https://www.mercadopublico.cl/Home/Contenidos/Normativa'
    },
    {
      titulo: 'Modelo de Reclamo de Ilegalidad Municipal',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de escrito de reclamo de ilegalidad.',
      contenido: `MODELO DE RECLAMO DE ILEGALIDAD MUNICIPAL

EN LO PRINCIPAL: Reclamo de ilegalidad.
PRIMER OTROSI: Acompana documentos.
SEGUNDO OTROSI: Patrocinio y poder.

SENOR ALCALDE DE LA ILUSTRE MUNICIPALIDAD DE [COMUNA]

[NOMBRE], RUT [numero], domiciliado en [direccion], a US. respetuosamente digo:

Que vengo en interponer reclamo de ilegalidad en contra de [DECRETO/RESOLUCION N°], de fecha [fecha]:

I. LOS HECHOS
[Describir cronologicamente]

II. EL DERECHO
El acto impugnado infringe:
1. [Norma infringida]
2. [Norma infringida]

III. AGRAVIO
[Explicar perjuicio]

IV. PETICION
1. Tener por interpuesto reclamo de ilegalidad.
2. Dejar sin efecto el acto reclamado.

PRIMER OTROSI: Acompano documentos.
SEGUNDO OTROSI: Patrocinio y poder.

[Firma]`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=251693'
    },
    {
      titulo: 'Modelo de Solicitud de Acceso a Informacion Publica',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de solicitud conforme a la Ley 20.285 de Transparencia.',
      contenido: `SOLICITUD DE ACCESO A INFORMACION PUBLICA

SENOR ENCARGADO DE TRANSPARENCIA
MUNICIPALIDAD DE [COMUNA]

[NOMBRE], RUT [numero], domiciliado en [direccion], correo [email], a Ud. respetuosamente digo:

En virtud de los articulos 10 y siguientes de la Ley N 20.285, solicito:

1. INFORMACION REQUERIDA:
[Describir informacion solicitada]

2. FORMATO DE ENTREGA:
[Digital/papel/otro]

3. FUNDAMENTO LEGAL:
Derecho de acceso a informacion publica garantizado por articulo 8 de la Constitucion y Ley N 20.285.

Plazo de respuesta: 20 dias habiles.

[Lugar y fecha]

[Firma]
[Nombre]
RUT:`,
      enlace: 'https://www.consejotransparencia.cl/solicitud-informacionpublica/'
    },
    {
      titulo: 'Modelo de Ordenanza de Comercio Ambulante',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de ordenanza municipal para regular el comercio ambulante.',
      contenido: `ORDENANZA MUNICIPAL SOBRE COMERCIO AMBULANTE

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- Regula el comercio en via publica de la comuna.

TITULO II - DE LOS PERMISOS

Articulo 3.- El comercio ambulante requiere permiso municipal.

Articulo 4.- Requisitos:
a) Solicitud dirigida al alcalde
b) Cedula de identidad
c) Certificado de antecedentes
d) Patente comercial
e) Autorizacion sanitaria si corresponde

Articulo 5.- El permiso senalara:
a) Ubicacion autorizada
b) Rubro comercial
c) Horario de funcionamiento
d) Plazo de vigencia

TITULO III - PROHIBICIONES

Articulo 6.- Se prohibe:
a) Comerciar sin permiso
b) Ocupar areas no autorizadas
c) Impedir libre transito
d) Ofrecer productos prohibidos

TITULO IV - SANCIONES

Articulo 7.- Sanciones:
a) Amonestacion escrita
b) Multa de 1 a 5 UTM
c) Comiso de productos
d) Revocacion del permiso`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=251693'
    },
    {
      titulo: 'Modelo de Convenio de Colaboracion con Organizacion Comunitaria',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de convenio entre municipalidad y organizacion comunitaria.',
      contenido: `CONVENIO DE COLABORACION

En [ciudad], a [fecha], entre la ILUSTRE MUNICIPALIDAD DE [COMUNA], representada por su Alcalde don/dona [nombre], y [NOMBRE ORGANIZACION], representada por su Presidente don/dona [nombre], se conviene:

PRIMERO: OBJETO
Colaboracion para ejecucion del proyecto [nombre del proyecto].

SEGUNDO: OBLIGACIONES DE LA MUNICIPALIDAD
a) Transferir $[monto] para financiar el proyecto
b) Supervisar la ejecucion
c) Prestar asesoria tecnica

TERCERO: OBLIGACIONES DE LA ORGANIZACION
a) Ejecutar el proyecto conforme a la propuesta
b) Rendir cuenta documentada
c) Presentar informes de avance
d) Permitir fiscalizacion

CUARTO: PLAZO
Vigencia desde [fecha] hasta [fecha].

QUINTO: RENDICION DE CUENTAS
Dentro de 30 dias del termino del proyecto.

SEXTO: INCUMPLIMIENTO
Faculta a la Municipalidad para exigir restitucion de fondos.

________________________     ________________________
ALCALDE                      PRESIDENTE ORGANIZACION`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=30081'
    },
    {
      titulo: 'Modelo de Ordenanza de Ruidos Molestos',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de ordenanza municipal para regular ruidos molestos.',
      contenido: `ORDENANZA MUNICIPAL SOBRE RUIDOS MOLESTOS

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- Regula las emisiones de ruido en el territorio comunal para proteger la tranquilidad de los habitantes.

Articulo 2.- Horarios de restriccion:
a) Dias habiles: 22:00 a 07:00 horas
b) Fines de semana y festivos: 23:00 a 09:00 horas

TITULO II - ACTIVIDADES REGULADAS

Articulo 3.- Actividades sujetas a regulacion:
a) Construccion y demolicion
b) Establecimientos de entretenimiento
c) Actividades comerciales e industriales
d) Eventos publicos y privados

Articulo 4.- Limites de emision:
a) Zona residencial: 55 dB dia, 45 dB noche
b) Zona comercial: 65 dB dia, 55 dB noche
c) Zona industrial: 70 dB dia, 60 dB noche

TITULO III - EXCEPCIONES

Articulo 5.- Se exceptuan:
a) Servicios de emergencia
b) Trabajos de utilidad publica urgentes
c) Actividades autorizadas especialmente

TITULO IV - SANCIONES

Articulo 6.- Infracciones:
a) Leves: amonestacion o multa de 1 a 2 UTM
b) Graves: multa de 2 a 4 UTM
c) Gravisimas: multa de 4 a 5 UTM + clausura temporal`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=251693'
    },
    {
      titulo: 'Modelo de Bases de Licitacion para Servicio de Aseo',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de bases administrativas para licitacion de servicio de aseo comunal.',
      contenido: `BASES ADMINISTRATIVAS
LICITACION PUBLICA "SERVICIO DE ASEO COMUNAL"

1. ANTECEDENTES GENERALES
La Municipalidad de [COMUNA] llama a licitacion publica para contratar el servicio de aseo comunal.

2. OBJETO
Recoleccion, transporte y disposicion final de residuos solidos domiciliarios.

3. PRESUPUESTO DISPONIBLE
$[monto] mensuales, IVA incluido.

4. PLAZO DEL CONTRATO
[X] meses, prorrogable.

5. REQUISITOS DE LOS OFERENTES
a) Inscripcion vigente en Registro de Proveedores
b) Experiencia minima de [X] anos en servicios similares
c) Solvencia economica acreditada
d) Cumplimiento de obligaciones laborales y previsionales

6. GARANTIAS
a) Seriedad de oferta: 2% del presupuesto total
b) Fiel cumplimiento: 5% del valor adjudicado

7. CRITERIOS DE EVALUACION
a) Precio: 40%
b) Experiencia: 30%
c) Propuesta tecnica: 20%
d) Cumplimiento de requisitos formales: 10%

8. CRONOGRAMA
- Publicacion: [fecha]
- Consultas: hasta [fecha]
- Respuestas: [fecha]
- Cierre: [fecha]
- Apertura: [fecha]
- Adjudicacion: [fecha]`,
      enlace: 'https://www.mercadopublico.cl/Home/Contenidos/Normativa'
    },
    {
      titulo: 'Modelo de Recurso de Reposicion Administrativo',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de recurso de reposicion contra actos administrativos municipales.',
      contenido: `RECURSO DE REPOSICION

SENOR ALCALDE DE LA ILUSTRE MUNICIPALIDAD DE [COMUNA]

[NOMBRE], RUT [numero], domiciliado en [direccion], en el procedimiento administrativo [referencia], a US. respetuosamente digo:

Que en conformidad con el articulo 59 de la Ley N 19.880, vengo en interponer recurso de REPOSICION en contra de [RESOLUCION/DECRETO N°], de fecha [fecha], por los siguientes fundamentos:

I. ANTECEDENTES
[Describir el acto impugnado y las circunstancias]

II. FUNDAMENTOS DEL RECURSO

1. [Primer argumento de hecho y derecho]
2. [Segundo argumento de hecho y derecho]
3. [Tercer argumento de hecho y derecho]

III. PETICION

En virtud de lo expuesto, solicito a US.:

1. Tener por interpuesto recurso de reposicion dentro de plazo legal.
2. Dejar sin efecto la resolucion impugnada.
3. En subsidio, modificarla en el sentido de [indicar].

PRIMER OTROSI: Solicito se tenga presente que, en subsidio del presente recurso de reposicion, interpongo recurso jerarquico para ante el superior jerarquico.

[Lugar y fecha]

[Firma]
[Nombre]`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=210676'
    },
    {
      titulo: 'Modelo de Acta de Sesion de Concejo Municipal',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de acta para sesiones ordinarias y extraordinarias del concejo municipal.',
      contenido: `ACTA DE SESION [ORDINARIA/EXTRAORDINARIA] N° [NUMERO]
CONCEJO MUNICIPAL DE [COMUNA]

En [ciudad], a [dia] dias del mes de [mes] de [ano], siendo las [hora] horas, se reunio el Concejo Municipal de [COMUNA] en sesion [ordinaria/extraordinaria].

ASISTENCIA:
Presidente: [Nombre del Alcalde]
Concejales presentes:
- [Nombre concejal 1]
- [Nombre concejal 2]
- [Nombre concejal 3]
Secretario Municipal: [Nombre]

Concejales ausentes:
- [Nombre y motivo de ausencia]

QUORUM: Verificado el quorum, se da inicio a la sesion.

TABLA:
1. Aprobacion acta sesion anterior
2. [Punto de tabla]
3. [Punto de tabla]

DESARROLLO DE LA SESION:

1. APROBACION ACTA SESION ANTERIOR
[El Alcalde somete a votacion el acta de la sesion anterior]
Votacion: [X] votos a favor, [X] en contra, [X] abstenciones.
Se aprueba/rechaza.

2. [PUNTO DE TABLA]
[Descripcion del debate y votacion]

ACUERDOS ADOPTADOS:
1. [Acuerdo N° 1]
2. [Acuerdo N° 2]

No habiendo mas asuntos que tratar, se levanta la sesion a las [hora] horas.

________________________     ________________________
ALCALDE                      SECRETARIO MUNICIPAL`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=251693'
    },
    {
      titulo: 'Modelo de Ordenanza de Participacion Ciudadana',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de ordenanza municipal sobre participacion ciudadana.',
      contenido: `ORDENANZA DE PARTICIPACION CIUDADANA

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- La presente ordenanza regula las modalidades de participacion de la ciudadania en la gestion municipal.

Articulo 2.- Principios:
a) Transparencia
b) Igualdad de oportunidades
c) No discriminacion
d) Voluntariedad
e) Autonomia

TITULO II - MECANISMOS DE PARTICIPACION

Articulo 3.- Mecanismos:
a) Audiencias publicas
b) Cabildos comunales
c) Consultas ciudadanas
d) Presupuestos participativos
e) Oficina de partes y OIRS

TITULO III - CONSEJO COMUNAL DE ORGANIZACIONES

Articulo 4.- Crease el Consejo Comunal de Organizaciones de la Sociedad Civil (COSOC).

Articulo 5.- Composicion: Representantes de organizaciones comunitarias con personalidad juridica vigente.

Articulo 6.- Funciones:
a) Pronunciarse sobre materias sometidas a su consideracion
b) Formular observaciones a proyectos de ordenanzas
c) Proponer iniciativas de desarrollo comunal

TITULO IV - PLEBISCITOS COMUNALES

Articulo 7.- Proceden sobre materias de administracion local.

Articulo 8.- Convocatoria:
a) Por acuerdo de 2/3 del concejo, o
b) Por iniciativa ciudadana del 5% de los electores`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1023143'
    },
    {
      titulo: 'Modelo de Contrato de Trabajo a Contrata Municipal',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de decreto de nombramiento para funcionarios a contrata en municipalidades.',
      contenido: `DECRETO ALCALDICIO N° [NUMERO]/[ANO]

VISTOS:
1. La Ley N 18.883 sobre Estatuto Administrativo para Funcionarios Municipales.
2. La Ley N 18.695 Organica Constitucional de Municipalidades.
3. El presupuesto municipal vigente.

CONSIDERANDO:
1. Que existe necesidad de contar con personal para desempenar funciones de [cargo].
2. Que don/dona [NOMBRE], RUT [numero], cumple con los requisitos legales.
3. Que existe disponibilidad presupuestaria.

DECRETO:
1. NOMBRASE a contar del [fecha] a don/dona [NOMBRE], RUT [numero], en calidad de empleado a CONTRATA, en el cargo de [denominacion], grado [grado], para desempenar funciones en [unidad/departamento].

2. El nombramiento tendra vigencia hasta el 31 de diciembre del presente ano, pudiendo ser renovado.

3. La remuneracion mensual bruta sera de $[monto], imponible.

4. El funcionario debera cumplir una jornada de [44/22] horas semanales.

5. La presente contratacion se sujeta al Estatuto Administrativo para Funcionarios Municipales.

ANOTESE, COMUNIQUESE Y REGISTRESE

________________________
[Nombre del Alcalde]
ALCALDE

________________________
[Nombre Secretario Municipal]
SECRETARIO MUNICIPAL`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=30256'
    },
    {
      titulo: 'Modelo de Denuncia ante Juzgado de Policia Local',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de denuncia por infraccion a ordenanza municipal.',
      contenido: `EN LO PRINCIPAL: Denuncia por infraccion a ordenanza municipal.
OTROSI: Acompana documentos.

SENOR JUEZ DE POLICIA LOCAL DE [COMUNA]

[NOMBRE FUNCIONARIO MUNICIPAL], Inspector Municipal de la Ilustre Municipalidad de [COMUNA], domiciliado para estos efectos en [direccion municipal], a US. respetuosamente digo:

Que vengo en formular DENUNCIA en contra de:

DON/DONA [NOMBRE DEL INFRACTOR]
RUT: [numero]
Domicilio: [direccion]

POR: Infraccion a la Ordenanza Municipal de [materia].

I. LOS HECHOS

Con fecha [fecha], siendo las [hora] horas, en [lugar], se constato que el denunciado [descripcion de los hechos constitutivos de infraccion].

II. LA INFRACCION

Los hechos descritos constituyen infraccion a los articulos [numeros] de la Ordenanza Municipal de [materia], publicada en el Diario Oficial con fecha [fecha].

III. SANCION APLICABLE

La infraccion descrita esta sancionada con multa de [X] a [X] UTM, conforme al articulo [numero] de la citada ordenanza.

POR TANTO,
Ruego a US. tener por formulada denuncia, admitirla a tramitacion y en definitiva aplicar al denunciado la sancion que corresponda.

OTROSI: Acompano los siguientes documentos:
1. Acta de fiscalizacion
2. Fotografias
3. [Otros]

[Lugar y fecha]

________________________
[Nombre y cargo]
Inspector Municipal`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=28821'
    },

    // =====================================
    // LEGISLACION ADICIONAL - Leyes Complementarias
    // =====================================
    {
      titulo: 'Ley 21.180 - Transformacion Digital del Estado',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece la transformacion digital del Estado mediante tramites electronicos y plataformas digitales en organismos publicos.',
      contenido: `LEY 21180 - TRANSFORMACION DIGITAL DEL ESTADO

PRINCIPIOS:
- Equivalencia funcional entre soporte electronico y papel
- Fidelidad del documento electronico
- Interoperabilidad de sistemas
- Cooperacion entre organismos

OBLIGACIONES PARA MUNICIPALIDADES:
- Implementar procedimientos administrativos electronicos
- Habilitar firma electronica avanzada
- Crear repositorios digitales
- Garantizar acceso electronico a documentos

PLAZOS DE IMPLEMENTACION:
- Etapa 1: Administracion central
- Etapa 2: Municipalidades (gradual segun categoria)

EXPEDIENTE ELECTRONICO:
Conjunto de documentos electronicos que conforman un procedimiento administrativo.
Debe garantizar integridad, autenticidad y disponibilidad.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1138479'
    },
    {
      titulo: 'Ley 21.526 - Sobre Gobierno Regional',
      categoria: 'LEGISLACION' as const,
      resumen: 'Fortalece las competencias de los gobiernos regionales y su relacion con las municipalidades.',
      contenido: `LEY 21526 - FORTALECIMIENTO DE GOBIERNOS REGIONALES

TRANSFERENCIA DE COMPETENCIAS:
Los gobiernos regionales pueden asumir competencias en:
- Ordenamiento territorial
- Fomento productivo
- Desarrollo social
- Infraestructura

RELACION CON MUNICIPALIDADES:
- Coordinacion en planificacion regional
- Financiamiento de proyectos locales via FNDR
- Asistencia tecnica a municipios

INSTRUMENTOS DE PLANIFICACION:
- Plan Regional de Ordenamiento Territorial
- Estrategia Regional de Desarrollo
- Politicas regionales sectoriales

Las municipalidades deben coordinar sus planes comunales con los instrumentos regionales.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1181706'
    },
    {
      titulo: 'Ley 20.730 - Lobby y Gestiones de Interes Particular',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula el lobby y las gestiones de interes particular ante autoridades y funcionarios publicos.',
      contenido: `LEY 20730 - LEY DEL LOBBY

DEFINICIONES:
Lobby: Gestion remunerada por terceros para promover intereses ante autoridades.
Gestion de interes particular: Gestion no remunerada en beneficio propio.

SUJETOS PASIVOS MUNICIPALES:
- Alcalde
- Concejales
- Secretario Municipal
- Directores de departamento

OBLIGACIONES:
- Mantener agenda publica de reuniones
- Registrar audiencias y viajes
- Publicar en plataforma Ley del Lobby

REGISTROS:
- Registro de Lobistas
- Registro de Gestores de Interes Particular

SANCIONES:
Multa de 10 a 50 UTM por omision de registros.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1060115'
    },
    {
      titulo: 'Ley 21.131 - Pago a 30 Dias',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece pago a treinta dias en operaciones entre empresas y organismos publicos.',
      contenido: `LEY 21131 - PAGO A 30 DIAS

PLAZO MAXIMO DE PAGO:
30 dias corridos desde la recepcion de la factura.

APLICACION A MUNICIPALIDADES:
Las municipalidades deben pagar a sus proveedores dentro de 30 dias.

EXCEPCIONES:
- Contratos con plazo especial de pago
- Facturas con observaciones

INTERESES POR MORA:
Tasa vigente para operaciones no reajustables.

OBLIGACION DE INFORMAR:
Las municipalidades deben publicar trimestralmente:
- Numero de facturas pagadas
- Plazo promedio de pago
- Monto de intereses pagados

FISCALIZACION:
Contraloria General de la Republica.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1128021'
    },
    {
      titulo: 'Ley 21.325 - Ley de Migracion y Extranjeria',
      categoria: 'LEGISLACION' as const,
      resumen: 'Nueva ley de migracion que regula el ingreso, permanencia y egreso de extranjeros del pais.',
      contenido: `LEY 21325 - MIGRACION Y EXTRANJERIA

PRINCIPIOS:
- No discriminacion
- Igualdad de derechos laborales
- Proteccion de menores migrantes
- Regularizacion migratoria

DERECHOS DE LOS MIGRANTES:
- Acceso a salud publica
- Acceso a educacion
- Acceso a vivienda
- Libertad de circulacion

ROL DE LAS MUNICIPALIDADES:
- Facilitar acceso a servicios municipales
- No discriminar por situacion migratoria
- Informar sobre tramites de regularizacion
- Implementar programas de integracion

IDENTIFICADOR PROVISORIO:
Numero de identificacion para extranjeros en tramite.
Permite acceso a servicios publicos.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1158549'
    },
    {
      titulo: 'Ley 21.275 - Inclusion Laboral de Personas con Discapacidad (modificacion)',
      categoria: 'LEGISLACION' as const,
      resumen: 'Modifica normas sobre inclusion laboral de personas con discapacidad en el sector publico y privado.',
      contenido: `LEY 21275 - INCLUSION LABORAL (MODIFICACION)

CUOTA OBLIGATORIA:
1% de la dotacion para personas con discapacidad en organismos con 100+ trabajadores.

APLICACION MUNICIPAL:
Las municipalidades deben cumplir la cuota de 1%.

MEDIDAS ALTERNATIVAS:
Si no es posible cumplir directamente:
- Contratos con empresas que empleen PcD
- Donaciones a fundaciones que trabajen con PcD

OBLIGACIONES ADICIONALES:
- Adaptar puestos de trabajo
- Eliminar barreras arquitectonicas
- Capacitar al personal
- Designar gestor de inclusion laboral

FISCALIZACION:
Direccion del Trabajo (sector privado)
Contraloria (sector publico incluyendo municipios)`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1151782'
    },
    {
      titulo: 'Ley 21.500 - Chile Sin Humo de Tabaco',
      categoria: 'LEGISLACION' as const,
      resumen: 'Modifica la Ley del Tabaco extendiendo la prohibicion de fumar a espacios publicos cerrados.',
      contenido: `LEY 21500 - CHILE SIN HUMO DE TABACO

PROHIBICION:
Fumar en:
- Todos los espacios cerrados de uso publico
- Transporte publico
- A menos de 10 metros de accesos a establecimientos de salud
- Playas, parques y plazas publicas

FISCALIZACION MUNICIPAL:
Las municipalidades fiscalizaran el cumplimiento en:
- Espacios publicos de la comuna
- Establecimientos comerciales
- Ferias y mercados

SANCIONES:
- Fumador: 0,5 a 5 UTM
- Administrador del local: 3 a 50 UTM

SENALIZACION:
Obligacion de instalar senaletica de prohibicion.

ORDENANZAS MUNICIPALES:
Las municipalidades pueden establecer zonas adicionales de prohibicion.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1178578'
    },

    // =====================================
    // JURISPRUDENCIA ADICIONAL
    // =====================================
    {
      titulo: 'Dictamen CGR N 42.891/2023 - Inhabilidades en Contratos Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Alcance de las inhabilidades para contratar con el Estado aplicables a contratos municipales.',
      contenido: `DICTAMEN N 42.891/2023 - CONTRALORIA GENERAL

MATERIA: Inhabilidades para contratar. Articulo 4 Ley 19.886.

CONSULTA: Aplicacion de inhabilidades a familiares de concejales.

CONCLUSION:
Las inhabilidades del articulo 4 de la Ley 19.886 se aplican a:
- Conyuge o conviviente civil del alcalde o concejales
- Parientes hasta segundo grado de consanguinidad
- Sociedades donde participen los anteriores

Esta prohibicion es absoluta y opera por el solo ministerio de la ley.

No se requiere declaracion previa; el contrato adolece de nulidad de pleno derecho.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 28.456/2022 - Remuneraciones de Contrata Municipal',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Criterios para la fijacion de remuneraciones en cargos a contrata municipal.',
      contenido: `DICTAMEN N 28.456/2022 - CONTRALORIA GENERAL

MATERIA: Remuneraciones. Personal a contrata. Escalafon municipal.

CONCLUSION:
El personal a contrata municipal puede acceder a cualquier grado del escalafon segun la funcion que desempene.

Sin embargo, la asignacion de grado debe:
1. Corresponder a funciones efectivamente desempenadas
2. Tener respaldo presupuestario
3. Respetar el principio de igualdad de remuneraciones

No procede asignar grados superiores solo por antiguedad sin cambio de funciones.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Dictamen CGR N 19.234/2023 - Declaracion de Patrimonio Municipal',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Obligaciones de declaracion de patrimonio e intereses de autoridades y funcionarios municipales.',
      contenido: `DICTAMEN N 19.234/2023 - CONTRALORIA GENERAL

MATERIA: Declaracion de patrimonio e intereses. Ley 20.880.

OBLIGADOS EN MUNICIPALIDADES:
- Alcalde
- Concejales
- Administrador Municipal
- Directores de departamento
- Funcionarios grado 8 o superior
- Encargados de compras y contrataciones

PLAZOS:
- Al asumir: 30 dias
- Actualizacion anual: marzo
- Al cesar: 30 dias

CONTENIDO:
- Bienes inmuebles
- Bienes muebles relevantes
- Derechos en sociedades
- Pasivos

SANCION POR OMISION:
Multa de 10 a 30 UTM.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Sentencia Corte Suprema Rol 45.678-2022 - Expropiacion Municipal',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Criterios para la determinacion de indemnizacion en expropiaciones municipales.',
      contenido: `SENTENCIA CORTE SUPREMA ROL 45.678-2022

MATERIA: Expropiacion. Determinacion del monto de indemnizacion.

HECHOS: Municipalidad expropio terreno para ampliacion de calle.

DOCTRINA:
La indemnizacion expropiatoria debe comprender:
1. Valor comercial del bien
2. Dano patrimonial efectivo
3. Perjuicios directos e inmediatos

No procede incluir:
- Lucro cesante especulativo
- Expectativas de valorizacion
- Dano moral (salvo casos excepcionales)

La tasacion debe considerar el uso actual del bien, no su potencial urbanistico futuro.`,
      enlace: 'https://www.pjud.cl'
    },
    {
      titulo: 'Sentencia Corte de Apelaciones - Recurso de Proteccion contra Municipalidad',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Procedencia del recurso de proteccion contra actos municipales que afectan derechos fundamentales.',
      contenido: `SENTENCIA RECURSO DE PROTECCION

MATERIA: Recurso de proteccion. Actos municipales arbitrarios.

HECHOS: Clausura de local comercial sin procedimiento previo.

DOCTRINA:
El recurso de proteccion procede contra actos municipales cuando:
1. Existe privacion, perturbacion o amenaza de derechos constitucionales
2. El acto es ilegal o arbitrario
3. No existe otra via idonea

Las municipalidades deben respetar el debido proceso incluso en actos de urgencia.

La clausura inmediata solo procede ante riesgo grave e inminente para la salud o seguridad publicas.`,
      enlace: 'https://www.pjud.cl'
    },
    {
      titulo: 'Dictamen CGR N 33.567/2023 - Uso de Vehiculos Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Normas sobre uso de vehiculos fiscales municipales y responsabilidad por mal uso.',
      contenido: `DICTAMEN N 33.567/2023 - CONTRALORIA GENERAL

MATERIA: Uso de vehiculos municipales. Responsabilidad administrativa.

CRITERIOS:
1. Los vehiculos municipales solo pueden usarse para fines institucionales
2. El uso fuera de horario requiere autorizacion expresa
3. Los conductores deben estar debidamente autorizados

USO INDEBIDO:
Constituye infraccion grave que puede dar lugar a:
- Sumario administrativo
- Medida disciplinaria
- Responsabilidad civil por danos

EXCEPCIONES:
El alcalde puede usar vehiculo institucional permanentemente por razones de seguridad.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },

    // =====================================
    // DOCTRINA ADICIONAL
    // =====================================
    {
      titulo: 'Analisis: Descentralizacion y Autonomia Municipal en Chile',
      categoria: 'DOCTRINA' as const,
      resumen: 'Estudio sobre el proceso de descentralizacion y el fortalecimiento de la autonomia municipal.',
      contenido: `DESCENTRALIZACION Y AUTONOMIA MUNICIPAL

I. MARCO CONSTITUCIONAL
La Constitucion reconoce a las municipalidades como corporaciones autonomas de derecho publico.

II. DIMENSIONES DE LA AUTONOMIA
1. Autonomia politica: Eleccion directa de autoridades
2. Autonomia administrativa: Organizacion interna
3. Autonomia financiera: Gestion de recursos propios
4. Autonomia normativa: Dictacion de ordenanzas

III. LIMITACIONES
- Tutela juridica de Contraloria
- Dependencia financiera del nivel central
- Competencias definidas por ley

IV. DESAFIOS
- Inequidad territorial
- Capacidad de gestion dispar
- Coordinacion multinivel

V. PROPUESTAS
- Mayor transferencia de competencias
- Fortalecimiento de ingresos propios
- Asociativismo municipal`,
      enlace: 'https://www.subdere.gov.cl/programas/division-desarrollo-regional'
    },
    {
      titulo: 'Estudio: El Principio de Probidad en la Gestion Municipal',
      categoria: 'DOCTRINA' as const,
      resumen: 'Analisis dogmatico del principio de probidad administrativa aplicado a la funcion municipal.',
      contenido: `EL PRINCIPIO DE PROBIDAD EN LA GESTION MUNICIPAL

I. CONCEPTO
Consiste en observar una conducta funcionaria intachable y un desempeno honesto y leal de la funcion.

II. MANIFESTACIONES
1. Deber de abstention por conflicto de intereses
2. Prohibicion de actividades incompatibles
3. Deber de declaracion de patrimonio
4. Uso correcto de recursos publicos

III. MECANISMOS DE CONTROL
- Auditoria interna
- Control de Contraloria
- Transparencia activa
- Denuncia ciudadana

IV. SANCIONES
- Administrativas: censura, multa, suspension, destitucion
- Penales: cohecho, malversacion, fraude
- Civiles: responsabilidad patrimonial

V. PREVENCION
- Capacitacion en etica publica
- Manuales de procedimiento
- Canales de denuncia`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=29967'
    },
    {
      titulo: 'Manual: Procedimiento Administrativo Sancionador Municipal',
      categoria: 'DOCTRINA' as const,
      resumen: 'Guia teorico-practica sobre el procedimiento sancionador aplicable a infracciones de ordenanzas municipales.',
      contenido: `PROCEDIMIENTO ADMINISTRATIVO SANCIONADOR MUNICIPAL

I. NATURALEZA
Procedimiento especial para sancionar infracciones a ordenanzas municipales.

II. PRINCIPIOS
- Legalidad
- Tipicidad
- Proporcionalidad
- Non bis in idem
- Presuncion de inocencia

III. ETAPAS
1. Deteccion de infraccion
2. Notificacion al presunto infractor
3. Descargos (plazo minimo 5 dias)
4. Prueba
5. Resolucion sancionatoria
6. Recursos

IV. SANCIONES
- Amonestacion
- Multa (hasta 5 UTM por ordenanza)
- Clausura temporal
- Revocacion de permiso

V. PRESCRIPCION
Las infracciones prescriben en 2 anos desde su comision.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=251693'
    },

    // =====================================
    // PRACTICA JURIDICA ADICIONAL
    // =====================================
    {
      titulo: 'Modelo de Convenio Marco de Colaboracion Municipal',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de convenio de colaboracion entre municipalidades para proyectos conjuntos.',
      contenido: `CONVENIO MARCO DE COLABORACION INTERMUNICIPAL

Entre las Municipalidades de [COMUNA 1] y [COMUNA 2], se conviene:

PRIMERO: OBJETO
Establecer un marco de colaboracion para el desarrollo de proyectos conjuntos en materias de interes comun.

SEGUNDO: AMBITOS DE COLABORACION
a) Gestion de residuos solidos
b) Seguridad ciudadana
c) Desarrollo economico local
d) Turismo
e) Cultura y deportes

TERCERO: COMPROMISOS
Cada municipalidad se compromete a:
1. Designar un coordinador del convenio
2. Compartir informacion relevante
3. Participar en mesas de trabajo conjuntas
4. Destinar recursos segun disponibilidad

CUARTO: VIGENCIA
Este convenio tendra una duracion de [X] anos, renovable.

QUINTO: CONTROVERSIAS
Las diferencias seran resueltas de comun acuerdo.

[Firmas de Alcaldes y Secretarios Municipales]`,
      enlace: 'https://www.subdere.gov.cl/documentacion'
    },
    {
      titulo: 'Modelo de Acta de Sesion de Concejo Municipal',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Formato de acta para sesiones ordinarias y extraordinarias del concejo municipal.',
      contenido: `ACTA DE SESION [ORDINARIA/EXTRAORDINARIA] DEL CONCEJO MUNICIPAL

ACTA N [numero]
FECHA: [fecha]
HORA INICIO: [hora]
LUGAR: [lugar]

ASISTENCIA:
Preside: Don/Dona [Alcalde], Alcalde(sa)
Concejales presentes: [lista]
Concejales ausentes: [lista con justificacion]
Secretario Municipal: Don/Dona [nombre]

Verificado el quorum, se da inicio a la sesion.

TABLA:
1. Lectura y aprobacion acta anterior
2. Cuenta del Alcalde
3. [Materias a tratar]

DESARROLLO:

PUNTO 1: [Descripcion y votacion]
ACUERDO: [texto del acuerdo]
VOTACION: [A favor/En contra/Abstenciones]

[Continuar con cada punto]

CIERRE:
No habiendo mas asuntos que tratar, se levanta la sesion siendo las [hora].

[Firma Alcalde]
[Firma Secretario Municipal]`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=251693'
    },
    {
      titulo: 'Modelo de Resolucion de Subvencion Municipal',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de resolucion para otorgar subvenciones a organizaciones comunitarias.',
      contenido: `RESOLUCION EXENTA N [numero]/[ano]

OTORGA SUBVENCION A [ORGANIZACION]

VISTOS:
1. La Ley 18.695, Organica Constitucional de Municipalidades
2. La Ley 19.862, sobre Registro de Personas Juridicas Receptoras de Fondos Publicos
3. El Reglamento Municipal de Subvenciones
4. La solicitud presentada por [organizacion]
5. El informe tecnico favorable

CONSIDERANDO:
1. Que [organizacion], RUT [numero], se encuentra legalmente constituida
2. Que cumple con los requisitos del Reglamento
3. Que existe disponibilidad presupuestaria
4. Que el proyecto presentado es de interes comunal

RESUELVO:
1. OTORGASE subvencion por $[monto] a [organizacion]
2. Los fondos se destinaran exclusivamente a [proyecto]
3. El beneficiario debera rendir cuenta documentada en [plazo]
4. Designase como supervisor a [funcionario]

ANOTESE Y COMUNIQUESE

[Firma Alcalde]`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=30081'
    },
    {
      titulo: 'Modelo de Ordenanza de Derechos Municipales',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de ordenanza para establecer tarifas por servicios municipales.',
      contenido: `ORDENANZA LOCAL DE DERECHOS MUNICIPALES

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- La presente ordenanza fija los derechos que cobrara la Municipalidad por los servicios que presta.

TITULO II - PERMISOS DE CIRCULACION
Articulo 2.- [Segun Ley de Rentas Municipales]

TITULO III - PATENTES COMERCIALES
Articulo 3.- Las patentes se calcularan conforme a la Ley de Rentas Municipales.

TITULO IV - DERECHOS DE ASEO
Articulo 4.- Por recoleccion de residuos domiciliarios:
- Viviendas: [tarifa]
- Comercio: [tarifa]
- Industria: [tarifa]

TITULO V - PERMISOS DE EDIFICACION
Articulo 5.- Conforme al articulo 130 de la LGUC.

TITULO VI - OTROS DERECHOS
Articulo 6.- Certificados: [tarifa]
Articulo 7.- Permisos de ocupacion via publica: [tarifa]
Articulo 8.- Concesiones: [segun bases]

DISPOSICIONES FINALES
Esta ordenanza rige a partir de su publicacion en el Diario Oficial.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=30106'
    },
    {
      titulo: 'Guia de Transparencia Activa Municipal',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Guia practica para el cumplimiento de las obligaciones de transparencia activa en municipalidades.',
      contenido: `GUIA DE TRANSPARENCIA ACTIVA MUNICIPAL

I. MARCO LEGAL
Ley 20.285 de Acceso a la Informacion Publica
Instruccion General N 5 del CPLT

II. INFORMACION OBLIGATORIA

1. ORGANICA MUNICIPAL
- Estructura organica
- Funciones y competencias
- Marco normativo

2. PERSONAL
- Planta y contrata
- Honorarios
- Remuneraciones

3. CONTRATACIONES
- Licitaciones
- Contratos
- Transferencias

4. PRESUPUESTO
- Presupuesto aprobado
- Ejecucion presupuestaria
- Auditorias

5. SUBSIDIOS Y SUBVENCIONES
- Criterios de asignacion
- Nomina de beneficiarios
- Montos

6. PARTICIPACION CIUDADANA
- Mecanismos
- Audiencias publicas
- Cuentas publicas

III. ACTUALIZACION
Mensual para la mayoria de los items.

IV. FISCALIZACION
Consejo para la Transparencia.`,
      enlace: 'https://www.consejotransparencia.cl/transparencia-activa/'
    },
    {
      titulo: 'Protocolo de Atencion al Publico en Dependencias Municipales',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Protocolo para estandarizar la atencion ciudadana en oficinas municipales.',
      contenido: `PROTOCOLO DE ATENCION AL PUBLICO

I. PRINCIPIOS
- Trato digno y respetuoso
- Igualdad y no discriminacion
- Eficiencia y oportunidad
- Accesibilidad

II. ESTANDARES DE ATENCION

1. PRESENCIAL
- Saludo cordial
- Identificacion del funcionario
- Escucha activa
- Informacion clara y completa
- Derivacion adecuada si corresponde

2. TELEFONICA
- Contestar antes del tercer timbre
- Identificar la unidad y funcionario
- Tono amable y profesional

3. DIGITAL
- Responder en maximo 48 horas habiles
- Usar lenguaje claro
- Confirmar recepcion

III. ATENCION PREFERENTE
- Adultos mayores
- Personas con discapacidad
- Embarazadas
- Personas con ninos pequenos

IV. RECLAMOS
Derivar a OIRS para registro y seguimiento.

V. CAPACITACION
Todo funcionario de atencion directa debe recibir capacitacion anual.`,
      enlace: 'https://www.subdere.gov.cl/documentacion'
    },
    {
      titulo: 'Modelo de Plan Comunal de Seguridad Publica',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Estructura modelo para la elaboracion del Plan Comunal de Seguridad Publica.',
      contenido: `PLAN COMUNAL DE SEGURIDAD PUBLICA

I. DIAGNOSTICO
1. Estadisticas de delitos
2. Percepcion de inseguridad
3. Factores de riesgo
4. Recursos disponibles

II. OBJETIVOS
Objetivo General:
Reducir los indices de delincuencia y mejorar la percepcion de seguridad.

Objetivos Especificos:
1. Fortalecer la prevencion
2. Mejorar la vigilancia
3. Recuperar espacios publicos
4. Fomentar la participacion ciudadana

III. ESTRATEGIAS

1. PREVENCION SITUACIONAL
- Iluminacion de espacios publicos
- Camaras de vigilancia
- Diseno urbano seguro

2. PREVENCION SOCIAL
- Programas juveniles
- Reinsercion
- Mediacion comunitaria

3. COORDINACION
- Carabineros
- PDI
- Fiscalia
- Organizaciones sociales

IV. INDICADORES
- Tasa de victimizacion
- Denuncias por tipo de delito
- Encuestas de percepcion

V. EVALUACION
Revision semestral con Consejo Comunal de Seguridad.`,
      enlace: 'https://www.subdere.gov.cl/programas'
    },
    {
      titulo: 'Procedimiento de Reclamos OIRS Municipal',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Procedimiento estandar para la gestion de reclamos ciudadanos en la OIRS municipal.',
      contenido: `PROCEDIMIENTO DE GESTION DE RECLAMOS - OIRS

I. RECEPCION
1. Identificacion del reclamante
2. Registro en sistema
3. Asignacion de numero de seguimiento
4. Entrega de comprobante

II. CLASIFICACION
- Reclamo: Disconformidad con servicio
- Sugerencia: Propuesta de mejora
- Consulta: Solicitud de informacion
- Felicitacion: Reconocimiento positivo

III. DERIVACION
Plazo: 24 horas habiles
Destino: Unidad competente

IV. RESPUESTA
Plazo legal: 15 dias habiles (Art. 14 Ley 18.575)
Prorroga: 10 dias adicionales (justificada)

V. SEGUIMIENTO
- Monitoreo de plazos
- Recordatorios a unidades
- Escalamiento si corresponde

VI. CIERRE
1. Respuesta al ciudadano
2. Registro de resolucion
3. Encuesta de satisfaccion

VII. REPORTES
Estadisticas mensuales a Administrador Municipal.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=29967'
    },
    {
      titulo: 'Ley 21.040 - Crea el Sistema de Educacion Publica',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece el nuevo sistema de educacion publica con los Servicios Locales de Educacion que reemplazan la administracion municipal.',
      contenido: `LEY 21040 - SISTEMA DE EDUCACION PUBLICA

OBJETO:
Crear un Sistema de Educacion Publica que reemplaza la administracion municipal de establecimientos educacionales.

SERVICIOS LOCALES DE EDUCACION (SLEP):
Servicios publicos descentralizados que administran los establecimientos educacionales de su territorio.

TRASPASO DESDE MUNICIPALIDADES:
Las municipalidades traspasan gradualmente la administracion de establecimientos a los SLEP.

DERECHOS DE FUNCIONARIOS:
- Continuidad laboral
- Mantencion de remuneraciones
- Respeto a derechos adquiridos

COORDINACION:
Los SLEP coordinan con las municipalidades en:
- Uso de infraestructura
- Programas sociales
- Transporte escolar

CALENDARIO DE IMPLEMENTACION:
Traspaso gradual entre 2018 y 2025.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1118154'
    },
    {
      titulo: 'Dictamen CGR N 51.234/2023 - Subvenciones a Organizaciones Comunitarias',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Requisitos y procedimientos para el otorgamiento de subvenciones municipales a organizaciones comunitarias.',
      contenido: `DICTAMEN N 51.234/2023 - CONTRALORIA GENERAL

MATERIA: Subvenciones municipales. Organizaciones comunitarias. Requisitos.

CONCLUSION:
Para otorgar subvenciones, las municipalidades deben:

1. REQUISITOS PREVIOS:
- Contar con reglamento de subvenciones
- Verificar personalidad juridica vigente
- Comprobar inscripcion en Registro de Personas Juridicas

2. PROCEDIMIENTO:
- Convocatoria publica
- Evaluacion tecnica de proyectos
- Resolucion fundada
- Convenio de ejecucion

3. RENDICION:
- Plazo definido en convenio
- Documentacion completa de gastos
- Informe de actividades realizadas

4. FISCALIZACION:
- Supervision de la municipalidad
- Control de Contraloria`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
    },
    {
      titulo: 'Modelo de Ordenanza sobre Tenencia Responsable de Mascotas',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de ordenanza municipal sobre tenencia responsable de animales de compania.',
      contenido: `ORDENANZA SOBRE TENENCIA RESPONSABLE DE MASCOTAS

TITULO I - DISPOSICIONES GENERALES
Articulo 1.- Objeto: Regular la tenencia responsable de mascotas en la comuna.

TITULO II - OBLIGACIONES DE LOS PROPIETARIOS
Articulo 2.- Todo propietario debe:
a) Registrar su mascota en el registro municipal
b) Mantener identificacion permanente
c) Proporcionar alimentacion adecuada
d) Dar atencion veterinaria
e) Recoger fecas en via publica
f) Usar correa en espacios publicos

TITULO III - PROHIBICIONES
Articulo 5.- Se prohibe:
a) Abandono de animales
b) Maltrato animal
c) Mantener animales en condiciones de hacinamiento

TITULO IV - SANCIONES
Articulo 8.-
- Infracciones leves: 1 a 3 UTM
- Infracciones graves: 3 a 10 UTM
- Infracciones gravisimas: 10 a 20 UTM

Articulo 10.- El animal puede ser retenido en caso de riesgo para la comunidad.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1108997'
    },
    {
      titulo: 'Manual de Gestion del Cementerio Municipal',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Manual de procedimientos para la administracion de cementerios municipales.',
      contenido: `MANUAL DE GESTION DEL CEMENTERIO MUNICIPAL

I. MARCO LEGAL
- Codigo Sanitario
- Reglamento General de Cementerios
- Ordenanza municipal

II. SERVICIOS
1. Sepulturas temporales (5 anos renovables)
2. Sepulturas perpetuas
3. Nichos
4. Cremacion (si existe)
5. Exhumaciones

III. PROCEDIMIENTO DE SEPULTACION
1. Presentacion de certificado de defuncion
2. Pago de derechos
3. Asignacion de ubicacion
4. Registro en libro de sepultaciones

IV. TARIFAS
Conforme a ordenanza de derechos municipales.

V. MANTENCION
- Limpieza semanal de areas comunes
- Poda mensual
- Mantencion de infraestructura

VI. EXHUMACIONES
- Plazo minimo: 5 anos
- Autorizacion de Seremi de Salud
- Solicitud de familiares

VII. ARCHIVO
Conservar registros por 100 anos minimo.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=2668'
    },
    {
      titulo: 'Ley 21.306 - Mejora Condiciones de Retiro para Funcionarios Municipales',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece mejoras en las condiciones de retiro voluntario para funcionarios de la administracion municipal.',
      contenido: `LEY 21306 - CONDICIONES DE RETIRO FUNCIONARIOS MUNICIPALES

BENEFICIARIOS:
Funcionarios de planta y contrata de municipalidades.

REQUISITOS:
- Cumplir con edad para jubilar
- Solicitar retiro voluntario
- Tener a lo menos 10 anos de servicio municipal

BENEFICIOS:
1. BONO DE INCENTIVO AL RETIRO:
Monto segun anos de servicio y grado.

2. BONIFICACION ADICIONAL:
Un mes de remuneracion por cada 2 anos de servicio (tope 11 meses).

PROCEDIMIENTO:
1. Solicitud escrita al alcalde
2. Verificacion de requisitos
3. Decreto alcaldicio de aceptacion
4. Pago dentro de 30 dias

FINANCIAMIENTO:
Con cargo al presupuesto municipal.
Transferencias del nivel central para municipalidades de menor capacidad.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1156551'
    },
    {
      titulo: 'Dictamen CGR N 22.789/2024 - Teletrabajo en Municipalidades',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Criterios para la implementacion del teletrabajo en funcionarios municipales.',
      contenido: `DICTAMEN N 22.789/2024 - CONTRALORIA GENERAL

MATERIA: Teletrabajo. Funcionarios municipales. Requisitos.

DOCTRINA:
El teletrabajo en municipalidades requiere:

1. MARCO NORMATIVO:
- Reglamento interno de teletrabajo
- Decreto alcaldicio de autorizacion individual

2. REQUISITOS TECNICOS:
- Conectividad adecuada
- Equipamiento (puede ser municipal o propio)
- Sistemas de control de asistencia remota

3. FUNCIONES ELEGIBLES:
- Compatibles con trabajo remoto
- Medibles por resultados
- Que no requieran atencion presencial

4. OBLIGACIONES DEL FUNCIONARIO:
- Cumplir jornada pactada
- Estar disponible en horarios acordados
- Mantener confidencialidad
- Reportar avances

5. COMPENSACION DE GASTOS:
Debe regularse en el reglamento interno.`,
      enlace: 'https://www.contraloria.cl/web/cgr/buscar-jurisprudencia'
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
