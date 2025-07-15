import { pavements as pavementOptions } from '../../constants';

const PAVEMENT_ORDER = pavementOptions.map((p) => p.value);
interface PavementSort {
    id: string;
    pavement: string;
    height: number;
    area?: number;
}

export function sortPavements(pavements: PavementSort[]): PavementSort[] {
    return [...pavements].sort((a, b) => {
        const indexA = PAVEMENT_ORDER.indexOf(a.pavement);
        const indexB = PAVEMENT_ORDER.indexOf(b.pavement);

        if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
        }

        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;

        return 0;
    });
}
