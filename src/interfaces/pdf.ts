import { pdfType } from '../constants';

export type PdfType = (typeof pdfType)[number]['value'];

export interface PDF {
    id?: string;
    type: PdfType;
    generated: boolean;
    signed: boolean;
    filePath?: string | null;
    signedFilePath?: string | null;
}

export interface PdfDocument {
    id: string;
    projectId: string;
    name?: string;
    filePath: string;
    pdfType: PdfType;
    signedFilePath?: string | null;
    generatedAt: string;
}
