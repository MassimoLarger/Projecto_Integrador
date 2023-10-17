var preguntas;
var indicePreguntaActual = 0;
var puntuacion = 0;
var vidas = 5; // Ahora se establece en 5 vidas
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
  respuestaCorrectaActual = preguntaActual.respuesta_correcta; // Guardar la respuesta correcta actual
  opcionesAleatorias.forEach(function (opcion, index) {
    opcionesHTML += `
      <li>
        <button onclick="responderTrivia(this)" data-es-correcta="${respuestaCorrectaActual.includes(opcion)}">${opcion}</button>
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

function responderTrivia(botonSeleccionado) {
  // Remover la clase 'seleccionado' de todos los botones
  var botones = document.querySelectorAll('#options button');
  botones.forEach(function (boton) {
    boton.classList.remove('seleccionado');
  });

  // Agregar la clase 'seleccionado' al botón seleccionado
  botonSeleccionado.classList.add('seleccionado');

  // Extraer la respuesta correcta del atributo data
  var esCorrecta = botonSeleccionado.getAttribute('data-es-correcta') === 'true';

  // Obtener la respuesta correcta guardada previamente
  var respuestaCorrecta = respuestaCorrectaActual[0]; // Solo necesitamos la primera respuesta correcta
  
  // Obtener la opción seleccionada después de hacer clic en un botón
  var opcionSeleccionada = botonSeleccionado.innerText;

  // Verificar si el jugador ha seleccionado una respuesta
  if (opcionSeleccionada !== null) {
    var respuestaContainer = document.getElementById('respuesta');

    if (esCorrecta) {
      respuestaContainer.innerText = '¡Respuesta correcta!';
      puntuacion += 10;
    } else {
      respuestaContainer.innerText = 'Respuesta incorrecta. La respuesta correcta es: ' + respuestaCorrecta;
      vidas--;
    }

    actualizarInfoJuego();

    // Cargar la siguiente pregunta después de un breve retraso
    setTimeout(function () {
      // Verificar si quedan más preguntas
      if (indicePreguntaActual < preguntas.length - 1) {
        // Cargar la siguiente pregunta
        indicePreguntaActual++;
        cargarPregunta(indicePreguntaActual);
      } else {
        // Fin del juego
        mostrarResultadoFinal();
      }
    }, 1000);  // Esperar 1 segundo (1000 milisegundos) antes de cargar la siguiente pregunta
  }
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
  vidas = 5; // Reiniciar las vidas a 5
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