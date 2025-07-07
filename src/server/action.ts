"use server";
import { db } from "./db";

export async function ReceiptScanner(file: File) {
  try {
  } catch (error) {}
}

export async function getDefaultAccountId() {
  return await db.account
    .findFirst({
      where: {
        isDefaultAccount: true,
      },
    })
    .then((value) => value?.id);
}
