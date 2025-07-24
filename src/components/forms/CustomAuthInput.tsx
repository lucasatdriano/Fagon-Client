'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon: React.ReactElement;
    registration?: UseFormRegisterReturn;
    error?: string;
    id: string;
    colorBg?: string;
    textColor?: string;
}

export function CustomAuthInput({
    type = 'text',
    label,
    icon,
    registration,
    error,
    id,
    colorBg = 'bg-primary',
    textColor = 'text-white',
    ...props
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [hasValue, setHasValue] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && !showPassword ? 'password' : 'text';

    return (
        <div className="relative w-full pt-2">
            <div
                className={`flex items-center border-b-2 px-2 py-2 rounded transition-all duration-200 ${colorBg} ${
                    error ? 'border-error' : 'border-background'
                }`}
            >
                <div className="w-full flex">
                    <div className={`mr-2 ${textColor}`}>{icon}</div>
                    <input
                        {...registration}
                        {...props}
                        type={inputType}
                        id={id}
                        onFocus={() => setIsFocused(true)}
                        onBlur={(e) => {
                            setIsFocused(false);
                            setHasValue(!!e.target.value);
                            registration?.onBlur?.(e);
                        }}
                        onChange={(e) => {
                            setHasValue(!!e.target.value);
                            registration?.onChange?.(e);
                        }}
                        className={`w-full bg-transparent outline-none placeholder-transparent ${textColor}`}
                        placeholder={label}
                    />
                    <label
                        htmlFor={id}
                        className={`
                            absolute left-0 transition-all duration-200 pointer-events-none ${textColor}
                            ${
                                isFocused || hasValue
                                    ? 'ms-8 -translate-y-5 text-sm text-white'
                                    : 'ms-12 translate-y-0 text-base text-gray-300'
                            }
                        `}
                    >
                        {label}
                    </label>
                </div>
                {isPassword && (
                    <button
                        title={
                            showPassword ? 'Esconder senha' : 'Mostrar senha'
                        }
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`ml-2 focus:outline-none ${textColor}`}
                    >
                        {showPassword ? (
                            <EyeOff size={20} />
                        ) : (
                            <Eye size={20} />
                        )}
                    </button>
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
