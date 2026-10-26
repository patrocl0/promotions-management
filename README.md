# Promotions Management

Aplicación full-stack para crear y administrar promociones por producto o categoría. La interfaz está construida con React, TypeScript, Vite, Tailwind CSS y shadcn/ui; la API usa Node.js, Express, TypeScript y MongoDB/Mongoose.

## Funcionalidades

- Resumen de promociones programadas, activas y vigentes.
- Búsqueda por nombre, producto o categoría y filtros por estado.
- Creación de descuentos porcentuales o de monto fijo.
- Aplicación de promociones a productos o categorías.
- Validación de datos y fechas, actualización de estado y eliminación confirmada.
- Experiencia responsive, accesible y con estados de carga, error y lista vacía.

## Requisitos

- Node.js 22 o superior.
- MongoDB local o una instancia administrada.

## Desarrollo local

1. Configura el backend:

   ```bash
   cd backend-kodigo
   npm install
   cp .env.example .env
   ```

   Establece `MONGO_URI` en `backend-kodigo/.env` y ejecuta:

   ```bash
   npm run dev
   ```

2. En otra terminal, configura el frontend:

   ```bash
   cd frontend-kodigo
   npm install
   cp .env.example .env
   ```

   Establece `VITE_API_URL=http://localhost:3000/api` en `frontend-kodigo/.env` y ejecuta:

   ```bash
   npm run dev
   ```

## Verificación

```bash
cd frontend-kodigo
npm run lint
npm run build
```

```bash
cd backend-kodigo
npm run build
```

## Publicar una demo en Vercel

El frontend y el API se despliegan como dos proyectos Vercel desde el mismo repositorio:

1. Crea una base MongoDB administrada y prepara su URI de conexión.
2. Crea o reutiliza un proyecto Vercel para el API, selecciona este repositorio y establece `backend-kodigo` como **Root Directory**. Vercel detecta la función serverless en `api/[...path].ts`.
3. En el proyecto del API configura `MONGO_URI` como variable privada y `ALLOWED_ORIGINS` con el dominio público del frontend, por ejemplo `https://kodigo-fuente.vercel.app`. Usa Node.js 22.
4. Despliega el API y verifica `https://<dominio-del-api>/api/health`.
5. En el proyecto frontend, establece `frontend-kodigo` como **Root Directory** y configura `VITE_API_URL` como `https://<dominio-del-api>/api`. Despliega de nuevo para incorporar el valor.
6. Prueba crear, buscar, cambiar el estado y eliminar una promoción.

MongoDB Atlas debe aceptar conexiones del API desplegado. Vercel no garantiza IP de salida fija en todos sus planes; configura Network Access de Atlas según las opciones disponibles en tu plan y usa un usuario de base de datos con permisos mínimos.

No guardes credenciales de MongoDB ni variables privadas en el repositorio. `VITE_API_URL` es configuración pública del frontend, no debe contener secretos.

El repositorio conserva `render.yaml` como alternativa para desplegar el API en Render.
