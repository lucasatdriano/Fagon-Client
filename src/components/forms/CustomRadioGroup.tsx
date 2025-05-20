'use client';

import { useState } from 'react';
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

    const handleChange = (optionId: string) => {
        const newValue = optionId;
        setInternalValue(newValue);

        const isOther = options.find(
            (opt) => opt.id === optionId,
        )?.isOtherOption;
        onChange?.(isOther ? otherValue : newValue);
    };

    const handleOtherValueChange = (value: string) => {
        setOtherValue(value);
        if (internalValue === options.find((opt) => opt.isOtherOption)?.id) {
            onChange?.(value);
        }
    };

    const getGridClasses = () => {
        if (gridCols === 'full') {
            return `grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`;
        }

        return `grid grid-cols-1 gap-4 ${className} ${
            gridCols === 2
                ? 'grid-cols-2'
                : gridCols === 3
                ? 'grid-cols-3'
                : gridCols === 4
                ? 'grid-cols-4'
                : ''
        }`;
    };

    const selected = selectedValue || internalValue;

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
                                checked={selected === option.id}
                                onChange={() => handleChange(option.id)}
                                className={`peer appearance-none h-4 w-4 rounded-full border ${borderColor} checked:${checkedBorderColor} bg-transparent checked:${checkedBgColor} cursor-pointer transition-all duration-150`}
                            />
                            <span
                                className={`absolute right-1 top-1 w-2 h-2 rounded-full ${dotColor} peer-checked:block hidden`}
                            />
                        </div>
                        <span className={textColor}>{option.label}</span>
                    </label>

                    {option.isOtherOption && selected === option.id && (
                        <div className="space-y-1 w-full">
                            <CustomFormInput
                                label={placeholder}
                                value={otherValue}
                                onChange={(e) =>
                                    handleOtherValueChange(e.target.value)
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
