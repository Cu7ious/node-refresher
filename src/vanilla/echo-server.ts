// ./node_modules/.bin/tsx --env-file=.env.development src/vanilla/echo-server.ts
import http from "node:http";

const port = process.env.PORT;
const host = process.env.HOST;

if (port === undefined || host === undefined) {
  throw new Error("HOST and PORT must be set");
}

const server = new http.Server(); // Is basically EE

server.listen({ port, host }, () => {
  console.log(
    `Server is running on http://${process.env.HOST}:${process.env.PORT}`,
  );
});

server.on("request", (req, res) => {
  const parsedUrl = new URL(req.url ?? "/", `http://${host}:${port}`);

  if (parsedUrl.pathname === "/") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "OK" }));
  } else if (parsedUrl.pathname.startsWith("/echo")) {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "OK", url: parsedUrl.toString() }));
  } else {
    res.writeHead(404, { "content-type": "application/json" });
    res.end(JSON.stringify({ status: "NOT_FOUND", url: parsedUrl.toString() }));
  }
});
