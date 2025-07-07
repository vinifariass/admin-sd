import Link from "next/link";
import { getAllVisitantes, deleteVisitante } from "@/lib/actions/visitante.action";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@/auth";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import VisitantesFilter from "@/components/admin/visitantes-filter";

const AdminVisitantesPage = async (props: {
    searchParams: Promise<{
        page: string;
        query: string;
        status: string;
    }>;
}) => {
    const searchParams = await props.searchParams;

    const page = Number(searchParams.page) || 1;
    const searchText = searchParams.query || '';
    const status = searchParams.status || '';

    const visitantes = await getAllVisitantes({
        query: searchText,
        page,
        status,
    });

    const session = await auth();

    const getStatusBadge = (status: string, autorizado: boolean) => {
        if (autorizado) {
            return <Badge className="bg-green-100 text-green-800">Autorizado</Badge>;
        }
        
        switch (status) {
            case 'AGENDADO':
                return <Badge className="bg-blue-100 text-blue-800">Agendado</Badge>;
            case 'CHEGOU':
                return <Badge className="bg-purple-100 text-purple-800">Chegou</Badge>;
            case 'SAIU':
                return <Badge className="bg-gray-100 text-gray-800">Saiu</Badge>;
            case 'CANCELADO':
                return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex-between">
                <div className="flex items-center gap-3">
                    <h1 className="h2-bold">Visitantes</h1>
                    {searchText && (
                        <div>
                            Filtrado por <i>&quot;{searchText}&quot;</i>{' '}
                            <Link href='/admin/visitantes'>
                                <Button variant='outline' size='sm'>
                                    Remover Filtro
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
                {session?.user?.tipo === 'ADMIN' && (
                    <Button asChild variant='default'>
                        <Link href='/admin/visitantes/create'>Criar Visitante</Link>
                    </Button>
                )}
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
                <div className="flex-1">
                    <form method="GET" className="flex gap-2">
                        <Input
                            name="query"
                            placeholder="Buscar por nome, CPF, apartamento..."
                            defaultValue={searchText}
                            className="max-w-sm"
                        />
                        <input type="hidden" name="status" value={status} />
                        <Button type="submit" variant="outline">
                            Buscar
                        </Button>
                    </form>
                </div>
                <div className="flex gap-2">
                    <VisitantesFilter currentStatus={status} />
                </div>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>NOME</TableHead>
                        <TableHead>CPF</TableHead>
                        <TableHead>APARTAMENTO</TableHead>
                        <TableHead>DATA DA VISITA</TableHead>
                        <TableHead>HORÁRIO</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead>TELEFONE</TableHead>
                        <TableHead className="w-[100px]">AÇÕES</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {visitantes.data.map((visitante: any) => (
                        <TableRow key={visitante.id}>
                            <TableCell className="font-medium">{visitante.nome}</TableCell>
                            <TableCell>{visitante.cpf}</TableCell>
                            <TableCell>{visitante.apartamento}</TableCell>
                            <TableCell>
                                {visitante.dataVisita ? formatDateTime(visitante.dataVisita).dateOnly : ''}
                            </TableCell>
                            <TableCell>{visitante.horario}</TableCell>
                            <TableCell>
                                {getStatusBadge(visitante.status, visitante.autorizado)}
                            </TableCell>
                            <TableCell>{visitante.telefone || '-'}</TableCell>
                            <TableCell className="flex gap-1">
                                <Button asChild variant='outline' size='sm'>
                                    <Link href={`/admin/visitantes/${visitante.id}`}>Editar</Link>
                                </Button>
                                <DeleteDialog id={visitante.id} action={deleteVisitante} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {visitantes?.totalPages > 1 && (
                <Pagination page={page} totalPages={visitantes.totalPages} />
            )}
        </div>
    );
}

export default AdminVisitantesPage;
