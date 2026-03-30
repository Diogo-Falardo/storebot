import type { type_schema_USER } from "../schemas/user.schema.js";

const API_URL = process.env.API_URL!;
const BOT_SECRET = process.env.BOT_SECRET!;

const USER_URL = "/user";

/**
 * true dont have a store
 *
 * false have a store
 * @param tgUserId
 * @returns boolean
 */
export async function userHasStore(
  tgUserId: number,
): Promise<"has a store" | "has no store"> {
  const res = await fetch(`${API_URL}${USER_URL}/validate-me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-BOT-SECRET": BOT_SECRET,
      "x-TG-USER-ID": String(tgUserId),
    },
  });

  const data = await res.json();

  if (data.valid === true) {
    return "has no store";
  } else {
    return "has a store";
  }
}

// returns entire user model
export async function me(tgUserId: number): Promise<type_schema_USER> {
  const res = await fetch(`${API_URL}${USER_URL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-BOT-SECRET": BOT_SECRET,
      "x-TG-USER-ID": String(tgUserId),
    },
  });

  const data: type_schema_USER = await res.json();
  return data;
}
