import { WebhookRegistration } from '@/components/organisms/webhook-registration.component';
import { prisma } from '@/lib/prisma';

export default async function Home() {
  const webhooks = await prisma.webhookReceived.findMany();

  return (
    <main className="flex flex-col mt-10">
      <WebhookRegistration webhooks={webhooks} />
    </main>
  );
}
