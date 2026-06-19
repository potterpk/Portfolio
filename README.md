# muhammadessa.dev

Personal portfolio and CTF writeup platform. Built from scratch — no frameworks, no build tools.

## Stack

- **Frontend** — plain HTML, CSS, JavaScript
- **Backend** — Node.js (zero dependencies, stdlib only)
- **Storage** — flat JSON file for writeups

## Structure

```
├── index.html        main portfolio page
├── ctf-labs.html     CTF writeup archive
├── style.css         all styles for index.html
├── ctf-labs.css      styles specific to CTF Labs page
└── server/
    ├── index.js      HTTP server — serves static files + API
    ├── db.js         read/write helpers for writeups.json
    └── routes/
        └── writeups.js  CRUD endpoints for writeups
```

## Running locally

```bash
cp .env.example .env
# set ADMIN_TOKEN in .env to anything you want

node server/index.js
```

Open `http://localhost:3000`.

## API

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/writeups` | — | list all writeups |
| GET | `/api/writeups?cat=crypto` | — | filter by category |
| GET | `/api/writeups/:id` | — | single writeup |
| POST | `/api/writeups` | ✓ | create writeup |
| PATCH | `/api/writeups/:id` | ✓ | update writeup |
| DELETE | `/api/writeups/:id` | ✓ | delete writeup |

Admin endpoints require `Authorization: Bearer <ADMIN_TOKEN>` header.

**Adding a writeup**

```bash
curl -X POST http://localhost:3000/api/writeups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-token" \
  -d '{
    "title":   "Baby RSA",
    "comp":    "NCAE 2025",
    "cat":     "crypto",
    "diff":    "easy",
    "pts":     100,
    "date":    "2025-03-15",
    "desc":    "Small exponent RSA, e=3.",
    "writeup": "### Overview\n\nThe public key had e=3...",
    "flag":    "flag{cube_root_ftw}"
  }'
```

Valid categories: `web` `crypto` `binary` `forensics` `re` `network` `osint` `misc`

Valid difficulties: `easy` `medium` `hard`

## Writeup format

The `writeup` field supports a small markdown subset rendered in the read modal:

```
### Section heading

Regular paragraph text with `inline code` supported.

\`\`\`
code block
goes here
\`\`\`
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | port to listen on |
| `ADMIN_TOKEN` | — | required to use write endpoints |
| `ALLOWED_ORIGIN` | `*` | CORS origin (set to your domain in prod) |

## Deploying

See the domain setup guide in [`DOMAIN.md`](DOMAIN.md) for nginx + Certbot instructions, Railway/Render deployment, and DNS configuration.
