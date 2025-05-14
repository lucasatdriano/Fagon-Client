import { FileTextIcon } from 'lucide-react';
import { projectStatus } from '@/constants/projectStatus';
import { ProjectProps } from '@/interfaces/project';
import Link from 'next/link';

export default function ProjectCard({
    id,
    agencyNumber,
    upeCode,
    projectType,
    city,
    district,
    status,
    inspectorName,
    inspectorDate,
}: ProjectProps) {
    const statusData = projectStatus.find((s) => s.value === status);

    if (!statusData) return null;

    return (
        <Link
            href={`/projects/${id}`}
            passHref
            className="block w-full p-4 border rounded-lg shadow-sm hover:shadow-md bg-white transition-shadow duration-200"
        >
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

            <div className="flex mt-2">
                <span
                    className={`${statusData.bg} ${statusData.text} px-3 py-1 rounded-full font-medium`}
                >
                    {statusData.label}
                </span>
            </div>
        </Link>
    );
}
