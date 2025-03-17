import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BadgeDollarSign, Barcode, CreditCard, Users } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";
import Charts from "./charts";
import { getParkingSummary } from "@/lib/actions/parking.action";

export const metadata: Metadata = {
    title: 'Admin Overview',
}
const AdminOverviewPage = async () => {
 

    const summary = await getParkingSummary();

    console.log(summary);
    return (<>
        <div className="space-y-2">
            <h1 className="h2-bold">Dashboard</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Parking</CardTitle>
                        <BadgeDollarSign />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {summary.parkingsCount}
                        </div>
                    </CardContent>

                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Sales</CardTitle>
                        <CreditCard />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                          {/*   {formatNumber(summary.ordersCount)} */}
                        </div>
                    </CardContent>

                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Customers</CardTitle>
                        <Users />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                          {/*   {formatNumber(summary.usersCount)} */}
                        </div>
                    </CardContent>

                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Products</CardTitle>
                        <Barcode />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                         {/*    {formatNumber(summary.productsCount)} */}
                        </div>
                    </CardContent>

                </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* <Charts data={{
                            parkingsCount: summary.parkingsCount,
                        }} /> */}
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Sales</CardTitle>
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
    </>);
}

export default AdminOverviewPage;