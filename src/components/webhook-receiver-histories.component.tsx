'use client';

import { revalidateWebhook } from '@/actions/revalidate';
import { deleteWebhookHistories } from '@/actions/webhook-received';
import { CopyButton } from '@/components/buttons/copy-button.component';
import { RefreshButton } from '@/components/buttons/refresh-button.component';
import { DeleteButton } from '@/components/buttons/trash-button.component';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/utils/date.utils';
import { useActionState, useEffect, useState } from 'react';

function getMethodColor(method: string) {
  switch (method?.toUpperCase()) {
    case 'GET':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'POST':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'PUT':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'DELETE':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
}

function formatJson(json: string) {
  if (!json) return;

  try {
    return JSON.stringify(JSON.parse(json), null, 2);
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
}

type WebhookType = {
  name: string;
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

type WebhookHistoryType = {
  body: string;
  id: number;
  webhookReceivedId: number;
  method: string;
  headers: string;
  timestamp: Date;
};

interface WebhookReceiverHistoriesProps {
  webhook: WebhookType;
  histories: WebhookHistoryType[];
}

export function WebhookReceiverHistories({
  histories,
  webhook,
}: WebhookReceiverHistoriesProps) {
  const [selectedRequest, setSelectedRequest] =
    useState<WebhookHistoryType | null>(null);
  const [, deleteWebhookHistoriesAction, isPending] = useActionState(
    deleteWebhookHistories,
    null
  );
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWebhookUrl(`${window.location.origin}/api/webhook/${webhook.name}`);
    }
  }, [webhook.name]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Webhook Receiver URL</CardTitle>
          <CardDescription>
            Use this URL to receive webhook requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <div className="bg-muted p-2 rounded-md flex-1 overflow-x-auto text-sm font-mono">
              {webhookUrl || 'Loading URL...'}
            </div>
            <CopyButton
              copyValue={webhookUrl}
              tooltip="Copy Webhook URL to clipboard"
              toastTitle="Copied Webhook URL"
              toastDescription="Webhook URL copied to clipboard"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Webhook History</h2>
        <div className="flex space-x-2">
          <RefreshButton
            onClick={() => revalidateWebhook(webhook.name)}
            tooltip="Refresh Webhook History"
            toastTitle="Webhook History Refreshed"
            toastDescription="Webhook history has been refreshed"
          />
          <DeleteButton
            onClick={() => deleteWebhookHistoriesAction(webhook.id)}
            title="Clear History"
            disabled={isPending || histories.length === 0}
            tooltip="Clear all webhook request history"
            toastTitle="History Cleared"
            toastDescription="Webhook history has been cleared"
            dialogActionText="Clear History"
            dialogCancelText="Cancel"
            dialogTitle="Are you sure?"
            dialogDescription="This will permanently delete all webhook request history."
          />
        </div>
      </div>

      {histories.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <p>No webhook requests received yet</p>
            <p className="text-sm mt-1">
              Send a request to your webhook URL to see it here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-[1fr_1.5fr]">
          <Card className="h-[500px] flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle>Received Requests</CardTitle>
            </CardHeader>
            <ScrollArea className="flex-1 flex max-h-[400px]">
              <CardContent className="flex-1 pt-0 space-y-2">
                {histories.map((history) => (
                  <div
                    key={history.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedRequest?.id === history.id
                        ? 'bg-muted/50 border-primary'
                        : ''
                    }`}
                    onClick={() => setSelectedRequest(history)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={getMethodColor(history.method)}>
                        {history.method || 'UNKNOWN'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(history.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>

          <Card className="h-[500px] flex flex-col">
            <CardHeader className="space-y-2">
              <CardTitle>Request Details</CardTitle>

              {selectedRequest && (
                <div className="w-full flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">Method:</span>{' '}
                    <Badge className={getMethodColor(selectedRequest?.method)}>
                      {selectedRequest?.method || 'UNKNOWN'}
                    </Badge>
                  </div>
                  <div>
                    <span className="font-medium">Received:</span>{' '}
                    {formatDate(selectedRequest?.timestamp)}
                  </div>
                </div>
              )}
            </CardHeader>

            {selectedRequest ? (
              <div className="flex-1 flex flex-col">
                <Tabs defaultValue="body" className="flex-1 flex flex-col">
                  <div className="px-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="body">Body</TabsTrigger>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent
                    value="body"
                    className="flex-1 flex flex-col px-6 pt-2"
                  >
                    <ScrollArea className="flex-1 p-4 rounded-md border bg-muted/50">
                      <pre className="text-sm font-mono max-h-[300px] max-w-[300px]">
                        {formatJson(selectedRequest.body)}
                      </pre>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent
                    value="headers"
                    className="flex-1 flex flex-col px-6 pt-2"
                  >
                    <ScrollArea className="flex-1 rounded-md border bg-muted/50">
                      <div className="p-4 max-h-[300px]">
                        {Object.entries(
                          JSON.parse(selectedRequest.headers) || {}
                        ).map(([key, value]) => (
                          <div key={key} className="mb-2">
                            <div className="text-sm font-medium">{key}:</div>
                            <div className="text-sm font-mono break-all">
                              {value as string}
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                <div>
                  <p>Select a request from the list to view details</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
