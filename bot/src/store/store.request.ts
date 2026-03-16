const API_URL = process.env.API_URL!;
const BOT_SECRET = process.env.BOT_SECRET!;

const urlStore = "/store";

export async function createStore(
  tgUserId: number,
  storeName: string,
  storeType: string,
) {
  const res = await fetch(`${API_URL}${urlStore}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-BOT-SECRET": BOT_SECRET,
      "x-TG-USER-ID": String(tgUserId),
    },
    body: JSON.stringify({
      storeName,
      storeType,
    }),
  });

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
