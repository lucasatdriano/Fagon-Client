'use client';

import { useEffect } from 'react';

export default function RegisterServiceWorker() {
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then(() => console.log('✅ Service Worker registrado'))
                .catch((err) => console.error('❌ SW erro:', err));
        }
    }, []);

    return null;
}
