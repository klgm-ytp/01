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
            generarVideos(data.videos);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para generar los videos en la página
function generarVideos(videos) {
    const container = document.getElementById('video-list');
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
    });
}

// Función para enviar el comentario (la parte del comentario permanece igual)
function enviarComentario() {
    const comment = document.getElementById('user-comment').value;

    if (comment.trim() === "") {
        alert("Escriu un comentari si us plau:");
        return;
    }

    const templateParams = {
        message: comment,
    };

    emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', templateParams)
        .then(function(response) {
            alert("Comentari enviat!");
            document.getElementById('user-comment').value = ""; // Limpiar campo de texto
        }, function(error) {
            alert("Hubo un error al enviar el comentario, inténtalo de nuevo.");
        });
}

// Ejecutar las funciones cuando la página esté cargada
window.onload = function() {
    cargarVideos(); // Cargar los videos desde el JSON
    document.getElementById('send-comment').addEventListener('click', enviarComentario);
};

window.onload = function() {
    generarVideos();
    document.getElementById('send-comment').addEventListener('click', enviarComentario);
};
