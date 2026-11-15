/** API pública del módulo estudiantes. */
export { EstudiantesTable } from './components/EstudiantesTable'
export { EstudianteForm } from './components/EstudianteForm'
export { useEstudiantes } from './hooks/useEstudiantes'
export { useCreateEstudiante, useUpdateEstudiante } from './hooks/useEstudianteMutations'
export { estudianteKeys } from './api/queryKeys'
export type { Estudiante, EstudianteInput } from './model/types'
export type { EstudianteFormValues } from './model/estudianteSchema'
