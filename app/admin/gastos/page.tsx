import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";
import { formatDateTime, parseSalary } from "@/lib/utils";
import { auth } from "@/auth";
import { deleteGasto, getAllGastos } from "@/lib/actions/gasto.action";
const AdminGastosPage = async (props: {
    searchParams: Promise<{
        page: string;
        query: string;
        category: string;
    }>;
}) => {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const searchText = searchParams.query || '';
    // const morador = searchParams.morador || '';

    const gastos = await getAllGastos({
        query: searchText,
        page,
        // morador: morador
    });

    const session = await auth();


    return (<>
        <div className="space-y-2">
            <div className="flex-between">
                <div className="flex items-center gap-3">
                    <h1 className="h2-bold">
                        Funcionários
                    </h1>
                    {searchText && (
                        <div>
                            Filtered by <i>&quot;{searchText}&quot;</i>{' '}
                            <Link href='/admin/gastos'>
                                <Button variant='outline' size='sm'>
                                    Remove Filter
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
                <Button asChild variant='default'>
                    <Link href='/admin/gastos/create'>Criar Gastos</Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>DESCRIÇÃO</TableHead>
                        <TableHead>DATA</TableHead>
                        <TableHead>VALOR</TableHead>
                        <TableHead className="w-[100px]">AÇÕES</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {gastos.data.map((gasto) => (
                        <TableRow key={gasto.id}>
                            <TableCell>{gasto.descricao}</TableCell>
                            <TableCell>{gasto.data ? formatDateTime(gasto.data).dateOnly : ''}</TableCell>
                            <TableCell>{parseSalary(String(gasto.valor))}</TableCell>
                          
                            <TableCell className="flex gap-1">
                                <Button asChild variant='outline' size='sm'>
                                    <Link href={`/admin/gastos/${gasto.id}`}>Editar</Link>
                                </Button>
                                {/* DELETE BUTTON */}
                                {session?.user?.tipo === 'admin' && (
                                    <DeleteDialog id={gasto.id} action={deleteGasto} />

                                )}
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {gastos?.totalPages > 1 && (
                <Pagination page={page} totalPages={gastos.totalPages} />
            )}
        </div></>);
}

export default AdminGastosPage;