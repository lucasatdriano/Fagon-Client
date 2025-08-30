export const getFirstName = (fullName: string): string => {
    return fullName.split(' ')[0];
};

export const getLastName = (fullName: string): string => {
    const names = fullName.split(' ');
    return names.length > 1 ? names[names.length - 1] : '';
};

export const formatFullName = (fullName: string): string => {
    return fullName
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};
