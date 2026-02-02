import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

export interface DropdownOption {
    id: string;
    value: string;
    label: string;
}

interface CustomDropdownInputProps {
    options: DropdownOption[];
    selectedOptionValue?: string | null;
    onOptionSelected?: (optionId: string | null) => void;
    placeholder?: string;
    className?: string;
    icon?: React.ReactElement;
    error?: string;
}

export function CustomDropdownInput({
    options = [],
    selectedOptionValue = null,
    onOptionSelected,
    placeholder = 'Selecione uma opção',
    className = '',
    icon,
    error,
}: CustomDropdownInputProps) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleOptionSelect = (option: DropdownOption) => {
        const newSelectedValue =
            option.value === selectedOptionValue ? null : option.value;
        onOptionSelected?.(newSelectedValue);
        setIsOpen(false);
    };

    const selectedOption = options.find(
        (opt) => opt.value === selectedOptionValue,
    );

    return (
        <div className={`w-full mx-auto ${className}`}>
            <div className="relative">
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="w-full px-4 py-3 text-left border-2 border-gray-200 rounded-lg shadow-sm bg-white focus:outline-none flex justify-between items-center"
                >
                    <span className="flex items-center gap-2">
                        {icon && <span>{icon}</span>}
                        <span
                            className={
                                selectedOption
                                    ? 'text-gray-700'
                                    : 'text-gray-400'
                            }
                        >
                            {selectedOption
                                ? selectedOption.label
                                : placeholder}
                        </span>
                    </span>
                    {isOpen ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    )}
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 border-1 border-black border-opacity-5 focus:outline-none max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <div key={option.id}>
                                <div
                                    className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    <span>{option.label}</span>
                                    {selectedOptionValue === option.value && (
                                        <CheckIcon className="h-4 w-4 text-primary" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {error && (
                <span className="text-error text-sm mt-1 block transition-all duration-200">
                    {error}
                </span>
            )}
        </div>
    );
}
