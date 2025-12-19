export const extractPhotoNumber = (name?: string): number => {
    const match = (name || '').match(/Foto(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
};
