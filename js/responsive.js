/* Accessible navigation shared by the static storefront pages. */
document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav-right');
  let toggle = document.getElementById('hamburger');
  let menu = document.getElementById('mobileNav');
  const base = location.pathname.includes('/pages/') ? '' : 'pages/';
  if (nav && !toggle) {
    toggle = document.createElement('button');
    toggle.id = 'hamburger';
    toggle.className = 'hamburger';
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.append(toggle);
  }
  if (toggle && !menu) {
    menu = document.createElement('div');
    menu.id = 'mobileNav';
    menu.className = 'mobile-nav';
    menu.innerHTML = `<div class="mobile-nav-header"><span class="nav-logo">Marvello</span><button id="mobileNavClose" class="mobile-nav-close" type="button" aria-label="Close navigation">×</button></div>
      <a href="${base ? 'index.html' : '../index.html'}">Home</a><a href="${base}shop.html">Shop</a><a href="${base}auth.html">Account</a><a href="${base}tracking.html">Track Order</a>`;
    document.body.append(menu);
  }
  if (toggle && menu) {
    toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open navigation');
    toggle.setAttribute('aria-controls', 'mobileNav');
    menu.setAttribute('role', 'dialog');
    menu.setAttribute('aria-modal', 'true');
    menu.setAttribute('aria-label', 'Navigation');
    const close = menu.querySelector('#mobileNavClose');
    close?.setAttribute('aria-label', 'Close navigation');
    const setOpen = (open) => {
      menu.classList.toggle('open', open);
      menu.inert = !open;
      toggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('menu-open', open);
      if (open) close?.focus();
      else if (menu.contains(document.activeElement)) toggle.focus();
    };
    setOpen(false);
    toggle.addEventListener('click', () => setOpen(true));
    close?.addEventListener('click', () => setOpen(false));
    menu.addEventListener('click', (event) => { if (event.target.closest('a')) setOpen(false); });
    menu.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
      if (event.key !== 'Tab') return;
      const items = [...menu.querySelectorAll('a, button')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    matchMedia('(min-width: 1200px)').addEventListener('change', event => { if (event.matches) setOpen(false); });
  }
  const sidebar = document.querySelector('.shop-layout .sidebar');
  if (sidebar) {
    sidebar.id = 'shopFilters';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filters-toggle';
    button.textContent = 'Filters & search';
    button.setAttribute('aria-controls', sidebar.id);
    button.setAttribute('aria-expanded', 'false');
    button.addEventListener('click', () => {
      button.setAttribute('aria-expanded', String(sidebar.classList.toggle('filters-open')));
    });
    sidebar.before(button);
  }
});
