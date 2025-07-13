export const decimalMask = (value: string): string => {
    value = value.replace(/[^\d,.]/g, '');

    value = value.replace('.', ',');

    const parts = value.split(',');
    if (parts.length > 2) {
        value = parts[0] + ',' + parts.slice(1).join('');
    }

    if (parts.length > 1) {
        value = parts[0] + ',' + parts[1].slice(0, 2);
    }

    return value;
};
