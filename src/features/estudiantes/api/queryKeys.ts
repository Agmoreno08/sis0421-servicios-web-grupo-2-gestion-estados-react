/** Claves de consulta del recurso Estudiantes (distintas de las de carreras). */
export const estudianteKeys = {
    all: ['estudiantes'] as const,
    list: () => [...estudianteKeys.all, 'list'] as const,
}
