'use client';

import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { ReactNode } from 'react';

type Item = {
    label: string;
    action: () => void;
    icon?: ReactNode;
};

type DropdownProps = {
    trigger: ReactNode;
    items: Item[];
    side?: 'top' | 'right' | 'bottom' | 'left';
    bg?: string;
    textColor?: string;
    hoverBg?: string;
    zIndex?: string;
    className?: string;
};

export const DropdownMenu = ({
    trigger,
    items,
    side = 'bottom',
    bg = 'bg-white',
    textColor = 'text-gray-800',
    hoverBg = 'hover:bg-gray-50',
    zIndex = '',
    className = '',
}: DropdownProps) => {
    return (
        <Dropdown.Root modal={false}>
            <Dropdown.Trigger asChild>{trigger}</Dropdown.Trigger>

            <Dropdown.Portal>
                <Dropdown.Content
                    side={side}
                    className={`
              min-w-[120px] right-12 rounded-md shadow-lg border p-1 ${zIndex}
              ${bg} ${textColor} ${className}
            `}
                >
                    {items.map((item, index) => (
                        <Dropdown.Item
                            key={index}
                            onClick={item.action}
                            className={`
                  px-2 py-1.5 text-sm cursor-pointer flex items-center gap-2
                  ${textColor} ${hoverBg}
                `}
                        >
                            {item.icon && <span>{item.icon}</span>}
                            {item.label}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Content>
            </Dropdown.Portal>
        </Dropdown.Root>
    );
};
