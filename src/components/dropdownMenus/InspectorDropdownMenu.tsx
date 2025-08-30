'use client';

import { ReactNode, useState, useEffect } from 'react';
import { MessageCircle, Link, MapPin } from 'lucide-react';
import { DropdownMenu } from './DropdownMenu';
import { toast } from 'sonner';
import { InspectorService } from '@/services/domains/inspectorService';
import { AgencyService } from '@/services/domains/agencyService';
import { agencyProps } from '@/interfaces/agency';
import { inspectorProps } from '@/interfaces/inspector';
import {
    formatStateToAbbreviation,
    formatWhatsAppNumber,
    getFirstName,
} from '@/utils/formatters';

interface InspectorDropdownMenuProps {
    trigger: ReactNode;
    inspectorId: string;
    agencyId: string;
}

export function InspectorDropdownMenu({
    trigger,
    inspectorId,
    agencyId,
}: InspectorDropdownMenuProps) {
    const [inspector, setInspectorData] = useState<inspectorProps>();
    const [agency, setAgencyData] = useState<agencyProps>();

    useEffect(() => {
        const loadData = async () => {
            try {
                const inspectorResponse = await InspectorService.getById(
                    inspectorId,
                );
                const inspector = inspectorResponse.data;
                if (inspector) {
                    setInspectorData(inspector);
                }

                if (agencyId) {
                    const agencyResponse = await AgencyService.getById(
                        agencyId,
                    );
                    const agency = agencyResponse.data;
                    if (agency) {
                        setAgencyData(agency);
                    }
                }
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
                toast.error('Não foi possível carregar os dados');
            }
        };

        loadData();
    }, [inspectorId, agencyId]);

    const getGreeting = (): string => {
        const hour = new Date().getHours();

        if (hour >= 5 && hour < 12) {
            return 'Bom dia';
        } else if (hour >= 12 && hour < 18) {
            return 'Boa tarde';
        } else {
            return 'Boa noite';
        }
    };

    const handleRequestInspection = () => {
        if (!inspector?.phone) {
            toast.error('Número do vistoriador não disponível');
            return;
        }

        const formattedPhone = formatWhatsAppNumber(inspector.phone);
        const greeting = getGreeting();
        const inspectorFirstName = inspector.name
            ? getFirstName(inspector.name)
            : 'Vistoriador';

        const formattedState = agency?.state
            ? formatStateToAbbreviation(agency.state)
            : '';
        const agencyInfo =
            agency?.city && formattedState
                ? `na agência de ${agency.city} - ${formattedState}`
                : '';

        const message =
            encodeURIComponent(`${greeting}, ${inspectorFirstName}! Tudo bem?

            Gostaria de saber se você poderia realizar uma vistoria para a Fagon ${agencyInfo}.
        `);

        window.open(
            `https://wa.me/${formattedPhone}?text=${message}`,
            '_blank',
        );
        toast.success('Redirecionando para WhatsApp...');
    };

    const handleSendInstructions = () => {
        if (!inspector?.phone) {
            toast.error('Número do vistoriador não disponível');
            return;
        }

        const formattedPhone = formatWhatsAppNumber(inspector.phone);

        const message =
            encodeURIComponent(`Vou te enviar um link para acessar o sistema de vistoria. Lá você poderá realizar a vistoria completa, tirando fotos e preenchendo todas as informações necessárias.

            Qualquer dúvida, estou à disposição!
        `);

        window.open(
            `https://wa.me/${formattedPhone}?text=${message}`,
            '_blank',
        );
        toast.success('Enviando instruções...');
    };

    const handleSendAddress = () => {
        if (!inspector?.phone || !agency) {
            toast.error('Dados não disponíveis');
            return;
        }

        const formattedPhone = formatWhatsAppNumber(inspector.phone);

        const formattedState = agency.state
            ? formatStateToAbbreviation(agency.state)
            : '';

        const message =
            encodeURIComponent(`Endereço da Agência: ${agency.street}, ${agency.number} - ${agency.city}/${formattedState}

            Qualquer dúvida sobre a localização, estou à disposição!
        `);

        window.open(
            `https://wa.me/${formattedPhone}?text=${message}`,
            '_blank',
        );
        toast.success('Enviando endereço...');
    };

    const handleSendMessage = () => {
        if (!inspector?.phone) {
            toast.error('Número do vistoriador não disponível');
            return;
        }

        const formattedPhone = formatWhatsAppNumber(inspector.phone);
        window.open(`https://wa.me/${formattedPhone}`, '_blank');
        toast.success('Abrindo conversa no WhatsApp...');
    };

    const items = [
        {
            label: 'Solicitar Vistoria',
            action: handleRequestInspection,
            icon: <MessageCircle className="w-5 h-5" />,
            className: 'cursor-pointer',
        },
        {
            label: 'Enviar Instruções',
            action: handleSendInstructions,
            icon: <Link className="w-5 h-5" />,
            className: 'cursor-pointer',
        },
        {
            label: 'Enviar Endereço',
            action: handleSendAddress,
            icon: <MapPin className="w-5 h-5" />,
            className: 'cursor-pointer',
        },
        {
            label: 'Enviar Mensagem',
            action: handleSendMessage,
            icon: <MessageCircle className="w-5 h-5" />,
            className: 'cursor-pointer',
        },
    ];

    return (
        <DropdownMenu trigger={trigger} items={items} onOpenChange={() => {}} />
    );
}
