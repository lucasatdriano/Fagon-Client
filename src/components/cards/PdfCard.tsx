'use client';

import { useState } from 'react';
import { PDF, PdfType } from '@/interfaces/pdf';
import { BadgeCheckIcon, MoreVerticalIcon } from 'lucide-react';

const PDF_TITLES: Record<PdfType, string> = {
    atestado: 'Atestado de Emprego dos Materiais de Acabamento e Revestimento',
    anexo_m3:
        'Anexo M.3 - Laudo Técnico de Segurança Estrutural em Situação de Incêndio',
    anexo_m4:
        'Anexo M.4 - Laudo Técnico de Controle de Materiais de Acabamento e Revestimento',
    laudo_avaliacao:
        'Laudo de Avaliação de Estabilidade e Segurança de Construção',
    relatorio_fotografico:
        'Relatório Fotográfico - Avaliação de Estabilidade e Segurança de Construção',
};

interface PDFGeneratorProps {
    projectId: string;
    initialPDFs: PDF[];
    onGenerate: (type: PdfType) => Promise<{ path: string }>;
    onView: (path: string) => void;
    onPreview: (type: PdfType) => void;
    onMenuAction: (type: PdfType, action: string) => void;
}

export function PdfCard({
    projectId,
    initialPDFs,
    onGenerate,
    onView,
    onPreview,
    onMenuAction,
}: PDFGeneratorProps) {
    const [pdfs, setPdfs] = useState<PDF[]>(initialPDFs);
    const [generating, setGenerating] = useState<PdfType | null>(null);

    const handleGenerate = async (type: PdfType) => {
        setGenerating(type);
        try {
            const result = await onGenerate(type);
            setPdfs(
                pdfs.map((pdf) =>
                    pdf.type === type
                        ? { ...pdf, generated: true, filePath: result.path }
                        : pdf,
                ),
            );
        } finally {
            setGenerating(null);
        }
    };

    return (
        <div className="space-y-3">
            {pdfs.map((pdf) => (
                <div
                    key={pdf.type}
                    className={`border rounded-lg overflow-hidden transition-all  bg-white shadow-sm hover:shadow-md duration-200 ${
                        pdf.generated ? 'cursor-pointer hover:shadow-md' : ''
                    }`}
                    onClick={() =>
                        pdf.generated && pdf.filePath && onView(pdf.filePath)
                    }
                >
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {pdf.generated ? (
                                <BadgeCheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                            ) : (
                                <div className="h-5 w-5 border-2 border-gray-300 rounded flex-shrink-0"></div>
                            )}

                            <div className="min-w-0">
                                <p className="font-medium truncate">
                                    {PDF_TITLES[pdf.type]}
                                </p>
                                {!pdf.generated && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onPreview(pdf.type);
                                        }}
                                        className="text-sm text-primary hover:underline mt-1"
                                    >
                                        Pré-visualizar modelo
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-2">
                            {pdf.generated ? (
                                <>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onMenuAction(pdf.type, 'open-menu');
                                        }}
                                        className="text-gray-500 hover:text-gray-700 p-1"
                                    >
                                        <MoreVerticalIcon className="h-5 w-5" />
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleGenerate(pdf.type);
                                    }}
                                    disabled={generating === pdf.type}
                                    className={`px-3 py-1 rounded-md text-sm text-white ${
                                        generating === pdf.type
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary hover:bg-primary-dark'
                                    }`}
                                >
                                    {generating === pdf.type
                                        ? 'Gerando...'
                                        : 'Gerar PDF'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
