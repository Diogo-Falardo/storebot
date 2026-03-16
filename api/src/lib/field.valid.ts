import { z } from "zod";

// used to validate bot request
export const REQUIRED_TELEGRAM_HEADERS = z.object({
  "x-tg-user-id": z.coerce.number().int().positive(),
  "x-bot-secret": z.string().min(1),
});

// Schema to validate a v4 UUID
export const valid_uuid = z.object({
  id: z.uuid("invalid id"),
});
