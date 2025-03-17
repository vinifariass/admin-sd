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

const ParkingForm = ({ type, parking,parkingId }: { type: 'Create' | 'Update'; parking?: Parking , parkingId?: string}) => {


    const router = useRouter();


    const form = useForm<z.infer<typeof insertParkingSchema>>({
        resolver: zodResolver(type === 'Create' ? insertParkingSchema : updateParkingSchema),
        defaultValues: parking && type === 'Update' ? parking : parkingDefaultValues,

    });

    console.log(form.formState.errors);

    const onSubmit: SubmitHandler<z.infer<typeof insertParkingSchema>> = async (values) => {
        console.log(values)
        try {
            if (type === 'Create') {
                const res = await createParking(values);
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
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
                </div>
                <div className="flex flex-col md:flex-row gap-5">
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

export default ParkingForm;


