'use client';

import { ReactNode, useState, useEffect } from 'react';
import { CopyIcon, KeyIcon, CheckIcon, ShieldPlusIcon } from 'lucide-react';
import { CustomFormInput } from '../forms/CustomFormInput';
import { CustomRadioGroup } from '../forms/CustomRadioGroup';
import { DropdownMenu } from './DropdownMenu';
import { toast } from 'react-toastify';

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
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const savedKey = localStorage.getItem(`accessKey_${projectId}`);
        if (savedKey) {
            const { key, expiresAt } = JSON.parse(savedKey);
            if (new Date(expiresAt) > new Date()) {
                setAccessKey(key);
                setExpiresAt(new Date(expiresAt));
            } else {
                localStorage.removeItem(`accessKey_${projectId}`);
            }
        }
    }, [projectId]);

    const generateRandomKey = () => {
        const parts = [
            Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, '0'),
            Math.floor(Math.random() * 1000000)
                .toString()
                .padStart(6, '0'),
            Math.floor(Math.random() * 100000000)
                .toString()
                .padStart(8, '0'),
        ];
        return parts.join('-');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText('fagon.com/accessKey');
        toast.success('Link copiado!');
    };

    const handleGenerateAccessKey = async () => {
        if (!cameraOption) return;

        setIsGenerating(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 800));

            const newKey = generateRandomKey();
            const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

            localStorage.setItem(
                `accessKey_${projectId}`,
                JSON.stringify({
                    key: newKey,
                    expiresAt: expirationDate.toISOString(),
                }),
            );

            setAccessKey(newKey);
            setExpiresAt(expirationDate);
            toast.success('Chave gerada com sucesso!');
        } catch (error) {
            toast.error('Erro ao gerar chave');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopyKey = () => {
        if (!accessKey) return;
        navigator.clipboard.writeText(accessKey);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('Chave copiada!');
    };

    const getRemainingTime = () => {
        if (!expiresAt) return '';
        const diff = expiresAt.getTime() - Date.now();
        if (diff <= 0) return 'Expirada';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        return `(Expira em ${hours}h ${minutes}m)`;
    };

    const items = [
        {
            label: 'Copiar Link do Vistoriador',
            action: handleCopyLink,
            icon: <CopyIcon className="w-5 h-5" />,
            className: 'cursor-pointer',
        },
        ...(!accessKey
            ? [
                  {
                      type: 'custom',
                      customContent: (
                          <div className="px-2 py-1">
                              <CustomRadioGroup
                                  options={[
                                      {
                                          id: 'no-camera',
                                          label: 'Sem câmera 360°',
                                      },
                                      {
                                          id: 'has-camera',
                                          label: 'Com câmera 360°',
                                      },
                                  ]}
                                  selectedValue={cameraOption}
                                  onChange={setCameraOption}
                                  name="camera-options"
                                  orientation="vertical"
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
                  type: 'custom',
                  customContent: (
                      <div className="px-2 py-1">
                          <div className="text-xs text-gray-500 mb-1">
                              Chave de Acesso {getRemainingTime()}
                          </div>
                          <div className="flex items-center gap-2">
                              <CustomFormInput
                                  value={accessKey}
                                  readOnly
                                  icon={<KeyIcon className="w-5 h-5" />}
                                  label="Chave"
                                  className="flex-1"
                              />
                              <button
                                  onClick={handleCopyKey}
                                  className="p-2 rounded-md hover:bg-gray-100"
                                  title="Copiar chave"
                              >
                                  {copied ? (
                                      <CheckIcon className="w-5 h-5 text-green-500" />
                                  ) : (
                                      <CopyIcon className="w-5 h-5" />
                                  )}
                              </button>
                          </div>
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
                      : '',
              },
    ];

    return (
        <DropdownMenu
            trigger={trigger}
            items={items}
            onOpenChange={setDropdownOpen}
        />
    );
}
