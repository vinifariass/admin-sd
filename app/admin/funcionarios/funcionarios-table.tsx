'use client';

import Link from "next/link";
import { deleteFuncionario } from "@/lib/actions/funcionario.action";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DeleteDialog from "@/components/shared/delete-dialog";
import { formatDateTime } from "@/lib/utils";

type Props = {
  funcionarios: {
    id: string;
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    dataAdmissao?: string;
    dataDemissao?: string;
  }[];
};

const FuncionarioTable = ({ funcionarios }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>NOME</TableHead>
          <TableHead>CPF</TableHead>
          <TableHead>EMAIL</TableHead>
          <TableHead>TELEFONE</TableHead>
          <TableHead>DATA DE LOCAÇÃO</TableHead>
          <TableHead>DATA DE DEMISSÃO</TableHead>
          <TableHead className="w-[100px]">ACTIONS</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {funcionarios.map((funcionario) => (
          <TableRow key={funcionario.id}>
            <TableCell>{funcionario.nome}</TableCell>
            <TableCell>{funcionario.cpf}</TableCell>
            <TableCell>{funcionario.email}</TableCell>
            <TableCell>{funcionario.telefone}</TableCell>
            <TableCell>{funcionario.dataAdmissao ? formatDateTime(funcionario.dataAdmissao).dateOnly : ''}</TableCell>
            <TableCell>{funcionario.dataDemissao ? formatDateTime(funcionario.dataDemissao).dateOnly : ''}</TableCell>
            <TableCell className="flex gap-1">
              <Button asChild variant='outline' size='sm'>
                <Link href={`/admin/funcionarios/${funcionario.id}`}>Edit</Link>
              </Button>
              <DeleteDialog id={funcionario.id} action={deleteFuncionario} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default FuncionarioTable;
