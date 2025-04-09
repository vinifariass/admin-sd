import AgendamentoForm from "@/components/admin/agendamento-form";


export default function CreateAgendamentoPage() {

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <div className="p-4 flex flex-col gap-2 w-full">
                {/* O Form agora recebe o form como prop */}
                <AgendamentoForm type="Criar" />
            </div>
        </div>
    );
}
