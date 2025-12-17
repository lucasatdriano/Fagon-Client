export interface CompressionOptions {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSizeMB?: number;
}

export const DEFAULT_COMPRESSION_OPTIONS: Required<CompressionOptions> = {
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.8,
    maxSizeMB: 5,
};

export async function compressImage(
    file: File,
    options: CompressionOptions = {},
): Promise<File> {
    const maxWidth = options.maxWidth ?? DEFAULT_COMPRESSION_OPTIONS.maxWidth;
    const maxHeight =
        options.maxHeight ?? DEFAULT_COMPRESSION_OPTIONS.maxHeight;
    const quality = options.quality ?? DEFAULT_COMPRESSION_OPTIONS.quality;
    const maxSizeMB =
        options.maxSizeMB ?? DEFAULT_COMPRESSION_OPTIONS.maxSizeMB;

    if (file.size <= maxSizeMB * 1024 * 1024) {
        console.log(
            `Arquivo já pequeno: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
        );
        return file;
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(
                        maxWidth / width,
                        maxHeight / height,
                    );
                    width *= ratio;
                    height *= ratio;
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context não disponível'));
                    return;
                }

                ctx.drawImage(img, 0, 0, width, height);

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Falha na compressão da imagem'));
                            return;
                        }

                        const compressedFile = new File(
                            [blob],
                            file.name.replace(/\.[^/.]+$/, '') + '.jpg',
                            {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            },
                        );

                        console.log(`✅ Compressão concluída:
              Original: ${(file.size / 1024 / 1024).toFixed(2)}MB
              Comprimido: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB
              Redução: ${((1 - compressedFile.size / file.size) * 100).toFixed(
                  1,
              )}%
            `);

                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    quality,
                );
            };

            img.onerror = () => {
                reject(new Error('Erro ao carregar imagem'));
            };
        };

        reader.onerror = () => {
            reject(new Error('Erro ao ler arquivo'));
        };

        reader.readAsDataURL(file);
    });
}

export async function compressImages(
    files: File[],
    options?: CompressionOptions,
): Promise<File[]> {
    console.log(`📦 Iniciando compressão de ${files.length} arquivos...`);

    const results = await Promise.allSettled(
        files.map((file) => compressImage(file, options)),
    );

    const compressedFiles: File[] = [];
    const errors: string[] = [];

    results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
            compressedFiles.push(result.value);
        } else {
            errors.push(
                `Arquivo ${files[index].name}: ${result.reason.message}`,
            );
            compressedFiles.push(files[index]);
        }
    });

    if (errors.length > 0) {
        console.warn('⚠️ Algumas compressões falharam:', errors);
    }

    const originalTotal = files.reduce((sum, f) => sum + f.size, 0);
    const compressedTotal = compressedFiles.reduce((sum, f) => sum + f.size, 0);

    console.log(`📊 Resumo compressão:
    Total original: ${(originalTotal / 1024 / 1024).toFixed(2)}MB
    Total comprimido: ${(compressedTotal / 1024 / 1024).toFixed(2)}MB
    Redução total: ${((1 - compressedTotal / originalTotal) * 100).toFixed(1)}%
  `);

    return compressedFiles;
}

export function needsCompression(
    file: File,
    maxSizeMB: number = DEFAULT_COMPRESSION_OPTIONS.maxSizeMB,
): boolean {
    return file.size > maxSizeMB * 1024 * 1024;
}

export function getFileInfo(file: File): string {
    return `${file.name} - ${(file.size / 1024 / 1024).toFixed(2)}MB - ${
        file.type
    }`;
}

export function isImageCompressionSupported(): boolean {
    return (
        typeof document !== 'undefined' &&
        typeof HTMLCanvasElement !== 'undefined' &&
        typeof FileReader !== 'undefined'
    );
}

export function getMobileCompressionOptions(): CompressionOptions {
    return {
        maxWidth: 1280,
        maxHeight: 720,
        quality: 0.7,
        maxSizeMB: 2,
    };
}
