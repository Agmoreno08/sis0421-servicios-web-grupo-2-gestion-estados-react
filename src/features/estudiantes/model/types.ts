/**
 * Contrato verificado en Postman y en los DTO del backend:
 *  - EstudianteResponse: { id, nombre, correo, edad, carreraId }
 *  - EstudianteRequest / EstudianteUpdateRequest: { nombre, correo, edad, carrera }
 * Ojo: la respuesta usa "carreraId" pero la solicitud usa "carrera".
 */
export interface Estudiante {
    id: number
    nombre: string
    correo: string
    edad: number
    carreraId: number
}

export interface EstudianteInput {
    nombre: string
    correo: string
    edad: number
    carrera: number
}
