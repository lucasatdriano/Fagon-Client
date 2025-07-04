export const formatPhone = (phone: string): string => {
    const digits = phone.replace(/\D/g, '');

    if (digits.length === 11) {
        return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (digits.length === 10) {
        return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    return phone;
};
