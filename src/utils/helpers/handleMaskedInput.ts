import { Path, UseFormSetValue, PathValue, FieldValues } from 'react-hook-form';
import { decimalMask } from '../masks/maskDecimal';
import { numberMask } from '../masks/maskNumber';
import { cnpjMask } from '../masks/maskCNPJ';
import { cepMask } from '../masks/maskCEP';

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
    } else if (field === 'height' || field.includes('area')) {
        value = decimalMask(value);
    }

    setValue(field, value as PathValue<T, Path<T>>, { shouldValidate: true });
}
