(function($, window, document) {
    // threejs globals
    var scene, camera, renderer;
    //my globals
    var uniforms, sphereMaterial;
    // properties/globals
    var sceneDistance = 100000;
    var lightColor = 0x008080;
    var keysPressed = [];

    $(function() {
        init();
        registerHandlers();
        setUpStarMaterials();

        render();  

        for (let i = 0; i < 1000; i++) {
            let x = (Math.random() - 0.5) * sceneDistance;
            let y = (Math.random() - 0.5) * sceneDistance;
            let z = (Math.random() + 0.5) * sceneDistance;
            let size = Math.round(Math.random() * 100);
            
            addStar(x, y, z, size);
        }
 
    });

    //Initializes all the threejs stuff
    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, sceneDistance);
        renderer = new THREE.WebGLRenderer({ antialias: true, autoclear: true, alpha: true});

        camera.position.z = sceneDistance;
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
            texture1: { type: "t", value: textureLoader.load( "textures/noise.png" ) },
            texture2: { type: "t", value: textureLoader.load( "textures/sunMap.jpg" ) }
        };
        uniforms.texture1.value.wrapS = uniforms.texture1.value.wrapT = THREE.RepeatWrapping;
        uniforms.texture2.value.wrapS = uniforms.texture2.value.wrapT = THREE.RepeatWrapping;

        sphereMaterial = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: $('#vertexShader').text(),
            fragmentShader: $('#fragmentShader').text()
        });
    }

    function addStar(x, y, z, size) {
        var sphereGeom = new THREE.SphereBufferGeometry(size, 64, 64);

        var sphereMesh = new THREE.Mesh(sphereGeom, sphereMaterial);
        sphereMesh.position.set(x, y, z);
        sphereMesh.rotation.set(x,y,z);
        scene.add(sphereMesh);
    };    

    var frame = 0;
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
            camera.rotateX(0.04);
        }
        if (keysPressed[87]) { //w
            camera.translateZ(-5);
        }
        if (keysPressed[69]) { //e
            camera.rotateX(-0.04);
        }
        if (keysPressed[65]) { //a
            camera.rotateY(0.04);
        }
        if (keysPressed[83]) { //s
            camera.translateZ(5);
        }
        if (keysPressed[68]) { //d
            camera.rotateY(-0.04);
        }
    };
}(window.jQuery, window, document));




/*TODO:
    -solar magnetic emmision effect
    -use real star data
    -find a way to map slightly different spectra
    -accelerate movement
    -click to zoom in on a star
    -display star info on hover (ajax)
    -particalize stars that are out of the frustrum
    -handle non webgl browsers
    -handle losing gpu context
*/
