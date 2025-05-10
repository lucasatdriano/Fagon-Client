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
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    transition-all 
    font-medium 
    flex justify-center
    ${className}
  `;

    const variantClasses = ghost
        ? `bg-transparent ${textColor} underline border border-transparent hover:border-current hover:bg-opacity-10`
        : `${color} ${textColor} border border-transparent hover:opacity-90`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} text- ${variantClasses}`}
        >
            {icon && <span>{icon}</span>}
            {children}
        </button>
    );
}
