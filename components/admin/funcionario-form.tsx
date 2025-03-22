'use client'

import { insertFuncionarioSchema, updateFuncionarioSchema } from "@/lib/validator";
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
import { createMorador, updateMorador } from "@/lib/actions/morador.action";
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn, parseSalary } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { createFuncionario, updateFuncionario } from "@/lib/actions/funcionario.action";
import { Label } from "../ui/label";

const MoradorForm = ({ type, funcionario, funcionarioId }: { type: 'Create' | 'Atualizar'; funcionario?: Funcionario, funcionarioId?: string }) => {


    const router = useRouter();


    const form = useForm<z.infer<typeof insertFuncionarioSchema>>({
        resolver: zodResolver(type === 'Create' ? insertFuncionarioSchema : updateFuncionarioSchema),
        defaultValues: funcionario && type === 'Atualizar' ? funcionario : funcionarioDefaultValues,

    });

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
                                    <Input placeholder="Ex: 000.000.000-00" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cargo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cargo</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Porteiro" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="salario"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Salário</FormLabel>
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

                    <FormField
                        control={form.control}
                        name="dataAdmissao"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data de Admissão</FormLabel>
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
                <div className="flex flex-col col-span-6 md:flex-row gap-5">
                    <FormField
                        control={form.control}
                        name="dataDemissao"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data de Demissão</FormLabel>
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

                    <FormField
                        control={form.control}
                        name="endereco"
                        render={({ field }) => (
                            <FormItem className="w-full md:w-1/3">
                                <FormLabel>Endereço</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Estrada dos Tres, 126" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="departamento"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Departamento</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Recursos Humanos" {...field} value={field.value ?? ""} />
                                </FormControl>
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
                                    defaultValue={field.value}

                                >
                                    <FormControl >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="ATIVO">Ativo</SelectItem>
                                        <SelectItem value="INATIVO">Inativo</SelectItem>
                                        <SelectItem value="AFASTADO">Afastado</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />




                </div>
                <div className="flex flex-col md:flex-row gap-5">

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
                        name="dataNascimento"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data de Nascimento</FormLabel>
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

                    <FormField
                        control={form.control}
                        name="pis"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>PIS</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: example@gmail.com" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="rg"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>RG</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: 99.999.999-9" {...field} value={field.value ?? ""} />
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

export default MoradorForm;


