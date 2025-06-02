import { useEffect, useId, useState } from 'react';
import { CustomFormInput } from './CustomFormInput';
import { SquarePenIcon } from 'lucide-react';
import { UseFormRegisterReturn } from 'react-hook-form';

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
    registration?: UseFormRegisterReturn;
    name: string;
    error?: string;
}

export function CustomCheckboxGroup({
    options = [],
    onChange,
    placeholder,
    className = '',
    gridCols = 1,
    color = 'primary',
    registration,
    name,
    error,
}: CheckboxGroupProps) {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
        options.reduce(
            (acc, option) => ({ ...acc, [option.id]: option.checked || false }),
            {},
        ),
    );
    const [otherValue, setOtherValue] = useState('');
    const groupId = useId();

    const updateSelectedOptions = (
        items: Record<string, boolean>,
        value: string,
    ) => {
        const selected = Object.keys(items)
            .filter((key) => items[key])
            .map((key) => {
                const option = options.find((o) => o.id === key);
                return option?.isOtherOption ? value : key;
            })
            .filter(Boolean);

        onChange?.(selected);

        if (registration?.onChange) {
            const event = {
                target: {
                    name,
                    value: selected,
                },
            };
            registration.onChange(event);
        }
    };

    const handleChange = (optionId: string) => {
        const newCheckedItems = {
            ...checkedItems,
            [optionId]: !checkedItems[optionId],
        };
        setCheckedItems(newCheckedItems);
        updateSelectedOptions(newCheckedItems, otherValue);
    };

    const handleOtherValueChange = (value: string) => {
        setOtherValue(value);
        const otherOption = options.find((o) => o.isOtherOption);
        if (otherOption && checkedItems[otherOption.id]) {
            updateSelectedOptions(checkedItems, value);
        }
    };

    const getGridClasses = () => {
        if (gridCols === 'full') {
            return `grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`;
        }
        return `grid grid-cols-${gridCols} gap-4 ${className}`;
    };

    useEffect(() => {
        if (registration?.value) {
            const initialChecked = options.reduce((acc, option) => {
                const isChecked =
                    registration.value.includes(option.id) ||
                    (option.isOtherOption &&
                        registration.value.some(
                            (v: string) => v !== option.id && v !== '',
                        ));
                return { ...acc, [option.id]: isChecked };
            }, {});

            setCheckedItems(initialChecked);

            const otherOption = options.find((o) => o.isOtherOption);
            if (otherOption) {
                const otherValue = registration.value.find(
                    (v: string) => v !== otherOption.id && v !== '',
                );
                if (otherValue) setOtherValue(otherValue);
            }
        }
    }, [registration?.value, options]);

    return (
        <div>
            <div className={getGridClasses()}>
                {options.map((option) => (
                    <div
                        key={option.id}
                        className={option.isOtherOption ? 'col-span-full' : ''}
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
                                    name={`${name}.${option.id}`}
                                    id={`${groupId}-${option.id}`}
                                    ref={registration?.ref}
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
                            <div className="space-y-1 w-full mt-2 ml-8">
                                <CustomFormInput
                                    label={placeholder}
                                    value={otherValue}
                                    onChange={(e) =>
                                        handleOtherValueChange(e.target.value)
                                    }
                                    icon={<SquarePenIcon />}
                                    borderColor="border-gray-300"
                                    required
                                    registration={{
                                        ...registration,
                                        name: `${name}.otherValue`,
                                        onChange: (e) =>
                                            handleOtherValueChange(
                                                e.target.value,
                                            ),
                                    }}
                                />
                                <p className="text-xs text-gray-500">
                                    Se precisar inserir mais de um valor, separe
                                    por vírgula.
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            {error && <p className="mt-2 text-sm text-error">{error}</p>}
        </div>
    );
}
