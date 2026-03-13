import { z } from "zod";

// Schema to validate a v4 UUID
export const valid_uuid = z.object({
  id: z.uuid("invalid id"),
});
