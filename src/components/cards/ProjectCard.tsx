import { FileTextIcon } from 'lucide-react';

interface ProjectCardProps {
    agencyNumber: string;
    upeCode: number;
    projectType: string;
    city: string;
    district: string;
    status:
        | 'aguardando_vistoria'
        | 'aguardando_geração_de_pdfs'
        | 'aguardando_assinatura_de_pdfs'
        | 'finalizado'
        | 'cancelado';
    inspectorName?: string;
    inspectorDate?: string;
}

const statusColors = {
    aguardando_vistoria: {
        bg: 'bg-blue-100',
        text: 'text-blue-800',
    },
    aguardando_geração_de_pdfs: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
    },
    aguardando_assinatura_de_pdfs: {
        bg: 'bg-purple-100',
        text: 'text-purple-800',
    },
    finalizado: {
        bg: 'bg-green-100',
        text: 'text-green-800',
    },
    cancelado: {
        bg: 'bg-red-100',
        text: 'text-red-800',
    },
};

export default function ProjectCard({
    agencyNumber,
    upeCode,
    projectType,
    city,
    district,
    status,
    inspectorName,
    inspectorDate,
}: ProjectCardProps) {
    const { bg, text } = statusColors[status];

    return (
        <div className="w-full p-4 border rounded-lg shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-3">
                <FileTextIcon className="w-8 h-8 text-primary" />
                <span className="font-semibold text-foreground">
                    UPE {upeCode} — {projectType}
                </span>
            </div>

            <h3 className="font-bold text-lg">
                AG. {agencyNumber} — {city} - {district}
            </h3>

            {inspectorName && inspectorDate && (
                <p className="text-foreground mt-2">
                    Vistoriador(a): {inspectorName} - {inspectorDate}
                </p>
            )}

            <div className="flex gap-2 mt-2 flex-wrap">
                <span
                    className={`${bg} ${text} px-3 py-1 rounded-full font-medium`}
                >
                    {formatStatusText(status)}
                </span>
            </div>
        </div>
    );
}

function formatStatusText(status: string) {
    return status
        .replace(/_/g, ' ')
        .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase());
}
