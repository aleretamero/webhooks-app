'use client';

import { revalidateWebhook } from '@/actions/revalidate';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast.hook';
import { Copy, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface WebhookReceiverHistoriesProps {
  webhook: {
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
  };
  histories: {
    body: string;
    id: number;
    webhookReceivedId: number;
    method: string;
    headers: string;
    timestamp: Date;
  }[];
}

export function WebhookReceiverHistories({
  histories,
  webhook,
}: WebhookReceiverHistoriesProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [webhookUrl, setWebhookUrl] = useState('');
  const toast = useToast();
  // const pathname = usePathname();
  // const [showClearConfirm, setShowClearConfirm] = useState(false);
  // const [isRefreshing, setIsRefreshing] = useState(false);
  // const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setWebhookUrl(`${window.location.origin}/api/webhook/${webhook.name}`);
    }
  }, [webhook.name]);

  const copyToClipboard = () => {
    if (navigator.clipboard && webhookUrl) {
      navigator.clipboard.writeText(webhookUrl);
      toast.success({
        title: 'Copied to clipboard',
        description: 'Webhook URL copied to clipboard',
      });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatDate = (timestamp: any) => {
    return new Date(timestamp).toLocaleString();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const formatJson = (json: any) => {
    try {
      if (typeof json === 'string') {
        return JSON.stringify(JSON.parse(json), null, 2);
      }
      return JSON.stringify(json, null, 2);
    } catch {
      return json;
    }
  };

  const getMethodColor = (method: string) => {
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
  };

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
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
        {/* <CardFooter className="text-sm text-muted-foreground">
          Send webhook requests to this URL to see them appear in the history
          below.
        </CardFooter> */}
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Webhook History</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => revalidateWebhook(webhook.name)}
          >
            <RefreshCw className={`h-4 w-4 mr-2`} />
            Refresh
          </Button>
          <Button
            variant="destructive"
            size="sm"
            // onClick={() => setShowClearConfirm(true)}
            // disabled={receivedWebhooks.length === 0}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear History
          </Button>
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
                    {/* <div className="text-sm truncate">
                      {history.body.length > 50
                        ? JSON.stringify(history.body).substring(0, 50) + '...'
                        : 'No body'}
                    </div> */}
                  </div>
                ))}
              </CardContent>
            </ScrollArea>
          </Card>

          <Card className="h-[500px] flex flex-col">
            <CardHeader className="space-y-2">
              <CardTitle>Request Details</CardTitle>

              <div className="w-full flex justify-between items-center text-sm">
                <div>
                  <span className="font-medium">Method:</span>{' '}
                  <Badge className={getMethodColor(selectedRequest.method)}>
                    {selectedRequest.method || 'UNKNOWN'}
                  </Badge>
                </div>
                <div>
                  <span className="font-medium">Received:</span>{' '}
                  {formatDate(selectedRequest.timestamp)}
                </div>
              </div>
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

      {/* <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all webhook request history.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearHistory}>
              Clear History
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div>
    // <main className="p-10">
    //   <h1 className="text-2xl font-bold mb-4">Histórico de {webhook.name}</h1>

    //   <form
    //     action={async () => {
    //       'use server';
    //       await revalidateWebhook(webhook.name);
    //     }}
    //   >
    //     <button
    //       type="submit"
    //       className="bg-blue-500 text-white p-2 rounded mb-4"
    //     >
    //       🔄 Revalidar
    //     </button>
    //   </form>

    //   {histories.length === 0 ? (
    //     <p className="text-gray-500">Nenhum histórico encontrado.</p>
    //   ) : (
    //     <ul className="space-y-2">
    //       {histories.map((history) => (
    //         <li key={history.id} className="p-4 bg-gray-100 rounded-lg shadow">
    //           <p>
    //             <strong>Método:</strong> {history.method}
    //           </p>

    //           <p>
    //             <strong>Headers:</strong>
    //           </p>
    //           <pre className="whitespace-pre-wrap break-words bg-gray-800 text-green-300 p-2 rounded text-sm overflow-auto">
    //             {JSON.stringify(JSON.parse(history.headers), null, 2)}
    //           </pre>

    //           <p>
    //             <strong>Body:</strong>
    //           </p>
    //           <pre className="whitespace-pre-wrap break-words bg-gray-800 text-green-300 p-2 rounded text-sm overflow-auto">
    //             {JSON.stringify(JSON.parse(history.body), null, 2)}
    //           </pre>

    //           <p className="text-sm text-gray-500">
    //             {new Date(history.timestamp).toLocaleString()}
    //           </p>
    //         </li>
    //       ))}
    //     </ul>
    //   )}
    // </main>
  );
}
