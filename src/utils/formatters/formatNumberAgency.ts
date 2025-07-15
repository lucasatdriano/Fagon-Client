export const formatNumberAgency = (agencyNumber: string) => {
    return agencyNumber.toString().padStart(4, '0');
};
