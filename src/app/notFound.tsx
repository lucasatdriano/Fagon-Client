export default function NotFound() {
    return (
        <div className="h-screen flex items-center justify-center flex-col text-center">
            <h1 className="text-4xl font-bold mb-4">
                404 - Página não encontrada
            </h1>
            <p className="text-lg text-gray-500">
                A página que você está procurando não existe ou foi movida.
            </p>
        </div>
    );
}
