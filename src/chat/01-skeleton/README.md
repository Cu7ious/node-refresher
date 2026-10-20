# 01 Skeleton

Run this server from this directory. Packages are installed in the repository root.

```bash
../../../node_modules/.bin/tsx --env-file=../../../.env.development server.ts
```

`GET /` returns `{ "status": "OK" }`. Any other path returns `404` and `{ "error": "Not Found" }`. An unexpected exception returns `500` and `{ "error": "Internal Server Error" }`.
