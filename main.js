// 试卷星 Project-X 宣传页 · 交互与入场动效
// 遵循 animation.md：入场 300–600ms，子项 stagger 30–100ms，ease-out 曲线

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
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const active = a.getAttribute('href') === `#${entry.target.id}`;
          a.style.color = active ? 'rgba(0,0,0,0.9)' : '';
          if (active) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach((s) => spy.observe(s));
}

// ---------- 初始化 ----------
collectReveals();
setupObserver();
setupNavSpy();
