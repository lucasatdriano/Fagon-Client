'use client';

import { useState } from 'react';

interface BasicInputProps {
    type?: 'text' | 'email' | 'number';
    label: string;
    icon: React.ReactElement;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    colorBg?: string;
    textColor?: string;
    borderColor?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    maxLength?: number;
    minLength?: number;
}

export default function CustomFormInput({
    type = 'text',
    label,
    icon,
    value,
    onChange,
    onBlur,
    colorBg = 'bg-white',
    textColor = 'text-foreground',
    borderColor,
    error,
    disabled,
    required,
    maxLength,
    minLength,
}: BasicInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    const containerClasses = `
        flex items-center border-2 ${borderColor} px-4 py-2 md:py-3 rounded-lg transition-all duration-200 
        ${colorBg} 
        ${disabled ? 'bg-gray-200/90 border-gray-100 cursor-not-allowed' : ''}
    `;

    const inputClasses = `
        w-full bg-transparent outline-none placeholder-transparent 
        ${textColor}
        ${disabled ? 'cursor-not-allowed' : ''}
    `;

    const labelClasses = `
        absolute left-0 transition-all duration-200 pointer-events-none 
        ${textColor} 
        ${
            isFocused || value !== ''
                ? '-top-1/4 opacity-0'
                : 'top-1/2 -translate-y-1/2 text-base text-gray-400'
        }
    `;

    return (
        <div className="w-full">
            <div className={containerClasses}>
                <div className={`mr-3 ${textColor}`}>{icon}</div>
                <div className="w-full relative">
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={(e) => {
                            setIsFocused(value !== '');
                            onBlur?.(e);
                        }}
                        className={inputClasses}
                        placeholder={label}
                        disabled={disabled}
                        required={required}
                        maxLength={maxLength}
                        minLength={minLength}
                    />
                    <label className={labelClasses}>{label}</label>
                </div>
            </div>
            {error && (
                <span className="text-red-500 text-sm mt-1 block transition-all duration-200">
                    {error}
                </span>
            )}
        </div>
    );
}
