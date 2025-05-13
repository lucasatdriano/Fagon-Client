import { FileTextIcon } from 'lucide-react';
import { projectStatus } from '@/constants/projectStatus';
import { ProjectProps } from '@/interfaces/project';

export default function ProjectCard({
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
        <div className="w-full cursor-pointer p-4 border rounded-lg shadow-sm hover:shadow-md bg-white transition-shadow duration-200">
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
        </div>
    );
}
