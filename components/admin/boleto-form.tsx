'use client'
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";

import { insertBoletoSchema, updateBoletoSchema } from "@/lib/validator";
import { createBoleto, updateBoleto } from "@/lib/actions/boleto.action";
import { boletoDefaultValues } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/datepicker";
import { getAllMoradores } from "@/lib/actions/morador.action";
import { useEffect } from "react";

type BoletoFormProps = {
    type: 'Criar' | 'Atualizar';
    boleto?: any;
    boletoId?: string;
}

const BoletoForm = ({ type, boleto, boletoId }: BoletoFormProps) => {
    const [moradores, setMoradores] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        async function fetchMoradores() {
            try {
                const moradoresData = await getAllMoradores();
                setMoradores(moradoresData);
            } catch (error) {
                console.error('Erro ao buscar moradores:', error);
            }
        }
        fetchMoradores();
    }, []);

    const form = useForm<z.infer<typeof insertBoletoSchema>>({
        resolver: zodResolver(type === 'Criar' ? insertBoletoSchema : updateBoletoSchema),
        defaultValues: boleto && type === 'Atualizar' ? boleto : boletoDefaultValues,
    });

    const onSubmit: SubmitHandler<z.infer<typeof insertBoletoSchema>> = async (values) => {
        setIsLoading(true);
        
        try {
            if (type === 'Criar') {
                const res = await createBoleto(values);
                if (res.success) {
                    toast.success(res.message);
                    router.push('/admin/boletos');
                } else {
                    toast.error(res.message);
                }
            } else {
                const res = await updateBoleto({ ...values, id: boletoId! });
                if (res.success) {
                    toast.success(res.message);
                    router.push('/admin/boletos');
                } else {
                    toast.error(res.message);
                }
            }
        } catch (error) {
            toast.error('Erro interno do servidor');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>{type} Boleto</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="numeroBoleto"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Número do Boleto</FormLabel>
                                        <FormControl>
                                            <Input placeholder="00000000000000000000" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="codigoBarras"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Código de Barras</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="00000000000000000000000000000000000000000000" 
                                                maxLength={44}
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="apartamento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Apartamento</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex: 101, 202, 303" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="moradorId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Morador (Opcional)</FormLabel>
                                        <Select
                                            onValueChange={(value) => field.onChange(value === "none" ? undefined : value)}
                                            value={field.value || "none"}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecione um morador" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="none">Nenhum morador</SelectItem>
                                                {moradores.map((morador) => (
                                                    <SelectItem key={morador.id} value={morador.id}>
                                                        {morador.nome}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="valor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valor</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                step="0.01" 
                                                placeholder="0.00" 
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dataVencimento"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data de Vencimento</FormLabel>
                                        <FormControl>
                                            <DatePicker 
                                                value={field.value ? new Date(field.value) : undefined}
                                                onChange={(date) => field.onChange(date)}
                                                name="dataVencimento"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="observacoes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Observações</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Observações sobre o boleto (opcional)"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.push('/admin/boletos')}
                                disabled={isLoading}
                            >
                                Cancelar
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Salvando...' : `${type} Boleto`}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default BoletoForm;
