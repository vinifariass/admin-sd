import TabsPrivadas from "@/components/admin/tabs-privadas";
import { Metadata } from "next";
import { getParkingSummary } from "@/lib/actions/parking.action";
import { getMoradoresSummary } from "@/lib/actions/morador.action";
import { getAgendamentos } from "@/lib/actions/agendamento-action";
import { getAllFuncionarios } from "@/lib/actions/funcionario.action";
import { getGastos } from "@/lib/actions/gasto.action";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: "Admin Visão Geral",
};

const AdminOverviewPage = async () => {
    const session = await auth();
    
    const summary = await getParkingSummary();
    const summaryMoradores = await getMoradoresSummary();
    const agendamentos = await getAgendamentos();
    const gastos = await getGastos()

    const funcionarios = await getAllFuncionarios({
        query: "",
        page: 1,
    });

    return (
        <div className="space-y-6">
            <h1 className="h2-bold">Dashboard</h1>
            
            <TabsPrivadas
                summary={summary}
                summaryMoradores={summaryMoradores}
                agendamentos={agendamentos}
                funcionarios={funcionarios.data}
                gastos={gastos}
            />
        </div>
    );
};

export default AdminOverviewPage;
