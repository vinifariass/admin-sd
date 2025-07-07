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
    boletosSummary
}: {
    summary: any,
    summaryMoradores: any,
    agendamentos: any,
    funcionarios: any,
    gastos: any,
    encomendas?: any,
    encomendasSummary?: any,
    boletos?: any,
    boletosSummary?: any
}) {

    const session = await auth();
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
                                        <TableHead>AÇÕES</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {summary.latestVagas.map((vaga: any) => (
                                        <TableRow key={vaga.id}>
                                            <TableCell>{vaga?.nome || "Deleted User"}</TableCell>
                                            <TableCell>{vaga.cpf}</TableCell>
                                            <TableCell>{vaga.apartamento}</TableCell>
                                            <TableCell>

                                                {session?.user?.tipo === "ADMIN" && (
                                                    <Link href={`/admin/parkings/${vaga.id}`}>
                                                        <span className="px-2">Detalhes</span>
                                                    </Link>
                                                )}
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
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Gastos</CardTitle>
                                        <CircleDollarSign />
                                    </CardHeader>
                                    <CardContent>
                                        {/* Valor principal */}
                                        <div className="text-2xl font-bold">
                                            {formatCurrency(gastos.gastos.reduce((acc: any, gasto: any) => acc + gasto.valor, 0))}
                                        </div>
                                        {/* Descrição secundária */}
                                        <p className={`text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
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
                {/* Estatísticas das Encomendas */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Encomendas</CardTitle>
                            <Barcode />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatNumber(encomendasSummary?.encomendasCount || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Entregues</CardTitle>
                            <Barcode />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatNumber(encomendasSummary?.encomendasEntregues || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Assinadas</CardTitle>
                            <Barcode />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
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
                                        <TableHead>AÇÕES</TableHead>
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
                                            <TableCell>
                                                {session?.user?.tipo === "ADMIN" && (
                                                    <Link href={`/admin/encomendas/${encomenda.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            Detalhes
                                                        </Button>
                                                    </Link>
                                                )}
                                            </TableCell>
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
            <TabsContent value="boletos" className="space-y-4">
                {/* Estatísticas dos Boletos */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total de Boletos</CardTitle>
                            <Barcode />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatNumber(boletosSummary?.boletosCount || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Boletos Pagos</CardTitle>
                            <CircleDollarSign />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {formatNumber(boletosSummary?.boletosPagos || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
                            <CircleDollarSign />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatNumber(boletosSummary?.boletosVencidos || 0)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Vencem Hoje</CardTitle>
                            <CircleDollarSign />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
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
                                        <TableHead>AÇÕES</TableHead>
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
                                            <TableCell>
                                                {session?.user?.tipo === "ADMIN" && (
                                                    <Link href={`/admin/boletos/${boleto.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            Detalhes
                                                        </Button>
                                                    </Link>
                                                )}
                                            </TableCell>
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