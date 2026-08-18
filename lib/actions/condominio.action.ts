'use server';

import { prisma } from '@/db/prisma';
import { revalidatePath } from 'next/cache';

export async function getCondominios() {
  return prisma.condominio.findMany({ orderBy: { nome: 'asc' } });
}

export async function criarCondominio(formData: FormData): Promise<void> {
  const nome = String(formData.get('nome') || '').trim();
  const telegramChatId = String(formData.get('telegramChatId') || '').trim();

  if (!nome || !telegramChatId) {
    return;
  }

  const total = await prisma.condominio.count();
  if (total >= 10) {
    return;
  }

  try {
    await prisma.condominio.create({ data: { nome, telegramChatId } });
    revalidatePath('/admin/condominios');
    revalidatePath('/admin/servicos/create');
    return;
  } catch {
    return;
  }
}

export async function atualizarCondominio(formData: FormData): Promise<void> {
  const id = String(formData.get('id') || '').trim();
  const nome = String(formData.get('nome') || '').trim();
  const telegramChatId = String(formData.get('telegramChatId') || '').trim();

  if (!id || !nome || !telegramChatId) return;

  try {
    await prisma.condominio.update({
      where: { id },
      data: { nome, telegramChatId },
    });
    revalidatePath('/admin/condominios');
    revalidatePath('/admin/servicos/create');
  } catch {
    return;
  }
}
