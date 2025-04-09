'use client'

import { insertGastoSchema, updateGastoSchema } from "@/lib/validator";
import { ptBR } from "date-fns/locale"; // Importa a localidade brasileira
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
import { gastoDefaultValues } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { DatePicker } from "../ui/datepicker";
import { Gasto } from "@/types";
import { createGasto, updateGasto } from "@/lib/actions/gasto.action";

const categorias = ["Manutenção", "RH", "Copa", "TI", "Serviços Gerais"];

const GastoForm = ({ type, gasto, gastoId }: { type: 'Criar' | 'Atualizar'; gasto?: Gasto, gastoId?: string }) => {

    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const form = useForm<z.infer<typeof insertGastoSchema>>({
        resolver: zodResolver(type === 'Criar' ? insertGastoSchema : updateGastoSchema),
        defaultValues: gasto && type === 'Atualizar' ? gasto : gastoDefaultValues,

    });
    //Possivel erro é porque esqueci o apartamento e implementar bloco tbm

    const onSubmit: SubmitHandler<z.infer<typeof insertGastoSchema>> = async (values) => {
        try {
            if (type === 'Criar') {
                const res = await createGasto(values);
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                }
            }

            // Atualizar registro existente
            if (type === 'Atualizar' && gasto?.id) {
                const res = await updateGasto({ ...values, id: gasto.id });
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                    router.push('/admin/gastos');

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
                    {/* <FormField
                        control={form.control}
                        name="categoria"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categoria</FormLabel>
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
                    /> */}

                    <FormField
                        control={form.control}
                        name="data"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Data</FormLabel>
                                <DatePicker
                                    value={field.value || null} // Certifique-se de que o valor seja null quando vazio
                                    onChange={(newValue) => field.onChange(newValue)} // Atualiza o estado do react-hook-form
                                />
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
                                <Input
                                    type="text"
                                    inputMode="decimal"
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(e.target.value)}
                                />
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
                        {form.formState.isSubmitting ? "Submitting..." : `${type} Gasto`}
                    </Button>
                </div>

            </form>
        </Form>
    </>);
}

export default GastoForm;



