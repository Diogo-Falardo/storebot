# Telegram Shops (formerly storebot)

> Build your own **private, invite-only personal shop** inside Telegram.  
> Full owner control. Direct customer relationships. Zero platform cuts.

# App Security

## Authentication

### How it works

Login is handled by the TanStack Start server function `authentication` (POST). It accepts Telegram WebApp `initData` as a string, reads the `user` field, and maps that Telegram user to an internal account.

1. Parse `initData` with `URLSearchParams` and JSON-decode `user` (`id`, optional `username`).
2. Look up the user by Telegram id (`fetchTelegramId`). If none exists, create the user and a shop, then continue.
3. Update last login, sign a short-lived JWT for the internal user id, set the session cookie, and return `"ok"`.

For local testing, `FAKE_INITDATA` provides a fixed sample string.

### Session

After a successful login, the server sets an httpOnly cookie named `tg_session`. The value is a JWT signed with HS256, expiring in one hour, with payload `{ sub: userId }` (internal id only). Cookie flags: `secure`, `sameSite: "lax"`, `path: "/"`, `maxAge` 1 hour. The handler does not return the token or user ids to the client—only `"ok"`.

### Verify later requests

`verifyAuthenticationToken` reads `tg_session`, verifies the JWT with `JWT_SECRET` (HS256), requires a string `sub`, and calls `fetchUser` so the user still exists. On success it returns that `userId`; otherwise it throws `Unauthorized`.

### Current limitations (dev)

Telegram hash/signature validation against the bot token is skipped in this path (commented for development). `BOT_TOKEN` is not used at runtime here. Identity is taken from the `user` field in the submitted `initData` string.

### Env

- `JWT_SECRET` — required to sign and verify session JWTs
