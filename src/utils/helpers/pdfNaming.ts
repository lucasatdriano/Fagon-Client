import { PdfType } from '../../interfaces/pdf';
import { formatNumberAgency } from '../formatters/formatNumberAgency';

export const getPdfFileName = (
    pdfType: PdfType,
    agencyNumber: string,
): string => {
    switch (pdfType) {
        case 'atestado':
            return `${formatNumberAgency(agencyNumber)}-EF-A.pdf`;
        case 'anexo_m3':
            return `${formatNumberAgency(agencyNumber)}-EF-M3.pdf`;
        case 'anexo_m4':
            return `${formatNumberAgency(agencyNumber)}-EF-M4.pdf`;
        case 'laudo_avaliacao':
            return `${formatNumberAgency(agencyNumber)}-EF-L.pdf`;
        case 'relatorio_fotografico':
            return `${formatNumberAgency(agencyNumber)}-EF-R.pdf`;
        default:
            return `${formatNumberAgency(agencyNumber)}-${pdfType}.pdf`;
    }
};
