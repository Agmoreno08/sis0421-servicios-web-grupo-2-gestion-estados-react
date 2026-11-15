import { ErrorState, LoadingState } from '@/shared/ui/StatusViews'
import { useCarreraDetalle } from '../hooks/useCarreraDetalle'

interface CarreraDetalleProps {
    id: number
    onClose: () => void
}

export function CarreraDetalle({ id, onClose }: CarreraDetalleProps) {
    const { carrera, error, isLoading } = useCarreraDetalle(id)

    return (
        <aside className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900">Detalle de carrera</h2>
                <button type="button" onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800">
                    Cerrar
                </button>
            </div>

            {isLoading && <LoadingState text="Consultando GET /carreras/{id}…" />}
            {error !== undefined && <ErrorState error={error} />}
            {carrera && (
                <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
                    <dt className="text-slate-500">ID</dt>
                    <dd>{carrera.id}</dd>
                    <dt className="text-slate-500">Código</dt>
                    <dd className="font-mono">{carrera.codigo}</dd>
                    <dt className="text-slate-500">Nombre</dt>
                    <dd>{carrera.nombre}</dd>
                </dl>
            )}
        </aside>
    )
}
