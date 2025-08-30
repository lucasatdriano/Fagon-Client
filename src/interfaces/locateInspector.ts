import { inspectorProps } from './inspector';

export interface LocateInspectorProps extends inspectorProps {
    id: string;
    distance?: number;
    distanceMethod?: string;
}
