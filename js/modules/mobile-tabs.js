const $ = (sel) => document.querySelector(sel);

export function initMobileTabs() {
  var tabs = document.querySelectorAll('.mobile-tab');
  var panels = document.querySelectorAll('.tab-panel');

  if (tabs.length === 0 || panels.length === 0) return;

  function switchTab(tabName) {
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.toggle('active', tabs[i].dataset.tab === tabName);
    }
    for (var i = 0; i < panels.length; i++) {
      panels[i].classList.toggle('active', panels[i].dataset.panel === tabName);
    }
    var appMain = $('.app-main');
    if (appMain) appMain.scrollTop = 0;
  }

  for (var i = 0; i < tabs.length; i++) {
    tabs[i].addEventListener('click', function () {
      switchTab(this.dataset.tab);
    });
  }
}
