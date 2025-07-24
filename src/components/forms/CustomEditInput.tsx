'use client';

import { useState, useEffect } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';
import { dateMask, unformatDate } from '../../utils/masks/maskDate';
import { formatDateForDisplay } from '../../utils/formatters/formatDate';

interface CustomEditInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactElement;
    registration?: Partial<UseFormRegisterReturn>;
    error?: string;
    id: string;
    className?: string;
    textColor?: string;
    isDate?: boolean;
    inputRef?: React.Ref<HTMLInputElement>;
}

export function CustomEditInput({
    type = 'text',
    label,
    icon,
    registration,
    error,
    id,
    className = '',
    textColor = 'text-foreground',
    isDate = false,
    defaultValue = '',
    ...props
}: CustomEditInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const [displayValue, setDisplayValue] = useState('');

    useEffect(() => {
        if (isDate && defaultValue) {
            const formatted = formatDateForDisplay(defaultValue.toString());
            setDisplayValue(formatted);
            setHasValue(!!formatted);
        } else {
            setHasValue(!!defaultValue || !!props.value);
        }
    }, [defaultValue, isDate, props.value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isDate) {
            const maskedValue = dateMask(e.target.value);
            setDisplayValue(maskedValue);
            setHasValue(!!maskedValue);

            const unmaskedValue = unformatDate(maskedValue);
            e.target.value = unmaskedValue;
        } else {
            setHasValue(!!e.target.value);
        }

        registration?.onChange?.(e);
        props.onChange?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);

        if (isDate && displayValue) {
            const parts = displayValue.split('/');
            if (parts.length === 3) {
                const [day, month, year] = parts;
                if (
                    day.length === 2 &&
                    month.length === 2 &&
                    year.length === 4
                ) {
                    setDisplayValue(`${day}/${month}/${year}`);
                }
            }
        }

        registration?.onBlur?.(e);
    };

    return (
        <div className={`relative w-full ${className}`}>
            <div
                className={`flex items-center border-b-2 ${
                    error ? 'border-error' : 'border-gray-300'
                } transition-colors`}
            >
                {icon && <div className={`mr-2 ${textColor}`}>{icon}</div>}

                <div className="relative w-full pt-2">
                    {isDate ? (
                        <input
                            type="text"
                            {...props}
                            {...registration}
                            id={id}
                            value={displayValue}
                            onChange={handleChange}
                            onFocus={() => setIsFocused(true)}
                            onBlur={handleBlur}
                            className={`w-full bg-transparent outline-none placeholder-transparent pb-2 ${textColor}`}
                        />
                    ) : (
                        <input
                            type={type}
                            {...props}
                            {...registration}
                            id={id}
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
                        />
                    )}
                    <label
                        htmlFor={id}
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
