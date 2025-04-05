import AgendamentoForm from "@/components/admin/agendamento-form";
import { getAgendamentoById } from "@/lib/actions/agendamento-action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: 'Atualizar Agendamento',
};
const AdminAgendamentoUpdate = async (props: {
    params: Promise<{ id: string; }>,
}) => {
    const { id } = await props.params;
    const agendamento = await getAgendamentoById(id);
    if (!agendamento) return notFound();
    return (<>
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="h2-bold">
                Atualizar Agendamento
            </h1>

            <AgendamentoForm type="Atualizar" agendamento={agendamento} agendamentoId={agendamento.id} />
        </div>
    </>);
}

export default AdminAgendamentoUpdate;