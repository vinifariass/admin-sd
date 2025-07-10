'use server'
import { z } from "zod";
import { insertPagamentoMensalSchema, updatePagamentoMensalSchema, marcarPagoPagamentoSchema } from "../validator";
import { prisma } from "@/db/prisma";
import { revalidatePath } from "next/cache";
import { formatErrors, convertToPlainObject } from "../utils";
import { PAGE_SIZE } from "../constants";

// Criar pagamento mensal
export async function createPagamentoMensal(data: z.infer<typeof insertPagamentoMensalSchema>) {
    try {
        const pagamento = insertPagamentoMensalSchema.parse(data);

        await prisma.payment.create({
            data: pagamento
        });

        revalidatePath('/admin/pagamentos');
        revalidatePath('/user/pagamentos');

        return {
            success: true,
            message: "Pagamento criado com sucesso"
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

// Atualizar pagamento mensal
export async function updatePagamentoMensal(data: z.infer<typeof updatePagamentoMensalSchema>) {
    try {
        const pagamento = updatePagamentoMensalSchema.parse(data);
        const { id, ...updateData } = pagamento;

        await prisma.payment.update({
            where: { id },
            data: updateData
        });

        revalidatePath('/admin/pagamentos');
        revalidatePath('/user/pagamentos');

        return {
            success: true,
            message: "Pagamento atualizado com sucesso"
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

// Marcar pagamento como pago/não pago
export async function marcarPagoPagamento(data: z.infer<typeof marcarPagoPagamentoSchema>) {
    try {
        const { id, pago, dataPagamento, comprovante, observacoes } = marcarPagoPagamentoSchema.parse(data);

        const updateData: any = {
            pago,
            updatedAt: new Date()
        };

        if (pago) {
            updateData.dataPagamento = dataPagamento || new Date();
            if (comprovante) updateData.comprovante = comprovante;
        } else {
            updateData.dataPagamento = null;
            updateData.comprovante = null;
        }

        if (observacoes) updateData.observacoes = observacoes;

        await prisma.payment.update({
            where: { id },
            data: updateData
        });

        revalidatePath('/admin/pagamentos');
        revalidatePath('/user/pagamentos');

        return {
            success: true,
            message: pago ? "Pagamento marcado como pago" : "Pagamento marcado como não pago"
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

// Buscar pagamentos por morador
export async function getPagamentosByMorador(moradorId: string, page: number = 1) {
    try {
        const pagamentos = await prisma.payment.findMany({
            where: { moradorId },
            orderBy: [
                { anoReferencia: 'desc' },
                { mesReferencia: 'desc' }
            ],
            take: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
        });

        const totalPagamentos = await prisma.payment.count({
            where: { moradorId }
        });

        return {
            data: pagamentos.map(convertToPlainObject),
            totalPages: Math.ceil(totalPagamentos / PAGE_SIZE),
        };
    } catch (error) {
        return { data: [], totalPages: 0 };
    }
}

// Buscar todos os pagamentos (admin)
export async function getAllPagamentos({
    page = 1,
    moradorId,
    tipo,
    pago,
    mesReferencia,
    anoReferencia
}: {
    page?: number,
    moradorId?: string,
    tipo?: string,
    pago?: boolean,
    mesReferencia?: number,
    anoReferencia?: number
} = {}) {
    try {
        const where: any = {};

        if (moradorId) where.moradorId = moradorId;
        if (tipo) where.tipo = tipo;
        if (pago !== undefined) where.pago = pago;
        if (mesReferencia) where.mesReferencia = mesReferencia;
        if (anoReferencia) where.anoReferencia = anoReferencia;

        const pagamentos = await prisma.payment.findMany({
            where,
            include: {
                morador: {
                    select: {
                        nome: true,
                        apartamento: true,
                        telefone: true
                    }
                }
            },
            orderBy: [
                { anoReferencia: 'desc' },
                { mesReferencia: 'desc' },
                { morador: { apartamento: 'asc' } },
            ],
            take: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
        });

        const totalPagamentos = await prisma.payment.count({ where });

        return {
            data: pagamentos.map(convertToPlainObject),
            totalPages: Math.ceil(totalPagamentos / PAGE_SIZE),
        };
    } catch (error) {
        return { data: [], totalPages: 0 };
    }
}

// Buscar pagamento por ID
export async function getPagamentoById(id: string) {
    try {
        const pagamento = await prisma.payment.findFirst({
            where: { id },
            include: {
                morador: {
                    select: {
                        nome: true,
                        apartamento: true,
                        telefone: true
                    }
                }
            }
        });

        return convertToPlainObject(pagamento);
    } catch (error) {
        return null;
    }
}

// Deletar pagamento
export async function deletePagamento(id: string) {
    try {
        await prisma.payment.delete({
            where: { id }
        });

        revalidatePath('/admin/pagamentos');

        return {
            success: true,
            message: "Pagamento removido com sucesso"
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

// Função temporária para deletar todos os pagamentos
export async function deleteAllPagamentos() {
    try {
        const result = await prisma.payment.deleteMany({});
        
        revalidatePath('/admin/pagamentos');
        revalidatePath('/user/pagamentos');

        return {
            success: true,
            message: `${result.count} pagamentos foram deletados com sucesso`
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

// Estatísticas de pagamentos
export async function getEstatisticasPagamentos(mesReferencia?: number, anoReferencia?: number) {
    try {
        const where: any = {};
        if (mesReferencia) where.mesReferencia = mesReferencia;
        if (anoReferencia) where.anoReferencia = anoReferencia;

        const totalPagamentos = await prisma.payment.count({ where });
        const pagamentosPagos = await prisma.payment.count({ 
            where: { ...where, pago: true } 
        });
        const pagamentosVencidos = await prisma.payment.count({
            where: {
                ...where,
                pago: false,
                dataVencimento: { lt: new Date() }
            }
        });

        const valorTotal = await prisma.payment.aggregate({
            where,
            _sum: { valor: true }
        });

        const valorRecebido = await prisma.payment.aggregate({
            where: { ...where, pago: true },
            _sum: { valor: true }
        });

        return {
            totalPagamentos,
            pagamentosPagos,
            pagamentosVencidos,
            pagamentosPendentes: totalPagamentos - pagamentosPagos,
            taxaPagamento: totalPagamentos > 0 ? (pagamentosPagos / totalPagamentos) * 100 : 0,
            valorTotal: valorTotal._sum.valor || 0,
            valorRecebido: valorRecebido._sum.valor || 0,
            valorPendente: (valorTotal._sum.valor || 0) - (valorRecebido._sum.valor || 0)
        };
    } catch (error) {
        return {
            totalPagamentos: 0,
            pagamentosPagos: 0,
            pagamentosVencidos: 0,
            pagamentosPendentes: 0,
            taxaPagamento: 0,
            valorTotal: 0,
            valorRecebido: 0,
            valorPendente: 0
        };
    }
}
