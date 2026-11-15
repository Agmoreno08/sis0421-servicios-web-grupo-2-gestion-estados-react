import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Carrera } from '@/features/carreras'
import { ApiError } from '@/shared/api/httpClient'
import { describeError } from '@/shared/ui/StatusViews'
import { estudianteSchema, type EstudianteFormValues } from '../model/estudianteSchema'
import type { Estudiante } from '../model/types'
import { CarreraSelect } from './CarreraSelect'

interface EstudianteFormProps {
    /** Si viene, el formulario está en modo edición y se precargan sus datos. */
    estudiante?: Estudiante
    carreras: Carrera[] | undefined
    carrerasLoading: boolean
    carrerasError: boolean
    isPending: boolean
    /** Debe rechazar con ApiError si la API devuelve error (mutateAsync). */
    onSubmit: (values: EstudianteFormValues) => Promise<unknown>
    onCancel: () => void
}

const FIELDS = ['nombre', 'correo', 'edad', 'carrera'] as const

const inputClass =
    'w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 aria-invalid:border-red-500 disabled:bg-slate-100'

/**
 * El formulario mantiene su PROPIO estado local (react-hook-form). Si la API responde con error,
 * los valores escritos no se pierden: solo se marcan los campos con el mensaje correspondiente.
 */
export function EstudianteForm({
    estudiante,
    carreras,
    carrerasLoading,
    carrerasError,
    isPending,
    onSubmit,
    onCancel,
}: EstudianteFormProps) {
    const [serverError, setServerError] = useState<string | null>(null)
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<EstudianteFormValues>({
        resolver: zodResolver(estudianteSchema),
        defaultValues: estudiante
            ? {
                  nombre: estudiante.nombre,
                  correo: estudiante.correo,
                  edad: estudiante.edad,
                  carrera: estudiante.carreraId,
              }
            : { nombre: '', correo: '' },
    })

    const submit = handleSubmit(async (values) => {
        setServerError(null)
        try {
            await onSubmit(values)
        } catch (error) {
            // 400 Validation Error -> { errors: { campo: mensaje } } del GlobalExceptionHandler
            if (error instanceof ApiError && error.fieldErrors) {
                for (const [field, message] of Object.entries(error.fieldErrors)) {
                    if ((FIELDS as readonly string[]).includes(field)) {
                        setError(field as (typeof FIELDS)[number], { type: 'server', message })
                    }
                }
            }
            // 409: correo duplicado -> se asocia al campo correo
            if (error instanceof ApiError && error.status === 409) {
                setError('correo', { type: 'server', message: error.message })
            }
            setServerError(describeError(error))
        }
    })

    const isEdit = estudiante !== undefined

    return (
        <form onSubmit={submit} noValidate className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="font-semibold text-slate-900">
                {isEdit ? `Editar estudiante #${estudiante.id}` : 'Registrar estudiante'}
            </h2>

            <Field label="Nombre" id="nombre" error={errors.nombre?.message}>
                <input id="nombre" className={inputClass} aria-invalid={errors.nombre ? true : undefined} {...register('nombre')} />
            </Field>

            <Field label="Correo" id="correo" error={errors.correo?.message}>
                <input id="correo" type="email" className={inputClass} aria-invalid={errors.correo ? true : undefined} {...register('correo')} />
            </Field>

            <Field label="Edad" id="edad" error={errors.edad?.message}>
                <input
                    id="edad"
                    type="number"
                    min={1}
                    className={inputClass}
                    aria-invalid={errors.edad ? true : undefined}
                    {...register('edad', { valueAsNumber: true })}
                />
            </Field>

            <Field label="Carrera" id="carrera" error={errors.carrera?.message}>
                <CarreraSelect
                    id="carrera"
                    className={inputClass}
                    aria-invalid={errors.carrera ? true : undefined}
                    carreras={carreras}
                    isLoading={carrerasLoading}
                    hasError={carrerasError}
                    {...register('carrera', { valueAsNumber: true })}
                />
            </Field>

            {serverError && (
                <div role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                    {serverError}
                </div>
            )}

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={isPending}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isPending ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Registrar'}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="rounded-md border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50"
                >
                    Cancelar
                </button>
            </div>
        </form>
    )
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: ReactNode }) {
    return (
        <div className="space-y-1">
            <label htmlFor={id} className="block text-sm font-medium text-slate-700">
                {label}
            </label>
            {children}
            {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
    )
}
