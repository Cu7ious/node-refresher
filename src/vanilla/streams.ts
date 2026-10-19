// ./node_modules/.bin/tsx --env-file=.env.development src/vanilla/streams.ts
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import {
  createServer,
  type IncomingMessage,
  type ServerResponse,
} from "node:http";
import { pipeline } from "node:stream/promises";

const port = process.env.PORT;
const host = process.env.HOST;
const url = `http://${host}:${port}`;

if (port === undefined || host === undefined) {
  throw new Error("HOST and PORT must be set");
}

function isClientDisconnect(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const code = "code" in err ? err.code : undefined;
  return (
    code === "ERR_STREAM_PREMATURE_CLOSE" ||
    code === "ECONNRESET" ||
    err.name === "AbortError"
  );
}

function sendJson(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
}

async function sendFile(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { Allow: "GET, HEAD" });
    res.end();
    return;
  }

  const { size } = await stat(__filename);
  res.writeHead(200, {
    "Content-Type": "text/plain; charset=utf-8",
    "Content-Length": size,
  });

  if (req.method === "HEAD") {
    res.end();
    return;
  }

  await pipeline(createReadStream(__filename), res);
}

const server = createServer(async (req, res) => {
  const parsedUrl = new URL(req.url ?? "/", url);

  try {
    if (parsedUrl.pathname === "/") {
      sendJson(res, 200, { status: "OK" });
      return;
    }

    if (parsedUrl.pathname === "/code") {
      await sendFile(req, res);
      return;
    }

    sendJson(res, 404, { error: "Not Found" });
  } catch (err) {
    if (isClientDisconnect(err)) return;

    console.error(err);
    if (res.headersSent || res.destroyed) {
      res.destroy();
      return;
    }

    sendJson(res, 500, { error: "Internal Server Error" });
  }
});

server.listen({ port, host }, () => {
  console.log(`Vanilla server is running on ${url}`);
});
