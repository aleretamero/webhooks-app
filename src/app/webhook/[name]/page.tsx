import { revalidateWebhook } from '@/actions/revalidate';
import { prisma } from '@/lib/prisma';

interface WebhookDetailsProps {
  params: { name: string };
}

export default async function WebhookDetails({ params }: WebhookDetailsProps) {
  const webhook = await prisma.webhookReceived.findFirst({
    where: { name: params.name },
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

  return (
    <main className="p-10">
      <h1 className="text-2xl font-bold mb-4">Histórico de {webhook.name}</h1>

      <form
        action={async () => {
          'use server';
          await revalidateWebhook(params.name);
        }}
      >
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded mb-4"
        >
          🔄 Revalidar
        </button>
      </form>

      {histories.length === 0 ? (
        <p className="text-gray-500">Nenhum histórico encontrado.</p>
      ) : (
        <ul className="space-y-2">
          {histories.map((history) => (
            <li key={history.id} className="p-4 bg-gray-100 rounded-lg shadow">
              <p>
                <strong>Método:</strong> {history.method}
              </p>

              <p>
                <strong>Headers:</strong>
              </p>
              <pre className="whitespace-pre-wrap break-words bg-gray-800 text-green-300 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(JSON.parse(history.headers), null, 2)}
              </pre>

              <p>
                <strong>Body:</strong>
              </p>
              <pre className="whitespace-pre-wrap break-words bg-gray-800 text-green-300 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(JSON.parse(history.body), null, 2)}
              </pre>

              <p className="text-sm text-gray-500">
                {new Date(history.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
