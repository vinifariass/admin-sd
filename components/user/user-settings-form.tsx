'use client'

import { useState } from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const UserSettingsForm = () => {
    const { theme, setTheme } = useTheme();
    const [isLoading, setIsLoading] = useState(false);

    const themes = [
        {
            value: 'light',
            label: 'Claro',
            icon: Sun,
            description: 'Interface clara e brilhante'
        },
        {
            value: 'dark',
            label: 'Escuro',
            description: 'Interface escura e moderna',
            icon: Moon
        },
        {
            value: 'system',
            label: 'Sistema',
            description: 'Segue a preferência do sistema',
            icon: Monitor
        }
    ];

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        toast.success(`Tema alterado para ${themes.find(t => t.value === newTheme)?.label}`);
    };

    const handleSaveSettings = async () => {
        setIsLoading(true);
        
        try {
            // Simular salvamento de configurações
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success("Configurações salvas com sucesso!");
        } catch (error) {
            toast.error("Erro ao salvar configurações");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Theme Selection */}
            <div>
                <Label className="text-base font-medium">Tema da Interface</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Escolha como você prefere visualizar a interface
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {themes.map((themeOption) => {
                        const Icon = themeOption.icon;
                        const isSelected = theme === themeOption.value;
                        
                        return (
                            <Card
                                key={themeOption.value}
                                className={`cursor-pointer transition-all hover:shadow-md ${
                                    isSelected 
                                        ? 'ring-2 ring-primary border-primary' 
                                        : 'hover:border-gray-300 dark:hover:border-gray-600'
                                }`}
                                onClick={() => handleThemeChange(themeOption.value)}
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${
                                            isSelected 
                                                ? 'bg-primary text-white' 
                                                : 'bg-gray-100 dark:bg-gray-800'
                                        }`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium">{themeOption.label}</h3>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {themeOption.description}
                                            </p>
                                        </div>
                                        {isSelected && (
                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>

            <Separator />

            {/* Language & Region */}
            <div>
                <Label className="text-base font-medium">Idioma e Região</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Configurações de idioma e localização
                </p>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-medium">Idioma</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Português (Brasil)
                            </p>
                        </div>
                        <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                            Alterar
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-medium">Fuso Horário</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                (UTC-03:00) Brasília
                            </p>
                        </div>
                        <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                            Alterar
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-medium">Formato de Data</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                DD/MM/AAAA
                            </p>
                        </div>
                        <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                            Alterar
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            {/* Accessibility */}
            <div>
                <Label className="text-base font-medium">Acessibilidade</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Configurações para melhorar a acessibilidade
                </p>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-medium">Alto Contraste</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Aumenta o contraste para melhor visibilidade
                            </p>
                        </div>
                        <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                            Em breve
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                            <h3 className="font-medium">Tamanho da Fonte</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Ajusta o tamanho do texto na interface
                            </p>
                        </div>
                        <div className="text-sm text-blue-600 hover:text-blue-700 cursor-pointer">
                            Em breve
                        </div>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button 
                    onClick={handleSaveSettings}
                    disabled={isLoading}
                >
                    {isLoading ? 'Salvando...' : 'Salvar Configurações'}
                </Button>
            </div>
        </div>
    );
};

export default UserSettingsForm;
