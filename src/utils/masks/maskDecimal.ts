export const decimalMask = (value: string): string => {
    value = value.replace(/[^\d.,]/g, '');
    value = value.replace(',', '.');

    const parts = value.split('.');
    if (parts.length > 2) {
        return parts[0] + '.' + parts.slice(1).join('');
    }

    return value;
};
