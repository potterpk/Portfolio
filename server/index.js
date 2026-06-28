require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const rateLimit = require('express-rate-limit');

const writeupsRouter = require('./routes/writeups');

const app  = express();
const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || false }));
app.use(express.json({ limit: '64kb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));

app.use(express.static(path.join(__dirname, '..')));
app.use('/api/writeups', rateLimit({ windowMs: 60_000, limit: 20, standardHeaders: true, legacyHeaders: false }), writeupsRouter);

app.use((req, res) => {
  if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'not found' });
  res.status(404).send('404 — page not found');
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
