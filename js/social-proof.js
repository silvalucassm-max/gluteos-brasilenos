/* =========================================================
   social-proof.js — notificaciones de compra reciente

   ⚠️ LEEME ANTES DE USAR
   ---------------------------------------------------------
   Este componente está listo, pero llega VACÍO a propósito.
   Solo debe mostrar compras que ocurrieron de verdad.

   Inventar nombres y ciudades es publicidad engañosa: en México
   (PROFECO), Colombia (SIC), Argentina (Ley 24.240) y Chile
   (SERNAC) es sancionable, y las Condiciones de Hotmart lo
   prohíben — es una de las causas más comunes de bloqueo de
   producto y retención de comisiones.

   TENÉS DOS FORMAS DE LLENARLO CON DATOS REALES:

   A) MANUAL (empezá por acá)
      Cada semana entrá a Hotmart → Ventas → Exportar, y pegá
      abajo las últimas ventas. Usá solo el nombre de pila y la
      ciudad — nunca apellido, email ni teléfono.

   B) AUTOMÁTICO (cuando tengas volumen)
      Poné MODE = 'live' y apuntá ENDPOINT a un webhook tuyo que
      reciba las compras de Hotmart y devuelva este JSON:
      [{ "name":"María", "place":"Bogotá, CO", "minutesAgo": 4 }]
      Guardá en tu base solo nombre de pila + ciudad.
   ========================================================= */

(function () {
  'use strict';

  var MODE     = 'manual';          // 'manual' | 'live'
  var ENDPOINT = '/api/ventas-recientes';

  /* ---------- A) VENTAS REALES — completá esta lista ----------
     Formato:  { name: 'María', place: 'Bogotá, CO', minutesAgo: 4 }
     Dejala vacía hasta tener ventas reales que mostrar.          */
  var SALES = [
    // { name: 'Ejemplo', place: 'Ciudad, PA', minutesAgo: 3 },
  ];

  var FIRST_DELAY = 12000;   // primera notificación (ms)
  var GAP         = 26000;   // intervalo entre notificaciones
  var VISIBLE     = 6000;    // cuánto queda en pantalla

  /* --------------------------------------------------------- */

  var box, i = 0, dismissed = false;

  function ago(min) {
    if (min < 1)  return 'hace instantes';
    if (min === 1) return 'hace 1 minuto';
    if (min < 60) return 'hace ' + min + ' minutos';
    var h = Math.round(min / 60);
    return 'hace ' + h + (h === 1 ? ' hora' : ' horas');
  }

  function build() {
    box = document.createElement('aside');
    box.className = 'sp';
    box.setAttribute('role', 'status');
    box.setAttribute('aria-live', 'polite');
    box.innerHTML =
      '<span class="sp__ico" aria-hidden="true">🍑</span>' +
      '<span class="sp__txt"><b></b><span></span><span class="sp__time"></span></span>' +
      '<button class="sp__x" type="button" aria-label="Cerrar aviso">×</button>';
    box.querySelector('.sp__x').addEventListener('click', function () {
      dismissed = true;
      box.classList.remove('is-on');
    });
    document.body.appendChild(box);
  }

  function show(sale) {
    if (dismissed || !box) return;
    box.querySelector('b').textContent = sale.name + ' — ' + sale.place;
    box.querySelector('.sp__txt > span').textContent = 'Empezó el Método Glúteos Brasileños';
    box.querySelector('.sp__time').textContent = ago(sale.minutesAgo);
    box.classList.add('is-on');
    setTimeout(function () { box.classList.remove('is-on'); }, VISIBLE);
  }

  function loop(list) {
    if (!list.length) return;
    build();
    setTimeout(function tick() {
      show(list[i % list.length]);
      i++;
      if (!dismissed) setTimeout(tick, GAP);
    }, FIRST_DELAY);
  }

  function start() {
    if (MODE === 'live') {
      fetch(ENDPOINT)
        .then(function (r) { return r.json(); })
        .then(function (d) { loop(Array.isArray(d) ? d : []); })
        .catch(function () { /* sin datos, sin notificaciones */ });
      return;
    }
    if (!SALES.length) {
      console.info('[social-proof] Sin ventas cargadas — el aviso queda oculto. ' +
                   'Completá SALES en js/social-proof.js con ventas reales.');
      return;
    }
    loop(SALES);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else { start(); }
})();
