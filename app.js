/* ═══════════════════════════════════════════════════════
   VAGMINE OVERSEAS — app.js
   Nav · Scroll Reveal · Counters · Globe · AI Agent
   AI: Anthropic Claude (direct from browser)
═══════════════════════════════════════════════════════ */

/* ─── AI CONFIG — paste your key here ─── */
const ANTHROPIC_KEY = 'YOUR_API_KEY_HERE'; // ← paste key here
/* ──────────────────────────────────────── */

const SYSTEM_PROMPT = `You are Vagmine Assistant, the official AI sales and support agent for Vagmine Overseas Pvt. Ltd., a leading manufacturer of friction rubber compounds based in Tirunelveli, Tamil Nadu, India.

Company: Founded 2010 | Third-generation | 40+ years expertise | 2,400+ MT/year
Address: B-59, SIPCOT Industrial Growth Centre, Gangaikondan, Tirunelveli-627352, Tamil Nadu
Phone & WhatsApp: +91 9313146672 | Email: info@vagmineoverseas.com
Certifications: ISO 9001:2015, BIS Certified, MSME Registered
USA Office: Delaware | Clients: TVS/Sundaram, Yokohama-ATG, BKT, Nexen, Global Rubber Sri Lanka
Export: India, Korea, China, Sri Lanka, USA, UAE

Products:
1. FRRC - half to 1 inch granules, quick mill dispersion, solid tyres
2. FRC Baled - high friction, industrial and off-highway
3. FRC-25 - Grade 25, commercial vehicle braking
4. FRC-10/12 - lighter duty, slab or granule
5. Chopped Friction Cord - brake and clutch reinforcement
6. Granulated Friction Rubber - 30-45ft rolls, 7mm thick, solid tyres
7. Reprocessed Rubber Compound - cost-effective industrial
8. Tread Rubber Compounds - abrasion resistant, commercial retreading
9. Industrial Hydraulic Seals - high-pressure, custom profiles
10. Pneumatic Rubber Seals - low friction, air cylinders

Be professional, warm, concise (3-4 sentences). After 3 messages, ask for name, company, and contact. Always suggest next step.`;

/* ─── NAV ─── */
const navbar = document.querySelector('.nav');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');

window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 40);
  updateActiveNav();
});

burger?.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  overlay.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

function closeMobile() {
  mobileMenu?.classList.remove('open');
  overlay?.classList.remove('active');
  document.body.style.overflow = '';
}

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.id; });
  document.querySelectorAll('.nav__links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href')?.includes(current));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.endsWith(path) || (path === '' && href.includes('index'))) a.classList.add('active');
  });
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); window.scrollTo({ top: t.offsetTop - 72, behavior: 'smooth' }); }
  });
});

/* ─── SCROLL REVEAL ─── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── COUNTERS ─── */
const counted = new Set();
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !counted.has(e.target)) {
      counted.add(e.target);
      const target = parseInt(e.target.dataset.target, 10);
      let cur = 0; const step = target / (1800 / 16);
      const t = setInterval(() => {
        cur += step; if (cur >= target) { cur = target; clearInterval(t); }
        e.target.textContent = Math.floor(cur);
      }, 16);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => countObs.observe(el));

/* ─── FORM ─── */
function submitForm(e) {
  e.preventDefault();
  const btn = document.getElementById('formBtnText');
  const succ = document.getElementById('formSuccess');
  if (btn) btn.textContent = 'Sending...';
  setTimeout(() => {
    if (btn) btn.textContent = 'Send Enquiry →';
    if (succ) { succ.style.display = 'block'; setTimeout(() => succ.style.display = 'none', 5000); }
    e.target.reset();
  }, 1200);
}

/* ═══════════════════════════════════════════
   GLOBE ANIMATION
═══════════════════════════════════════════ */
function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width = 360;
  const H = canvas.height = 360;
  const cx = W / 2, cy = H / 2, R = 155;
  let angle = 0;

  const countries = [
    { name: 'India (HQ)', lat: 8.9, lon: 77.7, home: true },
    { name: 'South Korea', lat: 37.5, lon: 127.0, home: false },
    { name: 'China', lat: 35.0, lon: 105.0, home: false },
    { name: 'Sri Lanka', lat: 7.9, lon: 80.7, home: false },
    { name: 'USA', lat: 39.0, lon: -98.0, home: false },
    { name: 'UAE', lat: 24.0, lon: 54.0, home: false },
  ];

  function latLonToXYZ(lat, lon, rot) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + rot) * Math.PI / 180;
    return { x: R * Math.sin(phi) * Math.cos(theta), y: -R * Math.cos(phi), z: R * Math.sin(phi) * Math.sin(theta) };
  }

  function drawGlobe(rot) {
    ctx.clearRect(0, 0, W, H);
    const grd = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 1.2);
    grd.addColorStop(0, 'rgba(249,115,22,0.04)');
    grd.addColorStop(1, 'rgba(15,15,16,0)');
    ctx.fillStyle = grd; ctx.fillRect(0, 0, W, H);
    const sGrd = ctx.createRadialGradient(cx - R * 0.3, cy - R * 0.3, R * 0.1, cx, cy, R);
    sGrd.addColorStop(0, 'rgba(30,30,32,0.9)'); sGrd.addColorStop(1, 'rgba(14,14,16,0.95)');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = sGrd; ctx.fill();
    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = (90 - lat) * Math.PI / 180; const r = R * Math.sin(phi); const y = -R * Math.cos(phi);
      ctx.beginPath(); ctx.ellipse(cx, cy + y, r, r * 0.15, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(249,115,22,0.08)'; ctx.lineWidth = 0.7; ctx.stroke();
    }
    for (let lon = 0; lon < 180; lon += 30) {
      const theta = (lon + rot) * Math.PI / 180;
      ctx.beginPath(); ctx.ellipse(cx, cy, R, R * Math.abs(Math.cos(theta)), theta, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(249,115,22,0.07)'; ctx.lineWidth = 0.7; ctx.stroke();
    }
    ctx.beginPath(); ctx.ellipse(cx, cy, R, R * 0.15, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(249,115,22,0.18)'; ctx.lineWidth = 1; ctx.stroke();
    const home = countries[0]; const hPos = latLonToXYZ(home.lat, home.lon, rot);
    countries.slice(1).forEach(c => {
      const cPos = latLonToXYZ(c.lat, c.lon, rot);
      if (hPos.z > 0 && cPos.z > 0) {
        const hp = { px: cx + hPos.x, py: cy + hPos.y }; const cp = { px: cx + cPos.x, py: cy + cPos.y };
        ctx.beginPath(); ctx.moveTo(hp.px, hp.py);
        ctx.quadraticCurveTo((hp.px + cp.px) / 2, (hp.py + cp.py) / 2 - 50, cp.px, cp.py);
        ctx.strokeStyle = 'rgba(249,115,22,0.3)'; ctx.lineWidth = 1.2; ctx.setLineDash([4, 4]); ctx.stroke(); ctx.setLineDash([]);
      }
    });
    countries.forEach(c => {
      const pos = latLonToXYZ(c.lat, c.lon, rot);
      if (pos.z > -R * 0.2) {
        const px = cx + pos.x, py = cy + pos.y;
        const alpha = Math.max(0, (pos.z + R * 0.2) / (R * 1.2));
        if (c.home) {
          const pulse = 0.6 + 0.4 * Math.sin(Date.now() / 400);
          ctx.beginPath(); ctx.arc(px, py, 10 * pulse, 0, Math.PI * 2); ctx.fillStyle = `rgba(249,115,22,${0.15 * alpha})`; ctx.fill();
          ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fillStyle = `rgba(249,115,22,${alpha})`; ctx.fill();
        }
        if (pos.z > 0 && alpha > 0.5) {
          ctx.font = `bold 9px Inter, sans-serif`; ctx.fillStyle = `rgba(229,231,235,${alpha})`; ctx.textAlign = 'center';
          ctx.fillText(c.name, px, py - 10);
        }
      }
    });
    const shGrd = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, 0, cx, cy, R);
    shGrd.addColorStop(0, 'rgba(255,255,255,0.05)'); shGrd.addColorStop(1, 'rgba(0,0,0,0.2)');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fillStyle = shGrd; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(249,115,22,0.2)'; ctx.lineWidth = 1.5; ctx.stroke();
  }

  function animate() { angle += 0.15; drawGlobe(angle); requestAnimationFrame(animate); }
  animate();
}

/* ═══════════════════════════════════════════
   AI AGENT — Direct Anthropic API
═══════════════════════════════════════════ */
let aiMsgs = [], aiOpen = false, aiTyping = false, badgeDone = false;

function toggleAI() {
  const panel = document.getElementById('aiPanel');
  const icon = document.querySelector('.ai-widget__btn i');
  const badge = document.getElementById('aiBadge');
  aiOpen = !aiOpen;
  if (aiOpen) {
    panel.classList.add('open'); panel.style.display = 'flex';
    if (icon) icon.className = 'ti ti-x';
    if (badge) badge.style.display = 'none';
    badgeDone = true;
    setTimeout(() => { const m = document.getElementById('aiMsgs'); if (m) m.scrollTop = m.scrollHeight; }, 50);
  } else {
    panel.classList.remove('open');
    if (icon) icon.className = 'ti ti-robot';
    setTimeout(() => { if (!aiOpen) panel.style.display = 'none'; }, 250);
  }
}

function quickReply(text) { document.getElementById('aiQuick')?.remove(); addUserMsg(text); getAIReply(text); }
function handleAIKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendAI(); } }
function sendAI() {
  const inp = document.getElementById('aiInput'); const text = inp?.value.trim();
  if (!text || aiTyping) return; inp.value = '';
  document.getElementById('aiQuick')?.remove(); addUserMsg(text); getAIReply(text);
}
function addUserMsg(text) {
  aiMsgs.push({ role: 'user', content: text });
  const msgs = document.getElementById('aiMsgs');
  const d = document.createElement('div'); d.className = 'ai-msg ai-msg--user';
  d.innerHTML = `<div class="ai-bubble">${esc(text)}</div>`;
  msgs?.appendChild(d); if (msgs) msgs.scrollTop = msgs.scrollHeight;
}
function addBotMsg(text) {
  const msgs = document.getElementById('aiMsgs');
  const d = document.createElement('div'); d.className = 'ai-msg ai-msg--bot';
  d.innerHTML = `<div class="ai-bubble">${fmtAI(text)}</div>`;
  msgs?.appendChild(d); if (msgs) msgs.scrollTop = msgs.scrollHeight;
}
function showTyping() {
  const msgs = document.getElementById('aiMsgs');
  const d = document.createElement('div'); d.className = 'ai-msg ai-msg--bot'; d.id = 'aiTyping';
  d.innerHTML = `<div class="ai-typing"><span></span><span></span><span></span></div>`;
  msgs?.appendChild(d); if (msgs) msgs.scrollTop = msgs.scrollHeight;
}
function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function fmtAI(s) { return esc(s).replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>'); }

async function getAIReply(text) {
  aiTyping = true;
  const sendBtn = document.querySelector('.ai-send');
  if (sendBtn) sendBtn.style.opacity = '.5';
  showTyping();
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-allow-browser': 'true'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM_PROMPT,
        messages: aiMsgs
      })
    });
    document.getElementById('aiTyping')?.remove();
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    const reply = data.content?.[0]?.text || 'Please contact us at +91 9313146672';
    aiMsgs.push({ role: 'assistant', content: reply });
    addBotMsg(reply);
    if (aiMsgs.filter(m => m.role === 'user').length === 3) {
      setTimeout(() => {
        const nudge = 'To arrange a formal quote or callback, could you share your **name, company, and contact number**? 😊';
        aiMsgs.push({ role: 'assistant', content: nudge });
        addBotMsg(nudge);
      }, 900);
    }
  } catch {
    document.getElementById('aiTyping')?.remove();
    addBotMsg('Having trouble connecting. Please reach us:\n📞 **+91 93131 46672**\n✉ **info@vagmineoverseas.com**');
  } finally {
    aiTyping = false;
    if (sendBtn) sendBtn.style.opacity = '1';
    const msgs = document.getElementById('aiMsgs');
    if (msgs) msgs.scrollTop = msgs.scrollHeight;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initGlobe();
  setTimeout(() => {
    if (!badgeDone) { const b = document.getElementById('aiBadge'); if (b) b.style.display = 'flex'; }
  }, 4000);
});
