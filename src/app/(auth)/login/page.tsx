'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (email === 'admin@teste.com' && password === '123456') {
            document.cookie = `token=fake-token; path=/;`;
            router.push('/projects');
        } else {
            alert('Credenciais inválidas');
        }
    };

    return (
        <div className="h-screen flex items-center justify-center">
            <Image
                width={200}
                height={200}
                src="/images/logo-vertical.svg"
                alt="Logo Fagon"
                priority
            />
            <form
                onSubmit={handleLogin}
                className="space-y-4 bg-white shadow-md p-6 rounded-lg w-full max-w-sm"
            >
                <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
                <input
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}
