import { http } from '@/shared/api/httpClient'
import type { Estudiante, EstudianteInput } from '../model/types'

/** Servicio tipado del recurso /api/v1/estudiantes (usa el httpClient existente). */
export const estudiantesApi = {
    list: (signal?: AbortSignal) => http<Estudiante[]>('/estudiantes', { signal }),

    create: (input: EstudianteInput) =>
        http<Estudiante>('/estudiantes', { method: 'POST', body: input }),

    update: (id: number, input: EstudianteInput) =>
        http<Estudiante>(`/estudiantes/${id}`, { method: 'PUT', body: input }),
}
