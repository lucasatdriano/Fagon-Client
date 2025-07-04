'use client';

import { useEffect, useState } from 'react';
import { CustomFormInput } from './CustomFormInput';
import { SquarePenIcon } from 'lucide-react';

interface CheckboxOption {
    value: string;
    label: string;
    isOtherOption?: boolean;
}

interface CheckboxGroupProps {
    options: CheckboxOption[];
    onChange?: (selectedOptions: string[]) => void;
    selectedValues?: string[];
    placeholder?: string;
    className?: string;
    gridCols?: number | 'full';
    color?: string;
    name: string;
    error?: string;
}

export function CustomCheckboxGroup({
    options = [],
    onChange,
    selectedValues = [],
    placeholder = 'Especifique',
    className = '',
    gridCols = 1,
    color = 'primary',
    error,
    name,
}: CheckboxGroupProps) {
    const [internalSelected, setInternalSelected] = useState<string[]>(
        selectedValues || [],
    );
    const [otherValue, setOtherValue] = useState(() => {
        if (!selectedValues) return '';
        const nonStandard = selectedValues.filter(
            (val) =>
                !options.some((opt) => opt.value === val && !opt.isOtherOption),
        );
        return nonStandard.join(', ');
    });
    const otherOption = options.find((o) => o.isOtherOption);

    useEffect(() => {
        if (!selectedValues?.length) {
            setInternalSelected([]);
            setOtherValue('');
            return;
        }

        const standardOptions = options
            .filter((opt) => !opt.isOtherOption)
            .map((opt) => opt.value);

        const standardValues = selectedValues.filter((val) =>
            standardOptions.includes(val),
        );

        const nonStandardValues = selectedValues.filter(
            (val) => !standardOptions.includes(val),
        );

        setInternalSelected(standardValues);
        setOtherValue(nonStandardValues.join(', '));
    }, [selectedValues, options]);

    const handleCheckboxChange = (value: string) => {
        console.log('Checkbox alterado:', value);
        let newSelected: string[];

        if (internalSelected.includes(value)) {
            newSelected = internalSelected.filter((v) => v !== value);
            console.log('Desmarcando checkbox:', value);

            if (otherOption?.value === value) {
                console.log(
                    'Limpando otherValue (checkbox "Outro" desmarcado)',
                );
                setOtherValue('');
            }
        } else {
            newSelected = [...internalSelected, value];
            console.log('Marcando checkbox:', value);
        }

        updateSelection(newSelected);
    };

    const handleOtherValueChange = (value: string) => {
        console.log('Input "Outro" alterado para:', value);
        setOtherValue(value);

        const newSelected = internalSelected
            .filter((v) => v !== otherOption?.value)
            .concat(value ? [value] : []);

        updateSelection(newSelected);
    };

    const updateSelection = (newSelected: string[]) => {
        console.log('Atualizando seleção com:', newSelected);

        const standardOptions = options
            .filter((opt) => !opt.isOtherOption)
            .map((opt) => opt.value);

        const standardValues = newSelected.filter((val) =>
            standardOptions.includes(val),
        );

        const nonStandardValues = newSelected.filter(
            (val) =>
                !standardOptions.includes(val) && val !== otherOption?.value,
        );

        console.log('Valores padrão filtrados:', standardValues);
        console.log('Valores não-padrão filtrados:', nonStandardValues);

        const finalSelected = [
            ...standardValues,
            ...(nonStandardValues.length > 0 ? nonStandardValues : []),
        ];

        console.log('Estado final a ser enviado:', finalSelected);

        setInternalSelected(standardValues);
        setOtherValue(nonStandardValues.join(', '));
        onChange?.(finalSelected);
    };

    const getGridClasses = () => {
        if (gridCols === 'full') {
            return 'grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4';
        }
        return `grid grid-cols-${gridCols} gap-4`;
    };

    console.log('Estado interno (internalSelected):', internalSelected);
    console.log('Valor otherValue:', otherValue);

    return (
        <div className={className}>
            <div className={getGridClasses()}>
                {options.map((option) => (
                    <div
                        key={option.value}
                        className={option.isOtherOption ? 'col-span-full' : ''}
                    >
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <div
                                className={`relative w-5 h-5 rounded border-2 border-${color} flex items-center justify-center transition-colors ${
                                    internalSelected.includes(option.value) ||
                                    (option.isOtherOption && otherValue)
                                        ? `bg-${color}`
                                        : 'bg-white'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    name={name}
                                    checked={
                                        Array.isArray(internalSelected) &&
                                        (internalSelected.includes(
                                            option.value,
                                        ) ||
                                            (option.isOtherOption &&
                                                !!otherValue))
                                    }
                                    onChange={() =>
                                        handleCheckboxChange(option.value)
                                    }
                                    className="absolute opacity-0 cursor-pointer w-full h-full"
                                />
                                {(internalSelected.includes(option.value) ||
                                    (option.isOtherOption && !!otherValue)) && (
                                    <svg
                                        className="w-3 h-3 text-white"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </div>
                            <span className="text-gray-700 select-none">
                                {option.label}
                            </span>
                        </label>

                        {option.isOtherOption && (
                            <div
                                className={`transition-all duration-200 overflow-hidden ${
                                    internalSelected.includes(option.value) ||
                                    otherValue
                                        ? 'max-h-96 mt-2 ml-8'
                                        : 'max-h-0'
                                }`}
                            >
                                <div className="space-y-1 w-full">
                                    <CustomFormInput
                                        label={placeholder}
                                        value={otherValue}
                                        onChange={(e) => {
                                            const newValue = e.target.value;
                                            setOtherValue(newValue);
                                            handleOtherValueChange(newValue);
                                        }}
                                        icon={<SquarePenIcon />}
                                        borderColor="border-gray-300"
                                        key={`other-input-${otherValue}`}
                                    />
                                    <p className="text-xs text-gray-500">
                                        Se precisar inserir mais de um valor,
                                        separe por vírgula.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {error && <p className="mt-2 text-sm text-error">{error}</p>}
        </div>
    );
}
