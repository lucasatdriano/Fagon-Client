export interface inspectorProps {
    id: string;
    name: string;
    phone: string;
    cep?: string;
    state: string;
    city: string;
    district?: string;
    street?: string;
    selectedCities: string[];
    rating?: number;
    createdAt?: string;
    distance?: number;
}
