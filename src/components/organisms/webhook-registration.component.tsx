'use client';

import {
  createWebhook,
  deleteWebhook,
  // updateWebhook,
} from '@/actions/webhook-received';
import { Button } from '@/components/atoms/button';
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
import { Tooltip } from '@/components/molecules/tooltip.component';
import { DeleteButton } from '@/components/molecules/trash-button.component';
import { formatDate } from '@/utils/date.utils';
import { PlusCircle, SquareArrowOutUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useActionState } from 'react';

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
  const router = useRouter();

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
            <Tooltip
              trigger={
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
              }
              tooltip="Add webhook path"
            />
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
                        <DeleteButton
                          onClick={() => deleteWebhookFormAction(webhook.id)}
                          title="Remove"
                          dialogTitle="Remove Webhook"
                          dialogDescription="Are you sure you want to remove this webhook?"
                          dialogActionText="Remove"
                          dialogCancelText="Cancel"
                          toastTitle="Webhook removed"
                          toastDescription="The webhook has been removed successfully"
                          tooltip="Remove webhook"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Tooltip
                          trigger={
                            <Button
                              onClick={() =>
                                router.push(`/webhook/${webhook.name}`)
                              }
                              size="sm"
                              variant="link"
                            >
                              <SquareArrowOutUpRight className="mr-2 h-3.5 w-3.5" />
                              Go to
                            </Button>
                          }
                          tooltip="Go to webhook path"
                        />
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
