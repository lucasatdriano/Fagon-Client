'use client';

import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { ReactNode } from 'react';

type DropdownItem = {
    label: string;
    action?: (e: Event) => void;
    icon?: ReactNode;
    type?: 'normal' | 'custom';
    customContent?: ReactNode;
    className?: string;
    disabled?: boolean;
};

type DropdownProps = {
    trigger: ReactNode;
    items: DropdownItem[];
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    bg?: string;
    textColor?: string;
    hoverBg?: string;
    zIndex?: string;
    className?: string;
    onOpenChange?: (open: boolean) => void;
};

export function DropdownMenu({
    trigger,
    items,
    side = 'bottom',
    align = 'start',
    bg = 'bg-white',
    textColor = 'text-gray-800',
    hoverBg = 'hover:bg-gray-100',
    zIndex = 'z-50',
    className = '',
    onOpenChange,
}: DropdownProps) {
    const handleItemClick = (e: Event, action?: (e: Event) => void) => {
        e.preventDefault();
        action?.(e);
    };

    return (
        <Dropdown.Root modal={false} onOpenChange={onOpenChange}>
            <Dropdown.Trigger asChild>{trigger}</Dropdown.Trigger>

            <Dropdown.Portal>
                <Dropdown.Content
                    side={side}
                    align={align}
                    sideOffset={8}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    className={`
                        min-w-[220px] rounded-md shadow-lg border border-gray-200 p-1 ${zIndex}
                        ${bg} ${textColor} ${className}
                    `}
                >
                    {items.map((item, index) => (
                        <div key={index} className="mb-1 last:mb-0">
                            {item.type === 'custom' ? (
                                <div className="p-1">{item.customContent}</div>
                            ) : (
                                <Dropdown.Item
                                    onSelect={(e) => e.preventDefault()}
                                    onClick={(e) =>
                                        handleItemClick(
                                            e as unknown as Event,
                                            item.action,
                                        )
                                    }
                                    disabled={item.disabled}
                                    className={`
                                        flex items-center gap-2 px-2 py-1.5 rounded-md w-full cursor-pointer outline-none border-1 border-transparent hover:border-gray-300                                        ${
                                            item.disabled
                                                ? 'opacity-50 cursor-not-allowed'
                                                : hoverBg
                                        }
                                        ${item.className}
                                    `}
                                >
                                    {item.icon && (
                                        <span className="flex-shrink-0">
                                            {item.icon}
                                        </span>
                                    )}
                                    <span className="flex-1 text-left">
                                        {item.label}
                                    </span>
                                </Dropdown.Item>
                            )}
                        </div>
                    ))}
                </Dropdown.Content>
            </Dropdown.Portal>
        </Dropdown.Root>
    );
}
