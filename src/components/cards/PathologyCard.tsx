'use client';
import { PathologyProps } from '@/interfaces/pathology';
import { OctagonAlertIcon } from 'lucide-react';

export function PathologyCard({ title, location }: PathologyProps) {
    return (
        <div className="bg-white cursor-pointer border w-full rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div>
                            <OctagonAlertIcon className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg">{title}</h3>
                    </div>
                    <div className="flex gap-2 mt-1">
                        <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded">
                            Local: {location}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
