'use client';

import { ReactNode, useState, useEffect } from 'react';
import {
    CopyIcon,
    KeyIcon,
    CheckIcon,
    ShieldPlusIcon,
    BanIcon,
} from 'lucide-react';
import { CustomRadioGroup } from '../forms/CustomRadioGroup';
import { DropdownMenu } from './DropdownMenu';
import { toast } from 'sonner';
import { AuthService } from '../../services/domains/authService';
import { ProjectService } from '../../services/domains/projectService';
import { cameraType } from '../../constants';
import { CustomReadOnlyFormInput } from '../forms/CustomReadOnlyFormInput';
import { formatNumberAgency } from '@/utils/formatters/formatNumberAgency';

interface AdminDropdownMenuProps {
    trigger: ReactNode;
    projectId?: string;
}

export function AdminDropdownMenu({
    trigger,
    projectId,
}: AdminDropdownMenuProps) {
    const [cameraOption, setCameraOption] = useState<string>('');
    const [accessKey, setAccessKey] = useState<string>('');
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);
    const [copied, setCopied] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isRevoking, setIsRevoking] = useState(false);
    const [projectData, setProjectData] = useState<{
        agencyName: string;
        agencyNumber: string;
    } | null>(null);

    useEffect(() => {
        if (!projectId) return;

        const fetchProjectData = async () => {
            try {
                const response = await ProjectService.getById(projectId);
                const project = response.data;
                setProjectData({
                    agencyName: project.agency.name,
                    agencyNumber: project.agency.agencyNumber,
                });
            } catch (error) {
                console.error('Erro ao buscar dados do projeto:', error);
            }
        };

        fetchProjectData();

        const savedKey = localStorage.getItem(`accessKey_${projectId}`);
        if (savedKey) {
            const { key, expiresAt } = JSON.parse(savedKey);
            const expiryDate = new Date(expiresAt);

            if (expiryDate > new Date()) {
                setAccessKey(key);
                setExpiresAt(expiryDate);
            } else {
                localStorage.removeItem(`accessKey_${projectId}`);
                setAccessKey('');
                setExpiresAt(null);
            }
        }
    }, [projectId]);

    const handleCopyLink = () => {
        if (!projectData) {
            toast.error('Dados do projeto não carregados');
            return;
        }

        const { agencyName, agencyNumber } = projectData;

        const message = `🔗 Link de acesso à vistoria - ${agencyName} (AG. ${formatNumberAgency(
            agencyNumber,
        )}):\nhttps://fagon.vercel.app/accessKey\n\nClique no link acima para abrir a página onde você deve colar a chave de acesso.\n\n👉 A chave que deverá ser copiada será enviada logo em seguida.`;

        navigator.clipboard.writeText(message);
        toast.success('Link copiado com sucesso!');
    };

    const handleGenerateAccessKey = async () => {
        if (!cameraOption || !projectId) return;

        setIsGenerating(true);
        const toastId = toast.loading('Gerando chave...');

        try {
            const response = await AuthService.generateAccessKey({
                projectId,
                cameraType:
                    cameraOption === 'camera_360' ? 'camera_360' : 'normal',
            });

            const { token, expiresAt: expiryDate } = response.data;

            const newExpiresAt = new Date(expiryDate);
            setAccessKey(token);
            setExpiresAt(newExpiresAt);

            localStorage.setItem(
                `accessKey_${projectId}`,
                JSON.stringify({
                    key: token,
                    expiresAt: newExpiresAt.toISOString(),
                }),
            );

            toast.success('Chave gerada!', { id: toastId });
        } catch (error) {
            console.error('[ERROR] Falha na geração:', error);
            toast.error('Erro ao gerar chave');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleRevokeAccessKey = async () => {
        if (!accessKey || !projectId) return;

        setIsRevoking(true);
        const toastId = toast.loading('Cancelando chave...');

        try {
            await AuthService.revokeAccessKey(accessKey);

            setAccessKey('');
            setExpiresAt(null);
            localStorage.removeItem(`accessKey_${projectId}`);

            toast.success('Chave cancelada com sucesso!', { id: toastId });
        } catch (error) {
            console.error('[ERROR] Falha na revogação:', error);
            toast.error('Erro ao cancelar chave');
        } finally {
            setIsRevoking(false);
        }
    };

    const handleCopyKey = () => {
        if (!accessKey) return;
        navigator.clipboard.writeText(accessKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Chave de acesso copiada para a área de transferência!');
    };

    const getRemainingTime = () => {
        if (!expiresAt) return '';

        const now = new Date();
        const diff = expiresAt.getTime() - now.getTime();

        if (diff <= 0) {
            localStorage.removeItem(`accessKey_${projectId}`);
            setAccessKey('');
            setExpiresAt(null);
            return 'Expirada';
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `(Expira em ${days} ${
                days === 1 ? 'dia' : 'dias'
            } e ${hours} ${hours === 1 ? 'hora' : 'horas'})`;
        } else if (hours > 0) {
            return `(Expira em ${hours} ${
                hours === 1 ? 'hora' : 'horas'
            } e ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'})`;
        } else {
            return `(Expira em ${minutes} ${
                minutes === 1 ? 'minuto' : 'minutos'
            })`;
        }
    };

    const items = [
        {
            label: 'Copiar Link do Vistoriador',
            action: handleCopyLink,
            icon: <CopyIcon className="w-5 h-5" />,
            className: 'cursor-pointer',
            disabled: !projectData,
        },
        ...(!accessKey
            ? [
                  {
                      label: '',
                      type: 'custom' as const,
                      customContent: (
                          <div className="px-2 py-1">
                              <CustomRadioGroup
                                  options={cameraType}
                                  selectedValue={cameraOption}
                                  onChange={setCameraOption}
                                  name="camera-options"
                                  className="space-y-2"
                                  textColor="text-foreground"
                                  borderColor="border-foreground"
                                  checkedBorderColor="border-primary"
                              />
                          </div>
                      ),
                  },
              ]
            : []),
        accessKey
            ? {
                  label: '',
                  type: 'custom' as const,
                  customContent: (
                      <div className="px-2 py-1 space-y-2">
                          <div className="text-xs text-gray-500 mb-1">
                              Chave de Acesso {getRemainingTime()}
                          </div>
                          <div className="flex items-center gap-2">
                              <CustomReadOnlyFormInput
                                  value={accessKey}
                                  icon={<KeyIcon className="w-5 h-5" />}
                                  label="Chave"
                                  className="flex-1"
                              />
                              <button
                                  onClick={handleCopyKey}
                                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                                  title="Copiar chave"
                              >
                                  {copied ? (
                                      <CheckIcon className="w-5 h-5 text-green-500" />
                                  ) : (
                                      <CopyIcon className="w-5 h-5" />
                                  )}
                              </button>
                          </div>
                          <button
                              onClick={handleRevokeAccessKey}
                              disabled={isRevoking}
                              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              <BanIcon className="w-4 h-4" />
                              {isRevoking ? 'Cancelando...' : 'Cancelar Chave'}
                          </button>
                      </div>
                  ),
              }
            : {
                  label: isGenerating ? 'Gerando...' : 'Gerar Chave',
                  action: handleGenerateAccessKey,
                  icon: <ShieldPlusIcon className="w-5 h-5" />,
                  disabled: !cameraOption || isGenerating,
                  className: !cameraOption
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer',
              },
    ];

    return (
        <DropdownMenu trigger={trigger} items={items} onOpenChange={() => {}} />
    );
}
