import { projectStatus, projectTypes } from '../constants';

export type ProjectStatus = (typeof projectStatus)[number]['value'];
export type ProjectTypes = (typeof projectTypes)[number]['value'];
