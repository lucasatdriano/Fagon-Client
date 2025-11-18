import { Photo } from '@/interfaces/photo';

export const extractPhotoNumber = (name?: string): number => {
    const match = (name || '').match(/Foto(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
};

export const sortPhotosByNumber = (photos: Photo[]) => {
    return photos.sort(
        (a, b) => extractPhotoNumber(a.name) - extractPhotoNumber(b.name),
    );
};
