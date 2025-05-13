import { useState } from 'react';

interface CheckboxOption {
    id: string;
    label: string;
    checked?: boolean;
}

interface CheckboxGroupProps {
    options: CheckboxOption[];
    onChange?: (selectedOptions: string[]) => void;
    className?: string;
    orientation?: 'horizontal' | 'vertical';
    color?: string;
}

export function CheckboxGroup({
    options = [],
    onChange,
    className = '',
    orientation = 'vertical',
    color = 'primary',
}: CheckboxGroupProps) {
    const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
        options.reduce(
            (acc, option) => ({ ...acc, [option.id]: option.checked || false }),
            {},
        ),
    );

    const handleChange = (optionId: string) => {
        const newCheckedItems = {
            ...checkedItems,
            [optionId]: !checkedItems[optionId],
        };
        setCheckedItems(newCheckedItems);

        const selected = Object.keys(newCheckedItems).filter(
            (key) => newCheckedItems[key],
        );
        onChange?.(selected);
    };

    return (
        <div
            className={`${className} ${
                orientation === 'horizontal'
                    ? 'flex flex-wrap gap-4'
                    : 'space-y-2'
            }`}
        >
            {options.map((option) => (
                <label
                    key={option.id}
                    className="flex items-center space-x-3 cursor-pointer"
                >
                    <div
                        className={`relative w-5 h-5 rounded border-2 border-${color} flex items-center justify-center transition-colors ${
                            checkedItems[option.id] ? `bg-${color}` : 'bg-white'
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
            ))}
        </div>
    );
}
