import { locationOptions, pdfType } from '@/constants';

export function getLocationLabelByValue(value: string): string {
    if (!value) return '';

    const option = locationOptions.find((opt) => opt.value === value);
    if (option) return option.label;

    let formatted = value.replace(/_/g, ' ');
    formatted = formatted
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
        .replace(/- /g, '-')
        .replace(/ Da /g, ' da ')
        .replace(/ De /g, ' de ')
        .replace(/ E /g, ' e ');

    return formatted;
}

export function getLocationValueByLabel(label: string): string {
    const option = locationOptions.find((opt) => opt.label === label);
    return option ? option.value : label.toLowerCase().replace(/ /g, '_');
}

export function getPdfLabel(type: string): string {
    return pdfType.find((item) => item.value === type)?.label || type;
}
