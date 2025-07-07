import VisitanteForm from "@/components/admin/visitante-form";
import { getVisitanteById } from "@/lib/actions/visitante.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: 'Atualizar Visitante',
};

const AdminVisitanteUpdate = async (props: {
    params: Promise<{ id: string; }>,
}) => {
    const { id } = await props.params;
    const visitante = await getVisitanteById(id);
    
    if (!visitante) return notFound();
    
    // Converter valores null para string vazia para compatibilidade com o formulário
    const visitanteFormatado = {
        ...visitante,
        telefone: visitante.telefone || "",
        email: visitante.email || "",
        observacoes: visitante.observacoes || "",
        autorizadoPor: visitante.autorizadoPor || "",
    };
    
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="h2-bold">Atualizar Visitante</h1>
            <VisitanteForm type="Atualizar" visitante={visitanteFormatado} visitanteId={visitante.id} />
        </div>
    );
}

export default AdminVisitanteUpdate;
