'use client';

import { useEffect, useState } from 'react';
import {
    CameraIcon,
    MapPinnedIcon,
    SaveIcon,
    TextIcon,
    TypeIcon,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/forms/CustomButton';
import { CustomFormInput } from '@/components/forms/CustomFormInput';
import { PhotoCard } from '@/components/cards/PhotoCard';
import { PathologyCard } from '@/components/cards/PathologyCard';
import { CustomDropdownInput } from '@/components/forms/CustomDropdownInput';
import { ceilingOptions } from '@/constants';
import { PathologyService } from '@/services/domains/pathologyService';
import { CreatePathologyData } from '@/validations/pathologySchemas';
import { PathologyPhotosService } from '@/services/domains/pathologyPhotoService';

interface FormData {
    referenceLocation: string;
    title: string;
    description: string;
    photos: File[];
}

export default function CreatePathology() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [photos, setPhotos] = useState<File[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(
        null,
    );
    const [pathologies, setPathologies] = useState<any[]>([]); // Substitua por tipo adequado

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(/* seu schema de validação */),
    });

    useEffect(() => {
        const loadPathologies = async () => {
            try {
                const response = await PathologyService.listAll();
                setPathologies(response.data);
            } catch (error) {
                toast.error('Erro ao carregar patologias');
                console.error(error);
            }
        };

        loadPathologies();
    }, []);

    const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newPhotos = Array.from(e.target.files);
            setPhotos([...photos, ...newPhotos]);
        }
    };

    const handleRemovePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
    };

    const onSubmit = async (data: FormData) => {
        if (!selectedLocation) {
            toast.error('Selecione um local para a patologia');
            return;
        }

        setIsLoading(true);

        try {
            const pathologyData: CreatePathologyData = {
                projectId: 'ID_DO_PROJETO',
                locationId: 'ID_DA_LOCALIZACAO',
                referenceLocation: selectedLocation,
                title: data.title,
                description: data.description,
                recordDate: new Date().toISOString(),
            };

            const pathologyResponse = await PathologyService.create(
                pathologyData,
            );
            const pathologyId = pathologyResponse.data.id;

            // 2. Fazer upload das fotos
            if (photos.length > 0) {
                await PathologyPhotosService.upload(pathologyId, photos);
            }

            toast.success('Patologia criada com sucesso!');
            router.push('/pathologies'); // Ou atualize a lista local
        } catch (error) {
            toast.error('Erro ao criar patologia');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="w-full relative flex justify-center py-3 mt-16">
                <h1 className="text-3xl font-sans bg-background px-2">
                    Patologia
                </h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                    <div className="pl-4">
                        <div className="w-full relative flex justify-start py-3">
                            <h3 className="text-2xl font-sans bg-background px-2 ml-8">
                                Fotos
                            </h3>
                            <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                        </div>
                        <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            <label className="bg-white md:text-lg flex items-center justify-center gap-2 rounded-md shadow-sm text-primary py-4 px-6 hover:bg-white/60 hover:shadow-md cursor-pointer">
                                <CameraIcon className="w-6 h-6" />
                                <span>Adicionar Foto</span>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    multiple
                                    onChange={handleAddPhoto}
                                />
                            </label>

                            {photos.map((photo, index) => (
                                <PhotoCard
                                    key={index}
                                    photo={{
                                        id: index.toString(),
                                        filePath: URL.createObjectURL(photo),
                                        selectedForPdf: false,
                                    }}
                                    onRemove={() => handleRemovePhoto(index)}
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
                        selectedOptionValue={selectedLocation}
                        onOptionSelected={setSelectedLocation}
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
                    <CustomFormInput
                        icon={<TypeIcon />}
                        label="Título*"
                        {...register('title')}
                        error={errors.title?.message}
                    />
                </div>

                <div className="mb-4">
                    <div className="w-full relative flex justify-start py-3">
                        <h3 className="text-2xl font-sans bg-background px-2 ml-8">
                            Descrição
                        </h3>
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                    </div>
                    <CustomFormInput
                        icon={<TextIcon />}
                        label="Descrição"
                        {...register('description')}
                        error={errors.description?.message}
                    />
                </div>

                <div className="mb-8">
                    <div className="flex justify-center mt-8">
                        <CustomButton
                            icon={<SaveIcon />}
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Salvando...' : 'Salvar Patologia'}
                        </CustomButton>
                    </div>
                </div>
            </form>

            <div className="mb-4">
                <div className="w-full relative flex justify-center py-3">
                    <h2 className="text-3xl font-sans bg-background px-2">
                        Lista de Patologias
                    </h2>
                    <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pathologies.map((pathology) => (
                    <PathologyCard
                        key={pathology.id}
                        id={pathology.id}
                        title={pathology.title}
                        location={pathology.referenceLocation}
                    />
                ))}
            </div>
        </div>
    );
}
