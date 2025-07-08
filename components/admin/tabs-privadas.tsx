import Link from "next/link";
import { Car, Users, Barcode, DoorClosed, CircleDollarSign } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

import { formatCurrency, formatNumber } from "@/lib/utils";
import FuncionarioTable from "@/app/admin/funcionarios/funcionarios-table";

import Charts from "@/app/admin/overview/charts";
import ListaAgendamentos from "@/app/admin/overview/agendamentos";
import EnviarNotificacao from "@/components/admin/enviar-notificacao";
import { auth } from "@/auth";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts'
import FinanceiroCharts from "@/app/admin/overview/finaceiro-charts";

const chartData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 4000 },
    { month: 'May', revenue: 6000 },
    { month: 'Jun', revenue: 7000 },
]


export default async function TabsPrivadas({ 
    summary, 
    summaryMoradores, 
    agendamentos, 
    funcionarios, 
    gastos, 
    encomendas, 
    encomendasSummary,
    boletos,
    boletosSummary,
    session
}: {
    summary: any,
    summaryMoradores: any,
    agendamentos: any,
    funcionarios: any,
    gastos: any,
    encomendas?: any,
    encomendasSummary?: any,
    boletos?: any,
    boletosSummary?: any,
    session?: any
}) {

    const variation = gastos.variation;
    const formattedVariation = variation.toFixed(1);
    const isPositive = variation >= 0;

    return (

        <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="flex flex-wrap overflow-x-auto gap-2 border p-2 rounded-md bg-muted">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
                <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
                <TabsTrigger value="encomendas">Encomendas</TabsTrigger>
                <TabsTrigger value="boletos">Boletos</TabsTrigger>
            </TabsList>

            {/* Conteúdo da aba DASHBOARD */}
            <TabsContent value="dashboard" className="space-y-6">
                {/* Estatísticas */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {/* Total de Vagas */}
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100">Total de Vagas</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Car className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">{summary.parkingsCount}</div>
                        </CardContent>
                    </Card>

                    {/* Moradores */}
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 dark:from-emerald-600 dark:via-emerald-700 dark:to-teal-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-100">Moradores</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">
                                {formatNumber(summaryMoradores.moradoresCount)}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Funcionários */}
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 dark:from-purple-600 dark:via-purple-700 dark:to-violet-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-100">Funcionários</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <DoorClosed className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">—</div>
                        </CardContent>
                    </Card>

                    {/* Encomendas */}
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 dark:from-orange-600 dark:via-orange-700 dark:to-red-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-orange-100">Encomendas</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Barcode className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">
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
                                        {session?.user?.tipo !== 'MORADOR' && <TableHead>AÇÕES</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {summary.latestVagas.map((vaga: any) => (
                                        <TableRow key={vaga.id}>
                                            <TableCell>{vaga?.nome || "Deleted User"}</TableCell>
                                            <TableCell>{vaga.cpf}</TableCell>
                                            <TableCell>{vaga.apartamento}</TableCell>
                                            {session?.user?.tipo !== 'MORADOR' && (
                                                <TableCell>
                                                    {session?.user?.tipo === "ADMIN" && (
                                                        <Link href={`/admin/parkings/${vaga.id}`}>
                                                            <span className="px-2">Detalhes</span>
                                                        </Link>
                                                    )}
                                                </TableCell>
                                            )}
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
                    {session?.user?.tipo === 'ADMIN' && session.user.id && (
                        <EnviarNotificacao 
                            remetente={session.user.id}
                            remetenteNome={session.user.name || 'Administrador'}
                        />
                    )}
                </div>
            </TabsContent>

            {/* Conteúdo da aba FUNCIONÁRIOS */}
            <TabsContent value="financeiro" className="space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Financeiro</CardTitle>
                    </CardHeader>
                    <CardContent>

                        <CardContent className="p-6 pt-0 pb-0">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">

                                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-green-600 dark:from-emerald-600 dark:via-emerald-700 dark:to-green-700 shadow-xl">
                                    <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                                    <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                                    <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium text-emerald-100">Gastos</CardTitle>
                                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <CircleDollarSign className="w-5 h-5 text-white" />
                                        </div>
                                    </CardHeader>
                                    <CardContent className="relative">
                                        {/* Valor principal */}
                                        <div className="text-2xl font-bold text-white">
                                            {formatCurrency(gastos.gastos.reduce((acc: any, gasto: any) => acc + gasto.valor, 0))}
                                        </div>
                                        {/* Descrição secundária */}
                                        <p className={`text-xs ${isPositive ? "text-emerald-200" : "text-red-200"}`}>
                                            {isPositive ? "+" : ""}
                                            {formattedVariation}% em relação ao mês anterior
                                        </p>
                                    </CardContent>
                                </Card>

                                <FinanceiroCharts data={{ gastosData: gastos.gastosData }} />
                            </div>

                        </CardContent>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Conteúdo da aba FUNCIONÁRIOS */}
            <TabsContent value="funcionarios" className="space-y-6">
                {/* Estatísticas dos Funcionários */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100">Total de Funcionários</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">
                                {formatNumber(funcionarios?.data?.length || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 dark:from-emerald-600 dark:via-emerald-700 dark:to-teal-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-100">Ativos</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <DoorClosed className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">
                                {formatNumber(funcionarios?.data?.filter((f: any) => f.ativo)?.length || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-500 via-red-600 to-rose-600 dark:from-red-600 dark:via-red-700 dark:to-rose-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-red-100">Inativos</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <DoorClosed className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">
                                {formatNumber(funcionarios?.data?.filter((f: any) => !f.ativo)?.length || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 dark:from-purple-600 dark:via-purple-700 dark:to-violet-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-100">Departamentos</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Users className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">
                                {formatNumber(new Set(funcionarios?.data?.map((f: any) => f.departamento)).size || 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabela de Funcionários */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Lista de Funcionários</CardTitle>
                        {session?.user?.tipo === "ADMIN" && (
                            <Link href="/admin/funcionarios">
                                <Button variant="outline" size="sm">
                                    Gerenciar Funcionários
                                </Button>
                            </Link>
                        )}
                    </CardHeader>
                    <CardContent>
                        <FuncionarioTable funcionarios={funcionarios?.data} />
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Conteúdo da aba ENCOMENDAS */}
            <TabsContent value="encomendas" className="space-y-6">
                {/* Estatísticas das Encomendas */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100">Total de Encomendas</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Barcode className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">
                                {formatNumber(encomendasSummary?.encomendasCount || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 dark:from-emerald-600 dark:via-emerald-700 dark:to-teal-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-100">Entregues</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Barcode className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">
                                {formatNumber(encomendasSummary?.encomendasEntregues || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-500 via-purple-600 to-violet-600 dark:from-purple-600 dark:via-purple-700 dark:to-violet-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-purple-100">Assinadas</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Barcode className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">
                                {formatNumber(encomendasSummary?.encomendasAssinadas || 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Lista de Encomendas Recentes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Encomendas Recentes</CardTitle>
                        {session?.user?.tipo === "ADMIN" && (
                            <Link href="/admin/encomendas">
                                <Button variant="outline" size="sm">
                                    Ver Todas
                                </Button>
                            </Link>
                        )}
                    </CardHeader>
                    <CardContent>
                        {encomendas && encomendas.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>NÚMERO DO PEDIDO</TableHead>
                                        <TableHead>MORADOR</TableHead>
                                        <TableHead>DATA DE ENTREGA</TableHead>
                                        <TableHead>STATUS</TableHead>
                                        {session?.user?.tipo !== 'MORADOR' && <TableHead>AÇÕES</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {encomendas.map((encomenda: any) => (
                                        <TableRow key={encomenda.id}>
                                            <TableCell className="font-medium">
                                                {encomenda.numeroPedido}
                                            </TableCell>
                                            <TableCell>
                                                {encomenda.morador?.nome || "Morador não encontrado"}
                                            </TableCell>
                                            <TableCell>
                                                {encomenda.dataEntrega 
                                                    ? new Date(encomenda.dataEntrega).toLocaleDateString('pt-BR')
                                                    : "Não entregue"
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    encomenda.dataAssinatura 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : encomenda.dataEntrega 
                                                            ? 'bg-blue-100 text-blue-800' 
                                                            : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {encomenda.dataAssinatura 
                                                        ? 'Assinada' 
                                                        : encomenda.dataEntrega 
                                                            ? 'Entregue' 
                                                            : 'Aguardando'
                                                    }
                                                </span>
                                            </TableCell>
                                            {session?.user?.tipo !== 'MORADOR' && (
                                                <TableCell>
                                                    {session?.user?.tipo === "ADMIN" && (
                                                        <Link href={`/admin/encomendas/${encomenda.id}`}>
                                                            <Button variant="outline" size="sm">
                                                                Detalhes
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Barcode className="mx-auto h-12 w-12 mb-4" />
                                <p>Nenhuma encomenda encontrada</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Conteúdo da aba BOLETOS */}
            <TabsContent value="boletos" className="space-y-6">
                {/* Estatísticas dos Boletos */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-600 dark:via-blue-700 dark:to-indigo-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-blue-100">Total de Boletos</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Barcode className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">
                                {formatNumber(boletosSummary?.boletosCount || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 dark:from-emerald-600 dark:via-emerald-700 dark:to-teal-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-100">Boletos Pagos</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <CircleDollarSign className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">
                                {formatNumber(boletosSummary?.boletosPagos || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-red-500 via-red-600 to-rose-600 dark:from-red-600 dark:via-red-700 dark:to-rose-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-red-100">Vencidos</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <CircleDollarSign className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">
                                {formatNumber(boletosSummary?.boletosVencidos || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 dark:from-orange-600 dark:via-orange-700 dark:to-amber-700 shadow-xl">
                        <div className="absolute inset-0 bg-black/10 dark:bg-white/5"></div>
                        <div className="absolute -right-4 -top-4 w-16 h-16 bg-white/10 rounded-full"></div>
                        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-orange-100">Vencem Hoje</CardTitle>
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <CircleDollarSign className="w-5 h-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative">
                            <div className="text-3xl font-bold text-white">
                                {formatNumber(boletosSummary?.boletosVencendoHoje || 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Lista de Boletos Recentes */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Boletos Recentes</CardTitle>
                        {session?.user?.tipo === "ADMIN" && (
                            <Link href="/admin/boletos">
                                <Button variant="outline" size="sm">
                                    Ver Todos
                                </Button>
                            </Link>
                        )}
                    </CardHeader>
                    <CardContent>
                        {boletos && boletos.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>NÚMERO</TableHead>
                                        <TableHead>APARTAMENTO</TableHead>
                                        <TableHead>MORADOR</TableHead>
                                        <TableHead>VALOR</TableHead>
                                        <TableHead>VENCIMENTO</TableHead>
                                        <TableHead>STATUS</TableHead>
                                        {session?.user?.tipo !== 'MORADOR' && <TableHead>AÇÕES</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {boletos.map((boleto: any) => (
                                        <TableRow key={boleto.id}>
                                            <TableCell className="font-medium">
                                                {boleto.numeroBoleto}
                                            </TableCell>
                                            <TableCell>
                                                {boleto.apartamento}
                                            </TableCell>
                                            <TableCell>
                                                {boleto.morador?.nome || "Não informado"}
                                            </TableCell>
                                            <TableCell>
                                                {formatCurrency(boleto.valor)}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(boleto.dataVencimento).toLocaleDateString('pt-BR')}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    boleto.pago 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : new Date(boleto.dataVencimento) < new Date()
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {boleto.pago 
                                                        ? 'Pago' 
                                                        : new Date(boleto.dataVencimento) < new Date()
                                                            ? 'Vencido'
                                                            : 'Não Pago'
                                                    }
                                                </span>
                                            </TableCell>
                                            {session?.user?.tipo !== 'MORADOR' && (
                                                <TableCell>
                                                    {session?.user?.tipo === "ADMIN" && (
                                                        <Link href={`/admin/boletos/${boleto.id}`}>
                                                            <Button variant="outline" size="sm">
                                                                Detalhes
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Barcode className="mx-auto h-12 w-12 mb-4" />
                                <p>Nenhum boleto encontrado</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}