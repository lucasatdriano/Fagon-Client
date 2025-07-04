export function formatDate(date: Date | string, locale = 'pt-BR') {
    return new Date(date).toLocaleDateString(locale);
}

export function formatDateForInput(dateString: string | undefined) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}
