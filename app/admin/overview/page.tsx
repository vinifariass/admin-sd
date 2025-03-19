import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Car, Users, Barcode, CreditCard } from "lucide-react"; // Alterado: Car para vagas e Users para moradores
import { Metadata } from "next";
import Link from "next/link";
import Charts from "./charts";
import { getMoradoresSummary, getParkingSummary } from "@/lib/actions/parking.action";
import { formatNumber } from "@/lib/utils";

export const metadata: Metadata = {
    title: 'Admin Overview',
}

const AdminOverviewPage = async () => {
    const summary = await getParkingSummary();
    const summaryMoradores = await getMoradoresSummary();

    console.log(summary);

    return (
        <div className="space-y-2">
            <h1 className="h2-bold">Dashboard</h1>
            
            {/* Estatísticas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total de Vagas */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total de Vagas</CardTitle>
                        <Car /> {/* Ícone de carro para vagas */}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {summary.parkingsCount}
                        </div>
                    </CardContent>
                </Card>

                {/* Moradores */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Moradores</CardTitle>
                        <Users /> {/* Ícone de usuário para moradores */}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatNumber(summaryMoradores.moradoresCount)}
                        </div>
                    </CardContent>
                </Card>

                {/* Customers */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Customers</CardTitle>
                        <CreditCard />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {/* {formatNumber(summary.usersCount)} */}
                        </div>
                    </CardContent>
                </Card>

                {/* Produtos */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Barcode />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {/* {formatNumber(summary.productsCount)} */}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Gráfico + Vendas Recentes */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Gráfico de Vagas */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Charts data={{ vagasData: summary.vagasData }} />
                    </CardContent>
                </Card>

                {/* Vendas Recentes */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Vagas Recentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>BUYER</TableHead>
                                    <TableHead>DATE</TableHead>
                                    <TableHead>TOTAL</TableHead>
                                    <TableHead>ACTIONS</TableHead>
                                </TableRow>
                            </TableHeader>
                            {/* <TableBody>
                                {summary.latestSales.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>
                                            {order?.user?.name || 'Deleted User'}
                                        </TableCell>
                                        <TableCell>
                                            {formatDateTime(order.createdAt).dateOnly}
                                        </TableCell>
                                        <TableCell>
                                            {formatCurrency(order.totalPrice)}
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/order/${order.id}`}>
                                                <span className="px-2">Details</span>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody> */}
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default AdminOverviewPage;
