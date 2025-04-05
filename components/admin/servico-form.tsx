'use client'

import { insertServicoSchema, updateServicoSchema } from "@/lib/validator";
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
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Servico } from "@/types";
import { servicoDefaultValues } from "@/lib/constants";
import { updateServico } from "@/lib/actions/recibo.action";
import { DatePicker } from "../ui/datepicker";
import { useState } from "react";
const ServicoForm = ({ type, servico, servicoId }: { type: 'Create' | 'Atualizar'; servico?: Servico, servicoId?: string }) => {


    const router = useRouter();
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const form = useForm<z.infer<typeof insertServicoSchema>>({
        resolver: zodResolver(type === 'Create' ? insertServicoSchema : updateServicoSchema),
        defaultValues: servico && type === 'Atualizar' ? servico : servicoDefaultValues,

    });


    //Possivel erro é porque esqueci o apartamento e implementar bloco tbm

    const onSubmit: SubmitHandler<z.infer<typeof insertServicoSchema>> = async (values) => {
        console.log(values)
        try {

            // Atualizar registro existente
            if (type === 'Atualizar' && servico?.id) {
                const res = await updateServico({ ...values, id: servico.id });
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                    router.push('/admin/servicos');

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
                        name="nomeServico"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/2">
                                <FormLabel>Nome do Serviço</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Paulo" {...field} />
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
                                <FormLabel>Data de Entrega</FormLabel>
                                <DatePicker
                                    value={typeof field.value === "string" ? new Date(field.value) : (field.value as Date | undefined)}
                                    onChange={field.onChange}
                                    name={field.name}
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
                        {form.formState.isSubmitting ? "Submitting..." : `${type} Serviço`}
                    </Button>
                </div>

            </form>
        </Form>
    </>);
}

export default ServicoForm;


