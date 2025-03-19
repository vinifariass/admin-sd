"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";
import * as Papa from "papaparse";

type ServiceData = {
  serviceName: string;
  dueDate: string;
};

export default function UploadCSV() {
  const [services, setServices] = useState<ServiceData[]>([]);

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      parseCSV(csvText);
    };
    reader.readAsText(file);
  };

  const parseCSV = (csvText: string) => {
    Papa.parse<ServiceData>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const parsedData = result.data.map((row) => ({
          serviceName: row.serviceName || "Desconhecido",
          dueDate: row.dueDate || "Sem Data",
        }));
        setServices(parsedData);
        toast.success("Arquivo processado com sucesso!");
      },
      error: () => {
        toast.error("Erro ao processar o CSV.");
      },
    });
  };

  const handleSave = () => {
    toast.success("Serviços gravados com sucesso!");
    console.log("Dados gravados:", services);
  };

  return (
    <div className="space-y-4">
      <div className="upload-field">
        <Card>
          <CardContent className="space-y-2 mt-2">
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res: { file: File }[]) => {
                if (res.length > 0) {
                  handleFileUpload(res[0].file);
                }
              }}
              onUploadError={(error: Error) => {
                toast.error(error.message);
              }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      {services.length > 0 && (
        <Card>
          <CardContent className="mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome do Serviço</TableHead>
                  <TableHead>Data de Vencimento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service, index) => (
                  <TableRow key={index}>
                    <TableCell>{service.serviceName}</TableCell>
                    <TableCell>{service.dueDate}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Botão de Gravar */}
            <Button onClick={handleSave} className="mt-4">
              Gravar Serviços
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
