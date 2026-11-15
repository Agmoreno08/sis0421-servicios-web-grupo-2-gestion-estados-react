import { NavLink, Outlet } from 'react-router'
import { useAuth } from '@/features/auth'

const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3 py-1.5 text-sm ${isActive ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`

/** Layout de las rutas protegidas: barra de navegación + contenido. */
export function AppLayout() {
    const { session, logout, hasRole } = useAuth()

    return (
        <div className="min-h-dvh bg-slate-100">
            <nav className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div className="flex items-center gap-2">
                        <span className="mr-4 font-semibold text-slate-900">Gestión Académica</span>
                        <NavLink to="/" end className={linkClass}>Inicio</NavLink>
                        <NavLink to="/carreras" className={linkClass}>Carreras</NavLink>
                        {hasRole('ADMIN', 'DOCENTE') && (
                            <NavLink to="/estudiantes" className={linkClass}>Estudiantes</NavLink>
                        )}
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                        <span className="text-slate-500">
                            {session?.username} · <strong>{session?.rol}</strong>
                        </span>
                        <button
                            type="button"
                            onClick={logout}
                            className="rounded-md border border-slate-300 px-3 py-1.5 hover:bg-slate-50"
                        >
                            Cerrar sesión
                        </button>
                    </div>
                </div>
            </nav>
            <main className="mx-auto max-w-6xl px-4 py-8">
                <Outlet />
            </main>
        </div>
    )
}
