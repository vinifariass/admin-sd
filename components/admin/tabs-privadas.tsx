import Link from "next/link";
import { Car, Users, Barcode, DoorClosed } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import { formatNumber } from "@/lib/utils";
import FuncionarioTable from "@/app/admin/funcionarios/funcionarios-table";

import Charts from "@/app/admin/overview/charts";
import ListaAgendamentos from "@/app/admin/overview/agendamentos";
import EnviarNotificacao from "@/app/admin/overview/notificacoes";
import { useSession } from "next-auth/react"
import { useEffect } from "react";
import { auth } from "@/auth";


export default async function TabsPrivadas({ summary, summaryMoradores, agendamentos, funcionarios }:{
    summary: any,
    summaryMoradores: any,
    agendamentos: any,
    funcionarios: any
}) {
      
    return ( 

        <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="flex flex-wrap overflow-x-auto gap-2 border p-2 rounded-md bg-muted">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
            <TabsTrigger value="encomendas">Encomendas</TabsTrigger>
        </TabsList>

        {/* Conteúdo da aba DASHBOARD */}
        <TabsContent value="dashboard" className="space-y-4">
            {/* Estatísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total de Vagas */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Vagas</CardTitle>
                        <Car />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.parkingsCount}</div>
                    </CardContent>
                </Card>

                {/* Moradores */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Moradores</CardTitle>
                        <Users />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(summaryMoradores.moradoresCount)}
                        </div>
                    </CardContent>
                </Card>

                {/* Funcionários */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
                        <DoorClosed />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">—</div>
                    </CardContent>
                </Card>

                {/* Encomendas */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Encomendas</CardTitle>
                        <Barcode />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(summary.encomendasCount)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Gráfico + Vendas Recentes */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Gráfico */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Visão Geral</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Charts data={{ vagasData: summary.vagasData }} />
                    </CardContent>
                </Card>

                {/* Vagas Recentes */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Vagas Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>NOME</TableHead>
                                    <TableHead>CPF</TableHead>
                                    <TableHead>APARTAMENTO</TableHead>
                                    <TableHead>ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {summary.latestVagas.map((vaga) => (
                                    <TableRow key={vaga.id}>
                                        <TableCell>{vaga?.nome || "Deleted User"}</TableCell>
                                        <TableCell>{vaga.cpf}</TableCell>
                                        <TableCell>{vaga.apartamento}</TableCell>
                                        <TableCell>
                                            <Link href={`/admin/parkings/${vaga.id}`}>
                                                <span className="px-2">Details</span>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {/* Agendamentos + Notificações */}
            <div className="grid gap-4 md:grid-cols-2">
                <ListaAgendamentos agendamentos={agendamentos} />
                <EnviarNotificacao />
            </div>
        </TabsContent>

        {/* Conteúdo da aba FUNCIONÁRIOS */}
        <TabsContent value="funcionarios" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Funcionários</CardTitle>
                </CardHeader>
                <CardContent>

                    <CardContent>
                        <FuncionarioTable funcionarios={funcionarios.data} />
                    </CardContent>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Conteúdo da aba ENCOMENDAS */}
        <TabsContent value="encomendas" className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Encomendas</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Em breve: listagem de encomendas.</p>
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
     );
}