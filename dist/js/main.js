function Game()
{
    // SETUP
    this.stats = new StatsWindow(); // make stats window
    //this.stats.changeState(stats.states.MS); // change to MS window
    // Camera
    this.gameCamera = new GameCamera();
    // controls
    this.gameControls = new GameControls(this.gameCamera.camera);
    // scene/groups
    this.scene = new THREE.Scene();
    this.colGroup = new THREE.Group();
    // raycaster
    this.rayCaster = new THREE.Raycaster();
    // texture loader
    this.textureLoader = new THREE.TextureLoader();
    // skybox
    this.skyBox = new Skybox(this.textureLoader);
    // renderer
    this.gameRenderer = new GameRenderer("game");

    // Events
    window.addEventListener('resize', function(game) {

        game.gameCamera.camera.aspect = window.innerWidth / window.innerHeight;
        game.gameCamera.camera.updateProjectionMatrix();

        game.gameRenderer.renderer.setSize( window.innerWidth, window.innerHeight );

    }, false );


    // Start
    this.scene.add(new THREE.AmbientLight( 0xFFFFFF, 0.3 ) );
    this.scene.add(new THREE.AmbientLight(0x444444));
    this.scene.add(new THREE.DirectionalLight(0xcccccc, 1));
    this.scene.add(this.skyBox);
    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    var cube = new THREE.Mesh( geometry, material );
    this.scene.add( cube );
    this.render = function()
    {
        this.gameRenderer.render(this, function()
        {
        });
    };

}
// CLASSES

function StatsWindow()
{
    this.window = new Stats();
    this.window.showPanel(0);
    document.body.appendChild(this.window.dom);

    // The possible window states
    this.states = {
        FPS:    new StatState(0, "FPS"),
        MS:    new StatState(1,  "MS"),
        MB:    new StatState(2,  "MB")
        // 3+ custom
    };
    this.states.prototype = Array.prototype;

    // Can change the window state
    this.changeState = function(state)
    {
        if (state && state instanceof StatState)
        {
            this.window.showPanel(state.value);
        }
    };

    // Information of a window state
    function StatState(value, name)
    {
        this.value = value;
        this.name = name;
        this.prototype = Object.prototype;
    }
}

function GameCamera()
{
    this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
    this.camera.position.z = 5;
}

function GameControls(camera)
{
    this.controls = new THREE.OrbitControls(camera);
    this.controls.maxPolarAngle = Math.PI / 2 - 0.30;
    this.controls.maxDistance = 50;
    this.controls.minDistance = 10;
}

function GameRenderer(domContainer)
{
    this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    });
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    document.getElementById(domContainer).appendChild(this.renderer.domElement);

    this.render = function(gameInst, callback)
    {
        if (gameInst instanceof Game)
        {
            requestAnimationFrame(this.render);
            this.renderer.render(gameInst.scene, gameInst.gameCamera.camera);
            if (callback)
                callback.call(gameInst);
            gameInst.stats.window.update();
        }
    };
}

function Skybox(textureLoader)
{
    this.textureLoader = textureLoader;
    this.geometry = new THREE.CubeGeometry(1000, 1000, 1000);

    this.materials =
        [
            new SkyBoxMesh(textureLoader, "img/skybox/posx.jpg", THREE.DoubleSide),
            new SkyBoxMesh(textureLoader, "img/skybox/posy.jpg", THREE.DoubleSide),
            new SkyBoxMesh(textureLoader, "img/skybox/negy.jpg", THREE.DoubleSide),
            new SkyBoxMesh(textureLoader, "img/skybox/posz.jpg", THREE.DoubleSide),
            new SkyBoxMesh(textureLoader, "img/skybox/negz.jpg", THREE.DoubleSide),
        ];

    this.boxMaterial = new THREE.MeshFaceMaterial(this.materials.map(mesh => mesh.mesh));
    return new THREE.Mesh(this.geometry, this.boxMaterial);

    function SkyBoxMesh(textureLoader, imgPath, tSide)
    {
        this.mesh = new THREE.MeshBasicMaterial( { map: textureLoader.load( imgPath ), side: tSide });
    }
}

// Init
let game = new Game();

function animate()
{
    requestAnimationFrame( animate );
    game.render();
}

animate();



