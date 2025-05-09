import type { Metadata } from 'next';
import { Open_Sans, Montserrat } from 'next/font/google';
import '../styles/globals.css';

const openSans = Open_Sans({
    variable: '--font-open-sans',
    weight: ['400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
});

const montserrat = Montserrat({
    variable: '--font-montserrat',
    weight: ['400', '600', '700'],
    subsets: ['latin'],
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'Sistema Fagon',
    description: 'Gestão de projetos e agências',
    icons: '/icons/logo-icon.svg',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-br">
            <body
                className={`${openSans.variable} ${montserrat.variable} font-sans antialiased flex `}
            >
                {children}
            </body>
        </html>
    );
}
