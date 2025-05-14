'use client';

import { useState } from 'react';
import { CameraIcon, Layers2Icon, RulerIcon, SaveIcon } from 'lucide-react';
import { CustomButton } from '@/components/forms/CustomButton';
import { CustomFormInput } from '@/components/forms/CustomFormInput';
import { CustomCheckboxGroup } from '@/components/forms/CustomCheckbox';
import { ceilingOptions, floorOptions, wallOptions } from '@/constants';
import { PhotoCard } from '@/components/cards/PhotoCard';

interface Photo {
    id: string;
    file_path: string;
    name: string;
    date: string;
    selected_for_pdf: boolean;
    size: string;
}

export default function CreateLocation() {
    // const [selectedFloor, setSelectedFloor] = useState('');
    // const [selectedHeight, setSelectedHeight] = useState('');
    // const [selectedFlooring, setSelectedFlooring] = useState<string[]>([]);
    // const [selectedPart, setSelectedPart] = useState<string[]>([]);
    // const [selectedShape, setSelectedShape] = useState<string[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([
        {
            id: '1',
            file_path: '/images/sample-photo-1.jpg',
            name: 'Fachada Principal',
            date: '2023-05-15',
            selected_for_pdf: true,
            size: '2.4 MB',
        },
        {
            id: '2',
            file_path: '/images/sample-photo-2.jpg',
            name: 'Detalhe da Entrada',
            date: '2023-05-15',
            selected_for_pdf: false,
            size: '1.8 MB',
        },
        {
            id: '3',
            file_path: '/images/sample-photo-3.jpg',
            name: 'Vista Lateral',
            date: '2023-05-16',
            selected_for_pdf: true,
            size: '3.2 MB',
        },
        {
            id: '4',
            file_path: '/images/sample-photo-4.jpg',
            name: 'Detalhe de Acabamento',
            date: '2023-05-17',
            selected_for_pdf: false,
            size: '2.1 MB',
        },
    ]);

    const handleAddPhoto = () => {
        const newPhoto: Photo = {
            id: (photos.length + 1).toString(),
            file_path: `/images/sample-photo-${photos.length + 1}.jpg`,
            name: `Nova Foto ${photos.length + 1}`,
            date: new Date().toISOString().split('T')[0],
            selected_for_pdf: false,
            size: `${(Math.random() * 2 + 1).toFixed(1)} MB`,
        };
        setPhotos([...photos, newPhoto]);
    };

    const handleSelect = async (photoId: string) => {
        setPhotos(
            photos.map((photo) =>
                photo.id === photoId
                    ? { ...photo, selected_for_pdf: !photo.selected_for_pdf }
                    : photo,
            ),
        );

        await fetch('/api/photos/select', {
            method: 'POST',
            body: JSON.stringify({ photoId }),
        });
    };

    const handleView = (filePath: string) => {
        window.open(filePath, '_blank');
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="w-full relative flex justify-center py-3 mt-16">
                <h1 className="text-3xl font-sans bg-background px-2">
                    Fachada
                </h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>
            <div className="mb-4">
                <div className="pl-4">
                    <div className="w-full relative flex justify-start py-3">
                        <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                            Fotos
                        </h2>
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                    </div>
                    <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        <button
                            onClick={handleAddPhoto}
                            className="bg-white md:text-lg flex items-center justify-center gap-2 rounded-md shadow-sm text-primary py-4 px-6 hover:bg-white/60 hover:shadow-md"
                        >
                            <CameraIcon className="w-6 h-6" />
                            <span>Adicionar Foto</span>
                        </button>

                        {photos.map((photo, index) => (
                            <PhotoCard
                                key={index}
                                photo={photo}
                                onSelect={() => handleSelect(photo.id)}
                                onView={() => handleView(photo.file_path)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="w-full relative flex justify-start py-3">
                    <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                        Pavimento/Andar
                    </h2>
                    <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                </div>
                <CustomFormInput icon={<Layers2Icon />} label="Andar*" />
            </div>

            <div className="mb-4">
                <div className="w-full relative flex justify-start py-3">
                    <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                        Altura
                    </h2>
                    <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                </div>
                <CustomFormInput
                    icon={<RulerIcon />}
                    label="Altura (Pé direito)*"
                />
            </div>

            <div className="mb-8">
                <div className="w-full relative flex justify-start py-3">
                    <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                        Acabamentos
                    </h2>
                    <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                </div>
                <div className="w-full relative flex justify-start py-3">
                    <h3 className="text-xl font-sans bg-background px-2 ml-4">
                        Piso:
                    </h3>
                </div>
                <CustomCheckboxGroup options={floorOptions} gridCols={'full'} />
            </div>

            <div className="mb-8">
                <div className="w-full relative flex justify-start py-3">
                    <h3 className="text-xl font-sans bg-background px-2 ml-4">
                        Parede:
                    </h3>
                </div>
                <CustomCheckboxGroup options={wallOptions} gridCols={'full'} />
            </div>

            <div className="mb-8">
                <div className="w-full relative flex justify-start py-3">
                    <h3 className="text-xl font-sans bg-background px-2 ml-4">
                        Forro:
                    </h3>
                </div>
                <CustomCheckboxGroup
                    options={ceilingOptions}
                    gridCols={'full'}
                />
            </div>

            <div className="flex justify-center mt-8">
                <CustomButton icon={<SaveIcon />}>Salvar Local</CustomButton>
            </div>
        </div>
    );
}
