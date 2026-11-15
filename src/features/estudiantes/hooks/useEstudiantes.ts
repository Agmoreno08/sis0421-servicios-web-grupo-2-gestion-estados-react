import { useQuery } from '@tanstack/react-query'
import { estudiantesApi } from '../api/estudiantesApi'
import { estudianteKeys } from '../api/queryKeys'

/** Lista de estudiantes como estado del servidor. La caché es la única fuente de verdad. */
export function useEstudiantes() {
    return useQuery({
        queryKey: estudianteKeys.list(),
        queryFn: ({ signal }) => estudiantesApi.list(signal),
    })
}
