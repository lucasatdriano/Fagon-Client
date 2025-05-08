export function formatDate(date: Date | string, locale = 'pt-BR') {
    return new Date(date).toLocaleDateString(locale);
}
