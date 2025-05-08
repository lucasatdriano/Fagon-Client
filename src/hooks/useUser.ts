import { getUserById } from '@/services/domains/user.service';
import { useQuery } from '@tanstack/react-query';

export function useUser(id: string) {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => getUserById(id),
        enabled: !!id,
    });
}
