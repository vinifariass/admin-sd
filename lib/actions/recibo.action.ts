'use server'
import { prisma } from "@/db/prisma";

export async function salvarRecibos(recibos: { nomeServico: string; dataVencimento: string }[]) {
    try {
        const recibosFormatados = recibos.map((r) => ({
            nomeServico: r.nomeServico,
            dataVencimento: new Date(`${r.dataVencimento}T00:00:00.000Z`),
        }));

        console.log(recibosFormatados)
        // Salva os recibos no banco de dados
        await prisma.recibo.createMany({
            data: recibosFormatados,
        });


        return {
            success: true,
            message: 'Recibos salvos com sucesso'
        }
    } catch (error: any) {
        return (error)
    }
}