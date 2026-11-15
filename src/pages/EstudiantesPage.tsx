import { useMemo, useState } from 'react'
import { useAuth } from '@/features/auth'
import { useCarreras } from '@/features/carreras'
import {
    EstudianteForm,
    EstudiantesTable,
    useCreateEstudiante,
    useEstudiantes,
    useUpdateEstudiante,
    type Estudiante,
    type EstudianteFormValues,
} from '@/features/estudiantes'
import { EmptyState, ErrorState, LoadingState, describeError } from '@/shared/ui/StatusViews'

/** Estado LOCAL de la página: qué formulario está abierto. */
type FormMode = { mode: 'closed' } | { mode: 'create' } | { mode: 'edit'; estudiante: Estudiante }

/**
 * Página contenedora de Estudiantes.
 *  - Estado de SESIÓN/rol: sessionStore (useAuth).
 *  - Estado del SERVIDOR: estudiantes y carreras (TanStack Query, claves distintas).
 *  - Estado LOCAL: texto de búsqueda, formulario abierto, mensaje de confirmación.
 *  - Estado de ENVÍO: lo administra useMutation (isPending / error).
 */
export function EstudiantesPage() {
    const { hasRole } = useAuth()
    const canEdit = hasRole('ADMIN') // DOCENTE solo consulta. El backend lo vuelve a validar.

    const estudiantes = useEstudiantes()
    const carreras = useCarreras()
    const createMutation = useCreateEstudiante()
    const updateMutation = useUpdateEstudiante()

    const [busqueda, setBusqueda] = useState('')
    const [form, setForm] = useState<FormMode>({ mode: 'closed' })
    const [aviso, setAviso] = useState<string | null>(null)

    // Valores DERIVADOS: se calculan desde la caché, no se copian a otro useState.
    const carreraPorId = useMemo(
        () => new Map((carreras.data ?? []).map((c) => [c.id, c])),
        [carreras.data],
    )
    const filtrados = useMemo(() => {
        const texto = busqueda.trim().toLowerCase()
        const lista = estudiantes.data ?? []
        if (!texto) return lista
        // filter() devuelve un arreglo nuevo: los datos en caché no se mutan.
        return lista.filter(
            (e) => e.nombre.toLowerCase().includes(texto) || e.correo.toLowerCase().includes(texto),
        )
    }, [estudiantes.data, busqueda])

    const carreraNombre = (id: number) => carreraPorId.get(id)?.nombre ?? `Carrera #${id}`

    const handleSubmit = async (values: EstudianteFormValues) => {
        const input = { nombre: values.nombre, correo: values.correo, edad: values.edad, carrera: values.carrera }
        if (form.mode === 'edit') {
            await updateMutation.mutateAsync({ id: form.estudiante.id, input })
            setAviso(`Estudiante "${values.nombre}" actualizado correctamente.`)
        } else {
            await createMutation.mutateAsync(input)
            setAviso(`Estudiante "${values.nombre}" registrado correctamente.`)
        }
        setForm({ mode: 'closed' })
    }

    const isPending = createMutation.isPending || updateMutation.isPending

    return (
        <section className="space-y-6">
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">Estudiantes</h1>
                    <p className="text-sm text-slate-500">
                        GET /api/v1/estudiantes · {canEdit ? 'ADMIN: consulta, alta y edición' : 'DOCENTE: solo consulta'}
                    </p>
                </div>
                {canEdit && form.mode === 'closed' && (
                    <button
                        type="button"
                        onClick={() => {
                            setAviso(null)
                            setForm({ mode: 'create' })
                        }}
                        className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        + Nuevo estudiante
                    </button>
                )}
            </header>

            {aviso && (
                <div role="status" className="flex items-center justify-between rounded-md bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                    {aviso}
                    <button type="button" onClick={() => setAviso(null)} className="text-emerald-800">✕</button>
                </div>
            )}

            {carreras.isError && (
                <div role="alert" className="rounded-md bg-amber-50 px-4 py-2 text-sm text-amber-800">
                    No se pudo cargar el catálogo de carreras ({describeError(carreras.error)}). Se muestra el id de la carrera.
                </div>
            )}

            {canEdit && form.mode !== 'closed' && (
                <EstudianteForm
                    // key: al cambiar de estudiante el formulario se reinicia con sus propios datos.
                    key={form.mode === 'edit' ? form.estudiante.id : 'nuevo'}
                    estudiante={form.mode === 'edit' ? form.estudiante : undefined}
                    carreras={carreras.data}
                    carrerasLoading={carreras.isPending}
                    carrerasError={carreras.isError}
                    isPending={isPending}
                    onSubmit={handleSubmit}
                    onCancel={() => setForm({ mode: 'closed' })}
                />
            )}

            <input
                type="search"
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar por nombre o correo…"
                aria-label="Buscar estudiantes"
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:max-w-sm"
            />

            {estudiantes.isPending && <LoadingState text="Cargando estudiantes…" />}
            {estudiantes.isError && <ErrorState error={estudiantes.error} onRetry={() => estudiantes.refetch()} />}
            {estudiantes.data && estudiantes.data.length === 0 && (
                <EmptyState text="No hay estudiantes registrados." />
            )}
            {estudiantes.data && estudiantes.data.length > 0 && filtrados.length === 0 && (
                <EmptyState text={`Ningún estudiante coincide con "${busqueda}".`} />
            )}
            {filtrados.length > 0 && (
                <>
                    <EstudiantesTable
                        estudiantes={filtrados}
                        carreraNombre={carreraNombre}
                        canEdit={canEdit}
                        onEdit={(estudiante) => {
                            setAviso(null)
                            setForm({ mode: 'edit', estudiante })
                        }}
                    />
                    <p className="text-xs text-slate-500">
                        Mostrando {filtrados.length} de {estudiantes.data?.length ?? 0}
                        {estudiantes.isFetching && ' · sincronizando…'}
                    </p>
                </>
            )}
        </section>
    )
}
