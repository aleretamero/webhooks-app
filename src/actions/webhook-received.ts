'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createWebhook(prevState: any, formData: FormData) {
  console.log('formData', formData);

  const name = formData.get('name') as string;
  if (!name) return;

  await prisma.webhookReceived.create({ data: { name } });
  revalidatePath('/');
}

export async function updateWebhook(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prevState: any,
  {
    id,
    formData,
  }: {
    id: number;
    formData: FormData;
  }
) {
  const name = formData.get('name') as string;
  if (!name) return;

  await prisma.webhookReceived.update({
    where: { id },
    data: { name },
  });
  revalidatePath('/');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteWebhook(prevState: any, id: number) {
  await prisma.$transaction([
    prisma.webhookReceivedHistory.deleteMany({
      where: { webhookReceivedId: id },
    }),
    prisma.webhookReceived.delete({
      where: { id },
    }),
  ]);

  revalidatePath('/');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function deleteWebhookHistories(prevState: any, id: number) {
  const webhook = await prisma.webhookReceived.findUnique({
    where: { id },
  });

  if (!webhook) return;

  await prisma.webhookReceivedHistory.deleteMany({
    where: { webhookReceivedId: id },
  });

  revalidatePath(`/webhook/${webhook.name}`);
}
