import { cameraType } from '@/constants/cameraType';
import { userRole } from '@/constants/userRole';

type UserRole = (typeof userRole)[number]['value'];
type CameraType = (typeof cameraType)[number]['value'];

export interface userProps {
    id: string;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    status: boolean;
    cameraType?: CameraType;
}
