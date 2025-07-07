'use server'
import { z } from "zod";
import { insertBoletoSchema, updateBoletoSchema, marcarPagoBoletoSchema } from "../validator";
import { prisma } from '@/db/prisma';
import { revalidatePath } from "next/cache";
import { formatErrors, convertToPlainObject, convertNullToEmptyString, convertEmptyStringToNull } from "../utils";
import { PAGE_SIZE } from "../constants";

// Criar boleto
export async function createBoleto(data: z.infer<typeof insertBoletoSchema>) {
    try {
        const boleto = insertBoletoSchema.parse(data);
        
        // Converter strings vazias para null para compatibilidade com banco
        const boletoData = convertEmptyStringToNull(boleto, ['moradorId', 'observacoes']);

        await prisma.boleto.create({
            data: boletoData
        });

        revalidatePath('/admin/boletos');

        return {
            success: true,
            message: "Boleto criado com sucesso"
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

// Atualizar boleto
export async function updateBoleto(data: z.infer<typeof updateBoletoSchema> & { id: string }) {
    try {
        const boleto = updateBoletoSchema.parse(data);
        
        // Converter strings vazias para null para compatibilidade com banco
        const boletoData = convertEmptyStringToNull(boleto, ['moradorId', 'observacoes']);

        await prisma.boleto.update({
            where: {
                id: boleto.id
            },
            data: boletoData
        });

        revalidatePath('/admin/boletos');

        return {
            success: true,
            message: "Boleto atualizado com sucesso"
        }
    } catch (error) {
        return { success: false, message: formatErrors(error) }
    }
}

// Buscar todos os boletos com paginação e filtros
export async function getAllBoletos({
    query,
    page,
    status,
    apartamento,
}: {
    query: string;
    page: number;
    status?: string;
    apartamento?: string;
}) {
    try {
        const queryFilter = query && query.trim() !== '' ? 
            {
                OR: [
                    { numeroBoleto: { contains: query, mode: 'insensitive' as any } },
                    { codigoBarras: { contains: query, mode: 'insensitive' as any } },
                    { apartamento: { contains: query, mode: 'insensitive' as any } },
                    { morador: { nome: { contains: query, mode: 'insensitive' as any } } },
                ]
            } : {};

        const statusFilter = status && status.trim() !== '' ? 
            { pago: status === 'pago' } : {};

        const apartamentoFilter = apartamento && apartamento.trim() !== '' ? 
            { apartamento: { contains: apartamento, mode: 'insensitive' as any } } : {};

        const where = {
            ...queryFilter,
            ...statusFilter,
            ...apartamentoFilter,
        };

        const boletos = await prisma.boleto.findMany({
            where,
            include: {
                morador: true,
            },
            orderBy: { createdAt: 'desc' },
            take: PAGE_SIZE,
            skip: (page - 1) * PAGE_SIZE,
        });

        const totalBoletos = await prisma.boleto.count({ where });

        return {
            data: boletos,
            totalPages: Math.ceil(totalBoletos / PAGE_SIZE),
        };
    } catch (error) {
        return { data: [], totalPages: 0 };
    }
}

// Buscar boletos por apartamento (para moradores)
export async function getBoletosByApartamento(apartamento: string) {
    try {
        const boletos = await prisma.boleto.findMany({
            where: { apartamento },
            include: {
                morador: true,
            },
            orderBy: { dataVencimento: 'desc' },
        });

        return boletos;
    } catch (error) {
        return [];
    }
}

// Deletar boleto
export async function deleteBoleto(id: string) {
    try {
        const boletoExists = await prisma.boleto.findFirst({
            where: { id }
        });

        if (!boletoExists) throw new Error('Boleto não encontrado');

        await prisma.boleto.delete({
            where: { id }
        });

        revalidatePath('/admin/boletos');

        return {
            success: true,
            message: 'Boleto deletado com sucesso'
        }
    } catch (error) {
        return {
            success: false,
            message: formatErrors(error)
        }
    }
}

// Buscar boleto por ID
export async function getBoletoById(boletoId: string) {
    try {
        const data = await prisma.boleto.findFirst({
            where: { id: boletoId },
            include: {
                morador: true,
            }
        });

        if (!data) return null;

        // Converter valores null para string vazia para compatibilidade com formulário
        const boletoFormatado = convertNullToEmptyString(data, ['moradorId', 'observacoes']);

        return convertToPlainObject(boletoFormatado);
    } catch (error) {
        return null;
    }
}

// Buscar boleto por código de barras
export async function getBoletoByCodigoBarras(codigoBarras: string) {
    try {
        const data = await prisma.boleto.findFirst({
            where: { codigoBarras },
            include: {
                morador: true,
            }
        });

        if (!data) return null;

        // Converter valores null para string vazia para compatibilidade com formulário
        const boletoFormatado = convertNullToEmptyString(data, ['moradorId', 'observacoes']);

        return convertToPlainObject(boletoFormatado);
    } catch (error) {
        return null;
    }
}

// Marcar boleto como pago/não pago
export async function marcarPagoBoleto(data: z.infer<typeof marcarPagoBoletoSchema>) {
    try {
        const { id, pago, dataPagamento } = marcarPagoBoletoSchema.parse(data);

        await prisma.boleto.update({
            where: { id },
            data: {
                pago,
                dataPagamento: pago ? (dataPagamento || new Date()) : null,
            }
        });

        revalidatePath('/admin/boletos');
        revalidatePath('/boletos');

        return {
            success: true,
            message: pago ? 'Boleto marcado como pago' : 'Boleto marcado como não pago'
        }
    } catch (error) {
        return {
            success: false,
            message: formatErrors(error)
        }
    }
}

// Resumo dos boletos
export async function getBoletosSummary() {
    try {
        const boletosCount = await prisma.boleto.count();
        const boletosPagos = await prisma.boleto.count({
            where: { pago: true }
        });
        const boletosVencidos = await prisma.boleto.count({
            where: { 
                pago: false,
                dataVencimento: { lt: new Date() }
            }
        });
        const boletosVencendoHoje = await prisma.boleto.count({
            where: { 
                pago: false,
                dataVencimento: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lt: new Date(new Date().setHours(23, 59, 59, 999))
                }
            }
        });

        return {
            boletosCount,
            boletosPagos,
            boletosVencidos,
            boletosVencendoHoje
        }
    } catch (error) {
        return {
            boletosCount: 0,
            boletosPagos: 0,
            boletosVencidos: 0,
            boletosVencendoHoje: 0
        }
    }
}

// Buscar boletos recentes (para dashboard)
export async function getLatestBoletos() {
    try {
        const boletos = await prisma.boleto.findMany({
            include: {
                morador: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });

        return boletos;
    } catch (error) {
        return [];
    }
}
