'use client'

import { insertMoradorSchema, updateMoradorSchema } from "@/lib/validator";
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
import { createMorador, updateMorador } from "@/lib/actions/morador.action";

const MoradorForm = ({ type, morador,moradorId }: { type: 'Create' | 'Update'; morador?: Morador , moradorId?: string}) => {


    const router = useRouter();


    const form = useForm<z.infer<typeof insertMoradorSchema>>({
        resolver: zodResolver(type === 'Create' ? insertMoradorSchema : updateMoradorSchema),
        defaultValues: morador && type === 'Update' ? morador : moradorDefaultValues,

    });

    console.log(form.formState.errors);

    const onSubmit: SubmitHandler<z.infer<typeof insertMoradorSchema>> = async (values) => {
        console.log(values)
        try {
            if (type === 'Create') {
                const res = await createMorador(values);
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                }
            }

            // Atualizar registro existente
            if (type === 'Update' && morador?.id) {
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
                        name="apartamento"
                        render={({ field }) => (
                            <FormItem >
                                <FormLabel>Apartamento</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: 101" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: ABC-1234" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-col md:flex-row gap-5">
                    <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>CPF</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: 000.000.000-00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: example@gmail.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                </div>


                {/* Botão de envio agora está dentro do <form> */}
                <div className="w-1/4">
                    <Button type="submit" size='lg' disabled={form.formState.isSubmitting}
                        className="button col-span-2 w-full"
                    >
                        {form.formState.isSubmitting ? "Submitting..." : `${type} Parking`}
                    </Button>
                </div>

            </form>
        </Form>
    </>);
}

export default MoradorForm;


