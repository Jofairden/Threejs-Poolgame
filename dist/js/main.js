/**
 * Contains physics logic used in the game
 */
class PhysicsManager
{

}

class GameUtils {

    static get xAxis() {
        return new THREE.Vector3(1, 0, 0);
    }

    static get yAxis() {
        return new THREE.Vector3(0, 1, 0);
    }

    static get zAxis() {
        return new THREE.Vector3(0, 0, 1);
    }

    static toRadians(deg)
    {
        return deg * Math.PI / 180;
    }

    static toDegrees(rad)
    {
        return rad * 180 / Math.PI;
    }

    // Rotate an object around an arbitrary axis in object space
    static rotateAroundObjectAxis(object, axis, radians) {
        GameUtils.rotObjectMatrix = new THREE.Matrix4();
        GameUtils.rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

        // old code for Three.JS pre r54:
        // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
        // new code for Three.JS r55+:
        object.matrix.multiply(GameUtils.rotObjectMatrix);

        // old code for Three.js pre r49:
        // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
        // old code for Three.js r50-r58:
        // object.rotation.setEulerFromRotationMatrix(object.matrix);
        // new code for Three.js r59+:
        object.rotation.setFromRotationMatrix(object.matrix);
    }

    // Rotate an object around an arbitrary axis in world space
    static rotateAroundWorldAxis(object, axis, radians) {
        GameUtils.rotWorldMatrix = new THREE.Matrix4();
        GameUtils.rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

        // old code for Three.JS pre r54:
        //  rotWorldMatrix.multiply(object.matrix);
        // new code for Three.JS r55+:
        GameUtils.rotWorldMatrix.multiply(object.matrix);                // pre-multiply

        object.matrix = GameUtils.rotWorldMatrix;

        // old code for Three.js pre r49:
        // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
        // old code for Three.js pre r59:
        // object.rotation.setEulerFromRotationMatrix(object.matrix);
        // code for r59+:
        object.rotation.setFromRotationMatrix(object.matrix);
    }
}
GameUtils.rotObjectMatrix = 0;
GameUtils.rotWorldMatrix = 0;

class GameManager
{

}

/**
 * The ObjectManager handles all objects in our game scene, from instantiating and adding them to the scene, to applying physics force to them.
 */
class ObjectManager
{
    constructor(gameScene)
    {
        this.gameScene = gameScene;

        //@todo: figure out better way for this (constructors dont take object)
        let l1 = new THREE.AmbientLight(0xffffff, 0.1);
        let l2 = new THREE.SpotLight(0xffffff, 0.65);
        l2.position.set(20,15,3);
        l2.castShadow = true;
        l2.shadow.darkness = 0.5;
        l2.shadow.mapSize.width = 1024;
        l2.shadow.mapSize.height = 1024;
        l2.shadow.camera.near = 0.01;
        l2.shadow.camera.far = 25;

        let l3 = l2.clone();
        l3.position.x = -20;

        this.l4 = l2.clone();
        this.l4.position.x = 0;
        this.l4.position.y = 35;

        // l2.shadow.camera.near = 500;
        // l2.shadow.camera.far = 4000;
        // l2.shadow.camera.fov = 30;

        this.objects = {
            PoolTable:
                [
                    new PoolTable()
                ],
            PoolBalls:
                [
                    new Ball(6.8, 0),
                    new Ball(7.35, -0.3),
                    new Ball(7.35, 0.3),
                    new Ball(7.9, -0.6),
                    new Ball(7.9, 0),
                    new Ball(7.9, 0.6),
                    new Ball(8.45, -0.9),
                    new Ball(8.45, -0.3),
                    new Ball(8.45, 0.3),
                    new Ball(8.45, 0.9),
                    new Ball(9, -1.2),
                    new Ball(9, -0.6),
                    new Ball(9, 0),
                    new Ball(9, 0.6),
                    new Ball(9, 1.2),
                ],
            Lights:
                [
                    l1,
                    //l2,
                    //l3,
                    this.l4,
                ],
            LightHelpers:
                [
                    new THREE.CameraHelper(this.l4.shadow.camera)
                ]
        };
        this.objects[Symbol.iterator] = function()
        {
            var keys = [];
            var ref = this;
            for (var key in this) {
                //note:  can do hasOwnProperty() here, etc.
                keys.push(key);
            }

            return {
                next: function() {
                    if (this._keys && this._obj && this._index < this._keys.length) {
                        var key = this._keys[this._index];
                        this._index++;
                        return { key: key, value: this._obj[key], done: false };
                    } else {
                        return { done: true };
                    }
                },
                _index: 0,
                _keys: keys,
                _obj: ref
            };
        }
    }

    // ctorObj(child)
    // {
    //     return $.extend(true, Object.create(Object.getPrototypeOf(child)), child);
    // }

    /**
     * Adds specified object to the game scene
     * @param {THREE.Object3D} obj - The object
     */
    addToScene(obj)
    {
        if (obj instanceof THREE.Object3D)
            this.gameScene.add(obj);
    }

    // sets up scene
    setupScene()
    {
        // Add objs
        for(let arr of this.objects)
        {
            for(let obj of arr)
            {
                this.addToScene(obj);
                console.log(obj);
            }
        }
    }

    // clears scene
    clearScene()
    {
        while(this.gameScene.children.length > 0)
        {
            disposeHierarchy(this.gameScene.children[0], disposeNode);
            this.gameScene.remove(this.gameScene.children[0]);
        }

        function disposeNode(node)
        {
            if (node instanceof THREE.Mesh)
            {
                if (node.geometry)
                {
                    node.geometry.dispose();
                }

                if (node.material)
                {
                    if (node.material instanceof THREE.MeshFaceMaterial)
                    {
                        $.each (node.material.materials, function (idx, mtrl)
                        {
                            if (mtrl.map)           mtrl.map.dispose();
                            if (mtrl.lightMap)      mtrl.lightMap.dispose();
                            if (mtrl.bumpMap)       mtrl.bumpMap.dispose();
                            if (mtrl.normalMap)     mtrl.normalMap.dispose();
                            if (mtrl.specularMap)   mtrl.specularMap.dispose();
                            if (mtrl.envMap)        mtrl.envMap.dispose();

                            mtrl.dispose(); // disposes any programs associated with the material
                        });
                    }
                    else
                    {
                        if (node.material.map)          node.material.map.dispose();
                        if (node.material.lightMap)     node.material.lightMap.dispose();
                        if (node.material.bumpMap)      node.material.bumpMap.dispose();
                        if (node.material.normalMap)    node.material.normalMap.dispose();
                        if (node.material.specularMap)  node.material.specularMap.dispose();
                        if (node.material.envMap)       node.material.envMap.dispose();

                        node.material.dispose(); // disposes any programs associated with the material
                    }
                }
            }
        }

        // recursive dispose
        function disposeHierarchy(node, callback)
        {
            for (var i = node.children.length - 1; i >= 0; i--)
            {
                var child = node.children[i];
                disposeHierarchy (child, callback);
                callback(child);
            }
        }
    }

    // clears, then setup
    renewScene()
    {
        this.clearScene();
        this.setupScene();
    }
}

/**
 * Defines a ball object
 */
class Ball {
    constructor(x, z) {

        this.geometry = new THREE.SphereGeometry(0.3, 36, 16);
        this.material = new THREE.MeshPhongMaterial({color: 0xffffff, side:THREE.FrontSide});

        this.ballMesh = new THREE.Mesh(this.geometry, this.material);

        this.ballMesh.position.y = 1;
        this.ballMesh.position.x = x;
        this.ballMesh.position.z = z;
        this.ballMesh.castShadow = true;
        this.ballMesh.receiveShadow = true;

        return this.ballMesh;
    }
}

/**
 * Defines the pool table object (the table we play on)
 */
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
                    new THREE.MeshPhongMaterial( {flatShading: true, map:texturemap, side: THREE.FrontSide } )
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

        tableMesh.receiveShadow = true;

        // Combine and return
        colGroup.add (tableMesh, tableWall1, tableWall2, tableWall3, tableWall4);
        return colGroup;
    }
}

//@todo: Ball, Cue

/**
 * The GameContent class contains static game content information
 */
class GameContent
{
    static get SkyboxTexures() {
        return [
            "posx",
            "negx",
            "posy",
            "negy",
            "posz",
            "negz"
        ]
    }
}

/**
 * The content manager handles all loading and integrating of 'literal' content for the game (i.e. textures)
 */
class ContentManager
{
    /**
     * The static THREE Texture loader
     * Note: THREE.ImageUtils.loadTexture is being deprecated. Use THREE.TextureLoader() instead.
     * @get ContentManager.TextureLoader
     * @returns {TextureLoader} static TextureLoader
     * @constructor
     */
    static get TextureLoader()
    {
        return new THREE.TextureLoader();
    }

    /**
     * Loads a texture using the static TextureLoader
     * Uses the /img/ directory as root
     * @param {string} path - Path to texture
     * @constructor
     */
    static LoadTexture(path)
    {
        return ContentManager.TextureLoader.load('img/' + path);
    }

    /**
     * Generates a THREE.MeshBasicMaterial for a Skybox face, automatically loading the texture with the provided path
     * @param {string} path - Path to texture, using root /img/skybox/
     * @returns {MeshBasicMaterial} Generated Skybox 'face' (mesh)
     * @constructor
     */
    static SkyboxMesh(path)
    {
        // Optimization: do not render the front side of our Skybox, it remains unseen
        return new THREE.MeshBasicMaterial( { map: ContentManager.TextureLoader.load('img/skybox/' + path + '.jpg'), side: THREE.BackSide });
    }
}

/**
 * Our game class adds combines all other classes into single 'game' logic
 */
class Game
{
    constructor()
    {
        // Instantiate most important objects
        this.gameScene = new THREE.Scene();

        // Instantiate managers
        this.objectMgr = new ObjectManager(this.gameScene);
        this.physxMgr = new PhysicsManager();

        // Debug windows
        // @todo: add key toggle
        this.stats = new StatsWindow();

        this.gameControls = new GameControls();
        //this.rayCaster = new THREE.Raycaster();
        this.skyBox = new Skybox(1000, 1000, 1000, ...GameContent.SkyboxTexures);
        this.gameRenderer = new GameRenderer("game");

        this.debugMode = false;

        // Events
        window.addEventListener('resize', function(e) {

            this.gameControls.camera.aspect = window.innerWidth / window.innerHeight;
            this.gameControls.camera.updateProjectionMatrix();
            this.gameRenderer.renderer.setSize( window.innerWidth, window.innerHeight );

        }.bind(this), false);

        window.addEventListener('keypress', function(e)
        {
            let key = e.keyCode ? e.keyCode : e.which;
            if (key === 112 || key === "f1") // debug
            {
                // toggle debug
                this.debugMode = !this.debugMode;
                this.stats.update(this.debugMode);
            }
        }.bind(this), false);
    }

    init()
    {
        //@todo: beautify this, use ContentManager + PhysicsManager + GameManager

        //this.gameScene.add(new THREE.AmbientLight(0x444444));
        //this.gameScene.add(new THREE.DirectionalLight(0xcccccc, 1));

        this.gameScene.add(this.skyBox);
    }

    render()
    {
        this.gameRenderer.render(this, function()
        {
            //callback
            this.gameControls.controls.update();

            // optimization: only update on debug mode
            if (this.debugMode)
            {
                this.stats.window.update();
                this.stats.renderWindow.update(this.gameRenderer.renderer);
            }
        });
    }
}

class StatsWindow
{
    constructor()
    {
        this.window = new Stats();
        this.window.showPanel(0);
        document.body.appendChild(this.window.domElement);

        // The possible window states
        this.states = {
            FPS:   new this.StatState(0, "FPS"),
            MS:    new this.StatState(1,  "MS"),
            //MB:    new this.StatState(2,  "MB")
            // 3+ custom
        };

        // render stats window
        this.renderWindow = new THREEx.RendererStats();
        this.renderWindow.domElement.style.position	= 'absolute';
        this.renderWindow.domElement.style.left	= '0px';
        this.renderWindow.domElement.style.top	= '48px';
        document.body.appendChild(this.renderWindow.domElement);

        this.shown = false;
        this.hide();
    }

    update(debug)
    {
        if (debug)
            this.show();
        else
            this.hide();
    }

    hide()
    {
        this.shown = false;
        this.window.domElement.style.visibility = 'hidden';
        this.window.domElement.style.display = 'none';
        this.renderWindow.domElement.style.visibility = 'hidden';
        this.renderWindow.domElement.style.display = 'none';
    }

    show()
    {
        this.shown = true;
        this.window.domElement.style.visibility = 'visible';
        this.window.domElement.style.display = 'inline-block';
        this.renderWindow.domElement.style.visibility = 'visible';
        this.renderWindow.domElement.style.display = 'inline-block';
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

class GameControls
{
    constructor()
    {
        this.camera = makeGameCamera();
        this.resetCamera();
        this.controls = new THREE.OrbitControls(this.camera);

        // Settings
        this.controls.maxPolarAngle = Math.PI / 2 - 0.1;
        //this.controls.maxDistance = 75; // 75
        //this.controls.minDistance = 25; // 25
        this.controls.rotateSpeed = .6; // .6

        // Optional
        // enable panning while debugging for more control
        this.controls.enablePan = true;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = .5;
        this.controls.enableDamping = true;

        function makeGameCamera()
        {
            return new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        }
    }

    resetCamera()
    {
        this.camera.position.x = 0;
        this.camera.position.y = 25;
        this.camera.position.z = 20;
    }
}

/**
 * The GameRenderer controls the WebGLRenderer
 */
class GameRenderer
{
    constructor(domContainer)
    {
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            shadowMapEnabled: true,
            shadowMapType: THREE.PCFSoftShadowMap,
            physicallyCorrectLights: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.getElementById(domContainer).appendChild(this.renderer.domElement);
    }

    render(gameInst, callback)
    {
        if (gameInst instanceof Game)
        {
            this.renderer.render(gameInst.gameScene, gameInst.gameControls.camera);
            if (callback)
                callback.call(gameInst);
        }
    };
}

class Skybox
{
    constructor(a,b,c,...meshes)
    {
        const geometry = new THREE.CubeGeometry(a,b,c);
        const materials =
            [
                ContentManager.SkyboxMesh(meshes[0]),
                ContentManager.SkyboxMesh(meshes[1]),
                ContentManager.SkyboxMesh(meshes[2]),
                ContentManager.SkyboxMesh(meshes[3]),
                ContentManager.SkyboxMesh(meshes[4]),
                ContentManager.SkyboxMesh(meshes[5]),
            ];

        // this.boxMaterial = new THREE.MeshFaceMaterial(this.materials.map(mesh => mesh.mesh));
        return new THREE.Mesh(geometry, materials);
    }
}

// Init
let game = new Game();
game.init();
// test renew, works!
game.objectMgr.renewScene();
game.init(); // uncomment, see what happens

// Test change stats:
// game.stats.changeState(game.stats.states.MS);

function animate()
{
    requestAnimationFrame( animate );

    // @todo: why doesnt this work?
    GameUtils.rotateAroundWorldAxis(game.objectMgr.l4, GameUtils.yAxis, GameUtils.toRadians(1));

    game.render();
}

animate();
SoundManager.GetAndPlayLooped(SoundManager.sounds.Mp3Loop);



