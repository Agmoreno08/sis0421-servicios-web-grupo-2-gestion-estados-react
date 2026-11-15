/**
 * Contrato verificado en Postman y en CarreraResponse.java:
 * GET /api/v1/carreras  ->  [{ "id": 1, "codigo": "ISI", "nombre": "Ingeniería en Sistemas" }]
 */
export interface Carrera {
    id: number
    codigo: string
    nombre: string
}
