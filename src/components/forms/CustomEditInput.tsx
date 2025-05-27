'use client';

import { useState, useEffect } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface CustomEditInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactElement;
    registration?: Partial<UseFormRegisterReturn>; // Alterado para Partial
    error?: string;
    className?: string;
    textColor?: string;
}

export function CustomEditInput({
    type = 'text',
    label,
    icon,
    registration,
    error,
    className = '',
    textColor = 'text-white',
    ...props
}: CustomEditInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const { defaultValue, ...inputProps } = props;

    useEffect(() => {
        setHasValue(!!defaultValue || !!props.value);
    }, [defaultValue, props.value]);

    return (
        <div className={`relative w-full ${className}`}>
            <div
                className={`flex items-center border-b-2 ${
                    error ? 'border-error' : 'border-gray-300'
                } transition-colors`}
            >
                {icon && <div className={`mr-2 ${textColor}`}>{icon}</div>}

                <div className="relative w-full pt-2">
                    <input
                        type={type}
                        {...inputProps}
                        {...registration}
                        onFocus={() => setIsFocused(true)}
                        onBlur={(e) => {
                            setIsFocused(false);
                            registration?.onBlur?.(e);
                        }}
                        onChange={(e) => {
                            setHasValue(!!e.target.value);
                            registration?.onChange?.(e);
                            props.onChange?.(e);
                        }}
                        className={`w-full bg-transparent outline-none placeholder-transparent pb-2 ${textColor}`}
                        placeholder={label}
                    />
                    <label
                        className={`absolute left-0 top-0 transition-all duration-200 pointer-events-none ${
                            isFocused || hasValue
                                ? 'text-sm -translate-y-4 -translate-x-4'
                                : 'text-base translate-y-2'
                        } ${textColor}`}
                    >
                        {label}:
                    </label>
                </div>
            </div>

            {error && (
                <span className="text-error text-xs mt-1 block">{error}</span>
            )}
        </div>
    );
}
