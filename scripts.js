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
            // Solo llamamos a generarSelector, que se encargará de 
            // filtrar y mostrar los videos inicialmente
            generarSelector(data.videos);

            // Agregar un evento para filtrar los videos cuando se cambia el selector
            document.getElementById('video-type').addEventListener('change', function() {
                const selectedType = this.value;
                filtrarVideosPorTipo(selectedType, data.videos);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function generarSelector(videos) {
//    const videoTypes = [...new Set(videos.map(video => video.tipus))];
    const videoTypes = [...new Set(videos.map(video => video.tipus))].sort();
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
        option.innerText = type;
        if (type === "Vocaloid Party") {
            option.selected = true;
        }
        selectElement.appendChild(option);
    });

    // Filtrar inmediatamente por Vocaloid Party
    filtrarVideosPorTipo("Vocaloid Party", videos);
}

function filtrarVideosPorTipo(tipoSeleccionado, videos) {
    const container = document.getElementById('video-list');
    container.innerHTML = '';
    const filteredVideos = tipoSeleccionado === 'todos' 
        ? videos 
        : videos.filter(video => video.tipus === tipoSeleccionado);
    generarVideos(filteredVideos);
}

function generarVideos(videos) {
    const container = document.getElementById('video-list');
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos videos

    videos.forEach((video) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item'; // Añadido para estilos en CSS

        // Contenedor de video
        const videoContainer = document.createElement('div');
        videoContainer.className = 'video-container';

        const videoFrame = document.createElement('iframe');
        videoFrame.src = video.url;
        videoFrame.setAttribute('frameborder', '0');
        videoFrame.setAttribute('allowfullscreen', '');
        videoContainer.appendChild(videoFrame);

        // Contenedor del resumen
        const summaryContainer = document.createElement('div');
        summaryContainer.className = 'summary-container';
        const paragraph = document.createElement('p');
        paragraph.innerText = video.resumen;
        summaryContainer.appendChild(paragraph);

        // Agregar el video y el resumen en la misma fila
        videoItem.appendChild(videoContainer);
        videoItem.appendChild(summaryContainer);

        // Agregar el videoItem al contenedor principal
        container.appendChild(videoItem);

        // Agregar un separador <hr> entre videos
        const separador = document.createElement('hr');
        container.appendChild(separador);
    });
}

// Ejecutar las funciones cuando la página esté cargada
window.onload = function() {
    emailjs.init("6fA2OytynKI7ROlMU");
    cargarVideos(); // Cargar los videos desde el JSON
    document.getElementById('send-comment').addEventListener('click', enviarComentario);
};
