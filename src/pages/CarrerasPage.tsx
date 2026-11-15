import { useState } from 'react'
import { CarreraDetalle, CarrerasTable, useCarreras } from '@/features/carreras'
import { EmptyState, ErrorState, LoadingState } from '@/shared/ui/StatusViews'

/**
 * Semana 13: la lista ya no vive en useState/useEffect sino en la caché de TanStack Query.
 * Estado local: id seleccionado. Estado remoto: catálogo de carreras.
 */
export function CarrerasPage() {
    const { data: carreras, isPending, isError, error, refetch, isFetching } = useCarreras()
    const [selectedId, setSelectedId] = useState<number | null>(null)

    return (
        <section className="space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Carreras</h1>
                    <p className="text-sm text-slate-500">Datos obtenidos de GET /api/v1/carreras</p>
                </div>
                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm hover:bg-slate-50 disabled:opacity-50"
                >
                    {isFetching ? 'Actualizando…' : 'Actualizar'}
                </button>
            </header>

            {isPending && <LoadingState text="Cargando carreras…" />}
            {isError && <ErrorState error={error} onRetry={() => refetch()} />}
            {carreras && carreras.length === 0 && <EmptyState text="No hay carreras registradas todavía." />}
            {carreras && carreras.length > 0 && (
                <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                    <CarrerasTable carreras={carreras} selectedId={selectedId} onSelect={setSelectedId} />
                    {selectedId !== null && (
                        <CarreraDetalle id={selectedId} onClose={() => setSelectedId(null)} />
                    )}
                </div>
            )}
        </section>
    )
}
