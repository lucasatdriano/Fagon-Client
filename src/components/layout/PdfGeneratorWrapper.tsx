'use client';

import { pdfType } from '../../constants';
import { PdfType, PDF, PdfDocument } from '../../interfaces/pdf';
import { PdfService } from '../../services/domains/pdfService';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PdfCard } from '../cards/PdfCard';
import { getPdfLabel } from '../../utils/formatters/formatValues';
import { ProjectService } from '../../services/domains/projectService';
import { ProjectStatus } from '../../types/project';
import { Loader2Icon } from 'lucide-react';
import AddInfoToPdfModal from '../modals/pdfModals/AddInfoToPdfModal';

interface PdfGeneratorProps {
    projectId: string;
}

export default function PDFGeneratorWrapper({ projectId }: PdfGeneratorProps) {
    const [pdfDocuments, setPdfDocuments] = useState<PdfDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState<PdfType | null>(null);
    const [deletingPdf, setDeletingPdf] = useState<PdfType | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showProjectInfoModal, setShowProjectInfoModal] = useState(false);
    const [projectStatus, setProjectStatus] = useState<ProjectStatus>();

    useEffect(() => {
        async function loadPdfs() {
            try {
                setLoading(true);
                const response = await PdfService.getByProject(projectId);
                setPdfDocuments(response.data);

                const projectResponse = await ProjectService.getById(projectId);
                setProjectStatus(projectResponse.data.status as ProjectStatus);
            } catch (error) {
                toast.error('Erro ao carregar PDFs');
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        loadPdfs();
    }, [projectId]);

    const pdfs: PDF[] = pdfType.map((type) => {
        const existingPdf = pdfDocuments.find(
            (pdf) => pdf.pdfType === type.value,
        );
        return {
            type: type.value as PdfType,
            generated: !!existingPdf && !existingPdf.signedFilePath,
            signed: !!existingPdf?.signedFilePath,
            filePath: existingPdf?.filePath ?? null,
            signedFilePath: existingPdf?.signedFilePath ?? null,
            id: existingPdf?.id,
        };
    });

    const updateProjectStatus = async () => {
        try {
            const allPdfsGenerated = pdfType.every((type) => {
                const pdf = pdfs.find((p) => p.type === type.value);
                return pdf?.generated || pdf?.signed;
            });

            const allPdfsSigned = pdfType.every((type) => {
                const pdf = pdfs.find((p) => p.type === type.value);
                return pdf?.signed;
            });

            let newStatus: ProjectStatus | undefined;

            if (allPdfsSigned) {
                newStatus = 'finalizado';
            } else if (allPdfsGenerated) {
                newStatus = 'aguardando_assinatura_de_pdfs';
            } else if (pdfs.some((pdf) => pdf.generated || pdf.signed)) {
                newStatus = 'aguardando_gerar_pdfs';
            }

            if (newStatus && newStatus !== projectStatus) {
                await ProjectService.update(projectId, { status: newStatus });
                setProjectStatus(newStatus);
            }
        } catch (error) {
            console.error('Erro ao atualizar status do projeto:', error);
        }
    };

    const handleGenerate = async (type: PdfType) => {
        setGenerating(type);
        setIsLoading(true);
        try {
            if (type === 'laudo_avaliacao') {
                const project = await ProjectService.getById(projectId);

                const hasMissingArea = project.data.pavements.some(
                    (pavements) =>
                        pavements.area === null || pavements.area === undefined,
                );

                if (
                    !project.data.structureType ||
                    !project.data.floorHeight ||
                    hasMissingArea
                ) {
                    setShowProjectInfoModal(true);
                    setGenerating(null);
                    setIsLoading(false);
                    return;
                }
            }

            const response = await PdfService.generate({
                projectId,
                pdfType: type,
            });
            setPdfDocuments([...pdfDocuments, response.data]);
            toast.success(`PDF ${getPdfLabel(type)} gerado com sucesso!`);

            await updateProjectStatus();
        } catch {
            toast.error(`Erro ao gerar PDF ${getPdfLabel(type)}`);
        } finally {
            if (type !== 'laudo_avaliacao') {
                setGenerating(null);
                setIsLoading(false);
            }
        }
    };

    const handleViewPdf = async (pdfId: string) => {
        try {
            const signedUrl = await PdfService.getSignedUrl(pdfId);
            window.open(signedUrl, '_blank', 'noopener,noreferrer');
        } catch (error) {
            toast.error('Erro ao visualizar PDF');
            console.error(error);
        }
    };

    const handlePreview = (type: PdfType) => {
        const pdfFileMap: Record<PdfType, string> = {
            atestado: 'docs/atestado.pdf',
            anexo_m3: 'docs/anexo_m3.pdf',
            anexo_m4: 'docs/anexo_m4.pdf',
            laudo_avaliacao: 'docs/laudo_avaliacao.pdf',
            relatorio_fotografico: 'docs/relatorio_fotografico.pdf',
        };

        const filePath = pdfFileMap[type];

        if (filePath) {
            const pdfUrl = `/${filePath}?v=${Date.now()}`;

            window.open(pdfUrl, '_blank', 'noopener,noreferrer');
        } else {
            toast.error(
                `Arquivo de pré-visualização não encontrado para ${getPdfLabel(
                    type,
                )}`,
            );
        }
    };

    const handleDownload = async (pdfId: string) => {
        try {
            await PdfService.downloadPdf(pdfId);
            toast.success('Download do PDF iniciado');
        } catch (error) {
            toast.error('Erro ao baixar PDF');
            console.error(error);
        }
    };

    const handleDelete = async (type: PdfType) => {
        setDeletingPdf(type);
        setIsLoading(true);
        try {
            const pdfToDelete = pdfDocuments.find(
                (pdf) => pdf.pdfType === type,
            );
            if (!pdfToDelete?.id) return;

            await PdfService.deletePdf(pdfToDelete.id);
            setPdfDocuments(
                pdfDocuments.filter((pdf) => pdf.id !== pdfToDelete.id),
            );
            toast.success(`PDF ${getPdfLabel(type)} deletado com sucesso!`);

            await updateProjectStatus();
        } catch {
            toast.error(`Erro ao deletar PDF ${getPdfLabel(type)}`);
        } finally {
            setDeletingPdf(null);
            setIsLoading(false);
        }
    };

    const handleUploadSigned = async (type: PdfType, file: File) => {
        setIsLoading(true);
        try {
            const pdfToUpdate = pdfDocuments.find(
                (pdf) => pdf.pdfType === type,
            );
            if (!pdfToUpdate?.id) {
                throw new Error('PDF não encontrado para assinar');
            }

            const response = await PdfService.sign(pdfToUpdate.id, { file });
            setPdfDocuments(
                pdfDocuments.map((pdf) =>
                    pdf.id === pdfToUpdate.id ? response.data : pdf,
                ),
            );
            toast.success(
                `PDF ${getPdfLabel(type)} assinado enviado com sucesso!`,
            );

            await updateProjectStatus();
        } catch (error) {
            toast.error(`Erro ao enviar PDF assinado ${getPdfLabel(type)}`);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const handleProjectInfoSuccess = () => {
        setIsLoading(true);
        PdfService.getByProject(projectId)
            .then((response) => {
                setPdfDocuments(response.data);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });

        setGenerating(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-56 w-screen">
                <Loader2Icon className="animate-spin w-10 h-10 text-primary" />
            </div>
        );
    }

    return (
        <div className="pb-6 md:pb-8">
            <PdfCard
                pdfs={pdfs}
                generating={generating}
                deletingPdf={deletingPdf}
                onGenerate={handleGenerate}
                onView={handleViewPdf}
                onDownload={handleDownload}
                onPreview={handlePreview}
                onDelete={handleDelete}
                onUploadSigned={handleUploadSigned}
                setPdfDocuments={(newPdfs) => {
                    const updatedDocuments = pdfDocuments.map((doc) => {
                        const updatedPdf = newPdfs.find((p) => p.id === doc.id);
                        return updatedPdf
                            ? {
                                  ...doc,
                                  filePath: updatedPdf.filePath || doc.filePath,
                                  signedFilePath:
                                      updatedPdf.signedFilePath ||
                                      doc.signedFilePath,
                              }
                            : doc;
                    });
                    setPdfDocuments(updatedDocuments);
                }}
                isLoading={isLoading}
            />

            <AddInfoToPdfModal
                projectId={projectId}
                isOpen={showProjectInfoModal}
                onClose={() => {
                    setShowProjectInfoModal(false);
                    setGenerating(null);
                }}
                onSuccess={handleProjectInfoSuccess}
                isLoading={isLoading}
            />
        </div>
    );
}
