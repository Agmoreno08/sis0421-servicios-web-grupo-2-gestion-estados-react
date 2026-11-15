import type { Estudiante } from '../model/types'

interface EstudiantesTableProps {
    estudiantes: Estudiante[]
    /** Resuelve el nombre de la carrera usando el catálogo consultado. */
    carreraNombre: (carreraId: number) => string
    canEdit: boolean
    onEdit: (estudiante: Estudiante) => void
}

/** Componente de presentación: no hace peticiones, solo dibuja lo que recibe. */
export function EstudiantesTable({ estudiantes, carreraNombre, canEdit, onEdit }: EstudiantesTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                    <tr>
                        <th className="px-4 py-3 font-medium">Nombre</th>
                        <th className="px-4 py-3 font-medium">Correo</th>
                        <th className="px-4 py-3 font-medium">Edad</th>
                        <th className="px-4 py-3 font-medium">Carrera</th>
                        {canEdit && <th className="px-4 py-3" />}
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map((e) => (
                        <tr key={e.id} className="border-t border-slate-100">
                            <td className="px-4 py-3">{e.nombre}</td>
                            <td className="px-4 py-3 text-slate-600">{e.correo}</td>
                            <td className="px-4 py-3">{e.edad}</td>
                            <td className="px-4 py-3">{carreraNombre(e.carreraId)}</td>
                            {canEdit && (
                                <td className="px-4 py-3 text-right">
                                    <button type="button" onClick={() => onEdit(e)} className="text-indigo-600 hover:underline">
                                        Editar
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
