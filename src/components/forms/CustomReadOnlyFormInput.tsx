'use client';

interface CustomReadOnlyInputProps {
    label: string;
    icon: React.ReactElement;
    value: string;
    className?: string;
    textColor?: string;
    borderColor?: string;
}

export function CustomReadOnlyFormInput({
    label,
    icon,
    value,
    className = '',
    textColor = 'text-foreground',
    borderColor = 'border-gray-200',
}: CustomReadOnlyInputProps) {
    return (
        <div className={`w-full ${className}`}>
            <div
                className={`flex items-center border ${borderColor} px-3 py-2 rounded-md bg-transparent`}
            >
                <div className={`mr-2 ${textColor}`}>{icon}</div>
                <div className="flex-1 min-w-0">
                    <input
                        value={value}
                        readOnly
                        className={`w-full bg-transparent p-0 border-none ${textColor} truncate focus:outline-none`}
                        aria-label={label}
                    />
                </div>
            </div>
        </div>
    );
}
