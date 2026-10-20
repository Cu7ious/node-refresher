import { z } from "zod";

const envSchema = z.object({
  HOST: z.string().min(1),
  PORT: z.coerce.number().int().min(1).max(65535),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(parsed.error.message);
}

export const env = parsed.data;
