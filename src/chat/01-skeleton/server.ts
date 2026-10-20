import express, {
  type ErrorRequestHandler,
  type Express,
} from "express";

export function createApp(): Express {
  const app = express();

  app.get("/", (_req, res) => {
    res.json({ status: "OK" });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  const handleError: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  };
  app.use(handleError);

  return app;
}

export function start(): void {
  const port = process.env.PORT;
  const host = process.env.HOST;

  if (port === undefined || host === undefined) {
    throw new Error("HOST and PORT must be set");
  }

  const app = createApp();
  app.listen({ port, host }, () => {
    console.log(`Express server is running on http://${host}:${port}`);
  });
}

start();
