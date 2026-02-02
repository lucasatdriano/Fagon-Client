'use client';

import { CustomButton } from '../../../components/forms/CustomButton';
import { PdfTypes, PDF } from '../../../interfaces/pdf';
import { getPdfLabel } from '../../../utils/formatters/formatValues';
import { Dialog, Transition } from '@headlessui/react';
import { Trash2Icon } from 'lucide-react';
import { Fragment } from 'react';
import { toast } from 'sonner';

interface DeletePdfModalProps {
    pdfType: PdfTypes;
    pdfs: PDF[];
    setPdfs: (newPdfs: PDF[]) => void;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    isLoading?: boolean;
}

export function DeletePdfModal({
    pdfType,
    onClose,
    onConfirm,
    isLoading = false,
}: DeletePdfModalProps) {
    const handleDelete = async () => {
        try {
            await onConfirm();
            onClose();
        } catch {
            toast.error(`Erro ao deletar PDF ${getPdfLabel(pdfType)}`);
        }
    };

    return (
        <Transition appear show={true} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50"
                onClose={isLoading ? () => {} : onClose}
            >
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex items-center gap-3">
                                    <Trash2Icon className="h-8 w-8 text-error" />
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900"
                                    >
                                        Tem certeza que deseja deletar o PDF -{' '}
                                        {getPdfLabel(pdfType)}?
                                    </Dialog.Title>
                                </div>

                                <div className="mt-2">
                                    <p className="text-sm text-gray-500">
                                        Esta ação não pode ser desfeita. Todos
                                        os dados associados serão
                                        permanentemente removidos.
                                    </p>
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
                                        type="button"
                                        onClick={handleDelete}
                                        disabled={isLoading}
                                        color={
                                            isLoading
                                                ? 'bg-gray-400'
                                                : 'bg-error'
                                        }
                                        icon={
                                            <Trash2Icon className="h-5 w-5" />
                                        }
                                        className={`rounded-md text-sm text-white ${
                                            isLoading ? '' : 'hover:bg-red-900'
                                        }`}
                                    >
                                        {isLoading
                                            ? 'Deletando...'
                                            : 'Deletar PDF'}
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
