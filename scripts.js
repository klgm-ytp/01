// Array que contiene las URLs de los videos y sus resúmenes
const videos = [
    {
        url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        resumen: "Este video trata sobre la importancia de la perseverancia..."
    },
    {
        url: "https://www.youtube.com/embed/tgbNymZ7vqY",
        resumen: "En este video se explica cómo las tecnologías emergentes están cambiando..."
    }
];

// Función que genera el contenido dinámicamente
function generarVideos() {
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

// Función para enviar el comentario a través de EmailJS
function enviarComentario() {
    const comment = document.getElementById('user-comment').value;

    if (comment.trim() === "") {
        alert("Por favor, escribe un comentario antes de enviarlo.");
        return;
    }

    const templateParams = {
        message: comment,
    };

    emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', templateParams)
        .then(function(response) {
            alert("Comentario enviado con éxito.");
            document.getElementById('user-comment').value = ""; // Limpiar campo de texto
        }, function(error) {
            alert("Hubo un error al enviar el comentario, inténtalo de nuevo.");
        });
}

// Inicializa la generación de videos y configura el envío de comentarios
window.onload = function() {
    generarVideos();

    document.getElementById('send-comment').addEventListener('click', enviarComentario);
};
