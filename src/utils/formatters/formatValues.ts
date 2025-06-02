export function formatLocationValue(value: string): string {
    let formatted = value.replace(/_/g, ' ');

    formatted = formatted
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    formatted = formatted.replace(/- /g, '-');
    formatted = formatted.replace(/ Da /g, ' da ');
    formatted = formatted.replace(/ De /g, ' de ');
    formatted = formatted.replace(/ E /g, ' e ');

    return formatted;
}
