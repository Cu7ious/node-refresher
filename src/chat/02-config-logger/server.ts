import express, {
  type ErrorRequestHandler,
  type Express,
} from "express";
import { env } from "./config.js";
import { createLogger } from "./logger.js";

const log = createLogger(__filename);

export function createApp(): Express {
  const app = express();

  app.use((req, res, next) => {
    const started = Date.now();
    res.on("finish", () => {
      log.info(
        {
          method: req.method,
          url: req.url,
          status: res.statusCode,
          ms: Date.now() - started,
        },
        "request",
      );
    });
    next();
  });

  app.get("/", (_req, res) => {
    res.json({ status: "OK" });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
    log.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  };
  app.use(handleError);

  return app;
}

export function start(): void {
  const app = createApp();
  app.listen({ port: env.PORT, host: env.HOST }, () => {
    log.info({ host: env.HOST, port: env.PORT }, "server listening");
  });
}

start();
