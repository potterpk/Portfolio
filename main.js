(function () {
  const out = document.getElementById('term-output');
  if (!out) return;

  const seq = [
    { cmd: 'whoami', output: ['Muhammad Essa'] },
    {
      cmd: 'cat wins.txt',
      output: [
        '<span class="t-hi">[1st]</span> NCAE Regionals NW    / 10 teams',
        '<span class="t-hi">[1st]</span> Dakota Conquest 2026  /  9 teams',
        '<span class="t-lo">[3rd]</span> Int\'l Cyber Defense',
        '<span class="t-lo">[3rd]</span> NCAE Cyber Games 2025',
      ],
    },
    { cmd: 'ls ctf/', output: ['binary/   crypto/   web/', 'forensics/  network/  re/'] },
  ];

  let si = 0, ci = 0, oi = 0, phase = 'type';
  let cmdSpan = null, cursor = null;

  function mkPrompt() {
    const row = document.createElement('div');
    row.innerHTML = '<span class="t-ps">$ </span><span></span>';
    cursor = document.createElement('span');
    cursor.className = 't-cur';
    row.appendChild(cursor);
    out.appendChild(row);
    cmdSpan = row.children[1];
  }

  function mkLine(html) {
    const el = document.createElement('div');
    el.className = 't-out';
    el.innerHTML = html;
    out.appendChild(el);
  }

  function run() {
    if (phase === 'type') {
      const cmd = seq[si].cmd;
      if (ci < cmd.length) {
        cmdSpan.textContent += cmd[ci++];
        setTimeout(run, 60 + Math.random() * 40);
      } else {
        phase = 'wait';
        setTimeout(run, 380);
      }
    } else if (phase === 'wait') {
      if (cursor) { cursor.remove(); cursor = null; }
      phase = 'out';
      oi = 0;
      run();
    } else if (phase === 'out') {
      if (oi < seq[si].output.length) {
        mkLine(seq[si].output[oi++]);
        setTimeout(run, 90);
      } else {
        si++;
        ci = 0;
        phase = 'type';
        if (si >= seq.length) {
          setTimeout(() => { out.innerHTML = ''; si = 0; mkPrompt(); run(); }, 2600);
        } else {
          mkPrompt();
          setTimeout(run, 220);
        }
      }
    }
  }

  mkPrompt();
  run();
})();

const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.08 }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const nav = document.getElementById('main-nav');
const navMenu = document.getElementById('nav-menu');

document.querySelector('.hamburger').addEventListener('click', () => navMenu.classList.toggle('open'));
navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navMenu.classList.remove('open')));
document.addEventListener('click', e => { if (!e.target.closest('nav')) navMenu.classList.remove('open'); });
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 60));

const navLinks = navMenu.querySelectorAll('a[href^="#"]');
const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.remove('active'));
      const link = navMenu.querySelector(`a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    });
  },
  { rootMargin: '0px 0px -80% 0px', threshold: 0 }
);
document.querySelectorAll('section[id]').forEach(s => sectionObserver.observe(s));
