'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useRef, useState } from 'react';
import { CameraIcon, ImageIcon, Loader2Icon } from 'lucide-react';
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
        cameraInputRef.current?.click();
    };

    const openGallery = () => {
        fileInputRef.current?.click();
    };

    const handleAddPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) {
            toast.error('Nenhum arquivo selecionado');
            return;
        }

        try {
            setUploading(true);

            const files = Array.from(e.target.files);

            const validFiles = files.map((file) => {
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

            onPhotosAdded(validFiles);

            toast.success(
                'Fotos adicionadas com sucesso! O upload começará em background.',
            );

            if (fileInputRef.current) fileInputRef.current.value = '';
            if (cameraInputRef.current) cameraInputRef.current.value = '';
        } catch (error) {
            console.error('Erro detalhado:', error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : 'Erro ao processar fotos',
            );

            if (fileInputRef.current) fileInputRef.current.value = '';
            if (cameraInputRef.current) cameraInputRef.current.value = '';
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        if (uploading) {
            toast.info('Aguarde o processamento das fotos terminar');
            return;
        }
        onClose();
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4"
                            enterTo="opacity-100 translate-y-0"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0"
                            leaveTo="opacity-0 translate-y-4"
                        >
                            <Dialog.Panel className="w-full transform rounded-t-lg bg-white p-4 text-left align-middle shadow-xl transition-all">
                                <div className="space-y-2">
                                    <button
                                        onClick={openCamera}
                                        disabled={isLoading || uploading}
                                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? (
                                            <Loader2Icon className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <CameraIcon className="w-5 h-5" />
                                        )}
                                        <span>
                                            {uploading
                                                ? 'Processando...'
                                                : 'Tirar foto'}
                                        </span>
                                    </button>

                                    <button
                                        onClick={openGallery}
                                        disabled={isLoading || uploading}
                                        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? (
                                            <Loader2Icon className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <ImageIcon className="w-5 h-5" />
                                        )}
                                        <span>
                                            {uploading
                                                ? 'Processando...'
                                                : 'Escolher da galeria'}
                                        </span>
                                    </button>
                                </div>

                                {uploading && (
                                    <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-blue-700 text-center">
                                            Fotos sendo processadas... Você pode
                                            continuar usando o app.
                                        </p>
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={handleClose}
                                        disabled={uploading}
                                        className="w-full py-2 rounded-lg font-medium text-center text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                                    >
                                        {uploading
                                            ? 'Processando...'
                                            : 'Fechar'}
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>

                <input
                    key={`file-${uploading}`}
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
                    key={`camera-${uploading}`}
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    title="Tirar foto com a câmera"
                    className="hidden"
                    onChange={handleAddPhoto}
                    disabled={isLoading || uploading}
                />
            </Dialog>
        </Transition>
    );
}
