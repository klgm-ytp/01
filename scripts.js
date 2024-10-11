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

        const separador = document.createElement('hr');
        container.appendChild(separador);
    });
}

// Función para enviar el comentario
function enviarComentario() {
    const comment = document.getElementById('user-comment').value;
    if (comment.trim() === "") { alert("Escriu un comentari"); return; }
    const templateParams = { message: comment, };
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
 //   emailjs.init("27q6SmJ9-_GO1kYfa");
    cargarVideos(); // Cargar los videos desde el JSON
    document.getElementById('send-comment').addEventListener('click', enviarComentario);
};
