/*  
PENDENT: 
1 : arreglar arbre per a que surti bé un menú ramificat
2 : afegir filtre per a que els links tipus ChatGPT siguin el segon tipus de dada diferent (Afegint també un select option amb YouTube/ChatGPT)
3 : començar a usar bé git amb branches per a evitar haver de guardar el codi segur comentat com he fet ara
*/

// Función para cargar el JSON y generar los videos, el selector y el menú desplegable de árbol
function cargarVideos() {
    fetch('videos.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            // Generar el selector tradicional
            generarSelector(data.videos);

            // Construir el árbol de tipos y generar el menú desplegable
            const arbolDeTipos = construirArbolDeTipos(data.videos);
            const menuContainer = document.getElementById('menu-arbol');
            menuContainer.innerHTML = ''; // Limpiar antes de agregar nuevo contenido
            generarMenuAcordeon(arbolDeTipos, menuContainer);

            // Agregar evento para el selector (filtrado tradicional)
            document.getElementById('video-type').addEventListener('change', function() {
                const selectedType = this.value;
                filtrarVideosPorTipo(selectedType, data.videos);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Función para generar el selector tradicional (dropdown) de tipos de video
function generarSelector(videos) {
    // Obtener todos los 'tipus' únicos completos sin dividir por palabras y ordenarlos
    const tiposUnicos = [...new Set(videos.map(video => video.tipus))].sort();  
    const selector = document.getElementById('video-type');
    selector.innerHTML = ''; // Limpiar el selector antes de agregar opciones
    // Agregar opción "Todos"
    const optionTodos = document.createElement('option');
    optionTodos.value = 'todos';
    optionTodos.innerText = 'Tots';
    selector.appendChild(optionTodos);
    // Agregar opciones desde el JSON, usando el valor completo de 'tipus'
    tiposUnicos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        // Preseleccionar "Vocaloid > Party"
        if (tipo === "Vocaloid > Party") {
            option.selected = true; // Preseleccionar "Vocaloid > Party"
        }
        selector.appendChild(option);
    });
    // Filtrar inmediatamente por "Vocaloid > Party" si está presente
    filtrarVideosPorTipo("Vocaloid > Party", videos);
}

// Función para construir el árbol a partir de los campos "tipus"
function construirArbolDeTipos(videos) {
    const arbol = {};
    videos.forEach(video => {
        const tipos = video.tipus.split(' > ');  // Usar un delimitador específico
        let nodoActual = arbol;
        tipos.forEach(tipo => {
            if (!nodoActual[tipo]) {
                nodoActual[tipo] = {};  // Crear nuevo nodo si no existe
            }
            nodoActual = nodoActual[tipo];  // Moverse al siguiente nivel
        });
        // Solo agregar _videos en la hoja final, no como parte del árbol
        nodoActual._videos = nodoActual._videos || [];
        nodoActual._videos.push(video);  // Guardar el video en la hoja
    });
    return arbol;
}

function generarMenuAcordeon(arbol, container) {
    const ul = document.createElement('ul');
    container.appendChild(ul);
    
    Object.keys(arbol).sort().forEach(key => {
        if (key !== '_videos') {
            const li = document.createElement('li');
            li.innerText = key;
            
            // Crear el subcontenedor siempre visible
            const subContainer = document.createElement('div');
            li.appendChild(subContainer);
            
            // Verificar si este nodo tiene subtipos o videos
            const tieneSubtipos = Object.keys(arbol[key]).some(k => k !== '_videos');
            const tieneVideos = arbol[key]._videos && arbol[key]._videos.length > 0;
            
            if (tieneSubtipos) {
                // Si tiene subtipos, generar el subárbol
                generarMenuAcordeon(arbol[key], subContainer);
                
                // Agregar evento para mostrar/ocultar subtipos
                li.addEventListener('click', (event) => {
                    event.stopPropagation();
                    const isHidden = subContainer.style.display === 'none';
                    subContainer.style.display = isHidden ? 'block' : 'none';
                });
            }
            
            if (tieneVideos) {
                // Si tiene videos directamente asociados, agregar evento para mostrarlos
                li.addEventListener('click', (event) => {
                    event.stopPropagation();
                    generarVideos(arbol[key]._videos);
                    
                    // Si tiene subtipos, alternar su visibilidad
                    if (tieneSubtipos) {
                        const isHidden = subContainer.style.display === 'none';
                        subContainer.style.display = isHidden ? 'block' : 'none';
                    }
                });
            }
            
            // Si no tiene ni subtipos ni videos, agregar evento para mostrar lista vacía
            if (!tieneSubtipos && !tieneVideos) {
                li.addEventListener('click', (event) => {
                    event.stopPropagation();
                    generarVideos([]);
                });
            }
            
            // Inicialmente ocultar el subcontenedor
            subContainer.style.display = 'none';
            
            ul.appendChild(li);
        }
    });
}

// Función para filtrar los videos por tipo seleccionado en el selector
function filtrarVideosPorTipo(tipoSeleccionado, videos) {
    const selector = document.getElementById('video-type'); // Obtener el selector
    selector.value = tipoSeleccionado; // Establecer el valor seleccionado en el selector
    const videosFiltrados = tipoSeleccionado === 'todos' 
        ? videos 
        : videos.filter(video => video.tipus === tipoSeleccionado);  // Comparar directamente el campo tipus completo
    generarVideos(videosFiltrados); // Llamar a la función para mostrar los videos filtrados
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
