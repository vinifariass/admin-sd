'use client'

import { insertEncomendaSchema, updateEncomendaSchema } from "@/lib/validator";
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
import { encomendaDefaultValues } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useEffect, useState } from "react";
import { Label } from "../ui/label";
import { Encomenda } from "@prisma/client";
import { DatePicker } from "../ui/datepicker";
import { createEncomenda, updateEncomenda } from "@/lib/actions/encomenda.action";
import { getAllMoradores } from "@/lib/actions/morador.action";

const EncomendaForm = ({ type, encomenda, encomendaId }: { type: 'Criar' | 'Atualizar'; encomenda?: Encomenda, encomendaId?: string }) => {


    const router = useRouter();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [moradores, setMoradores] = useState<{ id: string; nome: string }[]>([]);

    // Buscar todos os moradores do banco de dados
    useEffect(() => {
        const fetchMoradores = async () => {
            try {
                const data = await getAllMoradores();
                setMoradores(data)
            } catch (error) {
                console.error(error);
            }
        }
        fetchMoradores();
    }, []);



    const form = useForm<z.infer<typeof insertEncomendaSchema>>({
        resolver: zodResolver(type === 'Criar' ? insertEncomendaSchema : updateEncomendaSchema),
        defaultValues: encomenda && type === 'Atualizar' ? encomenda : encomendaDefaultValues,

    });


    const [status, setStatus] = useState<string>(encomenda?.status || "ENTREGUE");
    const [assinado, setAssinado] = useState<string>(encomenda?.assinado?.toString() || "true");

    //Possivel erro é porque esqueci o apartamento e implementar bloco tbm

    const onSubmit: SubmitHandler<z.infer<typeof insertEncomendaSchema>> = async (values) => {
        console.log("Dados enviados:", values);
        try {

            if (type === 'Criar') {
                const res = await createEncomenda(values);
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                }
            }

            // Atualizar registro existente
            if (type === 'Atualizar' && encomenda?.id) {
                const res = await updateEncomenda({ ...values, id: encomenda.id });
                if (!res.success) {
                    toast.error(res.message);
                } else {
                    toast.success(res.message);
                    router.push('/admin/encomendas');

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
                        name="numeroPedido"
                        render={({ field }) => (
                            <FormItem className="w-1/2 md:w-1/4">
                                <FormLabel>Numero do Pedido</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: 123" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="moradorId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Morador</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um morador" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {moradores.map((morador) => (
                                            <SelectItem key={morador.id} value={morador.id}>
                                                {morador.nome}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="moradorId"
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
                                        <SelectItem value="ENTREGUE">Entregue</SelectItem>
                                        <SelectItem value="DEVOLVIDO">Devolvido</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="assinado"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Assinado</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        const booleanValue = value === "true";
                                        field.onChange(booleanValue);
                                    }}
                                    defaultValue={field.value ? "true" : "false"}  >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione um status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="true">Sim</SelectItem>
                                        <SelectItem value="false">Não</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="assinadoPor"
                        render={({ field }) => (
                            <FormItem className="w-1/2 md:w-1/4">
                                <FormLabel>Assinado Por:</FormLabel>
                                <FormControl>
                                    <Input placeholder="Ex: Antônia" {...field} value={field.value ?? ""} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/*    <FormField
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
                    /> */}
                </div>
                {/* <div className="flex flex-col col-span-6 md:flex-row gap-5">
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
                                    defaultValue={field.value ?? ""}

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

                </div> */}


                {/* Botão de envio agora está dentro do <form> */}
                <div>
                    <Button
                        type="submit"
                        size="lg"
                        disabled={form.formState.isSubmitting}
                        className="w-full sm:w-3/4 md:w-1/2 lg:w-1/4"
                    >
                        {form.formState.isSubmitting ? "Submitting..." : `${type} Encomenda`}
                    </Button>
                </div>

            </form>
        </Form>
    </>);
}

export default EncomendaForm;


