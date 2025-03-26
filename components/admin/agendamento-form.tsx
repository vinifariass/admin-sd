'use client'

import { insertAgendamentoSchema, insertFuncionarioSchema, updateAgendamentoSchema } from "@/lib/validator";
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
import { agendamentoDefaultValues } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Agendamento } from "@prisma/client";
import { createAgendamento, updateAgendamento } from "@/lib/actions/agendamento-action";

const AgendamentoForm = ({ type, agendamento, agendamentoId }: { type: 'Create' | 'Atualizar'; agendamento?:Agendamento, agendamentoId?: string }) => {


    const router = useRouter();


    const form = useForm<z.infer<typeof insertAgendamentoSchema>>({
        resolver: zodResolver(type === 'Create' ? insertAgendamentoSchema : updateAgendamentoSchema),
        defaultValues: agendamento && type === 'Atualizar' ? agendamento : agendamentoDefaultValues,

    });

    const [status, setStatus] = useState<string>(agendamento?.status || "Ativo");

    const onSubmit: SubmitHandler<z.infer<typeof insertAgendamentoSchema>> = async (values) => {
        try {
            if (type === 'Create') {
                const res = await createAgendamento(values);
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                }
            }

            // Atualizar registro existente
            if (type === 'Atualizar' && agendamento?.id) {
                const res = await updateAgendamento({ ...values, id: agendamento.id });
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                    router.push('/admin/agendamentos');

                }
            }
        } catch (error: any) {
            toast.error(error.message);

        }
    };

    useEffect(() => {
        console.log("Erros de validação:", form.formState.errors);
    }, [form.formState.errors]);

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
                        name="horario"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Horário</FormLabel>
                                <Input
                                    type="time"
                                    id="time"
                                    aria-label="Choose time"
                                    className="w-full"
                                    {...field}
                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />


                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem

                            >
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setStatus(value);
                                    }}
                                    defaultValue={field.value ?? ""}

                                >
                                    <FormControl >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="CONFIRMADO">Confirmado</SelectItem>
                                        <SelectItem value="PENDENTE">Pendente</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="tipo"
                        render={({ field }) => (
                            <FormItem

                            >
                                <FormLabel>Tipo</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setStatus(value);
                                    }}
                                    defaultValue={field.value ?? ""}

                                >
                                    <FormControl >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="CONFIRMADO">Visitante</SelectItem>
                                        <SelectItem value="PRESTADOR">Prestador</SelectItem>
                                    </SelectContent>
                                </Select>
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

                </div>
                <div className="flex flex-col md:flex-row gap-5">


                    <FormField
                        control={form.control}
                        name="descricao"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Descrição</FormLabel>
                                <FormControl>
                                    <Textarea {...field} />
                                </FormControl>
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
                        {form.formState.isSubmitting ? "Submitting..." : `${type} Agendamento`}
                    </Button>
                </div>

            </form>
        </Form>
    </>);
}

export default AgendamentoForm;


