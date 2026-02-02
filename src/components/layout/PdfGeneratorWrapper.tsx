'use client';

import { pdfTypes } from '../../constants';
import { PdfTypes, PDF, PdfDocument } from '../../interfaces/pdf';
import { PdfService } from '../../services/domains/pdfService';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { PdfCard } from '../cards/PdfCard';
import { getPdfLabel } from '../../utils/formatters/formatValues';
import { ProjectService } from '../../services/domains/projectService';
import { ProjectStatus } from '../../types/project';
import { Loader2Icon } from 'lucide-react';
import AddInfoToPdfModal from '../modals/pdfModals/AddInfoToPdfModal';

type LoadingState = {
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

interface PdfGeneratorProps {
    projectId: string;
}

export default function PDFGeneratorWrapper({ projectId }: PdfGeneratorProps) {
    const [pdfDocuments, setPdfDocuments] = useState<PdfDocument[]>([]);
    const [loadingState, setLoadingState] = useState<LoadingState>(null);
    const [showProjectInfoModal, setShowProjectInfoModal] = useState(false);
    const [projectStatus, setProjectStatus] = useState<ProjectStatus>();

    useEffect(() => {
        async function loadPdfs() {
            try {
                setLoadingState({ action: 'load' });
                const response = await PdfService.getByProject(projectId);
                setPdfDocuments(response.data);

                const projectResponse = await ProjectService.getById(projectId);
                setProjectStatus(projectResponse.data.status as ProjectStatus);
            } catch (error) {
                toast.error('Erro ao carregar PDFs');
                console.error(error);
            } finally {
                setLoadingState(null);
            }
        }
        loadPdfs();
    }, [projectId]);

    const pdfs: PDF[] = pdfTypes.map((type) => {
        const existingPdf = pdfDocuments.find(
            (pdf) => pdf.pdfType === type.value,
        );
        return {
            type: type.value as PdfTypes,
            generated: !!existingPdf && !existingPdf.signedFilePath,
            signed: !!existingPdf?.signedFilePath,
            filePath: existingPdf?.filePath ?? null,
            signedFilePath: existingPdf?.signedFilePath ?? null,
            id: existingPdf?.id,
        };
    });

    const updateProjectStatus = async () => {
        try {
            const allPdfsGenerated = pdfTypes.every((type) => {
                const pdf = pdfs.find((p) => p.type === type.value);
                return pdf?.generated || pdf?.signed;
            });

            const allPdfsSigned = pdfTypes.every((type) => {
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

    const handleGenerate = async (type: PdfTypes) => {
        setLoadingState({ action: 'generate', pdfType: type });
        try {
            const projectResponse = await ProjectService.getById(projectId);
            const project = projectResponse.data;

            if (
                (type === 'anexo_m3' || type === 'anexo_m4') &&
                (!project.technicalResponsibilityNumber ||
                    project.technicalResponsibilityNumber.trim() === '')
            ) {
                toast.error(
                    `Número de responsabilidade técnica não preenchido. Preencha este campo antes de gerar o ${getPdfLabel(
                        type,
                    )}.`,
                );
                setLoadingState(null);
                return;
            }

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
                    setLoadingState(null);
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
                setLoadingState(null);
            }
        }
    };

    const handleViewPdf = async (pdfId: string) => {
        setLoadingState({ action: 'view', pdfId });
        try {
            const signedUrl = await PdfService.getSignedUrl(pdfId);
            window.open(signedUrl, '_blank', 'noopener,noreferrer');
        } catch (error) {
            toast.error('Erro ao visualizar PDF');
            console.error(error);
        } finally {
            setLoadingState(null);
        }
    };

    const handlePreview = (type: PdfTypes) => {
        const pdfFileMap: Record<PdfTypes, string> = {
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
        setLoadingState({ action: 'download', pdfId });
        try {
            await PdfService.downloadPdf(pdfId);
            toast.success('Download do PDF iniciado');
        } catch (error) {
            toast.error('Erro ao baixar PDF');
            console.error(error);
        } finally {
            setLoadingState(null);
        }
    };

    const handleDelete = async (type: PdfTypes) => {
        setLoadingState({ action: 'delete', pdfType: type });
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
            setLoadingState(null);
        }
    };

    const handleUploadSigned = async (type: PdfTypes, file: File) => {
        setLoadingState({ action: 'uploadSigned', pdfType: type });
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
            setLoadingState(null);
        }
    };

    const handleProjectInfoSuccess = () => {
        setLoadingState({ action: 'projectInfo' });
        PdfService.getByProject(projectId)
            .then((response) => {
                setPdfDocuments(response.data);
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoadingState(null);
            });
    };

    if (loadingState?.action === 'load') {
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
                loadingState={loadingState}
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
            />

            <AddInfoToPdfModal
                projectId={projectId}
                isOpen={showProjectInfoModal}
                onClose={() => {
                    setShowProjectInfoModal(false);
                    setLoadingState(null);
                }}
                onSuccess={handleProjectInfoSuccess}
                isLoading={loadingState?.action === 'projectInfo'}
            />
        </div>
    );
}
