class Physics
{

}

class GameManager
{

}

class ObjectManager
{

}

class Ball {
    constructor(x, z) {

        this.geometry = new THREE.SphereGeometry(0.3, 36, 16);
        this.material = new THREE.MeshPhongMaterial({color: 0xffffff, side:THREE.FrontSide});

        this.ballMesh = new THREE.Mesh(this.geometry, this.material);

        this.ballMesh.position.y = 0.66;
        this.ballMesh.position.x = x;
        this.ballMesh.position.z = z;

        return this.ballMesh;
    }
}


class PoolTable
{
    constructor()
    {
        let colGroup = new THREE.Group(),
            clothTexture,
            woodTexture,
            tableMesh,
            tableWall1,
            tableWall2,
            tableWall3,
            tableWall4;

        makeTextures();
        makeMeshes();
        setPositions();

        function makeTextures()
        {
            clothTexture = ContentManager.LoadTexture("cloth.jpg");
            woodTexture = ContentManager.LoadTexture("wood.jpg");

            clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
            clothTexture.repeat.set(2,2);

            woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
            woodTexture.repeat.set(1,1);
        }

        function makeMeshes()
        {
            tableMesh = makeMesh(27.2, 0.7, 14.4, 1, clothTexture);
            tableWall1 = makeMesh(28.2, 1.2, 0.5, 1, woodTexture);
            tableWall2 = tableWall1.clone();
            tableWall3 = makeMesh(0.5, 1.2, 14.4, 1, woodTexture);
            tableWall4 = tableWall3.clone();

            function makeMesh(a, b, c, d, texturemap)
            {
                return new THREE.Mesh(
                    new THREE.BoxGeometry(a, b, c, d, 0),
                    new THREE.MeshPhongMaterial( {shading: THREE.FlatShading, map:texturemap, side: THREE.FrontSide } )
                );
            }
        }

        function setPositions()
        {
            tableMesh.position.y = 0;

            tableWall1.position.y = 0.25;
            tableWall1.position.z = 7.45;

            tableWall2.position.y = 0.25;
            tableWall2.position.z = -7.45;

            tableWall3.position.x = 13.85;
            tableWall3.position.y = 0.25;

            tableWall4.position.x = -13.85;
            tableWall4.position.y = 0.25;
        }

        // Combine and return
        colGroup.add (tableMesh, tableWall1, tableWall2, tableWall3, tableWall4);
        return colGroup;
    }
}

//@todo: Ball, Cue

class ContentManager
{
    static get TextureLoader()
    {
        return new THREE.TextureLoader();
    }

    static LoadTexture(path)
    {
        return ContentManager.TextureLoader.load('img/' + path);
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
        //this.stats.changeState(stats.states.MS); // change to MS window
        this.poolTable = new PoolTable();

        // Balls
        this.ball1 = new Ball(6.8, 0);
        this.ball2 = new Ball(7.35, -0.3);
        this.ball3 = new Ball(7.35, 0.3);
        this.ball4 = new Ball(7.9, -0.6);
        this.ball5 = new Ball(7.9, 0);
        this.ball6 = new Ball(7.9, 0.6);
        this.ball7 = new Ball(8.45, -0.9);
        this.ball8 = new Ball(8.45, -0.3);
        this.ball9 = new Ball(8.45, 0.3);
        this.ball10 = new Ball(8.45, 0.9);
        this.ball11 = new Ball(9, -1.2);
        this.ball12 = new Ball(9, -0.6);
        this.ball13 = new Ball(9, 0);
        this.ball14 = new Ball(9, 0.6);
        this.ball15 = new Ball(9, 1.2);

        this.gameCamera = new GameCamera();
        this.gameControls = new GameControls(this.gameCamera.camera);
        this.scene = new THREE.Scene();
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
        //this.scene.add(new THREE.AmbientLight(0x444444));
        //this.scene.add(new THREE.DirectionalLight(0xcccccc, 1));

        const light = new THREE.SpotLight(0xffffff);
        light.position.set( 100, 1000, 100 );
        light.castShadow = true;

        light.shadow.mapSize.width = 1024;
        light.shadow.mapSize.height = 1024;

        light.shadow.camera.near = 500;
        light.shadow.camera.far = 4000;
        light.shadow.camera.fov = 30;

        this.scene.add(light);

        this.scene.add(this.poolTable);

        this.scene.add(this.ball1);
        this.scene.add(this.ball2);
        this.scene.add(this.ball3);
        this.scene.add(this.ball4);
        this.scene.add(this.ball5);
        this.scene.add(this.ball6);
        this.scene.add(this.ball7);
        this.scene.add(this.ball8);
        this.scene.add(this.ball9);
        this.scene.add(this.ball10);
        this.scene.add(this.ball11);
        this.scene.add(this.ball12);
        this.scene.add(this.ball13);
        this.scene.add(this.ball14);
        this.scene.add(this.ball15);

        this.scene.add(this.skyBox);
    }

    render()
    {
        this.gameRenderer.render(this, function()
        {
            //callback
            this.gameControls.controls.update();
            this.stats.window.update();
            this.stats.rStats.update(this.gameRenderer.renderer);
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

        // rStats
        this.rStats = new THREEx.RendererStats();
        this.rStats.domElement.style.position	= 'absolute';
        this.rStats.domElement.style.left	= '0px';
        this.rStats.domElement.style.top	= '48px';
        document.body.appendChild(this.rStats.domElement);
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
        this.camera.position.z = 20;
        this.camera.position.y = 25;
    }
}

class GameControls
{
    constructor(camera)
    {
        this.controls = new THREE.OrbitControls(camera);

        // Settings
        this.controls.maxPolarAngle = Math.PI / 2 - 0.1;
        this.controls.maxDistance = 75;
        this.controls.minDistance = 25;
        this.controls.rotateSpeed = .6;

        // Optional
        // enable panning while debugging for more control
        this.controls.enablePan = false;
        this.controls.autoRotate = true;
        this.controls.autoRotateSpeed = .5;
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

SoundManager.GetAndPlayLooped(SoundManager.sounds.Mp3Loop);
animate();



