/*  
PENDENT: 
1 : arreglar arbre per a que surti bé un menú ramificat (Aques codi el guardo per seguretat)
2 : afegir filtre per a que els links de tipus ChatGPT siguin el segon tipus de dada diferent (Afegint també un select option amb YouTube/ChatGPT)
3 : començar a usar bé git amb branches per a evitar haver de guardar el codi segur comentat com he fet ara
*/

/* aquest codi era abans de generar arbre i funciona bé

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
    optionTodos.innerText = 'Tots';
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

*/

// Función para cargar el JSON y generar los videos y el menú desplegable de árbol
function cargarVideos() {
    fetch('videos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            // Generar selector tradicional
            generarSelector(data.videos);

            // Construir el árbol de tipos y generar el menú desplegable
            const arbolDeTipos = construirArbolDeTipos(data.videos);
            const menuContainer = document.getElementById('menu-arbol');
            generarMenuDesplegable(arbolDeTipos, menuContainer);

            // Agregar evento para el selector
            document.getElementById('video-type').addEventListener('change', function() {
                const selectedType = this.value;
                filtrarVideosPorTipo(selectedType, data.videos);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para construir el árbol a partir de los campos "tipus"
function construirArbolDeTipos(videos) {
    const arbol = {};

    videos.forEach(video => {
        const tipos = video.tipus.split(' ');  // Separar palabras del tipus
        let nodoActual = arbol;

        tipos.forEach(tipo => {
            if (!nodoActual[tipo]) {
                nodoActual[tipo] = {};  // Crear nuevo nodo si no existe
            }
            nodoActual = nodoActual[tipo];  // Moverse al siguiente nivel
        });

        nodoActual._videos = nodoActual._videos || [];
        nodoActual._videos.push(video);  // Guardar el video en la hoja
    });

    return arbol;
}

// Función para generar el menú desplegable de árbol
function generarMenuDesplegable(arbol, container) {
    const ul = document.createElement('ul');
    container.appendChild(ul);

    Object.keys(arbol).forEach(key => {
        const li = document.createElement('li');
        li.innerText = key;

        if (arbol[key]._videos) {
            // Si es una hoja, al hacer clic se filtrarán los videos
            li.addEventListener('click', () => {
                generarVideos(arbol[key]._videos);
            });
        }

        ul.appendChild(li);

        // Si tiene subniveles, construir el subárbol
        if (Object.keys(arbol[key]).length > 1) {
            const subContainer = document.createElement('div');
            li.appendChild(subContainer);
            generarMenuDesplegable(arbol[key], subContainer);
        }
    });
}

// Función para generar el selector de tipos (ordenado alfabéticamente)
function generarSelector(videos) {
    const videoTypes = [...new Set(videos.map(video => video.tipus))].sort();
    const selectElement = document.getElementById('video-type');
    
    // Limpiar opciones existentes
    selectElement.innerHTML = '';
    
    // Agregar opción "Todos"
    const optionTodos = document.createElement('option');
    optionTodos.value = 'todos';
    optionTodos.innerText = 'Tots';
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

// Función para filtrar videos según el tipo seleccionado
function filtrarVideosPorTipo(tipoSeleccionado, videos) {
    const container = document.getElementById('video-list');
    container.innerHTML = '';
    const filteredVideos = tipoSeleccionado === 'todos' 
        ? videos 
        : videos.filter(video => video.tipus === tipoSeleccionado);
    generarVideos(filteredVideos);
}

// Función para generar los videos en el DOM
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
