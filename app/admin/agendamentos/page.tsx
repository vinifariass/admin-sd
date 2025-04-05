import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";
import { deleteAgendamento, getAllAgendamentos } from "@/lib/actions/agendamento-action";
const AdminAgendamentosPage = async (props: {
    searchParams: Promise<{
        page: string;
        query: string;
        category: string;
    }>;
}) => {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const searchText = searchParams.query || '';

    const agendamentos = await getAllAgendamentos({
        query: searchText,
        page,
    });


    return (<>
        <div className="space-y-2">
            <div className="flex-between">
                <div className="flex items-center gap-3">
                    <h1 className="h2-bold">
                        Agendamentos
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
                    <Link href='/admin/agendamentos/create'>Criar Agendamentos</Link>
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>NOME</TableHead>
                        <TableHead>HORARIO</TableHead>
                        <TableHead>DESCRICAO</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead>TIPO</TableHead>
                        <TableHead className="w-[100px]">AÇÕES</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {agendamentos.data.map((agendamento) => (
                        <TableRow key={agendamento.id}>
                            <TableCell>{agendamento.nome}</TableCell>
                            <TableCell>{agendamento.horario}</TableCell>
                            <TableCell>{agendamento.descricao}</TableCell>
                            <TableCell>{agendamento.status}</TableCell>
                            <TableCell>{agendamento.tipo}</TableCell>
                         
                            <TableCell className="flex gap-1">
                                <Button asChild variant='outline' size='sm'>
                                    <Link href={`/admin/agendamentos/${agendamento.id}`}>Editar</Link>
                                </Button>
                                {/* DELETE BUTTON */}
                                <DeleteDialog id={agendamento.id} action={deleteAgendamento} />
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {agendamentos?.totalPages > 1 && (
                <Pagination page={page} totalPages={agendamentos.totalPages} />
            )}
        </div></>);
}

export default AdminAgendamentosPage;