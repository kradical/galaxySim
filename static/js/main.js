(function($, window, document) {
    // threejs globals
    var scene, camera, renderer;
    // my globals
    var uniforms, starMaterial,
        frame = 0, // frame counter for animation loop
        cameraVelocity = 0; // camera velocity for smoothing movement
    // properties/globals
    // base unit is one hundredth of a solar radius
    var sceneDistance = 4.3840736e+12; // change this to visible human eye distance
    var scaleFactor = 4.43344480069e+5; // convert parsecs to 100th solar radiuses
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
            var geometry = new THREE.BufferGeometry();
            var vertices = new Float32Array(starData.length * 3);
            var magnitudes = new Float32Array(starData.length);
            
            for (let i = 0; i < starData.length; i++) {
                magnitudes[i] = starData[i].absmag;
                vertices[3 * i] = starData[i].x * scaleFactor;
                vertices[3 * i + 1] = starData[i].y * scaleFactor;
                vertices[3 * i + 2] = starData[i].z * scaleFactor;

                //addStar(star.x / scaleFactor, star.y / scaleFactor, star.z / scaleFactor, 10000);
                //draw star if close enough.
            }

            geometry.addAttribute('position', new THREE.BufferAttribute(vertices, 3));
            geometry.addAttribute('absmag', new THREE.BufferAttribute(magnitudes, 1));
            var material = new THREE.ShaderMaterial({
                vertexShader: $('#vertexShader2').text(),
                fragmentShader: $('#fragmentShader2').text()
            })
            var points = new THREE.Points(geometry, material);
            scene.add(points);
        }
    });

    //Initializes all the threejs stuff
    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, sceneDistance);
        renderer = new THREE.WebGLRenderer({ antialias: true, autoclear: true, alpha: true});

        camera.position.z = 100 * 214.9425287356;
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
            cameraVelocity -= 1;
        }
        if (keysPressed[83]) { //s
            cameraVelocity += 1;
        }
        if (!(keysPressed[83] || keysPressed[87])) {
            let newVelocity = 0.90 * cameraVelocity;
            cameraVelocity = Math.abs(newVelocity) > 0.001 ? newVelocity : 0;
        }
        camera.translateZ(cameraVelocity);
    };
}(window.jQuery, window, document));


/*TODO:
    -navigation:
      -make movement reasonable on interstellar scale
      -mouse interactions:
        -right click to change camera angle, 
        -scroll to zoom, 
        -delay hover for info
        -left click to zoom
    -star graphic:
      -solar magnetic emmision effect
      -make sun spots more realistic
      -find a way to color different spectra
      -particalize stars that are out of the frustrum
        (only render sphere when with x distance of a star)
    -hud/ui:
      -add initial loading spinner and description
      -add skipable short interactive intro
      -add a home buttom
      -add velocity display, speed display, position display
      -add distance from sol, distance to nearest star direction to nearest star, nearest stars name or id
    -handle non webgl browsers
    -handle losing gpu context
    -add solar system planets
    -add exoplanets
    -procedureally generate the rest of the galaxy
    -change from a visualization into a simulation
    -add music
*/
