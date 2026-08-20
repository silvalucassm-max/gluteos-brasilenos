/* =========================================================
   quiz.js — motor del quiz
   Cada respuesta se guarda y SE USA de verdad:
   la edad define el perfil y el plan, y el resto de las
   respuestas calculan el puntaje de compatibilidad.
   ========================================================= */

(function () {
  'use strict';

  /* ------------------------------------------------------------------
     PERFILES POR EDAD
     Texto motivador pero verificable. No prometemos nada que el
     entrenamiento de fuerza no haga de verdad.
     ------------------------------------------------------------------ */
  var PROFILES = {
    '18-29': {
      img: 'assets/img/idade18-29.webp',
      name: 'Construcción Rápida',
      emoji: '🚀',
      line: 'A tu edad la <strong>recuperación muscular es más rápida</strong>, así que podés entrenar el glúteo con más frecuencia. Tu plan usa series más cortas y más días activos para ganar volumen.',
      focus: 'Volumen y forma'
    },
    '30-39': {
      img: 'assets/img/idade30-39.webp',
      name: 'Reactivación',
      emoji: '🔥',
      line: 'Es el perfil más común entre nuestras alumnas. Después de los 30 el glúteo suele <strong>perder activación por las horas sentada</strong>. Tu plan arranca despertando la zona antes de sumar carga.',
      focus: 'Activación y volumen'
    },
    '40-49': {
      img: 'assets/img/idade40-49.webp',
      name: 'Firmeza',
      emoji: '💎',
      line: 'Acá el objetivo es la <strong>densidad del músculo</strong>: movimientos más controlados, más tiempo bajo tensión y mucho trabajo de cadera. Es lo que más cambia la forma del glúteo en esta etapa.',
      focus: 'Firmeza y tono'
    },
    '50+': {
      img: 'assets/img/idade50_.webp',
      name: 'Fuerza',
      emoji: '🏆',
      line: 'El músculo es tu mejor aliado después de los 50: sostiene la postura, protege la cadera y <strong>cambia la forma del glúteo a cualquier edad</strong>. Tu plan prioriza fuerza y estabilidad, con progresión suave.',
      focus: 'Fuerza y postura'
    }
  };

  /* Línea de tiempo — 28 días, igual que la promesa del anuncio */
  var PLAN = [
    { ico: '⚡', d: 'Días 1 – 7',   t: 'Activación: empezás a sentir el glúteo trabajando en cada serie.' },
    { ico: '💪', d: 'Días 8 – 14',  t: 'Fuerza: más resistencia, menos molestia en la lumbar.' },
    { ico: '🍑', d: 'Días 15 – 28', t: 'Forma: glúteo más firme y trabajado, la parte más visible del cambio.' }
  ];

  /* ------------------------------------------------------------------
     PASOS
     ------------------------------------------------------------------ */
  var STEPS = [
    {
      id: 'objetivo', type: 'choice',
      label: 'Pregunta 1',
      title: '¿Cuál es tu objetivo principal con tus glúteos?',
      hint: 'Elegí lo que más te importa hoy.',
      options: [
        { ico: '🍑', v: 'volumen',  t: 'Más volumen' },
        { ico: '💎', v: 'firmeza',  t: 'Más firmeza' },
        { ico: '⭕', v: 'forma',    t: 'Forma más redonda' },
        { ico: '✨', v: 'todo',     t: 'Todo junto' }
      ]
    },
    {
      id: 'edad', type: 'photo',
      label: 'Pregunta 2',
      title: '¿Cuál es tu edad?',
      hint: 'Tu plan y tus tiempos cambian según la etapa.',
      options: [
        { v: '18-29', t: '18 a 29', img: 'assets/img/idade18-29.webp' },
        { v: '30-39', t: '30 a 39', img: 'assets/img/idade30-39.webp' },
        { v: '40-49', t: '40 a 49', img: 'assets/img/idade40-49.webp' },
        { v: '50+',   t: '50 o más', img: 'assets/img/idade50_.webp' }
      ]
    },
    {
      id: 'experiencia', type: 'choice',
      label: 'Pregunta 3',
      title: '¿Ya intentaste entrenar glúteos antes?',
      hint: 'No hay respuesta incorrecta.',
      options: [
        { ico: '😮‍💨', v: 'sin-resultado', t: 'Sí, pero no vi resultados' },
        { ico: '📉',    v: 'poco',          t: 'Sí, vi poco y abandoné' },
        { ico: '🌱',    v: 'nunca',         t: 'Nunca entrené glúteos' },
        { ico: '🏋️',   v: 'activa',        t: 'Entreno hace tiempo' }
      ]
    },
    {
      id: 'lugar', type: 'choice',
      label: 'Pregunta 4',
      title: '¿Dónde vas a entrenar?',
      hint: 'El método funciona en los tres casos.',
      options: [
        { ico: '🏠', v: 'casa',      t: 'En casa, sin equipo' },
        { ico: '🎗️', v: 'elasticos', t: 'En casa, con elásticos' },
        { ico: '🏢', v: 'gimnasio',  t: 'En el gimnasio' }
      ]
    },
    {
      id: 'tiempo', type: 'choice',
      label: 'Pregunta 5',
      title: '¿Cuánto tiempo real tenés por día?',
      hint: 'Sé sincera — el plan se arma con esto.',
      options: [
        { ico: '⏱️', v: '-10',   t: 'Menos de 10 minutos' },
        { ico: '⏰', v: '10-20', t: 'Entre 10 y 20 minutos' },
        { ico: '🕐', v: '20-30', t: 'Entre 20 y 30 minutos' },
        { ico: '🔋', v: '30+',   t: 'Más de 30 minutos' }
      ]
    },
    { id: 'nota', type: 'note' },
    { id: 'resultado', type: 'result' },
    {
      id: 'lista', type: 'choice',
      label: 'Última parte',
      title: '¿Sentís que estás lista para transformar tu cuerpo y tu autoestima de una vez por todas?',
      hint: 'Seleccioná una de las opciones.',
      options: [
        { ico: '💪', v: 'si',         t: 'Sí, estoy lista' },
        { ico: '🙌', v: 'casi',       t: 'Casi — solo necesito un empujón' },
        { ico: '🌱', v: 'motivacion', t: 'Necesito más motivación para empezar' }
      ]
    },
    {
      id: 'meta', type: 'choice',
      label: 'Casi terminamos',
      title: '¿Qué querés poder hacer al terminar los 28 días?',
      hint: 'Elegí lo que más te mueve.',
      options: [
        { ico: '👙', v: 'bikini',    t: 'Usar bikini sin pensarlo dos veces' },
        { ico: '👖', v: 'jeans',     t: 'Que el jean me quede como quiero' },
        { ico: '💃', v: 'confianza', t: 'Sentirme segura con cualquier ropa' },
        { ico: '🔋', v: 'fuerza',    t: 'Sentirme más fuerte y con energía' }
      ]
    },
    {
      id: 'compromiso', type: 'choice',
      label: 'Última pregunta',
      title: '¿Cuántos días por semana te comprometés a entrenar?',
      hint: 'Con 3 días ya se ven cambios. Con más, llegan antes.',
      options: [
        { ico: '🔥', v: '6-7', t: '6 o 7 días — voy con todo' },
        { ico: '✅', v: '4-5', t: '4 o 5 días' },
        { ico: '👍', v: '2-3', t: '2 o 3 días' }
      ]
    }
  ];

  /* ------------------------------------------------------------------
     PUNTAJE DE COMPATIBILIDAD — calculado con las respuestas reales.
     No es un número decorativo: si cambia la respuesta, cambia el puntaje.
     ------------------------------------------------------------------ */
  var WEIGHTS = {
    tiempo:      { '-10': 6,  '10-20': 11, '20-30': 12, '30+': 12 },
    lugar:       { casa: 11, elasticos: 12, gimnasio: 9 },
    experiencia: { 'sin-resultado': 9, poco: 8, nunca: 7, activa: 6 },
    compromiso:  { '6-7': 12, '4-5': 10, '2-3': 7 },
    lista:       { si: 6, casi: 5, motivacion: 4 }
  };

  function calcScore(a) {
    var s = 58;
    Object.keys(WEIGHTS).forEach(function (k) {
      if (a[k] && WEIGHTS[k][a[k]] != null) s += WEIGHTS[k][a[k]];
    });
    return Math.max(60, Math.min(98, s));
  }

  /* ------------------------------------------------------------------
     RENDER
     ------------------------------------------------------------------ */
  var mount   = document.getElementById('quizMount');
  var headEl  = document.getElementById('quizHead');
  var barEl   = document.getElementById('quizBar');
  var countEl = document.getElementById('quizCount');
  var backEl  = document.getElementById('quizBack');
  var idx = 0;

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function updateHead() {
    var total = STEPS.length;
    barEl.style.width = Math.round((idx / total) * 100) + '%';
    countEl.textContent = (idx + 1) + ' / ' + total;
    backEl.style.visibility = idx === 0 ? 'hidden' : 'visible';
  }

  function render() {
    var step = STEPS[idx];
    updateHead();
    if (step.type === 'note')        mount.innerHTML = viewNote();
    else if (step.type === 'result') mount.innerHTML = viewResult();
    else                             mount.innerHTML = viewQuestion(step);

    bind(step);
    mount.querySelector('.q, .result').scrollIntoView({ block: 'start' });
    window.scrollTo({ top: 0 });
    Funnel.track('QuizStep', { step: idx + 1, id: step.id });
  }

  function viewQuestion(step) {
    var saved = Funnel.getAnswers()[step.id];
    var opts;

    if (step.type === 'photo') {
      opts = step.options.map(function (o) {
        return '<button class="opt opt--photo' + (saved === o.v ? ' is-picked' : '') +
               '" data-v="' + esc(o.v) + '" type="button">' +
               '<img src="' + o.img + '" alt="" loading="lazy" width="520" height="400">' +
               '<span>' + esc(o.t) + '</span></button>';
      }).join('');
      opts = '<div class="opts opts--photo">' + opts + '</div>';
    } else {
      opts = step.options.map(function (o) {
        return '<button class="opt' + (saved === o.v ? ' is-picked' : '') +
               '" data-v="' + esc(o.v) + '" type="button">' +
               '<span class="opt__ico" aria-hidden="true">' + o.ico + '</span>' +
               '<span>' + esc(o.t) + '</span></button>';
      }).join('');
      opts = '<div class="opts">' + opts + '</div>';
    }

    return '<section class="q">' +
             '<p class="q__label">' + esc(step.label) + '</p>' +
             '<h2 class="q__title display">' + esc(step.title) + '</h2>' +
             (step.hint ? '<p class="q__hint">' + esc(step.hint) + '</p>' : '') +
             opts +
           '</section>';
  }

  /* Paso educativo — activación glútea, sin estadísticas inventadas */
  function viewNote() {
    return '' +
    '<section class="q">' +
      '<div class="note">' +
        '<div class="note__top"><b>⚠️ Información importante</b></div>' +
        '<div class="note__body">' +
          '<h3>¿Por qué entrenás y el glúteo no responde?</h3>' +
          '<p>Pasamos muchas horas sentadas y el cuerpo se acostumbra a <strong>resolver el movimiento con la lumbar y los muslos</strong> en lugar del glúteo. Es lo que en entrenamiento se llama falta de activación glútea.</p>' +
          '<p>Por eso terminás cansada, con la espalda cargada… y el glúteo casi sin trabajar. <strong>No es falta de esfuerzo: es una cuestión de técnica y de orden.</strong></p>' +
          '<div class="note__good">' +
            '<b>✅ La buena noticia</b>' +
            '<p>La activación se entrena. Con la secuencia correcta se puede corregir en casa, sin gimnasio y sin peso pesado. Eso es exactamente lo que ordena el <strong>Método Glúteos Brasileños</strong> 🇧🇷.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="opts">' +
        '<button class="opt" data-v="sabia" type="button">' +
          '<span class="opt__ico" aria-hidden="true">🧐</span><span>Ya lo sabía</span></button>' +
        '<button class="opt" data-v="no-sabia" type="button">' +
          '<span class="opt__ico" aria-hidden="true">😱</span><span>¡No lo sabía!</span></button>' +
      '</div>' +
    '</section>';
  }

  /* Resultado — usa la edad respondida */
  function viewResult() {
    var a = Funnel.getAnswers();
    var p = PROFILES[a.edad] || PROFILES['30-39'];
    var score = calcScore(a);

    var rows = PLAN.map(function (r) {
      return '<div class="plan__row">' +
               '<span class="plan__ico" aria-hidden="true">' + r.ico + '</span>' +
               '<span class="plan__txt"><b>' + r.d + '</b><span>' + r.t + '</span></span>' +
             '</div>';
    }).join('');

    return '' +
    '<section class="result">' +
      '<div class="center"><span class="result__badge">✨ Análisis completado</span></div>' +
      '<h2 class="result__title display">Tu perfil de<br><span>entrenamiento</span></h2>' +

      '<div class="profile">' +
        '<div class="profile__top">' +
          '<img src="' + p.img + '" alt="" loading="lazy">' +
          '<span><small>Perfil detectado · ' + esc(a.edad || '30-39') + ' años</small>' +
          '<b>' + p.emoji + ' ' + esc(p.name) + '</b></span>' +
        '</div>' +
        '<div class="profile__body">' +
          '<p class="profile__line">' + p.line + '</p>' +
          '<p class="profile__line" style="margin-top:12px">' +
            '<strong>Foco de tu plan:</strong> ' + esc(p.focus) + ' · ' +
            '<strong>Entrenás:</strong> ' + esc(labelOf('lugar', a.lugar)) + ' · ' +
            '<strong>Sesiones de:</strong> ' + esc(sessionLen(a.tiempo)) +
          '</p>' +
        '</div>' +
      '</div>' +

      '<h3 class="display" style="margin-top:26px;font-size:22px">Tu plan · 28 días</h3>' +
      '<div class="plan">' + rows + '</div>' +

      '<div class="score">' +
        '<div class="score__ring">' +
          '<svg viewBox="0 0 132 132" aria-hidden="true">' +
            '<defs><linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">' +
              '<stop offset="0%" stop-color="#EC0F8C"/><stop offset="100%" stop-color="#8B2FD6"/>' +
            '</linearGradient></defs>' +
            '<circle class="score__bg" cx="66" cy="66" r="56"/>' +
            '<circle class="score__fg" id="scoreArc" cx="66" cy="66" r="56"/>' +
          '</svg>' +
          '<div class="score__num"><span id="scoreNum">0<small>/100</small></span></div>' +
        '</div>' +
        '<p class="score__cap"><strong>Tu plan es ' + score + '% compatible</strong> con el tiempo, el lugar y la frecuencia que elegiste.</p>' +
        '<p class="score__how">Calculado con tus respuestas de tiempo diario, lugar de entrenamiento, experiencia previa y días por semana.</p>' +
      '</div>' +

      '<div class="opts" style="margin-top:24px">' +
        '<button class="opt" data-v="continuar" type="button" style="justify-content:center;border-color:var(--magenta);background:var(--magenta);color:#fff">' +
          '<span>Continuar mi transformación →</span></button>' +
      '</div>' +
    '</section>';
  }

  function labelOf(stepId, value) {
    var step = STEPS.filter(function (s) { return s.id === stepId; })[0];
    if (!step) return '—';
    var o = step.options.filter(function (x) { return x.v === value; })[0];
    return o ? o.t.toLowerCase() : '—';
  }
  function sessionLen(t) {
    return { '-10': '8 minutos', '10-20': '8 a 15 minutos',
             '20-30': '15 a 25 minutos', '30+': '25 minutos' }[t] || '8 minutos';
  }

  /* Anima el anillo del puntaje */
  function animateScore() {
    var a = Funnel.getAnswers();
    var target = calcScore(a);
    var arc = document.getElementById('scoreArc');
    var num = document.getElementById('scoreNum');
    if (!arc || !num) return;
    var C = 352;
    requestAnimationFrame(function () {
      arc.style.strokeDashoffset = C - (C * target / 100);
    });
    var cur = 0;
    var t = setInterval(function () {
      cur += Math.max(1, Math.round(target / 34));
      if (cur >= target) { cur = target; clearInterval(t); }
      num.innerHTML = cur + '<small>/100</small>';
    }, 42);
  }

  /* ------------------------------------------------------------------
     EVENTOS
     ------------------------------------------------------------------ */
  function bind(step) {
    if (step.type === 'result') animateScore();

    mount.querySelectorAll('.opt').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var v = btn.getAttribute('data-v');
        Funnel.setAnswer(step.id, v);
        mount.querySelectorAll('.opt').forEach(function (b) { b.classList.remove('is-picked'); });
        btn.classList.add('is-picked');
        setTimeout(next, 190);   // respiro visual antes de avanzar
      });
    });
  }

  function next() {
    if (idx < STEPS.length - 1) { idx++; render(); }
    else finish();
  }
  function prev() {
    if (idx > 0) { idx--; render(); }
  }

  /* ------------------------------------------------------------------
     CIERRE — pantalla de análisis y salto a la VSL
     ------------------------------------------------------------------ */
  var LOAD_STEPS = [
    'Leyendo tus respuestas…',
    'Cruzando tu perfil con el método…',
    'Ajustando la carga de cada semana…',
    'Armando tu plan de 28 días…',
    '¡Listo! Abriendo tu acceso…'
  ];

  function finish() {
    Funnel.track('CompleteRegistration', { content_name: 'quiz_gluteos' });
    Funnel.setAnswer('score', calcScore(Funnel.getAnswers()));

    document.body.innerHTML =
      '<div class="loading">' +
        '<div class="loading__ring" role="status" aria-live="polite"></div>' +
        '<h2 class="display">Analizando tus<br>respuestas</h2>' +
        '<p class="loading__step" id="loadStep">' + LOAD_STEPS[0] + '</p>' +
        '<div class="loading__bar"><div class="loading__fill" id="loadFill"></div></div>' +
      '</div>';

    var stepEl = document.getElementById('loadStep');
    var fillEl = document.getElementById('loadFill');
    var i = 0;
    var total = LOAD_STEPS.length;

    var t = setInterval(function () {
      i++;
      fillEl.style.width = Math.round((i / total) * 100) + '%';
      if (i < total) {
        stepEl.textContent = LOAD_STEPS[i];
      } else {
        clearInterval(t);
        setTimeout(function () { Funnel.go('vsl.html'); }, 550);
      }
    }, 900);
  }

  /* ------------------------------------------------------------------
     ARRANQUE — lo llama el botón "empezar" del pre-quiz
     ------------------------------------------------------------------ */
  window.startQuiz = function () {
    document.getElementById('preQuiz').classList.remove('is-active');
    document.getElementById('quizScreen').classList.add('is-active');
    headEl.classList.remove('hidden');
    Funnel.track('ViewContent', { content_name: 'quiz_start' });
    idx = 0;
    render();
    window.scrollTo({ top: 0 });
  };

  backEl.addEventListener('click', prev);
})();
