'use client';

import { useState, useRef } from 'react';
import { PDF, PdfType } from '@/interfaces/pdf';
import {
    BadgeCheckIcon,
    MoreVerticalIcon,
    FileSignatureIcon,
    Trash2Icon,
    FileUpIcon,
    FileInputIcon,
    BadgeIcon,
} from 'lucide-react';
import { DropdownMenu } from '../dropdownMenus/DropdownMenu';
import { DeletePdfModal } from '../modals/DeletePdfModal';

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
    onGenerate: (type: PdfType, signed: boolean) => Promise<{ path: string }>;
    onView: (path: string) => void;
    onPreview: (type: PdfType) => void;
    onDelete: (type: PdfType) => Promise<void>;
    onUploadSigned: (type: PdfType, file: File) => Promise<{ path: string }>;
    onGenerateSigned: (type: PdfType) => Promise<{ path: string }>;
}

export function PdfCard({
    initialPDFs,
    onGenerate,
    onView,
    onPreview,
    onDelete,
    onUploadSigned,
    onGenerateSigned,
}: PDFGeneratorProps) {
    const [pdfs, setPdfs] = useState<PDF[]>(initialPDFs);
    const [generating, setGenerating] = useState<{
        type: PdfType;
        signed: boolean;
    } | null>(null);
    const [deletingPdf, setDeletingPdf] = useState<PdfType | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleGenerate = async (type: PdfType, signed: boolean = false) => {
        setGenerating({ type, signed });
        try {
            const result = signed
                ? await onGenerateSigned(type)
                : await onGenerate(type, signed);

            setPdfs(
                pdfs.map((pdf) =>
                    pdf.type === type
                        ? {
                              ...pdf,
                              generated: !signed,
                              signed: signed,
                              filePath: result.path,
                          }
                        : pdf,
                ),
            );
        } finally {
            setGenerating(null);
        }
    };

    const handleDelete = async (type: PdfType) => {
        setDeletingPdf(type);
    };

    const confirmDelete = async () => {
        if (!deletingPdf) return;

        try {
            await onDelete(deletingPdf);
            setPdfs(
                pdfs.map((pdf) =>
                    pdf.type === deletingPdf
                        ? {
                              ...pdf,
                              generated: false,
                              signed: false,
                              filePath: undefined,
                          }
                        : pdf,
                ),
            );
        } finally {
            setDeletingPdf(null);
        }
    };

    const handleUploadClick = (type: PdfType) => {
        if (fileInputRef.current) {
            fileInputRef.current.setAttribute('data-pdf-type', type);
            fileInputRef.current.click();
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const type = e.target.getAttribute('data-pdf-type') as PdfType;
        const file = files[0];

        try {
            setGenerating({ type, signed: true });
            const result = await onUploadSigned(type, file);

            setPdfs(
                pdfs.map((pdf) =>
                    pdf.type === type
                        ? {
                              ...pdf,
                              generated: false,
                              signed: true,
                              filePath: result.path,
                          }
                        : pdf,
                ),
            );
        } finally {
            setGenerating(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const getMenuItems = (
        pdf: PDF,
    ): Array<{
        label: string;
        action: () => void;
        icon?: React.ReactNode;
    }> => {
        const items = [];

        if (pdf.generated || pdf.signed) {
            items.push({
                label: 'Baixar PDF',
                action: () => pdf.filePath && onView(pdf.filePath),
                icon: <FileUpIcon className="w-4 h-4" />,
            });

            items.push({
                label: 'Deletar PDF',
                action: () => handleDelete(pdf.type),
                icon: <Trash2Icon className="w-4 h-4" />,
            });
        }

        if (pdf.generated) {
            items.push({
                label: 'Gerar PDF Assinado',
                action: () => handleGenerate(pdf.type, true),
                icon: <FileSignatureIcon className="w-4 h-4" />,
            });

            items.push({
                label: 'Upload do PDF Assinado',
                action: () => handleUploadClick(pdf.type),
                icon: <FileInputIcon className="w-4 h-4" />,
            });
        }

        return items;
    };

    return (
        <div className="space-y-3">
            <input
                title="Enviar PDF assinado"
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf"
                className="hidden"
            />

            {deletingPdf && (
                <DeletePdfModal
                    fileName={PDF_TITLES[deletingPdf]}
                    onClose={() => setDeletingPdf(null)}
                    onConfirm={confirmDelete}
                />
            )}

            {pdfs.map((pdf) => (
                <div
                    key={pdf.type}
                    className={`border rounded-lg overflow-hidden transition-all bg-white shadow-sm hover:shadow-md duration-200 ${
                        pdf.generated || pdf.signed
                            ? 'cursor-pointer hover:shadow-md'
                            : ''
                    }`}
                >
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {pdf.signed ? (
                                <FileSignatureIcon className="h-6 w-6 text-primary flex-shrink-0" />
                            ) : pdf.generated ? (
                                <BadgeCheckIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
                            ) : (
                                <BadgeIcon className="h-6 w-6 text-gray-400 rounded flex-shrink-0" />
                            )}

                            <div className="min-w-0">
                                <p className="font-medium truncate">
                                    {PDF_TITLES[pdf.type]}
                                    {pdf.signed && ' (Assinado)'}
                                </p>
                                {!pdf.generated && !pdf.signed && (
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
                            {pdf.generated || pdf.signed ? (
                                <DropdownMenu
                                    trigger={
                                        <button
                                            title="Botão Menu"
                                            onClick={(e) => e.stopPropagation()}
                                            className="text-gray-500 hover:text-gray-700 p-1"
                                        >
                                            <MoreVerticalIcon className="h-5 w-5" />
                                        </button>
                                    }
                                    items={getMenuItems(pdf)}
                                />
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleGenerate(pdf.type);
                                    }}
                                    disabled={
                                        generating?.type === pdf.type &&
                                        !generating.signed
                                    }
                                    className={`px-3 py-1 rounded-md text-sm text-white ${
                                        generating?.type === pdf.type &&
                                        !generating.signed
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary hover:bg-primary-dark'
                                    }`}
                                >
                                    {generating?.type === pdf.type &&
                                    !generating.signed
                                        ? 'Gerando...'
                                        : 'Gerar PDF'}
                                </button>
                            )}
                        </div>
                    </div>

                    {(pdf.generated || pdf.signed) && (
                        <div className="border-t">
                            <div
                                className="p-3 text-center hover:bg-gray-50"
                                onClick={() =>
                                    pdf.filePath && onView(pdf.filePath)
                                }
                            >
                                <span
                                    className={`text-sm ${
                                        pdf.signed
                                            ? 'text-primary font-medium'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {pdf.signed
                                        ? 'Visualizar PDF Assinado'
                                        : 'Visualizar PDF'}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
