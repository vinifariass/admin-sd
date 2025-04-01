'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Simule uma ação (depois substitua por API real)
async function createGasto(data: any) {
  console.log("Enviando gasto:", data);
  await new Promise((res) => setTimeout(res, 1000));
}

const categorias = ["Manutenção", "RH", "Copa", "TI", "Serviços Gerais"];

const CreateGastoPage = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    descricao: "",
    valor: "",
    categoria: "",
    data: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectCategoria = (value: string) => {
    setForm({ ...form, categoria: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createGasto(form);
    setLoading(false);
    router.push("/admin/gastos");
  };

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Novo Gasto</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Descrição */}
            <div className="space-y-1">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Ex: compra de materiais de limpeza"
                required
              />
            </div>

            {/* Valor */}
            <div className="space-y-1">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                name="valor"
                type="number"
                step="0.01"
                value={form.valor}
                onChange={handleChange}
                required
              />
            </div>

            {/* Categoria */}
            <div className="space-y-1">
              <Label htmlFor="categoria">Categoria</Label>
              <Select onValueChange={handleSelectCategoria}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data */}
            <div className="space-y-1">
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                name="data"
                type="date"
                value={form.data}
                onChange={handleChange}
                required
              />
            </div>

            {/* Botão */}
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Salvando..." : "Salvar Gasto"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGastoPage;
