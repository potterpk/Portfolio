# moessa.dev

Personal portfolio and CTF writeup platform. Built it instead of paying for a writeup site.

Live at [moessa.dev](https://moessa.dev).

## stack

HTML / CSS / vanilla JS — Node.js + Express — Cloudflare Pages

## running locally

```bash
cd server
npm install
cp ../.env.example ../.env
node index.js
```

Site runs at `http://localhost:3000`. Set `ADMIN_TOKEN` in `.env` before posting writeups.

## posting a writeup

```bash
curl -X POST http://localhost:3000/api/writeups \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "...", "comp": "...", "cat": "web", "diff": "medium", "pts": 300, "date": "2026-01-15", "desc": "...", "writeup": "...", "flag": "flag{...}"}'
```

Categories: `web` `crypto` `binary` `forensics` `re` `network` `osint` `misc`
