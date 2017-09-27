class Physics
{

}

class GameManager
{

}

class ObjectManager
{

}

//@todo: Ball, Cue

class ContentManager
{
    static get TextureLoader()
    {
        return new THREE.TextureLoader();
    }

    static SkyboxMesh(img)
    {
        return new THREE.MeshBasicMaterial( { map: ContentManager.TextureLoader.load('img/skybox/' + img + '.jpg'), side: THREE.DoubleSide });
    }
}

class Game
{
    constructor()
    {
        this.stats = new StatsWindow();

        this.rStats = new THREEx.RendererStats();
        this.rStats.domElement.style.position	= 'absolute';
        this.rStats.domElement.style.left	= '0px';
        this.rStats.domElement.style.top	= '48px';
        document.body.appendChild( this.rStats.domElement );
        //this.stats.changeState(stats.states.MS); // change to MS window
        this.gameCamera = new GameCamera();
        this.gameControls = new GameControls(this.gameCamera.camera);
        this.scene = new THREE.Scene();
        //this.colGroup = new THREE.Group();
        //this.rayCaster = new THREE.Raycaster();
        this.skyBox = new Skybox(this.textureLoader);
        this.gameRenderer = new GameRenderer("game");

        // Events
        window.addEventListener('resize', function() {

            this.gameCamera.camera.aspect = window.innerWidth / window.innerHeight;
            this.gameCamera.camera.updateProjectionMatrix();
            this.gameRenderer.renderer.setSize( window.innerWidth, window.innerHeight );

        }.bind(this), false );
    }

    init()
    {
        //@todo: beautify this, use ContentManager + PhysicsManager + GameManager

        this.scene.add(new THREE.AmbientLight( 0xFFFFFF, 0.1 ) );
        // this.scene.add(new THREE.AmbientLight(0x444444));
        // this.scene.add(new THREE.DirectionalLight(0xcccccc, 1));

        const light = new THREE.SpotLight(0xffffff);
        light.position.set( 100, 1000, 100 );
        light.castShadow = true;

        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        light.shadow.camera.near = 500;
        light.shadow.camera.far = 4000;
        light.shadow.camera.fov = 30;

        this.scene.add(light);

        this.scene.add(this.skyBox);

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
        const cube = new THREE.Mesh( geometry, material );
        cube.receiveShadow = true;
        this.scene.add( cube );
    }

    render()
    {
        this.gameRenderer.render(this, function()
        {
            //callback
            this.gameControls.controls.update();
            this.stats.window.update();
            this.rStats.update(this.gameRenderer.renderer);
        });
    }
}

class StatsWindow
{
    constructor()
    {
        this.window = new Stats();
        this.window.showPanel(0);
        document.body.appendChild(this.window.dom);

        // The possible window states
        this.states = {
            FPS:   new this.StatState(0, "FPS"),
            MS:    new this.StatState(1,  "MS"),
            //MB:    new this.StatState(2,  "MB")
            // 3+ custom
        };
    }

    // Can change the window state
    changeState(state)
    {
        if (state && state.constructor.name === this.StatState.name)
        {
            this.window.showPanel(state.value);
        }
    };

    // Information of a window state
    static get StatState()
    {
        return class
        {
            constructor(value, name)
            {
                this.value = value;
                this.name = name;
            }
        }
    }

    get StatState()
    {
        return StatsWindow.StatState;
    }
}

class GameCamera
{
    constructor()
    {
        this.camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
        this.camera.position.z = 5;
    }
}

class GameControls
{
    constructor(camera)
    {
        this.controls = new THREE.OrbitControls(camera);

        // Settings
        this.controls.maxPolarAngle = Math.PI / 2 - 0.30;
        this.controls.maxDistance = 50;
        this.controls.minDistance = 10;

        // Optional
        this.controls.enablePan = false;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = 0.5;
        this.controls.enableDamping = true;
    }
}

class GameRenderer
{
    constructor(domContainer)
    {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            shadowMapEnabled: true,
            shadowMapType: THREE.PCFSoftShadowMap
        });
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        document.getElementById(domContainer).appendChild(this.renderer.domElement);
    }

    render(gameInst, callback)
    {
        if (gameInst instanceof Game)
        {
            this.renderer.render(gameInst.scene, gameInst.gameCamera.camera);
            if (callback)
                callback.call(gameInst);
        }
    };
}

class Skybox
{
    constructor()
    {
        const geometry = new THREE.CubeGeometry(1000, 1000, 1000);
        const materials =
            [
                ContentManager.SkyboxMesh('posx'),
                ContentManager.SkyboxMesh('negx'),
                ContentManager.SkyboxMesh('posy'),
                ContentManager.SkyboxMesh('negy'),
                ContentManager.SkyboxMesh('posz'),
                ContentManager.SkyboxMesh('negz'),
            ];

        // this.boxMaterial = new THREE.MeshFaceMaterial(this.materials.map(mesh => mesh.mesh));
        return new THREE.Mesh(geometry, materials);
    }
}

// Init
let game = new Game();
game.init();

// Test change stats:
game.stats.changeState(game.stats.states.MS);

function animate()
{
    requestAnimationFrame( animate );
    game.render();
}

animate();



