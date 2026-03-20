import type { SELECT_ENTIRE_USER_type } from "../schemas/user.schema.js";

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
export async function me(tgUserId: number): Promise<SELECT_ENTIRE_USER_type> {
  const res = await fetch(`${API_URL}${USER_URL}/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "X-BOT-SECRET": BOT_SECRET,
      "x-TG-USER-ID": String(tgUserId),
    },
  });

  const data: SELECT_ENTIRE_USER_type = await res.json();
  return data;
}
