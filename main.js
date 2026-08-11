// 试卷星 Project-X 宣传页 · 交互与入场动效
// 遵循 animation.md：入场 300–600ms，子项 stagger 30–100ms，ease-out 曲线

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- 入场 reveal：IntersectionObserver + stagger ----------
const revealGroups = new Map(); // 同一父容器内的 reveal 元素共享 stagger

function collectReveals() {
  const els = Array.from(document.querySelectorAll('.reveal'));
  els.forEach((el) => {
    const parent = el.parentElement;
    if (!revealGroups.has(parent)) revealGroups.set(parent, []);
    revealGroups.get(parent).push(el);
  });
}

function setupObserver() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const siblings = revealGroups.get(el.parentElement) || [el];
        const index = siblings.indexOf(el);
        // stagger 60ms，落在 30–100ms 规范区间
        el.style.transitionDelay = `${Math.max(0, index) * 60}ms`;
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
}

// ---------- 导航激活态：滚动位置高亮当前 section ----------
function setupNavSpy() {
  const links = Array.from(document.querySelectorAll('.header-nav a'));
  // 仅处理站内锚点（#…）；外部链接（如 ./sponsor.html）不是合法选择器，必须过滤
  const sections = links
    .map((a) => a.getAttribute('href'))
    .filter((href) => href && href.startsWith('#'))
    .map((href) => document.querySelector(href))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const active = a.getAttribute('href') === `#${entry.target.id}`;
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach((s) => spy.observe(s));
}

// ---------- 滚动进度条 + 头部阴影 + 回到顶部 ----------
function setupScrollUI() {
  const header = document.querySelector('.site-header');
  const bar = document.getElementById('scrollProgressBar');
  const toTop = document.getElementById('backToTop');
  let ticking = false;

  function update() {
    ticking = false;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0;
    if (bar) bar.style.width = `${progress * 100}%`;
    if (header) header.classList.toggle('is-scrolled', scrollTop > 8);
    if (toTop) toTop.classList.toggle('is-visible', scrollTop > window.innerHeight * 0.8);
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }
}

// ---------- 移动端导航菜单 ----------
function setupMobileNav() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('headerNav');
  if (!toggle || !nav) return;

  function closeMenu() {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', '打开导航菜单');
  }

  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '关闭导航菜单' : '打开导航菜单');
  });

  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  document.addEventListener('click', (e) => {
    if (!nav.classList.contains('is-open')) return;
    if (!nav.contains(e.target) && !toggle.contains(e.target)) closeMenu();
  });
}

// ---------- 数据带数字滚动 ----------
function setupCountUp() {
  const nums = Array.from(document.querySelectorAll('[data-count]'));
  if (!nums.length) return;

  function animate(el) {
    const target = Number(el.dataset.count);
    if (prefersReducedMotion || !Number.isFinite(target)) {
      el.textContent = String(target);
      return;
    }
    const duration = 900;
    const start = performance.now();
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );

  nums.forEach((el) => io.observe(el));
}

// ---------- AI 对话打字机 ----------
function setupTypewriter() {
  const target = document.getElementById('aiTypewriter');
  const typing = document.querySelector('.ai-typing');
  if (!target) return;

  const text = '班级薄弱点 Top 3：立体几何 58% · 导数应用 61% · 概率分布 64%。已生成班级分析报告，可导出 PDF 用于教研。';

  if (prefersReducedMotion) {
    if (typing) typing.classList.add('is-hidden');
    target.textContent = text;
    return;
  }

  let started = false;

  function run() {
    let i = 0;
    // 先展示「正在输入」圆点 900ms
    setTimeout(function type() {
      if (typing && i === 0) typing.classList.add('is-hidden');
      if (i <= text.length) {
        target.textContent = text.slice(0, i);
        i += 1;
        setTimeout(type, 34);
      } else {
        // 停顿后循环重播
        setTimeout(() => {
          target.textContent = '';
          if (typing) typing.classList.remove('is-hidden');
          i = 0;
          setTimeout(type, 900);
        }, 6000);
      }
    }, 900);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        run();
        io.disconnect();
      });
    },
    { threshold: 0.4 }
  );

  io.observe(target.closest('.ai-chat') || target);
}

// ---------- 深色模式切换 ----------
function setupThemeToggle() {
  const btn = document.getElementById('themeToggle');
  const root = document.documentElement;
  if (!btn) return;

  function currentTheme() {
    return root.dataset.theme === 'dark' ? 'dark' : 'light';
  }

  function syncButton() {
    btn.setAttribute('aria-pressed', String(currentTheme() === 'dark'));
  }

  btn.addEventListener('click', () => {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    try { localStorage.setItem('px-theme', next); } catch (e) { /* 隐私模式 */ }
    syncButton();
  });

  // 用户未手动选择时，跟随系统主题变化
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const onSystemChange = (e) => {
    let saved = null;
    try { saved = localStorage.getItem('px-theme'); } catch (err) { /* 忽略 */ }
    if (!saved) {
      root.dataset.theme = e.matches ? 'dark' : 'light';
      syncButton();
    }
  };
  if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
  else if (mq.addListener) mq.addListener(onSystemChange); // 旧版 Safari

  syncButton();
}

// ---------- 初始化 ----------
// 单个 setup 抛错不应连累其余功能：逐个捕获并上报
const setups = [
  collectReveals,
  setupObserver,
  setupNavSpy,
  setupScrollUI,
  setupMobileNav,
  setupCountUp,
  setupTypewriter,
  setupThemeToggle,
];
for (const fn of setups) {
  try {
    fn();
  } catch (err) {
    console.error(`[px-promo] ${fn.name} 初始化失败：`, err);
  }
}
