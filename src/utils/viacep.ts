import { ufToStateName } from './helpers/ufToStateName';

export const fetchAddressByCep = async (cep: string) => {
    try {
        const cleanedCep = cep.replace(/\D/g, '');
        const response = await fetch(
            `https://viacep.com.br/ws/${cleanedCep}/json/`,
        );
        const data = await response.json();

        if (data.erro) {
            throw new Error('CEP não encontrado');
        }

        return {
            state: ufToStateName(data.uf),
            city: data.localidade,
            district: data.bairro,
            street: data.logradouro,
            rawUf: data.uf,
        };
    } catch {
        return null;
    }
};
