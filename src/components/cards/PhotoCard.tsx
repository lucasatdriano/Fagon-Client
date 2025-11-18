'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckIcon, ImageIcon } from 'lucide-react';
import { Photo } from '../../interfaces/photo';
import { DeletePhotoModal } from '../modals/photoModals/DeletePhotoModal';
import { PhotoViewModal } from '../modals/photoModals/PhotoViewModal';
import { PathologyPhoto } from '../../interfaces/pathologyPhoto';
import { toast } from 'sonner';

interface PhotoCardProps {
    photo: Photo | PathologyPhoto;
    onSelect?: (id: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    index: number;
    isPathologyPhoto?: boolean;
    disabled?: boolean;
    isVisitor?: boolean;
    onSaveRotatedPhoto?: (photoId: string, rotation: number) => Promise<void>;
    allPhotos?: Array<{
        id: string;
        filePath?: string;
        file?: File;
        name?: string;
    }>;
}

export function PhotoCard({
    photo,
    onSelect,
    onDelete,
    index,
    disabled,
    isVisitor = false,
    isPathologyPhoto = false,
    onSaveRotatedPhoto,
    allPhotos,
}: PhotoCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSelected, setIsSelected] = useState(
        'selectedForPdf' in photo ? photo.selectedForPdf : false,
    );
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const clickCount = useRef(0);
    const clickTimeout = useRef<NodeJS.Timeout | null>(null);

    const handlePressStart = () => {
        if (disabled || isLoading) return;

        longPressTimer.current = setTimeout(() => {
            if (isVisitor) {
                toast.error('Vistoriadores não podem deletar fotos');
                return;
            }

            setShowDeleteModal(true);
        }, 1000);
    };

    const handlePressEnd = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
        }
    };

    const handleClick = () => {
        if (disabled || isLoading) return;

        clickCount.current += 1;

        if (clickCount.current === 1) {
            clickTimeout.current = setTimeout(() => {
                setShowViewModal(true);
                clickCount.current = 0;
            }, 200);
        } else if (clickCount.current === 2) {
            if (clickTimeout.current) {
                clearTimeout(clickTimeout.current);
            }
            handleToggleSelection();
            clickCount.current = 0;
        }
    };

    const handleToggleSelection = async () => {
        if (isVisitor || !onSelect) return;

        setIsLoading(true);
        try {
            await onSelect(photo.id || '');
            setIsSelected(!isSelected);
        } catch (error) {
            console.error('Error toggling selection:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeletePhoto = async () => {
        setIsLoading(true);
        try {
            await onDelete(photo.id || '');
            setShowDeleteModal(false);
        } catch (error) {
            console.error('Error deleting photo:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        return () => {
            if (longPressTimer.current) clearTimeout(longPressTimer.current);
            if (clickTimeout.current) clearTimeout(clickTimeout.current);
        };
    }, []);

    return (
        <>
            <div
                className={`px-4 bg-white relative cursor-pointer border rounded-lg overflow-hidden shadow-sm transition-all duration-200 hover:shadow-md ${
                    isSelected && !isVisitor ? 'border-primary' : ''
                }
                    ${!isSelected ? 'border-gray-200' : ''} ${
                    disabled ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleClick}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
            >
                <div className="flex items-center justify-center py-4 gap-2">
                    <ImageIcon className="h-6 w-6" />
                    <span
                        className="truncate max-w-[180px]"
                        title={photo.name || `Foto${index + 1}`}
                    >
                        {photo.name
                            ? `${photo.name}.png`
                            : `Foto${index + 1}.png`}
                    </span>
                </div>

                {isSelected && !isVisitor && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="bg-primary p-2 rounded-full">
                            <CheckIcon className="h-5 w-5 text-white" />
                        </div>
                    </div>
                )}

                {isLoading && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                )}
            </div>

            <DeletePhotoModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeletePhoto}
                isLoading={isLoading}
            />

            <PhotoViewModal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                photoId={photo.id || ''}
                file={photo.file || undefined}
                isPathologyPhoto={isPathologyPhoto}
                onSaveRotatedPhoto={onSaveRotatedPhoto}
                allPhotos={allPhotos}
                currentPhotoIndex={index}
            />
        </>
    );
}
