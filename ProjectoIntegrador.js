var preguntas;
var indicePreguntaActual = 0;
var puntuacion = 0;
var vidas = 5; // Ahora se establece en 5 vidas
let nombre;

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
        <button class="${buttonClass}" onclick="responderTrivia(this)" data-es-correcta="${respuestaCorrectaActual.includes(opcion)}">${opcion}</button>
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
  if (isFinite(nombre)) {
    alert('Por favor, ingrese un nombre válido.');
  } else {
  document.getElementById('form-container').style.display = 'none';
  document.getElementById('trivia-container').style.display = 'block';

  cargarPregunta(indicePreguntaActual);
  }
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
    var respuestaTexto = document.createElement('p');
    respuestaTexto.className = 'respuesta-texto';
    respuestaTexto.innerText = esCorrecta ? '¡Respuesta correcta!' : 'Respuesta incorrecta. La respuesta correcta es: ' + respuestaCorrecta;

    respuestaContainer.appendChild(respuestaTexto);

    // Agregar la clase oculto después de un tiempo específico (por ejemplo, 3 segundos)
    setTimeout(function () {
      respuestaTexto.classList.add('oculto');
      // Eliminar el elemento de la respuesta después de ocultarlo
      setTimeout(function () {
        respuestaContainer.removeChild(respuestaTexto);
      }, 500);
    }, 1000);

    // Actualizar la puntuación y vidas
    if (esCorrecta) {
      puntuacion += 10;
    } else {
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
    }, 100);  // Esperar 1 segundo (1000 milisegundos) antes de cargar la siguiente pregunta
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
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}