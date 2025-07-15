export const formatDate = (date: Date | string, locale = 'pt-BR') => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(locale);
};

export const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

export const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
