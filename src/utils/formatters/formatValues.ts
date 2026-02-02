import {
    locationOptions,
    pavements,
    pdfTypes,
    projectTypes,
} from '../../constants';

export const getLocationLabelByValue = (value: string): string => {
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
};

export const getLocationValueByLabel = (label: string): string => {
    const option = locationOptions.find((opt) => opt.label === label);
    return option ? option.value : label.toLowerCase().replace(/ /g, '_');
};

export const getPdfLabel = (type: string): string => {
    return pdfTypes.find((item) => item.value === type)?.label || type;
};

export const getProjectTypeLabel = (value: string) => {
    return projectTypes.find((type) => type.value === value)?.label || value;
};

export const getPavementValueByLabel = (pavementValue: string): string => {
    const predefined = pavements.find((p) => p.value === pavementValue);
    if (predefined) return predefined.label;

    return pavementValue
        .replace(/_/g, ' ')
        .replace(/(\d+)_(\w+)/, '$1º $2')
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const formatWithCapitals = (value: string): string => {
    if (!value) return '';

    return value
        .split('_')
        .map((word, index) => {
            if (index === 0) {
                return (
                    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                );
            }

            return word.length > 3
                ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                : word.toLowerCase();
        })
        .join(' ');
};
