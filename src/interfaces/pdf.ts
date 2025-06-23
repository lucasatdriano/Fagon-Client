import { pdfType } from '@/constants';

export type PdfType = (typeof pdfType)[number]['value'];

export interface PDF {
    id: string;
    type: PdfType;
    generated: boolean;
    deleting: boolean;
    signed: boolean;
    filePath?: string;
    signedFilePath?: string;
}
