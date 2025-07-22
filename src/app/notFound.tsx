import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-svh flex items-center justify-center flex-col text-center">
            <h1 className="text-4xl font-bold mb-4">
                404 - Página não encontrada
            </h1>
            <p className="text-lg text-gray-500">
                A página que você está procurando não existe ou foi movida.
            </p>
            <Link
                href="/"
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Voltar para a página inicial
            </Link>
        </div>
    );
}
