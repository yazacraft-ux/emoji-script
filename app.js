/* ==========================================================================
   Emoji Script — script partagé par toutes les pages
   - Menu mobile + année du footer : actifs partout
   - Compilateur : activé uniquement sur les pages qui le contiennent
   ========================================================================== */
(function () {
  'use strict';

  var isEnglish = (document.documentElement.lang || '').toLowerCase().indexOf('en') === 0;

  var i18n = isEnglish ? {
    copied: 'Copied ✓', copy: 'Copy', running: 'running…', error: 'error', done: 'done', timeout: 'timeout', ready: 'ready',
    empty: 'Script finished with no output.', cleared: '// Output cleared.',
    timeoutText: 'Execution stopped after 2 seconds (loop running too long?).', unknown: 'Unknown error.',
    unclosed: 'Unclosed string: add 🤫 at the end of your text.', forbidden: 'Forbidden identifier', symbol: 'Unknown symbol near',
    tooMany: 'Output stopped: too many lines displayed.', noWorker: 'Your browser blocked the execution sandbox.',
    share: 'Share', linkCopied: 'Link copied ✓', linkTooLong: 'Script too long to be shared as a link.',
    linkFailed: 'The link could not be copied.', loadedFromLink: '// Script loaded from a shared link. Press Run.'
  } : {
    copied: 'Copié ✓', copy: 'Copier', running: 'exécution…', error: 'erreur', done: 'terminé', timeout: 'timeout', ready: 'prêt',
    empty: 'Script terminé sans sortie.', cleared: '// Sortie vidée.',
    timeoutText: 'Exécution stoppée après 2 secondes (boucle trop longue ?).', unknown: 'Erreur inconnue.',
    unclosed: 'Texte non fermé : ajoute 🤫 à la fin de ta chaîne.', forbidden: 'Identifiant interdit', symbol: 'Symbole inconnu près de',
    tooMany: 'Affichage stoppé : trop de lignes générées.', noWorker: 'Ton navigateur a bloqué le bac à sable d’exécution.',
    share: 'Partager', linkCopied: 'Lien copié ✓', linkTooLong: 'Script trop long pour être partagé en lien.',
    linkFailed: 'Le lien n’a pas pu être copié.', loadedFromLink: '// Script chargé depuis un lien partagé. Clique sur Exécuter.'
  };

  /* ---------------------------------------------------------------- Menu */
  var menuToggle = document.querySelector('.menu-toggle');
  var mobileMenu = document.querySelector('.mobile-menu');

  function closeMenu() {
    if (!menuToggle || !mobileMenu) return;
    mobileMenu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var open = menuToggle.getAttribute('aria-expanded') === 'true';
      if (open) {
        closeMenu();
      } else {
        mobileMenu.hidden = false;
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.textContent = '✕';
      }
    });

    Array.prototype.forEach.call(mobileMenu.querySelectorAll('a'), function (link) {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    document.addEventListener('click', function (event) {
      if (mobileMenu.hidden) return;
      if (mobileMenu.contains(event.target) || menuToggle.contains(event.target)) return;
      closeMenu();
    });
  }

  /* ------ défilement interne sans ancre dans l'adresse ------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('[data-scroll]'), function (el) {
    el.addEventListener('click', function (event) {
      var target = document.getElementById(el.getAttribute('data-scroll'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      closeMenu();
    });
  });

  var yearNode = document.getElementById('year');
  if (yearNode) yearNode.textContent = String(new Date().getFullYear());

  /* --------------------------------------------------------- Compilateur */
  var codeInput = document.getElementById('codeInput');
  var output = document.getElementById('output');
  var runBtn = document.getElementById('runBtn');
  if (!codeInput || !output || !runBtn) return;

  var runStatus = document.getElementById('runStatus');
  var copyBtn = document.getElementById('copyBtn');
  var clearBtn = document.getElementById('clearBtn');
  var clearOutputBtn = document.getElementById('clearOutputBtn');
  var shareBtn = document.getElementById('shareBtn');

  var examples = {
    hello: '🗣️🌜💬Hello, world! 👋🤫🌛🙏',
    condition: isEnglish
      ? 'age➡️1️⃣8️⃣🙏\n🤔🌜age💪1️⃣7️⃣🌛👉🔓\n  🗣️🌜💬Access granted ✅🤫🌛🙏\n🔒🙃👉🔓\n  🗣️🌜💬Access denied ❌🤫🌛🙏\n🔒'
      : 'age➡️1️⃣8️⃣🙏\n🤔🌜age💪1️⃣7️⃣🌛👉🔓\n  🗣️🌜💬Accès autorisé ✅🤫🌛🙏\n🔒🙃👉🔓\n  🗣️🌜💬Accès refusé ❌🤫🌛🙏\n🔒',
    loop: 'i➡️1️⃣🙏\n🔁🌜i🤏6️⃣🌛👉🔓\n  🗣️🌜i🌛🙏\n  i➡️i➕1️⃣🙏\n🔒',
    length: 'message➡️💬Emoji Script 🤯🤫🙏\n🗣️🌜📏🌜message🌛🌛🙏'
  };

  var tokens = [
    ['✖️', '*'], ['🗣️', 'print'], ['📏', 'len'], ['🔓', '{'], ['🔒', '}'], ['📤', '['], ['📥', ']'],
    ['➕', '+'], ['➖', '-'], ['➗', '/'], ['🙏', ';'], ['💯', 'true'], ['🧢', 'false'], ['➡️', '='],
    ['🤝', '=='], ['🙅', '!='], ['💪', '>'], ['🤏', '<'], ['🌜', '('], ['🌛', ')'], ['👻', 'null'],
    ['🔁', 'while'], ['🤔', 'if'], ['🙃', 'else'], ['🔹', ','], ['👉', ''], ['0️⃣', '0'], ['1️⃣', '1'],
    ['2️⃣', '2'], ['3️⃣', '3'], ['4️⃣', '4'], ['5️⃣', '5'], ['6️⃣', '6'], ['7️⃣', '7'], ['8️⃣', '8'],
    ['9️⃣', '9'], ['⏺️', '.']
  ].sort(function (a, b) { return b[0].length - a[0].length; });

  var blockedIdentifiers = {};
  ['fetch', 'importScripts', 'postMessage', 'addEventListener', 'self', 'globalThis', 'Function', 'eval',
    'XMLHttpRequest', 'WebSocket', 'EventSource', 'Worker', 'SharedWorker', 'navigator', 'location',
    'document', 'window', 'parent', 'top', 'constructor', 'prototype', '__proto__', 'caches',
    'indexedDB', 'Blob', 'URL', 'atob', 'btoa', 'setTimeout', 'setInterval', 'Reflect', 'Proxy', 'import'
  ].forEach(function (word) { blockedIdentifiers[word] = true; });

  function compileEmoji(source) {
    var i = 0;
    var js = '';

    while (i < source.length) {
      var char = source.charAt(i);

      // espaces et retours à la ligne conservés tels quels
      if (/\s/.test(char)) { js += char; i += 1; continue; }

      // chaîne de texte : 💬 ... 🤫
      if (source.indexOf('💬', i) === i) {
        var end = source.indexOf('🤫', i + '💬'.length);
        if (end === -1) throw new Error(i18n.unclosed);
        js += JSON.stringify(source.slice(i + '💬'.length, end));
        i = end + '🤫'.length;
        continue;
      }

      // symboles du langage
      var matched = false;
      for (var t = 0; t < tokens.length; t += 1) {
        var emoji = tokens[t][0];
        if (source.indexOf(emoji, i) === i) {
          js += tokens[t][1];
          i += emoji.length;
          matched = true;
          break;
        }
      }
      if (matched) continue;

      // chiffres classiques acceptés aussi (5 équivaut à 5️⃣)
      var digits = source.slice(i).match(/^[0-9]+/);
      if (digits) { js += digits[0]; i += digits[0].length; continue; }

      // noms de variables
      var identifier = source.slice(i).match(/^[A-Za-z_][A-Za-z0-9_]*/);
      if (identifier) {
        var word = identifier[0];
        if (blockedIdentifiers[word] === true) throw new Error(i18n.forbidden + ' : ' + word);
        js += word;
        i += word.length;
        continue;
      }

      throw new Error(i18n.symbol + ' « ' + source.slice(i, i + 8) + ' »');
    }

    return js;
  }

  function setStatus(text, className) {
    if (!runStatus) return;
    runStatus.textContent = text;
    runStatus.className = className || '';
  }

  var MAX_LINES = 400;
  var printedLines = 0;
  var pending = [];
  var flushScheduled = false;

  function flush() {
    flushScheduled = false;
    if (!pending.length) return;

    var placeholder = output.querySelector('.muted');
    if (placeholder) output.innerHTML = '';

    var fragment = document.createDocumentFragment();
    pending.forEach(function (item) {
      var line = document.createElement('span');
      line.className = item.type === 'error' ? 'output-line output-error' : 'output-line';
      line.textContent = String(item.text);
      fragment.appendChild(line);
    });
    pending = [];
    output.appendChild(fragment);
    output.scrollTop = output.scrollHeight;
  }

  function appendLine(text, type) {
    pending.push({ text: text, type: type });
    if (!flushScheduled) {
      flushScheduled = true;
      (window.requestAnimationFrame || window.setTimeout)(flush, 16);
    }
  }

  function buildWorkerSource(compiled) {
    // Concaténation volontaire (et non un template littéral) : le code compilé
    // ne peut ainsi jamais être interprété comme une interpolation ${...}
    return [
      // le worker est neutralisé avant d'exécuter quoi que ce soit
      'var __blocked = ["fetch","XMLHttpRequest","WebSocket","EventSource","importScripts",',
      '  "Worker","SharedWorker","indexedDB","caches","navigator","postMessage"];',
      'var __post = postMessage.bind(self);',
      '__blocked.forEach(function (name) {',
      '  try { Object.defineProperty(self, name, { value: undefined, configurable: false }); } catch (e) {}',
      '});',
      'var print = function () {',
      '  var parts = Array.prototype.map.call(arguments, function (v) {',
      '    return typeof v === "object" && v !== null ? JSON.stringify(v) : String(v);',
      '  });',
      '  __post({ type: "out", value: parts.join(" ") });',
      '};',
      'var len = function (value) {',
      '  return value != null && typeof value.length === "number" ? value.length : 0;',
      '};',
      'try {',
      compiled,
      '  __post({ type: "done" });',
      '} catch (error) {',
      '  __post({ type: "error", value: error && error.message ? error.message : String(error) });',
      '}'
    ].join('\n');
  }

  function runCode() {
    output.innerHTML = '';
    pending = [];
    printedLines = 0;
    setStatus(i18n.running, 'running');
    runBtn.disabled = true;

    var compiled;
    try {
      compiled = compileEmoji(codeInput.value);
    } catch (err) {
      appendLine(err.message, 'error');
      setStatus(i18n.error, 'error');
      runBtn.disabled = false;
      return;
    }

    var url;
    var worker;
    try {
      url = URL.createObjectURL(new Blob([buildWorkerSource(compiled)], { type: 'text/javascript' }));
      worker = new Worker(url);
    } catch (err) {
      if (url) URL.revokeObjectURL(url);
      appendLine(i18n.noWorker, 'error');
      setStatus(i18n.error, 'error');
      runBtn.disabled = false;
      return;
    }

    var finished = false;
    var timeout;

    function stop() {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      worker.terminate();
      URL.revokeObjectURL(url);
      runBtn.disabled = false;
      flush();
    }

    timeout = setTimeout(function () {
      appendLine(i18n.timeoutText, 'error');
      setStatus(i18n.timeout, 'error');
      stop();
    }, 2000);

    worker.onmessage = function (event) {
      var data = event.data || {};

      if (data.type === 'out') {
        printedLines += 1;
        if (printedLines <= MAX_LINES) {
          appendLine(data.value);
        } else if (printedLines === MAX_LINES + 1) {
          appendLine(i18n.tooMany, 'error');
          setStatus(i18n.error, 'error');
          stop();
        }
        return;
      }

      if (data.type === 'error') {
        appendLine(data.value, 'error');
        setStatus(i18n.error, 'error');
        stop();
        return;
      }

      if (data.type === 'done') {
        if (!printedLines) appendLine(i18n.empty);
        setStatus(i18n.done, 'success');
        stop();
      }
    };

    worker.onerror = function (event) {
      if (event && event.preventDefault) event.preventDefault();
      appendLine((event && event.message) || i18n.unknown, 'error');
      setStatus(i18n.error, 'error');
      stop();
    };
  }

  runBtn.addEventListener('click', runCode);

  codeInput.addEventListener('keydown', function (event) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      runCode();
      return;
    }
    if (event.key === 'Tab') {
      event.preventDefault();
      var start = codeInput.selectionStart;
      codeInput.setRangeText('  ', start, codeInput.selectionEnd, 'end');
    }
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var restore = function () {
        copyBtn.textContent = i18n.copied;
        setTimeout(function () { copyBtn.textContent = i18n.copy; }, 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(codeInput.value).then(restore, function () {
          codeInput.select();
          document.execCommand('copy');
          restore();
        });
      } else {
        codeInput.select();
        document.execCommand('copy');
        restore();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function () {
      codeInput.value = '';
      codeInput.focus();
    });
  }

  if (clearOutputBtn) {
    clearOutputBtn.addEventListener('click', function () {
      pending = [];
      printedLines = 0;
      output.innerHTML = '';
      var placeholder = document.createElement('span');
      placeholder.className = 'muted';
      placeholder.textContent = i18n.cleared;
      output.appendChild(placeholder);
      setStatus(i18n.ready);
    });
  }


  /* ------------------------------------------------- Partage par lien */
  function encodeScript(text) {
    var bytes = new TextEncoder().encode(text);
    var binary = '';
    for (var i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decodeScript(value) {
    var base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    var binary = atob(base64);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function shareLink() {
    var encoded;
    try {
      encoded = encodeScript(codeInput.value);
    } catch (err) {
      setStatus(i18n.error, 'error');
      return;
    }

    var url = location.origin + location.pathname + '#s=' + encoded;
    if (url.length > 8000) {
      output.innerHTML = '';
      pending = [];
      appendLine(i18n.linkTooLong, 'error');
      setStatus(i18n.error, 'error');
      return;
    }

    history.replaceState(null, '', '#s=' + encoded);

    var confirmCopy = function () {
      shareBtn.textContent = i18n.linkCopied;
      setTimeout(function () { shareBtn.textContent = i18n.share; }, 1600);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(confirmCopy, function () {
        appendLine(i18n.linkFailed, 'error');
      });
    } else {
      appendLine(url);
    }
  }

  if (shareBtn) shareBtn.addEventListener('click', shareLink);

  function loadFromHash() {
    var match = /[#&]s=([A-Za-z0-9\-_]+)/.exec(location.hash);
    if (!match) return;
    try {
      var shared = decodeScript(match[1]);
      if (!shared) return;
      codeInput.value = shared;
      pending = [];
      printedLines = 0;
      output.innerHTML = '';
      var note = document.createElement('span');
      note.className = 'muted';
      note.textContent = i18n.loadedFromLink;
      output.appendChild(note);
      setStatus(i18n.ready);
      var target = document.getElementById('compiler');
      if (target) setTimeout(function () { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 120);
    } catch (err) {
      /* lien abîmé : on garde le script en place */
    }
  }

  loadFromHash();
  window.addEventListener('hashchange', loadFromHash);

  Array.prototype.forEach.call(document.querySelectorAll('[data-example]'), function (btn) {
    btn.addEventListener('click', function () {
      codeInput.value = examples[btn.dataset.example] || '';
      var section = document.getElementById('compiler');
      if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(runCode, 350);
    });
  });
})();
