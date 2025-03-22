import { WebhookReceiverHistories } from '@/components/webhook-receiver-histories.component';
import { prisma } from '@/lib/prisma';

interface WebhookDetailsProps {
  params: Promise<{ name: string }>;
}

export default async function WebhookDetails({ params }: WebhookDetailsProps) {
  const { name } = await params;

  const webhook = await prisma.webhookReceived.findFirst({
    where: { name: name },
  });

  if (!webhook) {
    return (
      <div className="text-center text-red-500">Webhook não encontrado</div>
    );
  }

  const histories = await prisma.webhookReceivedHistory.findMany({
    where: {
      webhookReceived: {
        name: webhook.name,
      },
    },
    orderBy: { timestamp: 'desc' },
  });

  return <WebhookReceiverHistories webhook={webhook} histories={histories} />;
}
