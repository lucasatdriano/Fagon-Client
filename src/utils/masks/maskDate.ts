export const dateMask = (value: string) => {
    if (!value) return '';

    value = value.replace(/\D/g, '');

    if (value.length > 8) value = value.slice(0, 8);

    if (value.length > 4) {
        value = value.replace(/^(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
    } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,2})/, '$1/$2');
    }

    return value;
};

export const unformatDate = (value: string) => {
    return value.replace(/\D/g, '');
};
