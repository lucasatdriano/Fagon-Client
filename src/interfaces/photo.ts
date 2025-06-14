export interface Photo {
    id?: string;
    locationId: string;
    filePath: string;
    selectedForPdf: boolean;
    file?: File;
    signedUrl?: string;
    location?: {
        id: string;
        name: string;
    };
}
