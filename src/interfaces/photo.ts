export interface Photo {
    id?: string;
    locationId?: string;
    name?: string;
    filePath: string;
    selectedForPdf?: boolean;
    file?: File;
    signedUrl?: string;
    tempUrl?: string;
    location?: {
        id: string;
        name: string;
    };
    isTemp?: boolean;
}
