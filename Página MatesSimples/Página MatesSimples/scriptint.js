// ==========================================
// 1. SIMULACIÓN DE SUMAS DE RIEMANN
// ==========================================

const $ = id => document.getElementById(id);

// barra de progreso
window.addEventListener('scroll', () => {
  const p = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  $('barra').style.width = (p * 100) + '%';
});

// reveal al hacer scroll
const obsv = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.aparecer').forEach(el => obsv.observe(el));

// ── HERO ──────────────────────────────────────
(function() {
  const c = $('canvas-hero'), ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  const pad = { t: 18, b: 28, l: 44, r: 18 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  const funciones = [
    x => Math.sen(x * 1.15) * 0.38 + 0.5,
    x => x * x / 18 + 0.1,
    x => Math.sqrt(Math.max(0, x / 6)) * 0.72 + 0.1
  ];
  let fi = 0, fn = funciones[0], t = 0, tFn = 0;

  function px(x) { return pad.l + x / 10 * pw; }
  function py(y) { return pad.t + ph - y * ph; }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    const prog = Math.min(t / 90, 1);
    const xMax = prog * 10;

    // grid
    ctx.strokeStyle = 'rgba(220,224,234,.9)'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const yy = pad.t + ph * i / 4;
      ctx.beginPath(); ctx.moveTo(pad.l, yy); ctx.lineTo(W - pad.r, yy); ctx.stroke();
    }

    // área rellena
    if (xMax > 0) {
      const g = ctx.createLinearGradient(pad.l, pad.t, pad.l, pad.t + ph);
      g.addColorStop(0, 'rgba(39,199,104,.35)');
      g.addColorStop(1, 'rgba(39,199,104,.02)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.moveTo(px(0), py(0));
      for (let i = 0; i <= 280; i++) { const x = xMax * i / 280; ctx.lineTo(px(x), py(fn(x))); }
      ctx.lineTo(px(xMax), py(0)); ctx.closePath(); ctx.fill();
    }

    // curva
    ctx.strokeStyle = '#27c768'; ctx.lineWidth = 2.3;
    ctx.shadowColor = '#27c768'; ctx.shadowBlur = 6;
    ctx.beginPath();
    for (let i = 0; i <= 480; i++) { const x = 10 * i / 480; if (i === 0) ctx.moveTo(px(x), py(fn(x))); else ctx.lineTo(px(x), py(fn(x))); }
    ctx.stroke(); ctx.shadowBlur = 0;

    // ejes
    ctx.strokeStyle = '#4a5070'; ctx.lineWidth = 1.3;
    ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + ph); ctx.lineTo(W - pad.r, pad.t + ph); ctx.stroke();

    // etiqueta
    if (prog > 0.45) {
      ctx.fillStyle = 'rgba(39,199,104,.8)'; ctx.font = '600 12px Inter,sans-serif';
      ctx.fillText('∫ f(x) dx = área bajo la curva', pad.l + pw * .28, pad.t + ph * .3);
    }

    t++; tFn++;
    if (tFn > 200 && t > 100) { tFn = 0; t = 0; fi = (fi + 1) % funciones.length; fn = funciones[fi]; }
    requestAnimationFrame(frame);
  }
  frame();
})();

// ── RIEMANN ───────────────────────────────────
const FUNCIONES = {
  x2:    { fn: x => x * x,                  exact: (a, b) => b**3/3 - a**3/3,              lbl: 'f(x) = x²',      col: '#27c768' },
  sen:   { fn: x => Math.sin(x),             exact: (a, b) => -Math.cos(b) + Math.cos(a),   lbl: 'f(x) = sin(x)',  col: '#e8b84b' },
  sqrt:  { fn: x => Math.sqrt(Math.max(0,x)),exact: (a, b) => 2/3*(b**1.5 - a**1.5),        lbl: 'f(x) = √x',      col: '#e05a3a' },
  x3:    { fn: x => x**3/4,                  exact: (a, b) => b**4/16 - a**4/16,            lbl: 'f(x) = x³/4',    col: '#27c768' },
  abs:   { fn: x => Math.abs(x - 1.5),       exact: (a, b) => { const p = x => x >= 1.5 ? (x-1.5)**2/2 : (1.5-x)**2/2; return p(b) - p(a); }, lbl: 'f(x) = |x−1.5|', col: '#e8b84b' },
  gauss: { fn: x => Math.exp(-x*x),          exact: (a, b) => {
    function erf(x) { const t=1/(1+.3275911*x); return 1-t*(.254829592+t*(-.284496736+t*(1.421413741+t*(-1.453152027+t*1.061405429))))*Math.exp(-x*x); }
    return Math.sqrt(Math.PI)/2*(erf(b)-erf(a)); }, lbl: 'f(x) = e^(−x²)', col: '#e05a3a' }
};


function dibujarRiemann() {
  const c = $('canvas-riemann'), ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  const pad = { t: 30, b: 40, l: 52, r: 20 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;
  const cfg = FUNCIONES[rfn], fn = cfg.fn, n = rn, dx = (RB - RA) / n;

  let yMax = 0;
  for (let i = 0; i <= 300; i++) yMax = Math.max(yMax, fn(RA + (RB-RA)*i/300));
  yMax *= 1.18;
  const yMin = -0.04 * yMax;

  function sx(x) { return pad.l + (x - RA) / (RB - RA) * pw; }
  function sy(y) { return pad.t + ph - (y - yMin) / (yMax - yMin) * ph; }

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);

  // grid
  ctx.strokeStyle = 'rgba(220,224,234,.9)'; ctx.lineWidth = 1;
  for (let i = 0; i <= 5; i++) {
    const yv = yMin + (yMax - yMin) * i / 5;
    ctx.beginPath(); ctx.moveTo(pad.l, sy(yv)); ctx.lineTo(W - pad.r, sy(yv)); ctx.stroke();
    ctx.fillStyle = '#5c6178'; ctx.font = '10px JetBrains Mono,monospace';
    ctx.fillText(yv.toFixed(2), pad.l - 44, sy(yv) + 4);
  }
  for (let i = 0; i <= 6; i++) {
    const xv = RA + (RB - RA) * i / 6;
    ctx.beginPath(); ctx.moveTo(sx(xv), pad.t); ctx.lineTo(sx(xv), pad.t + ph); ctx.stroke();
    ctx.fillStyle = '#5c6178'; ctx.font = '10px JetBrains Mono,monospace';
    ctx.fillText(xv.toFixed(2), sx(xv) - 11, pad.t + ph + 15);
  }

  // área exacta (fondo sutil)
  ctx.fillStyle = 'rgba(39,199,104,.06)';
  ctx.beginPath(); ctx.moveTo(sx(RA), sy(0));
  for (let i = 0; i <= 400; i++) { const x = RA + (RB-RA)*i/400; ctx.lineTo(sx(x), sy(fn(x))); }
  ctx.lineTo(sx(RB), sy(0)); ctx.closePath(); ctx.fill();

  // rectángulos
  let suma = 0;
  const colores = { left: 'rgba(224,90,58,', right: 'rgba(232,184,75,', mid: 'rgba(39,199,104,', lower: 'rgba(224,90,58,', upper: 'rgba(39,199,104,' };
  for (let i = 0; i < n; i++) {
    const xl = RA + i * dx, xr = xl + dx;
    let h;
    if (rmeth === 'left') h = fn(xl);
    else if (rmeth === 'right') h = fn(xr);
    else if (rmeth === 'mid') h = fn((xl + xr) / 2);
    else if (rmeth === 'lower') {
      h = fn(xl); for (let k = 1; k <= 30; k++) h = Math.min(h, fn(xl + k*dx/30));
    } else {
      h = fn(xl); for (let k = 1; k <= 30; k++) h = Math.max(h, fn(xl + k*dx/30));
    }
    suma += h * dx;
    const top = sy(Math.max(0, h)), rH = Math.abs(sy(0) - sy(h));
    ctx.fillStyle = colores[rmeth] + '0.2)'; ctx.fillRect(sx(xl), top, sx(xr)-sx(xl)-1, rH);
    ctx.strokeStyle = colores[rmeth] + '0.55)'; ctx.lineWidth = 1; ctx.strokeRect(sx(xl), top, sx(xr)-sx(xl)-1, rH);
  }

  // curva
  ctx.strokeStyle = cfg.col; ctx.lineWidth = 2.6;
  ctx.shadowColor = cfg.col; ctx.shadowBlur = 6;
  ctx.beginPath();
  for (let i = 0; i <= 600; i++) { const x = RA + (RB-RA)*i/600; if (i===0) ctx.moveTo(sx(x), sy(fn(x))); else ctx.lineTo(sx(x), sy(fn(x))); }
  ctx.stroke(); ctx.shadowBlur = 0;

  // ejes
  ctx.strokeStyle = '#1b1e27'; ctx.lineWidth = 1.6;
  ctx.beginPath(); ctx.moveTo(pad.l, sy(0)); ctx.lineTo(W - pad.r, sy(0)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(sx(RA), pad.t); ctx.lineTo(sx(RA), pad.t + ph); ctx.stroke();

  ctx.fillStyle = 'rgba(39,199,104,.7)'; ctx.font = '600 11px Inter,sans-serif';
  ctx.fillText(`n = ${n}  ·  ${cfg.lbl}`, pad.l + 6, pad.t + 16);

  const exacto = cfg.exact(RA, RB);
  $('sv-suma').textContent = suma.toFixed(6);
  $('sv-exacto').textContent = exacto.toFixed(6);
  $('sv-error').textContent = Math.abs(suma - exacto).toFixed(7);
  $('sv-rel').textContent = ((Math.abs(suma - exacto) / Math.abs(exacto)) * 100).toFixed(4) + '%';
  $('sv-n').textContent = n;
}

$('fn-sel').addEventListener('change', function() { rfn = this.value; $('fn-lbl').textContent = FUNCIONES[rfn].lbl; dibujarRiemann(); });
$('n-sl').addEventListener('input', function() { rn = +this.value; $('n-lbl').textContent = rn; dibujarRiemann(); });
document.querySelectorAll('[data-m]').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('[data-m]').forEach(b => b.classList.remove('activo'));
    this.classList.add('activo');
    rmeth = this.dataset.m;
    $('info-metodo').innerHTML = INFO_METODO[rmeth];
    dibujarRiemann();
  });
});
dibujarRiemann();

// ── COMPARADOR ────────────────────────────────
let cmpFn = 'x2', cmpN = 60;

const CFUNC = {
  x2:    { fn: x => x*x,                   exact: (a,b) => b**3/3 - a**3/3 },
  sen:   { fn: x => Math.sin(x),            exact: (a,b) => -Math.cos(b)+Math.cos(a) },
  sqrt:  { fn: x => Math.sqrt(Math.max(0,x)),exact:(a,b) => 2/3*(b**1.5-a**1.5) },
  gauss: { fn: x => Math.exp(-x*x),         exact: (a,b) => {
    function erf(x){const t=1/(1+.3275911*x);return 1-t*(.254829592+t*(-.284496736+t*(1.421413741+t*(-1.453152027+t*1.061405429))))*Math.exp(-x*x);}
    return Math.sqrt(Math.PI)/2*(erf(b)-erf(a)); } }
};

function sumaRiemann(fn, a, b, n, met) {
  const dx = (b-a)/n; let s = 0;
  for (let i = 0; i < n; i++) {
    const xl = a+i*dx, xr = xl+dx;
    s += (met==='left' ? fn(xl) : met==='right' ? fn(xr) : fn((xl+xr)/2)) * dx;
  }
  return s;
}

function dibujarComparador() {
  const c = $('canvas-cmp'), ctx = c.getContext('2d');
  const W = c.width, H = c.height;
  const pad = { t: 28, b: 42, l: 68, r: 28 };
  const pw = W - pad.l - pad.r, ph = H - pad.t - pad.b;

  ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);

  const cfg = CFUNC[cmpFn];
  const ex = cfg.exact(RA, RB);
  const ns = Array.from({length: cmpN}, (_, i) => i+1);
  const errs = { left: [], right: [], mid: [] };
  ns.forEach(n => {
    errs.left.push(Math.abs(sumaRiemann(cfg.fn, RA, RB, n, 'left') - ex));
    errs.right.push(Math.abs(sumaRiemann(cfg.fn, RA, RB, n, 'right') - ex));
    errs.mid.push(Math.abs(sumaRiemann(cfg.fn, RA, RB, n, 'mid') - ex));
  });

  const allE = [...errs.left, ...errs.right, ...errs.mid].filter(v => v > 0);
  const eMax = Math.max(...allE) * 1.1;

  function sx(n) { return pad.l + (n-1)/(cmpN-1)*pw; }
  function sy(e) { return pad.t + ph - e/eMax*ph; }

  // grid
  ctx.strokeStyle = 'rgba(220,224,234,.9)'; ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const ev = eMax*i/4;
    ctx.beginPath(); ctx.moveTo(pad.l, sy(ev)); ctx.lineTo(W-pad.r, sy(ev)); ctx.stroke();
    ctx.fillStyle = '#5c6178'; ctx.font = '10px JetBrains Mono';
    ctx.fillText(ev.toFixed(4), pad.l-64, sy(ev)+4);
  }
  for (let i = 0; i <= 5; i++) {
    const nv = Math.round(1 + (cmpN-1)*i/5);
    ctx.beginPath(); ctx.moveTo(sx(nv), pad.t); ctx.lineTo(sx(nv), pad.t+ph); ctx.stroke();
    ctx.fillStyle = '#5c6178'; ctx.font = '10px JetBrains Mono';
    ctx.fillText(nv, sx(nv)-8, pad.t+ph+15);
  }

  const trazar = (arr, col, lw) => {
    ctx.strokeStyle = col; ctx.lineWidth = lw;
    ctx.shadowColor = col; ctx.shadowBlur = 4;
    ctx.beginPath();
    arr.forEach((e, i) => { if(i===0) ctx.moveTo(sx(ns[i]), sy(e)); else ctx.lineTo(sx(ns[i]), sy(e)); });
    ctx.stroke(); ctx.shadowBlur = 0;
  };
  trazar(errs.left, '#e05a3a', 1.7);
  trazar(errs.right, '#e8b84b', 1.7);
  trazar(errs.mid, '#27c768', 2.3);

  

// ==========================================
// 2. PASOS DEL TEOREMA FUNDAMENTAL (TFC)
// ==========================================

const pasos = document.querySelectorAll(".paso");
const btnPaso = document.getElementById("btnPaso");

let pasoActual = 0;

btnPaso.addEventListener("click", () => {

    if (pasoActual < pasos.length) {

        pasos[pasoActual].style.display = "block";
        pasoActual++;

        if (pasoActual === pasos.length) {
            btnPaso.textContent = "Reiniciar pasos";
        }

    } else {

        pasos.forEach(p => {
            p.style.display = "none";
        });

        pasoActual = 0;
        btnPaso.textContent = "Mostrar siguiente paso";
    }

});


// ==========================================
// 3. VALIDACIÓN DEL EJERCICIO INTERACTIVO
// ==========================================
const verificar = document.getElementById("verificar");
const respuestaInput = document.getElementById("respuesta");
const resultadoMsg = document.getElementById("resultado");

verificar.addEventListener("click", () => {
    let r = respuestaInput.value.toLowerCase().replace(/\s+/g, ''); // Normaliza quitando espacios

    if (r.includes("x^3/3") || r.includes("x³/3") || r.includes("x3/3")) {
        resultadoMsg.textContent = "✅ ¡Correcto! Has encontrado la familia de antiderivadas.";
        resultadoMsg.style.color = "green";
    } else {
        resultadoMsg.textContent = "❌ Respuesta incorrecta. Intenta estructurar tu solución como x³/3 + C";
        resultadoMsg.style.color = "crimson";
    }
});

verificar.addEventListener("click", () => {
    let r = respuestaInput.value.toLowerCase().replace(/\s+/g, ''); // Normaliza quitando espacios

    if (r.includes("x^4/4") || r.includes("x⁴/4") || r.includes("x4/4")) {
        resultadoMsg.textContent = "✅ ¡Correcto! Has encontrado la familia de antiderivadas.";
        resultadoMsg.style.color = "green";
    } else {
        resultadoMsg.textContent = "❌ Respuesta incorrecta. Intenta estructurar tu solución como x⁴/4 + C";
        resultadoMsg.style.color = "crimson";
    }
});

verificar.addEventListener("click", () => {
    let r = respuestaInput.value.toLowerCase().replace(/\s+/g, ''); // Normaliza quitando espacios

    if (r.includes("x^7/7") || r.includes("x⁷/7") || r.includes("x7/7")) {
        resultadoMsg.textContent = "✅ ¡Correcto! Has encontrado la familia de antiderivadas.";
        resultadoMsg.style.color = "green";
    } else {
        resultadoMsg.textContent = "❌ Respuesta incorrecta. Intenta estructurar tu solución como x⁷/7 + C";
        resultadoMsg.style.color = "crimson";
    }
});

// ==========================================
// 4. GENERACIÓN DINÁMICA DEL QUIZ
// ==========================================
const CuestionarioData = [
    {
        pregunta: "¿Qué representa una integral indefinida?",
        opciones: ["Una derivada", "Una familia de antiderivadas", "Un límite de sumas"],
        correcta: 1
    },
    {
        pregunta: "¿Cuál es la integral de la función constante f(x) = x²?",
        opciones: ["x³/3 + C", "2x + C", "x² + C"],
        correcta: 0
    },
    {
        pregunta: "¿Cuál es el propósito original de construir las Sumas de Riemann?",
        opciones: ["Aproximar analíticamente áreas bajo curvas", "Calcular derivadas implícitas", "Resolver sistemas lineales"],
        correcta: 0
    },
    {
        pregunta: "¿Qué conexión establece el Teorema Fundamental del Cálculo?",
        opciones: ["Matrices algebraicas y vectores", "La correspondencia inversa entre derivadas e integrales", "Series numéricas e infinitas"],
        correcta: 1
    }
];

let totalScore = 0;
const preguntasDiv = document.getElementById("preguntas");
const scoreSpan = document.getElementById("score");

cuestionarioData.forEach((q, index) => {
    let preguntaContenedor = document.createElement("div");
    preguntaContenedor.classList.add("pregunta");

    let titulo = document.createElement("h4");
    titulo.textContent = `${index + 1}. ${q.pregunta}`;
    preguntaContenedor.appendChild(titulo);

    q.opciones.forEach((op, i) => {
        let btnOpcion = document.createElement("button");
        btnOpcion.textContent = op;
        btnOpcion.classList.add("opcion");

        btnOpcion.addEventListener("click", () => {
            // Deshabilitar todos los botones de este bloque de pregunta al responder
            if (btnOpcion.disabled) return;

            if (i === q.correcta) {
                btnOpcion.style.background = "#2D6A4F"; // Éxito verde
                btnOpcion.style.color = "white";
                totalScore++;
                scoreSpan.textContent = totalScore;
            } else {
                btnOpcion.style.background = "#A30000"; // Fallo carmín
                btnOpcion.style.color = "white";
                
                // Resaltar visualmente la correcta para ayudar al aprendizaje
                let todosLosBotones = preguntaContenedor.querySelectorAll("button");
                todosLosBotones[q.correcta].style.border = "3px solid #2D6A4F";
            }

            // Congelar opciones
            let botonesParaBloquear = preguntaContenedor.querySelectorAll("button");
            botonesParaBloquear.forEach(b => b.disabled = true);
        });

        preguntaContenedor.appendChild(btnOpcion);
    });

    preguntasDiv.appendChild(preguntaContenedor);

     });
