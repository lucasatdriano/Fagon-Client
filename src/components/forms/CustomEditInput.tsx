'use client';

import { useState, useEffect } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface CustomEditInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactElement;
    registration?: UseFormRegisterReturn;
    error?: string;
    className?: string;
    textColor?: string;
    defaultHasValue?: boolean;
}

export function CustomEditInput({
    type = 'text',
    label,
    icon,
    registration,
    error,
    className = '',
    defaultValue = '',
    textColor = 'text-white',
    defaultHasValue = false,
    ...props
}: CustomEditInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!defaultValue || defaultHasValue);

    useEffect(() => {
        if (registration?.name && registration?.ref) {
            const input = registration.ref as unknown as HTMLInputElement;
            setHasValue(!!input?.value || !!defaultValue);
        } else {
            setHasValue(!!defaultValue);
        }
    }, [defaultValue, registration]);

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
                        {...registration}
                        {...props}
                        type={type}
                        defaultValue={defaultValue}
                        onFocus={() => setIsFocused(true)}
                        onBlur={(e) => {
                            setIsFocused(false);
                            registration?.onBlur?.(e);
                        }}
                        onChange={(e) => {
                            setHasValue(!!e.target.value);
                            registration?.onChange?.(e);
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
