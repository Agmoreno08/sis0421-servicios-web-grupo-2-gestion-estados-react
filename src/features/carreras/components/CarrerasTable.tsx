import type { Carrera } from '../model/types'

interface CarrerasTableProps {
    carreras: Carrera[]
    selectedId: number | null
    onSelect: (id: number) => void
}

/** Componente de presentación: recibe datos por props y avisa la selección por callback. */
export function CarrerasTable({ carreras, selectedId, onSelect }: CarrerasTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                    <tr>
                        <th className="px-4 py-3 font-medium">ID</th>
                        <th className="px-4 py-3 font-medium">Código</th>
                        <th className="px-4 py-3 font-medium">Nombre</th>
                        <th className="px-4 py-3" />
                    </tr>
                </thead>
                <tbody>
                    {carreras.map((carrera) => (
                        <tr
                            key={carrera.id}
                            className={`border-t border-slate-100 ${selectedId === carrera.id ? 'bg-indigo-50' : ''}`}
                        >
                            <td className="px-4 py-3 text-slate-500">{carrera.id}</td>
                            <td className="px-4 py-3 font-mono">{carrera.codigo}</td>
                            <td className="px-4 py-3">{carrera.nombre}</td>
                            <td className="px-4 py-3 text-right">
                                <button
                                    type="button"
                                    onClick={() => onSelect(carrera.id)}
                                    className="text-indigo-600 hover:underline"
                                >
                                    Ver detalle
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
