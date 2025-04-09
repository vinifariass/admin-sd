'use client'

import { insertGastoSchema, updateGastoSchema } from "@/lib/validator";
import { ptBR } from "date-fns/locale"; // Importa a localidade brasileira
import { Funcionario } from "@/types";
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
import { funcionarioDefaultValues } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { createFuncionario, updateFuncionario } from "@/lib/actions/funcionario.action";
import { Textarea } from "../ui/textarea";
import { DatePicker } from "../ui/datepicker";

const categorias = ["Manutenção", "RH", "Copa", "TI", "Serviços Gerais"];

const GastoForm = ({ type, funcionario, funcionarioId }: { type: 'Create' | 'Atualizar'; funcionario?: Funcionario, funcionarioId?: string }) => {

    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const form = useForm<z.infer<typeof insertGastoSchema>>({
        resolver: zodResolver(type === 'Create' ? insertGastoSchema : updateGastoSchema),
        defaultValues: funcionario && type === 'Atualizar' ? funcionario : funcionarioDefaultValues,

    });


    const handleSelectCategoria = (value: string) => {
        form.setValue("categoria", value);
    };

    const [status, setStatus] = useState<string>(funcionario?.status || "Ativo");

    //Possivel erro é porque esqueci o apartamento e implementar bloco tbm

    const onSubmit: SubmitHandler<z.infer<typeof insertFuncionarioSchema>> = async (values) => {
        console.log(values)
        try {
            if (type === 'Create') {
                const res = await createFuncionario(values);
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                }
            }

            // Atualizar registro existente
            if (type === 'Atualizar' && funcionario?.id) {
                const res = await updateFuncionario({ ...values, id: funcionario.id });
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                    router.push('/admin/funcionarios');

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
                        name="descricao"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/2">
                                <FormLabel>Descrição</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Ex: Paulo" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="categoria"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Valor (R$)</FormLabel>
                                <FormControl>
                                    <Select onValueChange={handleSelectCategoria}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categorias.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="data"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data de Entrega</FormLabel>
                                <DatePicker value={selectedDate} onChange={setSelectedDate} />
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
                                    <div key="1" className="grid w-full max-w-sm items-center gap-1.5">
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <span className="text-gray-500 dark:text-gray-400">$</span>
                                            </div>
                                            <Input
                                                className="pl-9 border border-gray-300 dark:border-gray-600"
                                                placeholder="Enter salary"
                                                type="number"
                                                {...field}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    // Converte o valor para inteiro antes de atualizar o formulário
                                                    field.onChange(value === "" ? null : parseInt(value, 10));
                                                }}
                                            />
                                        </div>
                                    </div>
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
                        {form.formState.isSubmitting ? "Submitting..." : `${type} Morador`}
                    </Button>
                </div>

            </form>
        </Form>
    </>);
}

export default GastoForm;


