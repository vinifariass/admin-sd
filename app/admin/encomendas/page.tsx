import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";
import { formatDateTime } from "@/lib/utils";
import { getAllEncomendas,deleteEncomenda } from "@/lib/actions/encomenda.action";
import { useEffect } from "react";
import EncomendaList from "./encomenda-list";
const AdminEncomendaPage = async (props: {
    searchParams: Promise<{
        page: string;
        query: string;
        category: string;
    }>, moradorId: string;
}) => {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const searchText = searchParams.query || '';
    // const morador = searchParams.morador || '';

    const encomendas = await getAllEncomendas({
        query: searchText,
        page,
    });


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
                            <Link href='/admin/products'>
                                <Button variant='outline' size='sm'>
                                    Remove Filter
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
                <Button asChild variant='default'>
                    <Link href='/admin/funcionarios/create'>Criar Funcionários</Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>NUMERO DO PEDIDO</TableHead>
                        <TableHead>MORADOR</TableHead>
                        <TableHead>DATA DE ENTREGA</TableHead>
                        <TableHead>DATA DE ASSINATURA</TableHead>
                        <TableHead className="w-[100px]">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {encomendas.data.map((encomenda) => (
                        <TableRow key={encomenda.id}>
                            <TableCell>{encomenda.numeroPedido}</TableCell>
                            <TableCell><EncomendaList moradorId={encomenda.moradorId} /></TableCell>
                            
                            <TableCell>{encomenda.dataEntrega ? formatDateTime(encomenda.dataEntrega).dateOnly : ''}</TableCell>
                            <TableCell>{encomenda.dataAssinatura ? formatDateTime(encomenda.dataAssinatura).dateOnly : ''}</TableCell>
                          
                            <TableCell className="flex gap-1">
                                <Button asChild variant='outline' size='sm'>
                                    <Link href={`/admin/encomendas/${encomenda.id}`}>Edit</Link>
                                </Button>
                                {/* DELETE BUTTON */}
                                <DeleteDialog id={encomenda.id} action={deleteEncomenda} />
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {encomendas?.totalPages > 1 && (
                <Pagination page={page} totalPages={encomendas.totalPages} />
            )}
        </div></>);
}

export default AdminEncomendaPage;