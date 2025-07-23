import type { Metadata } from 'next';
import { Open_Sans, Montserrat, Poppins } from 'next/font/google';
import '../styles/globals.css';
import { Toaster } from 'sonner';

const openSans = Open_Sans({
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const montserrat = Montserrat({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const poppins = Poppins({
    weight: ['400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Sistema Fagon',
    description: 'Gestão de projetos e vistorias',
    icons: '/icons/logo-icon.svg',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-br" suppressHydrationWarning>
            <body
                className={`${openSans.className} ${montserrat.className} ${poppins.className} font-sans antialiased flex`}
            >
                {children}
                <Toaster richColors position="top-right" />
            </body>
        </html>
    );
}
