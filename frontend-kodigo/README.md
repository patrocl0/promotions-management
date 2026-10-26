# PromoDesk — frontend

Panel responsive de administración de promociones, construido con React, TypeScript, Vite, Tailwind CSS y componentes shadcn/ui.

## Desarrollo local

```bash
npm install
cp .env.example .env
npm run dev
```

Configura `VITE_API_URL` en `.env` con la URL base de la API, incluyendo `/api` (por ejemplo, `http://localhost:3000/api`).

## Validación y compilación

```bash
npm run lint
npm run build
npm run preview
```

## Despliegue en Vercel

Conecta el repositorio a Vercel y establece `frontend-kodigo` como **Root Directory**. Usa el comando de build `npm run build`, el directorio de salida `dist` y configura `VITE_API_URL` con la URL pública del proyecto Vercel del API más `/api`. Vite incorpora esta variable al compilar; después de cambiarla, vuelve a desplegar.

El API se despliega como un proyecto Vercel separado con `backend-kodigo` como **Root Directory**. Consulta el [README principal](../README.md) para los pasos completos y la configuración privada de MongoDB.
