'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { CustomButton } from '../forms/CustomButton';
import { CustomRadioGroup } from '../forms/CustomRadioGroup';
import { locationOptions, locationType } from '@/constants';

type LocationModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function LocationModal({ isOpen, onClose }: LocationModalProps) {
    const [tipoLocal, setTipoLocal] = useState('');
    const [recurso, setRecurso] = useState('');

    // const tiposLocais = ['Local Externo', 'Local Interno'];
    // const recursos = [
    //     'Auto-Ascrutamento',
    //     'Egora-Ascrutamento',
    //     'Aventamento',
    //     'SMS Online',
    //     'Gerencia',
    //     'Capa',
    //     'Outro',
    // ];

    function resetForm() {
        setTipoLocal('');
        setRecurso('');
    }

    // function handleRecursoChange(value: string) {
    //     setRecurso(value);
    //     setShowOutroRecurso(value === 'Outro');
    //     if (value !== 'Outro') setOutroRecurso('');
    // }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        console.log({
            tipoLocal,
            recurso,
        });

        resetForm();
        onClose();
    }

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
                            <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                <Dialog.Title
                                    as="h2"
                                    className="text-xl font-bold leading-6 text-gray-900 border-b pb-2"
                                >
                                    Adicionar Local
                                </Dialog.Title>

                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-4 space-y-6"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Tipo do local
                                        </p>
                                        <div className="space-y-2">
                                            {/* {tiposLocais.map((tipo) => (
                                                <div
                                                    key={tipo}
                                                    className="flex items-center"
                                                >
                                                    <input
                                                        id={`tipo-${tipo}`}
                                                        name="tipo-local"
                                                        type="radio"
                                                        checked={
                                                            tipoLocal === tipo
                                                        }
                                                        onChange={() =>
                                                            setTipoLocal(tipo)
                                                        }
                                                        className="h-4 w-4 text-green-600"
                                                    />
                                                    <label
                                                        htmlFor={`tipo-${tipo}`}
                                                        className="ml-2 text-sm text-gray-700"
                                                    >
                                                        {tipo}
                                                    </label>
                                                </div>
                                            ))} */}
                                            <CustomRadioGroup
                                                name="location type"
                                                options={locationType}
                                                gridCols={2}
                                                borderColor="border-foreground"
                                                textColor="text-foreground"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-700 mb-2">
                                            Local
                                        </p>
                                        <div className="space-y-2">
                                            {/* {recursos.map((item) => (
                                                <div
                                                    key={item}
                                                    className="flex items-center"
                                                >
                                                    <input
                                                        id={`recurso-${item}`}
                                                        name="recurso"
                                                        type="radio"
                                                        checked={
                                                            recurso === item
                                                        }
                                                        onChange={() =>
                                                            handleRecursoChange(
                                                                item,
                                                            )
                                                        }
                                                        className="h-4 w-4 text-green-600"
                                                    />
                                                    <label
                                                        htmlFor={`recurso-${item}`}
                                                        className="ml-2 text-sm text-gray-700"
                                                    >
                                                        {item}
                                                    </label>
                                                </div>
                                            ))} */}
                                            <CustomRadioGroup
                                                name="location"
                                                placeholder="Digite o Local"
                                                options={locationOptions}
                                                gridCols={2}
                                                borderColor="border-foreground"
                                                textColor="text-foreground"
                                                className="text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-center space-x-3 pt-4 border-t">
                                        <CustomButton type="submit">
                                            Criar Local
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
