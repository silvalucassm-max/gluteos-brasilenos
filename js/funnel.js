/* =========================================================
   funnel.js — utilidades compartidas por las 3 páginas
   · Guarda las respuestas del quiz entre páginas
   · Arrastra los UTM desde el anuncio hasta el checkout
   · Dispara los eventos del pixel en un solo lugar
   ========================================================= */

window.Funnel = (function () {
  'use strict';

  var KEY_ANSWERS = 'gb_answers';
  var KEY_UTM     = 'gb_utm';
  var UTM_FIELDS  = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term',
                     'src','sck','xcod','fbclid','gclid','ttclid'];

  /* ---------- almacenamiento ---------- */
  function read(key, fallback) {
    try { return JSON.parse(sessionStorage.getItem(key)) || fallback; }
    catch (e) { return fallback; }
  }
  function write(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  function getAnswers() { return read(KEY_ANSWERS, {}); }
  function setAnswer(id, value) {
    var a = getAnswers();
    a[id] = value;
    write(KEY_ANSWERS, a);
    return a;
  }

  /* ---------- UTM ---------- */
  // Los captura una sola vez (en el primer clic del anuncio) y los conserva.
  function captureUTM() {
    var url = new URLSearchParams(location.search);
    var saved = read(KEY_UTM, {});
    var found = false;
    UTM_FIELDS.forEach(function (f) {
      var v = url.get(f);
      if (v) { saved[f] = v; found = true; }
    });
    if (found) write(KEY_UTM, saved);
    return saved;
  }

  // Pega los UTM guardados en cualquier enlace (checkout, página siguiente...)
  function withUTM(href) {
    var saved = read(KEY_UTM, {});
    if (!Object.keys(saved).length) return href;
    try {
      var u = new URL(href, location.href);
      Object.keys(saved).forEach(function (k) {
        if (!u.searchParams.has(k)) u.searchParams.set(k, saved[k]);
      });
      return u.toString();
    } catch (e) { return href; }
  }

  // Reescribe todos los <a data-keep-utm> de la página
  function decorateLinks(root) {
    (root || document).querySelectorAll('a[data-keep-utm]').forEach(function (a) {
      a.href = withUTM(a.getAttribute('href'));
    });
  }

  function go(path) { location.href = withUTM(path); }

  /* ---------- pixel ---------- */
  // Un solo punto de salida: cambiá acá si mañana sumás GA4 o TikTok.
  function track(event, params) {
    params = params || {};
    if (typeof fbq === 'function') fbq('track', event, params);
    if (typeof gtag === 'function') gtag('event', event, params);
    if (window.dataLayer) window.dataLayer.push(Object.assign({ event: event }, params));
    if (location.hostname === 'localhost' || location.protocol === 'file:') {
      console.log('[pixel]', event, params);
    }
  }

  /* ---------- cuenta regresiva ---------- */
  /**
   * Cuenta regresiva honesta: apunta a una FECHA REAL de cierre.
   * Configurá OFFER_DEADLINE en oferta.html.
   * Si la fecha ya pasó, `onEnd` se dispara y el reloj no se reinicia solo.
   */
  function countdown(el, deadlineISO, onEnd) {
    var end = new Date(deadlineISO).getTime();
    if (isNaN(end)) return;
    function tick() {
      var left = end - Date.now();
      if (left <= 0) {
        el.textContent = '00:00:00';
        clearInterval(timer);
        if (onEnd) onEnd();
        return;
      }
      var h = Math.floor(left / 3600000);
      var m = Math.floor(left % 3600000 / 60000);
      var s = Math.floor(left % 60000 / 1000);
      var pad = function (n) { return n < 10 ? '0' + n : '' + n; };
      el.textContent = (h > 0 ? pad(h) + ':' : '') + pad(m) + ':' + pad(s);
    }
    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    captureUTM();
    decorateLinks();
  });

  return {
    getAnswers: getAnswers,
    setAnswer: setAnswer,
    withUTM: withUTM,
    decorateLinks: decorateLinks,
    go: go,
    track: track,
    countdown: countdown
  };
})();
