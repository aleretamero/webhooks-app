"use server";

import { revalidatePath } from "next/cache";

export async function revalidateWebhook(name: string) {
  revalidatePath(`/webhook/${name}`);
}
