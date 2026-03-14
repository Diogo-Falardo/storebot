import type { User } from "grammy/types";

const API_URL = process.env.API_URL!;
const BOT_SECRET = process.env.BOT_SECRET!;

// ----------
// RELATED TO USERS ENDPOINTS
// ----------

/**
 * **"true"**: Means user is allowed to create a shop
 */
type UserInfo =
  | {
      userId: string;
      storeId: string;
      storeName: string;
      storeType: string;
      storeCurrency?: string;
    }
  | "no stores";

const urlUser = "/user";
export async function getTelegramUserInfo(tgUserId: number): Promise<UserInfo> {
  const res = await fetch(`${API_URL}${urlUser}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-BOT-SECRET": BOT_SECRET,
      "x-TG-USER-ID": String(tgUserId),
    },
  });

  /**
   * This means there is no user on db
   * that is not a problem so we skip it
   */
  if (res.status === 404) {
    return "no stores";
  }

  if (!res.ok) {
    console.error(res);
  }

  return res.json();
}

// ------------ store

const urlStore = "/store";
// create a shop to a user
export async function createStoreTgOnly(tgUserId: number, storeName: string) {
  const res = await fetch(`${API_URL}${urlStore}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-BOT-SECRET": BOT_SECRET,
      "x-TG-USER-ID": String(tgUserId),
    },
    body: JSON.stringify({
      storeName,
      storeType: "public",
    }),
  });

  if (!res.ok) {
    console.error(res);
  }

  return res.json();
}

export async function getStoreInfoByStoreId(tgUserId: number, storeId: string) {
  const res = await fetch(`${API_URL}${urlStore}/public-info/${storeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-BOT-SECRET": BOT_SECRET,
      "x-TG-USER-ID": String(tgUserId),
    },
  });

  if (!res.ok) {
    console.error(res);
  }

  return res.json();
}

export async function getStoreExpireDate(tgUserId: number, storeId: string) {
  const res = await fetch(`${API_URL}${urlStore}/expire-date/${storeId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-BOT-SECRET": BOT_SECRET,
      "x-TG-USER-ID": String(tgUserId),
    },
  });

  if (!res.ok) {
    console.error(res);
  }

  return res.json();
}

const urlPayment = "/payment";
export async function createPaymentLink(telegramId: number, period: string) {
  const res = await fetch(`${API_URL}${urlPayment}/create-link`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ period, telegramId }),
  });

  const data = await res.json();
  if (!res.ok) {
    console.error(res);
    return `❌ ${data.error || "Failed to generate payment link. Please try again."}`;
  }

  if (!data.url) {
    return "❌ Failed to generate payment link. Please try again.";
  }

  return data.url;
}
