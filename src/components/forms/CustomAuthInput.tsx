'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps {
    type?: 'text' | 'email' | 'password';
    label: string;
    icon: React.ReactElement;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    colorBg?: string;
    textColor?: string;
    error?: string;
    required?: boolean;
}

export default function CustomAuthInput({
    type = 'text',
    label,
    icon,
    value,
    onChange,
    colorBg = 'bg-primary',
    textColor = 'text-white',
    error,
    required,
}: InputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword && !showPassword ? 'password' : 'text';

    return (
        <div className="relative w-full pt-2">
            <div
                className={`flex items-center border-b-2 border-background px-2 py-3 rounded transition-all duration-200 ${colorBg}`}
            >
                <div className="w-full flex">
                    <div className={`mr-2 ${textColor}`}>{icon}</div>
                    <input
                        type={inputType}
                        value={value}
                        onChange={onChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(value !== '')}
                        className={`w-full bg-transparent outline-none placeholder-transparent ${textColor}`}
                        placeholder={label}
                        required={required}
                    />
                    <label
                        className={`
                            absolute left-0 transition-all duration-200 pointer-events-none ${textColor}
                            ${
                                isFocused || value !== ''
                                    ? 'ms-8 top-0 text-sm text-white'
                                    : 'ms-12  top-1/2 -translate-y-1/3 text-base text-gray-300'
                            }
                        `}
                    >
                        {label}
                    </label>
                </div>
                {isPassword && (
                    <button
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
                <span className="text-red-500 text-sm mt-1 block transition-all duration-200">
                    {error}
                </span>
            )}
        </div>
    );
}
