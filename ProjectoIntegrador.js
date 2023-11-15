var preguntas;
var indicePreguntaActual = 0;
var puntuacion = 0;
var vidas = 5; // Ahora se establece en 5 vidas
let nombre;
let timeLeft = 15;  // Tiempo inicial
let timerInterval;
let timerElement = document.getElementById('timer');
var juegoFinalizado = false;

function cargarPreguntas() {
  let categoria= localStorage.getItem('categoria');
  
  // Construir la URL basada en la categoría seleccionada
  let url = `${categoria}.json`;

  // Utilizar fetch para cargar el archivo JSON
  fetch(url)
      .then(response => response.json())
      .then(data => {
          preguntas = shuffleArray(data);
          iniciarJuego();  // Llamamos a iniciarJuego después de cargar las preguntas
      })
      .catch(error => {
          console.error('Error al cargar el archivo JSON:', error);
      });
}

function cargarPregunta(indicePregunta) {
  // Lógica para cargar la pregunta y opciones en el HTML
  var preguntaActual = preguntas[indicePregunta];
  document.getElementById('question').innerText = preguntaActual.pregunta;

  // Aleatorizar el orden de las opciones
  var opcionesAleatorias = shuffleArray([...preguntaActual.opciones]);
  var opcionesHTML = '';
  respuestaCorrectaActual = preguntaActual.respuesta_correcta; // Guardar la respuesta correcta actual
  opcionesAleatorias.forEach(function (opcion, index) {
    // Asigna clases específicas a los botones (por ejemplo, button1, button2, etc.)
    var buttonClass = 'button' + (index + 1);
    opcionesHTML += `
    <li>
      <button class="${buttonClass}" onclick="responderTrivia(this)" data-es-correcta="${respuestaCorrectaActual.includes(opcion)}">
      ${opcion}</button>
    </li>`;
  });
  document.getElementById('options').innerHTML = opcionesHTML;
  
  // Aquí inicia el código del temporizador
  if (timerInterval) {
      clearInterval(timerInterval);
      timeLeft = 15;  // Reiniciar el tiempo a 15 segundos
  }
    timerElement.textContent = timeLeft;
    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  if (juegoFinalizado) {
    clearInterval(timerInterval);
    return;
  }

  timeLeft -= 1;
  timerElement.textContent = timeLeft;

  if (timeLeft <= 0) {
    clearInterval(timerInterval);
    responderTrivia(false);  // Tratar la respuesta como incorrecta si se agota el tiempo
  }
}

// Función para aleatorizar un arreglo utilizando el algoritmo de Fisher-Yates
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function iniciarJuego() {
  // Movemos la obtención del nombre aquí
  nombre = document.getElementById('name').value;
  if (isFinite(nombre)) {
    alert('Por favor, ingrese un nombre válido.');
  } else {
  document.getElementById('form-container').style.display = 'none';
  document.getElementById('trivia-container').style.display = 'block';

  cargarPregunta(indicePreguntaActual);
  }
}

function responderTrivia(botonSeleccionado) {
  // Obtener todos los botones
  var botones = document.querySelectorAll('#options button');

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
        botonSeleccionado.style.backgroundColor = '#009929'; // Color verde para respuesta correcta
      } else if (esRespuestaIncorrecta) {
        botonSeleccionado.style.backgroundColor = '#FF0000'; // Color rojo para respuesta incorrecta

        // Después de 1 segundo, cambiar el color del botón con la respuesta correcta a verde
        setTimeout(function () {
          botones.forEach(function (boton) {
            var esRespuestaCorrecta = respuestaCorrecta.includes(boton.innerText);
            if (esRespuestaCorrecta) {
              boton.style.backgroundColor = '#009929'; // Color verde para respuesta correcta
            }
          });
        }, 1000);
      }
    });
  }

  // Si el tiempo se agotó, cambiar el color de la respuesta correcta a amarillo
  if (timeLeft <= 0) {
    botones.forEach(function (boton) {
      var esRespuestaCorrecta = respuestaCorrecta.includes(boton.innerText);
      if (esRespuestaCorrecta) {
        boton.style.backgroundColor = '#ffb600'; // Color amarillo para respuesta correcta cuando se agota el tiempo
      }
    });
  }

  // Actualizar la puntuación y vidas
  if (botonSeleccionado && botonSeleccionado.getAttribute('data-es-correcta') === 'true') {
    puntuacion += 100;
  } else {
    vidas--;
  }

  actualizarInfoJuego();

  // Cargar la siguiente pregunta después de un breve retraso
  setTimeout(function () {
    // Restablecer los colores y habilitar los botones para la siguiente pregunta
    botones.forEach(function (boton) {
      boton.style.backgroundColor = '';
      boton.disabled = false;
    });

    // Verificar si quedan más preguntas
    if (indicePreguntaActual < preguntas.length - 1) {
      // Cargar la siguiente pregunta
      indicePreguntaActual++;
      cargarPregunta(indicePreguntaActual);
    } else {
      // Pausa de 2 segundo antes de mostrar el resultado final
      setTimeout(function () {
        // Fin del juego
        mostrarResultadoFinal();
      }, 3000);
    }
  }, 3000);  // Esperar 2 segundo (2000 milisegundos) antes de cargar la siguiente pregunta

  // Detener el temporizador cuando el jugador responda
  clearInterval(timerInterval);
}

function actualizarInfoJuego() {
  // Actualizar la puntuación y vidas en pantalla
  document.getElementById('puntuacion').innerText = puntuacion;
  document.getElementById('vidas').innerText = vidas;

  // Verificar si el jugador ha perdido todas las vidas
  if (vidas <= 0) {
    setTimeout(function () {
      // Fin del juego
      mostrarResultadoFinal();
    }, 2000);
  }
}

function mostrarResultadoFinal() {
  juegoFinalizado = true;  // Establecer que el juego ha finalizado
  clearInterval(timerInterval); // Añade esta línea para detener el temporizador

  // Ocultar contenedor de información de juego
  document.getElementById('info-container').style.display = 'none';

  // Ocultar contenedor de juego
  document.getElementById('trivia-container').style.display = 'none';

  // Mostrar contenedor de fin de juego
  document.getElementById('fin-juego').style.display = 'block';

  // Mostrar información del jugador
  document.getElementById('nombreResultado').innerText = nombre;
  document.getElementById('puntuacionResultado').innerText = puntuacion;
  document.getElementById('vidasResultado').innerText = vidas;

 // Obtener el cuerpo de la tabla
  const tbody = document.querySelector('.bienvenida-MBp .table tbody');

  // Crear una nueva fila para el jugador actual
  const newRow = tbody.insertRow();
  const cellNombre = newRow.insertCell(0);
  const cellPuntuacion = newRow.insertCell(1);
  const cellVidas = newRow.insertCell(2);

  // Asignar los valores del jugador a las celdas
  cellNombre.innerHTML = nombre;
  cellPuntuacion.innerHTML = puntuacion;
  cellVidas.innerHTML = vidas;

  // Obtener todas las filas existentes en la tabla
  const rows = Array.from(tbody.querySelectorAll('tr'));

  // Añadir la nueva fila a las filas existentes
  rows.push(newRow);

  // Ordenar las filas por puntuación y vidas en orden descendente
  rows.sort((a, b) => {
      const puntuacionA = parseInt(a.cells[1].innerHTML);
      const puntuacionB = parseInt(b.cells[1].innerHTML);
      const vidasA = parseInt(a.cells[2].innerHTML);
      const vidasB = parseInt(b.cells[2].innerHTML);

      // Ordenar por puntuación en orden descendente
      if (puntuacionA !== puntuacionB) {
          return puntuacionB - puntuacionA;
      }

      // Si las puntuaciones son iguales, ordenar por vidas en orden descendente
      return vidasB - vidasA;
  });

  // Limpiar el contenido actual de la tabla
  tbody.innerHTML = '';

  // Recorrer las filas ordenadas y añadir las primeras 10 a la tabla
  rows.slice(0, 10).forEach(row => tbody.appendChild(row));
}