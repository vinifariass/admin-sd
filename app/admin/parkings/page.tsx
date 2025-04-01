import Link from "next/link";
import { getAllParkings, deleteParking } from "@/lib/actions/parking.action";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/shared/pagination";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Input } from "@/components/ui/input"; // Importação do Input do Shadcn/ui
import { auth } from "@/auth";
import { requireAdmin } from "@/lib/auth-guard";

const AdminParkingsPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) => {
  
  const session = await auth()

  console.log(session) 

  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";

  const parkings = await getAllParkings({
    query: searchText,
    page,
  });

  return (
    <>
      <div className="space-y-2">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="h2-bold">Vagas</h1>
            {searchText && (
              <div>
                Filtered by <i>&quot;{searchText}&quot;</i>{" "}
                <Link href="/admin/parkings">
                  <Button variant="outline" size="sm">
                    Remove Filter
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Search Input */}
          <form action="/admin/parkings" method="GET" className="flex gap-2">
            <Input
              type="text"
              name="query"
              placeholder="Buscar por nome, CPF ou placa..."
              defaultValue={searchText}
              className="w-[250px]"
            />
            <Button type="submit" variant="default" size="sm">
              Buscar
            </Button>
          </form>
        </div>

        {/* Botão Criar Vagas */}
        {
          session?.user?.tipo === "ADMIN" && (
            <div className="flex justify-end mb-4">
              <Button asChild variant="default">
                <Link href="/admin/parkings/create">Criar Vagas</Link>
              </Button>
            </div>
          )
        }

        {/* Tabela */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NOME</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>TIPO DE MORADOR</TableHead>
              <TableHead>APARTAMENTO</TableHead>
              <TableHead>CARRO</TableHead>
              <TableHead>COR</TableHead>
              <TableHead>PLACA</TableHead>
              <TableHead className="w-[100px]">ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parkings.data.map((parking) => (
              <TableRow key={parking.id}>
                <TableCell>{parking.nome}</TableCell>
                <TableCell>{parking.cpf}</TableCell>
                <TableCell>{parking.tipoMorador}</TableCell>
                <TableCell>{parking.apartamento}</TableCell>
                <TableCell>{parking.carro}</TableCell>
                <TableCell>{parking.cor}</TableCell>
                <TableCell>{parking.placa}</TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/parkings/${parking.id}`}>Edit</Link>
                  </Button>
                  {/* DELETE BUTTON */}
                  <DeleteDialog id={parking.id} action={deleteParking} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Paginação */}
        {parkings?.totalPages > 1 && (
          <Pagination page={page} totalPages={parkings.totalPages} />
        )}
      </div>
    </>
  );
};

export default AdminParkingsPage;