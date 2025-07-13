export const formatDecimalValue = (value: number | string): string => {
    const stringValue = typeof value === 'number' ? value.toString() : value;

    let formattedValue = stringValue.replace('.', ',');

    if (!formattedValue.includes(',')) {
        formattedValue += ',00';
    } else {
        const [integerPart, decimalPart] = formattedValue.split(',');
        const paddedDecimal = (decimalPart || '')
            .padEnd(2, '0')
            .substring(0, 2);
        formattedValue = `${integerPart},${paddedDecimal}`;
    }

    return formattedValue;
};
