'use client';

import { Dialog, Transition } from '@headlessui/react';
import {
    Fragment,
    useEffect,
    useRef,
    useState,
    useCallback,
    useMemo,
} from 'react'; // Adicione useMemo
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    Loader2Icon,
    XIcon,
} from 'lucide-react';
import { PhotoService } from '../../../services/domains/photoService';
import { PathologyPhotosService } from '../../../services/domains/pathologyPhotoService';
import { ImageRotator } from '@/components/layout/ImageRotator';

interface PhotoViewModalProps {
    photoId?: string;
    file?: File;
    isOpen: boolean;
    onClose: () => void;
    isPathologyPhoto?: boolean;
    onSaveRotatedPhoto?: (photoId: string, rotation: number) => Promise<void>;
    allPhotos?: Array<{
        id: string;
        filePath?: string;
        file?: File;
        name?: string;
    }>;
    currentPhotoIndex?: number;
}

export function PhotoViewModal({
    photoId,
    file,
    isOpen,
    onClose,
    isPathologyPhoto = false,
    onSaveRotatedPhoto,
    allPhotos = [],
    currentPhotoIndex = 0,
}: PhotoViewModalProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(currentPhotoIndex);
    const imageUrlRef = useRef<string | null>(null);

    // Atualizar índice quando o currentPhotoIndex mudar
    useEffect(() => {
        setCurrentIndex(currentPhotoIndex);
    }, [currentPhotoIndex]);

    // CORREÇÃO: Usar useMemo para currentPhoto
    const currentPhoto = useMemo(() => {
        return allPhotos[currentIndex] || { id: photoId, file };
    }, [allPhotos, currentIndex, photoId, file]); // Adicionar todas as dependências

    // CORREÇÃO: Mover loadPhoto para useCallback
    const loadPhoto = useCallback(
        async (photo: { id?: string; file?: File }) => {
            setIsLoading(true);
            try {
                // Limpar URL anterior se existir
                if (imageUrlRef.current && photo.file) {
                    URL.revokeObjectURL(imageUrlRef.current);
                }

                if (photo.file instanceof File) {
                    const url = URL.createObjectURL(photo.file);
                    setImageUrl(url);
                    imageUrlRef.current = url;
                    return;
                }

                const timestamp = Date.now();
                let signedUrl: string;

                if (isPathologyPhoto) {
                    signedUrl = await PathologyPhotosService.getSignedUrl(
                        photo.id || '',
                    );
                } else {
                    signedUrl = await PhotoService.getSignedUrl(photo.id || '');
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
        },
        [isPathologyPhoto],
    ); // Adicionar dependências

    useEffect(() => {
        if (!isOpen) return;

        loadPhoto(currentPhoto);
    }, [isOpen, currentPhoto, loadPhoto]); // CORREÇÃO: Agora currentPhoto é memoizado

    // CORREÇÃO: Mover goToPrevious e goToNext para useCallback
    const goToPrevious = useCallback(() => {
        if (allPhotos.length <= 1) return;
        const newIndex =
            currentIndex === 0 ? allPhotos.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    }, [allPhotos.length, currentIndex]);

    const goToNext = useCallback(() => {
        if (allPhotos.length <= 1) return;
        const newIndex =
            currentIndex === allPhotos.length - 1 ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    }, [allPhotos.length, currentIndex]);

    // Adicionar navegação por teclado
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!isOpen) return;

            switch (event.key) {
                case 'ArrowLeft':
                    goToPrevious();
                    break;
                case 'ArrowRight':
                    goToNext();
                    break;
                case 'Escape':
                    onClose();
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, goToPrevious, goToNext, onClose]); // CORREÇÃO: Adicionar todas as dependências

    const cleanup = useCallback(() => {
        if (imageUrlRef.current) {
            URL.revokeObjectURL(imageUrlRef.current);
            imageUrlRef.current = null;
        }
    }, []);

    useEffect(() => {
        return cleanup;
    }, [cleanup]);

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

                                {/* Botão Fechar */}
                                <button
                                    title="Fechar modal"
                                    onClick={onClose}
                                    className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white hover:bg-black/75 transition-colors"
                                >
                                    <XIcon className="h-6 w-6" />
                                </button>

                                {/* Botão Anterior */}
                                {allPhotos.length > 1 && (
                                    <button
                                        title="Foto anterior"
                                        onClick={goToPrevious}
                                        className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/75 transition-colors"
                                    >
                                        <ChevronLeftIcon className="h-6 w-6" />
                                    </button>
                                )}

                                {/* Botão Próximo */}
                                {allPhotos.length > 1 && (
                                    <button
                                        title="Próxima foto"
                                        onClick={goToNext}
                                        className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white hover:bg-black/75 transition-colors"
                                    >
                                        <ChevronRightIcon className="h-6 w-6" />
                                    </button>
                                )}

                                {allPhotos.length > 1 && (
                                    <div className="absolute top-4 left-4 z-20 rounded-full bg-black/50 px-3 py-1 text-white text-sm">
                                        {currentIndex + 1} / {allPhotos.length}
                                    </div>
                                )}

                                <div className="relative w-full h-full flex items-center justify-center">
                                    {imageUrl ? (
                                        <ImageRotator
                                            src={imageUrl}
                                            alt={`Foto ${currentIndex + 1}`}
                                            className="w-auto h-auto max-w-full max-h-[80vh] object-contain"
                                            photoId={currentPhoto.id}
                                            onSaveRotation={onSaveRotatedPhoto}
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
