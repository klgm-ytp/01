// Función para cargar el JSON y generar los videos
function cargarVideos() {
    fetch('videos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            generarSelector(data.videos); // Llama a la función para generar el selector
            generarVideos(data.videos); // Muestra todos los videos al principio

            // Agregar un evento para filtrar los videos cuando se cambia el selector
            document.getElementById('video-type').addEventListener('change', function() {
                const selectedType = this.value;
                const filteredVideos = selectedType ? data.videos.filter(video => video.tipus === selectedType) : data.videos;
                generarVideos(filteredVideos);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para generar el selector de tipos de video
/*
function generarSelector(videos) {
    const videoTypes = [...new Set(videos.map(video => video.tipus))]; // Extraer tipos únicos
    const selectElement = document.getElementById('video-type');

    videoTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.innerText = type; // Muestra el tipo como texto
        selectElement.appendChild(option);
    });
        document.getElementById('video-type').value = "Vocaloid Party";
}
*/

function generarSelector(videos) {
    const videoTypes = [...new Set(videos.map(video => video.tipus))]; // Extraer tipos únicos
    const selectElement = document.getElementById('video-type');

    // Limpiar opciones existentes
    selectElement.innerHTML = '';

    // Agregar opción "Todos"
    const optionTodos = document.createElement('option');
    optionTodos.value = 'todos';
    optionTodos.innerText = 'Todos';
    selectElement.appendChild(optionTodos);

    // Agregar opciones de tipos desde el JSON
    videoTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.innerText = type; // Muestra el tipo como texto
        
        // Marcar "Vocaloid Party" como preseleccionado
        if (type === "Vocaloid Party") {
            option.selected = true; // Marcar como seleccionado
        }

        selectElement.appendChild(option);
    });

    // Filtrar videos por el tipo seleccionado
    filtrarVideosPorTipo(selectElement.value, videos); // Filtrar directamente por el valor preseleccionado
}

// Función para filtrar videos según el tipo seleccionado
function filtrarVideosPorTipo(tipoSeleccionado, videos) {
    const container = document.getElementById('video-list');
    container.innerHTML = ''; // Limpiar lista existente
    const filteredVideos = tipoSeleccionado === 'todos' ? videos : videos.filter(video => video.tipus === tipoSeleccionado);
    generarVideos(filteredVideos); // Mostrar los videos filtrados
}

// Añadir el evento de cambio al selector para filtrar los videos dinámicamente
document.getElementById('video-type').addEventListener('change', (event) => {
    filtrarVideosPorTipo(event.target.value, videos); // Asegúrate de que 'videos' esté accesible aquí
});


// Función para generar los videos en la página
function generarVideos(videos) {
    const container = document.getElementById('video-list');
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos videos

    videos.forEach((video) => {
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';

        const videoFrame = document.createElement('iframe');
        videoFrame.src = video.url;
        videoFrame.setAttribute('frameborder', '0');
        videoFrame.setAttribute('allowfullscreen', '');
        videoContainer.appendChild(videoFrame);

        const summaryContainer = document.createElement('div');
        summaryContainer.className = 'summary-container';
        const paragraph = document.createElement('p');
        paragraph.innerText = video.resumen;
        summaryContainer.appendChild(paragraph);

        container.appendChild(videoContainer);
        container.appendChild(summaryContainer);

        const separador = document.createElement('hr');
        container.appendChild(separador);
    });
}

// Función para enviar el comentario
function enviarComentario() {
    const comment = document.getElementById('user-comment').value;
    if (comment.trim() === "") { alert("Escriu un comentari"); return; }
    const templateParams = { message: comment, from_name: "perico de los palotes", };
    emailjs.send('gmailpersonal', 'template_76kgfyr', templateParams)
        .then(function(response) {
            alert("Comentari enviat!");
            document.getElementById('user-comment').value = ""; // Limpiar campo de texto
        }, function(error) {
            alert("Error.");
        }); // service id, template id
}

// Ejecutar las funciones cuando la página esté cargada
window.onload = function() {
    emailjs.init("6fA2OytynKI7ROlMU");
    cargarVideos(); // Cargar los videos desde el JSON
    document.getElementById('send-comment').addEventListener('click', enviarComentario);
};
