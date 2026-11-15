# Gestión Académica Web — Sesión 13 (Gestión de estados con TanStack Query)

SIS0421 Servicios Web · Grupo 2 · Angel Moreno, Andrea Cuadra

## Qué se agregó sobre la Sesión 12
| Archivo | Responsabilidad |
|---|---|
| `src/features/carreras/api/queryKeys.ts` | Claves `['carreras','list']`, `['carreras','detail',id]` |
| `src/features/carreras/hooks/useCarreras.ts` | Catálogo con `useQuery` (reemplaza useState/useEffect) |
| `src/features/estudiantes/api/estudiantesApi.ts` | `GET`, `POST`, `PUT /estudiantes` tipados |
| `src/features/estudiantes/api/queryKeys.ts` | Claves `['estudiantes','list']` |
| `src/features/estudiantes/hooks/useEstudiantes.ts` | Lista con `useQuery` |
| `src/features/estudiantes/hooks/useEstudianteMutations.ts` | `useMutation` de alta y edición + invalidación / `setQueryData` |
| `src/features/estudiantes/model/estudianteSchema.ts` | Validación Zod del formulario |
| `src/features/estudiantes/components/*` | Tabla, formulario (react-hook-form) y selector de carreras |
| `src/pages/EstudiantesPage.tsx` | Contenedor: filtro local, modo de formulario, permisos por rol |

## Clasificación de estados
| Dato | Dónde vive | Fuente de verdad |
|---|---|---|
| Sesión y rol | `sessionStore` (external store + `sessionStorage`) | JWT emitido por `/auth/login` |
| Búsqueda, formulario abierto, aviso | `useState` local de `EstudiantesPage` | La interfaz |
| Catálogo de carreras | TanStack Query `['carreras','list']` | PostgreSQL vía API |
| Lista de estudiantes | TanStack Query `['estudiantes','list']` | PostgreSQL vía API |
| Envío del formulario | `useMutation` (`isPending`, `error`) + react-hook-form | La mutación en curso |

## Permisos
- **ADMIN**: ve el botón “Nuevo estudiante” y “Editar”.
- **DOCENTE**: solo consulta (acciones ocultas). El backend vuelve a validar con `@PreAuthorize`.
- **ESTUDIANTE**: la ruta `/estudiantes` redirige a `/forbidden`.

## Requisitos
- Backend `gestion-academica` (Spring Boot 4, Java 21) corriendo en **http://localhost:9090** con PostgreSQL (`universidad`).
- Node 20+ y pnpm (`npm i -g pnpm`).

## Variables del backend (IntelliJ → Run/Debug Configurations → Environment variables)
```
JWT_SECRET=<clave Base64 de al menos 32 bytes>      # p. ej. salida de: openssl rand -base64 32
ADMIN_PASSWORD=<mínimo 8 caracteres>               # crea el usuario 'admin' al primer arranque
```

## Ejecutar el frontend
```bash
pnpm install
pnpm dev          # http://localhost:5173  (el proxy de Vite envía /api → http://localhost:9090)
```

## Corrección necesaria en el backend (documentada en el informe)
El repositorio del docente trae dos errores de configuración que provocan 403/400 en todos los
endpoints protegidos por rol. Ver `backend-fix.patch` y la sección de diagnóstico del documento.
