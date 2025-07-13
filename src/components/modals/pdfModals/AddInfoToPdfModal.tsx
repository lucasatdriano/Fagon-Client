'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import {
    BrickWall,
    DraftingCompassIcon,
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
import { getPavementValueByLabel } from '@/utils/formatters/formatValues';
import { sortPavements } from '@/utils/sorts/sortPavements';
import { Pavement } from '@/interfaces/pavement';
import { CustomEditInput } from '@/components/forms/CustomEditInput';

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
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
    } = useForm<ProjectInfoFormData>({
        resolver: zodResolver(projectInfoSchema),
    });

    const structureTypeValue = watch('structureType');
    const floorHeightValue = watch('floorHeight');

    useEffect(() => {
        const loadPavements = async () => {
            setIsLoading(true);
            try {
                const response = await PavementService.getByProject(projectId);
                const pavementsData = response.data;

                const formattedPavements = pavementsData.map((p) => ({
                    id: p.id,
                    pavement: p.pavement,
                    area: p.area ? Number(p.area) : 0,
                    height: p.height ? Number(p.height) : 0,
                }));

                const sortedPavements = sortPavements(formattedPavements);

                setPavements(sortedPavements);
                setValue(
                    'pavements',
                    sortedPavements.map((p) => ({
                        id: p.id,
                        pavement: p.pavement,
                        area: p.area,
                        height: p.height,
                    })),
                );
            } catch (error) {
                console.error('Erro ao carregar pavimentos:', error);
                toast.error('Erro ao carregar informações dos pavimentos');
            } finally {
                setIsLoading(false);
            }
        };

        if (isOpen) {
            loadPavements();
        }
    }, [projectId, isOpen, setValue]);

    const handleAreaChange = (id: string, value: string) => {
        const updatedPavements = pavements.map((pav) =>
            pav.id === id ? { ...pav, area: value ? Number(value) : 0 } : pav,
        );
        setPavements(updatedPavements);
        setValue(
            'pavements',
            updatedPavements.map((p) => ({
                id: p.id,
                pavement: p.pavement,
                area: p.area,
                height: p.height,
            })),
        );
    };

    const onSubmit = async (data: ProjectInfoFormData) => {
        setIsLoading(true);
        try {
            const floorHeightNumber = parseFloat(data.floorHeight);

            await ProjectService.update(projectId, {
                structureType: data.structureType,
                floorHeight: floorHeightNumber,
                pavement: data.pavements?.map((p) => ({
                    id: p.id,
                    pavement: p.pavement,
                    area: p.area,
                    height: p.height,
                })),
            });

            await PdfService.generate({
                projectId,
                pdfType: 'laudo_avaliacao',
            });

            toast.success('Laudo de avaliação gerado com sucesso!');
            onSuccess();
            onClose();
            reset();
        } catch (error) {
            toast.error('Erro ao gerar laudo de avaliação');
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-xl font-medium text-center leading-6 text-foreground"
                                >
                                    Informações para Laudo de Avaliação
                                </Dialog.Title>

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
                                    className="mt-8 space-y-4"
                                >
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <CustomEditInput
                                            icon={
                                                <BrickWall className="h-5 w-5" />
                                            }
                                            label="Tipo da estrutura"
                                            value={structureTypeValue || ''}
                                            onChange={(e) =>
                                                setValue(
                                                    'structureType',
                                                    e.target.value,
                                                    { shouldValidate: true },
                                                )
                                            }
                                            error={
                                                errors.structureType?.message
                                            }
                                            required
                                        />

                                        <CustomEditInput
                                            icon={
                                                <UnfoldVerticalIcon className="h-5 w-5" />
                                            }
                                            label="Valor Piso a Piso (m)"
                                            value={floorHeightValue || ''}
                                            onChange={(e) =>
                                                setValue(
                                                    'floorHeight',
                                                    e.target.value,
                                                    { shouldValidate: true },
                                                )
                                            }
                                            error={errors.floorHeight?.message}
                                            inputMode="decimal"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-8">
                                        <h4 className="font-medium text-gray-900">
                                            Áreas dos Pavimentos (m²)
                                        </h4>
                                        {pavements.length > 0 ? (
                                            pavements.map((pavement) => (
                                                <CustomEditInput
                                                    key={pavement.id}
                                                    icon={
                                                        <DraftingCompassIcon className="h-5 w-5" />
                                                    }
                                                    label={`Área do ${getPavementValueByLabel(
                                                        pavement.pavement,
                                                    )}`}
                                                    value={pavement.area.toString()}
                                                    onChange={(e) =>
                                                        handleAreaChange(
                                                            pavement.id,
                                                            e.target.value,
                                                        )
                                                    }
                                                    error={`A área do ${getPavementValueByLabel(
                                                        pavement.pavement,
                                                    )} é obrigatória`}
                                                    inputMode="decimal"
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
