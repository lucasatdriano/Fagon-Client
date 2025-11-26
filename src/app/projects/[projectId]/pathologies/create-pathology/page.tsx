'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    CameraIcon,
    Loader2Icon,
    MapPinIcon,
    SaveIcon,
    TextIcon,
    TypeIcon,
} from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { CustomButton } from '../../../../../components/forms/CustomButton';
import { CustomFormInput } from '../../../../../components/forms/CustomFormInput';
import { PhotoCard } from '../../../../../components/cards/PhotoCard';
import { PathologyCard } from '../../../../../components/cards/PathologyCard';
import {
    CustomDropdownInput,
    DropdownOption,
} from '../../../../../components/forms/CustomDropdownInput';
import {
    Pathology,
    PathologyService,
} from '../../../../../services/domains/pathologyService';
import { LocationService } from '../../../../../services/domains/locationService';
import { useUserRole } from '../../../../../hooks/useUserRole';
import { AddPhotoModal } from '../../../../../components/modals/photoModals/AddPhotoModal';
import { PathologyPhoto } from '../../../../../interfaces/pathologyPhoto';
import {
    formatWithCapitals,
    getLocationLabelByValue,
} from '../../../../../utils/formatters/formatValues';
import { UpdatePathologyModal } from '../../../../../components/modals/pathologyModals/PathologyModal';
import {
    CreatePathologyFormValues,
    createPathologySchema,
} from '../../../../../validations';
import { locationOptions } from '../../../../../constants';
import { AuthService } from '@/services/domains/authService';
import { Pagination } from '@/components/layout/Pagination';
import { ITEMS_PER_PAGE } from '@/constants/pagination';
import { ApiResponse, PathologiesApiResponse } from '@/types/api';

export default function CreatePathologyPage() {
    const router = useRouter();
    const { projectId } = useParams<{ projectId: string }>();
    const { isVisitor } = useUserRole();
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingPathologies, setIsLoadingPathologies] = useState(false);
    const [photos, setPhotos] = useState<PathologyPhoto[]>([]);
    const [locations, setLocations] = useState<DropdownOption[]>([]);
    const [pathologies, setPathologies] = useState<Pathology[]>([]);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [isNormalCamera, setIsNormalCamera] = useState(false);
    const [selectedLocationId, setSelectedLocationId] = useState<string>('');
    const [selectedPathology, setSelectedPathology] =
        useState<Pathology | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        totalPages: 1,
    });
    const searchParams = useSearchParams();
    const currentPage = Number(searchParams.get('page')) || 1;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<Omit<CreatePathologyFormValues, 'photos'>>({
        resolver: zodResolver(createPathologySchema.omit({ photos: true })),
    });

    const loadPathologies = useCallback(async () => {
        try {
            setIsLoadingPathologies(true);

            const response: ApiResponse<PathologiesApiResponse> =
                await PathologyService.listAll({
                    projectId,
                    page: currentPage,
                    limit: ITEMS_PER_PAGE,
                });
            setPathologies(response.data.pathologies);
            setPagination({
                total: response.data.meta?.resource?.total || 0,
                page: currentPage,
                totalPages: response.data.meta?.resource?.totalPages || 1,
            });
        } catch (error) {
            toast.error('Erro ao carregar patologias');
            console.error(error);
        } finally {
            setIsLoadingPathologies(false);
        }
    }, [projectId, currentPage]);

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
        const loadData = async () => {
            try {
                setIsLoading(true);

                const locs = await LocationService.listAll(projectId);
                setLocations(
                    locs.data.map((l) => ({
                        id: l.id,
                        value: l.id,
                        label: locationOptions.some(
                            (opt) => opt.value === l.name,
                        )
                            ? getLocationLabelByValue(l.name)
                            : formatWithCapitals(l.name),
                    })),
                );

                setValue('projectId', projectId);
                await loadPathologies();
            } catch (error) {
                toast.error('Erro ao carregar dados');
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [projectId, setValue, loadPathologies]);

    const handleLocationSelect = (id: string | null) => {
        if (id === null) {
            setSelectedLocationId('');
            setValue('referenceLocation', '');
            setValue('locationId', '');
        } else {
            setSelectedLocationId(id);
            setValue('referenceLocation', id);
            setValue('locationId', id);
        }
    };

    useEffect(() => {
        return () => {
            photos.forEach((p) => URL.revokeObjectURL(p.tempUrl));
        };
    }, [photos]);

    const handleDeletePathology = async (id: string) => {
        try {
            setIsLoading(true);
            await PathologyService.delete(id);
            toast.success('Patologia deletada com sucesso!');
            await loadPathologies();
        } catch (error) {
            toast.error('Erro ao deletar patologia');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddPhotos = useCallback((files: File[]) => {
        const newPhotos = files.map((file) => ({
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            tempUrl: URL.createObjectURL(file),
            name: file.name,
        }));
        setPhotos((prev) => [...prev, ...newPhotos]);
    }, []);

    const handleRemovePhoto = useCallback(async (id: string) => {
        try {
            setIsLoading(true);
            setPhotos((prev) => prev.filter((p) => p.id !== id));
        } catch (error) {
            toast.error('Erro ao remover foto');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleCardClick = (pathology: Pathology) => {
        setSelectedPathology(pathology);
        setIsUpdateModalOpen(true);
    };

    const handlePathologyUpdated = (updatedPathology: Pathology) => {
        setPathologies((prev) =>
            prev.map((p) =>
                p.id === updatedPathology.id ? updatedPathology : p,
            ),
        );
        setIsUpdateModalOpen(false);
    };

    const onSubmit = async (
        data: Omit<CreatePathologyFormValues, 'photos'>,
    ) => {
        try {
            setIsLoading(true);

            if (isNormalCamera && photos.length < 2) {
                toast.error('Pelo menos 2 fotos são necessárias');
                return;
            }

            const location = await LocationService.getById(selectedLocationId);
            const formData = new FormData();

            formData.append('projectId', projectId);
            formData.append('locationId', selectedLocationId);
            formData.append('referenceLocation', location.data.name);
            formData.append('title', data.title);
            formData.append('description', data.description);

            photos.forEach((photo) => {
                formData.append(
                    'photos',
                    photo.file,
                    photo.name || `photo-${Date.now()}`,
                );
            });

            await PathologyService.create(formData);
            toast.success('Patologia criada com sucesso!');
            setPhotos([]);
            setSelectedLocationId('');
            router.push(`/projects/${projectId}/pathologies/create-pathology`);
        } catch (error) {
            toast.error('Erro ao criar patologia');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto py-2 md:py-4 px-4 md:px-6">
            <div className="w-full relative flex justify-center py-3 mt-16">
                <h1 className="text-3xl font-sans bg-background px-2">
                    Patologia
                </h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>

            <form
                onSubmit={handleSubmit(onSubmit, (errors) => {
                    console.error('Erros de validação:', errors);
                })}
                className="space-y-6"
            >
                <div className="space-y-4">
                    <div className="w-full relative flex justify-start py-3">
                        <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                            {isNormalCamera && ` (${photos.length}/2 mínimo)`}
                        </h2>
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                    </div>

                    <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        <button
                            type="button"
                            className="bg-white flex items-center justify-center gap-2 rounded-md shadow-sm text-primary py-4 px-6 hover:shadow-md cursor-pointer"
                            onClick={() => setShowPhotoModal(true)}
                            disabled={isLoading}
                        >
                            <CameraIcon className="w-6 h-6" />
                            <span>Adicionar Foto</span>
                        </button>

                        {photos.map((photo, index) => (
                            <PhotoCard
                                key={photo.id}
                                photo={{
                                    id: photo.id,
                                    name: photo.name || '',
                                    filePath: photo.tempUrl || photo.filePath,
                                    file: photo.file,
                                    tempUrl: photo.tempUrl,
                                }}
                                onDelete={handleRemovePhoto}
                                isPathologyPhoto={true}
                                index={index}
                                isVisitor={isVisitor}
                                disabled={isLoading}
                            />
                        ))}
                    </div>
                    {isNormalCamera && photos.length < 2 && (
                        <p className="text-error mt-2">
                            Pelo menos 2 fotos são necessárias
                        </p>
                    )}
                </div>

                <div className="space-y-4">
                    <div className="w-full relative flex justify-start py-3">
                        <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                            Localização
                        </h2>
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                    </div>
                    <CustomDropdownInput
                        options={locations}
                        selectedOptionValue={selectedLocationId}
                        onOptionSelected={handleLocationSelect}
                        icon={<MapPinIcon />}
                        placeholder="Selecione o local*"
                        error={errors.referenceLocation?.message}
                    />
                </div>

                <div className="space-y-4">
                    <div className="w-full relative flex justify-start py-3">
                        <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                            Título
                        </h2>
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                    </div>
                    <CustomFormInput
                        icon={<TypeIcon />}
                        label="Título*"
                        {...register('title')}
                        error={errors.title?.message}
                        id="PathologyTitleInput"
                        disabled={isLoading}
                    />
                </div>

                <div className="space-y-4">
                    <div className="w-full relative flex justify-start py-3">
                        <h2 className="text-2xl font-sans bg-background px-2 ml-8">
                            Descrição
                        </h2>
                        <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                    </div>
                    <CustomFormInput
                        icon={<TextIcon />}
                        label="Descrição*"
                        {...register('description')}
                        error={errors.description?.message}
                        id="PathologyDescriptionInput"
                        disabled={isLoading}
                    />
                </div>

                <div className="flex justify-center mt-8">
                    <CustomButton
                        type="submit"
                        icon={<SaveIcon />}
                        disabled={
                            isLoading || (isNormalCamera && photos.length < 2)
                        }
                        className="px-8 py-3"
                    >
                        {isLoading ? 'Salvando...' : 'Salvar Patologia'}
                    </CustomButton>
                </div>
            </form>

            <AddPhotoModal
                isOpen={showPhotoModal}
                onClose={() => setShowPhotoModal(false)}
                onPhotosAdded={handleAddPhotos}
                isLoading={isLoading}
            />

            <div className="mt-12">
                <div className="w-full relative flex justify-center py-3">
                    <h2 className="text-3xl font-sans bg-background px-2">
                        Patologias Existentes
                    </h2>
                    <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {isLoadingPathologies ? (
                        <div className="flex justify-center items-center h-48 col-span-2">
                            <Loader2Icon className="animate-spin h-10 w-10 text-primary" />
                        </div>
                    ) : (
                        <>
                            {pathologies.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => handleCardClick(p)}
                                    className="cursor-pointer"
                                >
                                    <PathologyCard
                                        id={p.id}
                                        title={p.title}
                                        location={p.referenceLocation}
                                        photoCount={p.pathologyPhoto?.length}
                                        onClick={() => handleCardClick(p)}
                                        onDelete={handleDeletePathology}
                                        disabled={isLoading}
                                        isVisitor={isVisitor}
                                    />
                                </div>
                            ))}
                            <div className="col-span-2 mt-4">
                                <Pagination
                                    currentPage={pagination.page}
                                    totalPages={pagination.totalPages}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>

            {selectedPathology && (
                <UpdatePathologyModal
                    pathology={selectedPathology}
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    onUpdate={handlePathologyUpdated}
                    isNormalCamera={isNormalCamera}
                />
            )}
        </div>
    );
}
