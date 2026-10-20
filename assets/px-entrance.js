/* One shared way back to the hub and across the three experiences. */
(function () {
  var script = document.currentScript || document.querySelector('script[data-host][src*="px-entrance.js"]');
  var host = script && script.getAttribute('data-host');
  if (host !== 'stage' && host !== 'lab' && host !== 'travels') return;

  var root = '/Project-X-promo-site';
  var items = [
    { id: 'hub', label: '入口', title: '回到交互入口', href: root + '/hub/' },
    { id: 'stage', label: '舞台', title: '交互舞台', href: root + '/stage/' },
    { id: 'lab', label: '终端', title: '档案终端', href: root + '/lab/' },
    { id: 'travels', label: '行记', title: '纸上行记', href: root + '/travels/' }
  ];

  var nav = document.createElement('nav');
  nav.className = 'px-rail';
  nav.setAttribute('data-host', host);
  nav.setAttribute('aria-label', '交互入口');

  items.forEach(function (item) {
    var link = document.createElement('a');
    link.href = item.href;
    link.textContent = item.label;
    link.title = item.title;
    link.setAttribute('aria-label', item.title);
    if (item.id === host) link.setAttribute('aria-current', 'page');
    nav.appendChild(link);
  });

  nav.addEventListener('click', function (event) {
    var link = event.target.closest && event.target.closest('a[href]');
    if (!link || !nav.contains(link)) return;
    if (link.getAttribute('aria-current') === 'page') {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    event.stopPropagation();
    var modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (!modified && event.defaultPrevented) location.assign(link.href);
  });

  function mount() {
    if (nav.isConnected || !document.body) return;
    document.body.appendChild(nav);
  }

  if (document.body) mount();
  else document.addEventListener('DOMContentLoaded', mount);
})();
