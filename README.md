# 🌿 EcoAlerta Cusco

**EcoAlerta Cusco** es una plataforma web interactiva diseñada para una empresa social enfocada en el monitoreo y la acción ambiental en los espacios naturales y turísticos de Cusco (con enfoque inicial en la laguna de Huacarpay).

Este sistema permite a los ciudadanos registrar reportes de contaminación geolocalizados, generando un mapa visual de alertas que sirve como base de datos para ofrecer servicios de monitoreo, capacitaciones y campañas de sensibilización a municipalidades y negocios turísticos.

## 🚀 Características Principales

* **Mapa Interactivo:** Integración con Leaflet.js y OpenStreetMap para visualizar el mapa de Cusco y sus alrededores sin necesidad de API keys de pago.
* **Geolocalización por Clic:** Los usuarios pueden hacer clic en cualquier punto del mapa para autocompletar las coordenadas exactas de su reporte.
* **Clasificación por Gravedad (Mapa de Calor Visual):** Los reportes se marcan con colores específicos según su estado:
* 🔴 **Rojo:** Contaminación crítica.
* 🟡 **Amarillo:** Contaminación moderada.
* 🟢 **Verde:** Zona recuperada.


* **Persistencia de Datos Local:** Utiliza `localStorage` para guardar los reportes en el navegador, permitiendo realizar pruebas y demostraciones sin necesidad de una base de datos backend inmediata.
* **Panel de Estadísticas:** Conteo en tiempo real de los reportes según su nivel de gravedad.
* **Diseño Responsivo:** Interfaz adaptable a dispositivos móviles y de escritorio.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript (Vanilla).
* **Mapas:** [Leaflet.js](https://leafletjs.com/) (Librería open-source para mapas interactivos).
* **Tiles (Capas de mapa):** OpenStreetMap.

## 📂 Estructura del Proyecto

```text
📁 ecoalerta-cusco
├── 📄 index.html    # Estructura principal de la web y el formulario
├── 📄 style.css     # Estilos y diseño responsivo
├── 📄 app.js        # Lógica de Leaflet, manejo del DOM y LocalStorage
└── 📄 README.md     # Documentación del proyecto

```

## ⚙️ Cómo ejecutar el proyecto localmente

Este proyecto no requiere instalación de dependencias, Node.js ni bases de datos. Es un proyecto estático listo para usar.

1. **Clona este repositorio:**
```bash
git clone https://github.com/TU_USUARIO/ecoalerta-cusco.git

```


2. **Abre la carpeta del proyecto** en tu editor de código (como Visual Studio Code).
3. **Ejecuta el proyecto:**
* *Opción A:* Simplemente haz doble clic en el archivo `index.html` para abrirlo en tu navegador web.
* *Opción B (Recomendada):* Utiliza la extensión **Live Server** en VS Code. Haz clic derecho sobre `index.html` y selecciona "Open with Live Server".



## 📊 Modelo de la Empresa Social

El software es la herramienta principal del modelo de negocio de EcoAlerta Cusco, el cual se divide en 5 etapas:

1. **Reporte ciudadano gratuito:** La comunidad reporta incidencias ambientales.
2. **Registro y monitoreo:** Clasificación en el mapa interactivo.
3. **Sensibilización ambiental:** Creación de contenido educativo en redes sociales.
4. **Servicios comerciales:** Venta de capacitaciones, planes de turismo responsable y reportes geográficos a empresas y municipalidades.
5. **Reinversión ambiental:** Los excedentes financian jornadas de limpieza y mantenimiento de la plataforma.

---

**Desarrollado para promover la conservación de los ecosistemas de Cusco y el turismo responsable.** 🏔️♻️
