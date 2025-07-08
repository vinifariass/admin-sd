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
import { Input } from "@/components/ui/input";
import { auth } from "@/auth";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AdminParkingsPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) => {
  const searchParams = await props.searchParams;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const category = searchParams.category || "carro";

  const parkings = await getAllParkings({
    query: searchText,
    page,
    category,
  });

  const session = await auth();


  return (
    <div className="space-y-6">
      <Tabs defaultValue={category} className="w-full">
        <TabsList className="flex gap-2 p-2 rounded-md bg-muted border">
          <Link href="/admin/parkings?category=carro">
            <Button variant={category === "carro" ? "default" : "outline"} size="sm">
              Carros
            </Button>
          </Link>
          <Link href="/admin/parkings?category=moto">
            <Button variant={category === "moto" ? "default" : "outline"} size="sm">
              Motos
            </Button>
          </Link>
        </TabsList>

        {category === "carro" && (
          <TableSection parkings={parkings} category="carro" page={page} searchText={searchText} session={session} />
        )}
        {category === "moto" && (
          <TableSection parkings={parkings} category="moto" page={page} searchText={searchText} session={session} />
        )}
      </Tabs>
    </div>
  );
};

const TableSection = ({ parkings, category, page, searchText, session }: {
  parkings: any;
  category: string;
  page: number;
  searchText: string;
  session: any;
}) => {
  console.log(category);
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {category === "carro" ? "Carros" : "Motos"}
          </h1>
          {searchText && (
            <div className="mt-1 text-sm text-muted-foreground">
              Filtrado por <i>"{searchText}"</i>{" "}
              <Link href={`/admin/parkings?category=${category}`}>
                <Button variant="link" size="sm" className="px-1 h-auto">Remover filtro</Button>
              </Link>
            </div>
          )}
        </div>

        <form action={`/admin/parkings?category=${category}`} method="GET" className="flex gap-2 items-center">
          <Input
            type="text"
            name="query"
            placeholder={`Buscar por nome, CPF ou placa (${category === "carro" ? "Carro" : "Moto"})...`}
            defaultValue={searchText}
            className="w-[260px]"
          />
          <Button type="submit" variant="default" size="sm">Buscar</Button>
        </form>
      </div>

      <div className="flex justify-end">
        {session?.user?.tipo === 'ADMIN' && (
          <Button asChild size="sm">
            <Link href={`/admin/parkings/create?category=${category}`}>
              Criar Vaga ({category === "carro" ? "Carro" : "Moto"})
            </Link>
          </Button>
        )}
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>NOME</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>TIPO DE MORADOR</TableHead>
              <TableHead>APARTAMENTO</TableHead>
              <TableHead>MODELO</TableHead>
              <TableHead>COR</TableHead>
              <TableHead>PLACA</TableHead>
              {session?.user?.tipo !== 'MORADOR' && <TableHead className="text-center">AÇÕES</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {parkings.data.map((parking: any) => (

              <TableRow key={parking.id}>
                <TableCell>{parking.nome}</TableCell>
                <TableCell>{parking.cpf}</TableCell>
                <TableCell>{parking.tipoMorador}</TableCell>
                <TableCell>{parking.apartamento}</TableCell>
                <TableCell>
                  {category === "carro" ? parking.modelo : parking.modelo}
                </TableCell>
                <TableCell>{parking.cor}</TableCell>
                <TableCell>{parking.placa}</TableCell>
                {session?.user?.tipo !== 'MORADOR' && (
                  <TableCell className="flex gap-1 justify-center">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/parkings/${parking.id}`}>Editar</Link>
                    </Button>
                    <DeleteDialog id={parking.id} action={deleteParking} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {parkings?.totalPages > 1 && (
        <Pagination page={page} totalPages={parkings.totalPages} />
      )}
    </div>
  );
};

export default AdminParkingsPage;
