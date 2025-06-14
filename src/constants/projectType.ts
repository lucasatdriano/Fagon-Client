export const projectType = [
    { id: '1', value: 'laudo_cmar', label: 'Laudo CMAR' },
];

export const getProjectTypeLabel = (value: string) => {
    return projectType.find((type) => type.value === value)?.label || value;
};
