const videos = [
    {
        url: "https://www.youtube.com/embed/FQkjIw8u3rU",
        resumen: "Uns 1200 anys d'història... Realment calen els 30 minuts. Diu moltes coses molt fonamentals però poc conegudes."
    }, {
        url: "https://www.youtube.com/embed/MykPPXHShzs",
        resumen: "Experiments de 1993 i 2001 mostren que preferim patir més o gaudir menys perquè oblidem les duracions i recordem solament coses puntuals. Ignorem el que podem deduir i adaptem idees al que creiem que és normal i no sempre ho és."
    }
];
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
window.onload = function() {
    generarVideos();
    document.getElementById('send-comment').addEventListener('click', enviarComentario);
};
