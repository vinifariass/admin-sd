import MoradorForm from "@/components/admin/morador-form";
import { getMoradorById } from "@/lib/actions/morador.action";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: 'Atualizar Morador',
};
const AdminMoradorUpdate = async (props: {
    params: Promise<{ id: string; }>,
}) => {
    const { id } = await props.params;
    const morador = await getMoradorById(id);
    console.log(morador)
    if (!morador) return notFound();
    return (<>
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="h2-bold">
                Atualizar Morador
            </h1>

            <MoradorForm type="Atualizar" morador={morador} moradorId={morador.id} />
        </div>
    </>);
}

export default AdminMoradorUpdate;