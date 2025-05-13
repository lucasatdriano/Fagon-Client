import { useState, useEffect } from 'react';

export function useSearch<T>(
    searchFn: (query: string) => Promise<T[]> | T[],
    minChars = 3,
    debounceTime = 300,
) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (query.length >= minChars) {
                setIsLoading(true);
                setError(null);
                Promise.resolve(searchFn(query))
                    .then(setResults)
                    .catch((err) => {
                        setError(err.message);
                        console.error('Search error:', err);
                    })
                    .finally(() => setIsLoading(false));
            } else {
                setResults([]);
            }
        }, debounceTime);

        return () => clearTimeout(handler);
    }, [query, searchFn, minChars, debounceTime]);

    return { query, setQuery, results, isLoading, error };
}
