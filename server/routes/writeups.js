const express = require('express');
const { read, write } = require('../db');

const router = express.Router();

const VALID_CATS  = ['web', 'crypto', 'binary', 'forensics', 're', 'network', 'osint', 'misc'];
const VALID_DIFFS = ['easy', 'medium', 'hard'];

function requireAdmin(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '').trim();
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ error: 'unauthorized' });
  }
  next();
}

router.get('/', (req, res) => {
  const { cat, q } = req.query;
  let { writeups } = read();

  if (cat && cat !== 'all' && VALID_CATS.includes(cat)) {
    writeups = writeups.filter(w => w.cat === cat);
  }

  if (q) {
    const query = q.toLowerCase();
    writeups = writeups.filter(w =>
      [w.title, w.comp, w.desc, w.cat].some(f => (f || '').toLowerCase().includes(query))
    );
  }

  res.json(writeups.slice().reverse());
});

router.get('/:id', (req, res) => {
  const { writeups } = read();
  const w = writeups.find(x => x.id === Number(req.params.id));
  if (!w) return res.status(404).json({ error: 'not found' });
  res.json(w);
});

router.post('/', requireAdmin, (req, res) => {
  const { title, comp, cat, diff, pts, date, desc, writeup, flag } = req.body;

  if (!title || !comp || !cat)
    return res.status(400).json({ error: 'title, comp, and cat are required' });
  if (!VALID_CATS.includes(cat))
    return res.status(400).json({ error: `cat must be one of: ${VALID_CATS.join(', ')}` });
  if (diff && !VALID_DIFFS.includes(diff))
    return res.status(400).json({ error: `diff must be one of: ${VALID_DIFFS.join(', ')}` });
  if (typeof title   === 'string' && title.length   > 200)    return res.status(400).json({ error: 'title too long' });
  if (typeof writeup === 'string' && writeup.length > 50_000) return res.status(400).json({ error: 'writeup too long' });

  const data  = read();
  const entry = {
    id: data.next++, title, comp, cat,
    diff:    diff    || 'medium',
    pts:     pts     || 0,
    date:    date    || null,
    desc:    desc    || '',
    writeup: writeup || '',
    flag:    flag    || '',
    created_at: new Date().toISOString(),
  };
  data.writeups.push(entry);
  write(data);

  res.status(201).json({ id: entry.id });
});

router.patch('/:id', requireAdmin, (req, res) => {
  const data = read();
  const idx  = data.writeups.findIndex(x => x.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'not found' });

  const allowed = ['title', 'comp', 'cat', 'diff', 'pts', 'date', 'desc', 'writeup', 'flag'];
  allowed.forEach(k => { if (k in req.body) data.writeups[idx][k] = req.body[k]; });
  write(data);

  res.json({ ok: true });
});

router.delete('/:id', requireAdmin, (req, res) => {
  const data = read();
  const idx  = data.writeups.findIndex(x => x.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'not found' });

  data.writeups.splice(idx, 1);
  write(data);
  res.json({ ok: true });
});

module.exports = router;
