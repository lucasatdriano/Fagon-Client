'use client';

import { PdfTypes, PDF } from '../../interfaces/pdf';
import {
    BadgeCheckIcon,
    MoreVerticalIcon,
    FileSignatureIcon,
    Trash2Icon,
    FileInputIcon,
    BadgeIcon,
    DownloadIcon,
} from 'lucide-react';
import { DropdownMenu } from '../dropdownMenus/DropdownMenu';
import { useRef, useState } from 'react';
import { DeletePdfModal } from '../modals/pdfModals/DeletePdfModal';
import { Loader2Icon } from 'lucide-react';

const PDF_TITLES: Record<PdfTypes, string> = {
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

interface PdfCardProps {
    pdfs: PDF[];
    loadingState: {
        action:
            | 'generate'
            | 'delete'
            | 'view'
            | 'download'
            | 'uploadSigned'
            | 'load'
            | 'projectInfo';
        pdfType?: PdfTypes;
        pdfId?: string;
    } | null;
    onGenerate: (type: PdfTypes) => Promise<void>;
    onView: (pdfId: string) => void;
    onDownload: (pdfId: string) => void;
    onPreview: (type: PdfTypes) => void;
    onDelete: (type: PdfTypes) => Promise<void>;
    onUploadSigned: (type: PdfTypes, file: File) => Promise<void>;
    setPdfDocuments: (newPdfs: PDF[]) => void;
}

export function PdfCard({
    pdfs,
    loadingState,
    onGenerate,
    onView,
    onDownload,
    onPreview,
    onDelete,
    onUploadSigned,
    setPdfDocuments,
}: PdfCardProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [pdfToDelete, setPdfToDelete] = useState<PdfTypes | null>(null);

    const handleUploadClick = (type: PdfTypes) => {
        if (fileInputRef.current) {
            fileInputRef.current.setAttribute('data-pdf-type', type);
            fileInputRef.current.click();
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const type = e.target.getAttribute('data-pdf-type') as PdfTypes;
        await onUploadSigned(type, files[0]);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const getMenuItems = (pdf: PDF) => {
        const items = [];

        if (pdf.generated || pdf.signed) {
            items.push({
                label: 'Download',
                action: () => pdf.id && onDownload(pdf.id),
                icon: <DownloadIcon className="w-4 h-4" />,
                disabled:
                    loadingState?.action === 'download' &&
                    loadingState.pdfId === pdf.id,
            });

            items.push({
                label: 'Deletar',
                action: () => setPdfToDelete(pdf.type),
                icon: <Trash2Icon className="w-4 h-4" />,
                disabled:
                    loadingState?.action === 'delete' &&
                    loadingState.pdfType === pdf.type,
            });
        }

        if (pdf.generated && !pdf.signed) {
            items.push({
                label: 'Enviar PDF Assinado',
                action: () => handleUploadClick(pdf.type),
                icon: <FileInputIcon className="w-4 h-4" />,
                disabled:
                    loadingState?.action === 'uploadSigned' &&
                    loadingState.pdfType === pdf.type,
            });
        }

        return items;
    };

    const isGenerating = (type: PdfTypes) =>
        loadingState?.action === 'generate' && loadingState.pdfType === type;

    const isDeleting = (type: PdfTypes) =>
        loadingState?.action === 'delete' && loadingState.pdfType === type;

    return (
        <div className="grid gap-2">
            <input
                title="Enviar PDF Assinado"
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf"
                className="hidden"
            />

            {pdfToDelete && (
                <DeletePdfModal
                    pdfType={pdfToDelete}
                    pdfs={pdfs}
                    setPdfs={setPdfDocuments}
                    onClose={() => setPdfToDelete(null)}
                    onConfirm={() => onDelete(pdfToDelete)}
                    isLoading={isDeleting(pdfToDelete)}
                />
            )}

            {pdfs.map((pdf) => (
                <div
                    key={pdf.type}
                    className={`border rounded-lg overflow-hidden transition-all bg-white shadow-sm hover:shadow-md duration-200 ${
                        pdf.generated || pdf.signed ? 'hover:shadow-md' : ''
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
                                            disabled={
                                                (loadingState?.action ===
                                                    'view' &&
                                                    loadingState.pdfId ===
                                                        pdf.id) ||
                                                (loadingState?.action ===
                                                    'download' &&
                                                    loadingState.pdfId ===
                                                        pdf.id) ||
                                                (loadingState?.action ===
                                                    'delete' &&
                                                    loadingState.pdfType ===
                                                        pdf.type) ||
                                                (loadingState?.action ===
                                                    'uploadSigned' &&
                                                    loadingState.pdfType ===
                                                        pdf.type)
                                            }
                                        >
                                            {loadingState?.action ===
                                                'delete' &&
                                            loadingState.pdfType ===
                                                pdf.type ? (
                                                <Loader2Icon className="h-5 w-5 animate-spin" />
                                            ) : (
                                                <MoreVerticalIcon className="h-5 w-5" />
                                            )}
                                        </button>
                                    }
                                    items={getMenuItems(pdf)}
                                />
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onGenerate(pdf.type);
                                    }}
                                    disabled={isGenerating(pdf.type)}
                                    className={`px-3 py-1 rounded-md text-sm text-white hover:bg-primary-hover ${
                                        isGenerating(pdf.type)
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-primary hover:bg-primary-dark'
                                    }`}
                                >
                                    {isGenerating(pdf.type) ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2Icon className="animate-spin h-4 w-4" />
                                            Gerando...
                                        </span>
                                    ) : (
                                        'Gerar PDF'
                                    )}
                                </button>
                            )}
                        </div>
                    </div>

                    {(pdf.generated || pdf.signed) && (
                        <div className="border-t">
                            <div
                                className="p-3 text-center cursor-pointer hover:bg-gray-50"
                                onClick={() => pdf.id && onView(pdf.id)}
                            >
                                {loadingState?.action === 'view' &&
                                loadingState.pdfId === pdf.id ? (
                                    <span className="flex items-center justify-center gap-2 text-sm text-gray-700">
                                        <Loader2Icon className="animate-spin h-4 w-4" />
                                        Carregando...
                                    </span>
                                ) : (
                                    <span className="text-sm text-gray-700">
                                        Visualizar PDF
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
