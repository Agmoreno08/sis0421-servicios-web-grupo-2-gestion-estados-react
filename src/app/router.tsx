import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedRoute, PublicOnlyRoute } from "@/features/auth";
import { AppLayout } from "./AppLayout";
import { CarrerasPage } from "@/pages/CarrerasPage";
import { EstudiantesPage } from "@/pages/EstudiantesPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { ForbiddenPage } from "@/pages/ForbiddenPage";
import { LoginPage } from "@/pages/LoginPage";

export const router = createBrowserRouter([
    {
        Component: PublicOnlyRoute,
        children: [{ path: '/login', Component: LoginPage }],
    },
    {
        Component: ProtectedRoute,
        children: [
            {
                Component: AppLayout,
                children: [
                    { path: '/', Component: DashboardPage },
                    // GET /carreras admite ADMIN, DOCENTE y ESTUDIANTE: basta con estar autenticado.
                    { path: '/carreras', Component: CarrerasPage },
                    {
                        // GET /estudiantes solo admite ADMIN y DOCENTE (@PreAuthorize del backend).
                        // Este guard es UX; la autorización real la hace Spring Security.
                        element: <ProtectedRoute allowedRoles={['ADMIN', 'DOCENTE']} />,
                        children: [{ path: '/estudiantes', Component: EstudiantesPage }],
                    },
                ],
            },
        ],
    },
    { path: '/forbidden', Component: ForbiddenPage },
    { path: '*', element: <Navigate to="/" replace /> },
])
