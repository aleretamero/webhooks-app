'use client';

import {
  createWebhook,
  deleteWebhook,
  // updateWebhook,
} from '@/actions/webhook-received';
import { Button, buttonVariants } from '@/components/atoms/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/atoms/card';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { ScrollArea } from '@/components/atoms/scroll-area';
import { PlusCircle, SquareArrowOutUpRight, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useActionState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatDate = (timestamp: any) => {
  return new Date(timestamp).toLocaleString();
};

interface WebhookRegistrationProps {
  webhooks: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
}

export function WebhookRegistration({ webhooks }: WebhookRegistrationProps) {
  const [, registerWebhookFormAction, registerWebhookPending] = useActionState(
    createWebhook,
    null
  );
  // const [, updateWebhookFormAction] = useActionState(updateWebhook, null);
  const [, deleteWebhookFormAction] = useActionState(deleteWebhook, null);

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
      <Card className="shrink-0 h-56">
        <CardHeader>
          <CardTitle>Add New Webhook Path</CardTitle>
          <CardDescription>Register a new webhook path</CardDescription>
        </CardHeader>
        <form className="space-y-4" action={registerWebhookFormAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Webhook path</Label>
              <Input name="name" required placeholder="main" />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={registerWebhookPending}
              className="w-full"
            >
              {registerWebhookPending ? 'Adding...' : 'Add Webhook'}
              {!registerWebhookPending && (
                <PlusCircle className="ml-2 h-4 w-4" />
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registered Webhooks</CardTitle>
          <CardDescription>Manage your registered webhooks</CardDescription>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <p>No webhooks registered yet</p>
              <p className="text-sm mt-1">
                Add your first webhook using the form
              </p>
            </div>
          ) : (
            <ScrollArea>
              <div className="max-h-96 space-y-3">
                {webhooks.map((webhook) => (
                  <div
                    key={webhook.id}
                    className="border rounded-lg p-4 space-y-3"
                  >
                    <div className="grid grid-cols-[auto_1fr] gap-x-2 text-sm">
                      <span className="font-medium">Path:</span>
                      <span className="truncate">{webhook.name}</span>
                      <span className="font-medium">Created:</span>
                      <span>{formatDate(webhook.createdAt)}</span>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <div className="flex items-center justify-between">
                        <form
                          action={() => deleteWebhookFormAction(webhook.id)}
                        >
                          <input type="hidden" name="id" value={webhook.id} />
                          <Button
                            size="sm"
                            variant="destructive"
                            className="cursor-pointer"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" />
                            Remove
                          </Button>
                        </form>
                      </div>

                      <div className="flex items-center justify-between">
                        <Link
                          href={`/webhook/${webhook.name}`}
                          className={buttonVariants({
                            size: 'sm',
                            variant: 'link',
                          })}
                        >
                          <SquareArrowOutUpRight className="mr-2 h-3.5 w-3.5" />
                          Go to
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
