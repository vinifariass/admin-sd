import { prisma } from "@/db/prisma";
export async function getServicosDoDia(data: string, condominioId?: string) {
    try {
        const start = new Date(data);
        const end = new Date(start);
        end.setDate(end.getDate() + 1);

        return await prisma.recibo.findMany({
            where: {
                ...(condominioId ? { condominioId } : {}),
                dataVencimento: {
                    gte: start,
                    lt: end,
                },
            },
        });
    } catch (error) {
        console.error("Erro ao buscar serviços do dia:", error);
        return [];
    }
}
