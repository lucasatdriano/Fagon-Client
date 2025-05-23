import { NavigationCard } from '@/components/cards/NavegationCard';
import PDFGeneratorWrapper from '@/components/layout/PdfGeneratorWrapper';
import { ClipboardEditIcon, InfoIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardProjectPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    return (
        <div className="h-svh flex flex-col items-center pt-20 px-6">
            <div className="w-full relative flex justify-center py-3">
                <h1 className="text-3xl font-sans bg-background px-2">
                    Projeto - Salvador - Pituba
                </h1>
                <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
            </div>
            <div className="w-full flex flex-col gap-2">
                <NavigationCard
                    href="/project"
                    title="Ver Informações do Projeto"
                    icon={<InfoIcon className="mx-auto text-primary" />}
                    relative={true}
                />
                <NavigationCard
                    href="/locations"
                    title="Ver Dados da Vistoria"
                    icon={
                        <ClipboardEditIcon className="mx-auto text-primary" />
                    }
                    relative={true}
                />
                <div className="w-full relative flex justify-start py-3">
                    <h2 className="text-xl font-sans bg-background px-2 ml-8">
                        PDFs
                    </h2>
                    <hr className="w-full h-px absolute border-foreground top-1/2 left-0 -z-10" />
                </div>
                <PDFGeneratorWrapper projectId="proj-123" />
            </div>
        </div>
    );
}
