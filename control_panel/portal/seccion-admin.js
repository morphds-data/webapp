document.addEventListener('DOMContentLoaded', () => {
    const sidebarModules = document.getElementById('sidebarModules');
    const sidebarMenu = document.getElementById('sidebarMenu');
    const sidebarTitle = document.getElementById('sidebarTitle');
    const contentPlaceholder = document.getElementById('contentPlaceholder');
    const submodules = {
        implantsLink: document.getElementById('implantsSubmodules'),
        consignmentLink: document.getElementById('consignmentSubmodules'),
        corporateLink: document.getElementById('corporateSubmodules'),
        laboratoryLink: document.getElementById('laboratorySubmodules'),
        benefitsLink: document.getElementById('benefitsSubmodules'),
        usersLink: document.getElementById('usersSubmodules')
    };

    // Función para cargar CSS dinámicamente
    const loadCSS = (cssPath) => {
        return new Promise((resolve, reject) => {
            // Eliminar CSS anteriores
            document.querySelectorAll('link[data-module-css]').forEach(link => link.remove());

            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssPath;
            link.setAttribute('data-module-css', 'true'); // Marcar como CSS de módulo
            link.onload = () => resolve();
            link.onerror = () => reject(new Error(`No se pudo cargar el CSS: ${cssPath}`));
            document.head.appendChild(link);
        });
    };

    // Función para cargar JS dinámicamente
    const loadJS = (jsPath) => {
        return new Promise((resolve, reject) => {
            // Eliminar JS anteriores
            document.querySelectorAll('script[data-module-js]').forEach(script => script.remove());

            const script = document.createElement('script');
            script.src = jsPath;
            script.setAttribute('data-module-js', 'true'); // Marcar como JS de módulo
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`No se pudo cargar el JS: ${jsPath}`));
            document.body.appendChild(script);
        });
    };

    // Función para ocultar todos los submódulos
    const hideAllSubmodules = () => {
        Object.values(submodules).forEach(sub => sub.style.display = 'none');
    };

    // Mostrar submenú y ocultar menú principal al hacer clic en un ítem del menú principal
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const submoduleId = item.id;
            const submodule = submodules[submoduleId];

            sidebarMenu.style.display = 'none';
            hideAllSubmodules();
            sidebarModules.appendChild(submodule);
            submodule.style.display = 'block';
        });
    });

    // Volver al menú principal al hacer clic en el título del submódulo
    document.querySelectorAll('.sidebar-submodules h2').forEach(submoduleTitle => {
        submoduleTitle.addEventListener('click', (e) => {
            e.preventDefault();
            hideAllSubmodules();
            sidebarMenu.style.display = 'block';
            contentPlaceholder.innerHTML = '';
            // Limpiar CSS y JS al volver al menú principal
            document.querySelectorAll('link[data-module-css]').forEach(link => link.remove());
            document.querySelectorAll('script[data-module-js]').forEach(script => script.remove());
        });
    });

    // Cargar contenido en main-content al hacer clic en una opción del submenú
    document.querySelectorAll('.sidebar-submodules ul li a').forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            let contentPath = link.getAttribute('data-content');

            // Ajustar la ruta relativa si empieza con "modulos/"
            if (contentPath.startsWith('modulos/')) {
                contentPath = `../${contentPath}`;
            }

            try {
                // Cargar el HTML
                const response = await fetch(contentPath);
                if (!response.ok) {
                    throw new Error(`No se pudo cargar el archivo: ${contentPath}`);
                }
                const htmlContent = await response.text();
                contentPlaceholder.innerHTML = htmlContent;

                // Determinar las rutas de CSS y JS basadas en el nombre del archivo HTML
                const cssPath = contentPath.replace('.html', '.css');
                const jsPath = contentPath.replace('.html', '.js');

                // Cargar CSS y JS en orden
                try {
                    await loadCSS(cssPath);
                    await loadJS(jsPath);
                } catch (error) {
                    console.warn(`Error al cargar recursos adicionales: ${error.message}`);
                    // Continuar incluso si no se encuentran CSS o JS (puede que algunos módulos no los tengan)
                }
            } catch (error) {
                contentPlaceholder.innerHTML = `<h2>Error</h2><p>No se pudo cargar el contenido de ${contentPath}. Error: ${error.message}</p>`;
            }
        });
    });

    // Mostrar contenido especial al hacer clic en "Módulos"
    sidebarTitle.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSubmodules();
        sidebarMenu.style.display = 'block';
        contentPlaceholder.innerHTML = `
            <h2>Bienvenido al Panel de Administración</h2>
            <p>Este es el contenido principal de la sección de módulos.</p>
            <div>
                <h3>Opciones Disponibles:</h3>
                <ul>
                    <li>Gestión de módulos administrativos</li>
                    <li>Configuración del sistema</li>
                    <li>Reportes y estadísticas</li>
                </ul>
            </div>
        `;
        // Limpiar CSS y JS al volver al menú principal
        document.querySelectorAll('link[data-module-css]').forEach(link => link.remove());
        document.querySelectorAll('script[data-module-js]').forEach(script => script.remove());
    });
});