/* eslint-disable @typescript-eslint/no-explicit-any */
import EXIF from 'exif-js';

export interface FixedImage {
    file: File;
    url: string;
}

export const fixImageOrientation = (file: File): Promise<FixedImage> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const image = new Image();
            image.onload = () => {
                EXIF.getData(image as any, () => {
                    const orientation = EXIF.getTag(image, 'Orientation');

                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d')!;

                    if (orientation === 6 || orientation === 8) {
                        canvas.width = image.height;
                        canvas.height = image.width;
                    } else {
                        canvas.width = image.width;
                        canvas.height = image.height;
                    }

                    switch (orientation) {
                        case 2:
                            ctx.transform(-1, 0, 0, 1, image.width, 0);
                            break;
                        case 3:
                            ctx.transform(
                                -1,
                                0,
                                0,
                                -1,
                                image.width,
                                image.height,
                            );
                            break;
                        case 4:
                            ctx.transform(1, 0, 0, -1, 0, image.height);
                            break;
                        case 5:
                            ctx.transform(0, 1, 1, 0, 0, 0);
                            break;
                        case 6:
                            ctx.transform(0, 1, -1, 0, image.height, 0);
                            break;
                        case 7:
                            ctx.transform(
                                0,
                                -1,
                                -1,
                                0,
                                image.height,
                                image.width,
                            );
                            break;
                        case 8:
                            ctx.transform(0, -1, 1, 0, 0, image.width);
                            break;
                        default:
                            ctx.transform(1, 0, 0, 1, 0, 0);
                    }

                    ctx.drawImage(image, 0, 0);

                    canvas.toBlob((blob) => {
                        if (blob) {
                            const correctedFile = new File([blob], file.name, {
                                type: file.type,
                                lastModified: Date.now(),
                            });

                            const url = URL.createObjectURL(blob);
                            resolve({ file: correctedFile, url });
                        } else {
                            reject(
                                new Error(
                                    'Falha ao corrigir orientação da imagem',
                                ),
                            );
                        }
                    }, file.type);
                });
            };

            image.onerror = () => {
                reject(new Error('Erro ao carregar imagem'));
            };

            image.src = e.target?.result as string;
        };

        reader.onerror = () => {
            reject(new Error('Erro ao ler arquivo'));
        };

        reader.readAsDataURL(file);
    });
};
