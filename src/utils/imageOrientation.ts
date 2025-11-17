/* eslint-disable @typescript-eslint/no-explicit-any */
import EXIF from 'exif-js';

export interface FixedImage {
    file: File;
    url: string;
}

export const fixImageOrientation = (file: File): Promise<FixedImage> => {
    return new Promise((resolve, reject) => {
        if (!file.type.startsWith('image/jpeg')) {
            const url = URL.createObjectURL(file);
            resolve({ file, url });
            return;
        }

        const reader = new FileReader();

        reader.onload = (e) => {
            const image = new Image();
            image.onload = () => {
                try {
                    EXIF.getData(image as any, () => {
                        const orientation =
                            EXIF.getTag(image, 'Orientation') || 1;

                        if (orientation === 1) {
                            const url = URL.createObjectURL(file);
                            resolve({ file, url });
                            return;
                        }

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

                        canvas.toBlob(
                            (blob) => {
                                if (blob) {
                                    const correctedFile = new File(
                                        [blob],
                                        file.name,
                                        {
                                            type: 'image/jpeg',
                                            lastModified: Date.now(),
                                        },
                                    );

                                    const url = URL.createObjectURL(blob);
                                    resolve({ file: correctedFile, url });
                                } else {
                                    reject(
                                        new Error(
                                            'Falha ao corrigir orientação da imagem',
                                        ),
                                    );
                                }
                            },
                            'image/jpeg',
                            0.9,
                        );
                    });
                } catch (error) {
                    console.warn(
                        'Erro ao processar EXIF, retornando imagem original:',
                        error,
                    );
                    const url = URL.createObjectURL(file);
                    resolve({ file, url });
                }
            };

            image.onerror = () => {
                console.warn('Erro ao carregar imagem, retornando original');
                const url = URL.createObjectURL(file);
                resolve({ file, url });
            };

            image.src = e.target?.result as string;
        };

        reader.onerror = () => {
            console.warn('Erro ao ler arquivo, retornando original');
            const url = URL.createObjectURL(file);
            resolve({ file, url });
        };

        reader.readAsDataURL(file);
    });
};
