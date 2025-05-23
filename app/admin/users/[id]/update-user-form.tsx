'use client'

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUser } from "@/lib/actions/user.action";
import { USER_ROLES } from "@/lib/constants";
import { updateUserSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const UpdateUserForm = ({ user }: {
    user: z.infer<typeof updateUserSchema>
}) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof updateUserSchema>>({
        resolver: zodResolver(updateUserSchema),
        defaultValues: user
    })

    const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
        try {
            const res = await updateUser({
                ...values,
                id: user.id
            });
            if (!res.success) {
                toast.error(res.message);
                return;
            }
            form.reset();
            router.push('/admin/users');
        } catch (error: any) {
            toast.error(error.message);
        }
    }


    return (<Form {...form}>
        <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
                <FormField name="email"
                    control={form.control}
                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'email'> }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input disabled={true} placeholder="Enter user email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
            </div>
            {/* Name */}
            <div>
                <FormField name="name"
                    control={form.control}
                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'name'> }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Preencha o nome de usuário" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>

                    )}
                />
            </div>
            {/* Role */}
            <div>
                <FormField name="tipo"
                    control={form.control}
                    render={({ field }: { field: ControllerRenderProps<z.infer<typeof updateUserSchema>, 'tipo'> }) => (
                        <FormItem className='w-full'>
                            <FormLabel>Tipo de Usuário</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder='Selecione um tipo' />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {USER_ROLES.map((tipo) => (
                                        <SelectItem key={tipo} value={tipo}>{tipo.charAt(0).toUpperCase() + tipo.slice(1)}</SelectItem>
                                    ))}
                                </SelectContent>


                            </Select>
                            <FormMessage />
                        </FormItem>

                    )}
                />
            </div>
            <div className="flex-between mt-4">
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Atualizando...' : 'Atualizar Usuário'}
                </Button></div>
        </form>
    </Form>);
}

export default UpdateUserForm;