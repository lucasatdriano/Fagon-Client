import { useState } from 'react';
import { CustomFormInput } from './CustomFormInput';
import { SquarePenIcon } from 'lucide-react';

interface CheckboxOption {
    id: string;
    label: string;
    checked?: boolean;
    isOtherOption?: boolean;
}

interface CheckboxGroupProps {
    options: CheckboxOption[];
    onChange?: (selectedOptions: string[]) => void;
    placeholder?: string;
    className?: string;
    gridCols?: number | 'full';
    color?: string;
}

export function CustomCheckboxGroup({
    options = [],
    onChange,
    placeholder,
    className = '',
    gridCols = 1,
    color = 'primary',
}: CheckboxGroupProps) {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
        options.reduce(
            (acc, option) => ({ ...acc, [option.id]: option.checked || false }),
            {},
        ),
    );
    const [otherValue, setOtherValue] = useState('');

    const handleChange = (optionId: string) => {
        const newCheckedItems = {
            ...checkedItems,
            [optionId]: !checkedItems[optionId],
        };
        setCheckedItems(newCheckedItems);

        const selected = Object.keys(newCheckedItems)
            .filter((key) => newCheckedItems[key])
            .map((key) => {
                if (options.find((o) => o.id === key)?.isOtherOption) {
                    return otherValue;
                }
                return key;
            });

        onChange?.(selected);
    };

    const handleOtherValueChange = (value: string) => {
        setOtherValue(value);

        const otherOption = options.find((o) => o.isOtherOption);
        if (otherOption && checkedItems[otherOption.id]) {
            const selected = Object.keys(checkedItems)
                .filter((key) => checkedItems[key])
                .map((key) => {
                    if (key === otherOption.id) {
                        return value;
                    }
                    return key;
                });
            onChange?.(selected);
        }
    };

    const getGridClasses = () => {
        if (gridCols === 'full') {
            return `grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`;
        }

        return `grid grid-cols-1 gap-4 ${className} ${
            gridCols === 2
                ? 'md:grid-cols-2'
                : gridCols === 3
                ? 'md:grid-cols-3'
                : gridCols === 4
                ? 'md:grid-cols-4'
                : ''
        }`;
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
                    <label className="flex items-center space-x-3 cursor-pointer">
                        <div
                            className={`relative w-5 h-5 rounded border-2 border-${color} flex items-center justify-center transition-colors ${
                                checkedItems[option.id]
                                    ? `bg-${color}`
                                    : 'bg-white'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={checkedItems[option.id] || false}
                                onChange={() => handleChange(option.id)}
                                className="absolute opacity-0 cursor-pointer w-full h-full"
                            />
                            {checkedItems[option.id] && (
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

                    {option.isOtherOption && checkedItems[option.id] && (
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
                            <p className="text-xs text-gray-500">
                                Se precisar inserir mais de um valor, separe por
                                vírgula.
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
