export function isValidCPF(cpf: string): boolean {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    const calcCheckDigit = (factor: number) => {
        let total = 0;
        for (let i = 0; i < factor - 1; i++) {
            total += parseInt(cpf.charAt(i)) * (factor - i);
        }
        const rest = (total * 10) % 11;
        return rest === 10 ? 0 : rest;
    };

    const digit1 = calcCheckDigit(10);
    const digit2 = calcCheckDigit(11);

    return (
        digit1 === parseInt(cpf.charAt(9)) &&
        digit2 === parseInt(cpf.charAt(10))
    );
}
