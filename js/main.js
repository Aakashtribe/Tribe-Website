/* ─── TABS ─── */
function setTab(name) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab, .mobile-tab').forEach(t => {
    const tab = t.dataset.tab || t.textContent.toLowerCase().trim();
    t.classList.toggle('active', tab === name);
  });
  const panel = document.getElementById('tab-' + name);
  panel.classList.add('active');
  panel.querySelectorAll('.reveal:not(.in)').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), i * 60);
  });
  if (name === 'spend') restartSpendMarquee();
  window.scrollTo({ top: 0, behavior: 'smooth' });
  updateNavTheme();
  setTimeout(updateNavTheme, 450);
}
function openMobileMenu() {
  document.getElementById('mobile-menu').classList.add('open');
  document.body.classList.add('menu-open');
}
function closeMobileMenu() {
  document.getElementById('mobile-menu').classList.remove('open');
  document.body.classList.remove('menu-open');
}
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMobileMenu();
});

/* ─── REGION SELECTOR ─── */
(function initRegionSelect() {
  const wrap = document.getElementById('region-select');
  const trigger = document.getElementById('region-select-trigger');
  const menu = document.getElementById('region-select-menu');
  const valueEl = document.getElementById('region-select-value');
  const flagEl = document.getElementById('region-select-flag');
  if (!wrap || !trigger || !menu || !valueEl) return;

  const options = menu.querySelectorAll('.region-option');

  function closeMenu() {
    menu.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    menu.hidden = false;
    trigger.setAttribute('aria-expanded', 'true');
  }

  function selectOption(option) {
    options.forEach(o => o.classList.remove('is-selected'));
    option.classList.add('is-selected');
    const label = option.querySelector('.region-option-label');
    if (flagEl && option.dataset.flag) flagEl.textContent = option.dataset.flag;
    valueEl.textContent = label ? label.textContent : option.textContent.trim();
    closeMenu();
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (menu.hidden) openMenu();
    else closeMenu();
  });

  options.forEach(option => {
    option.addEventListener('click', () => selectOption(option));
  });

  document.addEventListener('click', (e) => {
    if (!wrap.contains(e.target)) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
})();

/* ─── NAV SCROLL (hero gradient → white) ─── */
const mainNav = document.getElementById('main-nav');

function updateNavTheme() {
  if (!mainNav) return;
  const homeTab = document.getElementById('tab-home');
  const onHome = homeTab?.classList.contains('active');
  const hero = homeTab?.querySelector('.hero');

  mainNav.classList.remove('nav-over-hero');

  if (!onHome || !hero) {
    mainNav.classList.toggle('scrolled', window.scrollY > 20);
    return;
  }

  const navH = mainNav.offsetHeight;
  const overHero = hero.getBoundingClientRect().bottom > navH + 8;

  mainNav.classList.toggle('nav-over-hero', overHero);
  mainNav.classList.toggle('scrolled', !overHero);
}

window.addEventListener('scroll', updateNavTheme, { passive: true });
window.addEventListener('resize', updateNavTheme, { passive: true });
updateNavTheme();

/* ─── SPEND SUBS MARQUEE ─── */
function restartSpendMarquee() {
  requestAnimationFrame(() => {
    const track = document.querySelector('#tab-spend .spend-subs-track');
    if (!track) return;
    track.style.animation = 'none';
    void track.offsetWidth;
    track.style.animation = '';
  });
}

const spendSubsMarquee = document.querySelector('#tab-spend .spend-subs-marquee');
if (spendSubsMarquee) {
  const spendMarqueeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) restartSpendMarquee();
    });
  }, { threshold: 0.1 });
  spendMarqueeObserver.observe(spendSubsMarquee);
}

/* ─── SCROLL REVEAL ─── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

setTimeout(() => {
  document.querySelectorAll('.hero--dark .reveal, .hero .reveal, .about-hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), i * 80);
  });
}, 60);

/* ─── TEAM / INVESTOR PHOTO FALLBACK ─── */
const PORTRAIT_PLACEHOLDER = 'assets/images/placeholder-portrait.svg';
document.querySelectorAll('.person-photo img').forEach(img => {
  img.addEventListener('error', () => {
    if (img.src.endsWith(PORTRAIT_PLACEHOLDER)) return;
    img.src = PORTRAIT_PLACEHOLDER;
  }, { once: true });
});

/* ─── PHONE SLIDE ROTATOR ─── */
let slideIndex = 0;
const slides = document.querySelectorAll('.phone-slide');
const dotsContainer = document.getElementById('slide-dots');

if (slides.length > 0) {
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.style.cssText = `width:${i === 0 ? '16' : '6'}px;height:6px;background:${i === 0 ? 'var(--ink)' : 'rgba(0,0,0,0.15)'};border-radius:3px;transition:all 0.3s;cursor:pointer`;
      dot.onclick = () => goSlide(i);
      dotsContainer.appendChild(dot);
    });
  }

  function goSlide(n) {
    slides[slideIndex].classList.remove('active');
    slideIndex = n;
    slides[slideIndex].classList.add('active');
    if (dotsContainer) {
      [...dotsContainer.children].forEach((d, i) => {
        d.style.width = i === slideIndex ? '16px' : '6px';
        d.style.background = i === slideIndex ? 'var(--ink)' : 'rgba(0,0,0,0.15)';
      });
    }
  }

  setInterval(() => {
    goSlide((slideIndex + 1) % slides.length);
  }, 4500);
}

/* ─── CALCULATOR ─── */
const RATES = {
  USD: { INR: 84.24, PHP: 56.80, NGN: 1620, MXN: 17.10, BRL: 5.18, VND: 25420, GHS: 15.24 },
  EUR: { INR: 91.50, PHP: 61.70, NGN: 1760, MXN: 18.55, BRL: 5.62, VND: 27600, GHS: 16.58 },
  GBP: { INR: 106.40, PHP: 71.80, NGN: 2050, MXN: 21.60, BRL: 6.54, VND: 32100, GHS: 19.28 }
};
const CURRENCY_SYMBOLS = {
  INR: '₹', PHP: '₱', NGN: '₦', MXN: '$', BRL: 'R$', VND: '₫', GHS: '₵'
};
const PLATFORMS = [
  { id: 'tribe', name: 'tr/be', cls: 't', spread: 0.000, fee: 0.00 },
  { id: 'wise', name: 'Wise', cls: 'w', spread: 0.005, fee: 4.50 },
  { id: 'remitly', name: 'Remitly', cls: 'r', spread: 0.015, fee: 3.99 },
  { id: 'xoom', name: 'Xoom', cls: 'x', spread: 0.020, fee: 4.99 }
];

function fmtAmount(n) {
  return n >= 10000
    ? Math.round(n).toLocaleString('en-US')
    : n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

function platformLogo(row) {
  if (row.id === 'tribe') return '<div class="plat-logo t">tr/be</div>';
  return `<div class="plat-logo ${row.cls}">${row.name[0]}</div>`;
}

function renderCalc() {
  const bodyEl = document.getElementById('calc-body');
  if (!bodyEl) return;

  const amt = 1000;
  const from = 'USD';
  const to = 'INR';
  const mid = RATES[from]?.[to];
  if (!mid) return;

  const rows = PLATFORMS.map(p => {
    const afterFee = Math.max(0, amt - p.fee);
    const effRate = mid * (1 - p.spread);
    const recv = afterFee * effRate;
    return { ...p, effRate, recv };
  });

  const tribe = rows.find(r => r.id === 'tribe');
  const others = rows.filter(r => r.id !== 'tribe').sort((a, b) => b.recv - a.recv);
  const sorted = [tribe, ...others];

  bodyEl.innerHTML = sorted.map(r => {
    const isBest = r.id === 'tribe';
    const badge = isBest ? '<span class="best-rate-badge">BEST RATE</span>' : '';
    const recvCls = isBest ? 'recv-amount recv-amount--best' : 'recv-amount';

    return `
      <tr class="${isBest ? 'row-best' : ''}">
        <td>
          <div class="platform-cell">
            ${platformLogo(r)}
            <div class="platform-meta">
              <span class="platform-name">${r.name}</span>
              ${badge}
            </div>
          </div>
        </td>
        <td>
          <span class="${recvCls}">${fmtAmount(r.recv)} ${to}</span>
        </td>
      </tr>
    `;
  }).join('');
}

if (document.getElementById('calc-body')) renderCalc();

/* ─── FAQ ACCORDION ─── */
document.querySelectorAll('.faq-toggle').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const open = item.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.querySelector('.faq-toggle-icon').textContent = open ? '−' : '+';
  });
});

/* ─── HERO PARALLAX (subtle) ─── */
document.addEventListener('mousemove', e => {
  requestAnimationFrame(() => {
    const phones = document.querySelectorAll('.phone-anim');
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    phones.forEach(p => {
      p.style.transform = `translate(${dx * 6}px, ${dy * 4}px)`;
    });
  });
});
