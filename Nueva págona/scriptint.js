// ==========================================
// 1. SIMULACIÓN DE SUMAS DE RIEMANN
// ==========================================
const canvas = document.getElementById("riemannCanvas");
const ctx = canvas.getContext("2d");

// Dimensiones de resolución interna fijas para el dibujo
canvas.width = 900;
canvas.height = 400;

const slider = document.getElementById("nSlider");
const nValue = document.getElementById("nValue");
const areaAprox = document.getElementById("areaAprox");
const errorText = document.getElementById("error");

// Función bajo estudio f(x) = x²
function f(x) {
    return x * x;
}

// Valor analítico exacto de la integral de x² desde 0 hasta 3: [x³/3] = 27/3 = 9
const areaReal = 9;

function dibujarRiemann(n) {
    // Limpiar el lienzo
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar Ejes Coordenados
    ctx.strokeStyle = "#333333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Eje X
    ctx.moveTo(50, 350);
    ctx.lineTo(850, 350);
    // Eje Y
    ctx.moveTo(50, 350);
    ctx.lineTo(50, 50);
    ctx.stroke();

    // Dibujar Curva f(x) = x² continuo
    ctx.strokeStyle = "#2D6A4F";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let x = 0; x <= 3; x += 0.01) {
        let px = 50 + x * 250;       // Escalamiento horizontal
        let py = 350 - f(x) * 30;    // Escalamiento vertical (f(3)=9 -> 9*30 = 270px)

        if (x === 0) {
            ctx.moveTo(px, py);
        } else {
            ctx.lineTo(px, py);
        }
    }
    ctx.stroke();

    // Dibujar Sumatoria de Rectángulos (Extremo Izquierdo)
    let dx = 3 / n;
    let suma = 0;

    ctx.fillStyle = "rgba(45, 106, 79, 0.35)";
    ctx.strokeStyle = "rgba(45, 106, 79, 0.7)";
    ctx.lineWidth = 1;

    for (let i = 0; i < n; i++) {
        let x = i * dx;
        let altura = f(x);
        suma += altura * dx;

        let px = 50 + x * 250;
        let py = 350 - altura * 30;
        let anchoAncho = dx * 250;
        let altoAlto = altura * 30;

        ctx.fillRect(px, py, anchoAncho, altoAlto);
        ctx.strokeRect(px, py, anchoAncho, altoAlto);
    }

    // Actualizar paneles informativos
    areaAprox.textContent = suma.toFixed(4);
    let err = Math.abs(areaReal - suma);
    errorText.textContent = err.toFixed(4);
}

// Vinculación dinámica al slider
slider.addEventListener("input", () => {
    let n = parseInt(slider.value);
    nValue.textContent = n;
    dibujarRiemann(n);
});

// Inicialización por defecto
dibujarRiemann(10);


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
        if(pasoActual === pasos.length){
            btnPaso.textContent = "Reiniciar Pasos";
        }
    } else {
        pasoActual = 0;
        pasos.forEach(p => {
            p.style.display = "none";
        });
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


// ==========================================
// 4. GENERACIÓN DINÁMICA DEL QUIZ
// ==========================================
const quizData = [
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

quizData.forEach((q, index) => {
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