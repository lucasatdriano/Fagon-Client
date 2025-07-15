export const formatFloorHeight = (input: string): string => {
    const withoutM = input
        .replace(/(\d)\s*[mM]\b/g, '$1')
        .replace(/\b[mM]\s*(\d)/g, '$1');

    const withoutPrefix = withoutM.replace(
        /^(entre|de|por volta de|a|cerca de)\s+/gi,
        '',
    );

    const numbersAndSeparators =
        withoutPrefix.match(/[\d.,]+|\s*(a|e|-)\s*/gi) || [];

    const processedParts = numbersAndSeparators.map((part) => {
        if (/(a|e|-)/i.test(part.trim())) {
            return ` ${part.trim()} `;
        }
        return formatSingleNumber(part);
    });

    const result = processedParts.join('').replace(/\s+/g, ' ').trim();

    return result || input;
};

const formatSingleNumber = (numStr: string): string => {
    const cleaned = numStr.replace(/[^\d.,]/g, '');
    const withDot = cleaned.replace(',', '.');
    const parts = withDot.split('.');

    let integerPart = parts[0] || '0';
    let decimalPart = parts[1] || '00';

    integerPart = integerPart.replace(/^0+/, '') || '0';
    decimalPart = decimalPart.padEnd(2, '0').slice(0, 2);

    return `${integerPart},${decimalPart}`;
};
