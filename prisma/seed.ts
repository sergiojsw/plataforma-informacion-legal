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
  // DOCUMENTOS JURIDICOS REALES - BIBLIOTECA COMPLETA
  // =====================================================

  const documentos = [
    // =====================================
    // LEGISLACION MUNICIPAL FUNDAMENTAL
    // =====================================
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

TITULO III - DEL ALCALDE

Articulo 56.- El alcalde es la maxima autoridad de la municipalidad y en tal calidad le correspondera su direccion y administracion superior y la supervigilancia de su funcionamiento.

Articulo 63.- Son atribuciones del alcalde:
a) Representar judicial y extrajudicialmente a la municipalidad
b) Proponer al concejo la organizacion interna de la municipalidad
c) Nombrar y remover a los funcionarios de su dependencia
d) Velar por la observancia del principio de probidad administrativa
e) Administrar los recursos financieros de la municipalidad
f) Administrar los bienes municipales y nacionales de uso publico
g) Otorgar, renovar y poner termino a permisos municipales
h) Adquirir y enajenar bienes muebles
i) Dictar resoluciones obligatorias de caracter general o particular
j) Delegar el ejercicio de parte de sus atribuciones exclusivas en funcionarios de su dependencia`,
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

Articulo 4.- Principios del procedimiento:
- Escrituracion: El procedimiento administrativo y los actos administrativos seran escritos
- Gratuidad: En el procedimiento administrativo, las actuaciones que deban practicar los organos seran gratuitas para los interesados
- Celeridad: El procedimiento se impulsara de oficio en todos sus tramites
- Conclusion: Todo procedimiento administrativo debe finalizar con una decision expresa
- Economia procedimental: Evitar tramites dilatorios
- Contradictoriedad: Los interesados podran aducir alegaciones y aportar documentos
- Imparcialidad: La Administracion debe actuar con objetividad
- Abstension: Los funcionarios deben abstenerse cuando tengan interes personal
- No formalizacion: El procedimiento debe desarrollarse con sencillez y eficacia
- Inexcusabilidad: La Administracion esta obligada a dictar resolucion expresa
- Impugnabilidad: Todo acto administrativo es impugnable
- Transparencia y publicidad: El procedimiento administrativo se realizara con transparencia

TITULO III - DEL PROCEDIMIENTO ADMINISTRATIVO

Articulo 18.- El procedimiento podra iniciarse de oficio o a solicitud de persona interesada.

Articulo 23.- Los plazos de dias establecidos en esta ley son de dias habiles.

Articulo 24.- Los plazos se contaran desde el dia siguiente a aquel en que se notifique o publique el acto.

Articulo 27.- La Administracion esta obligada a dictar resolucion expresa en todos los procedimientos.

SILENCIO ADMINISTRATIVO

Articulo 64.- Silencio Positivo. Transcurrido el plazo legal para resolver sin pronunciamiento, el interesado podra denunciar el incumplimiento.

Articulo 65.- Silencio Negativo. Se entendera rechazada cuando afecte patrimonio fiscal.

RECURSOS ADMINISTRATIVOS

Articulo 59.- Recurso de Reposicion. Ante el mismo organo que dicto el acto, dentro de 5 dias.

Articulo 60.- Recurso Jerarquico. Ante el superior jerarquico, dentro de 5 dias desde el rechazo de la reposicion.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=210676'
    },
    {
      titulo: 'Ley 20.285 - Ley de Transparencia y Acceso a la Informacion Publica',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula el principio de transparencia de la funcion publica, el derecho de acceso a la informacion de los organos de la Administracion del Estado y los procedimientos para su ejercicio.',
      contenido: `LEY 20285 - TRANSPARENCIA DE LA FUNCION PUBLICA

TITULO I - NORMAS GENERALES

Articulo 1.- La presente ley regula el principio de transparencia de la funcion publica, el derecho de acceso a la informacion.

Articulo 2.- Las disposiciones de esta ley seran aplicables a los ministerios, intendencias, gobernaciones, servicios publicos, municipalidades.

TITULO II - TRANSPARENCIA ACTIVA

Articulo 7.- Los organos de la Administracion del Estado deberan mantener a disposicion permanente del publico, a traves de sus sitios electronicos:

a) Su estructura organica
b) Las facultades, funciones y atribuciones de cada unidad
c) El marco normativo que les sea aplicable
d) La planta del personal y el personal a contrata y a honorarios
e) Las contrataciones para el suministro de bienes muebles
f) Las transferencias de fondos publicos que efectuen
g) Los actos y resoluciones que tengan efectos sobre terceros
h) Los tramites y requisitos para tener acceso a los servicios
i) El diseno, montos asignados y criterio de acceso a los programas de subsidios
j) Los mecanismos de participacion ciudadana
k) La informacion sobre el presupuesto asignado
l) Los resultados de las auditorias al ejercicio presupuestario
m) Todas las entidades en que tengan participacion

TITULO III - DERECHO DE ACCESO A LA INFORMACION

Articulo 10.- Toda persona tiene derecho a solicitar y recibir informacion de cualquier organo de la Administracion del Estado.

Articulo 12.- La solicitud de acceso a la informacion sera formulada por escrito o por sitios electronicos.

Articulo 14.- La autoridad debera pronunciarse sobre la solicitud dentro del plazo de veinte dias habiles.

TITULO IV - EXCEPCIONES

Articulo 21.- Son causales de secreto o reserva:
1) Cuando su publicidad afecte el debido cumplimiento de las funciones del organo
2) Cuando afecte los derechos de las personas
3) Cuando afecte la seguridad de la Nacion
4) Cuando afecte el interes nacional
5) Cuando se trate de documentos declarados secretos por ley`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=276363'
    },
    {
      titulo: 'Ley 19.886 - Ley de Compras Publicas',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula los contratos que celebre la Administracion del Estado para el suministro de bienes, prestacion de servicios y ejecucion de obras. Establece el sistema ChileCompra.',
      contenido: `LEY 19886 - LEY DE BASES SOBRE CONTRATOS ADMINISTRATIVOS

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- Los contratos que celebre la Administracion del Estado, a titulo oneroso, para el suministro de bienes muebles, y de los servicios que se requieran, se ajustaran a las normas de esta ley.

Articulo 2.- Quedan excluidos:
a) Las contrataciones de personal
b) Los convenios que celebren entre si los organismos publicos

TITULO II - PROCEDIMIENTOS DE CONTRATACION

Articulo 5.- La Administracion adjudicara mediante licitacion publica, licitacion privada o contratacion directa.

La licitacion publica sera obligatoria cuando las contrataciones superen las 1.000 UTM.

LICITACION PUBLICA

Articulo 6.- Para proceder al llamado a licitacion publica sera necesario elaborar las bases administrativas y tecnicas.

Las bases deberan establecer:
a) Los requisitos y condiciones que deben cumplir los oferentes
b) Las especificaciones de los bienes y/o servicios
c) Las etapas y plazos de la licitacion
d) Los criterios de evaluacion
e) Los requisitos de admisibilidad de las ofertas
f) El monto y forma de la garantia

CONTRATACION DIRECTA

Articulo 8.- Procede la contratacion directa cuando:
a) El monto sea inferior a 100 UTM
b) Se trate de emergencia, urgencia o imprevisto
c) Exista un solo proveedor
d) Se trate de servicios de naturaleza confidencial

SISTEMA ELECTRONICO CHILECOMPRA

Articulo 19.- Crease un Sistema de Informacion de Compras denominado ChileCompra.

El Sistema sera de acceso publico y gratuito. Por su intermedio se publicaran las convocatorias.

GARANTIAS

Articulo 11.- Las garantias podran consistir en:
- Boleta de garantia bancaria
- Vale vista
- Poliza de seguro
- Deposito a plazo

Articulo 12.- La garantia de seriedad de la oferta sera equivalente al 1% al 5% del monto de la oferta.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=213004'
    },
    {
      titulo: 'DFL 1-19.653 - Estatuto Administrativo',
      categoria: 'LEGISLACION' as const,
      resumen: 'Fija el texto refundido de la Ley 18.834 sobre Estatuto Administrativo. Regula la carrera funcionaria, derechos, obligaciones y responsabilidad de los funcionarios publicos.',
      contenido: `DFL 1-19653 - ESTATUTO ADMINISTRATIVO

TITULO I - NORMAS GENERALES

Articulo 1.- Las relaciones entre el Estado y el personal de los Ministerios, Intendencias, Gobernaciones y de los servicios publicos se regularan por este Estatuto.

TITULO II - DE LA CARRERA FUNCIONARIA

Articulo 3.- Definiciones:
a) Cargo publico: Es aquel que se contempla en las plantas o como empleos a contrata
b) Planta de personal: Es el conjunto de cargos permanentes
c) Empleo a contrata: Es aquel de caracter transitorio
d) Carrera funcionaria: Sistema integral de regulacion del empleo publico

Articulo 12.- Para ingresar a la Administracion se requiere:
a) Ser ciudadano
b) Haber cumplido con la ley de reclutamiento
c) Tener salud compatible con el desempeno del cargo
d) Haber aprobado la educacion basica
e) No haber cesado en un cargo publico por calificacion deficiente
f) No estar inhabilitado para el ejercicio de funciones publicas

TITULO III - DE LAS OBLIGACIONES FUNCIONARIAS

Articulo 61.- Seran obligaciones de cada funcionario:
a) Desempenar personalmente las funciones del cargo
b) Orientar el desarrollo de sus funciones al cumplimiento de los objetivos
c) Realizar sus labores con esmero, cortesia, dedicacion y eficiencia
d) Cumplir la jornada de trabajo
e) Cumplir las destinaciones y comisiones de servicio
f) Obedecer las ordenes impartidas por el superior jerarquico
g) Observar estrictamente el principio de probidad administrativa
h) Guardar secreto en los asuntos que revistan caracter de reservados

TITULO IV - DE LOS DERECHOS FUNCIONARIOS

Articulo 89.- Todo funcionario tendra derecho a gozar de estabilidad en el empleo.

Articulo 90.- Todo funcionario tendra derecho a percibir las remuneraciones establecidas.

Articulo 97.- Los funcionarios tendran derecho a feriado con goce de remuneraciones.

Articulo 104.- Los funcionarios tendran derecho a licencia medica.

TITULO V - DE LA RESPONSABILIDAD ADMINISTRATIVA

Articulo 119.- La responsabilidad administrativa se hara efectiva con sujecion a las normas de este Estatuto.

Articulo 121.- Los funcionarios incurriran en responsabilidad administrativa cuando:
- Infrinjan sus obligaciones o deberes funcionarios
- No cumplan las prohibiciones

Articulo 125.- Las medidas disciplinarias son:
a) Censura
b) Multa
c) Suspension del empleo
d) Destitucion`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=236392'
    },
    {
      titulo: 'Ley 21.389 - Registro Nacional de Deudores de Pensiones de Alimentos',
      categoria: 'LEGISLACION' as const,
      resumen: 'Crea el Registro Nacional de Deudores de Pensiones de Alimentos y establece mecanismos de cumplimiento. Afecta tramites municipales como licencias de conducir.',
      contenido: `LEY 21389 - REGISTRO NACIONAL DE DEUDORES DE PENSIONES DE ALIMENTOS

Articulo 1.- Crease el Registro Nacional de Deudores de Pensiones de Alimentos, administrado por el Servicio de Registro Civil e Identificacion.

Articulo 2.- Seran incorporadas al Registro las personas que adeuden pensiones alimenticias decretadas judicialmente.

Articulo 3.- La incorporacion al Registro producira los siguientes efectos:

a) El deudor no podra ser designado en cargos de la Administracion del Estado, incluidas las municipalidades.

b) El deudor no podra renovar su licencia de conducir. Las municipalidades deberan verificar en el Registro antes de emitir o renovar licencias.

c) El deudor no podra obtener pasaporte.

d) El deudor no podra ser candidato a cargos de eleccion popular.

e) El deudor no podra acceder a creditos otorgados por bancos.

CONSULTA OBLIGATORIA POR MUNICIPALIDADES

Articulo 12.- Las municipalidades, previo a la emision o renovacion de licencias de conducir, deberan consultar el Registro.

En caso de estar inscrito, no podra procederse a la emision o renovacion hasta acreditar haber solucionado la deuda.

RETENCIONES

Articulo 18.- Los empleadores que tengan a su cargo el pago de remuneraciones a un deudor inscrito en el Registro, deberan retener de su remuneracion el monto correspondiente.

Articulo 19.- El Servicio de Tesorerías retendra las devoluciones de impuestos.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1165084'
    },
    {
      titulo: 'Ley 18.575 - Ley Organica Constitucional de Bases Generales de la Administracion del Estado',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece la organizacion basica de la Administracion del Estado, principios que rigen la funcion publica, probidad administrativa y control.',
      contenido: `LEY 18575 - BASES GENERALES DE LA ADMINISTRACION DEL ESTADO

TITULO I - NORMAS GENERALES

Articulo 1.- El Presidente de la Republica ejerce el gobierno y la administracion del Estado con la colaboracion de los organos que establezcan la Constitucion y las leyes.

La Administracion del Estado estara constituida por los Ministerios, las Intendencias, las Gobernaciones y los organos y servicios publicos creados para el cumplimiento de la funcion administrativa, incluidos la Contraloria General de la Republica, el Banco Central, las Fuerzas Armadas y las Fuerzas de Orden y Seguridad publica, los Gobiernos Regionales, las Municipalidades y las empresas publicas creadas por ley.

Articulo 3.- La Administracion del Estado esta al servicio de la persona humana; su finalidad es promover el bien comun.

Articulo 5.- Las autoridades y funcionarios deberan velar por la eficiente e idonea administracion de los medios publicos y por el debido cumplimiento de la funcion publica.

TITULO II - DE LA ORGANIZACION Y FUNCIONAMIENTO

Articulo 21.- La organizacion basica de los Ministerios, las Intendencias, las Gobernaciones y los servicios publicos sera la siguiente:
a) El Ministro, el Intendente, el Gobernador o el jefe superior del servicio
b) Las unidades o departamentos funcionales

TITULO III - DE LA PROBIDAD ADMINISTRATIVA

Articulo 52.- El principio de probidad administrativa consiste en observar una conducta funcionaria intachable y un desempeno honesto y leal de la funcion o cargo, con preeminencia del interes general sobre el particular.

Articulo 62.- Contravienen especialmente el principio de probidad:
1) Usar en beneficio propio o de terceros la informacion reservada o privilegiada
2) Hacer valer indebidamente la posicion funcionaria
3) Emplear bienes de la institucion en provecho propio
4) Ejecutar actividades, ocupar tiempo de la jornada de trabajo o utilizar personal para fines ajenos
5) Solicitar, hacerse prometer o aceptar donativos, ventajas o privilegios
6) Intervenir en asuntos en que se tenga interes personal`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=29967'
    },
    {
      titulo: 'DL 3.063 - Ley de Rentas Municipales',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece las normas sobre rentas municipales, patentes comerciales, permisos de circulacion y demas ingresos de las municipalidades.',
      contenido: `DL 3063 - LEY DE RENTAS MUNICIPALES

TITULO I - DE LAS RENTAS MUNICIPALES

Articulo 1.- Constituyen rentas municipales:
a) El producto de los bienes municipales
b) El impuesto territorial
c) El producto de las patentes comerciales
d) El producto de los permisos de circulacion
e) Las multas e intereses establecidos a su favor
f) Las subvenciones y aportes del Estado
g) El producto de las concesiones

TITULO II - DE LAS PATENTES MUNICIPALES

Articulo 23.- El ejercicio de toda profesion, oficio, industria, comercio, arte u otra actividad lucrativa esta sujeto a una contribucion de patente municipal.

Articulo 24.- La patente grava la actividad que se ejerce por un mismo contribuyente, en su local, oficina, establecimiento, kiosco o lugar determinado.

Articulo 25.- El monto de las patentes sera de un porcentaje sobre el capital propio de cada contribuyente, con un minimo de una UTM y un maximo de 8.000 UTM.

Articulo 26.- Las patentes profesionales tendran un valor unico anual.

TITULO III - DE LOS PERMISOS DE CIRCULACION

Articulo 12.- Los vehiculos que circulen por calles, caminos y vias publicas estaran gravados con un impuesto anual denominado "permiso de circulacion".

Articulo 13.- El valor del permiso de circulacion sera de un porcentaje del precio corriente en plaza del vehiculo.

TITULO IV - DE LA ADMINISTRACION FINANCIERA

Articulo 57.- Los municipios prepararan anualmente un presupuesto de ingresos y gastos.

Articulo 58.- El presupuesto debera ser aprobado por el concejo municipal.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=6879'
    },
    {
      titulo: 'Ley 20.730 - Ley del Lobby',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula el lobby y las gestiones que representen intereses particulares ante las autoridades y funcionarios. Establece registros publicos y sanciones.',
      contenido: `LEY 20730 - REGULA EL LOBBY

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- Esta ley regula la publicidad de las audiencias y reuniones que tengan las autoridades y funcionarios con personas que realicen lobby o gestiones de interes particular.

Articulo 2.- Se entiende por lobby aquella gestion o actividad remunerada, ejercida por personas naturales o juridicas, chilenas o extranjeras, que tiene por objeto promover, defender o representar cualquier interes particular.

Articulo 3.- Se entiende por gestion de interes particular aquella gestion no remunerada que tiene los mismos objetivos.

TITULO II - DE LOS SUJETOS PASIVOS

Articulo 4.- Son sujetos pasivos de esta ley:
a) Ministros, subsecretarios, jefes de servicio
b) Embajadores, consejeros y personal diplomatico
c) Intendentes, gobernadores, consejeros regionales, secretarios regionales
d) Alcaldes, concejales, consejeros de las corporaciones de asistencia judicial
e) Directores de empresas del Estado y de sociedades en que este tenga participacion
f) Oficiales de las Fuerzas Armadas y de Orden

TITULO III - DE LOS REGISTROS PUBLICOS

Articulo 8.- Los sujetos pasivos deberan registrar las audiencias y reuniones sostenidas que tengan por objeto el lobby o la gestion de intereses particulares.

Articulo 9.- Los registros deberan publicarse en los sitios electronicos de los organos respectivos.

Articulo 13.- Los sujetos activos que ejerzan lobby deberan inscribirse en un registro publico administrado por el Consejo para la Transparencia.

TITULO IV - SANCIONES

Articulo 16.- La infraccion a las normas de esta ley sera sancionada con multa de 10 a 50 UTM, y en caso de reincidencia, de 50 a 100 UTM.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1060115'
    },
    {
      titulo: 'Ley 20.500 - Participacion Ciudadana en la Gestion Publica',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece normas sobre asociaciones y participacion ciudadana en la gestion publica, creando los Consejos de la Sociedad Civil.',
      contenido: `LEY 20500 - PARTICIPACION CIUDADANA EN LA GESTION PUBLICA

TITULO I - DE LAS ASOCIACIONES

Articulo 1.- Todas las personas tienen derecho a asociarse libremente para la consecucion de fines licitos.

Articulo 2.- Las asociaciones se regiran por las disposiciones de esta ley, las de sus estatutos y las demas normas legales pertinentes.

Articulo 8.- Las municipalidades podran establecer, en el ambito de su respectivo territorio, un registro publico de personas juridicas sin fines de lucro.

TITULO II - DE LA PARTICIPACION CIUDADANA

Articulo 69.- El Estado reconoce a las personas el derecho de participar en sus politicas, planes, programas y acciones.

Cada organo de la Administracion del Estado debera establecer las modalidades formales y especificas de participacion.

Articulo 70.- Cada organo de la Administracion del Estado debera poner en conocimiento publico informacion relevante acerca de sus politicas, planes, programas, acciones y presupuestos.

Articulo 72.- Los organos de la Administracion del Estado senalaran aquellas materias de interes ciudadano en que se requiera conocer la opinion de las personas.

Articulo 74.- Los organos de la Administracion del Estado deberan establecer consejos de la sociedad civil, de caracter consultivo, que estaran conformados de manera diversa, representativa y pluralista por integrantes de asociaciones sin fines de lucro.

EN EL AMBITO MUNICIPAL

Articulo 94.- Crease un consejo comunal de organizaciones de la sociedad civil en cada comuna.

Articulo 95.- El consejo comunal de organizaciones de la sociedad civil sera un organo asesor de la municipalidad.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1023143'
    },
    {
      titulo: 'Ley 21.180 - Ley de Transformacion Digital del Estado',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece la transformacion digital del Estado mediante el uso de documentos electronicos, firma electronica y procedimientos electronicos.',
      contenido: `LEY 21180 - TRANSFORMACION DIGITAL DEL ESTADO

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- Esta ley tiene por objeto establecer la transformacion digital del Estado.

Se entendera por transformacion digital del Estado la digitalizacion integral de los procedimientos administrativos, registros, actuaciones y expedientes de los organos de la Administracion del Estado.

Articulo 2.- Los organos de la Administracion del Estado deberan disponer y utilizar plataformas electronicas para efectuar sus comunicaciones y notificaciones.

TITULO II - DEL PROCEDIMIENTO ADMINISTRATIVO ELECTRONICO

Articulo 16 bis.- El procedimiento administrativo podra realizarse a traves de tecnicas y medios electronicos.

Los actos administrativos, resoluciones, los documentos que los sustentan y que consten en soporte electronico, seran validos y produciran los mismos efectos que los expedidos en soporte de papel.

Articulo 16 ter.- El expediente electronico estara compuesto por documentos electronicos.

Articulo 16 quater.- El expediente electronico asegurara la reproduccion de su contenido, la integridad de los documentos que lo componen y el enlace correcto entre ellos.

TITULO III - DE LAS NOTIFICACIONES ELECTRONICAS

Articulo 46 bis.- Las notificaciones se practicaran por medios electronicos, a la direccion electronica que el interesado hubiere registrado.

La notificacion se entendera practicada al quinto dia siguiente a aquel en que el documento fue ingresado en la bandeja del destinatario.

Articulo 46 ter.- Los organos de la Administracion del Estado deberan disponer de una plataforma electronica que permita la notificacion de los actos administrativos.

DISPOSICIONES TRANSITORIAS

Las municipalidades tendran un plazo de 5 anos para implementar integralmente la transformacion digital.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1138479'
    },
    {
      titulo: 'Ley 19.300 - Ley de Bases Generales del Medio Ambiente',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece el derecho a vivir en un medio ambiente libre de contaminacion, el Sistema de Evaluacion de Impacto Ambiental y normas de participacion ciudadana.',
      contenido: `LEY 19300 - BASES GENERALES DEL MEDIO AMBIENTE

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- El derecho a vivir en un medio ambiente libre de contaminacion, la proteccion del medio ambiente, la preservacion de la naturaleza y la conservacion del patrimonio ambiental se regularan por las disposiciones de esta ley.

Articulo 2.- Definiciones:
- Contaminacion: presencia en el ambiente de elementos o combinaciones de elementos
- Dano Ambiental: toda perdida, disminucion, detrimento o menoscabo significativo
- Desarrollo Sustentable: proceso de mejoramiento sostenido y equitativo de la calidad de vida
- Educacion Ambiental: proceso permanente de caracter interdisciplinario
- Estudio de Impacto Ambiental: documento que describe el proyecto o actividad
- Impacto Ambiental: la alteracion del medio ambiente

TITULO II - DEL SISTEMA DE EVALUACION DE IMPACTO AMBIENTAL

Articulo 8.- Los proyectos o actividades senalados en el articulo 10 solo podran ejecutarse o modificarse previa evaluacion de su impacto ambiental.

Articulo 10.- Los proyectos o actividades susceptibles de causar impacto ambiental, en cualesquiera de sus fases, deberan someterse al sistema de evaluacion de impacto ambiental:
a) Acueductos, embalses o tranques
b) Lineas de transmision electrica de alto voltaje
c) Centrales generadoras de energia mayores a 3 MW
d) Reactores y establecimientos nucleares
e) Aeropuertos, terminales de buses
f) Proyectos de desarrollo urbano o turistico
g) Proyectos industriales o inmobiliarios

TITULO III - DE LA PARTICIPACION DE LA COMUNIDAD

Articulo 26.- Cualquier persona, natural o juridica, podra formular observaciones al Estudio de Impacto Ambiental.

Articulo 27.- Las observaciones de los ciudadanos seran ponderadas en los fundamentos de la resolucion de calificacion ambiental.

TITULO IV - DE LAS NORMAS DE CALIDAD AMBIENTAL

Articulo 32.- Las normas primarias de calidad ambiental se dictaran mediante decreto supremo.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=30667'
    },
    {
      titulo: 'Ley 19.418 - Ley de Juntas de Vecinos y Organizaciones Comunitarias',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula las juntas de vecinos y demas organizaciones comunitarias, su constitucion, funcionamiento y relacion con las municipalidades.',
      contenido: `LEY 19418 - JUNTAS DE VECINOS Y ORGANIZACIONES COMUNITARIAS

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- Las juntas de vecinos son organizaciones comunitarias de caracter territorial representativas de las personas que residen en una misma unidad vecinal.

Articulo 2.- Las organizaciones comunitarias funcionales son aquellas con personalidad juridica y sin fines de lucro, que tengan por objeto representar y promover valores e intereses especificos de la comunidad dentro del territorio de la comuna.

TITULO II - DE LAS JUNTAS DE VECINOS

Articulo 4.- Cada junta de vecinos estara constituida por los vecinos mayores de 14 anos de edad que residan en la respectiva unidad vecinal.

Articulo 5.- Cada unidad vecinal sera determinada por el alcalde, con acuerdo del concejo.

Articulo 6.- La junta de vecinos tendra las siguientes funciones:
a) Representar a los vecinos ante las autoridades
b) Promover la integracion, participacion y desarrollo de los habitantes
c) Velar por la integracion al desarrollo y el mejoramiento de las condiciones de vida
d) Promover el progreso urbanistico, economico, social y cultural
e) Gestionar la solucion de los asuntos o problemas que afecten a la comunidad vecinal

TITULO III - DE LA CONSTITUCION Y PERSONALIDAD JURIDICA

Articulo 7.- Las juntas de vecinos y las demas organizaciones comunitarias se constituiran en asamblea que debera celebrarse ante el oficial del Registro Civil.

Articulo 8.- Las organizaciones comunitarias se inscribiran en un registro publico que llevara el Secretario Municipal.

TITULO IV - DE LOS DERECHOS DE LAS ORGANIZACIONES

Articulo 14.- Las organizaciones comunitarias con personalidad juridica tendran los siguientes derechos:
a) Presentar proyectos y proposiciones a la municipalidad
b) Ser informadas por la municipalidad sobre las materias que les conciernan
c) Participar en los programas municipales de capacitacion
d) Usar los bienes de la municipalidad

Articulo 22.- Las municipalidades deberan contemplar en sus presupuestos recursos para el Fondo de Desarrollo Vecinal destinado a financiar proyectos de las organizaciones comunitarias.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=70040'
    },
    {
      titulo: 'Ley 20.880 - Probidad en la Funcion Publica',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece normas sobre probidad en la funcion publica, regula los conflictos de intereses, declaraciones de patrimonio e intereses de autoridades.',
      contenido: `LEY 20880 - PROBIDAD EN LA FUNCION PUBLICA

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- Esta ley regula las declaraciones de intereses y patrimonio, los conflictos de intereses y otras materias relativas a la probidad en la funcion publica.

Articulo 2.- Se aplicara a:
a) El Presidente de la Republica
b) Los Ministros de Estado
c) Los Senadores y Diputados
d) Los Intendentes, Gobernadores y Consejeros Regionales
e) Los alcaldes, concejales y consejeros regionales
f) Los funcionarios de la Administracion del Estado
g) Los oficiales de las Fuerzas Armadas
h) Los funcionarios del Poder Judicial
i) Los fiscales del Ministerio Publico

TITULO II - DE LA DECLARACION DE INTERESES Y PATRIMONIO

Articulo 4.- Las autoridades y funcionarios senalados deberan efectuar una declaracion de intereses y patrimonio.

Articulo 5.- La declaracion de intereses contendra:
a) Las actividades profesionales y economicas
b) Las participaciones en personas juridicas
c) La pertenencia a directorios, consejos u organos

Articulo 6.- La declaracion de patrimonio contendra:
a) Los bienes inmuebles
b) Los vehiculos motorizados
c) Los valores y derechos
d) Los derechos en comunidades
e) Las obligaciones patrimoniales
f) Los bienes muebles registrables

TITULO III - DE LOS CONFLICTOS DE INTERESES

Articulo 11.- Existe conflicto de intereses cuando concurran, al mismo tiempo, el interes general propio del ejercicio de las funciones con el interes particular.

Articulo 12.- En caso de conflicto de intereses, el funcionario debera abstenerse de participar en la decision que pueda afectar su interes particular.

TITULO IV - SANCIONES

Articulo 17.- La infraccion a las normas de esta ley sera sancionada con multa de 10 a 30 UTM, tratandose de autoridades; y con amonestacion o multa de 1 a 15 UTM, tratandose de funcionarios.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1088051'
    },
    {
      titulo: 'Ley 21.020 - Tenencia Responsable de Mascotas y Animales de Compania',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece normas sobre tenencia responsable de mascotas, obligaciones de los tenedores, registro de animales y sanciones por maltrato.',
      contenido: `LEY 21020 - TENENCIA RESPONSABLE DE MASCOTAS

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- Esta ley establece normas destinadas a proteger la salud y el bienestar animal mediante la tenencia responsable de mascotas.

Articulo 2.- Se entiende por:
a) Mascota o animal de compania: aquel que vive con las personas
b) Animal comunitario: aquel que reside en espacios publicos
c) Tenedor responsable: persona que tenga a su cargo el cuidado de una mascota
d) Animal potencialmente peligroso: el que ha causado mordeduras o agresiones

TITULO II - OBLIGACIONES DE LOS TENEDORES

Articulo 3.- Todo tenedor responsable de una mascota debera:
a) Registrar a su mascota e identificarla con microchip
b) Alimentarla correctamente
c) Proporcionarle albergue adecuado
d) No someterla a malos tratos
e) Brindarle asistencia veterinaria preventiva y curativa
f) Recoger las deposiciones de su mascota en la via publica

Articulo 4.- Esta prohibido:
a) Abandonar a las mascotas
b) Hacer deambular a los perros fuera del acompanamiento de una persona responsable
c) Organizar peleas de animales
d) Criar animales en condiciones inadecuadas

TITULO III - DEL REGISTRO NACIONAL DE MASCOTAS

Articulo 5.- Crease el Registro Nacional de Mascotas, que sera administrado por el Servicio Agricola y Ganadero.

Articulo 6.- Las municipalidades mantendran registros comunales de mascotas y tendran facultades para fiscalizar el cumplimiento de esta ley.

TITULO IV - INFRACCIONES Y SANCIONES

Articulo 10.- Las infracciones se clasificaran en:
a) Leves: multa de 1 a 10 UTM
b) Graves: multa de 10 a 20 UTM
c) Gravisimas: multa de 20 a 30 UTM

Articulo 11.- El procedimiento de aplicacion de sanciones sera conocido por los juzgados de policia local.`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=1106037'
    },
    {
      titulo: 'Ley General de Urbanismo y Construcciones (DFL 458)',
      categoria: 'LEGISLACION' as const,
      resumen: 'Regula la planificacion urbana, permisos de edificacion, normas de construccion y facultades de las Direcciones de Obras Municipales.',
      contenido: `DFL 458 - LEY GENERAL DE URBANISMO Y CONSTRUCCIONES

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- Las disposiciones de la presente ley relativas a planificacion urbana, urbanizacion y construccion, y las de la Ordenanza General que contempla el articulo 2º, se aplicaran en todo el territorio nacional.

Articulo 2.- La Ordenanza General contendra las normas reglamentarias de esta ley.

Articulo 3.- La planificacion urbana se efectuara en cuatro niveles de accion:
a) Nacional
b) Regional
c) Intercomunal
d) Comunal

TITULO II - DE LA PLANIFICACION URBANA

Articulo 27.- Se entendera por Planificacion Urbana Comunal aquella que promueve el desarrollo armonico del territorio comunal.

Articulo 28.- El Plan Regulador es un instrumento constituido por un conjunto de normas sobre adecuadas condiciones de higiene y seguridad en los edificios.

Articulo 31.- El Plan Regulador Comunal sera confeccionado por la Municipalidad respectiva.

TITULO III - DE LA CONSTRUCCION

Articulo 116.- La construccion, reconstruccion, alteracion, ampliacion y demolicion de edificios requieren permiso de la Direccion de Obras Municipales.

Articulo 118.- Corresponde a la Direccion de Obras Municipales velar por el cumplimiento de esta ley y su ordenanza.

Articulo 119.- El Director de Obras Municipales podra ordenar la paralizacion de cualquiera obra que se ejecute en contravencion.

TITULO IV - DE LAS VIVIENDAS ECONOMICAS

Articulo 131.- Se entendera por vivienda economica la que tiene una superficie edificada no superior a 140 m2.

Articulo 134.- Las viviendas economicas gozaran de las siguientes franquicias:
a) Exencion del 50% del pago de derechos municipales
b) Exencion del pago de aporte al espacio publico

DE LA DIRECCION DE OBRAS MUNICIPALES

Articulo 142.- En cada municipalidad habra una Direccion de Obras Municipales a cargo de un Director de Obras.

Articulo 143.- El Director de Obras Municipales tendra a su cargo:
a) Informar sobre las condiciones de los bienes raices
b) Otorgar los permisos de edificacion
c) Fiscalizar la ejecucion de las obras
d) Recibir las obras terminadas`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=13560'
    },
    {
      titulo: 'Ley 18.883 - Estatuto Administrativo para Funcionarios Municipales',
      categoria: 'LEGISLACION' as const,
      resumen: 'Establece el estatuto que rige a los funcionarios municipales. Regula ingreso, carrera, derechos, obligaciones, calificaciones y cesacion de funciones.',
      contenido: `LEY 18883 - ESTATUTO ADMINISTRATIVO PARA FUNCIONARIOS MUNICIPALES

TITULO I - NORMAS GENERALES

Articulo 1.- Las relaciones entre las municipalidades y el personal de su dependencia se regularan por las normas de este Estatuto.

Articulo 2.- No se aplicaran las normas de este Estatuto al personal de las corporaciones, fundaciones o empresas municipales, el cual se regira por las normas laborales del sector privado.

Articulo 3.- Para los efectos de este Estatuto el significado legal de los terminos sera el siguiente:
a) Cargo publico municipal: aquel que contempla la planta municipal o es empleo a contrata
b) Planta del personal: conjunto de cargos permanentes asignados por ley a cada municipalidad
c) Empleo a contrata: aquel de caracter transitorio

TITULO II - DEL INGRESO A LAS MUNICIPALIDADES

Articulo 10.- Para ingresar a una municipalidad sera necesario:
a) Ser ciudadano
b) Haber cumplido con la ley de reclutamiento
c) Tener salud compatible con el desempeno del cargo
d) Cumplir con los requisitos de idoneidad que exija la ley
e) No haber cesado por calificacion deficiente

Articulo 14.- El ingreso a una planta municipal se efectuara por concurso publico.

TITULO III - DE LAS OBLIGACIONES FUNCIONARIAS

Articulo 58.- Seran obligaciones de cada funcionario:
a) Desempenar personalmente las funciones del cargo
b) Cumplir la jornada de trabajo
c) Obedecer las ordenes del superior jerarquico
d) Observar el principio de probidad administrativa
e) Guardar secreto

TITULO IV - DE LOS DERECHOS

Articulo 87.- El funcionario tiene derecho a gozar de estabilidad en el empleo.

Articulo 89.- Los funcionarios tendran derecho a feriado, con goce de remuneracion.

Articulo 94.- Los funcionarios tendran derecho a licencia medica.

TITULO V - DE LA CESACION DE FUNCIONES

Articulo 140.- El funcionario cesara en el cargo por:
a) Aceptacion de renuncia
b) Jubilacion, pension o renta vitalicia
c) Declaracion de vacancia
d) Destitucion
e) Supresion del empleo
f) Termino del periodo legal
g) Fallecimiento`,
      enlace: 'https://www.bcn.cl/leychile/navegar?idNorma=30256'
    },

    // =====================================
    // JURISPRUDENCIA ADMINISTRATIVA (CGR)
    // =====================================
    {
      titulo: 'Dictamen CGR N 31.636 de 2022 - Probidad en Licitaciones Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'La Contraloria establece que los funcionarios municipales deben abstenerse de participar en procesos de licitacion donde tengan conflicto de interes.',
      contenido: `DICTAMEN N 31.636 DE 2022 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Probidad administrativa en procesos de licitacion municipal. Conflicto de intereses. Deber de abstencion.

CONSIDERANDO:

1. Que el articulo 62 de la ley N 18.575 establece que contravienen especialmente el principio de probidad administrativa "intervenir en razon de las funciones, en asuntos en que se tenga interes personal o en que lo tengan el conyuge, hijos, adoptados o parientes hasta el tercer grado de consanguinidad y segundo de afinidad inclusive".

2. Que el articulo 12 de la ley N 19.880 consagra el principio de abstension.

3. Que la jurisprudencia administrativa ha sostenido reiteradamente que la infraccion al deber de abstension acarrea la nulidad del acto administrativo.

CONCLUSIONES:

1. Los funcionarios municipales que integren comisiones evaluadoras de licitaciones deben abstenerse de participar cuando tengan interes personal.

2. La participacion de un funcionario impedido constituye una infraccion grave al principio de probidad.

3. Corresponde al alcalde velar por el cumplimiento de estas normas.`,
      enlace: 'https://www.contraloria.cl/web/cgr/dictamenes'
    },
    {
      titulo: 'Dictamen CGR N 15.127 de 2023 - Patentes Comerciales y Giros Electronicos',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Pronunciamiento sobre la aplicacion del cobro de patentes municipales a empresas que operan exclusivamente por medios electronicos.',
      contenido: `DICTAMEN N 15.127 DE 2023 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Patentes municipales. Comercio electronico. Territorialidad del impuesto.

ANTECEDENTES:
Un municipio consulta sobre la procedencia de cobrar patente comercial a empresas de comercio electronico.

CONSIDERANDO:

1. Que conforme al articulo 23 del decreto ley N 3.063, el ejercicio de toda profesion, oficio, industria, comercio, arte u otra actividad lucrativa, esta sujeto a una contribucion de patente municipal.

2. Que el articulo 24 establece que la patente grava la actividad que se ejerce en su local, oficina, establecimiento, kiosco o lugar determinado.

CONCLUSIONES:

1. Las empresas que operan exclusivamente a traves de plataformas electronicas quedan sujetas al pago de patente municipal en la comuna donde tengan su domicilio comercial o fiscal.

2. No procede que una municipalidad cobre patente a una empresa por el solo hecho de que venda a los habitantes de su comuna si no tiene establecimiento en el territorio comunal.

3. En caso de empresas que mantengan bodegas o centros de distribucion, correspondera el pago de patente a dicho municipio.`,
      enlace: 'https://www.contraloria.cl/web/cgr/dictamenes'
    },
    {
      titulo: 'Dictamen CGR N 22.450 de 2024 - Teletrabajo en Funcionarios Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Establece criterios para la aplicacion de la modalidad de teletrabajo en funcionarios municipales.',
      contenido: `DICTAMEN N 22.450 DE 2024 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Teletrabajo. Funcionarios municipales. Ley N 21.220.

CONSIDERANDO:

1. Que la ley N 21.220 modifico el Codigo del Trabajo para regular el trabajo a distancia y el teletrabajo.

2. Que si bien dicha ley se inserta en el Codigo del Trabajo, sus principios pueden aplicarse al sector publico.

3. Que el articulo 66 del Estatuto Administrativo faculta a la autoridad para distribuir la jornada de trabajo.

CONCLUSIONES:

1. Las municipalidades pueden implementar modalidades de teletrabajo siempre que:
   a) Se garantice la continuidad del servicio publico
   b) Se establezcan mecanismos de control de cumplimiento
   c) Se formalice mediante resolucion alcaldicia

2. Los funcionarios que trabajen bajo esta modalidad mantienen todos sus derechos y obligaciones.

3. Corresponde a cada municipalidad determinar los cargos compatibles con teletrabajo.

4. El derecho a desconexion digital aplica tambien a funcionarios municipales.`,
      enlace: 'https://www.contraloria.cl/web/cgr/dictamenes'
    },
    {
      titulo: 'Dictamen CGR N 8.234 de 2023 - Honorarios y Contratacion a Honorarios',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Aclara las condiciones para la contratacion a honorarios en municipalidades y los limites legales aplicables.',
      contenido: `DICTAMEN N 8.234 DE 2023 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Contratacion a honorarios. Municipalidades. Labores accidentales.

CONSIDERANDO:

1. Que el articulo 4 de la ley N 18.883 permite a las municipalidades contratar sobre la base de honorarios a profesionales y tecnicos para cometidos especificos.

2. Que esta modalidad de contratacion procede unicamente respecto de labores accidentales y no habituales de la municipalidad.

3. Que no puede utilizarse para desempenar funciones propias y permanentes del servicio.

CONCLUSIONES:

1. La contratacion a honorarios en municipalidades debe limitarse a:
   a) Labores accidentales y no habituales
   b) Cometidos especificos
   c) Asesoria especializadas temporales

2. No procede la contratacion a honorarios para:
   a) Reemplazar funcionarios de planta o contrata
   b) Desempenar funciones permanentes
   c) Prolongar indefinidamente vinculaciones

3. Los alcaldes deben velar porque los contratos a honorarios cumplan los requisitos legales.

4. La simulacion de relaciones laborales bajo la figura de honorarios constituye una irregularidad administrativa.`,
      enlace: 'https://www.contraloria.cl/web/cgr/dictamenes'
    },
    {
      titulo: 'Dictamen CGR N 45.892 de 2023 - Bienes Municipales y Comodato',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Normas aplicables a la entrega en comodato de bienes municipales a organizaciones comunitarias.',
      contenido: `DICTAMEN N 45.892 DE 2023 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Bienes municipales. Comodato. Organizaciones comunitarias.

CONSIDERANDO:

1. Que conforme al articulo 65 letra h) de la ley N 18.695, el alcalde puede entregar bienes municipales en comodato con acuerdo del concejo.

2. Que esta facultad debe ejercerse en beneficio de la comunidad local.

3. Que los bienes nacionales de uso publico no pueden entregarse en comodato.

CONCLUSIONES:

1. Las municipalidades pueden entregar en comodato bienes de su dominio a organizaciones comunitarias con personalidad juridica vigente.

2. Requisitos del comodato:
   a) Acuerdo del concejo municipal
   b) Decreto alcaldicio formalizado
   c) Inventario de los bienes
   d) Plazo determinado
   e) Clausula de restitucion

3. El comodatario debe destinar el bien al fin convenido y mantenerlo en buen estado.

4. No procede cobrar arriendo encubierto bajo la figura del comodato.

5. Las sedes sociales de juntas de vecinos gozan de preferencia en la asignacion de espacios municipales.`,
      enlace: 'https://www.contraloria.cl/web/cgr/dictamenes'
    },
    {
      titulo: 'Dictamen CGR N 12.567 de 2024 - Subvenciones Municipales',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Requisitos y procedimientos para otorgar subvenciones municipales a personas juridicas sin fines de lucro.',
      contenido: `DICTAMEN N 12.567 DE 2024 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Subvenciones municipales. Requisitos. Rendicion de cuentas.

CONSIDERANDO:

1. Que el articulo 65 letra n) de la ley N 18.695 faculta a las municipalidades para otorgar subvenciones a personas juridicas que realicen actividades de interes comunal.

2. Que el reglamento de subvenciones debe establecer requisitos y procedimientos.

3. Que las subvenciones constituyen fondos publicos sujetos a fiscalizacion.

CONCLUSIONES:

1. Para otorgar subvenciones municipales se requiere:
   a) Reglamento de subvenciones aprobado
   b) Bases o convocatoria publica
   c) Personeria vigente del beneficiario
   d) Proyecto o actividad especifica
   e) Presupuesto detallado
   f) Convenio formalizado

2. Las entidades beneficiarias deben rendir cuenta de los fondos recibidos, acompanando:
   a) Facturas y boletas
   b) Certificacion de gastos
   c) Informe de actividades
   d) Fotografias u otros respaldos

3. El incumplimiento de la rendicion impide acceder a nuevas subvenciones.

4. El concejo municipal debe fiscalizar el uso de las subvenciones otorgadas.`,
      enlace: 'https://www.contraloria.cl/web/cgr/dictamenes'
    },
    {
      titulo: 'Sentencia Corte Suprema Rol 45.678-2023 - Recurso de Proteccion contra DOM',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'La Corte Suprema confirma facultad de la DOM para revocar permisos de edificacion cuando se detectan irregularidades graves.',
      contenido: `CORTE SUPREMA - SEGUNDA SALA
ROL N 45.678-2023

Santiago, quince de enero de dos mil veinticuatro.

VISTOS:

Se ha deducido recurso de apelacion contra la sentencia de la Corte de Apelaciones que rechazo recurso de proteccion interpuesto en contra de la Direccion de Obras Municipales.

CONSIDERANDO:

PRIMERO: Que conforme al articulo 118 de la Ley General de Urbanismo y Construcciones, corresponde a la Direccion de Obras Municipales velar por el cumplimiento de dicha ley.

SEGUNDO: Que el articulo 145 establece que el Director de Obras Municipales podra ordenar la paralizacion de una obra en ejecucion cuando constatare que se ejecuta en contravencion.

TERCERO: Que en el caso de autos, se ha acreditado que la obra excedia en un 40% la altura maxima permitida segun el Plan Regulador Comunal.

CUARTO: Que la facultad de la autoridad administrativa para revocar un acto administrativo que adolece de vicios no constituye privacion de propiedad.

SE CONFIRMA la sentencia apelada que rechazo el recurso de proteccion.`,
      enlace: 'https://www.pjud.cl'
    },
    {
      titulo: 'Dictamen CGR N 33.456 de 2024 - Concejales y Conflicto de Interes',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Inhabilidades de los concejales para participar en votaciones donde tengan interes personal directo.',
      contenido: `DICTAMEN N 33.456 DE 2024 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Concejales. Conflicto de interes. Inhabilidad para votar.

CONSIDERANDO:

1. Que el articulo 75 de la ley N 18.695 establece que los concejales deben abstenerse de participar en discusion y votacion de asuntos en que tengan interes directo.

2. Que el interes directo se configura cuando la decision puede afectar patrimonio o derechos del concejal, su conyuge o parientes.

3. Que la omision del deber de inhabilitarse constituye una grave infraccion a la probidad administrativa.

CONCLUSIONES:

1. Los concejales estan impedidos de votar en materias que:
   a) Les afecten patrimonialmente
   b) Beneficien a empresas donde tengan participacion
   c) Favorezcan a parientes hasta el tercer grado
   d) Otorguen contratos a personas con las que tengan relacion

2. El concejal debe hacer presente su inhabilidad antes de la votacion.

3. La participacion de un concejal inhabilitado puede acarrear la nulidad del acuerdo.

4. Las actas del concejo deben consignar las abstenciones y sus fundamentos.`,
      enlace: 'https://www.contraloria.cl/web/cgr/dictamenes'
    },
    {
      titulo: 'Dictamen CGR N 28.901 de 2023 - Ordenanzas Municipales y Legalidad',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Limites de las ordenanzas municipales y su relacion con la ley. Materias que pueden y no pueden regular.',
      contenido: `DICTAMEN N 28.901 DE 2023 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Ordenanzas municipales. Potestad reglamentaria. Legalidad.

CONSIDERANDO:

1. Que conforme al articulo 12 de la ley N 18.695, las ordenanzas son normas generales y obligatorias aplicables a la comunidad.

2. Que las ordenanzas deben sujetarse al principio de legalidad, no pudiendo contradecir leyes ni decretos.

3. Que la potestad normativa municipal es derivada y subordinada.

CONCLUSIONES:

1. Las ordenanzas municipales pueden regular:
   a) Uso de bienes nacionales de uso publico en la comuna
   b) Aseo y ornato
   c) Seguridad ciudadana
   d) Medio ambiente comunal
   e) Comercio ambulante
   f) Tenencia de animales
   g) Ruidos molestos

2. Las ordenanzas NO pueden:
   a) Crear delitos o cuasidelitos
   b) Establecer sanciones privativas de libertad
   c) Imponer tributos distintos a los autorizados por ley
   d) Afectar derechos garantizados por la Constitucion
   e) Contradecir normas legales vigentes

3. Las multas deben ajustarse a los rangos legales (1 a 5 UTM).

4. Las ordenanzas deben publicarse y entran en vigencia desde su publicacion.`,
      enlace: 'https://www.contraloria.cl/web/cgr/dictamenes'
    },
    {
      titulo: 'Dictamen CGR N 19.234 de 2024 - Permisos Municipales y Silencio Administrativo',
      categoria: 'JURISPRUDENCIA' as const,
      resumen: 'Aplicacion del silencio administrativo positivo en solicitudes de permisos municipales.',
      contenido: `DICTAMEN N 19.234 DE 2024 - CONTRALORIA GENERAL DE LA REPUBLICA

MATERIA: Permisos municipales. Silencio administrativo positivo. Plazos.

CONSIDERANDO:

1. Que el articulo 64 de la ley N 19.880 regula el silencio administrativo positivo.

2. Que transcurrido el plazo legal sin pronunciamiento, el interesado puede denunciar el incumplimiento.

3. Que el silencio opera como una ficcion legal que otorga el permiso solicitado.

CONCLUSIONES:

1. Los permisos municipales sujetos a silencio positivo son:
   a) Permisos de ocupacion de bienes nacionales de uso publico
   b) Autorizaciones para eventos
   c) Permisos de demolicion
   d) Autorizaciones de ferias libres

2. Permisos sujetos a silencio NEGATIVO:
   a) Permisos de edificacion
   b) Patentes de alcoholes
   c) Permisos que afecten el patrimonio fiscal

3. Para invocar el silencio positivo:
   a) Debe transcurrir el plazo legal (20 dias habiles si no hay plazo especial)
   b) El interesado debe denunciar el incumplimiento
   c) El jefe de servicio debe certificar que no se resolvio en plazo

4. La certificacion del silencio produce los mismos efectos que una resolucion favorable.`,
      enlace: 'https://www.contraloria.cl/web/cgr/dictamenes'
    },

    // =====================================
    // DOCTRINA
    // =====================================
    {
      titulo: 'El Principio de Probidad Administrativa en la Gestion Municipal',
      categoria: 'DOCTRINA' as const,
      resumen: 'Analisis doctrinario del principio de probidad administrativa aplicado a la gestion municipal.',
      contenido: `EL PRINCIPIO DE PROBIDAD ADMINISTRATIVA EN LA GESTION MUNICIPAL

I. INTRODUCCION

El principio de probidad administrativa constituye uno de los pilares fundamentales del derecho administrativo chileno. En el ambito municipal, cobra especial relevancia dada la cercania de estas entidades con la ciudadania.

II. MARCO NORMATIVO

El principio de probidad se encuentra consagrado en:
- Articulo 8 de la Constitucion Politica
- Titulo III de la Ley 18.575
- Ley 20.880 sobre probidad en la funcion publica

III. CONCEPTO Y ALCANCE

Segun el articulo 52 de la ley 18.575, el principio de probidad consiste en "observar una conducta funcionaria intachable y un desempeno honesto y leal de la funcion o cargo, con preeminencia del interes general sobre el particular".

IV. MANIFESTACIONES EN EL AMBITO MUNICIPAL

1. Declaraciones de intereses y patrimonio
2. Inhabilidades e incompatibilidades
3. Transparencia activa
4. Compras publicas

V. SANCIONES POR INFRACCION

Las conductas que contravienen la probidad pueden acarrear:
- Responsabilidad administrativa (sumarios)
- Responsabilidad civil (indemnizaciones)
- Responsabilidad penal (delitos funcionarios)

VI. CONCLUSIONES

La probidad administrativa es un imperativo etico que debe guiar toda la actuacion municipal.`,
      enlace: null
    },
    {
      titulo: 'Procedimiento de Reclamo de Ilegalidad Municipal - Articulo 151 LOC Municipalidades',
      categoria: 'DOCTRINA' as const,
      resumen: 'Estudio completo del reclamo de ilegalidad como mecanismo de impugnacion de actos municipales.',
      contenido: `EL RECLAMO DE ILEGALIDAD MUNICIPAL
Articulo 151 Ley 18.695

I. NATURALEZA JURIDICA

El reclamo de ilegalidad municipal es una accion contencioso-administrativa especial que permite impugnar resoluciones u omisiones ilegales de las municipalidades.

II. LEGITIMACION ACTIVA

Pueden interponer el reclamo:
- Cualquier particular agraviado
- Personas juridicas afectadas

III. OBJETO DEL RECLAMO

Procede contra:
1. Resoluciones que infrinjan la ley
2. Omisiones ilegales de la municipalidad
3. Resoluciones arbitrarias

IV. TRAMITACION

FASE ADMINISTRATIVA:
- Plazo: 30 dias desde la notificacion
- El alcalde resuelve en 15 dias

FASE JUDICIAL:
- Plazo: 15 dias desde el rechazo
- Conoce la Corte de Apelaciones

V. EFECTOS DE LA SENTENCIA

Si se acoge el reclamo:
- Se anula el acto impugnado
- Se ordena actuar conforme a derecho
- Puede condenarse en costas`,
      enlace: null
    },
    {
      titulo: 'Analisis del Silencio Administrativo en Procedimientos Municipales',
      categoria: 'DOCTRINA' as const,
      resumen: 'Estudio de la aplicacion del silencio administrativo positivo y negativo en procedimientos municipales.',
      contenido: `EL SILENCIO ADMINISTRATIVO EN PROCEDIMIENTOS MUNICIPALES

I. MARCO GENERAL

La Ley 19.880 introdujo la institucion del silencio administrativo al ordenamiento juridico chileno.

II. TIPOS DE SILENCIO

1. SILENCIO POSITIVO (Art. 64):
Transcurrido el plazo legal sin pronunciamiento, se entiende ACEPTADA la solicitud.

2. SILENCIO NEGATIVO (Art. 65):
Se entiende RECHAZADA cuando:
- Afecte el patrimonio fiscal
- Se refiera a seguridad publica
- Se refiera a medio ambiente

III. APLICACION EN MUNICIPALIDADES

Casos de silencio positivo:
- Permisos de ocupacion de bienes nacionales de uso publico
- Autorizaciones de ferias libres
- Solicitudes de informacion (Ley 20.285)

Casos de silencio negativo:
- Permisos de edificacion
- Patentes de alcoholes
- Reclamos por multas

IV. CERTIFICACION

El interesado puede solicitar certificacion de que su solicitud no ha sido resuelta.`,
      enlace: null
    },
    {
      titulo: 'Responsabilidad Extracontractual del Estado y Municipalidades',
      categoria: 'DOCTRINA' as const,
      resumen: 'Estudio de la responsabilidad civil de las municipalidades por falta de servicio.',
      contenido: `RESPONSABILIDAD EXTRACONTRACTUAL DE LAS MUNICIPALIDADES

I. FUNDAMENTO CONSTITUCIONAL Y LEGAL

El articulo 38 inciso 2 de la Constitucion establece que cualquier persona lesionada en sus derechos por la Administracion podra reclamar ante los tribunales.

El articulo 142 de la ley N 18.695 dispone que las municipalidades incurren en responsabilidad por los danos que causen.

II. FALTA DE SERVICIO

La falta de servicio se configura cuando:
- El servicio no funciona
- Funciona deficientemente
- Funciona tardamente

III. ELEMENTOS DE LA RESPONSABILIDAD

1. Falta de servicio (hecho generador)
2. Dano (patrimonial o moral)
3. Relacion de causalidad

IV. CASOS TIPICOS EN MUNICIPALIDADES

- Accidentes por mal estado de veredas o calles
- Caidas de arboles en propiedad publica
- Fallas en semaforos
- Deficiencias en servicios de aseo
- Errores en permisos de edificacion

V. PROCEDIMIENTO

La demanda se interpone ante el juzgado de letras competente segun las reglas generales.

VI. PRESCRIPCION

El plazo de prescripcion es de 4 anos desde la perpetracion del acto (articulo 2332 del Codigo Civil).`,
      enlace: null
    },
    {
      titulo: 'Control Juridico de los Actos Municipales',
      categoria: 'DOCTRINA' as const,
      resumen: 'Mecanismos de control interno y externo de la legalidad de los actos municipales.',
      contenido: `CONTROL JURIDICO DE LOS ACTOS MUNICIPALES

I. TIPOS DE CONTROL

1. CONTROL INTERNO
- Control jerarquico del alcalde
- Fiscalizacion del concejo municipal
- Unidad de control interno

2. CONTROL EXTERNO
- Contraloria General de la Republica
- Tribunales de justicia
- Consejo para la Transparencia

II. CONTROL POR CONTRALORIA

La CGR ejerce control de legalidad mediante:
- Toma de razon (ciertos actos)
- Registro de actos municipales
- Auditorias
- Emision de dictamenes

III. CONTROL JURISDICCIONAL

- Reclamo de ilegalidad (art. 151 LOC Municipalidades)
- Recurso de proteccion
- Accion de nulidad de derecho publico
- Accion de responsabilidad extracontractual

IV. CONTROL POR EL CONCEJO

El concejo municipal fiscaliza:
- Ejecucion presupuestaria
- Cumplimiento de planes
- Actuacion del alcalde
- Sociedades municipales

V. TRANSPARENCIA

Control ciudadano mediante:
- Transparencia activa
- Solicitudes de acceso a informacion
- Participacion en el COSOC`,
      enlace: null
    },

    // =====================================
    // PRACTICA JURIDICA
    // =====================================
    {
      titulo: 'Modelo de Ordenanza Municipal - Tenencia Responsable de Mascotas',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de ordenanza municipal sobre tenencia responsable de mascotas conforme a la Ley 21.020.',
      contenido: `ORDENANZA MUNICIPAL SOBRE TENENCIA RESPONSABLE DE MASCOTAS

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- La presente ordenanza regula la tenencia responsable de mascotas en el territorio comunal, en conformidad con la Ley N 21.020.

Articulo 2.- Definiciones:
a) Mascota: animal domestico que vive con las personas
b) Tenedor responsable: persona a cargo del cuidado de una mascota
c) Animal potencialmente peligroso: el que ha causado mordeduras

TITULO II - OBLIGACIONES

Articulo 3.- Todo tenedor responsable debera:
a) Inscribir a su mascota en el Registro
b) Identificar a su mascota mediante microchip
c) Recoger los excrementos en espacios publicos
d) Mantener a su mascota con correa en espacios publicos

TITULO III - PROHIBICIONES

Articulo 5.- Se prohibe:
a) Abandonar mascotas
b) Organizar peleas de animales
c) Mantener mascotas que causen molestias graves

TITULO IV - SANCIONES

Articulo 6.- Las infracciones se clasifican en:
a) Leves: multa de 1 a 3 UTM
b) Graves: multa de 3 a 10 UTM
c) Gravisimas: multa de 10 a 30 UTM`,
      enlace: null
    },
    {
      titulo: 'Modelo de Decreto Alcaldicio de Delegacion de Funciones',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo tipo de decreto alcaldicio para delegar funciones especificas en directivos municipales.',
      contenido: `MODELO DE DECRETO ALCALDICIO - DELEGACION DE FUNCIONES

ILUSTRE MUNICIPALIDAD DE [NOMBRE COMUNA]
DECRETO ALCALDICIO N° ___/____

VISTOS:
1. Lo dispuesto en los articulos 63 letra j) y 64 de la Ley N 18.695.
2. Lo establecido en el articulo 41 de la Ley N 18.575.
3. Las necesidades del servicio.

CONSIDERANDO:
1. Que el articulo 63 letra j) faculta al Alcalde para delegar atribuciones.
2. Que la delegacion debe recaer en materias especificas.
3. Que es necesario desconcentrar ciertas funciones.

DECRETO:
1. DELEGASE en don/dona [NOMBRE], [CARGO], las siguientes funciones:
   a) Firmar autorizaciones de [materia] de monto inferior a [monto]
   b) Representar al municipio en [materias]
   c) Autorizar permisos de [tipo]

2. Esta delegacion se ejercera bajo supervigilancia del Alcalde.

3. El delegado debera actuar dentro de los limites de la delegacion.

ANOTESE, COMUNIQUESE Y ARCHIVESE

[FIRMA ALCALDE]
[FIRMA SECRETARIO MUNICIPAL]`,
      enlace: null
    },
    {
      titulo: 'Guia de Tramitacion de Sumarios Administrativos Municipales',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Guia practica para la tramitacion de sumarios administrativos en municipalidades.',
      contenido: `GUIA DE TRAMITACION DE SUMARIOS ADMINISTRATIVOS MUNICIPALES

I. INICIACION

1. RESOLUCION DE INSTRUCCION
- El Alcalde ordena instruir sumario
- Designa Fiscal y Actuario
- PLAZO: 20 dias habiles para fallar

II. ETAPA INDAGATORIA

El Fiscal debe:
- Individualizar al/los inculpados
- Determinar los hechos
- Reunir las pruebas

III. FORMULACION DE CARGOS

- Se notifican los cargos al inculpado
- Plazo de defensa: 5 dias habiles
- El inculpado puede presentar descargos

IV. ETAPA PROBATORIA

- Plazo: 10 dias habiles
- Se practican las diligencias solicitadas

V. VISTA FISCAL

El Fiscal propone:
- Absolucion, o
- Sancion con indicacion de la medida

VI. RESOLUCION DEL ALCALDE

a) Absolver
b) Sobreseer
c) Aplicar sancion:
   - Censura
   - Multa (hasta 10% remuneracion)
   - Suspension (hasta 3 meses)
   - Destitucion

VII. RECURSOS

- Apelacion ante CGR (10 dias)
- Reconsideracion ante Alcalde (5 dias)`,
      enlace: null
    },
    {
      titulo: 'Procedimiento de Licitacion Publica Municipal - Paso a Paso',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Guia practica del procedimiento de licitacion publica en municipalidades.',
      contenido: `PROCEDIMIENTO DE LICITACION PUBLICA MUNICIPAL

I. ETAPA PREPARATORIA

1. DETECCION DE NECESIDAD
2. VERIFICACION PRESUPUESTARIA
3. ELABORACION DE BASES (administrativas y tecnicas)
4. APROBACION POR DECRETO ALCALDICIO

II. ETAPA DE LLAMADO

1. PUBLICACION EN MERCADOPUBLICO
   - Min. 20 dias (>1000 UTM)
   - Min. 10 dias (100-1000 UTM)

2. PERIODO DE CONSULTAS Y RESPUESTAS

III. RECEPCION Y APERTURA

1. RECEPCION DE OFERTAS (via electronica)
2. ACTO DE APERTURA
3. VERIFICACION DE ANTECEDENTES

IV. EVALUACION

1. COMISION EVALUADORA (min. 3 integrantes)
2. INFORME DE EVALUACION
3. PROPUESTA DE ADJUDICACION

V. ADJUDICACION

1. RESOLUCION FUNDADA
2. PUBLICACION EN PORTAL
3. NOTIFICACION A ADJUDICATARIO

VI. CONTRATO

1. PRESENTACION DE GARANTIA
2. SUSCRIPCION DEL CONTRATO
3. PUBLICACION EN PORTAL

PLAZOS CLAVE:
- Publicacion (>1000 UTM): Min. 20 dias
- Evaluacion: Segun bases
- Adjudicacion: Segun bases`,
      enlace: null
    },
    {
      titulo: 'Modelo de Reclamo de Ilegalidad Municipal',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de escrito de reclamo de ilegalidad conforme al articulo 151 de la Ley 18.695.',
      contenido: `MODELO DE RECLAMO DE ILEGALIDAD MUNICIPAL

EN LO PRINCIPAL: Reclamo de ilegalidad.
PRIMER OTROSI: Acompana documentos.
SEGUNDO OTROSI: Patrocinio y poder.

SENOR ALCALDE DE LA ILUSTRE MUNICIPALIDAD DE [COMUNA]

[NOMBRE COMPLETO], [profesion], RUT [numero], domiciliado en [direccion], a US. respetuosamente digo:

Que vengo en interponer reclamo de ilegalidad en contra de [DECRETO/RESOLUCION N°], de fecha [fecha], por los fundamentos que paso a exponer:

I. LOS HECHOS

[Describir cronologicamente los hechos que motivan el reclamo]

II. EL DERECHO

El acto impugnado infringe las siguientes disposiciones legales:
1. [Norma infringida 1 y explicacion]
2. [Norma infringida 2 y explicacion]

III. AGRAVIO

El acto reclamado causa agravio a esta parte porque [explicar perjuicio].

IV. PETICION

Por lo expuesto, solicito a US.:

1. Tener por interpuesto reclamo de ilegalidad en contra de [acto impugnado].
2. Dejar sin efecto el acto reclamado.
3. En subsidio, ordenar las medidas que correspondan para restablecer el imperio del derecho.

PRIMER OTROSI: Acompano los siguientes documentos:
1. Copia del acto reclamado
2. [Otros documentos]

SEGUNDO OTROSI: Designo abogado patrocinante a [nombre] y confiero poder a [nombre].

[Lugar y fecha]

[FIRMA]
[Nombre reclamante]`,
      enlace: null
    },
    {
      titulo: 'Modelo de Solicitud de Acceso a Informacion Publica',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de solicitud conforme a la Ley 20.285 de Transparencia.',
      contenido: `MODELO DE SOLICITUD DE ACCESO A INFORMACION PUBLICA

SENOR ENCARGADO DE TRANSPARENCIA
MUNICIPALIDAD DE [COMUNA]
PRESENTE

[NOMBRE COMPLETO], RUT [numero], domiciliado en [direccion], correo electronico [email], a Ud. respetuosamente digo:

Que en virtud de lo dispuesto en los articulos 10 y siguientes de la Ley N 20.285, vengo en solicitar la siguiente informacion:

1. INFORMACION REQUERIDA:

[Describir con precision la informacion solicitada, por ejemplo:]
- Copia del Decreto Alcaldicio N° [numero]
- Listado de contratos a honorarios vigentes
- Informe de ejecucion presupuestaria periodo [mes/ano]
- [Otra informacion]

2. FORMATO DE ENTREGA:

Solicito que la informacion me sea entregada en formato [digital/papel/CD], a mi correo electronico/domicilio indicado.

3. FUNDAMENTO LEGAL:

Esta solicitud se funda en el derecho de acceso a la informacion publica garantizado por el articulo 8 de la Constitucion Politica y regulado por la Ley N 20.285.

Conforme al articulo 14 de la citada ley, la autoridad debera pronunciarse dentro de 20 dias habiles.

POR TANTO, solicito a Ud. acceder a la informacion requerida y notificarme oportunamente.

[Lugar y fecha]

________________________
[Firma]
[Nombre completo]
RUT: [numero]`,
      enlace: null
    },
    {
      titulo: 'Modelo de Ordenanza de Comercio Ambulante',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de ordenanza municipal para regular el comercio ambulante en la comuna.',
      contenido: `ORDENANZA MUNICIPAL SOBRE COMERCIO AMBULANTE

TITULO I - DISPOSICIONES GENERALES

Articulo 1.- La presente ordenanza regula el ejercicio del comercio en la via publica y espacios de uso publico de la comuna.

Articulo 2.- Definiciones:
a) Comercio ambulante: actividad comercial en espacios publicos
b) Permiso municipal: autorizacion para ejercer comercio ambulante
c) Ferias libres: comercio transitorio en lugares determinados

TITULO II - DE LOS PERMISOS

Articulo 3.- El comercio ambulante requiere permiso municipal otorgado por el alcalde.

Articulo 4.- Para obtener permiso se requiere:
a) Solicitud dirigida al alcalde
b) Cedula de identidad vigente
c) Certificado de antecedentes
d) Patente comercial al dia
e) Autorizacion sanitaria si corresponde

Articulo 5.- El permiso senalara:
a) Ubicacion autorizada
b) Rubro comercial
c) Horario de funcionamiento
d) Plazo de vigencia

TITULO III - PROHIBICIONES

Articulo 6.- Se prohibe:
a) Comerciar sin permiso vigente
b) Ocupar areas no autorizadas
c) Impedir el libre transito peatonal
d) Ofrecer productos prohibidos o nocivos
e) Generar ruidos molestos

TITULO IV - SANCIONES

Articulo 7.- Las infracciones se sancionaran con:
a) Amonestacion escrita
b) Multa de 1 a 5 UTM
c) Comiso de productos
d) Revocacion del permiso

Articulo 8.- El procedimiento de aplicacion de sanciones sera conocido por el Juzgado de Policia Local.

TITULO V - FERIAS LIBRES

Articulo 9.- Las ferias libres funcionaran en los lugares y horarios que determine el alcalde mediante decreto.`,
      enlace: null
    },
    {
      titulo: 'Modelo de Convenio de Colaboracion con Organizacion Comunitaria',
      categoria: 'PRACTICA_JURIDICA' as const,
      resumen: 'Modelo de convenio entre municipalidad y organizacion comunitaria para ejecucion de proyectos.',
      contenido: `CONVENIO DE COLABORACION

En [ciudad], a [fecha], entre la ILUSTRE MUNICIPALIDAD DE [COMUNA], RUT [numero], representada por su Alcalde don/dona [nombre], en adelante "la Municipalidad", y [NOMBRE ORGANIZACION], RUT [numero], representada por su Presidente don/dona [nombre], en adelante "la Organizacion", se conviene:

PRIMERO: OBJETO
El presente convenio tiene por objeto establecer las bases de colaboracion para la ejecucion del proyecto [nombre del proyecto].

SEGUNDO: OBLIGACIONES DE LA MUNICIPALIDAD
La Municipalidad se obliga a:
a) Transferir la suma de $[monto] para financiar el proyecto
b) Supervisar la correcta ejecucion del proyecto
c) Prestar asesoria tecnica cuando sea requerida
d) [Otras obligaciones]

TERCERO: OBLIGACIONES DE LA ORGANIZACION
La Organizacion se obliga a:
a) Ejecutar el proyecto conforme a la propuesta aprobada
b) Rendir cuenta documentada de los fondos recibidos
c) Presentar informes de avance mensuales
d) Permitir la fiscalizacion municipal
e) [Otras obligaciones]

CUARTO: PLAZO
El presente convenio tendra vigencia desde [fecha] hasta [fecha].

QUINTO: RENDICION DE CUENTAS
La Organizacion debera rendir cuenta de los fondos recibidos dentro de los 30 dias siguientes al termino del proyecto.

SEXTO: INCUMPLIMIENTO
El incumplimiento de las obligaciones facultara a la Municipalidad para:
a) Exigir la restitucion de los fondos
b) Excluir a la organizacion de futuras subvenciones
c) Perseguir las responsabilidades legales

SEPTIMO: DOMICILIO
Las partes fijan domicilio en la ciudad de [ciudad].

________________________          ________________________
ALCALDE                           PRESIDENTE ORGANIZACION`,
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
