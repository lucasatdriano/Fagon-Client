export const projectType = [{ value: 'laudo_cmar', label: 'Laudo CMAR' }];

export const getProjectTypeLabel = (value: string) => {
    return projectType.find((type) => type.value === value)?.label || value;
};
