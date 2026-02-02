import { ProjectTypes, ProjectStatus } from '../types/project';

export interface ProjectProps {
    id: string;
    agencyNumber: string;
    upeCode: string;
    projectType: ProjectTypes;
    technicalResponsibilityNumber?: string;
    state: string;
    city: string;
    district: string;
    engineer: string;
    status: ProjectStatus;
    structureType?: string;
    floorHeight?: string;
    inspectorName?: string;
    inspectionDate?: string;
}
