import React from 'react';

interface CustomButtonProps {
    type?: 'button' | 'submit' | 'reset';
    children: React.ReactNode;
    onClick?: () => void;
    fontSize?: string;
    color?: string;
    textColor?: string;
    rounded?: string;
    disabled?: boolean;
    ghost?: boolean;
    icon?: React.ReactElement;
    className?: string;
}

export function CustomButton({
    children,
    onClick,
    type = 'button',
    fontSize = 'text-base',
    color = 'bg-secondary',
    textColor = 'text-white',
    rounded = 'rounded-md',
    disabled = false,
    ghost = false,
    icon,
    className = '',
}: CustomButtonProps) {
    const baseClasses = `
        px-4 py-2 
        ${rounded}
        ${fontSize}
        ${
            disabled
                ? 'opacity-70 cursor-not-allowed'
                : 'cursor-pointer hover:shadow-md'
        }
        transition-all 
        font-medium
        gap-2
        items-center 
        flex justify-center
        ${className}
    `;

    const variantClasses = ghost
        ? `bg-transparent ${textColor} underline ${
              disabled
                  ? 'border border-gray-300'
                  : 'border border-transparent hover:border-current'
          }`
        : `${color} ${textColor} ${disabled ? 'border border-gray-300' : ''}`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses}`}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
}
