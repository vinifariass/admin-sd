import Link from "next/link";
import { getAllFuncionarios, deleteFuncionario } from "@/lib/actions/funcionario.action";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@/auth";
const AdminFuncionariosPage = async (props: {
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

    const funcionarios = await getAllFuncionarios({
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
                            <Link href='/admin/products'>
                                <Button variant='outline' size='sm'>
                                    Remove Filter
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
                {session?.user?.tipo === 'ADMIN' && (
                    <Button asChild variant='default'>
                        <Link href='/admin/funcionarios/create'>Criar Funcionários</Link>
                    </Button>
                )}
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>NOME</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>EMAIL</TableHead>
                        <TableHead>TELEFONE</TableHead>
                        <TableHead>DATA DE LOCAÇÃO</TableHead>
                        <TableHead>DATA DE DEMISSÂO</TableHead>
                        {session?.user?.tipo !== 'MORADOR' && <TableHead className="w-[100px]">AÇÕES</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {funcionarios.data.map((funcionario) => (
                        <TableRow key={funcionario.id}>
                            <TableCell>{funcionario.nome}</TableCell>
                            <TableCell>{funcionario.cpf}</TableCell>
                            <TableCell>{funcionario.email}</TableCell>
                            <TableCell>{funcionario.telefone}</TableCell>
                            <TableCell>{funcionario.dataAdmissao ? formatDateTime(funcionario.dataAdmissao).dateOnly : ''}</TableCell>
                            <TableCell>{
                                funcionario.dataDemissao ? formatDateTime(funcionario.dataDemissao).dateOnly : ''
                            }</TableCell>
                            {session?.user?.tipo !== 'MORADOR' && (
                                <TableCell className="flex gap-1">
                                    <Button asChild variant='outline' size='sm'>
                                        <Link href={`/admin/funcionarios/${funcionario.id}`}>Editar</Link>
                                    </Button>
                                    {/* DELETE BUTTON */}
                                    {session?.user?.tipo === 'ADMIN' && (
                                        <DeleteDialog id={funcionario.id} action={deleteFuncionario} />
                                    )}
                                </TableCell>
                            )}

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {funcionarios?.totalPages > 1 && (
                <Pagination page={page} totalPages={funcionarios.totalPages} />
            )}
        </div></>);
}

export default AdminFuncionariosPage;