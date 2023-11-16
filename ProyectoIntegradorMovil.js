var preguntas_movil;
var indicePreguntaActual_movil = 0;
var puntuacion_movil = 0;
var vidas_movil = 5; // Ahora se establece en 5 vidas
let nombre_movil;
let timeLeft_movil = 15; // Tiempo inicial
let timerInterval_movil;
let timerElement_movil = document.getElementById('timer-movil');
var juegoFinalizado_movil = false;

function cargarPreguntasMovil() {
  let categoria_movil = localStorage.getItem('categoria-movil');

  // Construir la URL basada en la categoría seleccionada
  let url = `${categoria_movil}.json`;

  // Obtener el elemento que quieres cambiar de color
  let bloqueMovil = document.querySelector('.bienvenida-Movil .block');

  // Cambiar el color del bloque según la categoría
  switch (categoria_movil) {
    case 'preguntas_artes':
      bloqueMovil.style.backgroundColor = '#e93325';
      break;
    case 'preguntas_ciencias':
      bloqueMovil.style.backgroundColor = '#12c648';
      break;         
    case 'preguntas_deportes':
      bloqueMovil.style.backgroundColor = '#ff8c00';
      break;       
    case 'preguntas_entretenimiento':
      bloqueMovil.style.backgroundColor = '#19c1eb';
      break;
    case 'preguntas_geografia':
      bloqueMovil.style.backgroundColor = '#2170c2'; 
      break;    
    case 'preguntas_historia':
      bloqueMovil.style.backgroundColor = '#7e4b45';
      break;  
    case 'preguntas_y_respuestas':
      bloqueMovil.style.backgroundColor = '#ffe000';
      break;
  }

  // Utilizar fetch para cargar el archivo JSON
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      preguntas_movil = shuffleArrayMovil(data);
      iniciarJuegoMovil(); // Llamamos a iniciarJuego después de cargar las preguntas
    })
    .catch((error) => {
      console.error('Error al cargar el archivo JSON:', error);
    });
}

function cargarPreguntaMovil(indicePregunta) {
  // Lógica para cargar la pregunta y opciones en el HTML
  var preguntaActual = preguntas_movil[indicePregunta];
  document.getElementById('question-movil').innerText = preguntaActual.pregunta;

  // Aleatorizar el orden de las opciones
  var opcionesAleatorias = shuffleArrayMovil([...preguntaActual.opciones]);
  var opcionesmovilHTML = '';
  respuestaCorrectaActual = preguntaActual.respuesta_correcta; // Guardar la respuesta correcta actual
  opcionesAleatorias.forEach(function (opcion, index) {
    // Asigna clases específicas a los botones (por ejemplo, button1, button2, etc.)
    var buttonmovilClass = 'button-movil' + (index + 1);
    opcionesmovilHTML += `
    <li>
      <button class="${buttonmovilClass}" onclick="responderTriviaMovil(this)" data-es-correcta="${respuestaCorrectaActual.includes(opcion)}">
      ${opcion}</button>
    </li>`;
  });
  document.getElementById('options-movil').innerHTML = opcionesmovilHTML;

  // Aquí inicia el código del temporizador
  if (timerInterval_movil) {
    clearInterval(timerInterval_movil);
    timeLeft_movil = 15; // Reiniciar el tiempo a 15 segundos
  }
  timerElement_movil.textContent = timeLeft_movil;
  timerInterval_movil = setInterval(updateTimerMovil, 1000);
}

function updateTimerMovil() {
  if (juegoFinalizado_movil) {
    clearInterval(timerInterval_movil);
    return;
  }

  timeLeft_movil -= 1;
  timerElement_movil.textContent = timeLeft_movil;

  if (timeLeft_movil <= 0) {
    clearInterval(timerInterval_movil);
    responderTriviaMovil(false); // Tratar la respuesta como incorrecta si se agota el tiempo
  }
}

// Función para aleatorizar un arreglo utilizando el algoritmo de Fisher-Yates
function shuffleArrayMovil(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function iniciarJuegoMovil() {
  // Movemos la obtención del nombre aquí
  nombre_movil = document.getElementById('name-movil').value;
  if (!isNaN(nombre_movil) || nombre_movil.trim() === '') {
    alert('Por favor, ingrese un nombre válido.');
  } else {
    document.getElementById('Inicio-movil').style.display = 'none';
    document.getElementById('trivia-container-movil').style.display = 'block';

    cargarPreguntaMovil(indicePreguntaActual_movil);
  }
}

function responderTriviaMovil(botonSeleccionado) {
  // Obtener todos los botones
  var botones = document.querySelectorAll('#options-movil button');

  // Deshabilitar todos los botones después de la respuesta
  botones.forEach(function (boton) {
    boton.disabled = true;
  });

  // Obtener la respuesta correcta guardada previamente
  var respuestaCorrecta = respuestaCorrectaActual[0];

  // Verificar si la respuesta es correcta o incorrecta y asignar colores
  if (botonSeleccionado) {
    var esRespuestaCorrecta = respuestaCorrecta.includes(botonSeleccionado.innerText);

    botones.forEach(function (boton) {
      var esRespuestaIncorrecta = respuestaCorrecta.includes(boton.innerText);

      if (esRespuestaCorrecta) {
        botonSeleccionado.style.backgroundColor = '#8BC34B'; // Color verde para respuesta correcta
      } else if (esRespuestaIncorrecta) {
        botonSeleccionado.style.backgroundColor = '#FF0000'; // Color rojo para respuesta incorrecta

        // Después de 1 segundo, cambiar el color del botón con la respuesta correcta a verde
        setTimeoutMovil(function () {
          botones.forEach(function (boton) {
            var esRespuestaCorrecta = respuestaCorrecta.includes(boton.innerText);
            if (esRespuestaCorrecta) {
              boton.style.backgroundColor = '#8BC34B'; // Color verde para respuesta correcta
            }
          });
        }, 1000);
      }
    });
  }

  // Si el tiempo se agotó, cambiar el color de la respuesta correcta a amarillo
  if (timeLeft_movil <= 0) {
    botones.forEach(function (boton) {
      var esRespuestaCorrecta = respuestaCorrecta.includes(boton.innerText);
      if (esRespuestaCorrecta) {
        boton.style.backgroundColor = '#ffb600'; // Color amarillo para respuesta correcta cuando se agota el tiempo
      }
    });
  }

  // Actualizar la puntuación y vidas
  if (botonSeleccionado && botonSeleccionado.getAttribute('data-es-correcta') === 'true') {
    puntuacion_movil += 100;
  } else {
    vidas_movil--;
  }

  actualizarInfoJuegoMovil();

  // Cargar la siguiente pregunta después de un breve retraso
  setTimeoutMovil(function () {
    // Restablecer los colores y habilitar los botones para la siguiente pregunta
    botones.forEach(function (boton) {
      boton.style.backgroundColor = '';
      boton.disabled = false;
    });

    // Verificar si quedan más preguntas
    if (indicePreguntaActual_movil < preguntas_movil.length - 1) {
      // Cargar la siguiente pregunta
      indicePreguntaActual_movil++;
      cargarPreguntaMovil(indicePreguntaActual_movil);
    } else {
      // Pausa de 2 segundo antes de mostrar el resultado final
      setTimeoutMovil(function () {
        // Fin del juego
        mostrarResultadoFinalMovil();
      }, 3000);
    }
  }, 3000); // Esperar 2 segundo (2000 milisegundos) antes de cargar la siguiente pregunta

  // Detener el temporizador cuando el jugador responda
  clearInterval(timerInterval_movil);
}

function actualizarInfoJuegoMovil() {
  // Actualizar la puntuación y vidas en pantalla
  document.getElementById('puntuacion-movil').innerText = puntuacion_movil;
  document.getElementById('vidas-movil').innerText = vidas_movil;

  // Verificar si el jugador ha perdido todas las vidas
  if (vidas_movil <= 0) {
    setTimeoutMovil(function () {
      // Fin del juego
      mostrarResultadoFinalMovil();
    }, 2000);
  }
}

function mostrarResultadoFinalMovil() {
  juegoFinalizado_movil = true; // Establecer que el juego ha finalizado
  clearInterval(timerInterval_movil); // Añade esta línea para detener el temporizador

  // Ocultar contenedor de juego
  document.getElementById('trivia-container-movil').style.display = 'none';

  // Mostrar contenedor de fin de juego
  document.getElementById('fin-juego-movil').style.display = 'block';

  // Mostrar información del jugador
  document.getElementById('nombreResultado-movil').innerText = nombre_movil;
  document.getElementById('puntuacionResultado-movil').innerText = puntuacion_movil;
  document.getElementById('vidasResultado-movil').innerText = vidas_movil;

  // Obtener el cuerpo de la tabla
  const tbody = document.querySelector('.bienvenida-Movil .table tbody');

  // Crear una nueva fila para el jugador actual
  const newRow = tbody.insertRow();
  const cellNombre = newRow.insertCell(0);
  const cellPuntuacion = newRow.insertCell(1);
  const cellVidas = newRow.insertCell(2);

  // Asignar los valores del jugador a las celdas
  cellNombre.innerHTML = nombre_movil;
  cellPuntuacion.innerHTML = puntuacion_movil;
  cellVidas.innerHTML = vidas_movil;

  // Obtener todas las filas existentes en la tabla
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // Añadir la nueva fila a las filas existentes
  rows.push(newRow);

  // Ordenar las filas por puntuación y vidas en orden descendente
  rows.sort((a, b) => {
    const puntuacion_movilA = parseInt(a.cells[1].innerHTML);
    const puntuacion_movilB = parseInt(b.cells[1].innerHTML);
    const vidas_movilA = parseInt(a.cells[2].innerHTML);
    const vidas_movilB = parseInt(b.cells[2].innerHTML);

    // Ordenar por puntuación en orden descendente
    if (puntuacion_movilA !== puntuacion_movilB) {
      return puntuacion_movilB - puntuacion_movilA;
    }

    // Si las puntuaciones son iguales, ordenar por vidas en orden descendente
    return vidas_movilB - vidas_movilA;
  });

  // Limpiar el contenido actual de la tabla
  tbody.innerHTML = '';

  // Recorrer las filas ordenadas y añadir las primeras 10 a la tabla
  rows.slice(0, 10).forEach((row) => tbody.appendChild(row));
}

function setTimeoutMovil(callback, tiempo) {
  // Utiliza setTimeout y clearInterval para manejar el retraso
  var tempTimer = setInterval(function () {
    clearInterval(tempTimer);
    callback();
  }, tiempo);
}