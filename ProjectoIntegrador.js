var preguntas;
var indicePreguntaActual = 0;
var puntuacion = 0;
var vidas = 3;
let nombre;

function cargarPreguntas() {
  // Utilizar fetch para cargar el archivo JSON
  fetch('preguntas_y_respuestas.json')
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
  opcionesAleatorias.forEach(function(opcion, index) {
    opcionesHTML += `
      <li>
        <button onclick="responderTrivia()" value="${opcion}">${opcion}</button>
      </li>`;
  });
  document.getElementById('options').innerHTML = opcionesHTML;
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

  document.getElementById('form-container').style.display = 'none';
  document.getElementById('trivia-container').style.display = 'block';

  cargarPregunta(indicePreguntaActual);
}

function responderTrivia() {
  // Lógica para verificar la respuesta y mostrar el resultado
  var respuestasCorrectas = preguntas[indicePreguntaActual].respuesta_correcta;
  var opcionesSeleccionadas = obtenerRespuestasUsuario();

  // Verificar si las respuestas seleccionadas son correctas
  var respuestaCorrecta = respuestasCorrectas.every(opcion =>
    opcionesSeleccionadas.includes(opcion)
  );

  var respuestaContainer = document.getElementById('respuesta');

  if (respuestaCorrecta) {
    respuestaContainer.innerText = '¡Respuesta correcta!';
    // Aumentar la puntuación
    puntuacion += 10;
  } else {
    respuestaContainer.innerText = 'Respuesta incorrecta. La respuesta correcta es: ' + respuestasCorrectas.join(', ');
    // Reducir las vidas
    vidas--;
  }

  actualizarInfoJuego();

  // Verificar si quedan más preguntas
  if (indicePreguntaActual < preguntas.length - 1) {
    // Cargar la siguiente pregunta
    indicePreguntaActual++;
    cargarPregunta(indicePreguntaActual);
  } else {
    // Fin del juego
    mostrarResultadoFinal();
    // Recargar la página para reiniciar el juego
    window.location.reload();
  }
}


function obtenerRespuestasUsuario() {
  var opciones = document.querySelectorAll('#options button');
  return Array.from(opciones).map(opcion => opcion.innerText);
}

function actualizarInfoJuego() {
  // Actualizar la puntuación y vidas en pantalla
  document.getElementById('puntuacion').innerText = puntuacion;
  document.getElementById('vidas').innerText = vidas;

  // Verificar si el jugador ha perdido todas las vidas
  if (vidas <= 0) {
    mostrarResultadoFinal();
  }
}

function mostrarResultadoFinal() {
  // Lógica para mostrar el resultado final, puedes mostrar un mensaje,
  // lanzar un alert, o cualquier otra acción que desees.
  alert(`¡Juego terminado!\nJugador ${nombre} ha obtenido una puntuación de: ${puntuacion}`);
  reiniciarJuego();
  // Recargar la página para reiniciar el juego
  window.location.reload();
}

function reiniciarJuego() {
  indicePreguntaActual = 0;
  puntuacion = 0;
  vidas = 3;
  cargarPreguntas();
  actualizarInfoJuego();
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
