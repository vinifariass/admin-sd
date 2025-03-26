'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const destinatariosMock = [
  { id: 1, nome: "Maria Rodrigues - Apto 302" },
  { id: 2, nome: "João Silva - Apto 105" },
  { id: 3, nome: "Carlos Pereira - Apto 401" },
  { id: 4, nome: "Ana Santos - Apto 207" },
];

const EnviarNotificacao: React.FC = () => {
  const [selecionados, setSelecionados] = useState<number[]>([]);

  // Função para lidar com a seleção/deseleção de um checkbox
  const handleCheckboxChange = (id: number) => {
    if (selecionados.includes(id)) {
      setSelecionados(selecionados.filter((item) => item !== id));
    } else {
      setSelecionados([...selecionados, id]);
    }
  };

  // Função para selecionar todos os destinatários
  const handleSelecionarTodos = () => {
    if (selecionados.length === destinatariosMock.length) {
      setSelecionados([]); // Desmarcar todos
    } else {
      setSelecionados(destinatariosMock.map((destinatario) => destinatario.id)); // Marcar todos
    }
  };

  return (
    <Card >
      <CardHeader>
        <CardTitle>Enviar Notificação</CardTitle>
        <CardDescription>
          Envie uma mensagem para os moradores
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Lista de destinatários */}
        <div className="mb-4">
          <label htmlFor="destinatarios" className="block mb-2 font-medium">
            Destinatários
          </label>
          <div className="space-y-2">
            {destinatariosMock.map((destinatario) => (
              <div key={destinatario.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`destinatario-${destinatario.id}`}
                  checked={selecionados.includes(destinatario.id)}
                  onCheckedChange={() => handleCheckboxChange(destinatario.id)}
                />
                <label
                  htmlFor={`destinatario-${destinatario.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {destinatario.nome}
                </label>
              </div>
            ))}
          </div>
          <Button
            variant="link"
            size="lg"
            className="float-right mt-2"
            onClick={handleSelecionarTodos}
          >
            {selecionados.length === destinatariosMock.length
              ? "Desmarcar todos"
              : "Selecionar todos"}
          </Button>
        </div>

        {/* Assunto */}
        <div className="mb-4">
          <label htmlFor="assunto" className="block mb-2 font-medium">
            Assunto
          </label>
          <Input id="assunto" placeholder="Digite o assunto da notificação" />
        </div>

        {/* Mensagem */}
        <div className="mb-4">
          <label htmlFor="mensagem" className="block mb-2 font-medium">
            Mensagem
          </label>
          <Textarea
            id="mensagem"
            placeholder="Digite sua mensagem aqui..."
            className="resize-none min-h-[100px]"
          />
        </div>

        {/* Botões de ação */}
        <div className="flex justify-between">
          <Button variant="outline" className="mr-2">
            Cancelar
          </Button>
          <Button type="submit">Enviar Notificação</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnviarNotificacao;