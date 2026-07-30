// yucoco cafe (B案) — scroll reveal (vanilla JS, no deps)
// 設計方針: fail-open。どんな環境でも「表示されない」事故だけは起こさない。
// IntersectionObserver は使わず、rect 実測 + scroll/resize リスナー + 保険タイマーで構成。
(function () {
  // JS が動いている時だけ演出を有効化 (JS 無効環境では CSS 初期透明が発動しない)
  document.documentElement.classList.add('js');

  var targets = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (!targets.length) return;

  function check() {
    if (!targets.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    targets = targets.filter(function (el) {
      var r = el.getBoundingClientRect();
      // 要素上端が viewport の 88% ラインを越えたら表示 (一度きり)
      if (r.top < vh * 0.88 && r.bottom > 0) {
        el.classList.add('in');
        return false;
      }
      return true;
    });
    if (!targets.length) {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    }
  }

  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check, { passive: true });
  check(); // 初期表示分

  // 保険: 万一スクロールイベントが取れない環境でも 2.5 秒後に全て表示
  setTimeout(function () {
    document.querySelectorAll('.reveal:not(.in)').forEach
      ? document.querySelectorAll('.reveal:not(.in)').forEach(function (el) { el.classList.add('in'); })
      : null;
    targets = [];
  }, 2500);
})();
