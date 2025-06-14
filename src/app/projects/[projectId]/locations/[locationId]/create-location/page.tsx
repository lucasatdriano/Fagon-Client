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
import {
    ceilingOptions,
    floorOptions,
    mappedLocationTypeOptions,
    wallOptions,
} from '@/constants';
import { PhotoCard } from '@/components/cards/PhotoCard';
import { LocationService } from '@/services/domains/locationService';
import {
    locationFormSchema,
    LocationFormSchema,
    UpdateLocationFormSchema,
} from '@/validations';
import { locationType as locationTypes, surfaceType } from '@/constants';
import {
    CustomDropdownInput,
    DropdownOption,
} from '@/components/forms/CustomDropdownInput';
import { CustomRadioGroup } from '@/components/forms/CustomRadioGroup';
import {
    getLocationLabelByValue,
    getLocationValueByLabel,
} from '@/utils/formatters/formatValues';
import { PavementService } from '@/services/domains/pavementService';
import { pavements as pavementOptions } from '@/constants/pavements';
import { Pavement } from '@/interfaces/pavement';
import { handleMaskedChange } from '@/utils/helpers/handleMaskedInput';
import { Photo } from '@/interfaces/photo';
import { PhotoService } from '@/services/domains/photoService';
import { useUserRole } from '@/hooks/useUserRole';
import { AddPhotoModal } from '@/components/modals/photoModals/AddPhotoModal';

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
    const { isVisitor } = useUserRole();
    const [isLoading, setIsLoading] = useState(true);
    const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
    const [pavements, setPavements] = useState<DropdownOption[]>([]);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [formKey, setFormKey] = useState(0);
    const [showPhotoOptionsModal, setShowPhotoOptionsModal] = useState(false);

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

    const mapPavementToDropdownOptions = (pavementsFromApi: Pavement[]) => {
        return pavementsFromApi.map((pavement) => {
            const matchedOption = pavementOptions.find(
                (opt) => opt.value === pavement.pavement,
            );

            return {
                id: pavement.id,
                value: pavement.id,
                label: matchedOption ? matchedOption.label : pavement.pavement,
            };
        });
    };

    const loadPavements = useCallback(async () => {
        try {
            const response = await PavementService.getByProject(
                projectId as string,
            );
            console.log(response);
            console.log(response.data);
            const mappedPavements = mapPavementToDropdownOptions(response.data);

            setPavements(mappedPavements);
        } catch (error) {
            toast.error('Erro ao carregar pavimentos');
            console.error('Erro detalhado:', error);
        }
    }, [projectId]);

    const loadLocationData = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await LocationService.getById(
                locationId as string,
            );
            const locationData = response.data;

            const mappedPhotos =
                locationData.photo?.map((photo) => ({
                    id: photo.id,
                    filePath: photo.filePath.startsWith('http')
                        ? photo.filePath
                        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}/${photo.filePath}`,
                    selectedForPdf: photo.selectedForPdf,
                })) || [];

            setLocation(locationData);
            setAllPhotos(mappedPhotos || []);

            setValue('name', getLocationLabelByValue(locationData.name));
            setValue('locationType', locationData.locationType);
            setValue('pavementId', locationData.pavement?.id || '');
            setValue('height', locationData.height?.toString() || '');

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
        loadPavements();
    }, [locationId, loadLocationData, loadPavements]);

    const handlePhotosAdded = useCallback((files: File[]) => {
        const newPhotos = files.map((file) => ({
            file,
            filePath: URL.createObjectURL(file),
            selectedForPdf: false,
        }));

        setAllPhotos((prev) => [...prev, ...newPhotos]);
    }, []);

    const handleTogglePhotoSelection = useCallback(
        async (photoId: string) => {
            if (isVisitor) {
                toast.error(
                    'Vistoriadores não podem selecionar fotos para PDF',
                );
                return;
            }

            try {
                const photoIndex = allPhotos.findIndex(
                    (photo) => photo.id === photoId,
                );
                if (photoIndex === -1) return;

                const updatedPhotos = [...allPhotos];
                const currentPhoto = updatedPhotos[photoIndex];
                const newSelectionStatus = !currentPhoto.selectedForPdf;

                await PhotoService.update(photoId, {
                    selectedForPdf: newSelectionStatus,
                });

                updatedPhotos[photoIndex] = {
                    ...currentPhoto,
                    selectedForPdf: newSelectionStatus,
                };

                setAllPhotos(updatedPhotos);
            } catch (error) {
                console.error('Erro ao atualizar foto:', error);
                toast.error('Erro ao atualizar seleção da foto');
                throw error;
            }
        },
        [allPhotos, isVisitor],
    );

    const handleDeletePhoto = useCallback(async (photoId: string) => {
        try {
            setIsLoading(true);
            await PhotoService.delete(photoId);
            setAllPhotos((prev) =>
                prev.filter((photo) => photo.id !== photoId),
            );
            toast.success('Foto excluída com sucesso');
        } catch (error) {
            console.error('Error deleting photo:', error);
            toast.error('Erro ao excluir foto');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const onSubmit = async (data: UpdateLocationFormSchema) => {
        try {
            setIsLoading(true);

            if (allPhotos.length < 5) {
                toast.error('É necessário enviar pelo menos 5 fotos');
                return;
            }

            const formData = new FormData();
            formData.append('name', getLocationValueByLabel(data.name));
            formData.append('locationType', data.locationType);
            if (data.height) formData.append('height', data.height);
            if (data.pavementId) formData.append('pavementId', data.pavementId);

            allPhotos.forEach((photo) => {
                if (photo.file) {
                    formData.append('photos', photo.file);
                }
            });

            const finishes = {
                floor: data.floorFinishing || [],
                wall: data.wallFinishing || [],
                ceiling: data.ceilingFinishing || [],
            };

            Object.entries(finishes).forEach(([key, values]) => {
                values.forEach((value, index) => {
                    formData.append(`finishes[${key}][${index}]`, value);
                });
            });

            console.log(formData);

            await LocationService.update(locationId as string, formData);
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
                <div className="space-y-4">
                    <CustomFormInput
                        icon={<MapPinIcon />}
                        label="Nome do Local*"
                        registration={register('name')}
                        defaultValue={location?.name || ''}
                        error={errors.name?.message}
                        disabled={isLoading}
                    />

                    <CustomRadioGroup
                        name="locationType"
                        options={mappedLocationTypeOptions}
                        selectedValue={watch('locationType')}
                        onChange={(val) =>
                            setValue(
                                'locationType',
                                val as 'externo' | 'interno',
                            )
                        }
                        gridCols={2}
                        borderColor="border-foreground"
                        textColor="text-foreground"
                        className="px-5"
                    />
                    {errors.locationType && (
                        <p className="mt-1 text-sm text-error">
                            {errors.locationType.message}
                        </p>
                    )}
                </div>

                <div>
                    <div className="w-full relative flex justify-start py-3">
                        <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                            Fotos ({allPhotos.length}/5 mínimo)
                        </h2>
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                    </div>

                    <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <button
                            type="button"
                            className={`bg-white flex items-center justify-center gap-2 rounded-md shadow-sm text-primary py-4 px-6 hover:shadow-md cursor-pointer ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            onClick={() => setShowPhotoOptionsModal(true)}
                            disabled={isLoading}
                        >
                            <CameraIcon className="w-6 h-6" />
                            <span>Adicionar Foto</span>
                        </button>

                        {allPhotos.map((photo, index) => (
                            <PhotoCard
                                key={`photo-${photo.id}-${index}`}
                                photo={{
                                    id: photo.id || '',
                                    filePath: photo.filePath,
                                    selectedForPdf:
                                        photo.selectedForPdf || false,
                                }}
                                onSelect={handleTogglePhotoSelection}
                                onDelete={handleDeletePhoto}
                                index={index}
                                isVisitor={isVisitor}
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

                {!isExternal && (
                    <div>
                        <div className="w-full relative flex justify-start py-3">
                            <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                                Pavimento/Andar
                            </h2>
                            <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                        </div>
                        <CustomDropdownInput
                            placeholder="Pavimento/Andar*"
                            options={pavements}
                            icon={<Layers2Icon />}
                            selectedOptionValue={watch('pavementId')}
                            onOptionSelected={(val) => {
                                setValue('pavementId', val || '');
                            }}
                            error={errors.pavementId?.message}
                            className="text-foreground"
                        />
                    </div>
                )}

                <div>
                    <div className="w-full relative flex justify-start py-3">
                        <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                            Altura (m)
                        </h2>
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                    </div>
                    <CustomFormInput
                        icon={<RulerIcon />}
                        label="Altura (Pé direito)*"
                        registration={register('height')}
                        onChange={(e) =>
                            handleMaskedChange('height', e, setValue)
                        }
                        defaultValue={location?.height || ''}
                        error={errors.height?.message}
                        inputMode="numeric"
                        disabled={isLoading}
                        maxLength={6}
                    />
                </div>

                <div className="space-y-6">
                    <div className="w-full relative flex justify-start">
                        <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                            Acabamentos
                        </h2>
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                    </div>

                    <div>
                        <h3 className="text-xl font-sans mb-2">Piso:</h3>
                        <CustomCheckboxGroup
                            name="floorFinishing"
                            options={floorOptions.map((f) => ({
                                value: f.value,
                                label: f.label,
                                isOtherOption: f.value === 'outro',
                            }))}
                            selectedValues={watch('floorFinishing') || []}
                            onChange={(values) => {
                                const filteredValues = values.filter(Boolean);
                                setValue('floorFinishing', filteredValues, {
                                    shouldValidate: true,
                                });
                            }}
                            error={errors.floorFinishing?.message}
                            gridCols={'full'}
                            placeholder="Especifique o acabamento do piso"
                        />
                    </div>

                    <div>
                        <h3 className="text-xl font-sans mb-2">Parede:</h3>
                        <CustomCheckboxGroup
                            name="wallFinishing"
                            options={wallOptions.map((f) => ({
                                value: f.value,
                                label: f.label,
                            }))}
                            selectedValues={watch('wallFinishing') || []}
                            onChange={(values) =>
                                setValue('wallFinishing', values)
                            }
                            error={errors.wallFinishing?.message}
                            gridCols={'full'}
                        />
                    </div>

                    {!isFacade && !isExternal && (
                        <div>
                            <h3 className="text-xl font-sans mb-2">Forro:</h3>
                            <CustomCheckboxGroup
                                name="ceilingFinishing"
                                options={ceilingOptions.map((f) => ({
                                    value: f.value,
                                    label: f.label,
                                }))}
                                selectedValues={watch('ceilingFinishing') || []}
                                onChange={(values) =>
                                    setValue('ceilingFinishing', values)
                                }
                                error={errors.ceilingFinishing?.message}
                                gridCols={'full'}
                            />
                        </div>
                    )}
                </div>

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

            <AddPhotoModal
                isOpen={showPhotoOptionsModal}
                onClose={() => setShowPhotoOptionsModal(false)}
                onPhotosAdded={handlePhotosAdded}
                isLoading={isLoading}
            />
        </div>
    );
}
