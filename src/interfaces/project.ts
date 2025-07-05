import { ProjectType, ProjectStatus } from '../types/project';

export interface ProjectProps {
    id: string;
    agencyNumber: string;
    upeCode: string;
    projectType: ProjectType;
    city: string;
    district: string;
    engineer: string;
    status: ProjectStatus;
    structureType?: string;
    floorHeight?: number;
    inspectorName?: string;
    inspectionDate?: string;
}
