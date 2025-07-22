'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { Trash2Icon } from 'lucide-react';
import { CustomButton } from '../../../components/forms/CustomButton';

export function DeletePhotoModal({
    isOpen,
    onClose,
    onConfirm,
    isLoading = false,
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isLoading?: boolean;
}) {
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
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-svh items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center gap-3">
                                    <Trash2Icon className="h-6 w-6 text-error" />
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Confirmar exclusão de foto
                                    </Dialog.Title>
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm text-gray-500">
                                        Tem certeza que deseja excluir esta
                                        foto? Esta ação não pode ser desfeita.
                                    </p>
                                </div>

                                <div className="flex justify-end space-x-3 mt-6">
                                    <CustomButton
                                        type="button"
                                        onClick={onClose}
                                        disabled={isLoading}
                                        color="bg-white"
                                        textColor="text-foreground"
                                        className="rounded-md border border-foreground text-sm text-gray-700 hover:bg-zinc-200"
                                    >
                                        Cancelar
                                    </CustomButton>
                                    <CustomButton
                                        type="button"
                                        onClick={onConfirm}
                                        disabled={isLoading}
                                        color="bg-error"
                                        icon={
                                            <Trash2Icon className="h-5 w-5" />
                                        }
                                        className={`rounded-md text-sm text-white hover:bg-red-900 ${
                                            isLoading && 'bg-zinc-400'
                                        }`}
                                    >
                                        {isLoading
                                            ? 'Excluindo...'
                                            : 'Excluir Foto'}
                                    </CustomButton>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
