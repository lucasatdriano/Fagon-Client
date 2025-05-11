'use client';

import { useState } from 'react';

interface BasicInputProps {
    type?: 'text' | 'email';
    label: string;
    icon: React.ReactElement;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    colorBg?: string;
    textColor?: string;
    error?: string;
    required?: boolean;
}

export default function CustomFormInput({
    type = 'text',
    label,
    icon,
    value,
    onChange,
    colorBg = 'bg-background',
    textColor = 'text-foreground',
    error,
    required,
}: BasicInputProps) {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <div className="relative w-full">
            <div
                className={`flex items-center border-2 border-foreground px-4 py-2 md:py-3 rounded-2xl transition-all duration-200 ${colorBg}`}
            >
                <div className={`mr-3 ${textColor}`}>{icon}</div>
                <div className="w-full">
                    <input
                        type={type}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(value !== '')}
                        className={`w-full md:text-lg bg-transparent outline-none placeholder-transparent ${textColor}`}
                        placeholder={label}
                        required={required}
                    />
                    <label
                        className={`
                            absolute left-0 transition-all duration-200 pointer-events-none ${textColor}
                            ${
                                isFocused || value !== ''
                                    ? 'ms-12 top-1/5 opacity-0'
                                    : 'ms-12 top-1/2 -translate-y-1/2 text-base text-gray-300'
                            }
                        `}
                    >
                        {label}
                    </label>
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
