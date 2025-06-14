'use client';

import { CameraIcon, ImageIcon } from 'lucide-react';
import { useRef, useState } from 'react';

interface AddPhotoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPhotosAdded: (files: File[]) => void;
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
    const [inputKey, setInputKey] = useState(Date.now());

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

    const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }

        const files = Array.from(e.target.files);

        const renamedFiles = files.map((file, index) => {
            const extension = file.name.split('.').pop();
            const newFileName = `imagem${Date.now()}-${index}.${extension}`;
            return new File([file], newFileName, { type: file.type });
        });

        onPhotosAdded(renamedFiles);
        onClose();

        setInputKey(Date.now());
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
                            disabled={isLoading}
                            className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                            <CameraIcon className="w-5 h-5 mr-2" />
                            <span>Tirar foto</span>
                        </button>
                        <button
                            onClick={openGallery}
                            disabled={isLoading}
                            className="flex items-center justify-center w-full py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
                        >
                            <ImageIcon className="w-5 h-5 mr-2" />
                            <span>Escolher da galeria</span>
                        </button>
                    </div>
                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={onClose}
                            className="w-full px-4 rounded-lg font-medium text-center"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>

            {/* Inputs escondidos com key para forçar recriação */}
            <input
                key={`file-${inputKey}`}
                title="Adicionar foto"
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleAddPhoto}
                disabled={isLoading}
            />
            <input
                key={`camera-${inputKey}`}
                title="Tirar foto"
                ref={cameraInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                capture="environment"
                onChange={handleAddPhoto}
                disabled={isLoading}
            />
        </>
    );
}
