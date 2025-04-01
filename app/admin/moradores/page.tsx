import Link from "next/link";
import { getAllMoradores, deleteMorador } from "@/lib/actions/parking.action";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@/auth";
const AdminMoradoresPage = async (props: {
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

    const moradores = await getAllMoradores({
        query: searchText,
        page,
        // morador: morador
    });

    const session = await auth()
    return (<>
        <div className="space-y-2">
            <div className="flex-between">
                <div className="flex items-center gap-3">
                    <h1 className="h2-bold">
                        Moradores
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
                {
                    session?.user?.tipo === 'ADMIN' && (
                        <Button asChild variant='default'>
                        <Link href='/admin/moradores/create'>Criar Moradores</Link>
                    </Button>
                    )
                }
               
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>NOME</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>EMAIL</TableHead>
                        <TableHead>TELEFONE</TableHead>
                        <TableHead>DATA DE LOCAÇÃO</TableHead>
                        <TableHead>DATA DE SAÍDA</TableHead>
                        <TableHead className="w-[100px]">ACTIONS</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {moradores.data.map((morador) => (
                        <TableRow key={morador.id}>
                            <TableCell>{morador.nome}</TableCell>
                            <TableCell>{morador.cpf}</TableCell>
                            <TableCell>{morador.email}</TableCell>
                            <TableCell>{morador.telefone}</TableCell>
                            <TableCell>{formatDateTime(morador.dataLocacao).dateOnly}</TableCell>
                            <TableCell>{
                                morador.dataSaida ? formatDateTime(morador.dataSaida).dateOnly : ''
                            }</TableCell>
                            <TableCell className="flex gap-1">
                                <Button asChild variant='outline' size='sm'>
                                    <Link href={`/admin/moradores/${morador.id}`}>Editar</Link>
                                </Button>
                                {/* DELETE BUTTON */}
                                <DeleteDialog id={morador.id} action={deleteMorador} />
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {moradores?.totalPages > 1 && (
                <Pagination page={page} totalPages={moradores.totalPages} />
            )}
        </div></>);
}

export default AdminMoradoresPage;