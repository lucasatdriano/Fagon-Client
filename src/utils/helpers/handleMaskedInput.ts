import { cepMask } from '@/utils/masks/maskCEP';
import { cnpjMask } from '@/utils/masks/maskCNPJ';
import { CreateAgencyFormValues } from '@/validations';
import { UseFormSetValue } from 'react-hook-form';

export function handleMaskedChange(
    field: keyof CreateAgencyFormValues,
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: UseFormSetValue<CreateAgencyFormValues>,
) {
    let value = e.target.value;

    if (field === 'cnpj') {
        value = cnpjMask(value);
    } else if (field === 'cep') {
        value = cepMask(value);
    }

    setValue(field, value as string, { shouldValidate: true });
}
