// yucoco cafe — gallery lightbox (vanilla JS, no deps)
(function () {
  var lb = document.getElementById('lb');
  if (!lb) return;

  var lbImg = lb.querySelector('img');
  var lbCount = lb.querySelector('.lb-count');
  var btnClose = lb.querySelector('.lb-close');
  var btnPrev = lb.querySelector('.lb-prev');
  var btnNext = lb.querySelector('.lb-next');

  var thumbs = Array.prototype.slice.call(document.querySelectorAll('.tile img[data-full]'));
  var items = thumbs.map(function (img) {
    return { full: img.getAttribute('data-full'), alt: img.getAttribute('alt') || '' };
  });

  var current = 0;
  var touchStartX = null;

  function show(index) {
    if (!items.length) return;
    current = (index + items.length) % items.length;
    var item = items[current];
    lbImg.src = item.full;
    lbImg.alt = item.alt;
    lbCount.textContent = (current + 1) + ' / ' + items.length;
  }

  function open(index) {
    show(index);
    lb.classList.add('open');
    document.body.classList.add('lb-open'); // 背面スクロールを止める
    document.addEventListener('keydown', onKeydown);
  }

  function close() {
    lb.classList.remove('open');
    document.body.classList.remove('lb-open');
    lbImg.src = '';
    document.removeEventListener('keydown', onKeydown);
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  }

  thumbs.forEach(function (img, i) {
    img.addEventListener('click', function () { open(i); });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { show(current - 1); });
  btnNext.addEventListener('click', function () { show(current + 1); });

  // オーバーレイクリックで閉じる（画像・ボタン自体のクリックは除く）
  lb.addEventListener('click', function (e) {
    if (e.target === lb) close();
  });

  // スワイプ操作（前へ / 次へ）
  lb.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lb.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) dx < 0 ? show(current + 1) : show(current - 1);
    touchStartX = null;
  }, { passive: true });
})();
