# Nappy: análisis del curso y plan de la beta

Fecha: 22 de octubre de 2026. Estado: propuesta de implementación; todavía no se ha creado el backend.

## 1. Base de este análisis

Se revisaron las consignas y el código de las actividades 01 a 11 de `../Web Design/Portfolio`, los ejercicios de `Class`, la propuesta `Proposal.html` y el frontend actual de Nappy. La revisión fue estática: no se ejecutaron todos los ejercicios ni se verificaron sus conexiones externas. La presencia de código demuestra una referencia disponible, no necesariamente dominio de todos sus conceptos.

Las actividades 12 a 16 quedan fuera del nivel base solicitado. MongoDB sí aparece en código de clase anterior, por lo que se puede incorporar de manera acotada sin basarse en esas actividades posteriores.

## 2. Qué nivel refleja el portafolio

| Material | Evidencia concreta | Aplicación a Nappy |
| --- | --- | --- |
| 01 Personal Website HTML | Secciones, enlaces, tablas, imágenes y formularios | Conservar HTML directo y formularios con etiquetas |
| 02 CSS | Modelo de caja, bordes, posición, tamaños y colores | Reglas CSS pequeñas y explícitas |
| 03 Personal Website CSS | CSS separado, hover, transiciones, tarjetas y media queries | Mejorar respuestas visuales sin librerías de animación |
| 04 Bootstrap Showcase | Grid, tarjetas, navbar, carousel y componentes interactivos | Reutilizar Bootstrap para diseño, modal, alertas y carga |
| 05 JS | Funciones, condiciones, ciclos, arrays, objetos, validación numérica, eventos, temporizadores y canvas | Cálculos sencillos y manipulación del DOM; no hace falta canvas |
| 06 Personal Website JS | `submit`, `preventDefault`, `FormData`, `setCustomValidity`, creación de filas, `textContent` | Leer el check-in, validar y actualizar la pantalla |
| 07 Basic Node | npm, `require`, dependencias y lectura con `fs` | Un proyecto Node con un script de inicio |
| 08 Basic Express | `app.get`, `app.post`, lectura de formulario, cálculo y error 400 | Recibir datos, validarlos y responder desde el servidor |
| 09 Express Personal API | GET/POST/PUT/DELETE, params/query/body, JSON, arrays, EJS y manejo de errores | Rutas pequeñas para guardar, consultar, editar y borrar registros |
| 10 Express EJS | Consigna sobre plantillas y blog; servidor todavía conserva configuración pendiente | No tomar el blog completo como funcionalidad ya implementada |
| 11 Express Third-party API | `https.get`, eventos data/end, JSON, EJS, dotenv, errores y timeout | Patrón disponible si después necesitamos una API externa |
| Class/js-calculator | Callbacks, switch, try/catch y alertas Bootstrap | Errores comprensibles junto al formulario |
| Class/dom-challenge | Creación de tarjetas, delegación con closest, contadores, completar, borrar y reordenar | Interacción sencilla de misiones |
| Class/dom-lab y s09-dom-lab | Estructuras para DOM y exportación/importación con varios TODO sin resolver | Exportación es una extensión pequeña que debe explicarse |
| Class/async-lab y s11-async-lab | Esqueleto de fetch/async/await y carga; funciones principales pendientes | Reforzar este flujo con un ejemplo pequeño de Nappy |
| Class/s13-node-lab/project | import, async/await, fs/promises y try/catch implementados | Ya existe referencia de asincronía en Node; axios importado no demuestra una llamada externa implementada en ese archivo |
| Class/s14-express-lab | Rutas, filtros, JSON, axios, router, variables de entorno, conexión Atlas, schema y consultas Mongoose | Referencia principal para persistencia y organización mínima |
| Class/s17-routing-lab | Router, middleware, códigos HTTP y cliente fetch con JSON | Separar rutas solo cuando facilite la lectura |
| Class/ux-lab y s05-ux-lab | Consignas y material de interfaz sobre patrones engañosos | Mensajes honestos y controles claros; no asumir que el rediseño ya está terminado |

Hay versiones duplicadas o distintas de algunos laboratorios: por ejemplo, la calculadora sin prefijo tiene lógica que la versión s07 todavía deja pendiente. También hay comentarios TODO encima de código ya completado; la clasificación se basa en los cuerpos de las funciones, no solo en buscar la palabra TODO.

### Límites de complejidad propuestos

- JavaScript normal, funciones con nombres descriptivos, if/else, ciclos o métodos de arrays ya vistos.
- Un servidor Express que entrega tanto la página como su API. Frontend con HTML, CSS, Bootstrap y fetch.
- Un modelo Mongoose inicial. Consultas simples y cálculos en JavaScript.
- Adoptar `require` de las actividades 07–11 de manera consistente; los imports de Class también son válidos, pero no mezclarlos sin necesidad.
- Separar conexión, modelo y rutas por responsabilidades claras. No agregar capas de controladores, repositorios y servicios que solo repitan llamadas.
- Comentarios en inglés sencillo como el código actual; documentación explicativa del backend en español para estudiar.
- No introducir React, TypeScript, Redux, GraphQL, Docker, microservicios, WebSockets ni agregaciones complejas para esta beta.
- La sencillez no elimina la validación del servidor, el manejo de fallas ni la protección de credenciales.

Los ejemplos más avanzados de clase son un límite superior, no una plantilla que tengamos que copiar completa. El hashing de contraseñas en s14 y las clases de errores en s17 no son necesarios para empezar con el flujo de hábitos.

## 3. Qué pide la entrega y qué promete Nappy

La consigna exige Express instalado, backend funcional, interacción visual, diseño cuidado, manejo de entradas incorrectas, documentación y una URL pública. APIs externas y Atlas son alternativas según el proyecto, no tres requisitos obligatorios simultáneos.

La propuesta de Nappy prioriza registrar y visualizar sueño, agua, movimiento y ánimo. Incluye campos opcionales, privacidad, metas y resumen semanal. Dice explícitamente que las APIs son una extensión. Por eso, el centro de la beta debe ser:

**Formulario → validación en Express → almacenamiento → consulta → actualización del dashboard y resumen semanal.**

Los valores actuales (72/100, 7 h 20 m, promedios y patrón semanal) son ejemplos. Deben reemplazarse por cálculos o estados vacíos; no deben quedar como resultados supuestamente reales cuando ya haya backend.

## 4. Decisión pendiente: demo o datos personales

Recomendación para la primera beta académica sencilla: una demo compartida con datos ficticios, claramente identificada como tal, almacenada en una colección separada de Atlas. Es una propuesta, no una decisión ya aprobada por el equipo.

En esa modalidad todos ven y pueden modificar el mismo conjunto de datos de prueba. No se presenta como un diario privado, y el modal debe explicar esa limitación. Se conserva un conjunto de datos ficticios para restaurar manualmente la demostración si hace falta, sin sobrescribir automáticamente la base en cada inicio.

Si la beta debe guardar información privada de cada visitante, hay que definir antes del modelo final una identificación real y filtrar todas las lecturas, cambios, exportaciones y borrados por su propietario. Esto agrega un bloque de autenticación y autorización; no basta con un nombre o un ID enviado por el navegador. Las sesiones anónimas tampoco equivalen a cuentas recuperables entre dispositivos.

Los tokens fijos de s17 y su selección libre del rol admin son una simulación didáctica. No deben reutilizarse como seguridad real. El alcance público elegido se debe confirmar antes de implementar almacenamiento de información personal.

## 5. Persistencia y hosting

Propuesta: Express en Render como Web Service y MongoDB Atlas para registros persistentes. Un solo dominio sirve la página y `/api/...`, simplificando fetch y evitando configurar un frontend separado.

Un array en memoria sirve para el primer ejercicio local, pero se pierde al reiniciar. Un archivo JSON tampoco resuelve la persistencia en Render gratuito: su sistema de archivos es efímero y pierde modificaciones en reinicios y despliegues. El servicio gratuito puede suspenderse tras 15 minutos de inactividad y tardar en reactivarse. Fuente: [Render Free](https://render.com/docs/free).

Atlas dispone de un cluster gratuito para aprendizaje y pruebas pequeñas: [MongoDB Atlas Free](https://www.mongodb.com/docs/atlas/tutorial/deploy-free-tier-cluster/).

Un bucket almacena archivos, como imágenes o documentos. Nappy necesita principalmente registros de hábitos: una colección de MongoDB es suficiente. No hay actualmente una necesidad de subir archivos que justifique agregar un bucket o una API específica para él.

## 6. Funcionalidad concreta de la beta

### Check-in diario

- Añadir fecha al formulario para consultar y corregir días anteriores.
- Guardar sueño, agua, movimiento y ánimo; conservar campos opcionales como propone el documento.
- Exigir al menos un dato de hábito para guardar. Campo vacío significa ausencia de registro, no cero.
- Un registro por fecha en la demo. Guardar otra vez el mismo día actualiza ese registro.
- Mostrar historial sencillo con editar y borrar; confirmar el borrado desde la interfaz.
- Mostrar éxito únicamente después de la confirmación del servidor.
- Permitir recargar y recuperar lo guardado desde MongoDB.

### Dashboard

- Leer el registro del día y actualizar las cuatro tarjetas.
- Usar una única función de actualización para el puntaje grande, el compacto y la barra; el script actual copia el valor solo al cargar.
- Propuesta simple para la primera versión: 25 puntos por cada hábito registrado, independientemente de su valor o del estado de ánimo. Así 3 de 4 registros equivalen a 75/100.
- Llamarlo “Daily tracking progress” o explicar claramente que es completitud del registro, no una medición médica del bienestar. El nombre y fórmula se deben resolver antes de programar; no inventar una fórmula de salud para conservar el 72 original.
- Separar “registrar un hábito” de “cumplir una meta”. Registrar ánimo Low cuenta como registro válido, no como fracaso.

### Resumen semanal

- Tomar los últimos siete días calendario hasta la fecha seleccionada, no los últimos siete registros.
- Calcular promedios con los días que tienen datos para ese hábito. Un día sin registro no equivale a cero.
- Mostrar cantidad de días registrados por hábito, ánimo más frecuente y racha de días consecutivos con algún registro. Si hay empate de ánimo, mostrar el empate o una regla documentada.
- Incluir una gráfica sencilla con siete barras Bootstrap de completitud diaria y valores escritos; no agregar una librería solo para esto.
- Reemplazar el texto fijo que relaciona ánimo y sueño por una observación comprobable, por ejemplo: “Registraste hábitos 4 de los últimos 7 días”.
- Si faltan datos, mostrar “No records yet” o “Not enough data”, sin resultados ficticios.

### Misiones y recursos

- Conservar las tres misiones existentes como catálogo fijo en código.
- Elegir una misión del día, marcarla como completada y guardar su estado junto al registro diario. Si aún no hay check-in, pedir guardarlo primero para simplificar el flujo.
- Las metas iniciales pueden ser estas acciones concretas; metas numéricas personalizables quedan para una segunda iteración.
- Sustituir los enlaces que vuelven a `#resources` por recursos reales y verificados antes de publicar.
- El modal de perfil debe reflejar lo implementado. Exportar JSON y borrar registros pueden aprovechar la misma API del historial. No anunciar cuentas o privacidad que todavía no existen.

### Respuestas visuales

- Hover y focus de botones y tarjetas con transiciones CSS cortas.
- Botón “Saving...” deshabilitado mientras llega la respuesta.
- Alertas Bootstrap para éxito, datos inválidos y fallas del servidor.
- Actualización de tarjetas y barra tras guardar; estado visible al elegir/completar una misión.
- Mantener modal, footer y navegación sticky ya implementados.

## 7. Datos y rutas propuestas

Modelo inicial para la demo: `CheckIn`.

| Campo | Tipo / propósito |
| --- | --- |
| date | String YYYY-MM-DD, fecha calendario real, única en demo |
| sleepHours | Número opcional |
| waterGlasses | Entero opcional |
| movementMinutes | Entero opcional |
| mood | Low, Okay, Good o Great; opcional |
| mission | sleep, water, movement o sin selección |
| missionCompleted | Boolean, inicialmente false |

No almacenar promedios ni puntajes que puedan calcularse a partir de estos campos. Para usuarios reales, añadir propietario e índice único compuesto propietario+fecha; todas las rutas requerirían identificación y filtros por propietario.

| Método y ruta | Uso |
| --- | --- |
| GET /api/check-ins | Recuperar historial; admitir un intervalo de fechas validado |
| GET /api/check-ins/:date | Recuperar un día para dashboard o edición |
| PUT /api/check-ins/:date | Crear o reemplazar los datos de hábitos de un día, conservando la misión |
| DELETE /api/check-ins/:date | Borrar un registro existente |
| PUT /api/check-ins/:date/mission | Elegir o completar una misión en un día existente |
| GET /api/summary?date=YYYY-MM-DD | Resumen de siete días calculado en el servidor |

PUT evita necesitar dos botones o rutas distintas para el primer guardado y la corrección del mismo día. Es un pequeño concepto que se explica en la documentación. La unicidad también debe existir en la base, no depender solo de una comprobación previa.

Exportar puede descargar la respuesta de GET /api/check-ins como JSON. No se necesita otro servicio de almacenamiento.

## 8. Validaciones y errores

- Fecha válida y no futura; política inicial basada en America/Mexico_City para la demo. Conservar YYYY-MM-DD como fecha de calendario y no derivar el día directamente de UTC cerca de medianoche.
- Sueño entre 0 y 24 horas; permitir fracciones.
- Agua entre 0 y 100 vasos enteros y movimiento entre 0 y 1440 minutos enteros. Son límites técnicos iniciales de entrada, no recomendaciones de salud.
- Ánimo y misión dentro de sus listas de valores.
- Rechazar tipos incorrectos, valores no finitos, arrays u objetos donde se esperan números o texto. Comprobar vacíos antes de usar Number, porque Number("") produce 0.
- Aceptar al menos un hábito; no contar valores null como registro.
- Solo completar una misión que esté seleccionada; cambiar la misión reinicia su estado de completado.
- Construir explícitamente el objeto que se guarda en vez de pasar req.body entero a la base.
- Respuestas coherentes: 400 para entrada incorrecta, 404 para registro/ruta inexistente y 500 para fallo inesperado. 201 al crear y 200 al actualizar.
- Validar tanto en navegador como en servidor. En fetch, comprobar response.ok: un 400 no se convierte automáticamente en una excepción de red.
- Mostrar mensajes breves al usuario y dejar los detalles técnicos en el servidor, sin credenciales.
- Si MongoDB falla, no mostrar un mensaje de guardado correcto ni cambiar silenciosamente a un array temporal.

## 9. Organización de archivos

```text
Project_Web/
  server.js                 # Configuración, middleware y arranque
  package.json
  package-lock.json
  .gitignore
  .env.example              # Solo nombres y valores de ejemplo
  config/
    db.js                   # Conexión de MongoDB
  models/
    CheckIn.js              # Campos y restricciones
  routes/
    checkIns.js             # Rutas y lógica pequeña de hábitos/resumen
  public/
    index.html              # Mismo diseño actual
    css/styles.css
    js/script.js            # Navegación, formulario, fetch y DOM
  docs/
    BACKEND.md
    TESTING.md
  README.md
  PLAN_BETA.md
  Proposal.html
  Prompt Logs/              # Conservar el registro existente
```

Se moverían únicamente los archivos del frontend a public. No servir la raíz del repositorio como carpeta estática. Express soporta directamente este patrón: [express.static](https://expressjs.com/en/starter/static-files/).

La separación conexión/modelo/rutas ya tiene referencia en Class/s14. Si los cálculos semanales crecen, se puede extraer una función a un archivo pequeño; no crear esa separación antes de necesitarla. El esquema se limita a campos ordinarios de [Mongoose](https://mongoosejs.com/docs/guide.html).

## 10. Orden de trabajo y comprobación

1. **Cerrar reglas de producto:** demo o usuarios privados; significado del puntaje; datos opcionales; una entrada por fecha. No requiere rediseñar la página.
2. **Arrancar Express:** package.json, npm start, PORT de entorno y entrega de public. Verificar que la página actual abre sin cambios visuales.
3. **Primera ruta funcional:** recibir un check-in, validar y responder JSON. Usar memoria solo como paso didáctico local si ayuda; no entregarla como persistencia final.
4. **Conectar Atlas:** db.js, CheckIn y guardar/consultar. Verificar que el registro permanece tras reiniciar el servidor. Configurar credenciales por entorno y acceso de red para el host elegido.
5. **Conectar el formulario:** fetch con JSON, mensaje de carga, errores y actualización de las tarjetas. Comprobar que recargar muestra los mismos datos.
6. **Historial y resumen:** edición, borrado, fechas, promedios, siete barras y racha. Probar un conjunto pequeño con resultados calculados a mano.
7. **Misiones, modal y recursos:** persistir elección/completado, exportación y copy coherente con el alcance público. Resolver enlaces reales.
8. **Pulir interacción:** transiciones, focus, alertas y comportamiento móvil sin sumar frameworks.
9. **Documentar y publicar:** registrar pruebas, subir código/documentación al mismo repo y desplegar como Web Service. Verificar la URL pública desde otro navegador.

El primer bloque que conviene programar es el paso 2 seguido de un flujo completo de un día: guardar, recargar y recuperar. Luego añadir resúmenes y misiones sobre esa base comprobada.

### Pruebas mínimas útiles

- Guardar una entrada parcial y una completa; diferenciar 0 de campo vacío.
- Guardar dos veces la misma fecha: debe quedar un solo registro actualizado.
- Rechazar negativos, valores excesivos, tipos incorrectos, fechas inexistentes y ánimo inválido, incluso llamando directamente a la API.
- Corregir y borrar registros; responder correctamente si ya no existen.
- Verificar promedios con huecos, semana sin datos, racha interrumpida y cambio de mes.
- Elegir/completar misión, recargar y comprobar persistencia.
- Simular fallo de base o red y comprobar que no se anuncia éxito ni se borran los valores escritos.
- Confirmar que puntaje grande y compacto coinciden después de cada guardado.
- Probar menú, anclas, modal, teclado y anchos de celular/escritorio.
- Confirmar persistencia después de reinicio/despliegue y acceso a la URL pública.
- Si se eligen usuarios reales: probar que una persona no pueda leer, cambiar, exportar o borrar los datos de otra.

## 11. Documentación y entrega

README: finalidad, funciones reales, requisitos, instalación, npm start, variables de entorno, URL pública y limitaciones de la demo.

BACKEND.md: recorrido formulario → fetch → ruta → validación → modelo → respuesta → DOM; campos del modelo; método/URL/body/respuesta de cada ruta; fórmula del progreso; fechas; resumen semanal; fallas y persistencia. Cada ruta y función importante llevará un comentario corto sobre su propósito y reglas.

TESTING.md: casos ejecutados y resultados reales. No declarar pruebas hechas antes de ejecutarlas.

Conservar el historial de prompts en el repo. Algunos laboratorios piden expresamente documentarlo y explicar la lógica línea por línea; esto coincide con el objetivo del equipo de comprender todo el backend.

Render: servicio Node, comando de instalación npm ci una vez generado el lockfile y comando npm start; variables en el panel de entorno. Elegir una versión LTS de Node compatible con las versiones fijadas de Express y Mongoose al implementar. Referencia: [desplegar Express en Render](https://render.com/docs/deploy-node-express-app).

Antes de entregar: código y documentación en el mismo repositorio, URL desplegada funcionando y funcionalidad principal comprobada. La entrega al profesor es únicamente la URL pública, no la URL del repo.

## 12. Fuera del primer alcance

API de clima u otra API externa sin una necesidad de Nappy, archivos en buckets, login social, recuperación de contraseñas, roles administrativos, notificaciones, sincronización con wearables y recomendaciones automáticas. Las cuentas privadas pasarían a ser parte del alcance si el equipo elige esa modalidad en el punto 4.

Estos límites preservan el foco de la propuesta: registrar, observar y elegir una pequeña acción con código que el equipo pueda recorrer y explicar.
