'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Loader2Icon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { PhotoService } from '../../../services/domains/photoService';
import { PathologyPhotosService } from '../../../services/domains/pathologyPhotoService';

interface PhotoViewModalProps {
    photoId?: string;
    file?: File;
    isOpen: boolean;
    onClose: () => void;
    isPathologyPhoto?: boolean;
}

export function PhotoViewModal({
    photoId,
    file,
    isOpen,
    onClose,
    isPathologyPhoto = false,
}: PhotoViewModalProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const imageUrlRef = useRef<string | null>(null);

    useEffect(() => {
        if (!isOpen) return;

        const loadPhoto = async () => {
            setIsLoading(true);
            try {
                if (file instanceof File) {
                    const url = URL.createObjectURL(file);
                    setImageUrl(url);
                    imageUrlRef.current = url;
                    return;
                }

                const timestamp = Date.now();
                let signedUrl: string;

                if (isPathologyPhoto) {
                    signedUrl = await PathologyPhotosService.getSignedUrl(
                        photoId || '',
                    );
                } else {
                    signedUrl = await PhotoService.getSignedUrl(photoId || '');
                }

                const urlWithTimestamp = signedUrl.includes('?')
                    ? `${signedUrl}&t=${timestamp}`
                    : `${signedUrl}?t=${timestamp}`;

                setImageUrl(urlWithTimestamp);
            } catch (error) {
                console.error('Failed to load photo:', error);
                setImageUrl(null);
            } finally {
                setIsLoading(false);
            }
        };

        loadPhoto();

        return () => {
            if (file instanceof File && imageUrlRef.current) {
                URL.revokeObjectURL(imageUrlRef.current);
            }
        };
    }, [isOpen, photoId, file, isPathologyPhoto]);

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/90" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-svh items-center justify-center py-8 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative w-full h-full max-w-4xl transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
                                {isLoading && (
                                    <div className="flex justify-center items-center min-h-svh">
                                        <Loader2Icon className="animate-spin h-12 w-12 text-primary" />
                                    </div>
                                )}
                                <button
                                    title="Fechar modal"
                                    onClick={onClose}
                                    className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
                                >
                                    <XIcon className="h-6 w-6" />
                                </button>

                                <div className="relative aspect-[4/4] w-full h-full">
                                    {imageUrl ? (
                                        <Image
                                            src={imageUrl}
                                            alt="Visualização da foto"
                                            fill
                                            className="object-contain"
                                            unoptimized={true}
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement;
                                                target.onerror = null;
                                                setImageUrl(null);
                                            }}
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-white">
                                            {isLoading
                                                ? 'Carregando imagem...'
                                                : 'Imagem não encontrada'}
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
