import pino from "pino";
import { env } from "./config.js";

export function createLogger(filename: string) {
  const name = filename.split("/").slice(-2).join("/");

  return pino({
    name,
    level: env.NODE_ENV === "development" ? "debug" : "error",
  });
}
