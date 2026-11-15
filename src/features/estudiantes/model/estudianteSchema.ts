import { z } from 'zod'

/**
 * Validación del lado del cliente. Replica las reglas técnicas del DTO
 * (@NotBlank, @Email, @NotNull, @Min(1)). La regla de negocio "mayor de edad"
 * vive en el dominio del backend y se muestra cuando la API la devuelve.
 */
export const estudianteSchema = z.object({
    nombre: z.string().trim().min(1, 'El nombre es obligatorio').max(100, 'Máximo 100 caracteres'),
    correo: z.string().trim().min(1, 'El correo es obligatorio').email('El formato del correo es inválido'),
    edad: z
        .number({ error: 'La edad es obligatoria' })
        .int('La edad debe ser un número entero')
        .min(1, 'La edad debe ser positiva')
        .max(120, 'Edad no válida'),
    carrera: z.number({ error: 'Selecciona una carrera' }).int().positive('Selecciona una carrera'),
})

export type EstudianteFormValues = z.infer<typeof estudianteSchema>
