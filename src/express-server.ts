import express from "express";
const app = express();

const port = process.env.PORT;
const host = process.env.HOST;

if (port === undefined || host === undefined) {
  throw new Error("HOST and PORT must be set");
}

app.get("/", (_req, res) => {
  res.json({ status: "OK" });
});

app.listen({ port, host }, () => {
  console.log(
    `Express server is running on http://${process.env.HOST}:${process.env.PORT}`,
  );
});
