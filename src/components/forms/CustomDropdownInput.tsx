import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useState } from 'react';

interface DropdownOption {
    value: string;
    label: string;
}

interface CustomDropdownInputProps {
    options: DropdownOption[];
    selectedOptionValue?: string | null;
    onOptionSelected?: (optionId: string | null) => void;
    placeholder?: string;
    className?: string;
}

export function CustomDropdownInput({
    options = [],
    selectedOptionValue = null,
    onOptionSelected,
    placeholder = 'Selecione uma opção',
    className = '',
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
        <div className={`w-full max-w-md mx-auto ${className}`}>
            <div className="relative">
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="w-full px-4 py-3 text-left border border-gray-300 rounded-md shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary flex justify-between items-center"
                >
                    <span className="text-gray-700">
                        {selectedOption ? selectedOption.label : placeholder}
                    </span>
                    {isOpen ? (
                        <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                    ) : (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                    )}
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md py-1 ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto">
                        {options.map((option) => (
                            <div key={option.value}>
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
        </div>
    );
}
