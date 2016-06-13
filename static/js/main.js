(function($, window, document) {
    // threejs globals
    var scene, camera, renderer;
    // my globals
    var uniforms, starMaterial,
        frame = 0, // frame counter for animation loop
        cameraVelocity = 0; // camera velocity for smoothing movement
    // properties/globals
    var sceneDistance = 4.3840736e+12;
    var scaleFactor = 100 / 6.957e+8;
    var lightColor = 0x008080;
    var keysPressed = [];

    $(function() {
        init();
        registerHandlers();
        setUpStarMaterials();

        render();

        $.ajax({
            url: 'http://localhost:5000/stardata/',
            success: function(data) {
                addStars(data);
            },
            error: function() {
                console.log('Error loading star data');
            }
        })

        function addStars(starData) {
            console.log(starData.length);
            for (star of starData) {
                addStar(star.x / scaleFactor, star.y / scaleFactor, star.z / scaleFactor, 100);
            }
        }
    });

    //Initializes all the threejs stuff
    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, sceneDistance);
        renderer = new THREE.WebGLRenderer({ antialias: true, autoclear: true, alpha: true});

        camera.position.z = 1.496e+11 * scaleFactor;
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        renderer.setClearColor(0x000000);
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        document.body.appendChild(renderer.domElement);
    };

    function registerHandlers() {
        $(document).on('keydown', function(event) {
            keysPressed[event.which] = true;
        });

        $(document).on('keyup', function(event) {
            keysPressed[event.which] = false;
        });
    };

    function setUpStarMaterials() {
        var textureLoader = new THREE.TextureLoader();
        
        uniforms = {
            time: { type: "f", value: 1.0 },
            texture1: { type: "t", value: textureLoader.load( "static/textures/noise.png" ) },
            texture2: { type: "t", value: textureLoader.load( "static/textures/sunMap.jpg" ) }
        };
        uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
        uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

        starMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: $('#vertexShader').text(),
            fragmentShader: $('#fragmentShader').text()
        });
    }

    // sun is 100 radius
    function addStar(x, y, z, size) {
        var starGeom = new THREE.SphereBufferGeometry(size, 64, 64);

        var starMesh = new THREE.Mesh(starGeom, starMaterial);
        starMesh.position.set(x, y, z);
        starMesh.rotation.set(x, y, z);
        scene.add(starMesh);
    };    

    // The render loop
    function render() {
        requestAnimationFrame(render);
        handleInput();
        uniforms.time.value = frame / 200;
        frame += 1; 
        renderer.render(scene, camera);
    };

    function handleInput() {
        if (keysPressed[81]) { //q
            camera.rotateX(0.02);
        }
        if (keysPressed[69]) { //e
            camera.rotateX(-0.02);
        }
        if (keysPressed[65]) { //a
            camera.rotateY(0.02);
        }
        if (keysPressed[68]) { //d
            camera.rotateY(-0.02);
        }

        if (keysPressed[87]) { //w
            cameraVelocity -= 4;
        }
        if (keysPressed[83]) { //s
            cameraVelocity += 4;
        }
        if (!(keysPressed[83] || keysPressed[87])) {
            let newVelocity = 0.90 * cameraVelocity;
            cameraVelocity = Math.abs(newVelocity) > 0.001 ? newVelocity : 0;
        }
        camera.translateZ(cameraVelocity);
    };
}(window.jQuery, window, document));




/*TODO:
    -right click to change camera angle, scroll to zoom, left click for info
    -solar magnetic emmision effect
    -make sun spots more realistic
    -use real star data
    -find a way to map slightly different spectra
    -click to zoom in on a star
    -display star info on hover (ajax)
    -particalize stars that are out of the frustrum
    -handle non webgl browsers
    -handle losing gpu context
*/
