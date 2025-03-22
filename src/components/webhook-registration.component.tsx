import {
  createWebhook,
  deleteWebhook,
  updateWebhook,
} from '@/actions/webhook-received';
import Link from 'next/link';

interface WebhookRegistrationProps {
  webhooks: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export function WebhookRegistration({ webhooks }: WebhookRegistrationProps) {
  return (
    <div className="w-full max-w-lg bg-gray-100 p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Webhooks</h1>

      <form
        action={async (formData: FormData) => {
          'use server';
          await createWebhook(formData);
        }}
        className="flex gap-2 mb-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Nome do webhook"
          required
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Criar
        </button>
      </form>

      <ul className="space-y-2">
        {webhooks.map((webhook) => (
          <li
            key={webhook.id}
            className="flex justify-between items-center p-2 bg-white rounded shadow gap-2"
          >
            <form
              action={async (formData) => {
                'use server';
                await updateWebhook(webhook.id, formData);
              }}
              className="flex gap-2 w-full"
            >
              <input type="hidden" name="id" value={webhook.id} />
              <input
                type="text"
                name="name"
                defaultValue={webhook.name}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Editar
              </button>
            </form>

            <form
              action={async () => {
                'use server';
                await deleteWebhook(webhook.id);
              }}
            >
              <input type="hidden" name="id" value={webhook.id} />
              <button
                type="submit"
                className="bg-red-500 text-white p-2 rounded"
              >
                Excluir
              </button>
            </form>

            <Link
              href={`/webhook/${webhook.name}`}
              className="bg-green-500 text-white p-2 rounded"
            >
              Go
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
