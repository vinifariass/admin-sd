import EncomendaForm from "@/components/admin/encomenda-form";
import { getEncomendaById } from "@/lib/actions/encomenda.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: 'Atualizar Encomenda',
};
const AdminEncomendaUpdate = async (props: {
    params: Promise<{ id: string; }>,
}) => {
    const { id } = await props.params;
    const encomenda = await getEncomendaById(id);
    if (!encomenda) return notFound();
    return (<>
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="h2-bold">
                Atualizar Encomenda
            </h1>

            <EncomendaForm type="Atualizar" encomenda={encomenda} encomendaId={encomenda.id} />
        </div>
    </>);
}

export default AdminEncomendaUpdate;