import GastoForm from "@/components/admin/gasto-form";
import { getGastoById } from "@/lib/actions/gasto.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: 'Atualizar Funcionário',
};
const AdminFuncionarioUpdate = async (props: {
    params: Promise<{ id: string; }>,
}) => {
    const { id } = await props.params;
    const gasto = await getGastoById(id);
    if (!gasto) return notFound();
    return (<>
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="h2-bold">
                Atualizar Gasto
            </h1>

            <GastoForm type="Atualizar" gasto={gasto} gastoId={gasto.id} />
        </div>
    </>);
}

export default AdminFuncionarioUpdate;