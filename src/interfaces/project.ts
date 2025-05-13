import { projectStatus } from '@/constants/projectStatus';
import { projectType } from '@/constants/projectType';

type ProjectStatus = (typeof projectStatus)[number]['value'];
type ProjectType = (typeof projectType)[number]['value'];

export interface ProjectProps {
    id: string;
    agencyNumber: string;
    upeCode: number;
    projectType: ProjectType;
    city: string;
    district: string;
    status: ProjectStatus;
    structureType?: string;
    inspectorName?: string;
    inspectorDate?: string;
}
