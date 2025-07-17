import { FileTextIcon } from 'lucide-react';
import { projectStatus } from '../../constants/projectStatus';
import { ProjectProps } from '../../interfaces/project';
import Link from 'next/link';
import { formatNumberAgency } from '../../utils/formatters/formatNumberAgency';
import { formatDate } from '../../utils/formatters/formatDate';
import { getProjectTypeLabel } from '../../utils/formatters/formatValues';

export default function ProjectCard({
    id,
    agencyNumber,
    upeCode,
    projectType,
    city,
    district,
    engineer,
    status,
    inspectorName,
    inspectionDate,
}: ProjectProps) {
    const statusData = projectStatus.find((s) => s.value === status);

    if (!statusData) return null;

    return (
        <Link
            href={`/projects/${id}`}
            passHref
            className="grid gap-4 ml:flex sm:justify-between w-full p-4 border rounded-lg shadow-sm hover:shadow-md bg-white transition-shadow duration-200"
        >
            <div>
                <div className="flex items-center gap-2 mb-3">
                    <FileTextIcon className="w-8 h-8 text-primary" />
                    <span className="font-semibold text-foreground">
                        UPE {upeCode} — {getProjectTypeLabel(projectType)}
                    </span>
                </div>

                <h3 className="font-bold text-lg">
                    AG. {formatNumberAgency(agencyNumber)} — {city} - {district}
                </h3>

                <p className="text-foreground mt-2">
                    Engenheiro(a) Responsável: {engineer}
                </p>

                {inspectorName && inspectionDate && (
                    <p className="text-foreground mt-2">
                        Vistoriador(a): {inspectorName} -{' '}
                        {formatDate(inspectionDate)}
                    </p>
                )}
            </div>

            <div className="my-auto">
                <span
                    className={`${statusData?.class} font-bold px-4 py-2 rounded-full`}
                >
                    {statusData?.label}
                </span>
            </div>
        </Link>
    );
}
