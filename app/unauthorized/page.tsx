import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Unauthorized Access',
}
const Unauthorized = () => {
    return (
        <div className="container mx-auto flex flex-col items-center justify-center space-y-4 h-[calc(100vh-200px)]">
            {/* Add your content here */}
            <h1 className="h1-bold text-4xl">Acesso Não autorizado            </h1>
            <p className="text-muted-foreground">
                Você não tem permissão para acessar esta página.
            </p>
            <Button asChild>
                <Link href="/">
                    Voltar para o Início
                </Link>
            </Button>
        </div>
    );
}

export default Unauthorized;