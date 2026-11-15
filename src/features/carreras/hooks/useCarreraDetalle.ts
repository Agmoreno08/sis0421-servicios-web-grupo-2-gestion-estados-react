import { useQuery } from '@tanstack/react-query'
import { carrerasApi } from '../api/carrerasApi'
import { carreraKeys } from '../api/queryKeys'

/** Detalle GET /carreras/{id}. Solo se ejecuta cuando hay un id seleccionado. */
export function useCarreraDetalle(id: number | null) {
    const query = useQuery({
        queryKey: carreraKeys.detail(id ?? 0),
        queryFn: ({ signal }) => carrerasApi.getById(id as number, signal),
        enabled: id !== null,
    })

    return {
        carrera: query.data,
        error: query.error ?? undefined,
        isLoading: query.isLoading,
    }
}
