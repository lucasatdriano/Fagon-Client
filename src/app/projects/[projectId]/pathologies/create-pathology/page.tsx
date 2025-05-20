'use client';

import { useState } from 'react';
import {
    CameraIcon,
    MapPinnedIcon,
    SaveIcon,
    TextIcon,
    TypeIcon,
} from 'lucide-react';
import { CustomButton } from '@/components/forms/CustomButton';
import { CustomFormInput } from '@/components/forms/CustomFormInput';
import { PhotoCard } from '@/components/cards/PhotoCard';
import { PathologyCard } from '@/components/cards/PathologyCard';
import { Photo } from '@/interfaces/photo';
import { CustomDropdownInput } from '@/components/forms/CustomDropdownInput';
import { ceilingOptions } from '@/constants';

export default function CreatePathology() {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    // const [selectedHeight, setSelectedHeight] = useState('');
    // const [selectedFlooring, setSelectedFlooring] = useState<string[]>([]);
    // const [selectedPart, setSelectedPart] = useState<string[]>([]);
    // const [selectedShape, setSelectedShape] = useState<string[]>([]);
    const [photos, setPhotos] = useState<Photo[]>([]);

    const handleAddPhoto = () => {
        const newPhoto: Photo = {
            id: (photos.length + 1).toString(),
            filePath: `/images/sample-photo-${photos.length + 1}.jpg`,
            selectedForPdf: false,
        };
        setPhotos([...photos, newPhoto]);
    };

    const handleSelect = async (photoId: string) => {
        setPhotos(
            photos.map((photo) =>
                photo.id === photoId
                    ? { ...photo, selectedForPdf: !photo.selectedForPdf }
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
                    Patologia
                </h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>
            <div className="mb-4">
                <div className="pl-4">
                    <div className="w-full relative flex justify-start py-3">
                        <h3 className="text-2xl font-sans bg-background px-2 ml-8">
                            Fotos
                        </h3>
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
                                onView={() => handleView(photo.filePath)}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <div className="mb-4">
                <div className="w-full relative flex justify-start py-3">
                    <h3 className="text-2xl font-sans bg-background px-2 ml-8">
                        Local
                    </h3>
                    <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                </div>
                <CustomDropdownInput
                    options={ceilingOptions}
                    selectedOptionValue={selectedOption}
                    onOptionSelected={setSelectedOption}
                    icon={<MapPinnedIcon />}
                    placeholder="Selecione o Local da Patologia*"
                />
            </div>

            <div className="mb-4">
                <div className="w-full relative flex justify-start py-3">
                    <h3 className="text-2xl font-sans bg-background px-2 ml-8">
                        Título
                    </h3>
                    <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                </div>
                <CustomFormInput icon={<TypeIcon />} label="Título*" />
            </div>

            <div className="mb-4">
                <div className="w-full relative flex justify-start py-3">
                    <h3 className="text-2xl font-sans bg-background px-2 ml-8">
                        Descrição
                    </h3>
                    <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                </div>
                <CustomFormInput icon={<TextIcon />} label="Descrição" />
            </div>

            <div className="mb-8">
                <div className="flex justify-center mt-8">
                    <CustomButton icon={<SaveIcon />}>
                        Salvar Patologia
                    </CustomButton>
                </div>
            </div>

            <div className="mb-4">
                <div className="w-full relative flex justify-center py-3">
                    <h2 className="text-3xl font-sans bg-background px-2">
                        Lista de Patologias
                    </h2>
                    <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <PathologyCard
                    id="12"
                    title="Rachadura transversal na parede no lado direito superior do tamanho de 3 polegadas de diametro e 5 de comprimento no banheiro masculino"
                    location="Banheiro Masculino"
                />
                <PathologyCard
                    id="12"
                    title="Furo no piso"
                    location="Atendimento"
                />
                <PathologyCard
                    id="12"
                    title="Furo no piso"
                    location="Atendimento"
                />
                <PathologyCard
                    id="12"
                    title="Furo no piso"
                    location="Atendimento"
                />
            </div>
        </div>
    );
}
