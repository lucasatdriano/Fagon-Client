import { UserService } from '@/services/domains/userService';
import { useQuery } from '@tanstack/react-query';

export function useUser(id: string) {
    return useQuery({
        queryKey: ['user', id],
        queryFn: () => UserService.getById(id),
        enabled: !!id,
    });
}
