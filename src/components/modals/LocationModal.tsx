'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { CustomButton } from '../forms/CustomButton';
import { CustomRadioGroup } from '../forms/CustomRadioGroup';
import { locationOptions, mappedLocationTypeOptions } from '@/constants';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { CreateLocationFormValues, createLocationSchema } from '@/validations';
import {
    CreateLocationData,
    LocationService,
} from '@/services/domains/locationService';
import { toast } from 'react-toastify';
import { usePathname, useRouter } from 'next/navigation';

type LocationModalProps = {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    onSuccess?: () => void;
};

export default function LocationModal({
    isOpen,
    onClose,
    projectId,
    onSuccess,
}: LocationModalProps) {
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
                `${pathname}/projects/${newLocation.data.id}`.replace(
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
            <Dialog as="div" className="relative z-10" onClose={onClose}>
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
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                                            name="name"
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
