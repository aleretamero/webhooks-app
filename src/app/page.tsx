import { WebhookRegistration } from '@/components/webhook-registration.component';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const webhooks = await prisma.webhookReceived.findMany();

  return (
    <main className="flex flex-col items-center p-10">
      <WebhookRegistration webhooks={webhooks} />
    </main>
  );
}
