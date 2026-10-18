import { createServer } from "node:http";

const port = process.env.PORT;
const host = process.env.HOST;

if (port === undefined || host === undefined) {
  throw new Error("HOST and PORT must be set");
}

const server = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ status: "OK" }));
});

server.listen({ port, host }, () => {
  console.log(
    `Vanilla server is running on http://${process.env.HOST}:${process.env.PORT}`,
  );
});
