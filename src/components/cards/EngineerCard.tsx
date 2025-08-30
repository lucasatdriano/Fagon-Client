import { engineerProps } from '@/interfaces/engineer';
import { formatPhone } from '@/utils/formatters';
import { HardHatIcon } from 'lucide-react';
import Link from 'next/link';

export default function EngineerCard({
    id,
    name,
    phone,
    email,
    education,
    registrationEntity,
    registrationNumber,
}: engineerProps) {
    return (
        <Link
            href={`/engineers/${id}`}
            passHref
            className="w-full cursor-pointer p-4 border rounded-lg shadow-sm hover:shadow-md bg-white transition-shadow duration-200"
        >
            <div className="flex items-center gap-2 mb-2">
                <HardHatIcon className="w-8 h-8 text-primary" />
                <span className="font-semibold text-foreground">{email}</span>
            </div>

            <h2 className="font-bold text-lg mb-1">{name}</h2>
            <p className="text-foreground">Telefone: {formatPhone(phone)}</p>
            <p className="text-foreground">
                Formação: {education} - {registrationEntity}{' '}
                {registrationNumber}
            </p>
        </Link>
    );
}
