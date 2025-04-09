import FuncionarioForm from "@/components/admin/funcionario-form";


export default function CreateFuncionarioPage() {

    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <div className="p-4 flex flex-col gap-2 w-full">
                {/* O Form agora recebe o form como prop */}
                <FuncionarioForm type="Criar" />
            </div>
        </div>
    );
}
