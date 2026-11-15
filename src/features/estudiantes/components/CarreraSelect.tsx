import type { ComponentProps } from 'react'
import type { Carrera } from '@/features/carreras'

type CarreraSelectProps = ComponentProps<'select'> & {
    carreras: Carrera[] | undefined
    isLoading: boolean
    hasError: boolean
}

/**
 * Selector de carreras. Es de presentación: recibe el catálogo ya consultado por props
 * y las props de react-hook-form (register) se propagan al <select>, incluida la ref (React 19).
 */
export function CarreraSelect({ carreras, isLoading, hasError, className, ...selectProps }: CarreraSelectProps) {
    return (
        <select
            {...selectProps}
            disabled={isLoading || hasError || selectProps.disabled}
            className={className}
        >
            <option value="">
                {isLoading ? 'Cargando carreras…' : hasError ? 'No se pudo cargar el catálogo' : 'Selecciona una carrera'}
            </option>
            {carreras?.map((carrera) => (
                <option key={carrera.id} value={carrera.id}>
                    {carrera.codigo} — {carrera.nombre}
                </option>
            ))}
        </select>
    )
}
