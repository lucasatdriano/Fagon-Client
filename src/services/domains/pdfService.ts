import { PdfType } from '@/interfaces/pdf';
import { api, extractAxiosError } from '../api';
import API_ROUTES from '../api/routes';
import { ApiResponse } from '@/types/api';

export interface PdfDocument {
    id: string;
    projectId: string;
    filePath: string;
    pdfType: string;
    signedFilePath?: string;
    generatedAt: string;
}

interface GeneratePdfData {
    projectId: string;
    pdfType: PdfType;
}

interface SignPdfData {
    file: File;
}

export const PdfService = {
    async generate(data: GeneratePdfData): Promise<ApiResponse<PdfDocument>> {
        try {
            const response = await api.post(API_ROUTES.PDFS.GENERATE, data);
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async sign(
        id: string,
        signPdf: SignPdfData,
    ): Promise<ApiResponse<PdfDocument>> {
        try {
            const formData = new FormData();
            formData.append('file', signPdf.file);

            const response = await api.post(
                API_ROUTES.PDFS.SIGN({ id }),
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                },
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getByProject(projectId: string): Promise<ApiResponse<PdfDocument[]>> {
        try {
            const response = await api.get(
                API_ROUTES.PDFS.BY_PROJECT({ projectId }),
            );
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async getById(id: string): Promise<ApiResponse<PdfDocument>> {
        try {
            const response = await api.get(API_ROUTES.PDFS.BY_ID({ id }));
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async download(id: string): Promise<Blob> {
        try {
            const response = await api.get(API_ROUTES.PDFS.DOWNLOAD({ id }), {
                responseType: 'blob',
            });
            return response.data;
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async delete(id: string): Promise<void> {
        try {
            await api.delete(API_ROUTES.PDFS.DELETE({ id }));
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },

    async openPdfInNewTab(id: string, filename: string): Promise<void> {
        try {
            const blob = await this.download(id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.download = filename || `document-${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            throw new Error(extractAxiosError(error));
        }
    },
};
