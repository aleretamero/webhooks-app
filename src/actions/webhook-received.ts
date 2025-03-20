'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createWebhook(formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) return;

  await prisma.webhookReceived.create({ data: { name } });
  revalidatePath('/');
}

export async function updateWebhook(id: number, formData: FormData) {
  const name = formData.get('name') as string;
  if (!name) return;
  
  await prisma.webhookReceived.update({
    where: { id },
    data: { name },
  });
  revalidatePath('/');
}

export async function deleteWebhook(id: number) {
  await prisma.webhookReceived.delete({ where: { id } });
  revalidatePath('/');
}
