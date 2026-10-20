# 02 Config and logger

Run this server from this directory. Packages are installed in the repository root.

```bash
../../../node_modules/.bin/tsx --env-file=../../../.env.development server.ts
```

`HOST`, `PORT`, and `NODE_ENV` are read from the environment and checked with Zod before the process listens. `PORT` must be an integer from 1 to 65535. `NODE_ENV` is `development`, `production`, or `test`. A missing `NODE_ENV` becomes `development`.

Logs are JSON lines from pino. The `name` field is the last two path segments of the file that created the logger. In `development` the level is `debug`. Otherwise it is `error`, so request lines are omitted.

`GET /` returns `{ "status": "OK" }`. Any other path returns `404` and `{ "error": "Not Found" }`.
