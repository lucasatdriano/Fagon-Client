'use client';

import { pdfType } from '@/constants';
import { PdfType } from '@/interfaces/pdf';
import { toast } from 'react-toastify';
import { PdfCard } from '../cards/PdfCard';

interface Props {
    projectId: string;
}

export default function PDFGeneratorWrapper({ projectId }: Props) {
    return (
        <PdfCard
            projectId={projectId}
            initialPDFs={pdfType.map((type) => ({
                type: type.value as PdfType,
                generated: false,
                signed: false,
                deleting: false,
            }))}
            onGenerate={async (type) => {
                // Simula geração com caminho fixo
                await new Promise((res) => setTimeout(res, 1000)); // simula delay
                toast.success(`PDF "${type}" gerado com sucesso!`);
                return { path: `mock/path/${type}.pdf` };
            }}
            onView={(path) => {
                // Abre uma URL simulada
                toast.info(`Abrindo PDF em ${path}`);
                window.open(`https://example.com/${path}`, '_blank');
            }}
            onPreview={(type) => {
                toast.info(`Abrindo pré-visualização para ${type}`);
            }}
            onMenuAction={(type, action) => {
                if (action === 'open-menu') {
                    toast.info(`Abrindo menu de opções para ${type}`);
                    // Aqui poderá abrir o dropdown futuramente
                }
            }}
            onGenerateSigned={async (type) => {
                await new Promise((res) => setTimeout(res, 1000));
                toast.success(`PDF "${type}" assinado com sucesso!`);
                return { path: `mock/path/${type}.pdf` };
            }}
        />
    );
}
