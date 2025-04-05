import { Metadata } from "next";
import { deleteRecibo } from "@/lib/actions/recibo.action";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DeleteDialog from "@/components/shared/delete-dialog";
import Link from "next/link";
import Pagination from "@/components/shared/pagination";
import { getAllRecibos } from "@/lib/actions/recibo.action";
import { auth } from "@/auth";
export const metadata: Metadata = {
  title: 'Admin Usuários',
};
const AdminReciboPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>
}) => {
  const { page = 1, query: searchText } = await props.searchParams;
  const servicos = await getAllRecibos({
    page: Number(page),
    query: searchText

  });

  const session = await auth()
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">
          Serviços
        </h1>
        {searchText && (
          <div>
            Filtrado por <i>&quot;{searchText}&quot;</i>{' '}
            <Link href='/admin/users'>
              <Button variant='outline' size='sm'>
                Remover filtro
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="flex-between">
        <div className="flex items-center gap-3">
          
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
              <Link href='/admin/servicos/create'>Criar Serviços</Link>
            </Button>
          )
        }

      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NOME</TableHead>
              <TableHead>DATA DE VENCIMENTO</TableHead>
              <TableHead>AÇÕES</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(servicos.data).map((servico) => (
              <TableRow key={servico.id}>
                <TableCell>{formatId(servico.id)}</TableCell>
                <TableCell>{servico.nomeServico}</TableCell>
                <TableCell>{servico.dataVencimento.toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/admin/servicos/${servico.id}`}>
                      Editar
                    </Link>
                  </Button>
                  <DeleteDialog id={servico.id} action={deleteRecibo} />

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {servicos.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={servicos.totalPages} />
        )}
      </div>
    </div>
  );
}

export default AdminReciboPage;