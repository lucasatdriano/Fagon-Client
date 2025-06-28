'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckIcon, ImageIcon } from 'lucide-react';
import { Photo } from '@/interfaces/photo';
import { DeletePhotoModal } from '../modals/photoModals/DeletePhotoModal';
import { PhotoViewModal } from '../modals/photoModals/PhotoViewModal';

interface PhotoCardProps {
    photo: Photo;
    onSelect: (id: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    index: number;
    disabled?: boolean;
    isVisitor?: boolean;
}

export function PhotoCard({
    photo,
    onSelect,
    onDelete,
    index,
    disabled,
    isVisitor = false,
}: PhotoCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSelected, setIsSelected] = useState(photo.selectedForPdf || false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const longPressTimer = useRef<NodeJS.Timeout | null>(null);
    const clickCount = useRef(0);
    const clickTimeout = useRef<NodeJS.Timeout | null>(null);

    const handlePressStart = () => {
        if (disabled || isLoading) return;

        longPressTimer.current = setTimeout(() => {
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
        if (isVisitor) return;

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
                    isSelected || !isVisitor ? 'ring-2 ring-primary' : ''
                }
                    ${!isSelected ? 'ring-0' : ''} ${
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
                    {photo.filePath
                        ? photo.filePath.split('/').pop()?.substring(0, 20) +
                          (photo.filePath.length > 20 ? '...' : '')
                        : `imagem${index + 1}.${photo.file?.type}`}
                </div>

                {isSelected && (
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
            />
        </>
    );
}
