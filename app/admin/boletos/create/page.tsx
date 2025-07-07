import BoletoForm from "@/components/admin/boleto-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Criar Boleto',
};

const AdminBoletoCreatePage = () => {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold">Criar Boleto</h1>
            <BoletoForm type="Criar" />
        </div>
    );
};

export default AdminBoletoCreatePage;
