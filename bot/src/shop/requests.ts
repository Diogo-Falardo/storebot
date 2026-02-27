import type { User } from "grammy/types";

const API_URL = process.env.API_URL!;
const BOT_SECRET = process.env.BOT_SECRET!;

// ----------
// RELATED TO USERS ENDPOINTS
// ----------

type UserInfo =
  | {
      userId: string;
      shopId: string;
      shopName: string;
      shopType: string;
      shopCurrency?: string;
    }
  | "0";

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

  if (!res.ok) {
    console.error(res);
  }

  return res.json();
}

// ----------
// RELATED TO SHOP ENDPOINTS
// ----------

const urlShops = "/shop";
export async function createShopTgOnly(tgUserId: number, shopName: string) {
  const res = await fetch(`${API_URL}${urlShops}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-BOT-SECRET": BOT_SECRET,
      "x-TG-USER-ID": String(tgUserId),
    },
    body: JSON.stringify({
      shopName,
      shopType: "public",
    }),
  });

  if (!res.ok) {
    console.error(res);
  }

  return res.json();
}
