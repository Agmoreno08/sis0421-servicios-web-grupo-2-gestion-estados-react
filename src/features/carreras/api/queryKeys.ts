/**
 * Claves de consulta de TanStack Query para el recurso Carreras.
 * Se separan de las de estudiantes para poder invalidar cada recurso de forma independiente.
 */
export const carreraKeys = {
    all: ['carreras'] as const,
    list: () => [...carreraKeys.all, 'list'] as const,
    detail: (id: number) => [...carreraKeys.all, 'detail', id] as const,
}
