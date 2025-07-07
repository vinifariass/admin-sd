'use client'

import { insertMoradorSchema, updateMoradorSchema } from "@/lib/validator";
import { ptBR } from "date-fns/locale";
import { Morador } from "@/types";
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
import { moradorDefaultValues } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { createMorador, updateMorador, getAllUsuarios } from "@/lib/actions/morador.action";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

const MoradorForm = ({ type, morador, moradorId }: { type: 'Criar' | 'Atualizar'; morador?: Morador, moradorId?: string }) => {
    const router = useRouter();
    const [usuarios, setUsuarios] = useState<any[]>([]);

    // Buscar usuários ao carregar o componente
    useEffect(() => {
        const fetchUsuarios = async () => {
            const result = await getAllUsuarios();
            if (result.success) {
                setUsuarios(result.data || []);
            }
        };
        fetchUsuarios();
    }, []);

    const form = useForm<z.infer<typeof insertMoradorSchema>>({
        resolver: zodResolver(type === 'Criar' ? insertMoradorSchema : updateMoradorSchema),
        defaultValues: morador && type === 'Atualizar' ? morador : moradorDefaultValues,
    });


    const onSubmit: SubmitHandler<z.infer<typeof insertMoradorSchema>> = async (values) => {
        console.log(values)
        try {
            if (type === 'Criar') {
                const res = await createMorador(values);
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                }
            }

            // Atualizar registro existente
            if (type === 'Atualizar' && morador?.id) {
                const res = await updateMorador({ ...values, id: morador.id });
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                    router.push('/admin/moradores');

                }
            }
        } catch (error: any) {
            toast.error(error.message);

        }
    };

    return (<>
        <Form {...form}>
            {/* O onSubmit deve ficar dentro do <form> HTML */}
            <form method="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <div className="flex flex-col col-span-6 md:flex-row gap-5">
                    <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/2">
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Paulo" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CPF</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: 000.000.000-00"
                                        {...field}
                                        onChange={(e) => {
                                            // Remove espaços em branco do valor
                                            const cleanedValue = e.target.value.replace(/\s+/g, "");
                                            field.onChange(cleanedValue); // Atualiza o valor no formulário
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col col-span-6 md:flex-row gap-5">


                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: example@gmail.com" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="telefone"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: (99) 99999-9999" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="apartamento"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Apartamento</FormLabel>
                                <FormControl>
                                    <Input placeholder="401" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="usuarioId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Usuário Associado (Opcional)</FormLabel>
                                <Select
                                    onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                                    value={field.value || "none"}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um usuário" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="none">Nenhum usuário</SelectItem>
                                        {usuarios.map((usuario) => (
                                            <SelectItem key={usuario.id} value={usuario.id}>
                                                {usuario.name} ({usuario.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex flex-col col-span-6 md:flex-row gap-5">
                    <FormField
                        control={form.control}
                        name="dataLocacao"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data de Locação</FormLabel>
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
                                                    ? format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR }) // ✅ Agora em formato brasileiro
                                                    : <span>Selecione uma data</span>
                                                }
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={(date) => field.onChange(date ? date.toISOString() : "")} // ✅ Salva no formato ISO
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />




                </div>
                <div className="flex flex-col md:flex-row gap-5">


                    <FormField
                        control={form.control}
                        name="dataSaida"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data de Saída</FormLabel>
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
                                                    ? format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR }) // ✅ Agora em formato brasileiro
                                                    : <span>Selecione uma data</span>
                                                }
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={field.value ? new Date(field.value) : undefined}
                                            onSelect={(date) => field.onChange(date ? date.toISOString() : "")} // ✅ Salva no formato ISO
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>


                {/* Botão de envio agora está dentro do <form> */}
                <div>
                    <Button
                        type="submit"
                        size="lg"
                        disabled={form.formState.isSubmitting}
                        className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4"
                    >
                        {form.formState.isSubmitting ? "Submitting..." : `${type} Morador`}
                    </Button>
                </div>

            </form>
        </Form>
    </>);
}

export default MoradorForm;


