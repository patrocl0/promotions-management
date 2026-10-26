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

## Publicar una demo

La demo requiere que el frontend, la API y MongoDB sean accesibles por internet:

1. Crea una base MongoDB administrada y copia su URI de conexión.
2. Despliega `backend-kodigo` en Render usando el blueprint `render.yaml` de la raíz. Configura `MONGO_URI` y `ALLOWED_ORIGINS` con la URL pública del frontend.
3. Despliega `frontend-kodigo` en Vercel con esa carpeta como **Root Directory**. Define `VITE_API_URL` como la URL del backend terminada en `/api`.
4. Añade el dominio de Vercel a `ALLOWED_ORIGINS` en Render y vuelve a desplegar el backend si cambiaste el valor.
5. Comprueba el endpoint `/health` y prueba crear, buscar, cambiar el estado y eliminar una promoción.

No guardes credenciales de MongoDB ni variables privadas en el repositorio. `VITE_API_URL` es configuración pública del frontend, no debe contener secretos.

La publicación externa requiere cuentas y credenciales de los proveedores de hosting/base de datos; el repositorio no incluye esos secretos.
