'use client';

import { PDFGenerator } from '@/components/cards/PdfCard';
import { pdfType } from '@/constants';
import { PdfType } from '@/interfaces/pdf';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Props {
    projectId: string;
}

export default function PDFGeneratorWrapper({ projectId }: Props) {
    return (
        <PDFGenerator
            projectId={projectId}
            initialPDFs={pdfType.map((type) => ({
                type: type.value as PdfType,
                generated: false,
                signed: false,
            }))}
            onGenerate={async (type) => {
                const response = await fetch('/api/generate-pdf', {
                    method: 'POST',
                    body: JSON.stringify({
                        projectId,
                        pdfType: type,
                    }),
                });
                return response.json();
            }}
            onView={(path) => {
                const {
                    data: { publicUrl },
                } = supabase.storage.from('pdfs').getPublicUrl(path);
                window.open(publicUrl, '_blank');
            }}
            onPreview={(type) => {
                toast.info(`Abrindo pré-visualização para ${type}`);
                // Aqui você pode abrir um modal ou redirecionar para uma página de visualização
            }}
            onMenuAction={(type, action) => {
                if (action === 'open-menu') {
                    toast.info(`Abrindo menu de opções para ${type}`);
                    // Aqui você pode abrir um popover ou dropdown com ações como:
                    // "Baixar", "Enviar PDF assinado", "Excluir", etc.
                }
            }}
        />
    );
}
