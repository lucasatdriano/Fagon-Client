'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    CameraIcon,
    Layers2Icon,
    MapPinIcon,
    RulerIcon,
    SaveIcon,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { CustomButton } from '@/components/forms/CustomButton';
import { CustomFormInput } from '@/components/forms/CustomFormInput';
import { CustomCheckboxGroup } from '@/components/forms/CustomCheckbox';
import { ceilingOptions, floorOptions, wallOptions } from '@/constants';
import { PhotoCard } from '@/components/cards/PhotoCard';
import { LocationService } from '@/services/domains/locationService';
import { locationFormSchema, LocationFormSchema } from '@/validations';
import { locationType as locationTypes, surfaceType } from '@/constants';

interface Photo {
    id: string;
    filePath: string;
    selectedForPdf: boolean;
    file?: File;
}

interface LocationData {
    id: string;
    name: string;
    locationType: string;
    height?: number;
    pavement?: {
        name: string;
    };
    photos: Photo[];
    materialFinishing: Array<{
        surface: string;
        materialFinishing: string;
    }>;
}

export default function CreateLocationPage() {
    const { projectId, locationId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [formKey, setFormKey] = useState(0);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<LocationFormSchema>({
        resolver: zodResolver(locationFormSchema),
    });

    const name = watch('name');
    const formLocationType = watch('locationType');
    const isFacade = name?.toLowerCase().includes('fachada');
    const isExternal =
        formLocationType ===
        locationTypes.find((lt) => lt.value === 'externo')?.value;

    const loadLocationData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await LocationService.getById(
                locationId as string,
            );
            const locationData = response.data;

            setLocation(locationData);
            setAllPhotos(locationData.photos || []);

            setValue('name', locationData.name);
            setValue('locationType', locationData.locationType);
            setValue('height', locationData.height?.toString() || '');
            setValue('floor', locationData.pavement?.name || '');

            const pisoValue = surfaceType.find(
                (st) => st.label === 'Piso',
            )?.value;
            const paredeValue = surfaceType.find(
                (st) => st.label === 'Parede',
            )?.value;
            const forroValue = surfaceType.find(
                (st) => st.label === 'Forro',
            )?.value;

            setValue(
                'floorFinishing',
                locationData.materialFinishing
                    ?.filter((f) => f.surface === pisoValue)
                    .map((f) => f.materialFinishing) || [],
            );

            setValue(
                'wallFinishing',
                locationData.materialFinishing
                    ?.filter((f) => f.surface === paredeValue)
                    .map((f) => f.materialFinishing) || [],
            );

            setValue(
                'ceilingFinishing',
                locationData.materialFinishing
                    ?.filter((f) => f.surface === forroValue)
                    .map((f) => f.materialFinishing) || [],
            );

            setFormKey((prev) => prev + 1);
        } catch (error) {
            toast.error('Erro ao carregar dados do local');
            console.error('Erro detalhado:', error);
        } finally {
            setIsLoading(false);
        }
    }, [locationId, setValue]);

    useEffect(() => {
        if (locationId) loadLocationData();
    }, [locationId, loadLocationData]);

    const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const newPhotos = Array.from(e.target.files).map((file) => ({
            id: `new-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            filePath: URL.createObjectURL(file),
            selectedForPdf: false,
            file,
        }));

        setAllPhotos((prev) => [...prev, ...newPhotos]);
    };

    const onSubmit = async (data: LocationFormSchema) => {
        try {
            setIsLoading(true);

            if (allPhotos.length < 5) {
                toast.error('É necessário enviar pelo menos 5 fotos');
                return;
            }

            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('locationType', data.locationType);
            if (data.height) formData.append('height', data.height);

            // Adiciona fotos
            allPhotos.forEach((photo) => {
                if (photo.file) formData.append('photos', photo.file);
            });

            // Adiciona acabamentos com locationId
            if (!isExternal && data.floorFinishing) {
                data.floorFinishing.forEach((finishing, index) => {
                    formData.append(
                        `materialFinishings[${index}][surface]`,
                        'piso',
                    );
                    formData.append(
                        `materialFinishings[${index}][materialFinishing]`,
                        finishing,
                    );
                    formData.append(
                        `materialFinishings[${index}][locationId]`,
                        locationId as string,
                    );
                });
            }

            if (data.wallFinishing) {
                const offset = data.floorFinishing?.length || 0;
                data.wallFinishing.forEach((finishing, index) => {
                    formData.append(
                        `materialFinishings[${offset + index}][surface]`,
                        'parede',
                    );
                    formData.append(
                        `materialFinishings[${
                            offset + index
                        }][materialFinishing]`,
                        finishing,
                    );
                    formData.append(
                        `materialFinishings[${offset + index}][locationId]`,
                        locationId as string,
                    );
                });
            }

            if (!isFacade && !isExternal && data.ceilingFinishing) {
                const offset =
                    (data.floorFinishing?.length || 0) +
                    (data.wallFinishing?.length || 0);
                data.ceilingFinishing.forEach((finishing, index) => {
                    formData.append(
                        `materialFinishings[${offset + index}][surface]`,
                        'forro',
                    );
                    formData.append(
                        `materialFinishings[${
                            offset + index
                        }][materialFinishing]`,
                        finishing,
                    );
                    formData.append(
                        `materialFinishings[${offset + index}][locationId]`,
                        locationId as string,
                    );
                });
            }

            const response = await LocationService.update(
                locationId as string,
                formData,
            );
            toast.success('Local atualizado com sucesso!');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Erro ao atualizar local');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="w-full relative flex justify-center py-3 mt-16">
                <h1 className="text-3xl font-sans bg-background px-2">Local</h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>

            <form
                key={formKey}
                onSubmit={handleSubmit(onSubmit, (errors) => {
                    console.log('Form validation errors:', errors);
                })}
                className="space-y-6"
            >
                {/* Seção de nome e tipo de local */}
                <div className="space-y-4">
                    <CustomFormInput
                        icon={<MapPinIcon />}
                        label="Nome do Local*"
                        registration={register('name')}
                        defaultValue={location?.name || ''}
                        error={errors.name?.message}
                        disabled={isLoading}
                    />

                    <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                {...register('locationType')}
                                value="interno"
                                defaultChecked={
                                    location?.locationType === 'interno'
                                }
                                className="h-4 w-4"
                                disabled={isLoading}
                            />
                            <span>Local Interno</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                {...register('locationType')}
                                value="externo"
                                defaultChecked={
                                    location?.locationType === 'externo'
                                }
                                className="h-4 w-4"
                                disabled={isLoading}
                            />
                            <span>Local Externo</span>
                        </label>
                    </div>
                    {errors.locationType && (
                        <p className="text-error text-sm">
                            {errors.locationType.message}
                        </p>
                    )}
                </div>

                {/* Seção de fotos */}
                <div>
                    <div className="w-full relative flex justify-start py-3">
                        <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                            Fotos ({allPhotos.length}/5 mínimo)
                        </h2>
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                    </div>

                    <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <label
                            className={`bg-white flex items-center justify-center gap-2 rounded-md shadow-sm text-primary py-4 px-6 hover:shadow-md cursor-pointer ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <CameraIcon className="w-6 h-6" />
                            <span>Adicionar Foto</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple
                                onChange={handleAddPhoto}
                                disabled={isLoading}
                            />
                        </label>

                        {allPhotos.map((photo) => (
                            <PhotoCard
                                key={photo.id}
                                photo={{
                                    id: photo.id,
                                    filePath: photo.filePath,
                                    selectedForPdf: photo.selectedForPdf,
                                }}
                                onSelect={() => {}}
                                onView={() =>
                                    window.open(photo.filePath, '_blank')
                                }
                                disabled={isLoading}
                            />
                        ))}
                    </div>
                    {allPhotos.length < 5 && (
                        <p className="text-error mt-2">
                            É necessário enviar pelo menos 5 fotos
                        </p>
                    )}
                </div>

                {/* Seção de pavimento (apenas para locais internos) */}
                {!isExternal && (
                    <div>
                        <div className="w-full relative flex justify-start py-3">
                            <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                                Pavimento/Andar
                            </h2>
                            <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                        </div>
                        <CustomFormInput
                            icon={<Layers2Icon />}
                            label="Pavimento/Andar*"
                            registration={register('floor')}
                            error={errors.floor?.message}
                            disabled={isLoading}
                        />
                    </div>
                )}

                {/* Seção de altura */}
                <div>
                    <div className="w-full relative flex justify-start py-3">
                        <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                            Altura
                        </h2>
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                    </div>
                    <CustomFormInput
                        icon={<RulerIcon />}
                        label="Altura (Pé direito)*"
                        registration={register('height')}
                        error={errors.height?.message}
                        disabled={isLoading}
                    />
                </div>

                {/* Seção de acabamentos */}
                <div className="space-y-6">
                    <div className="w-full relative flex justify-start">
                        <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                            Acabamentos
                        </h2>
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                    </div>

                    {!isExternal && (
                        <div>
                            <h3 className="text-xl font-sans mb-2">Piso:</h3>
                            <CustomCheckboxGroup
                                name="floorFinishing"
                                options={floorOptions}
                                registration={register('floorFinishing')}
                                error={errors.floorFinishing?.message}
                                gridCols={'full'}
                            />
                        </div>
                    )}

                    <div>
                        <h3 className="text-xl font-sans mb-2">Parede:</h3>
                        <CustomCheckboxGroup
                            name="wallFinishing"
                            options={wallOptions}
                            registration={register('wallFinishing')}
                            error={errors.wallFinishing?.message}
                            gridCols={'full'}
                        />
                    </div>

                    {!isFacade && !isExternal && (
                        <div>
                            <h3 className="text-xl font-sans mb-2">Forro:</h3>
                            <CustomCheckboxGroup
                                name="ceilingFinishing"
                                options={ceilingOptions}
                                registration={register('ceilingFinishing')}
                                error={errors.ceilingFinishing?.message}
                                gridCols={'full'}
                            />
                        </div>
                    )}
                </div>

                {/* Botão de submit */}
                <div className="flex justify-center mt-8">
                    <CustomButton
                        icon={<SaveIcon />}
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3"
                    >
                        {isLoading ? 'Salvando...' : 'Salvar Local'}
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
