const ADMIN_PASSWORD = 'admin';

const map = L.map('map').setView([-13.6214, -71.7342], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors | EcoAlerta Cusco'
}).addTo(map);

const colorMap = {
    'rojo': '#e53935',
    'amarillo': '#fdd835',
    'verde': '#43a047'
};

const gravedadLabel = {
    'rojo': 'Crítico',
    'amarillo': 'Moderado',
    'verde': 'Recuperado'
};

let reportes = JSON.parse(localStorage.getItem('ecoalerta_reportes')) || [];
let reporteMarkers = [];
let tempMarker = null;
let rol = null;
let editandoIndex = null;

const loginScreen = document.getElementById('loginScreen');
const appContainer = document.getElementById('appContainer');
const sidebarPanel = document.getElementById('sidebarPanel');
const adminList = document.getElementById('adminList');
const btnRole = document.getElementById('btnRole');
const sessionBadge = document.getElementById('sessionBadge');
const whatsappSection = document.getElementById('whatsappSection');

const editForm = document.getElementById('editForm');
const editFormTitle = document.getElementById('editFormTitle');
const adminLoginForm = document.getElementById('adminLoginForm');
const adminPassword = document.getElementById('adminPassword');
const loginError = document.getElementById('loginError');

function esc(texto) {
    return String(texto === undefined || texto === null ? '' : texto).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
}

function guardarReportes() {
    localStorage.setItem('ecoalerta_reportes', JSON.stringify(reportes));
}

function popupReporte(reporte, index) {
    let acciones = '';
    if (rol === 'admin') {
        acciones = `
            <div class="popup-actions">
                <button type="button" class="popup-edit" data-index="${index}">✏️ Editar</button>
                <button type="button" class="popup-delete" data-index="${index}">🗑️ Eliminar</button>
            </div>`;
    }
    return `
        <strong>📍 Distrito:</strong> ${esc(reporte.distrito)} <br>
        <strong>⚠️ Estado:</strong> ${esc(gravedadLabel[reporte.gravedad] || reporte.gravedad)} <br>
        <strong>📝 Descripción:</strong> ${esc(reporte.descripcion)} <br>
        <em>Alerta Ambiental</em>
        ${acciones}
    `;
}

function limpiarMarcadores() {
    reporteMarkers.forEach(marker => map.removeLayer(marker));
    reporteMarkers = [];
}

function dibujarReportes() {
    limpiarMarcadores();
    reportes.forEach((reporte, index) => {
        const marker = L.circleMarker([reporte.lat, reporte.lng], {
            radius: 12,
            fillColor: colorMap[reporte.gravedad] || '#999',
            color: '#fff',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map).bindPopup(popupReporte(reporte, index));
        reporteMarkers.push(marker);
    });
}

function colocarTemporal(lat, lng) {
    if (tempMarker) {
        map.removeLayer(tempMarker);
    }
    tempMarker = L.marker([lat, lng]).addTo(map)
        .bindPopup('Ubicación seleccionada')
        .openPopup();
}

function quitarTemporal() {
    if (tempMarker) {
        map.removeLayer(tempMarker);
        tempMarker = null;
    }
}

map.on('click', function (e) {
    if (rol === 'admin' && editandoIndex !== null) {
        const lat = e.latlng.lat.toFixed(6);
        const lng = e.latlng.lng.toFixed(6);
        document.getElementById('editLat').value = lat;
        document.getElementById('editLng').value = lng;
        colocarTemporal(lat, lng);
    }
});

function actualizarEstadisticas() {
    const statsContainer = document.getElementById('reportStats');
    const conteo = { rojo: 0, amarillo: 0, verde: 0 };

    reportes.forEach(r => {
        if (conteo[r.gravedad] !== undefined) conteo[r.gravedad]++;
    });

    statsContainer.innerHTML = `
        <li><span>🔴 Críticos (Rojo):</span> <strong>${conteo.rojo}</strong></li>
        <li><span>🟡 Moderados (Amarillo):</span> <strong>${conteo.amarillo}</strong></li>
        <li><span>🟢 Recuperados (Verde):</span> <strong>${conteo.verde}</strong></li>
        <li style="margin-top:10px; padding-top:10px; border-top:1px solid #ddd;">
            <span><strong>Total Alertas:</strong></span> <strong>${reportes.length}</strong>
        </li>
    `;
}

function renderAdminList() {
    if (rol !== 'admin') return;

    if (reportes.length === 0) {
        adminList.innerHTML = '<p class="empty">Aún no hay alertas registradas. Usa "+ Nueva alerta" para agregar la primera.</p>';
        return;
    }

    adminList.innerHTML = reportes.map((r, index) => `
        <div class="admin-item">
            <div class="admin-item-head">
                <span class="dot" style="background:${colorMap[r.gravedad] || '#999'}"></span>
                <strong>${esc(r.distrito)}</strong>
                <span class="admin-tag">${esc(gravedadLabel[r.gravedad] || r.gravedad)}</span>
            </div>
            <p>${esc(r.descripcion)}</p>
            <small>Lat: ${esc(r.lat)} · Lng: ${esc(r.lng)}</small>
            <div class="popup-actions">
                <button type="button" class="popup-edit" data-index="${index}">✏️ Editar</button>
                <button type="button" class="popup-delete" data-index="${index}">🗑️ Eliminar</button>
            </div>
        </div>
    `).join('');
}

function iniciarEdicion(index) {
    editandoIndex = index;
    const reporte = index >= 0 ? reportes[index] : null;

    editFormTitle.textContent = reporte ? 'Editar alerta' : 'Nueva alerta';
    document.getElementById('editDistrict').value = reporte ? reporte.distrito : '';
    document.getElementById('editDescription').value = reporte ? reporte.descripcion : '';
    document.getElementById('editSeverity').value = reporte ? reporte.gravedad : 'amarillo';
    document.getElementById('editLat').value = reporte ? reporte.lat : '';
    document.getElementById('editLng').value = reporte ? reporte.lng : '';

    editForm.classList.remove('hidden');
    adminList.classList.add('hidden');
    quitarTemporal();

    if (reporte) {
        map.setView([reporte.lat, reporte.lng], map.getZoom());
        colocarTemporal(reporte.lat, reporte.lng);
    }

    editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function cerrarEdicion() {
    editandoIndex = null;
    editForm.classList.add('hidden');
    adminList.classList.remove('hidden');
    editForm.reset();
    quitarTemporal();
}

function eliminarReporte(index) {
    const reporte = reportes[index];
    if (!reporte) return;

    if (confirm(`¿Eliminar la alerta de "${reporte.distrito}"? Esta acción no se puede deshacer.`)) {
        reportes.splice(index, 1);
        guardarReportes();
        dibujarReportes();
        renderAdminList();
        actualizarEstadisticas();
    }
}

function setRol(nuevoRol) {
    rol = nuevoRol;
    const logueado = nuevoRol !== null;
    const esAdmin = nuevoRol === 'admin';
    const esUsuario = nuevoRol === 'usuario';

    loginScreen.classList.toggle('hidden', logueado);
    appContainer.classList.toggle('hidden', !logueado);
    appContainer.classList.toggle('user-view', esUsuario);
    sidebarPanel.classList.toggle('hidden', !esAdmin);
    whatsappSection.classList.toggle('hidden', !esUsuario);
    btnRole.classList.toggle('hidden', !logueado);
    sessionBadge.classList.toggle('hidden', !logueado);

    adminLoginForm.classList.add('hidden');
    loginError.classList.add('hidden');
    adminPassword.value = '';

    if (logueado) {
        sessionBadge.textContent = esAdmin ? 'Vista: Administrador 🛡️' : 'Vista: Usuario 👤';
        cerrarEdicion();
        renderAdminList();
        actualizarEstadisticas();
        setTimeout(() => {
            map.invalidateSize();
            dibujarReportes();
        }, 150);
    } else {
        quitarTemporal();
        limpiarMarcadores();
        map.closePopup();
        editForm.reset();
        adminList.innerHTML = '';
    }
}

document.getElementById('btnUser').addEventListener('click', function () {
    setRol('usuario');
});

document.getElementById('btnAdmin').addEventListener('click', function () {
    adminLoginForm.classList.remove('hidden');
    loginError.classList.add('hidden');
    adminPassword.focus();
});

document.getElementById('btnCancelAdmin').addEventListener('click', function () {
    adminLoginForm.classList.add('hidden');
    loginError.classList.add('hidden');
    adminPassword.value = '';
});

adminLoginForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (adminPassword.value === ADMIN_PASSWORD) {
        setRol('admin');
    } else {
        loginError.classList.remove('hidden');
        adminPassword.focus();
    }
});

btnRole.addEventListener('click', function () {
    setRol(null);
    loginScreen.classList.remove('hidden');
});

document.getElementById('btnNewReport').addEventListener('click', function () {
    iniciarEdicion(-1);
});

document.getElementById('btnCancelEdit').addEventListener('click', function () {
    cerrarEdicion();
});

document.addEventListener('click', function (e) {
    const editBtn = e.target.closest('.popup-edit');
    const deleteBtn = e.target.closest('.popup-delete');

    if (editBtn) {
        iniciarEdicion(Number(editBtn.dataset.index));
        map.closePopup();
    } else if (deleteBtn) {
        eliminarReporte(Number(deleteBtn.dataset.index));
        map.closePopup();
    }
});

editForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const datos = {
        distrito: document.getElementById('editDistrict').value,
        lat: document.getElementById('editLat').value,
        lng: document.getElementById('editLng').value,
        descripcion: document.getElementById('editDescription').value,
        gravedad: document.getElementById('editSeverity').value
    };

    if (!datos.lat || !datos.lng) {
        alert('Haz clic en el mapa para asignar la ubicación de la alerta.');
        return;
    }

    if (editandoIndex >= 0) {
        reportes[editandoIndex] = datos;
    } else {
        reportes.push(datos);
    }

    guardarReportes();
    dibujarReportes();
    renderAdminList();
    actualizarEstadisticas();
    cerrarEdicion();
    alert('Alerta guardada correctamente.');
});
