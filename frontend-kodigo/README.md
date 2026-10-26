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

Conecta el repositorio a Vercel y establece `frontend-kodigo` como **Root Directory**. Usa el comando de build `npm run build`, el directorio de salida `dist` y configura `VITE_API_URL` con la URL pública del backend más `/api`. Vite incorpora esta variable al compilar; después de cambiarla, vuelve a desplegar.

Consulta el [README principal](../README.md) para configurar el backend y la base de datos de la demo.
