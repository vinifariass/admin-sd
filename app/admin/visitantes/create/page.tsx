import VisitanteForm from "@/components/admin/visitante-form";

export default function CreateVisitantePage() {
    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <div className="p-4 flex flex-col gap-2 w-full">
                <h1 className="h2-bold mb-4">Criar Visitante</h1>
                <VisitanteForm type="Criar" />
            </div>
        </div>
    );
}
