import { useQuery } from '@tanstack/react-query'
import { carrerasApi } from '../api/carrerasApi'
import { carreraKeys } from '../api/queryKeys'

/**
 * Catálogo de carreras como estado del servidor (TanStack Query).
 * Lo comparten la página de Carreras y el selector del formulario de estudiantes:
 * ambos leen la misma entrada de caché ['carreras', 'list'] y solo se hace una petición.
 * El catálogo cambia poco, por eso se considera "fresco" durante 5 minutos.
 */
export function useCarreras() {
    return useQuery({
        queryKey: carreraKeys.list(),
        queryFn: ({ signal }) => carrerasApi.list(signal),
        staleTime: 5 * 60_000,
    })
}
