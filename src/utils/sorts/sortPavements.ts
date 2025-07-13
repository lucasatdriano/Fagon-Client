import { pavements as pavementOptions } from '../../constants';
import { Pavement } from '../../interfaces/pavement';

const PAVEMENT_ORDER = pavementOptions.map((p) => p.value);

export function sortPavements(pavements: Pavement[]): Pavement[] {
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
