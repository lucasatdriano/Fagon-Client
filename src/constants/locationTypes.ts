export const locationTypes = [
    {
        id: 'externo',
        value: 'externo',
        label: 'Local Externo',
        class: 'bg-lime-100 text-lime-800',
    },
    {
        id: 'interno',
        value: 'interno',
        label: 'Local Interno',
        class: 'bg-sky-100 text-sky-800',
    },
] as const;

export const mappedLocationTypeOptions = locationTypes.map((option) => ({
    ...option,
    value: option.value as 'externo' | 'interno',
}));
