import Link from "next/link";
import { Plus, Calendar, CreditCard, AlertCircle, Eye } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";

import { getAllBoletos, getBoletosSummary } from "@/lib/actions/boleto.action";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import BoletoFilter from "@/components/admin/boleto-filter";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteBoleto } from "@/lib/actions/boleto.action";
import { auth } from "@/auth";

type SearchParams = {
    query?: string;
    page?: string;
    status?: string;
    apartamento?: string;
};

const AdminBoletosPage = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
    const resolvedSearchParams = await searchParams;
    const query = resolvedSearchParams.query || '';
    const page = Number(resolvedSearchParams.page) || 1;
    const status = resolvedSearchParams.status || '';
    const apartamento = resolvedSearchParams.apartamento || '';

    const session = await auth();

    const [boletos, summary] = await Promise.all([
        getAllBoletos({ query, page, status, apartamento }),
        getBoletosSummary(),
    ]);

    const isVencido = (dataVencimento: Date) => {
        return new Date(dataVencimento) < new Date() && !status;
    };

    const isVencendoHoje = (dataVencimento: Date) => {
        const hoje = new Date();
        const vencimento = new Date(dataVencimento);
        return vencimento.toDateString() === hoje.toDateString();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Boletos</h1>
                    <p className="text-muted-foreground">Gerencie os boletos do condomínio</p>
                </div>
                {session?.user?.tipo === 'ADMIN' && (
                    <Link href="/admin/boletos/create">
                        <Button className="flex items-center gap-2">
                            <Plus className="h-4 w-4" />
                            Novo Boleto
                        </Button>
                    </Link>
                )}
            </div>

            {/* Estatísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Boletos</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.boletosCount}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Boletos Pagos</CardTitle>
                        <CreditCard className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.boletosPagos}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.boletosVencidos}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Vencem Hoje</CardTitle>
                        <Calendar className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{summary.boletosVencendoHoje}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <BoletoFilter />

            {/* Tabela */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Boletos</CardTitle>
                </CardHeader>
                <CardContent>
                    {boletos.data.length > 0 ? (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Número</TableHead>
                                        <TableHead>Apartamento</TableHead>
                                        <TableHead>Morador</TableHead>
                                        <TableHead>Valor</TableHead>
                                        <TableHead>Vencimento</TableHead>
                                        <TableHead>Status</TableHead>
                                        {session?.user?.tipo !== 'MORADOR' && <TableHead>Ações</TableHead>}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {boletos.data.map((boleto: any) => (
                                        <TableRow key={boleto.id}>
                                            <TableCell className="font-medium">
                                                {boleto.numeroBoleto}
                                            </TableCell>
                                            <TableCell>{boleto.apartamento}</TableCell>
                                            <TableCell>
                                                {boleto.morador?.nome || 'Não informado'}
                                            </TableCell>
                                            <TableCell>
                                                {formatCurrency(boleto.valor)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {new Date(boleto.dataVencimento).toLocaleDateString('pt-BR')}
                                                    {isVencendoHoje(boleto.dataVencimento) && (
                                                        <Badge variant="secondary" className="text-orange-600">
                                                            Vence hoje
                                                        </Badge>
                                                    )}
                                                    {isVencido(boleto.dataVencimento) && !boleto.pago && (
                                                        <Badge variant="destructive">
                                                            Vencido
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={boleto.pago ? "default" : "secondary"}>
                                                    {boleto.pago ? 'Pago' : 'Não Pago'}
                                                </Badge>
                                            </TableCell>
                                            {session?.user?.tipo !== 'MORADOR' && (
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Link href={`/admin/boletos/${boleto.id}`}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <DeleteDialog
                                                            id={boleto.id}
                                                            action={deleteBoleto}
                                                        />
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {boletos.totalPages > 1 && (
                                <div className="mt-4 flex justify-center">
                                    <Pagination
                                        page={page}
                                        totalPages={boletos.totalPages}
                                    />
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <CreditCard className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-muted-foreground">
                                {query ? 'Nenhum boleto encontrado para sua busca' : 'Nenhum boleto cadastrado'}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminBoletosPage;
