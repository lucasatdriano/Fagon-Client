import { useState } from 'react';

interface RadioOption {
    id: string;
    label: string;
}

interface CustomRadioGroupProps {
    options: RadioOption[];
    selectedValue?: string;
    onChange?: (selectedId: string) => void;
    name: string;
    className?: string;
    orientation?: 'horizontal' | 'vertical';
}

export function CustomRadioGroup({
    options = [],
    selectedValue = '',
    onChange,
    name,
    className = '',
    orientation = 'vertical',
}: CustomRadioGroupProps) {
    const [internalValue, setInternalValue] = useState(selectedValue);

    const handleChange = (optionId: string) => {
        setInternalValue(optionId);
        onChange?.(optionId);
    };

    const selected = selectedValue || internalValue;

    return (
        <div
            className={`${className} ${
                orientation === 'horizontal' ? 'flex space-x-4' : 'space-y-2'
            }`}
        >
            {options.map((option) => (
                <label
                    key={option.id}
                    className="flex items-center space-x-2 cursor-pointer"
                >
                    <div className="relative flex items-center space-x-2 cursor-pointer">
                        <input
                            type="radio"
                            name={name}
                            value={option.id}
                            checked={selected === option.id}
                            onChange={() => handleChange(option.id)}
                            className="peer appearance-none h-4 w-4 rounded-full border-2 checked:border-white bg-transparent checked:bg-white cursor-pointer transition-all duration-150"
                        />
                        <span className="absolute right-1 top-1 w-2 h-2 rounded-full bg-primary-hover peer-checked:block hidden" />
                    </div>

                    <span className="text-white">{option.label}</span>
                </label>
            ))}
        </div>
    );
}
