export const phoneMask = (value: string): string => {
    value = value.replace(/\D/g, '');

    if (value.length > 10) {
        return value
            .replace(/(\d{2})/, '($1) ')
            .replace(/(\d{5})/, '$1-')
            .replace(/(-\d{4}).*/, '$1');
    } else if (value.length > 6) {
        return value
            .replace(/(\d{2})/, '($1) ')
            .replace(/(\d{4})/, '$1-')
            .replace(/(-\d{4}).*/, '$1');
    } else if (value.length > 2) {
        return value.replace(/(\d{2})/, '($1) ');
    }

    return value;
};
