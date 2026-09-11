const codeInput = document.getElementById('codeInput');
const output = document.getElementById('output');
const runBtn = document.getElementById('runBtn');
const runStatus = document.getElementById('runStatus');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const clearOutputBtn = document.getElementById('clearOutputBtn');
const isEnglish = document.documentElement.lang.toLowerCase().startsWith('en');

const i18n = isEnglish ? {
  copied:'Copied ✓', copy:'Copy', running:'running…', error:'error', done:'done', timeout:'timeout', ready:'ready',
  empty:'Script finished with no output.', cleared:'// Output cleared.',
  timeoutText:'Execution stopped after 2 seconds (loop running too long?).', unknown:'Unknown error.',
  unclosed:'Unclosed string: add 🤫 at the end of your text.', forbidden:'Forbidden identifier', symbol:'Unknown symbol near'
} : {
  copied:'Copié ✓', copy:'Copier', running:'exécution…', error:'erreur', done:'terminé', timeout:'timeout', ready:'prêt',
  empty:'Script terminé sans sortie.', cleared:'// Sortie vidée.',
  timeoutText:'Exécution stoppée après 2 secondes (boucle trop longue ?).', unknown:'Erreur inconnue.',
  unclosed:'Texte non fermé : ajoute 🤫 à la fin de ta chaîne.', forbidden:'Identifiant interdit', symbol:'Symbole inconnu près de'
};

const examples = isEnglish ? {
  hello: `🗣️🌜💬Hello, world! 👋🤫🌛🙏`,
  condition: `age➡️1️⃣8️⃣🙏\n🤔🌜age💪1️⃣7️⃣🌛👉🔓\n  🗣️🌜💬Access granted ✅🤫🌛🙏\n🔒🙃👉🔓\n  🗣️🌜💬Access denied ❌🤫🌛🙏\n🔒`,
  loop: `i➡️1️⃣🙏\n🔁🌜i🤏6️⃣🌛👉🔓\n  🗣️🌜i🌛🙏\n  i➡️i➕1️⃣🙏\n🔒`,
  length: `message➡️💬Emoji Script 🤯🤫🙏\n🗣️🌜📏🌜message🌛🌛🙏`
} : {
  hello: `🗣️🌜💬Hello, world! 👋🤫🌛🙏`,
  condition: `age➡️1️⃣8️⃣🙏\n🤔🌜age💪1️⃣7️⃣🌛👉🔓\n  🗣️🌜💬Accès autorisé ✅🤫🌛🙏\n🔒🙃👉🔓\n  🗣️🌜💬Accès refusé ❌🤫🌛🙏\n🔒`,
  loop: `i➡️1️⃣🙏\n🔁🌜i🤏6️⃣🌛👉🔓\n  🗣️🌜i🌛🙏\n  i➡️i➕1️⃣🙏\n🔒`,
  length: `message➡️💬Emoji Script 🤯🤫🙏\n🗣️🌜📏🌜message🌛🌛🙏`
};

const tokens = [
  ['✖️','*'], ['🗣️','print'], ['📏','len'], ['🔓','{'], ['🔒','}'], ['📤','['], ['📥',']'],
  ['➕','+'], ['➖','-'], ['➗','/'], ['🙏',';'], ['💯','true'], ['🧢','false'], ['➡️','='],
  ['🤝','=='], ['🙅','!='], ['💪','>'], ['🤏','<'], ['🌜','('], ['🌛',')'], ['👻','null'],
  ['🔁','while'], ['🤔','if'], ['🙃','else'], ['🔹',','], ['👉',''], ['0️⃣','0'], ['1️⃣','1'],
  ['2️⃣','2'], ['3️⃣','3'], ['4️⃣','4'], ['5️⃣','5'], ['6️⃣','6'], ['7️⃣','7'], ['8️⃣','8'], ['9️⃣','9'], ['⏺️','.']
].sort((a,b) => b[0].length - a[0].length);

const blockedIdentifiers = new Set([
  'fetch','importScripts','postMessage','self','globalThis','Function','eval','XMLHttpRequest','WebSocket',
  'Worker','SharedWorker','navigator','location','document','window','parent','top','constructor','prototype','__proto__'
]);

function compileEmoji(source) {
  let i = 0;
  let js = '';
  while (i < source.length) {
    if (/\s/.test(source[i])) {
      js += source[i++];
      continue;
    }

    if (source.startsWith('💬', i)) {
      const end = source.indexOf('🤫', i + '💬'.length);
      if (end === -1) throw new Error(i18n.unclosed);
      const content = source.slice(i + '💬'.length, end);
      js += JSON.stringify(content);
      i = end + '🤫'.length;
      continue;
    }

    let matched = false;
    for (const [emoji, replacement] of tokens) {
      if (source.startsWith(emoji, i)) {
        js += replacement;
        i += emoji.length;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    const rest = source.slice(i);
    const identifier = rest.match(/^[A-Za-z_][A-Za-z0-9_]*/);
    if (identifier) {
      const word = identifier[0];
      if (blockedIdentifiers.has(word)) throw new Error(`${i18n.forbidden} : ${word}`);
      js += word;
      i += word.length;
      continue;
    }

    throw new Error(`${i18n.symbol} « ${source.slice(i, i + 8)} »`);
  }
  return js;
}

function setStatus(text, className='') {
  runStatus.textContent = text;
  runStatus.className = className;
}

function appendLine(text, type='normal') {
  if (output.querySelector('.muted')) output.innerHTML = '';
  const line = document.createElement('span');
  line.className = type === 'error' ? 'output-line output-error' : 'output-line';
  line.textContent = String(text);
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

function runCode() {
  output.innerHTML = '';
  setStatus(i18n.running, 'running');
  runBtn.disabled = true;

  let compiled;
  try {
    compiled = compileEmoji(codeInput.value);
  } catch (err) {
    appendLine(err.message, 'error');
    setStatus(i18n.error, 'error');
    runBtn.disabled = false;
    return;
  }

  const workerSource = `
    const print = (...args) => postMessage({type:'out', value: args.map(v => typeof v === 'object' ? JSON.stringify(v) : String(v)).join(' ')});
    const len = (value) => value != null && typeof value.length === 'number' ? value.length : 0;
    try {
      ${compiled}
      postMessage({type:'done'});
    } catch (error) {
      postMessage({type:'error', value:error && error.message ? error.message : String(error)});
    }
  `;

  const blob = new Blob([workerSource], {type:'text/javascript'});
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  let finished = false;

  const stop = () => {
    if (finished) return;
    finished = true;
    worker.terminate();
    URL.revokeObjectURL(url);
    runBtn.disabled = false;
  };

  const timeout = setTimeout(() => {
    appendLine(i18n.timeoutText, 'error');
    setStatus(i18n.timeout, 'error');
    stop();
  }, 2000);

  worker.onmessage = (event) => {
    const data = event.data || {};
    if (data.type === 'out') appendLine(data.value);
    if (data.type === 'error') {
      appendLine(data.value, 'error');
      setStatus(i18n.error, 'error');
      clearTimeout(timeout);
      stop();
    }
    if (data.type === 'done') {
      if (!output.children.length) appendLine(i18n.empty);
      setStatus(i18n.done, 'success');
      clearTimeout(timeout);
      stop();
    }
  };

  worker.onerror = (event) => {
    appendLine(event.message || i18n.unknown, 'error');
    setStatus(i18n.error, 'error');
    clearTimeout(timeout);
    stop();
  };
}

runBtn.addEventListener('click', runCode);
codeInput.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault();
    runCode();
  }
  if (event.key === 'Tab') {
    event.preventDefault();
    const start = codeInput.selectionStart;
    codeInput.setRangeText('  ', start, codeInput.selectionEnd, 'end');
  }
});

copyBtn.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(codeInput.value);
    copyBtn.textContent = i18n.copied;
    setTimeout(() => copyBtn.textContent = i18n.copy, 1200);
  } catch {
    codeInput.select();
    document.execCommand('copy');
  }
});

clearBtn.addEventListener('click', () => {
  codeInput.value = '';
  codeInput.focus();
});

clearOutputBtn.addEventListener('click', () => {
  output.innerHTML = `<span class="muted">${i18n.cleared}</span>`;
  setStatus(i18n.ready);
});

document.querySelectorAll('[data-example]').forEach(btn => {
  btn.addEventListener('click', () => {
    codeInput.value = examples[btn.dataset.example] || '';
    document.getElementById('compiler').scrollIntoView({behavior:'smooth', block:'start'});
    setTimeout(runCode, 350);
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!open));
  menuToggle.textContent = open ? '☰' : '✕';
  mobileMenu.hidden = open;
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  mobileMenu.hidden = true;
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.textContent = '☰';
}));

document.getElementById('year').textContent = new Date().getFullYear();
