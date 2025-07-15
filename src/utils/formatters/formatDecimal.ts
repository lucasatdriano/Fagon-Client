export const formatDecimalValue = (value: number | string): string => {
    if (!value && value !== 0) return '';

    const stringValue = typeof value === 'number' ? value.toString() : value;

    let cleanedValue = stringValue.replace(/[^\d,.]/g, '');

    if (!cleanedValue) return '';

    cleanedValue = cleanedValue.replace('.', ',');

    if (!cleanedValue.includes(',')) {
        return `${cleanedValue},00`;
    }

    const [integerPart, decimalPart] = cleanedValue.split(',');
    const paddedDecimal = (decimalPart || '').padEnd(2, '0').substring(0, 2);
    return `${integerPart},${paddedDecimal}`;
};

export const parseDecimalValue = (value: string): number => {
    return parseFloat(value.replace(',', '.'));
};
