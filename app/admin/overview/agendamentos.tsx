'use client'
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Agendamento } from "@prisma/client";


interface ListaAgendamentosProps {
  agendamentos: Agendamento[];
}

// Alterando a tipagem da função para indicar que retorna um `Promise<Agendamento[]>`
const ListaAgendamentos: React.FC<ListaAgendamentosProps> = ({ agendamentos: initialAgendamentos }) => {

  const [tipoFiltro, setTipoFiltro] = useState<"VISITANTE" | "PRESTADOR">(
    "VISITANTE"
  );

  
  console.log(tipoFiltro)
  const agendamentosFiltrados = initialAgendamentos.filter((agendamento) => {
    if (tipoFiltro === "VISITANTE") {
      return agendamento.tipo === "VISITANTE"; 
    } else {
      return agendamento.tipo === "PRESTADOR";
    }
  });


  return (
    <Card>
      <CardHeader>
        <CardTitle>Agendamentos do Dia</CardTitle>
        <CardDescription>
          Visitantes e prestadores de serviço
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Grupo de botões para alternar entre visitantes e prestadores */}
        <div className="flex space-x-3 mb-4">
          <Button
            variant={tipoFiltro === "VISITANTE" ? "default" : "outline"}
            onClick={() => setTipoFiltro("VISITANTE")}
          >
            Visitantes
          </Button>
          <Button
            variant={tipoFiltro === "PRESTADOR" ? "default" : "outline"}
            onClick={() => setTipoFiltro("PRESTADOR")}
          >
            Prestadores
          </Button>
        </div>

        {/* Lista de agendamentos */}
        <div className="space-y-4">
          {agendamentosFiltrados.length > 0 ? (
            agendamentosFiltrados.map((agendamento) => (
              <div key={agendamento.id} className="flex items-center justify-between">
                {/* Detalhes do agendamento */}
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-slate-200" />
                  <div className="ml-2">
                    <p className="text-sm font-medium">{agendamento.nome}</p>
                    <p className="text-xs text-slate-500">
                      {agendamento.apartamento} - {agendamento.horario}
                    </p>
                  </div>
                </div>

                {/* Status */}
                <span
                  className={`px-2 py-1 text-xs rounded-full ${agendamento.status === "CONFIRMADO"
                      ? "bg-green-500 text-white"
                      : "bg-yellow-500 text-black"
                    }`}
                >
                  {agendamento.status === "CONFIRMADO" ? "Confirmado" : "Pendente"}
                </span>
              </div>
            ))
          ) : (
            <p>Nenhum agendamento encontrado.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListaAgendamentos;
