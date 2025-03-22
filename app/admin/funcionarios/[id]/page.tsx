import FuncionarioForm from "@/components/admin/funcionario-form";
import { getFuncionarioById } from "@/lib/actions/funcionario.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: 'Atualizar Funcionário',
};
const AdminFuncionarioUpdate = async (props: {
    params: Promise<{ id: string; }>,
}) => {
    const { id } = await props.params;
    const funcionario = await getFuncionarioById(id);
    if (!funcionario) return notFound();
    return (<>
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="h2-bold">
                Atualizar Funcionario
            </h1>

            <FuncionarioForm type="Atualizar" funcionario={funcionario} funcionarioId={funcionario.id} />
        </div>
    </>);
}

export default AdminFuncionarioUpdate;