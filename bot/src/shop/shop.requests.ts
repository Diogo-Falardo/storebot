const API_URL = process.env.API_URL!;
const BOT_SECRET = process.env.BOT_SECRET!;

const urlShops = "/shop";

export async function createShopTgOnly(tgUserId: number, shopName: string) {
  const res = await fetch(`${API_URL}${urlShops}/tg/create`, {
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
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text}`);
  }

  return res.json();
}
