import { Link } from "react-router";
import { useAuth, useCurrentUser } from "@/features/auth";
import { ErrorState, LoadingState } from "@/shared/ui/StatusViews";

export function DashboardPage() {
    const { data: usuario, isPending, error, refetch } = useCurrentUser()
    const { hasRole } = useAuth()

    return (
        <section className="space-y-6">
            <h1 className="text-2xl font-semibold text-slate-900">Inicio</h1>

            {isPending && <LoadingState />}
            {error && <ErrorState error={error} onRetry={() => refetch()} />}
            {usuario && (
                <div className="rounded-xl bg-white p-6 shadow-sm">
                    <p className="text-lg">
                        Bienvenido, <strong>{usuario.nombre}</strong>
                    </p>
                    <p className="text-sm text-slate-500">
                        {usuario.username} · {usuario.rol}
                    </p>
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <Link to="/carreras" className="rounded-xl bg-white p-6 shadow-sm hover:ring-2 hover:ring-indigo-200">
                    <h2 className="font-semibold text-slate-900">Carreras</h2>
                    <p className="text-sm text-slate-500">Catálogo consultado desde la API Spring Boot.</p>
                </Link>
                {hasRole('ADMIN', 'DOCENTE') && (
                    <Link to="/estudiantes" className="rounded-xl bg-white p-6 shadow-sm hover:ring-2 hover:ring-indigo-200">
                        <h2 className="font-semibold text-slate-900">Estudiantes</h2>
                        <p className="text-sm text-slate-500">Consulta, registro y edición sincronizados con TanStack Query.</p>
                    </Link>
                )}
            </div>
        </section>
    )
}
