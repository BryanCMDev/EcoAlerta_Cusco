// 1. Inicializar el mapa centrado en Cusco (Cerca a Huacarpay)
const map = L.map('map').setView([-13.6214, -71.7342], 12);

// Agregar capa de OpenStreetMap (gratuita)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors | EcoAlerta Cusco'
}).addTo(map);

// 2. Configurar colores para los marcadores (efecto mapa de calor por gravedad)
const colorMap = {
    'rojo': '#e53935',    // Crítico
    'amarillo': '#fdd835', // Moderado
    'verde': '#43a047'     // Recuperado
};

// Array para guardar los reportes
let reportes = JSON.parse(localStorage.getItem('ecoalerta_reportes')) || [];

// 3. Manejar clics en el mapa para seleccionar ubicación
let tempMarker = null;

map.on('click', function(e) {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    
    // Llenar los campos de latitud y longitud en el formulario
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;

    // Mostrar un marcador temporal donde el usuario hizo clic
    if (tempMarker) {
        map.removeLayer(tempMarker);
    }
    tempMarker = L.marker([lat, lng]).addTo(map)
        .bindPopup("Ubicación seleccionada")
        .openPopup();
});

// 4. Función para dibujar un reporte en el mapa
function renderMarker(reporte) {
    // Usamos CircleMarker para simular zonas de calor/gravedad
    L.circleMarker([reporte.lat, reporte.lng], {
        radius: 12, // Tamaño del punto
        fillColor: colorMap[reporte.gravedad],
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    }).addTo(map)
    .bindPopup(`
        <strong>📍 Distrito:</strong> ${reporte.distrito} <br>
        <strong>⚠️ Estado:</strong> ${reporte.gravedad.toUpperCase()} <br>
        <strong>📝 Descripción:</strong> ${reporte.descripcion} <br>
        <em>Reporte Ciudadano</em>
    `);
}

// 5. Renderizar reportes guardados previamente al cargar la página
function cargarReportes() {
    reportes.forEach(reporte => {
        renderMarker(reporte);
    });
    actualizarEstadisticas();
}

// 6. Manejar el envío del formulario
document.getElementById('reportForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Evitar recargar la página

    const distrito = document.getElementById('district').value;
    const lat = document.getElementById('lat').value;
    const lng = document.getElementById('lng').value;
    const descripcion = document.getElementById('description').value;
    const gravedad = document.getElementById('severity').value;

    if(!lat || !lng) {
        alert("Por favor, haz clic en el mapa para seleccionar la ubicación exacta del reporte.");
        return;
    }

    const nuevoReporte = { distrito, lat, lng, descripcion, gravedad };
    
    // Guardar en array y en localStorage
    reportes.push(nuevoReporte);
    localStorage.setItem('ecoalerta_reportes', JSON.stringify(reportes));

    // Dibujar en el mapa
    renderMarker(nuevoReporte);
    
    // Limpiar formulario y marcador temporal
    this.reset();
    if(tempMarker) map.removeLayer(tempMarker);
    
    actualizarEstadisticas();
    alert("¡Reporte guardado con éxito! Gracias por ayudar a cuidar Cusco.");
});

// 7. Actualizar el cuadro de estadísticas
function actualizarEstadisticas() {
    const statsContainer = document.getElementById('reportStats');
    const conteo = { rojo: 0, amarillo: 0, verde: 0 };
    
    reportes.forEach(r => conteo[r.gravedad]++);
    
    statsContainer.innerHTML = `
        <li><span>🔴 Críticos (Rojo):</span> <strong>${conteo.rojo}</strong></li>
        <li><span>🟡 Moderados (Amarillo):</span> <strong>${conteo.amarillo}</strong></li>
        <li><span>🟢 Recuperados (Verde):</span> <strong>${conteo.verde}</strong></li>
        <li style="margin-top:10px; padding-top:10px; border-top:1px solid #ddd;">
            <span><strong>Total Registros:</strong></span> <strong>${reportes.length}</strong>
        </li>
    `;
}

// Iniciar aplicación
cargarReportes();