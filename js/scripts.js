/*  
PENDENT: 
1 : arreglar arbre per a que surti bé un menú ramificat
2 : afegir filtre per a que els links tipus ChatGPT siguin el segon tipus de dada diferent (Afegint també un select option amb YouTube/ChatGPT)
3 : començar a usar bé git amb branches per a evitar haver de guardar el codi segur comentat com he fet ara
*/

function cargarVideos() {
    fetch('llista.json')
        .then(response => {
            if (!response.ok) { throw new Error('Error carregant JSON'); }
            return response.json();
        })
        .then(data => {
            generarSelector(data.videos); // el selector tradicional
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
        .catch(error => { console.error('Error:', error); });
}

function generarSelector(videos) {
    const tiposUnicos = [...new Set(videos.map(video => video.tipus))].sort();  
    const selector = document.getElementById('video-type');
    selector.innerHTML = ''; 
    const optionTodos = document.createElement('option');
    optionTodos.value = 'todos';
    optionTodos.innerText = 'Tots';
    selector.appendChild(optionTodos);
    // Agregar opciones desde el JSON, usando el valor completo de 'tipus'
    var tato = "";
    tiposUnicos.forEach(tipo => {
        const option = document.createElement('option');
        option.value = tipo;
        option.textContent = tipo;
        if (tipo === "Animació > Vocaloid > Party") {
            tato = tipo;
            option.selected = true; // Preseleccionar
        }
        selector.appendChild(option);
    });
    filtrarVideosPorTipo(tato, videos);
}

// Evento para mostrar/ocultar el menú arborificado
document.querySelector('label[for="video-type"]').addEventListener('click', function() {
    const menuArbol = document.getElementById('menu-arbol');
    // Cambiar la visibilidad del menú
    menuArbol.style.display = (menuArbol.style.display === 'none' || menuArbol.style.display === '') ? 'block' : 'none';
});

function construirArbolDeTipos(videos) {
    const arbol = {};
    videos.forEach(video => {
        const tipos = video.tipus.split(' > ');  // Usar delimitador específic
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
            
            // Crear el subcontenedor
            const subContainer = document.createElement('div');
            li.appendChild(subContainer);
            
            // Verificar si este nodo tiene subtipos (excluyendo _videos)
            const subtipos = Object.keys(arbol[key]).filter(k => k !== '_videos');
            const tieneSubtipos = subtipos.length > 0;
            const tieneVideos = arbol[key]._videos && arbol[key]._videos.length > 0;
            
            // Agregar evento de clic para todos los nodos
            li.addEventListener('click', (event) => {
                event.stopPropagation();
                
                // Siempre mostrar los videos asociados al nodo actual (o lista vacía si no hay)
                if (tieneVideos) {
                    generarVideos(arbol[key]._videos);
                } else {
                    generarVideos([]);
                }
                
                // Si tiene subtipos, también manejar la expansión/colapso
                if (tieneSubtipos) {
                    const isHidden = subContainer.style.display === 'none';
                    subContainer.style.display = isHidden ? 'block' : 'none';
                }
            });
            
            // Si tiene subtipos, generar el subárbol
            if (tieneSubtipos) {
                generarMenuAcordeon(arbol[key], subContainer);
                subContainer.style.display = 'none';
            } else {
                // Si no tiene subtipos, eliminar el subcontenedor vacío
                subContainer.remove();
            }
            
            ul.appendChild(li);
        }
    });
}

// filtrar los videos por tipo seleccionado en el selector
function filtrarVideosPorTipo(tipoSeleccionado, videos) {
    const selector = document.getElementById('video-type'); // Obtener el selector
    selector.value = tipoSeleccionado; // Establecer el valor seleccionado en el selector
    const videosFiltrados = tipoSeleccionado === 'todos' 
        ? videos 
        : videos.filter(video => video.tipus === tipoSeleccionado);  // Comparar directamente el campo tipus completo
    generarVideos(videosFiltrados); // Llamar a la función para mostrar los videos filtrados
}

// generar los videos en el DOM ANTIC
/*
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
        //   const separador = document.createElement('hr');
        //   container.appendChild(separador);
    });
}
*/
// NOU
function generarVideos(videos) {
    const container = document.getElementById('video-list');
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos videos
    
    videos.forEach((video) => {
        const videoItem = document.createElement('div');
        videoItem.className = 'video-item';
        
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
        
        // Añadir el video y el resumen
        videoItem.appendChild(videoContainer);
        videoItem.appendChild(summaryContainer);
        
        container.appendChild(videoItem);
    });
}



// Ejecutar las funciones cuando la página esté cargada
window.onload = function() {
    emailjs.init("6fA2OytynKI7ROlMU");
    cargarVideos(); // Cargar los videos desde el JSON
    document.getElementById('send-comment').addEventListener('click', enviarComentario);
};
