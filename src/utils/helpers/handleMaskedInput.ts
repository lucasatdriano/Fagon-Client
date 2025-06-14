import { Path, UseFormSetValue, PathValue, FieldValues } from 'react-hook-form';
import { decimalMask } from '@/utils/masks/maskDecimal';
import { numberMask } from '@/utils/masks/maskNumber';
import { cnpjMask } from '@/utils/masks/maskCNPJ';
import { cepMask } from '@/utils/masks/maskCEP';

export function handleMaskedChange<T extends FieldValues>(
    field: Path<T>,
    e: React.ChangeEvent<HTMLInputElement>,
    setValue: UseFormSetValue<T>,
) {
    let value = e.target.value;

    if (field === 'cnpj') {
        value = cnpjMask(value);
    } else if (field === 'cep') {
        value = cepMask(value);
    } else if (field === 'number' || field === 'upeCode') {
        value = numberMask(value);
    } else if (field === 'height') {
        value = decimalMask(value);
    }

    setValue(field, value as PathValue<T, Path<T>>, { shouldValidate: true });
}
