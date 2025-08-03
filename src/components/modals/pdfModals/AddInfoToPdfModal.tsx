'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import {
    BrickWall,
    DraftingCompassIcon,
    FilePlus2Icon,
    Loader2Icon,
    UnfoldVerticalIcon,
} from 'lucide-react';
import { CustomButton } from '../../forms/CustomButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProjectInfoFormData, projectInfoSchema } from '../../../validations';
import { ProjectService } from '../../../services/domains/projectService';
import { PdfService } from '../../../services/domains/pdfService';
import { toast } from 'sonner';
import { PavementService } from '../../../services/domains/pavementService';
import { getPavementValueByLabel } from '../../../utils/formatters/formatValues';
import { sortPavements } from '../../../utils/sorts/sortPavements';
import { Pavement } from '../../../interfaces/pavement';
import { CustomEditInput } from '../../../components/forms/CustomEditInput';
import { formatFloorHeight } from '../../../utils/formatters/formatFloorHeight';
import {
    formatDecimalValue,
    parseDecimalValue,
} from '../../../utils/formatters/formatDecimal';
import { handleMaskedChange } from '../../../utils/helpers/handleMaskedInput';

interface AddInfoToPdfModalProps {
    projectId: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    isLoading?: boolean;
}

export default function AddInfoToPdfModal({
    projectId,
    isOpen,
    onClose,
    onSuccess,
}: AddInfoToPdfModalProps) {
    const [pavements, setPavements] = useState<Pavement[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm<ProjectInfoFormData>({
        resolver: zodResolver(projectInfoSchema),
        defaultValues: {
            pavements: [],
        },
    });

    const structureTypeValue = watch('structureType');
    const floorHeightValue = watch('floorHeight');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const pavementsResponse = await PavementService.getByProject(
                    projectId,
                );
                const pavementsData = pavementsResponse.data;

                const formattedPavements = pavementsData.map((p) => ({
                    id: p.id,
                    pavement: p.pavement,
                    area: p.area ? Number(p.area) : 0,
                    height: p.height ? Number(p.height) : 0,
                }));

                const sortedPavements = sortPavements(formattedPavements);
                setPavements(sortedPavements);

                const projectResponse = await ProjectService.getById(projectId);
                const projectData = projectResponse.data;

                setValue('structureType', projectData.structureType || '');
                setValue(
                    'floorHeight',
                    projectData.floorHeight?.toString() || '',
                );

                sortedPavements.forEach((p, index) => {
                    setValue(`pavements.${index}.id`, p.id);
                    setValue(`pavements.${index}.pavement`, p.pavement);
                    setValue(`pavements.${index}.height`, p.height);
                    setValue(
                        `pavements.${index}.area`,
                        p.area
                            ? formatDecimalValue(p.area.toString())
                            : undefined,
                    );
                });
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                toast.error('Erro ao carregar informações do projeto');
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            loadData();
        }
    }, [projectId, isOpen, setValue]);

    const onSubmit = async (data: ProjectInfoFormData) => {
        setIsLoading(true);
        try {
            const updateData = {
                structureType: data.structureType,
                floorHeight: data.floorHeight
                    ? formatFloorHeight(data.floorHeight)
                    : undefined,
                pavement: data.pavements?.map((pavement) => ({
                    id: pavement.id,
                    pavement: pavement.pavement,
                    area: pavement.area
                        ? parseFloat(pavement.area.replace(',', '.'))
                        : 0,
                    height: pavement.height || 0,
                })),
            };

            await ProjectService.update(projectId, updateData);

            if (data.pavements && data.pavements.length > 0) {
                await Promise.all(
                    data.pavements.map((pavement) =>
                        PavementService.update(pavement.id, {
                            area: pavement.area
                                ? parseDecimalValue(pavement.area.toString())
                                : 0,
                            height: pavement.height || 0,
                        }),
                    ),
                );
            }

            await PdfService.generate({
                projectId,
                pdfType: 'laudo_avaliacao',
            });

            toast.success('Laudo de avaliação gerado com sucesso!');
            onSuccess();
            onClose();
            reset();
        } catch (error) {
            console.error(error);
            toast.error('Erro ao processar a solicitação');
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl font-medium text-center leading-6 text-foreground"
                                >
                                    Informações para Laudo de Avaliação
                                </Dialog.Title>

                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="mt-8 space-y-4"
                                >
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <CustomEditInput
                                            icon={
                                                <BrickWall className="h-5 w-5" />
                                            }
                                            label="Tipo da estrutura"
                                            registration={register(
                                                'structureType',
                                            )}
                                            defaultValue={structureTypeValue}
                                            error={
                                                errors.structureType?.message
                                            }
                                            id="StructureTypeInput"
                                            required
                                        />

                                        <CustomEditInput
                                            icon={
                                                <UnfoldVerticalIcon className="h-5 w-5" />
                                            }
                                            label="Valor Piso a Piso (m)"
                                            registration={register(
                                                'floorHeight',
                                            )}
                                            defaultValue={floorHeightValue}
                                            error={errors.floorHeight?.message}
                                            id="FloorHeightInput"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-5">
                                        <h4 className="font-medium text-gray-900">
                                            Áreas dos Pavimentos (m²)
                                        </h4>
                                        {pavements.length > 0 ? (
                                            pavements.map((pavement, index) => (
                                                <CustomEditInput
                                                    key={pavement.id}
                                                    icon={
                                                        <DraftingCompassIcon className="h-5 w-5" />
                                                    }
                                                    label={`Área do ${getPavementValueByLabel(
                                                        pavement.pavement,
                                                    )} (m²)`}
                                                    registration={register(
                                                        `pavements.${index}.area`,
                                                    )}
                                                    defaultValue={pavement.area}
                                                    onChange={(e) =>
                                                        handleMaskedChange(
                                                            `pavements.${index}.area`,
                                                            e,
                                                            setValue,
                                                        )
                                                    }
                                                    error={
                                                        errors.pavements?.[
                                                            index
                                                        ]?.area?.message
                                                    }
                                                    id={`Pavements${index}AreaInput`}
                                                    inputMode="decimal"
                                                    maxLength={7}
                                                    required
                                                />
                                            ))
                                        ) : (
                                            <p className="text-gray-500">
                                                Nenhum pavimento encontrado
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-end space-x-3 mt-6">
                                        <CustomButton
                                            type="button"
                                            onClick={onClose}
                                            disabled={isLoading}
                                            color="bg-white"
                                            textColor="text-foreground"
                                            className={`rounded-md border border-foreground text-sm hover:bg-zinc-200 ${
                                                isLoading
                                                    ? 'opacity-50 cursor-not-allowed'
                                                    : ''
                                            }`}
                                        >
                                            Cancelar
                                        </CustomButton>
                                        <CustomButton
                                            type="submit"
                                            disabled={isLoading}
                                            color={
                                                isLoading
                                                    ? 'bg-gray-400'
                                                    : 'bg-primary'
                                            }
                                            icon={
                                                <FilePlus2Icon className="h-5 w-5" />
                                            }
                                            className={`text-sm ${
                                                isLoading
                                                    ? ''
                                                    : 'hover:bg-primary-hover'
                                            }`}
                                        >
                                            {isLoading ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <Loader2Icon className="animate-spin h-4 w-4" />
                                                    Gerando...
                                                </span>
                                            ) : (
                                                'Gerar Laudo'
                                            )}
                                        </CustomButton>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
