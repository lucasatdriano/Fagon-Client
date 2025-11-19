'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    CameraIcon,
    SaveIcon,
    XIcon,
    MapPinIcon,
    TextIcon,
    TypeIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Pathology,
    PathologyService,
} from '../../../services/domains/pathologyService';
import { CustomButton } from '../../forms/CustomButton';
import { CustomFormInput } from '../../forms/CustomFormInput';
import { PhotoCard } from '../../cards/PhotoCard';
import { useUserRole } from '../../../hooks/useUserRole';
import { AddPhotoModal } from '../photoModals/AddPhotoModal';
import { PathologyPhoto } from '../../../services/domains/pathologyPhotoService';
import { PathologyPhotosService } from '../../../services/domains/pathologyPhotoService';
import { LocationService } from '../../../services/domains/locationService';
import {
    CustomDropdownInput,
    DropdownOption,
} from '../../forms/CustomDropdownInput';
import { formatWithCapitals } from '../../../utils/formatters/formatValues';
import {
    UpdatePathologyFormValues,
    updatePathologySchema,
} from '../../../validations';

interface UpdatePathologyModalProps {
    pathology: Pathology;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: (updatedPathology: Pathology) => void;
    isNormalCamera: boolean;
}

interface PhotoState extends Omit<PathologyPhoto, 'pathology'> {
    tempUrl?: string;
    file?: File;
}

export function UpdatePathologyModal({
    pathology,
    isOpen,
    onClose,
    onUpdate,
    isNormalCamera,
}: UpdatePathologyModalProps) {
    const { isVisitor } = useUserRole();
    const [isLoading, setIsLoading] = useState(false);
    const [photos, setPhotos] = useState<PhotoState[]>([]);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [locations, setLocations] = useState<DropdownOption[]>([]);
    const [selectedLocationId, setSelectedLocationId] = useState<string>('');

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<UpdatePathologyFormValues>({
        resolver: zodResolver(updatePathologySchema),
    });

    useEffect(() => {
        const loadData = async () => {
            if (pathology && isOpen) {
                try {
                    setIsLoading(true);
                    const locs = await LocationService.listAll(
                        pathology.project.id,
                    );
                    setLocations(
                        locs.data.map((l) => ({
                            id: l.id,
                            value: l.id,
                            label: formatWithCapitals(l.name),
                        })),
                    );

                    if (pathology.location.id) {
                        setSelectedLocationId(pathology.location.id);
                        setValue(
                            'referenceLocation',
                            pathology.referenceLocation,
                        );
                        setValue('locationId', pathology.location.id);
                    }

                    const response =
                        await PathologyPhotosService.listByPathology(
                            pathology.id,
                            true,
                        );

                    const photosData = response.data || [];

                    const loadedPhotos = photosData.map(
                        (photo: PathologyPhoto) => ({
                            ...photo,
                            signedUrl: photo.signedUrl,
                        }),
                    );

                    setPhotos(loadedPhotos);

                    reset({
                        title: pathology.title,
                        description: pathology.description || '',
                        referenceLocation: pathology.referenceLocation,
                        locationId: pathology.location.id,
                    });
                } catch (error) {
                    toast.error('Erro ao carregar dados');
                    console.error('❌ Erro no loadData:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        loadData();
    }, [pathology, isOpen, reset, setValue]);

    const handleLocationSelect = (id: string | null) => {
        if (id === null) {
            setSelectedLocationId('');
            setValue('referenceLocation', '');
            setValue('locationId', '');
        } else {
            setSelectedLocationId(id);
            setValue(
                'referenceLocation',
                locations.find((l) => l.id === id)?.label || '',
            );
            setValue('locationId', id);
        }
    };

    const handleAddPhotos = (files: File[]) => {
        const newPhotos = files.map((file) => ({
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            tempUrl: URL.createObjectURL(file),
            name: file.name,
            pathologyId: pathology.id,
            createdAt: new Date().toISOString(),
            filePath: '',
        }));
        setPhotos((prev) => [...prev, ...newPhotos]);
    };

    const handleRemovePhoto = async (id: string) => {
        try {
            setIsLoading(true);
            if (!id.startsWith('temp-')) {
                await PathologyPhotosService.delete(id);
                toast.success('Foto removida com sucesso');
            }
            setPhotos((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            toast.error('Erro ao remover foto');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmit = async (data: UpdatePathologyFormValues) => {
        try {
            setIsLoading(true);

            if (isNormalCamera && photos.length < 2) {
                toast.error('Pelo menos 2 fotos são necessárias');
                return;
            }

            const newPhotos = photos.filter((photo) => photo.file);
            if (newPhotos.length > 0) {
                await PathologyPhotosService.upload(
                    pathology.id,
                    newPhotos.map((photo) => photo.file!),
                );
            }

            const updated = await PathologyService.update(pathology.id, {
                title: data.title,
                description: data.description,
                referenceLocation: data.referenceLocation,
                locationId: data.locationId,
            });

            onUpdate(updated.data);
            toast.success('Patologia atualizada com sucesso!');
            onClose();
        } catch (error) {
            toast.error('Erro ao atualizar patologia');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

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
                    <div className="fixed inset-0 bg-black/25" />
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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-center border-b pb-4">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Editar Patologia
                                    </Dialog.Title>
                                    <button
                                        title="Fechar Modal"
                                        onClick={onClose}
                                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-200 p-2 rounded-full"
                                        disabled={isLoading}
                                    >
                                        <XIcon className="w-6 h-6" />
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleSubmit(
                                        onSubmit,
                                        (errors) => {
                                            console.error(
                                                'Form validation errors:',
                                                errors,
                                            );
                                        },
                                    )}
                                    className="mt-4 space-y-6"
                                >
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">
                                            Fotos{' '}
                                            {isNormalCamera &&
                                                ` (${photos.length}/2 mínimo)`}
                                        </h3>
                                        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                                            <button
                                                type="button"
                                                className="bg-white flex items-center justify-center gap-2 rounded-md shadow-sm border border-gray-200 text-primary py-4 px-6 hover:shadow-md cursor-pointer"
                                                onClick={() =>
                                                    setShowPhotoModal(true)
                                                }
                                                disabled={isLoading}
                                            >
                                                <CameraIcon className="w-6 h-6" />
                                                <span>Adicionar Foto</span>
                                            </button>

                                            {photos.map((photo, index) => {
                                                return (
                                                    <PhotoCard
                                                        key={photo.id}
                                                        photo={{
                                                            id: photo.id,
                                                            filePath:
                                                                photo.tempUrl ||
                                                                photo.filePath,
                                                            name:
                                                                photo.name ||
                                                                '',
                                                            file: photo.file,
                                                            signedUrl:
                                                                photo.signedUrl,
                                                        }}
                                                        onDelete={
                                                            handleRemovePhoto
                                                        }
                                                        isPathologyPhoto={true}
                                                        index={index}
                                                        isVisitor={isVisitor}
                                                        disabled={isLoading}
                                                    />
                                                );
                                            })}
                                        </div>
                                        {isNormalCamera &&
                                            photos.length < 2 && (
                                                <p className="text-red-500 text-sm mt-2">
                                                    Pelo menos 2 fotos são
                                                    necessárias
                                                </p>
                                            )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <CustomDropdownInput
                                                options={locations}
                                                selectedOptionValue={
                                                    selectedLocationId
                                                }
                                                onOptionSelected={
                                                    handleLocationSelect
                                                }
                                                icon={<MapPinIcon />}
                                                placeholder="Selecione o local"
                                                error={
                                                    errors.referenceLocation
                                                        ?.message
                                                }
                                            />
                                        </div>

                                        <CustomFormInput
                                            icon={<TypeIcon />}
                                            label="Título*"
                                            {...register('title')}
                                            error={errors.title?.message}
                                            id="PathologyTitleInput"
                                            disabled={isLoading}
                                            defaultValue={pathology.title}
                                        />

                                        <CustomFormInput
                                            icon={<TextIcon />}
                                            label="Descrição"
                                            {...register('description')}
                                            error={errors.description?.message}
                                            id="PathologyDescriptionInput"
                                            disabled={isLoading}
                                            defaultValue={
                                                pathology.description || ''
                                            }
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3 pt-4 border-t">
                                        <CustomButton
                                            type="button"
                                            onClick={onClose}
                                            disabled={isLoading}
                                            color="bg-white"
                                            textColor="text-foreground"
                                            className="rounded-md border border-foreground text-gray-700 hover:bg-zinc-200"
                                        >
                                            Cancelar
                                        </CustomButton>
                                        <CustomButton
                                            type="submit"
                                            icon={
                                                <SaveIcon className="w-4 h-4" />
                                            }
                                            disabled={
                                                isLoading ||
                                                (isNormalCamera &&
                                                    photos.length < 2)
                                            }
                                            className="hover:bg-secondary-hover"
                                        >
                                            {isLoading
                                                ? 'Salvando...'
                                                : 'Salvar Alterações'}
                                        </CustomButton>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>

                <AddPhotoModal
                    isOpen={showPhotoModal}
                    onClose={() => setShowPhotoModal(false)}
                    onPhotosAdded={handleAddPhotos}
                    isLoading={isLoading}
                />
            </Dialog>
        </Transition>
    );
}
