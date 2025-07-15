import { PdfType } from '../../interfaces/pdf';
import { formatNumberAgency } from '../formatters/formatNumberAgency';

export const getPdfFileName = (
    pdfType: PdfType,
    agencyNumber: string,
): string => {
    switch (pdfType) {
        case 'atestado':
            return `${formatNumberAgency(agencyNumber)}-EF-A-001-R00.pdf`;
        case 'anexo_m3':
            return `${formatNumberAgency(agencyNumber)}-EF-L-001-01-R00.pdf`;
        case 'anexo_m4':
            return `${formatNumberAgency(agencyNumber)}-EF-L-001-02-R00.pdf`;
        case 'laudo_avaliacao':
            return `${formatNumberAgency(agencyNumber)}-EF-L-001-R00.pdf`;
        case 'relatorio_fotografico':
            return `${formatNumberAgency(agencyNumber)}-EF-R-001-R00.pdf`;
        default:
            return `${formatNumberAgency(agencyNumber)}-${pdfType}.pdf`;
    }
};
