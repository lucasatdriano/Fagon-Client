'use client';

import { useEffect, useState } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface BasicInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string | undefined;
    icon: React.ReactElement;
    registration?: UseFormRegisterReturn;
    colorBg?: string;
    textColor?: string;
    borderColor?: string;
    error?: string;
}

export function CustomFormInput({
    type = 'text',
    label,
    icon,
    defaultValue,
    value,
    registration,
    colorBg = 'bg-white',
    textColor = 'text-foreground',
    borderColor,
    error,
    disabled,
    required,
    maxLength,
    minLength,
    ...props
}: BasicInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    useEffect(() => {
        if (value !== undefined) {
            setHasValue(!!value);
        } else if (defaultValue !== undefined) {
            setHasValue(!!defaultValue);
        }
    }, [value, defaultValue]);

    const inputProps = registration
        ? { ...registration, ...props }
        : { ...props };

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
            isFocused || hasValue
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
                        {...inputProps}
                        type={type}
                        onFocus={() => setIsFocused(true)}
                        onBlur={(e) => {
                            setIsFocused(false);
                            setHasValue(!!e.target.value);
                            registration?.onBlur?.(e);
                        }}
                        onChange={(e) => {
                            setHasValue(!!e.target.value);
                            registration?.onChange?.(e);
                            props.onChange?.(e);
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
                <span className="text-error text-sm mt-1 block transition-all duration-200">
                    {error}
                </span>
            )}
        </div>
    );
}
