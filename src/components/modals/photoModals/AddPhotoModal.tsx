'use client';

import { CameraIcon, ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

interface AddPhotoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPhotosAdded: (photos: File[]) => void;
    isLoading: boolean;
}

export function AddPhotoModal({
    isOpen,
    onClose,
    onPhotosAdded,
    isLoading,
}: AddPhotoModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const openCamera = () => {
        if (cameraInputRef.current) {
            cameraInputRef.current.click();
        }
    };

    const openGallery = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            toast.error('Nenhum arquivo selecionado');
            return;
        }

        try {
            setUploading(true);
            const files = Array.from(e.target.files);

            const validFiles = files.map((file: File | unknown) => {
                if (!(file instanceof File)) {
                    const fileLike = file as { name?: string; type?: string };
                    return new File(
                        [file as BlobPart],
                        fileLike.name || `photo-${Date.now()}.jpg`,
                        {
                            type: fileLike.type || 'image/jpeg',
                        },
                    );
                }
                return file;
            });

            validFiles.forEach((file) => {
                if (!(file instanceof File)) {
                    throw new Error(`Tipo de arquivo inválido: ${file}`);
                }
            });

            validFiles.map((file) => ({
                file,
                previewUrl: URL.createObjectURL(file),
            }));

            onPhotosAdded(validFiles);

            toast.success('Fotos adicionadas com sucesso!');
        } catch (error) {
            console.error('Erro detalhado:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Erro ao processar fotos',
            );
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
            if (cameraInputRef.current) cameraInputRef.current.value = '';
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-end justify-center">
                <div
                    className="absolute inset-0 bg-black bg-opacity-50"
                    onClick={onClose}
                />

                <div className="relative bg-white w-full rounded-t-lg shadow-xl z-[60]">
                    <div className="p-4 space-y-2">
                        <button
                            onClick={openCamera}
                            disabled={isLoading || uploading}
                            className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                            <CameraIcon className="w-5 h-5 mr-2" />
                            <span>
                                {uploading ? 'Enviando...' : 'Tirar foto'}
                            </span>
                        </button>
                        <button
                            onClick={openGallery}
                            disabled={isLoading || uploading}
                            className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                            <ImageIcon className="w-5 h-5 mr-2" />
                            <span>
                                {uploading
                                    ? 'Enviando...'
                                    : 'Escolher da galeria'}
                            </span>
                        </button>
                    </div>
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            disabled={uploading}
                            className="w-full px-4 rounded-lg font-medium text-center"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>

            <input
                key={`file`}
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                title="Adicionar fotos da galeria"
                className="hidden"
                onChange={handleAddPhoto}
                disabled={isLoading || uploading}
            />

            <input
                key={`camera`}
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                title="Tirar foto com a câmera"
                className="hidden"
                onChange={handleAddPhoto}
                disabled={isLoading || uploading}
            />
        </>
    );
}
