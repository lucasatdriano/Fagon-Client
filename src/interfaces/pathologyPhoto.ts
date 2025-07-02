export interface PathologyPhoto {
    id: string;
    pathologyId?: string;
    name?: string;
    filePath?: string;
    file: File;
    signedUrl?: string;
    tempUrl: string;
    pathology?: {
        id: string;
        title: string;
    };
}
