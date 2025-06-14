export const locationType = [
    {
        id: 'externo',
        value: 'externo',
        label: 'Local Externo',
        bg: 'bg-blue-100',
        text: 'text-blue-800',
    },
    {
        id: 'interno',
        value: 'interno',
        label: 'Local Interno',
        bg: 'bg-purple-100',
        text: 'text-purple-800',
    },
] as const;

export const mappedLocationTypeOptions = locationType.map((option) => ({
    ...option,
    value: option.value as 'externo' | 'interno',
}));
