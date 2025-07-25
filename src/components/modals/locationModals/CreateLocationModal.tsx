'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';
import { CustomButton } from '../../../components/forms/CustomButton';
import { CustomRadioGroup } from '../../../components/forms/CustomRadioGroup';
import { mappedLocationTypeOptions, locationOptions } from '../../../constants';
import {
    CreateLocationData,
    LocationService,
} from '../../../services/domains/locationService';
import {
    CreateLocationFormValues,
    createLocationSchema,
} from '../../../validations';
import { MapPinPlusIcon } from 'lucide-react';

type CreateLocationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    onSuccess?: () => void;
};

export default function CreateLocationModal({
    isOpen,
    onClose,
    projectId,
    onSuccess,
}: CreateLocationModalProps) {
    const router = useRouter();
    const pathname = usePathname();

    const {
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CreateLocationFormValues>({
        resolver: zodResolver(createLocationSchema),
        defaultValues: {
            locationType: undefined,
            name: undefined,
        },
    });

    const onSubmit = async (data: CreateLocationFormValues) => {
        try {
            const createData: CreateLocationData = {
                projectId,
                locationType: data.locationType,
                name: data.name,
            };

            const newLocation = await LocationService.create(createData);
            reset();
            onClose();
            onSuccess?.();
            toast.success('Local criado com sucesso');

            const finalHref =
                `${pathname}/${newLocation.data.id}/create-location`.replace(
                    '//',
                    '/',
                );
            router.push(finalHref);
        } catch (error) {
            console.error('Erro ao criar local:', error);
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
                    <div className="fixed inset-0 bg-foreground bg-opacity-25" />
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
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h2"
                                    className="text-xl text-center font-bold leading-6 border-b pb-2"
                                >
                                    Adicionar Local
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
                                    className="mt-4 space-y-6"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Tipo do local
                                        </p>
                                        <CustomRadioGroup
                                            name="locationType"
                                            options={mappedLocationTypeOptions}
                                            selectedValue={watch(
                                                'locationType',
                                            )}
                                            onChange={(val) =>
                                                setValue(
                                                    'locationType',
                                                    val as
                                                        | 'externo'
                                                        | 'interno',
                                                )
                                            }
                                            gridCols={2}
                                            borderColor="border-foreground"
                                            textColor="text-foreground"
                                            className="text-sm"
                                        />
                                        {errors.locationType && (
                                            <p className="mt-1 text-sm text-error">
                                                {errors.locationType.message}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Local
                                        </p>
                                        <CustomRadioGroup
                                            name="nameLocation"
                                            options={locationOptions}
                                            selectedValue={watch('name')}
                                            onChange={(val) =>
                                                setValue('name', val, {
                                                    shouldValidate: true,
                                                })
                                            }
                                            placeholder="Digite o nome do local"
                                            gridCols={2}
                                            borderColor="border-foreground"
                                            textColor="text-foreground"
                                            className="text-sm"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-error">
                                                {errors.name.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-center space-x-3 pt-4 border-t">
                                        <CustomButton
                                            type="submit"
                                            disabled={isSubmitting}
                                            icon={
                                                <MapPinPlusIcon className="h-5 w-5" />
                                            }
                                        >
                                            {isSubmitting
                                                ? 'Criando...'
                                                : 'Criar Local'}
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
