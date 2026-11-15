import { ApiError } from '@/shared/api/httpClient'

/**
 * Componentes de presentación reutilizables para los estados de una solicitud HTTP:
 * LOADING · ERROR · EMPTY. No hacen peticiones: solo reciben props.
 */

export function LoadingState({ text = 'Cargando…' }: { text?: string }) {
    return (
        <div role="status" aria-live="polite" className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-6 text-slate-500">
            <span className="size-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            {text}
        </div>
    )
}

/** Traduce el error a un mensaje claro diferenciando red, 401, 403, 404 y 5xx. */
export function describeError(error: unknown): string {
    if (error instanceof ApiError) {
        if (error.status === 0) return 'No se pudo conectar con el servidor. Verifica que la API Spring Boot esté en ejecución.'
        if (error.status === 401) return 'Tu sesión expiró. Inicia sesión nuevamente.'
        if (error.status === 403) return 'No tienes permisos para consultar este recurso.'
        if (error.status === 404) return 'El recurso solicitado no existe.'
        return error.message
    }
    return 'Ocurrió un error inesperado.'
}

interface ErrorStateProps {
    error: unknown
    onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
    // En 403 reintentar no sirve (el rol no cambia), por eso no se ofrece el botón.
    const canRetry = onRetry && !(error instanceof ApiError && [401, 403].includes(error.status))
    return (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            <p>{describeError(error)}</p>
            {canRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
                >
                    Reintentar
                </button>
            )}
        </div>
    )
}

export function EmptyState({ text }: { text: string }) {
    return (
        <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            {text}
        </div>
    )
}
