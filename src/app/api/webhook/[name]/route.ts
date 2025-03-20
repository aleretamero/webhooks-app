import { prisma } from '@/lib/prisma';
import { type NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from "next/cache"; 

export async function POST(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  return handleWebhook(request, params.name, 'POST');
}

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  return handleWebhook(request, params.name, 'GET');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  return handleWebhook(request, params.name, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  return handleWebhook(request, params.name, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  return handleWebhook(request, params.name, 'DELETE');
}

async function handleWebhook(
  request: NextRequest,
  name: string,
  method: string
) {
  try {
    console.log(`Received ${method} webhook request for name: ${name}`);

    // Get headers
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });
    console.log('Webhook headers:', headers);

    // Get body
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let body: any = null;
    try {
      const contentType = request.headers.get('content-type') || '';
      console.log('Content-Type:', contentType);

      if (contentType.includes('application/json')) {
        body = await request.json();
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        body = Object.fromEntries(formData);
      } else {
        body = await request.text();
      }
      console.log('Webhook body:', body);
    } catch (error) {
      console.error('Error parsing request body:', error);
      // If we can't parse the body, continue with null body
    }

    const webhookReceived = await prisma.webhookReceived.findUnique({
      select: { id: true },
      where: {
        name: name,
      },
    });

    if (!webhookReceived) {
      return NextResponse.json(
        { success: false, error: 'Webhook not found' },
        { status: 404 }
      );
    }

    await prisma.webhookReceivedHistory.create({
      data: {
        webhookReceivedId: webhookReceived.id,
        method: method,
        headers: JSON.stringify(headers),
        body: JSON.stringify(body),
      },
    });
    console.log('Webhook data stored successfully');

    revalidatePath(`/webhook/${name}`);

    // Return a success response
    return NextResponse.json({
      success: true,
      message: 'Webhook received successfully',
    });
  } catch (error) {
    console.error('Error handling webhook:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}
