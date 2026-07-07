---
title: Remote dev access
type: guide
status: active
updated: 2026-07-06
audience: internal
description: How to run the dev server and open it from another device — same-wifi (LAN), across the internet over Tailscale, via a clean HTTPS MagicDNS URL, and over SSH. Explains ports, host binding, and every command's syntax.
tags:
  - project/acyr
  - domain/networking
  - domain/dns
  - provider/tailscale
related:
  - "[[02-node-toolchain|node toolchain]]"
aliases:
  - remote-dev-access
---

# Remote dev access

**Goal:** you run `pnpm dev-server` on your Mac and you want to *see the site on another device* — your phone, a second laptop, or from somewhere else entirely. This explains how, from zero.

## 0. The mental model (read this first)

When you run the dev server, a program (Vite) starts **listening** on your machine at an address + a port number, like `localhost:5173`.

- **An address** is *which network door* it listens on.
- **A port** is *which numbered slot* behind that door — `5173`, `3333`, etc. Different programs use different port numbers so they don't collide.
- **`localhost` (a.k.a. `127.0.0.1`)** is a special address meaning *"only this same machine."* Nothing outside the Mac can reach it. That is the default, and it's why your phone got nothing.

To let another device in, you have to tell Vite to listen on a door the outside can knock on. That one setting is called **`host`**.

```
default:      Vite listens on  localhost  → only THIS Mac can connect
what we want: Vite listens on  0.0.0.0    → every network the Mac is on can connect
```

`0.0.0.0` is not a real single address — it's shorthand for **"all network interfaces at once"** (wifi/LAN, *and* the Tailscale virtual network). One switch opens every door.

## 1. Prerequisites

| Need | Have it? | See |
|---|---|---|
| Node + pnpm working | `node -v`, `pnpm -v` return versions | [[02-node-toolchain|node toolchain]] |
| The `host: true` setting | already set in `apps/website/vite.config.js` | §3 below |
| Tailscale (only for internet access) | the Tailscale menu-bar app, logged in | §5 |

## 2. The ports in this repo

`pnpm dev-server` starts **three** apps at once, each on its own port:

| App | Command under the hood | Port | URL on this Mac |
|---|---|---|---|
| **website** (the storefront) | `vite` | `5173` | `http://localhost:5173` |
| **styleguide** | `vite` (pinned) | `5174` | `http://localhost:5174` |
| **studio** (Sanity CMS) | `sanity dev` | `3333` | `http://localhost:3333` |

The number after the `:` in a URL **is** the port. `localhost:5173` = "port 5173 on this machine." When Vite starts it prints these — read its output, don't guess.

> The styleguide is pinned to `5174` on purpose so the website reliably owns `5173` (a dev link in the styleguide points at `5173`). See `apps/styleguide/vite.config.js`.

## 3. Making the server reachable — the `host` switch

By default Vite listens on `localhost` only. This repo turns that off for the **website** in `apps/website/vite.config.js`:

```js
export default defineConfig({
  envDir: '../../',
  // host: true binds 0.0.0.0 (all interfaces) so the dev server is reachable
  // over the LAN (192.168.x) and the tailnet (100.x) IP, not just localhost.
  server: { host: true },
  plugins: [react(), svgr(), tailwindcss()],
})
```

**`server: { host: true }`** is the whole trick. `true` means "bind `0.0.0.0`" = listen on every network interface. After adding it, **restart the dev server** (config is only read at startup):

```bash
pnpm dev-server
```

Vite now prints an extra line — note the word **Network**:

```
  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.23:5173/     ← LAN address, other devices use this
```

**Only the website is opened up.** styleguide + studio still listen on `localhost` only. To expose those too, add the same `server: { host: true }` to `apps/styleguide/vite.config.js`, and for Sanity run it with a host flag: `sanity dev --host 0.0.0.0`.

### Do it without editing the file (one-off)

Every command below has a live equivalent — the `--host` flag does the same thing for a single run, no file change:

```bash
pnpm --filter website dev -- --host
```

- `pnpm --filter website` — run a script in the `website` workspace only.
- `dev` — the script name.
- `--` — "everything after this belongs to the command, not to pnpm."
- `--host` — Vite's flag to bind all interfaces.

## 4. LAN access — same wifi / same network

This is the easy case: the other device is on the **same wifi** as the Mac.

1. Make sure `host` is on (§3) and the server is running.
2. Find the Mac's LAN address — it's the `Network:` line Vite printed, e.g. `192.168.1.23`. (Anything starting `192.168.` or `10.` is a private LAN address.)
3. On the phone/other laptop, open:

```
http://192.168.1.23:5173
```

That's it — same address you'd type in a browser, just the Mac's LAN IP instead of `localhost`, and don't forget the `:5173` port.

**Caveat:** LAN addresses can change when the router hands out a new one (DHCP lease). If it stops working, re-check the `Network:` line. LAN also exposes the server to *everyone on that wifi* — fine at home, not on café wifi. For anything untrusted, use Tailscale instead.

## 5. Tailscale — access from anywhere, securely

[Tailscale](https://tailscale.com) builds a **private network (a "tailnet")** between *your own devices*, over the internet, encrypted. Once your Mac and your phone are both logged into the same tailnet, they can reach each other **from anywhere** — different wifi, different city — as if they were on the same LAN, and **no one else can**.

Every device on the tailnet gets a permanent address in the `100.x.x.x` range (unlike LAN `192.168.x`, this one doesn't change).

**Setup (once):**
1. Install Tailscale on the Mac and on the phone (App Store / [tailscale.com/download](https://tailscale.com/download)).
2. Log into the **same account** on both.
3. Done — they can now see each other.

**Find the Mac's Tailscale address:**

```bash
tailscale ip -4
```

- `tailscale` — the CLI.
- `ip` — "print my addresses."
- `-4` — "IPv4 only" (the short `100.x` one; without it you also get a long IPv6 one).

For this Mac that returns **`100.66.68.91`**. So from any device on the tailnet, with the server running + `host` on:

```
http://100.66.68.91:5173
```

Because `host: true` binds `0.0.0.0`, the Tailscale interface is already covered — nothing extra to configure. If the CLI isn't found, the app bundles it at `/Applications/Tailscale.app/Contents/MacOS/Tailscale`.

## 6. MagicDNS — the friendly `.ts.net` name

Typing `100.66.68.91` is ugly. **MagicDNS** (a Tailscale feature, on by default) gives every device a **name** that resolves to its `100.x` address, so you can use a URL with real words in it.

This Mac's MagicDNS name is:

```
yrs-imac.tail485b10.ts.net
```

- `yrs-imac` — the machine's name.
- `tail485b10.ts.net` — your tailnet's unique domain suffix.

So the same dev server, nicer URL:

```
http://yrs-imac.tail485b10.ts.net:5173
```

**Check your own name / suffix:**

```bash
tailscale status --json | grep -i dnsname
```

`tailscale status` lists every device on the tailnet; `--json` prints it as machine-readable data; `grep -i dnsname` filters to the name lines (`-i` = case-insensitive). Or just run `tailscale status` (no flags) for a plain readable list.

> These `.ts.net` names only resolve **inside your tailnet** — a random person can't use them. That privacy is the point.

## 7. `tailscale serve` — clean HTTPS, no port number

The URLs above still have the `:5173` port and are plain `http`. `tailscale serve` puts a small HTTPS proxy in front, giving a real certificate and dropping the port:

```bash
tailscale serve --bg 5173
```

- `serve` — "proxy something to my tailnet devices."
- `--bg` — "run in the background" (so it keeps going after you close the terminal).
- `5173` — the local port to put behind HTTPS.

Result — reachable from your tailnet:

```
https://yrs-imac.tail485b10.ts.net
```

No port, real TLS lock. **Turn it off** when done:

```bash
tailscale serve --https=443 off
```

Skip this unless the port annoys you — §6 already works. (Do **not** confuse `serve` with `funnel`: `tailscale funnel` exposes the server to the **whole public internet**. You almost never want that for a dev server.)

## 8. SSH into the Mac over Tailscale

Separate from viewing the site: sometimes you want a **terminal** on the Mac from another device (this is how the agent reaches client machines). Tailscale makes that reachable from anywhere without opening router ports.

**Plain SSH** (macOS Remote Login must be on: System Settings → General → Sharing → Remote Login):

```bash
ssh acyr@100.66.68.91
```

- `ssh` — the secure-shell client.
- `acyr` — the macOS username to log in as.
- `@100.66.68.91` — the machine (Tailscale IP, or the MagicDNS name `acyr@yrs-imac.tail485b10.ts.net`).

**Tailscale SSH** (optional, nicer): if you run `tailscale up --ssh` on the Mac, Tailscale handles the auth via your tailnet identity — no SSH keys to manage, and it works from any tailnet device with `ssh acyr@yrs-imac`.

## 9. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Phone can't load `192.168.x:5173` | `host` not on, or server not restarted | §3 — add `server: { host: true }`, **restart** |
| Works on Mac, not on any other device | still bound to `localhost` | same as above — check Vite printed a `Network:` line |
| LAN worked yesterday, not today | LAN IP changed (DHCP) | re-read the `Network:` line for the new IP |
| `tailscale: command not found` | CLI not on PATH | use `/Applications/Tailscale.app/Contents/MacOS/Tailscale` |
| `100.x` URL times out | one device not logged into the tailnet, or Tailscale paused | open the Tailscale app on both, confirm both "Connected" |
| `.ts.net` name won't resolve | MagicDNS off, or device not on the tailnet | `tailscale status` to confirm; enable MagicDNS in the admin console |
| Right port, still nothing | wrong app's port | website=5173, styleguide=5174, studio=3333 — match the URL to the app |

## Related

- [[02-node-toolchain|node toolchain]] — the Node/pnpm setup this all runs on.
