'use client'

import { createParking, updateParking } from "@/lib/actions/parking.action";
import { insertParkingSchema, updateParkingSchema } from "@/lib/validator";
import { Parking } from "@/types";
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
import { parkingDefaultValues } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";

const ParkingForm = ({ type, parking, parkingId }: { type: 'Criar' | 'Update'; parking?: Parking, parkingId?: string }) => {


    const router = useRouter();
    const [tipoMorador, setTipoMorador] = useState<string>(parking?.tipoMorador || "Proprietario");


    const form = useForm<z.infer<typeof insertParkingSchema>>({
        resolver: zodResolver(type === 'Criar' ? insertParkingSchema : updateParkingSchema),
        defaultValues: parking && type === 'Update' ? parking : parkingDefaultValues,

    });

    console.log(form.formState.errors);

    const onSubmit: SubmitHandler<z.infer<typeof insertParkingSchema>> = async (values) => {
        console.log(values)
        try {
            if (type === 'Criar') {
                const res = await createParking(values);
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                    router.push('/admin/parkings');

                }
            }

            // Atualizar registro existente
            if (type === 'Update' && parking?.id) {
                const res = await updateParking({ ...values, id: parking.id });
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                    router.push('/admin/parkings');

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
                <div className="flex flex-col col-span-6  md:flex-row gap-5">

                    <FormField
                        control={form.control}
                        name="tipoMorador"
                        render={({ field }) => (
                            <FormItem

                            >
                                <FormLabel>Tipo de Morador</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        setTipoMorador(value);
                                    }}
                                    defaultValue={field.value}
                                >
                                    <FormControl >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um tipo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Proprietario">Proprietário</SelectItem>
                                        <SelectItem value="Inquilino">Inquilino</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Campo Dinâmico (Nome ou Administrador) */}
                    <FormField
                        control={form.control}
                        name="nome"
                        render={({ field }) => (
                            <FormItem
                                className="w-1/4"
                            >
                                <FormLabel>{tipoMorador === "Proprietario" ? "Nome do Proprietário" : "Administrador"}</FormLabel>
                                <FormControl>
                                    <Input placeholder={tipoMorador === "Proprietario" ? "Ex: João Silva" : "Ex: Síndico"} {...field} />
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
                                    <Input placeholder="Ex: 000.000.000-00" {...field} />
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
                                    <Input placeholder="Ex: 101" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="placa"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Placa</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: ABC-1234" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="carro"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Carro</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Honda Civic" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cor"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cor</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Preto" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div>
                    {/* Botão de envio agora está dentro do <form> */}
                    <Button
                        type="submit"
                        size="lg"
                        disabled={form.formState.isSubmitting}
                        className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4"
                    >
                        {form.formState.isSubmitting ? "Enviando..;." : `${type} Vaga`}
                    </Button>

                </div>
            </form>
        </Form>
    </>);
}

export default ParkingForm;


