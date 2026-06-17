document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Elementos de la Interfaz del DOM
    const container = document.getElementById('canvas-3d-container');
    const functionSelect = document.getElementById('function-select');
    const angleSlider = document.getElementById('angle-slider');
    const angleVal = document.getElementById('angle-val');

    // Variables globales de Three.js
    let scene, camera, renderer, controls;
    let solidMesh, lineMesh; 

    // 2. Inicialización del Entorno Escénico
    function init3D() {
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0xfafafa); // Fondo gris muy claro para contrastar el sólido

        // Cámara perspectiva
        camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
        camera.position.set(5, 6, 8);

        // Renderizador optimizado
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        container.appendChild(renderer.domElement);

        // Controles de ratón interactivos
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Iluminación ambiental y direccional para dar volumen y sombras
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight1.position.set(10, 15, 10);
        scene.add(dirLight1);

        const dirLight2 = new THREE.DirectionalLight(0x4f46e5, 0.2); // Toque sutil de color en la sombra
        dirLight2.position.set(-10, -10, -10);
        scene.add(dirLight2);

        // Guía visual: Ejes coordenados (X: rojo, Y: verde, Z: azul)
        const axesHelper = new THREE.AxesHelper(4);
        scene.add(axesHelper);

        // Generar el sólido inicial
        updateSolid();

        // Bucle de animación continuo
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
    }

    // 3. Generación de Puntos según la Función Seleccionada
    function getPoints(type) {
        const points = [];
        const samples = 30; // Cantidad de segmentos verticales
        const heightMax = 3;

        for (let i = 0; i <= samples; i++) {
            const y = (i / samples) * heightMax; // El eje Y actúa como nuestra altura/eje de giro
            let x = 0; // El eje X representará el radio del sólido en esa altura

            if (type === 'lineal') {
                x = y * 0.8; 
            } else if (type === 'parabola') {
                x = Math.sqrt(y) * 1.1;
            } else if (type === 'sinusoidal') {
                x = Math.sin(y * 2) * 0.5 + 1.2;
            }
            
            // Registramos el punto (distancia al eje Y, altura en Y)
            points.push(new THREE.Vector2(x, y - (heightMax / 2))); // Centrado en el origen vertical
        }
        return points;
    }

    // 4. Construcción y Actualización del Sólido Dinámico
    function updateSolid() {
        // Eliminar geometrías previas de la memoria de la escena para evitar fugas de rendimiento
        if (solidMesh) scene.remove(solidMesh);
        if (lineMesh) scene.remove(lineMesh);

        const selectedFunc = functionSelect.value;
        const angleDegrees = parseFloat(angleSlider.value);
        angleVal.textContent = angleDegrees;

        // Convertir el ángulo de la interfaz a radianes reales para el cálculo trigonométrico
        const angleRadians = (angleDegrees * Math.PI) / 180;
        const points = getPoints(selectedFunc);

        // Si el ángulo es mayor que cero, construimos el volumen de revolución
        if (angleRadians > 0) {
            // LatheGeometry genera la rotación tridimensional sobre el eje Y de manera nativa
            const latheGeometry = new THREE.LatheGeometry(points, 40, 0, angleRadians);
            
            // Material translúcido de doble cara para poder ver el interior hueco del sólido al abrirse
            const solidMaterial = new THREE.MeshStandardMaterial({
                color: 0x4f46e5,
                roughness: 0.4,
                metalness: 0.1,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.85,
                wireframe: false
            });

            solidMesh = new THREE.Mesh(latheGeometry, solidMaterial);
            scene.add(solidMesh);
        }

        // Dibujar el perfil 2D original (la línea guía generatriz)
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({ color: 'black', linewidth: 2 });
        lineMesh = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(lineMesh);
    }

    // 5. Escuchadores de Eventos (Inputs)
    functionSelect.addEventListener('change', updateSolid);
    angleSlider.addEventListener('input', updateSolid);

    // Ajustar el tamaño del lienzo dinámicamente si cambia la ventana del navegador
    window.addEventListener('resize', () => {
        if (!container || !renderer || !camera) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    // Arrancar el entorno gráfico
    init3D();
});



document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('cantor-canvas');
    const ctx = canvas.getContext('2d');
    const slider = document.getElementById('iteration-slider');
    const iterVal = document.getElementById('iteration-val');
    
    const statSegments = document.getElementById('stat-segments');
    const statLength = document.getElementById('stat-length');
    const statTotal = document.getElementById('stat-total');

    // Configuración visual
    const margin = 20;
    const canvasWidth = canvas.width - (margin * 2);
    const lineThickness = 15;
    const verticalSpacing = 40; // Espacio entre cada nivel de iteración

    // Función recursiva para dibujar los segmentos
    function drawCantor(x, y, length, depth) {
        // Dibuja el segmento actual
        ctx.fillStyle = '#4f46e5'; // Azul de acento
        ctx.fillRect(x, y, length, lineThickness);

        // Condición de parada de la recursión
        if (depth > 0) {
            const newY = y + verticalSpacing;
            const newLength = length / 3;
            
            // Llamada recursiva para el tercio izquierdo
            drawCantor(x, newY, newLength, depth - 1);
            
            // Llamada recursiva para el tercio derecho
            drawCantor(x + (newLength * 2), newY, newLength, depth - 1);
        }
    }

    // Función para actualizar toda la vista
    function updateVisualization() {
        const iterations = parseInt(slider.value);
        iterVal.textContent = iterations;

        // Limpiar el lienzo completo
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar el conjunto desde la iteración 0 hasta la actual
        // Empezamos en x = margen, y = margen
        drawCantor(margin, margin, canvasWidth, iterations);

        // Actualizar la matemática de la paradoja
        const numSegments = Math.pow(2, iterations);
        
        // Usamos fracciones visuales para que sea evidente cómo la longitud se reduce
        let fractionLength = `1 / ${Math.pow(3, iterations)}`;
        let fractionTotal = `${Math.pow(2, iterations)} / ${Math.pow(3, iterations)}`;
        
        if (iterations === 0) {
            fractionLength = "1";
            fractionTotal = "1";
        }

        statSegments.textContent = numSegments;
        statLength.textContent = fractionLength + " unidades";
        
        // Mostrar el decimal de la longitud total para evidenciar que tiende a 0
        const decimalTotal = Math.pow(2/3, iterations).toFixed(4);
        statTotal.textContent = `${fractionTotal} (Aprox. ${decimalTotal})`;
    }

    // Escuchar el evento del deslizador
    slider.addEventListener('input', updateVisualization);

    // Dibujar el estado inicial (Iteración 0) al cargar
    updateVisualization();
});