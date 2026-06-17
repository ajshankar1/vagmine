/* ═══════════════════════════════════════════════════════
   VAGMINE OVERSEAS — app.js
   Nav · Scroll Reveal · Counters · Globe
═══════════════════════════════════════════════════════ */

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
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ─── COUNTERS ─── */
const counted = new Set();
const countObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !counted.has(e.target)) {
      counted.add(e.target);
      const target = parseInt(e.target.dataset.target, 10);
      let cur = 0;
      const step = target / (1800 / 16);
      const t = setInterval(() => {
        cur += step;
        if (cur >= target) { cur = target; clearInterval(t); }
        e.target.textContent = Math.floor(cur);
      }, 16);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => countObs.observe(el));

/* ─── CONTACT FORM ─── */
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
    { name: 'India (HQ)', lat: 8.9,  lon: 77.7,  home: true  },
    { name: 'S. Korea',   lat: 37.5, lon: 127.0, home: false },
    { name: 'China',      lat: 35.0, lon: 105.0, home: false },
    { name: 'Sri Lanka',  lat: 7.9,  lon: 80.7,  home: false },
    { name: 'USA',        lat: 39.0, lon: -98.0, home: false },
    { name: 'UAE',        lat: 24.0, lon: 54.0,  home: false },
  ];

  function latLonToXYZ(lat, lon, rot) {
    const phi = (90 - lat) * Math.PI / 180;
    const theta = (lon + rot) * Math.PI / 180;
    return {
      x: R * Math.sin(phi) * Math.cos(theta),
      y: -R * Math.cos(phi),
      z: R * Math.sin(phi) * Math.sin(theta)
    };
  }

  function drawGlobe(rot) {
    ctx.clearRect(0, 0, W, H);

    const sGrd = ctx.createRadialGradient(cx - R*0.3, cy - R*0.3, R*0.1, cx, cy, R);
    sGrd.addColorStop(0, 'rgba(30,30,32,0.9)');
    sGrd.addColorStop(1, 'rgba(14,14,16,0.95)');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2);
    ctx.fillStyle = sGrd; ctx.fill();

    for (let lat = -60; lat <= 60; lat += 30) {
      const phi = (90-lat)*Math.PI/180; const r = R*Math.sin(phi); const y = -R*Math.cos(phi);
      ctx.beginPath(); ctx.ellipse(cx, cy+y, r, r*0.15, 0, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(249,115,22,0.08)'; ctx.lineWidth = 0.7; ctx.stroke();
    }
    for (let lon = 0; lon < 180; lon += 30) {
      const theta = (lon+rot)*Math.PI/180;
      ctx.beginPath(); ctx.ellipse(cx, cy, R, R*Math.abs(Math.cos(theta)), theta, 0, Math.PI*2);
      ctx.strokeStyle = 'rgba(249,115,22,0.07)'; ctx.lineWidth = 0.7; ctx.stroke();
    }
    ctx.beginPath(); ctx.ellipse(cx, cy, R, R*0.15, 0, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(249,115,22,0.18)'; ctx.lineWidth = 1; ctx.stroke();

    const home = countries[0];
    const hPos = latLonToXYZ(home.lat, home.lon, rot);
    countries.slice(1).forEach(c => {
      const cPos = latLonToXYZ(c.lat, c.lon, rot);
      if (hPos.z > 0 && cPos.z > 0) {
        const hp = { px: cx+hPos.x, py: cy+hPos.y };
        const cp = { px: cx+cPos.x, py: cy+cPos.y };
        ctx.beginPath(); ctx.moveTo(hp.px, hp.py);
        ctx.quadraticCurveTo((hp.px+cp.px)/2, (hp.py+cp.py)/2-50, cp.px, cp.py);
        ctx.strokeStyle = 'rgba(249,115,22,0.3)'; ctx.lineWidth = 1.2;
        ctx.setLineDash([4,4]); ctx.stroke(); ctx.setLineDash([]);
      }
    });

    countries.forEach(c => {
      const pos = latLonToXYZ(c.lat, c.lon, rot);
      if (pos.z > -R*0.2) {
        const px = cx+pos.x, py = cy+pos.y;
        const alpha = Math.max(0, (pos.z+R*0.2)/(R*1.2));
        if (c.home) {
          const pulse = 0.6 + 0.4*Math.sin(Date.now()/400);
          ctx.beginPath(); ctx.arc(px, py, 10*pulse, 0, Math.PI*2);
          ctx.fillStyle = `rgba(249,115,22,${0.15*alpha})`; ctx.fill();
          ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,255,255,${alpha})`; ctx.fill();
        } else {
          ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI*2);
          ctx.fillStyle = `rgba(249,115,22,${alpha})`; ctx.fill();
        }
        if (pos.z > 0 && alpha > 0.5) {
          ctx.font = `bold 9px Inter,sans-serif`;
          ctx.fillStyle = `rgba(229,231,235,${alpha})`;
          ctx.textAlign = 'center';
          ctx.fillText(c.name, px, py-10);
        }
      }
    });

    const shGrd = ctx.createRadialGradient(cx-R*0.35, cy-R*0.35, 0, cx, cy, R);
    shGrd.addColorStop(0, 'rgba(255,255,255,0.05)');
    shGrd.addColorStop(1, 'rgba(0,0,0,0.2)');
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2);
    ctx.fillStyle = shGrd; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI*2);
    ctx.strokeStyle = 'rgba(249,115,22,0.2)'; ctx.lineWidth = 1.5; ctx.stroke();
  }

  function animate() { angle += 0.15; drawGlobe(angle); requestAnimationFrame(animate); }
  animate();
}

document.addEventListener('DOMContentLoaded', () => { initGlobe(); });
