'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomButton } from '@/components/forms/CustomButton';
import { SearchCardList } from '@/components/forms/SearchCardList';
import { CustomDropdownInput } from '@/components/forms/CustomDropdownInput';
import { CustomRadioGroup } from '@/components/forms/CustomRadioGroup';
import { CustomFormInput } from '@/components/forms/CustomFormInput';
import { HashIcon } from 'lucide-react';
import { projectType } from '@/constants/projectType';

export default function CreateProjectPage() {
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [selectedPerson, setSelectedPerson] = useState('');
    const [upeCode, setUpeCode] = useState('');

    const peopleOptions = [
        { id: 'cinara', label: 'Cinara Aparecida Batista Goncalves' },
        { id: 'barbara', label: 'Bárbara Gonçalves' },
    ];

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        document.cookie = `token=fake-token; path=/;`;
        router.push('/projects');
    };

    return (
        <div className="h-screen w-full flex items-center justify-center">
            <form
                onSubmit={handleLogin}
                className="space-y-4 bg-primary grid place-items-center shadow-md p-6 rounded-lg w-full max-w-sm md:max-w-4xl"
            >
                <h1 className="text-2xl text-white mb-4 text-center font-sans">
                    Adicionar Novo Projeto
                </h1>

                <div className="w-full grid place-items-center gap-8">
                    <div className="grid grid-cols-2 w-full gap-6">
                        <CustomDropdownInput
                            options={projectType}
                            selectedOptionValue={selectedOption}
                            onOptionSelected={setSelectedOption}
                            placeholder="Selecione o Tipo do projeto*"
                        />
                        <CustomRadioGroup
                            name="people"
                            options={peopleOptions}
                            selectedValue={selectedPerson}
                            onChange={setSelectedPerson}
                            className="p-4 border rounded-lg row-span-2"
                            orientation="vertical"
                        />
                        <CustomFormInput
                            icon={<HashIcon />}
                            label="UPE do projeto*"
                            onChange={(e) => setUpeCode(e.target.value)}
                            value={upeCode}
                            type="text"
                            required
                        />
                    </div>
                    <div className="w-full grid gap-0 place-items-start">
                        <SearchCardList
                            onSelectAgency={(agency) =>
                                console.log('Agência selecionada:', agency)
                            }
                            searchAgencies={async (query) => {
                                const response = await fetch(
                                    `/api/agencies?q=${query}`,
                                );
                                return response.json();
                            }}
                        />
                        <p className="font-poppins">Selecione uma Agência*</p>
                    </div>
                </div>
                <div className="grid gap-4 pt-4">
                    <CustomButton
                        type="submit"
                        fontSize="text-lg"
                        className="hover:bg-secondary-hover"
                    >
                        Adicionar Projeto
                    </CustomButton>
                </div>
            </form>
        </div>
    );
}
