'use client';

import { pdfType } from '@/constants';
import { PdfType } from '@/interfaces/pdf';
import { toast } from 'react-toastify';
import { PdfCard } from '../cards/PdfCard';
import { PdfService } from '@/services/domains/pdfService';
import { useEffect, useState } from 'react';
import { PdfDocument } from '@/interfaces/pdf';

interface PdfGeneratorProps {
    projectId: string;
}

export default function PDFGeneratorWrapper({ projectId }: PdfGeneratorProps) {
    const [pdfs, setPdfs] = useState<PdfDocument[]>([]);
    const [loading, setLoading] = useState(true);

    // Carrega os PDFs existentes ao montar o componente
    useEffect(() => {
        async function loadPdfs() {
            try {
                setLoading(true);
                const response = await PdfService.getByProject(projectId);
                setPdfs(response.data);
            } catch (error) {
                toast.error('Erro ao carregar PDFs');
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        loadPdfs();
    }, [projectId]);

    // Mapeia os PDFs existentes com os tipos esperados
    const initialPDFs = pdfType.map((type) => {
        const existingPdf = pdfs.find((pdf) => pdf.pdfType === type.value);
        return {
            type: type.value as PdfType,
            generated: !!existingPdf && !existingPdf.signedFilePath,
            signed: !!existingPdf?.signedFilePath,
            filePath: existingPdf?.filePath,
            signedFilePath: existingPdf?.signedFilePath,
            id: existingPdf?.id,
        };
    });

    const handleGenerate = async (type: PdfType) => {
        try {
            const response = await PdfService.generate({
                projectId,
                pdfType: type,
            });

            setPdfs([...pdfs, response.data]);
            toast.success(`PDF "${type}" gerado com sucesso!`);
            return { path: response.data.filePath };
        } catch (error) {
            toast.error(`Erro ao gerar PDF "${type}"`);
            throw error;
        }
    };

    const handleViewPdf = (path: string) => {
        // Abre o PDF em uma nova aba
        window.open(
            `/api/pdfs/download?path=${encodeURIComponent(path)}`,
            '_blank',
        );
    };

    const handlePreview = (type: PdfType) => {
        // Aqui você pode implementar a pré-visualização
        // Pode ser um modal com uma imagem ou HTML do modelo
        toast.info(`Mostrando pré-visualização para ${type}`);
    };

    const handleDelete = async (type: PdfType) => {
        try {
            const pdfToDelete = pdfs.find((pdf) => pdf.pdfType === type);
            if (!pdfToDelete?.id) return;

            await PdfService.delete(pdfToDelete.id);
            setPdfs(pdfs.filter((pdf) => pdf.id !== pdfToDelete.id));
            toast.success(`PDF "${type}" deletado com sucesso!`);
        } catch (error) {
            toast.error(`Erro ao deletar PDF "${type}"`);
            throw error;
        }
    };

    const handleUploadSigned = async (type: PdfType, file: File) => {
        try {
            const pdfToUpdate = pdfs.find((pdf) => pdf.pdfType === type);
            if (!pdfToUpdate?.id) {
                throw new Error('PDF não encontrado para assinar');
            }

            const response = await PdfService.sign(pdfToUpdate.id, { file });

            // Atualiza a lista de PDFs
            setPdfs(
                pdfs.map((pdf) =>
                    pdf.id === pdfToUpdate.id ? response.data : pdf,
                ),
            );

            toast.success(`PDF "${type}" assinado enviado com sucesso!`);
            return { path: response.data.signedFilePath! };
        } catch (error) {
            toast.error(`Erro ao enviar PDF assinado "${type}"`);
            throw error;
        }
    };

    const handleGenerateSigned = async (type: PdfType) => {
        try {
            // Implemente esta função se quiser gerar um PDF assinado diretamente
            // Por enquanto, vamos apenas simular
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.info(
                `Gerar PDF assinado diretamente não está implementado. Use o upload.`,
            );
            return { path: '' };
        } catch (error) {
            toast.error(`Erro ao gerar PDF assinado "${type}"`);
            throw error;
        }
    };

    if (loading) {
        return <div>Carregando PDFs...</div>;
    }

    return (
        <PdfCard
            projectId={projectId}
            initialPDFs={initialPDFs}
            onGenerate={handleGenerate}
            onView={handleViewPdf}
            onPreview={handlePreview}
            onDelete={handleDelete}
            onUploadSigned={handleUploadSigned}
            onGenerateSigned={handleGenerateSigned}
        />
    );
}
