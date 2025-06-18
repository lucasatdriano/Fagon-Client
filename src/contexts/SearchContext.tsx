'use client';
import { createContext, useContext } from 'react';

type SearchContextType = {
    searchValue: string;
    handleSearchChange: (value: string) => void;
};

const SearchContext = createContext<SearchContextType>({
    searchValue: '',
    handleSearchChange: () => {},
});

export function SearchProvider({
    children,
    value,
}: {
    children: React.ReactNode;
    value: SearchContextType;
}) {
    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    return useContext(SearchContext);
}
