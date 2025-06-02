'use client';

import { useState, useEffect } from 'react';
import { CustomFormInput } from './CustomFormInput';
import { SquarePenIcon } from 'lucide-react';

interface RadioOption {
    id: string;
    value: string;
    label: string;
    bg?: string;
    text?: string;
    isOtherOption?: boolean;
}

interface CustomRadioGroupProps {
    options: RadioOption[];
    selectedValue?: string;
    onChange?: (selectedValue: string) => void;
    name: string;
    placeholder?: string;
    className?: string;
    gridCols?: number | 'full';
    textColor?: string;
    borderColor?: string;
    checkedBorderColor?: string;
    checkedBgColor?: string;
    dotColor?: string;
}

export function CustomRadioGroup({
    options = [],
    selectedValue = '',
    onChange,
    name,
    placeholder,
    className = '',
    gridCols = 1,
    textColor = 'text-foreground',
    borderColor = 'border-foreground',
    checkedBorderColor = 'border-white',
    checkedBgColor = 'bg-white',
    dotColor = 'bg-primary',
}: CustomRadioGroupProps) {
    const [internalValue, setInternalValue] = useState(selectedValue);
    const [otherValue, setOtherValue] = useState('');
    const otherOption = options.find((opt) => opt.isOtherOption);

    useEffect(() => {
        if (selectedValue) {
            const matchingOption = options.find(
                (opt) => opt.value === selectedValue,
            );
            if (matchingOption) {
                setInternalValue(matchingOption.id);
                setOtherValue('');
            } else if (otherOption) {
                setInternalValue(otherOption.id);
                setOtherValue(selectedValue);
            }
        }
    }, [selectedValue, options, otherOption]);

    const handleOptionChange = (optionId: string) => {
        const option = options.find((opt) => opt.id === optionId);
        setInternalValue(optionId);

        if (option?.isOtherOption) {
            onChange?.(otherValue);
        } else {
            onChange?.(option?.value || '');
        }
    };

    const handleOtherInputChange = (value: string) => {
        setOtherValue(value);
        if (internalValue === otherOption?.id) {
            onChange?.(value);
        }
    };

    const getGridClasses = () => {
        if (gridCols === 'full') {
            return `grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`;
        }
        return `grid grid-cols-${gridCols} gap-4 ${className}`;
    };

    return (
        <div className={getGridClasses()}>
            {options.map((option) => (
                <div
                    key={option.id}
                    className={`space-y-2 ${
                        option.isOtherOption ? 'col-span-full' : ''
                    }`}
                >
                    <label
                        className={`flex items-center space-x-2 cursor-pointer ${textColor}`}
                    >
                        <div className="relative flex items-center space-x-2 cursor-pointer">
                            <input
                                type="radio"
                                name={name}
                                value={option.id}
                                checked={internalValue === option.id}
                                onChange={() => handleOptionChange(option.id)}
                                className={`peer appearance-none h-4 w-4 rounded-full border ${borderColor} checked:${checkedBorderColor} bg-transparent checked:${checkedBgColor} cursor-pointer transition-all duration-150`}
                            />
                            <span
                                className={`absolute right-1 top-1 w-2 h-2 rounded-full ${dotColor} peer-checked:block hidden`}
                            />
                        </div>
                        <span className={textColor}>{option.label}</span>
                    </label>

                    {option.isOtherOption && internalValue === option.id && (
                        <div className="space-y-1 w-full mt-2">
                            <CustomFormInput
                                label={placeholder}
                                value={otherValue}
                                onChange={(e) =>
                                    handleOtherInputChange(e.target.value)
                                }
                                icon={<SquarePenIcon />}
                                borderColor="border-gray-300"
                                required
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
