'use client';

import { useEffect, useState } from 'react';
import { getCookie } from 'cookies-next';

export function useUserRole() {
    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
        const role = getCookie('role');
        setUserRole(role?.toString() || null);
    }, []);

    return {
        isVisitor: userRole === 'vistoriador',
        userRole,
    };
}
