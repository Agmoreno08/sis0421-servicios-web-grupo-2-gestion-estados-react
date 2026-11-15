import { http } from '@/shared/api/httpClient'
import type { Carrera } from '../model/types'

/**
 * Capa de acceso a datos del recurso Carreras.
 * Los componentes nunca llaman a fetch directamente: usan estas funciones,
 * que reutilizan el httpClient compartido (token Bearer + manejo de errores).
 */
export const carrerasApi = {
    list: (signal?: AbortSignal) => http<Carrera[]>('/carreras', { signal }),

    getById: (id: number, signal?: AbortSignal) => http<Carrera>(`/carreras/${id}`, { signal }),
}
