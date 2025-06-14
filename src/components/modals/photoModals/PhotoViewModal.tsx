'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { Loader2Icon, XIcon } from 'lucide-react';
import Image from 'next/image';
import { PhotoService } from '@/services/domains/photoService';

interface PhotoViewModalProps {
    photoId: string;
    file: File;
    isOpen: boolean;
    onClose: () => void;
}

export function PhotoViewModal({
    photoId,
    file,
    isOpen,
    onClose,
}: PhotoViewModalProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        // let objectUrl: string | null = null;

        // const loadPhoto = async () => {
        setIsLoading(true);

        //     try {
        //         if (file instanceof File) {
        //             objectUrl = URL.createObjectURL(file);
        //             setImageUrl(objectUrl);
        //             return;
        //         }

        //         const timestamp = Date.now();
        //         const signedUrl = await PhotoService.getSignedUrl(photoId);
        //         const urlWithTimestamp = signedUrl.includes('?')
        //             ? `${signedUrl}&t=${timestamp}`
        //             : `${signedUrl}?t=${timestamp}`;

        //         setImageUrl(urlWithTimestamp);
        //     } catch (error) {
        //         console.error('Failed to load photo:', error);
        //         setImageUrl(null);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // };

        // loadPhoto();
        if (file instanceof File) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);

            return () => {
                URL.revokeObjectURL(url);
            };
        }

        if (photoId) {
            const loadPhoto = async () => {
                setIsLoading(true);
                try {
                    const signedUrl = await PhotoService.getSignedUrl(photoId);
                    setImageUrl(signedUrl);
                } catch (error) {
                    console.error('Failed to load photo:', error);
                    setImageUrl(null);
                }
            };
            loadPhoto();
        }
    }, [isOpen, photoId, file]);

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
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl text-left align-middle shadow-xl transition-all">
                                {isLoading && (
                                    <div className="flex justify-center items-center h-screen">
                                        <Loader2Icon className="animate-spin color-primary" />
                                    </div>
                                )}
                                <button
                                    title="Fechar modal"
                                    onClick={onClose}
                                    className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/75"
                                >
                                    <XIcon className="h-6 w-6" />
                                </button>

                                <div className="relative aspect-[4/3] w-full">
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
                                                ? 'Loading...'
                                                : 'Could not load image'}
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
