import { pdfTypes } from '../constants';

export type PdfTypes = (typeof pdfTypes)[number]['value'];

export interface PDF {
    id?: string;
    type: PdfTypes;
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
    pdfType: PdfTypes;
    signedFilePath?: string | null;
    generatedAt: string;
}
