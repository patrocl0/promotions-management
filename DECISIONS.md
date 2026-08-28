# DECISIONS.md

## Stack tecnológico

### Frontend — React + TypeScript + Vite

Elegí React para construir la interfaz porque permite dividir la aplicación en componentes reutilizables y facilita el manejo de estados y eventos.

Utilicé TypeScript para tener tipado estático y detectar errores durante el desarrollo.

Elegí Vite como herramienta de desarrollo porque proporciona un entorno rápido y sencillo para aplicaciones React.

### UI — Tailwind CSS + shadcn/ui

Utilicé Tailwind CSS para construir los estilos de forma rápida y mantener los estilos directamente relacionados con los componentes.

Elegí shadcn/ui porque proporciona componentes accesibles y reutilizables que pueden personalizarse fácilmente con Tailwind CSS.

### Formularios — React Hook Form

Utilicé React Hook Form para manejar el estado y validación de los formularios, evitando manejar manualmente cada campo con `useState`.

### Validación — Zod

Utilicé Zod para definir esquemas de validación y mantener las reglas de los datos centralizadas.

La validación se realiza tanto en el frontend como en el backend. En el frontend permite proporcionar feedback inmediato al usuario, mientras que en el backend garantiza que la API no acepte datos inválidos aunque sea consumida directamente.

### Backend — Node.js + Express

Elegí Node.js con Express para construir la API REST debido a su simplicidad, flexibilidad y facilidad para separar las rutas, controladores y modelos.

La aplicación está organizada siguiendo una estructura por responsabilidades:

- Routes
- Controllers
- Models
- Config
- Schemas/validaciones

### Base de datos — MongoDB

Elegí MongoDB porque el modelo de promociones y productos puede representarse fácilmente mediante documentos y permite trabajar cómodamente con identificadores y referencias entre colecciones.

Mongoose se utiliza como ODM para definir los modelos, esquemas y validaciones de los documentos.

### Comunicación Frontend/Backend — REST API

Elegí una API REST para separar la interfaz de usuario de la lógica del servidor.

El frontend consume endpoints como:

- `GET /api/products`
- `GET /api/promotions`
- `POST /api/promotions`
- `PUT /api/promotions/:id`
- `DELETE /api/promotions/:id`

Esto permite que el backend pueda ser utilizado por otros clientes en el futuro.

## Manejo de promociones

Las promociones tienen tres estados:

- `programada`
- `activa`
- `finalizada`

El estado se almacena en el backend y el frontend permite modificarlo mediante la API.

## Eliminación de promociones

Una promoción solamente puede eliminarse cuando se encuentra en estado `programada`.

Esta regla se valida en el backend para garantizar que no pueda ser evitada enviando directamente una petición HTTP desde otro cliente.

## Variables de entorno

Las configuraciones que pueden variar entre ambientes, como el puerto del servidor y la conexión a MongoDB, se manejan mediante variables de entorno.

Se utiliza un archivo `.env` para desarrollo y las variables correspondientes se configuran directamente en el ambiente de producción.

Las credenciales y datos sensibles no se almacenan en el repositorio.

## Manejo de errores

El backend devuelve códigos HTTP apropiados para representar el resultado de las operaciones:

- `200` — operación exitosa
- `201` — recurso creado
- `400` — datos enviados incorrectamente
- `404` — recurso no encontrado
- `500` — error interno del servidor

Esto permite que el frontend pueda manejar correctamente los diferentes escenarios.

## Separación de responsabilidades

Se decidió separar la lógica de la aplicación en diferentes capas.

Los controladores se encargan de procesar las peticiones HTTP, los modelos representan los datos de MongoDB y los servicios del frontend se encargan de la comunicación con la API.

Los hooks de React encapsulan la lógica relacionada con la obtención, creación, actualización y eliminación de promociones.

Esta separación facilita el mantenimiento y permite modificar una parte de la aplicación sin afectar directamente a las demás.
