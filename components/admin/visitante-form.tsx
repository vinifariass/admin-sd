'use client'

import { insertVisitanteSchema, updateVisitanteSchema } from "@/lib/validator";
import { ptBR } from "date-fns/locale";
import { Visitante } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { visitanteDefaultValues } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { createVisitante, updateVisitante } from "@/lib/actions/visitante.action";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";

const VisitanteForm = ({ type, visitante, visitanteId }: { type: 'Criar' | 'Atualizar'; visitante?: Visitante, visitanteId?: string }) => {

    const router = useRouter();

    const form = useForm<z.infer<typeof insertVisitanteSchema>>({
        resolver: zodResolver(type === 'Criar' ? insertVisitanteSchema : updateVisitanteSchema),
        defaultValues: visitante && type === 'Atualizar' ? visitante : visitanteDefaultValues,
    });

    const onSubmit: SubmitHandler<z.infer<typeof insertVisitanteSchema>> = async (values) => {
        try {
            if (type === 'Criar') {
                const res = await createVisitante(values);
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                    router.push('/admin/visitantes');
                }
            }

            if (type === 'Atualizar' && visitante?.id) {
                const res = await updateVisitante({ ...values, id: visitante.id });
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                    router.push('/admin/visitantes');
                }
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <Form {...form}>
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Nome e CPF */}
                <div className="flex flex-col col-span-6 md:flex-row gap-5">
                    <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/2">
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: João Silva" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/2">
                                <FormLabel>CPF</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: 000.000.000-00"
                                        {...field}
                                        onChange={(e) => {
                                            const cleanedValue = e.target.value.replace(/\s+/g, "");
                                            field.onChange(cleanedValue);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Email e Telefone */}
                <div className="flex flex-col col-span-6 md:flex-row gap-5">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/2">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: joao@exemplo.com" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/2">
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: (11) 99999-9999" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Apartamento e Status */}
                <div className="flex flex-col col-span-6 md:flex-row gap-5">
                    <FormField
                        control={form.control}
                        name="apartamento"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/3">
                                <FormLabel>Apartamento</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: 401" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/3">
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="AGENDADO">Agendado</SelectItem>
                                        <SelectItem value="AUTORIZADO">Autorizado</SelectItem>
                                        <SelectItem value="CHEGOU">Chegou</SelectItem>
                                        <SelectItem value="SAIU">Saiu</SelectItem>
                                        <SelectItem value="CANCELADO">Cancelado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="horario"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/3">
                                <FormLabel>Horário</FormLabel>
                                <FormControl>
                                    <Input 
                                        placeholder="Ex: 14:30" 
                                        {...field} 
                                        type="time"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Data da Visita */}
                <div className="flex flex-col md:flex-row gap-5">
                    <FormField
                        control={form.control}
                        name="dataVisita"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data da Visita</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-[280px] justify-start text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value
                                                    ? format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR })
                                                    : <span>Selecione uma data</span>
                                                }
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={(date) => field.onChange(date ? date.toISOString() : "")}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Autorização */}
                <div className="flex flex-col md:flex-row gap-5">
                    <FormField
                        control={form.control}
                        name="autorizado"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>Autorizado</FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="autorizadoPor"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Autorizado Por</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome do responsável" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Observações */}
                <FormField
                    control={form.control}
                    name="observacoes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                                <Textarea 
                                    placeholder="Observações sobre a visita..."
                                    {...field}
                                    value={field.value || ""}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Botão de envio */}
                <div>
                    <Button
                        type="submit"
                        size="lg"
                        disabled={form.formState.isSubmitting}
                        className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4"
                    >
                        {form.formState.isSubmitting ? "Enviando..." : `${type} Visitante`}
                    </Button>
                </div>

            </form>
        </Form>
    );
}

export default VisitanteForm;
