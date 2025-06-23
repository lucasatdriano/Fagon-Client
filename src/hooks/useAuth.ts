'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';
import { AuthService } from '@/services/domains/authService';

type UseAuthOptions = {
    redirectIfAuthenticated?: string | boolean;
    redirectIfUnauthenticated?: string;
    checkVistoriador?: boolean;
};

export function useAuth(options?: UseAuthOptions) {
    const router = useRouter();
    const effectRan = useRef(false);

    useEffect(() => {
        const abortController = new AbortController();

        if (effectRan.current) return;
        effectRan.current = true;

        async function verifyAuth() {
            try {
                const user = await AuthService.getMe();
                const cookies = parseCookies();
                const projectId = cookies.projectId;

                if (
                    options?.checkVistoriador &&
                    user.data.role === 'vistoriador' &&
                    projectId
                ) {
                    router.push(`/projects/${projectId}/locations`);
                    return;
                }

                if (options?.redirectIfAuthenticated) {
                    const redirectPath =
                        typeof options.redirectIfAuthenticated === 'string'
                            ? options.redirectIfAuthenticated
                            : '/projects';
                    router.push(redirectPath);
                }
            } catch {
                if (!abortController.signal.aborted) {
                    router.push(options?.redirectIfUnauthenticated || '/login');
                }
            }
        }

        verifyAuth();

        return () => abortController.abort();
    }, [router, options]);
}
