'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    CameraIcon,
    Layers2Icon,
    Loader2Icon,
    MapPinIcon,
    RulerIcon,
    SaveIcon,
    SquarePenIcon,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { CustomButton } from '../../../../../../components/forms/CustomButton';
import { CustomFormInput } from '../../../../../../components/forms/CustomFormInput';
import { CustomCheckboxGroup } from '../../../../../../components/forms/CustomCheckbox';
import {
    ceilingOptions,
    floorOptions,
    mappedLocationTypeOptions,
    wallOptions,
} from '../../../../../../constants';
import { PhotoCard } from '../../../../../../components/cards/PhotoCard';
import {
    Location,
    LocationService,
} from '../../../../../../services/domains/locationService';
import {
    UpdateLocationFormSchema,
    updateLocationSchema,
} from '../../../../../../validations';
import {
    locationType as locationTypes,
    surfaceType,
} from '../../../../../../constants';
import {
    CustomDropdownInput,
    DropdownOption,
} from '../../../../../../components/forms/CustomDropdownInput';
import { CustomRadioGroup } from '../../../../../../components/forms/CustomRadioGroup';
import {
    getLocationLabelByValue,
    getLocationValueByLabel,
    getPavementValueByLabel,
} from '../../../../../../utils/formatters/formatValues';
import { PavementService } from '../../../../../../services/domains/pavementService';
import { Pavement } from '../../../../../../interfaces/pavement';
import { handleMaskedChange } from '../../../../../../utils/helpers/handleMaskedInput';
import { Photo } from '../../../../../../interfaces/photo';
import { PhotoService } from '../../../../../../services/domains/photoService';
import { useUserRole } from '../../../../../../hooks/useUserRole';
import { AddPhotoModal } from '../../../../../../components/modals/photoModals/AddPhotoModal';
import { sortPavements } from '../../../../../../utils/sorts/sortPavements';
import { formatDecimalValue } from '../../../../../../utils/formatters/formatDecimal';
import { AuthService } from '@/services/domains/authService';
import { extractPhotoNumber } from '@/utils/sorts/sortPhotos';

export default function CreateLocationPage() {
    const { projectId, locationId } = useParams();
    const { isVisitor } = useUserRole();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [allPhotos, setAllPhotos] = useState<Photo[]>([]);
    const [pavements, setPavements] = useState<DropdownOption[]>([]);
    const [location, setLocation] = useState<Location | null>(null);
    const [formKey, setFormKey] = useState(0);
    const [customFloorFinishing, setCustomFloorFinishing] = useState('');
    const [customWallFinishing, setCustomWallFinishing] = useState('');
    const [customCeilingFinishing, setCustomCeilingFinishing] = useState('');
    const [showPhotoOptionsModal, setShowPhotoOptionsModal] = useState(false);
    const [isNormalCamera, setIsNormalCamera] = useState(false);
    const [debounceTimers, setDebounceTimers] = useState<
        Record<string, NodeJS.Timeout>
    >({});
    const [isUploading, setIsUploading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm<UpdateLocationFormSchema>({
        resolver: zodResolver(updateLocationSchema),
        defaultValues: {
            projectId: projectId as string,
        },
    });

    const name = watch('name');
    const formLocationType = watch('locationType');
    const isFacade = name?.toLowerCase().includes('fachada');
    const isExternal =
        formLocationType ===
        locationTypes.find((lt) => lt.value === 'externo')?.value;

    const mapPavementToDropdownOptions = (pavementsFromApi: Pavement[]) => {
        const sortedPavements = sortPavements(pavementsFromApi);

        return sortedPavements.map((pavement) => {
            return {
                id: pavement.id,
                value: pavement.id,
                label: getPavementValueByLabel(pavement.pavement),
            };
        });
    };

    const loadLocationData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [locationResponse, pavementsResponse] = await Promise.all([
                LocationService.getById(locationId as string),
                PavementService.getByProject(projectId as string),
            ]);

            const locationData = locationResponse.data;
            console.log(locationData);
            const mappedPavements = mapPavementToDropdownOptions(
                pavementsResponse.data,
            );
            setPavements(mappedPavements);

            const mappedPhotos = (locationData.photo || [])
                .map((photo) => ({
                    id: photo.id,
                    name: photo.name,
                    filePath: photo.filePath.startsWith('http')
                        ? photo.filePath
                        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}/${photo.filePath}`,
                    selectedForPdf: photo.selectedForPdf,
                }))
                .sort(
                    (a, b) =>
                        extractPhotoNumber(a.name) - extractPhotoNumber(b.name),
                );

            setLocation(locationData);
            setAllPhotos(mappedPhotos);

            setValue('name', getLocationLabelByValue(locationData.name));
            setValue('locationType', locationData.locationType);
            setValue('pavementId', locationData.pavement?.id || '');
            if (locationData.height) {
                const formattedHeight = formatDecimalValue(locationData.height);
                setValue('height', formattedHeight);
            }
            setValue(
                'facadeObservation',
                locationData.facadeObservation?.toString() || '',
            );

            const pisoValue = surfaceType.find(
                (st) => st.label === 'Piso',
            )?.value;
            const paredeValue = surfaceType.find(
                (st) => st.label === 'Parede',
            )?.value;
            const forroValue = surfaceType.find(
                (st) => st.label === 'Forro',
            )?.value;

            const floorFinishes =
                locationData.materialFinishing
                    ?.filter((f) => f.surface === pisoValue)
                    .map((f) => f.materialFinishing) || [];

            const standardFloorOptions = floorOptions.map((opt) => opt.value);
            const customFloorValues = floorFinishes.filter(
                (value) => !standardFloorOptions.includes(value),
            );

            setCustomFloorFinishing(customFloorValues.join(', '));
            setValue('floorFinishing', floorFinishes);

            const wallFinishes =
                locationData.materialFinishing
                    ?.filter((f) => f.surface === paredeValue)
                    .map((f) => f.materialFinishing) || [];

            const standardWallOptions = wallOptions.map((opt) => opt.value);
            const customWallValues = wallFinishes.filter(
                (value) => !standardWallOptions.includes(value),
            );

            setCustomWallFinishing(customWallValues.join(', '));
            setValue('wallFinishing', wallFinishes);

            const ceilingFinishes =
                locationData.materialFinishing
                    ?.filter((f) => f.surface === forroValue)
                    .map((f) => f.materialFinishing) || [];

            const standardCeilingOptions = ceilingOptions.map(
                (opt) => opt.value,
            );
            const customCeilingValues = ceilingFinishes.filter(
                (value) => !standardCeilingOptions.includes(value),
            );

            setCustomCeilingFinishing(customCeilingValues.join(', '));
            setValue('ceilingFinishing', ceilingFinishes);

            setFormKey((prev) => prev + 1);
        } catch (error) {
            toast.error('Erro ao carregar dados do local');
            console.error('Erro detalhado:', error);
        } finally {
            setIsLoading(false);
        }
    }, [projectId, locationId, setValue]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await AuthService.getMe();
                setIsNormalCamera(user.data.cameraType === 'normal');
            } catch (error) {
                console.error('Erro ao buscar usuário:', error);
            }
        };

        fetchUser();
    }, []);

    useEffect(() => {
        if (projectId && locationId) loadLocationData();
    }, [projectId, locationId, loadLocationData]);

    useEffect(() => {
        return () => {
            allPhotos.forEach((photo) => {
                if (photo.tempUrl) {
                    URL.revokeObjectURL(photo.tempUrl);
                }
            });
        };
    }, [allPhotos]);

    const handlePhotosAdded = useCallback(
        (files: File[]) => {
            if (isUploading) {
                toast.error('Aguarde o upload atual terminar');
                return;
            }

            setIsUploading(true);

            const tempPhotos = files.map((file) => ({
                file,
                tempUrl: URL.createObjectURL(file),
                filePath: `temp-${crypto.randomUUID()}-${file.name}`,
                selectedForPdf: false,
                id: `temp-${crypto.randomUUID()}`,
                name: `Uploading-${file.name}`,
                isTemp: true,
            }));

            setAllPhotos((prev) => [...prev, ...tempPhotos]);

            (async () => {
                try {
                    const response = await PhotoService.upload(
                        locationId as string,
                        files,
                    );

                    const uploadedPhotos = response.data.map((photo) => ({
                        id: photo.id,
                        name: photo.name,
                        filePath: photo.filePath.startsWith('http')
                            ? photo.filePath
                            : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/sign/${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME}/${photo.filePath}`,
                        selectedForPdf: false,
                        isTemp: false,
                    }));

                    setAllPhotos((prev) => {
                        const withoutTemps = prev.filter((p) => !p.isTemp);

                        const allRealPhotos = [
                            ...withoutTemps,
                            ...uploadedPhotos,
                        ];

                        return allRealPhotos.sort(
                            (a, b) =>
                                extractPhotoNumber(a.name) -
                                extractPhotoNumber(b.name),
                        );
                    });
                } catch (error) {
                    console.error('Upload failed:', error);
                    const tempIds = tempPhotos.map((temp) => temp.id);
                    setAllPhotos((prev) =>
                        prev.filter((p) =>
                            p.id ? !tempIds.includes(p.id) : true,
                        ),
                    );
                    toast.error('Falha no upload das fotos');
                } finally {
                    setIsUploading(false);
                }
            })();
        },
        [locationId, isUploading],
    );

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
                prev.filter((photo) =>
                    photo.id ? photo.id !== photoId : true,
                ),
            );
            toast.success('Foto excluída com sucesso');
        } catch (error) {
            console.error('Error deleting photo:', error);
            toast.error('Erro ao excluir foto');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleCustomFinishingChange = (
        type: 'floor' | 'wall' | 'ceiling',
        value: string,
    ) => {
        if (debounceTimers[type]) {
            clearTimeout(debounceTimers[type]);
        }

        const timer = setTimeout(() => {
            const currentValues = watch(`${type}Finishing`) || [];
            const standardOptions = {
                floor: floorOptions.map((opt) => opt.value),
                wall: wallOptions.map((opt) => opt.value),
                ceiling: ceilingOptions.map((opt) => opt.value),
            }[type];

            const standardValues = currentValues.filter((v) =>
                standardOptions.includes(v),
            );

            const newCustomValues = value
                .split(',')
                .map((v) => v.trim())
                .filter((v) => v);

            const allValues = [...standardValues, ...newCustomValues];

            setValue(`${type}Finishing`, allValues);

            switch (type) {
                case 'floor':
                    setCustomFloorFinishing(newCustomValues.join(', '));
                    break;
                case 'wall':
                    setCustomWallFinishing(newCustomValues.join(', '));
                    break;
                case 'ceiling':
                    setCustomCeilingFinishing(newCustomValues.join(', '));
                    break;
            }
        }, 500);

        setDebounceTimers((prev) => ({ ...prev, [type]: timer }));
    };

    const onSubmit = async (data: UpdateLocationFormSchema) => {
        try {
            console.log(data);
            setIsLoading(true);

            if (isNormalCamera && allPhotos.length < 5) {
                toast.error('É necessário enviar pelo menos 5 fotos');
                return;
            }

            const formData = new FormData();
            formData.append('projectId', projectId as string);
            formData.append('name', getLocationValueByLabel(data.name));
            formData.append('locationType', data.locationType);
            if (data.facadeObservation)
                formData.append('facadeObservation', data.facadeObservation);
            if (data.height !== undefined) {
                if (data.height.trim() === '') {
                    formData.append('height', '');
                } else {
                    const heightValue = data.height.replace(',', '.');
                    const heightNumber = parseFloat(heightValue);
                    if (!isNaN(heightNumber)) {
                        formData.append('height', heightNumber.toString());
                    } else {
                        formData.append('height', '');
                    }
                }
            }
            if (data.pavementId) formData.append('pavementId', data.pavementId);

            const processFinishes = (finishes: string[]) => {
                return Array.from(
                    new Set(
                        finishes
                            .filter(Boolean)
                            .flatMap((f) => f.split(','))
                            .map((v) => v.trim())
                            .filter((v) => v),
                    ),
                );
            };

            const finishes = {
                floor: processFinishes(data.floorFinishing || []),
                wall: processFinishes(data.wallFinishing || []),
                ceiling: processFinishes(data.ceilingFinishing || []),
            };

            Object.entries(finishes).forEach(([key, values]) => {
                values.forEach((value) => {
                    formData.append(`finishes[${key}][]`, value);
                });
            });

            await LocationService.update(locationId as string, formData);
            router.push(`/projects/${projectId}/locations`);
            toast.success('Local atualizado com sucesso!');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Erro ao atualizar local');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveRotatedPhoto = async (
        photoId: string,
        rotation: number,
    ) => {
        try {
            await PhotoService.rotatePhoto(photoId, rotation);

            const updatedPhotosResponse = await PhotoService.listByLocation(
                locationId as string,
                true,
            );
            setAllPhotos(updatedPhotosResponse.data);

            toast.success('Foto rotacionada e salva com sucesso!');
        } catch (error) {
            console.error('Erro ao rotacionar foto:', error);
            toast.error('Erro ao rotacionar a foto');
            throw error;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-svh w-screen">
                <Loader2Icon className="animate-spin w-12 h-12 text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto pb-4 px-4 md:px-6">
            <div className="w-full relative flex justify-center py-3 mt-16">
                <h1 className="text-3xl font-sans bg-background px-2">Local</h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>

            <form
                key={formKey}
                onSubmit={handleSubmit(onSubmit, (errors) => {
                    console.error('Form validation errors:', errors);
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
                        id="NameLocationInput"
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
                            Fotos{' '}
                            {isNormalCamera &&
                                ` (${allPhotos.length}/5 mínimo)`}
                        </h2>
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                    </div>

                    <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <button
                            type="button"
                            className={`bg-white flex items-center justify-center gap-2 rounded-md shadow-sm text-primary py-4 px-6 hover:shadow-md cursor-pointer ${
                                isLoading || isUploading
                                    ? 'opacity-50 cursor-not-allowed'
                                    : ''
                            }`}
                            onClick={() => setShowPhotoOptionsModal(true)}
                            disabled={isLoading || isUploading}
                        >
                            <CameraIcon className="w-6 h-6" />
                            <span>
                                {isUploading ? 'Enviando...' : 'Adicionar Foto'}
                            </span>
                        </button>

                        {allPhotos.map((photo) => (
                            <PhotoCard
                                key={photo.id}
                                photo={{
                                    id: photo.id || '',
                                    name: photo.name || '',
                                    filePath: photo.tempUrl || photo.filePath,
                                    selectedForPdf:
                                        photo.selectedForPdf || false,
                                    file: photo.file,
                                }}
                                onSelect={handleTogglePhotoSelection}
                                onDelete={handleDeletePhoto}
                                index={allPhotos.indexOf(photo)}
                                isVisitor={isVisitor}
                                disabled={isLoading}
                                onSaveRotatedPhoto={handleSaveRotatedPhoto}
                                allPhotos={allPhotos.map((p) => ({
                                    id: p.id || '',
                                    filePath: p.tempUrl || p.filePath,
                                    file: p.file,
                                    name: p.name,
                                }))}
                            />
                        ))}
                    </div>
                    {isNormalCamera && allPhotos.length < 5 && (
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

                {isFacade && (
                    <div>
                        <div className="w-full relative flex justify-start py-3">
                            <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                                Observação da Fachada
                            </h2>
                            <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                        </div>
                        <CustomFormInput
                            icon={<SquarePenIcon />}
                            label="Observações sobre a fachada"
                            registration={register('facadeObservation')}
                            defaultValue={location?.facadeObservation || ''}
                            error={errors.facadeObservation?.message}
                            id="FacadeObservationInput"
                            disabled={isLoading}
                        />
                    </div>
                )}

                {!isFacade && (
                    <div>
                        <div className="w-full relative flex justify-start py-3">
                            <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                                Altura (m)
                            </h2>
                            <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                        </div>
                        <CustomFormInput
                            icon={<RulerIcon />}
                            label={
                                isExternal
                                    ? 'Altura (Pé direito)'
                                    : 'Altura (Pé direito)*'
                            }
                            registration={register('height')}
                            onChange={(e) =>
                                handleMaskedChange('height', e, setValue)
                            }
                            defaultValue={location?.height || ''}
                            error={errors.height?.message}
                            id="HeightInput"
                            inputMode="decimal"
                            disabled={isLoading}
                            maxLength={6}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            Use ponto ou vírgula para decimais (ex: 2.5 ou 2,5)
                        </p>
                    </div>
                )}

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
                            options={floorOptions}
                            selectedValues={watch('floorFinishing') || []}
                            onChange={(values) =>
                                setValue('floorFinishing', values)
                            }
                            gridCols={'full'}
                        />
                        <div className="mt-4">
                            <CustomFormInput
                                label="Outros acabamentos de piso"
                                value={customFloorFinishing}
                                onChange={(e) => {
                                    setCustomFloorFinishing(e.target.value);
                                    handleCustomFinishingChange(
                                        'floor',
                                        e.target.value,
                                    );
                                }}
                                id="FloorFinishingInput"
                                icon={<SquarePenIcon />}
                            />
                            <p className="text-sm indent-4">
                                Separe múltiplos valores por vírgula (ex:
                                Cerâmico, Cimentado)
                            </p>
                        </div>
                        {errors.floorFinishing && (
                            <p className="text-error mt-2">
                                {errors.floorFinishing.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <h3 className="text-xl font-sans mb-2">Parede:</h3>
                        <CustomCheckboxGroup
                            name="wallFinishing"
                            options={wallOptions}
                            selectedValues={watch('wallFinishing') || []}
                            onChange={(values) =>
                                setValue('wallFinishing', values)
                            }
                            gridCols={'full'}
                        />
                        <div className="mt-4">
                            <CustomFormInput
                                label="Outros acabamentos de parede"
                                value={customWallFinishing}
                                onChange={(e) => {
                                    setCustomWallFinishing(e.target.value);
                                    handleCustomFinishingChange(
                                        'wall',
                                        e.target.value,
                                    );
                                }}
                                id="WallFinishingInput"
                                icon={<SquarePenIcon />}
                            />
                            <p className="text-sm indent-4">
                                Separe múltiplos valores por vírgula (ex:
                                Alvenaria, Drywall)
                            </p>
                        </div>
                        {errors.wallFinishing && (
                            <p className="text-error mt-2">
                                {errors.wallFinishing.message}
                            </p>
                        )}
                    </div>

                    {!isFacade && !isExternal && (
                        <div>
                            <h3 className="text-xl font-sans mb-2">Forro:</h3>
                            <CustomCheckboxGroup
                                name="ceilingFinishing"
                                options={ceilingOptions}
                                selectedValues={watch('ceilingFinishing') || []}
                                onChange={(values) =>
                                    setValue('ceilingFinishing', values)
                                }
                                gridCols={'full'}
                            />
                            <div className="mt-4">
                                <CustomFormInput
                                    label="Outros acabamentos de forro"
                                    value={customCeilingFinishing}
                                    onChange={(e) => {
                                        setCustomCeilingFinishing(
                                            e.target.value,
                                        );
                                        handleCustomFinishingChange(
                                            'ceiling',
                                            e.target.value,
                                        );
                                    }}
                                    id="CeilingFinishingInput"
                                    icon={<SquarePenIcon />}
                                />
                                <p className="text-sm indent-4">
                                    Separe múltiplos valores por vírgula (ex:
                                    Gesso Acartonado, Laje)
                                </p>
                            </div>
                            {errors.ceilingFinishing && (
                                <p className="text-error mt-2">
                                    {errors.ceilingFinishing.message}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-center mt-8">
                    <CustomButton
                        icon={<SaveIcon />}
                        type="submit"
                        disabled={isLoading || isUploading}
                        className="px-8 py-3"
                    >
                        {isLoading || isUploading
                            ? 'Salvando...'
                            : 'Salvar Local'}
                    </CustomButton>
                </div>
            </form>

            <AddPhotoModal
                isOpen={showPhotoOptionsModal}
                onClose={() => setShowPhotoOptionsModal(false)}
                onPhotosAdded={handlePhotosAdded}
                isLoading={isLoading || isUploading}
            />
        </div>
    );
}
