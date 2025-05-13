import { pdfType } from '@/constants';

export type PdfType = (typeof pdfType)[number]['value'];

export interface PDF {
    type: PdfType;
    generated: boolean;
    signed: boolean;
    filePath?: string;
    signedFilePath?: string;
}
