import { useMutation, useQueryClient } from '@tanstack/react-query'
import { estudiantesApi } from '../api/estudiantesApi'
import { estudianteKeys } from '../api/queryKeys'
import type { Estudiante, EstudianteInput } from '../model/types'

/**
 * POST /estudiantes.
 * Al confirmar el éxito se invalida ['estudiantes'] -> TanStack Query vuelve a pedir
 * la lista y la tabla se actualiza sola, sin window.location.reload().
 */
export function useCreateEstudiante() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (input: EstudianteInput) => estudiantesApi.create(input),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: estudianteKeys.all }),
    })
}

/**
 * PUT /estudiantes/{id}.
 * 1) Actualiza de inmediato la fila en la caché con la respuesta confirmada del servidor.
 * 2) Invalida la consulta para re-sincronizar con la base de datos.
 */
export function useUpdateEstudiante() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, input }: { id: number; input: EstudianteInput }) =>
            estudiantesApi.update(id, input),
        onSuccess: (actualizado) => {
            queryClient.setQueryData<Estudiante[]>(estudianteKeys.list(), (lista) =>
                lista?.map((e) => (e.id === actualizado.id ? actualizado : e)),
            )
            return queryClient.invalidateQueries({ queryKey: estudianteKeys.all })
        },
    })
}
