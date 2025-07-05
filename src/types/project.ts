import { projectStatus, projectType } from '../constants';

export type ProjectStatus = (typeof projectStatus)[number]['value'];
export type ProjectType = (typeof projectType)[number]['value'];
