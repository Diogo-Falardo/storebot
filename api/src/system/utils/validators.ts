import { z } from "zod";
/**
 * Validate an Id
 */
export const zId = z.coerce.number().int().positive("Invalid id");
