import ServicoForm from "@/components/admin/servico-form";
import { getReciboById } from "@/lib/actions/recibo.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: 'Atualizar Morador',
};
const AdminReciboPage = async (props: {
    params: Promise<{ id: string; }>,
}) => {
    const { id } = await props.params;
    const servico = await getReciboById(id);
    if (!servico) return notFound();
    return (<>
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="h2-bold">
                Atualizar Serviço
            </h1>

            <ServicoForm type="Atualizar" servico={servico} servicoId={servico.id} />
        </div>
    </>);
}

export default AdminReciboPage;