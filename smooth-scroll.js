// A short, gentle glide for wheel input. Touch and keyboard scrolling stay native.
(() => {
  const scroller = document.querySelector('#content');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let frame = 0, target = 0, last = 0;
  function stop() {
    cancelAnimationFrame(frame); frame = 0;
    scroller.style.scrollBehavior = '';
  }
  function tick(now) {
    const elapsed = Math.min(now - last, 40); last = now;
    const gap = target - scroller.scrollTop;
    scroller.scrollTop += gap * (1 - Math.exp(-elapsed / 135));
    if (Math.abs(gap) < 1.5) { scroller.scrollTop = target; stop(); }
    else frame = requestAnimationFrame(tick);
  }
  scroller.addEventListener('wheel', event => {
    if (reduced.matches || event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (event.target.closest('dialog,textarea,input,select')) return;
    const max = scroller.scrollHeight - scroller.clientHeight;
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? scroller.clientHeight : 1);
    if (!delta || max <= 0) return;
    event.preventDefault();
    if (!frame) target = scroller.scrollTop;
    target = Math.max(0, Math.min(max, target + delta));
    if (!frame) {
      scroller.style.scrollBehavior = 'auto';
      last = performance.now(); frame = requestAnimationFrame(tick);
    }
  }, {passive:false});
  document.addEventListener('pointerdown', stop, {passive:true});
  document.addEventListener('keydown', stop);
  document.addEventListener('click', event => { if (event.target.closest('a[href^="#"]')) stop(); });
  scroller.addEventListener('touchstart', stop, {passive:true});
  reduced.addEventListener('change', stop);
})();
