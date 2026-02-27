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
      shopId: string;
      shopName: string;
      shopType: string;
      shopCurrency?: string;
    }
  | "no shops";

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
    return "no shops";
  }

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
