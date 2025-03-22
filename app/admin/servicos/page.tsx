"use client";

import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { UploadCloud } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { salvarRecibos } from "@/lib/actions/recibo.action";
import { toast } from "sonner";

export default function UploadExcel() {
  const [data, setData] = useState<{ nomeServico: string; dataVencimento: string }[]>([]);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Aciona o seletor de arquivos ao clicar no botão
  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      const workbook = XLSX.read(new Uint8Array(buffer), { type: "array" });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      let rows: any[] = XLSX.utils.sheet_to_json(sheet);

      console.log(rows);

      // Converte datas do Excel
      rows = rows.map((row) => ({
        
        nomeServico: row.nomeServico || "Desconhecido",
        dataVencimento: isExcelDate(row.dataVencimento) ? formatExcelDate(row.dataVencimento) : "Data Inválida",
      }));

      setData(rows);
    };
  };

  // Função para verificar se o valor é um número de data do Excel
  const isExcelDate = (value: any) => {
    return typeof value === "number" && value > 40000;
  };

  // Converte número de data do Excel para formato `YYYY-MM-DD`
  const formatExcelDate = (excelSerialDate: number) => {
    const date = XLSX.SSF.parse_date_code(excelSerialDate);
    return `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
  };

  // Função para enviar os dados para o banco de dados
  const handleSave = async () => {
    const validData = data.filter((row) => row.dataVencimento !== "Data Inválida");
    if (validData.length === 0) {
      alert("Nenhum dado válido para salvar.");
      return;
    }

    const res = await salvarRecibos(validData);
    toast(res.message);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Botão para selecionar arquivo */}
      <Button
        variant="outline"
        className="w-full max-w-xs flex items-center gap-2"
        onClick={openFileSelector} 
      >
        <UploadCloud className="w-5 h-5" />
        Selecionar Arquivo
      </Button>

      {/* Input oculto */}
      <input ref={fileInputRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileUpload} />

      {/* Exibe o nome do arquivo selecionado */}
      {fileName && <p className="text-sm text-muted-foreground">📂 Arquivo selecionado: <span className="font-medium">{fileName}</span></p>}

      {data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome do Serviço</TableHead>
              <TableHead>Data de Vencimento</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.nomeServico}</TableCell>
                <TableCell>{row.dataVencimento}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Botão para salvar no banco */}
      {data.length > 0 && (
        <Button className="mt-4 w-full" onClick={handleSave}>
          Salvar no Banco
        </Button>
      )}
    </div>
  );
}
