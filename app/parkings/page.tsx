import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import ParkingForm from "@/components/admin/parking-form";


// Esquema de validação com Zod
const formSchema = z.object({
    apartamento: z.string().min(1, { message: "Apartamento é obrigatório" }),
    placa: z.string().min(1, { message: "Placa é obrigatória" }),
    carro: z.string().min(1, { message: "Carro é obrigatório" }),
    cor: z.string().min(1, { message: "Cor é obrigatória" }),
    username: z.string().min(2, { message: "Username deve ter pelo menos 2 caracteres" }),
});

export default function CreateParkingPage() {



    return (
        <div className="flex flex-col items-center gap-4 p-6">
            <Card className="w-full">
                <CardContent className="p-4 flex flex-col gap-2">
                    {/* O Form agora recebe o form como prop */}
                   <ParkingForm type="Create" />
                </CardContent>
            </Card>
        </div>
    );
}
