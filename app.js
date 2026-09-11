const codeInput = document.getElementById('codeInput');
const output = document.getElementById('output');
const runBtn = document.getElementById('runBtn');
const runStatus = document.getElementById('runStatus');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');
const clearOutputBtn = document.getElementById('clearOutputBtn');

const examples = {
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
      if (end === -1) throw new Error('Texte non fermé : ajoute 🤫 à la fin de ta chaîne.');
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
      if (blockedIdentifiers.has(word)) throw new Error(`Identifiant interdit : ${word}`);
      js += word;
      i += word.length;
      continue;
    }

    throw new Error(`Symbole inconnu près de « ${source.slice(i, i + 8)} »`);
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
  setStatus('exécution…', 'running');
  runBtn.disabled = true;

  let compiled;
  try {
    compiled = compileEmoji(codeInput.value);
  } catch (err) {
    appendLine(err.message, 'error');
    setStatus('erreur', 'error');
    runBtn.disabled = false;
    return;
  }

  const workerSource = `
    const blocked = undefined;
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
    appendLine('Exécution stoppée après 2 secondes (boucle trop longue ?).', 'error');
    setStatus('timeout', 'error');
    stop();
  }, 2000);

  worker.onmessage = (event) => {
    const data = event.data || {};
    if (data.type === 'out') appendLine(data.value);
    if (data.type === 'error') {
      appendLine(data.value, 'error');
      setStatus('erreur', 'error');
      clearTimeout(timeout);
      stop();
    }
    if (data.type === 'done') {
      if (!output.children.length) appendLine('Script terminé sans sortie.');
      setStatus('terminé', 'success');
      clearTimeout(timeout);
      stop();
    }
  };

  worker.onerror = (event) => {
    appendLine(event.message || 'Erreur inconnue.', 'error');
    setStatus('erreur', 'error');
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
    copyBtn.textContent = 'Copié ✓';
    setTimeout(() => copyBtn.textContent = 'Copier', 1200);
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
  output.innerHTML = '<span class="muted">// Sortie vidée.</span>';
  setStatus('prêt');
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
