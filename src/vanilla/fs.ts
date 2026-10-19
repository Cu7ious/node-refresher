// ./node_modules/.bin/tsx --env-file=.env.development src/vanilla/fs.ts
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";

const ROOT = __dirname + "/public/";

const port = process.env.PORT;
const host = process.env.HOST;

if (port === undefined || host === undefined) {
  throw new Error("HOST and PORT must be set");
}

const readReadme = async () => {
  try {
    const result = await readFile("./README.md");
    return result;
  } catch (err) {
    return err;
  }
};

const readPublic = async (reqPath: string) => {
  const filePath = path.normalize(path.join(ROOT, reqPath));
  try {
    const file = await readFile(filePath);
    console.log("filePath:", filePath);
    console.log("file:", file);
    return file;
  } catch (err) {
    console.error(err);
    return err;
  }
};

const server = createServer((req, res) => {
  const parsedUrl = new URL(req.url ?? "/", `http://${host}:${port}`);

  if (parsedUrl.pathname === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "OK" }));
  } else if (parsedUrl.pathname === "/file") {
    readReadme()
      .then((readRes) => {
        res.end(readRes);
      })
      .catch((err) => {
        console.log(err);
        res.writeHead(500);
        res.end(JSON.stringify(err));
      });
  } else if (parsedUrl.pathname.startsWith("/public")) {
    const clientPath = parsedUrl.pathname.split("/public")[1];
    readPublic(clientPath)
      .then((reqFile) => {
        res.end(reqFile);
      })
      .catch((err) => {
        res.writeHead(404);
        res.end("File not found");
      });
  }
});

server.listen({ port, host }, () => {
  console.log(
    `Vanilla server is running on http://${process.env.HOST}:${process.env.PORT}`,
  );
});
