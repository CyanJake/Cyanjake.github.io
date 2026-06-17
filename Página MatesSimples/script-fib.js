/* sucesiones */
let posicion = 1;  
let valorActual = 2; 


const botonAgregar = document.getElementById('btn-agregar');
const botonReiniciar = document.getElementById('btn-reiniciar');
const listaContenedor = document.getElementById('lista-interactiva');


function agregarInvitado() {
    
    if (posicion > 10) {
        alert("¡La zona VIP está llena! Puedes reiniciar la lista si lo deseas.");
        return;
    }

    const textoElemento = `<li><strong>Invitado ${posicion}:</strong> Tiene el pase número ${valorActual}</li>`;
    
    listaContenedor.innerHTML += textoElemento;

    posicion = posicion + 1;       
    valorActual = valorActual + 2; 
}


function reiniciarLista() {
    listaContenedor.innerHTML = ""; 
    posicion = 1;                   
    valorActual = 2;                
}

botonAgregar.addEventListener('click', agregarInvitado);
botonReiniciar.addEventListener('click', reiniciarLista);

/* series */


let dia = 1;             
let depositoDiario = 5;  
let totalAcumulado = 0;  


const botonAhorrar = document.getElementById('btn-ahorrar');
const botonVaciar = document.getElementById('btn-vaciar');
const txtTotalSerie = document.getElementById('total-serie');
const historialContenedor = document.getElementById('historial-ahorro');


function registrarDiaAhorro() {
    if (dia > 10) {
        alert("¡Reto de 10 días completado! Puedes vaciar la alcancía para reiniciar.");
        return;
    }

    
    let totalAnterior = totalAcumulado;
    
    totalAcumulado = totalAcumulado + depositoDiario;
    
    txtTotalSerie.innerText = `$${totalAcumulado}`;

    const lineaHistorial = `<li><strong>Día ${dia}:</strong> Metes $${depositoDiario} ➜ Operación: ${totalAnterior} + ${depositoDiario} = <strong>$${totalAcumulado}</strong></li>`;
    
    historialContenedor.innerHTML = lineaHistorial + historialContenedor.innerHTML;

    dia = dia + 1;
    depositoDiario = depositoDiario + 5;
}

function reiniciarAlcancria() {
    dia = 1;
    depositoDiario = 5;
    totalAcumulado = 0;
    txtTotalSerie.innerText = "$0";
    historialContenedor.innerHTML = "";
}

botonAhorrar.addEventListener('click', registrarDiaAhorro);
botonVaciar.addEventListener('click', reiniciarAlcancria);

/* fibonacci */

// --- INTERACCIÓN 1: GENERADOR DE NÚMEROS ---
let miListaFibonacci = [0, 1];

const btnFiboSiguiente = document.getElementById('btn-fibo-siguiente');
const btnFiboReiniciar = document.getElementById('btn-fibo-reiniciar');
const txtSecuencia = document.getElementById('texto-secuencia');

btnFiboSiguiente.addEventListener('click', function() {
    if (miListaFibonacci.length >= 15) {
        alert("¡Ya generamos 15 términos! Presiona reiniciar si deseas empezar de nuevo.");
        return;
    }

    let posicionUltimo = miListaFibonacci.length - 1;
    let ultimoNumero = miListaFibonacci[posicionUltimo];
    let penultimoNumero = miListaFibonacci[posicionUltimo - 1];

    let nuevoNumero = ultimoNumero + penultimoNumero;

    miListaFibonacci.push(nuevoNumero);

    txtSecuencia.innerText = miListaFibonacci.join(', ');
});

btnFiboReiniciar.addEventListener('click', function() {
    miListaFibonacci = [0, 1];
    txtSecuencia.innerText = "0, 1";
});


// --- INTERACCIÓN 2: EXPLICADOR DE RECURSIVIDAD ---
const btnAnalizar = document.getElementById('btn-analizar');
const selectTermino = document.getElementById('select-termino');
const txtResultadoRec = document.getElementById('resultado-recursivo');

btnAnalizar.addEventListener('click', function() {
    let valorSeleccionado = parseInt(selectTermino.value);
    
    let terminoMenos1 = valorSeleccionado - 1;
    let terminoMenos2 = valorSeleccionado - 2;

    
    txtResultadoRec.innerHTML = "Para calcular <strong>F(" + valorSeleccionado + ")</strong> necesitas resolver primero:<br>" +
                                "➜ F(" + terminoMenos1 + ") + F(" + terminoMenos2 + ")<br><br>" +
                                "<span style='color:#dc3545;'>¡Cada función depende de llamar a sus dos anteriores!</span>";
});


// --- INTERACCIÓN 3: ATRACO A LA PROPORCIÓN ÁUREA ---

let numerosFiboSueltos = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
let indiceAurea = 2;

const btnDividirAurea = document.getElementById('btn-dividir-aurea');
const btnAureaReiniciar = document.getElementById('btn-aurea-reiniciar');
const listaDivisiones = document.getElementById('lista-divisiones');

btnDividirAurea.addEventListener('click', function() {
    if (indiceAurea >= numerosFiboSueltos.length) {
        alert("¡Has completado las demostraciones! Mira cómo todos los resultados se estancan cerca de 1.618.");
        return;
    }

    let numeroDeArriba = numerosFiboSueltos[indiceAurea];
    let numeroDeAbajo = numerosFiboSueltos[indiceAurea - 1];
    
    let resultadoDivision = (numeroDeArriba / numeroDeAbajo).toFixed(4);

    let nuevaLinea = "<li>División: <strong>" + numeroDeArriba + " ÷ " + numeroDeAbajo + "</strong> = <span style='color:#28a745; font-weight:bold;'>" + resultadoDivision + "</span></li>";
    
    listaDivisiones.innerHTML = listaDivisiones.innerHTML + nuevaLinea;

    indiceAurea = indiceAurea + 1;
});

btnAureaReiniciar.addEventListener('click', function() {
    listaDivisiones.innerHTML = "";
    indiceAurea = 2;
});