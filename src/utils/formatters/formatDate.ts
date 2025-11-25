export const formatDate = (date: Date | string) => {
    if (!date) return '';

    const dateObj = new Date(date);

    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const year = dateObj.getUTCFullYear();

    return `${day}/${month}/${year}`;
};

export const formatDateToISO = (dateString: string) => {
    if (!dateString) return undefined;

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        const [year, month, day] = dateString.split('-').map(Number);
        return new Date(Date.UTC(year, month - 1, day)).toISOString();
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
        const [day, month, year] = dateString.split('/').map(Number);
        return new Date(Date.UTC(year, month - 1, day)).toISOString();
    }

    return undefined;
};

export const formatDateForInput = (dateString: string | undefined) => {
    if (!dateString) return '';

    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};

export const formatDateForDisplay = (dateString: string | undefined) => {
    if (!dateString) return '';
    const date = new Date(dateString);

    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();

    return `${day}/${month}/${year}`;
};
