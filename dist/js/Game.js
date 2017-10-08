/**
 * Our game class adds combines all other classes into single 'game' logic
 */

class Game
{
    constructor()
    {
        // Instantiate most important objects
        this.gameScene = new THREE.Scene();
        this.gameMenu = new GameMenu();

        // Instantiate managers
        this.objectMgr = new ObjectManager(this);
        this.physxMgr = new PhysicsManager(this);
        this.sfxMgr = new SoundManager();

        // Debug windows
        this.stats = new StatsWindow();

        // Other
        this.clock = new THREE.Clock(true);
        this.clockTime = 0;
        this.clockDelta = 0;
        this.gameControls = new GameControls();
        //this.rayCaster = new THREE.Raycaster();
        this.skyBox = new Skybox(1000, 1000, 1000, ...GameContent.SkyboxTexures);
        this.gameRenderer = new GameRenderer("game");
        this.debugMode = false;
        this.stats.update(this.debugMode);
        this.mousePos = new THREE.Vector2();

        // Events
        window.addEventListener('resize', this.windowResize.bind(this), false);
        window.addEventListener('keydown', this.keyDown.bind(this), false);
        window.addEventListener('mousemove', this.mouseMove.bind(this), false);
        window.addEventListener('mousedown', this.mouseDown.bind(this), false);
        window.addEventListener('mouseup', this.mouseUp.bind(this), false);

        // Render states
        this.activeScene = this.gameScene;
        this.activeCamera = this.gameControls.camera;

        this.renderStates = {
            Menu: new RenderState("GameMenu", this.gameMenu.scene, this.gameMenu.controls.camera),
            Game: new RenderState("Game", this.gameScene, this.gameControls.camera)
        };
        this.renderStates.Menu.activateCallback = function()
        {
            this.gameMenu.active = true;
            this.windowResize.call(this);
        }.bind(this);
        this.renderStates.Game.activateCallback = function()
        {
            this.gameMenu.active = false;
            this.windowResize.call(this);
        }.bind(this);
    }

    mouseDown(e)
    {
        e.preventDefault();
    }

    mouseUp(e)
    {
        e.preventDefault();
    }

    mouseMove(e)
    {
        e.preventDefault();
        this.mousePos.x =  ( e.clientX / window.innerWidth  ) * 2 - 1;
        this.mousePos.y = -( e.clientY / window.innerHeight ) * 2 + 1;

        // var mouse = this.mousePos;
        // var camera = this.gameControls.camera;
        // var pivot = this.objectMgr.objects.Keu.pivot;
        //
        // // get the world position of the mouse!!
        // var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        // vector.unproject( camera );
        // var dir = vector.sub( camera.position ).normalize();
        // var distance = (pivot.position.z - camera.position.z) / dir.z;
        // var pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
        // // ^ the position
        //
        // // var quaternion = new THREE.Quaternion().setFromAxisAngle(GameUtils.yAxis, pivot.position.clone().angleTo(pos));
        // // quaternion.multiplyQuaternions(quaternion.normalize(), pivot.quaternion).normalize();
        // // //quaternion.setFromUnitVectors( , pos.normalize() );
        // // pivot.setRotationFromQuaternion(quaternion);
        //
        // var angle = pivot.position.angleTo(pos);
        // pivot.rotation.y = angle;
        // //pivot.rotation.applyAxisAngle(GameUtils.yAxis, angle);
    }

    windowResize(e)
    {
        this.activeCamera.aspect = window.innerWidth / window.innerHeight;
        this.activeCamera.updateProjectionMatrix();
        this.gameRenderer.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    keyDown(e)
    {
        let key =  e.charCode ? e.charCode : e.keyCode ? e.keyCode: e.which;
        if (key === 112 || key === "f1") // debug
        {
            e.preventDefault();
            // toggle debug
            this.debugMode = !this.debugMode;
            this.stats.update(this.debugMode);
            let objs = this.objectMgr.objects;
            objs.PoolTable.fullWall.material.wireframe = this.debugMode;
            objs.PoolTable.fullWall.material.needsUpdate = true;
            objs.PoolTable.tableMesh.material.wireframe = this.debugMode;
            objs.PoolTable.tableMesh.material.needsUpdate = true;
            // for(let ball of this.objectMgr.objects.PoolBalls)
            // {
            //     ball.mesh.material.wireframe = this.debugMode;
            //     ball.mesh.material.needsUpdate = true;
            // }
        }
        if (key === 27 || key === "Escape")
        {
            e.preventDefault();
            this.renderStates.Menu.activate(this);
        }

        var cue = this.objectMgr.objects.Keu;
        if (cue.enabled) // allow rotation during turn
        {
            if (key === 32 || key === "Space")
            {
                Game.instance.objectMgr.objects.Keu.shoot();
            }
            // rotate the cue

            if (key === 65 || key === "A")
            {
                this.objectMgr.objects.Keu.pivot.rotation.y -= GameUtils.toRadians(2);
            }
            if (key === 68 || key === "D")
            {
                this.objectMgr.objects.Keu.pivot.rotation.y += GameUtils.toRadians(2);
            }
        }
    }

    getMouseIntersects()
    {
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.mousePos, this.activeCamera);

        return raycaster.intersectObjects(this.activeScene.children);
    }

    updatePlayerTurn()
    {
        console.log("update turn", this.activePlayer);
        if (this.activePlayer.id === 1)
            this.activePlayer = this.players.Player2;
        else
            this.activePlayer = this.players.Player1;
        this.activePlayer.turn.myTurn = true;
        this.objectMgr.objects.Keu.setEnabled(true);
        //console.log(this.activePlayer);
    }

    init()
    {
        this.objectMgr.setupScene();

        //@todo: beautify this, use ContentManager + PhysicsManager + GameManager

        //this.gameScene.add(new THREE.AmbientLight(0x444444));
        //this.gameScene.add(new THREE.DirectionalLight(0xcccccc, 1));

        this.gameScene.add(this.skyBox);

        // Create the players!
        this.players = {
            Player1: new Player(1),
            Player2: new Player(2)
        };
        this.activePlayer = this.players.Player1;
        this.activePlayer.turn.myTurn = true;

        // With our web worker, load the textures
        var ballWorker = new Worker('js/workers/BallLoaderWorker.js');
        ballWorker.addEventListener('message', e => {
            var b = this.gameScene.getObjectByName(`BALL-${e.data}`);
            b.material.map = ContentManager.LoadTexture(`balls/${e.data}.png`);
            b.material.needsUpdate = true; // required reload
        }, false);

        for(var ball of this.objectMgr.objects.PoolBalls)
        {
            this.gameScene.add(ball.rayHelper);
            this.gameScene.add(ball.boundingBoxHelper);
            //this.gameScene.add(ball.vertexNormalsHelper);
            if (ball.id > 0)
            {
                ballWorker.postMessage(ball.id); // Send data to our worker.
            }
        }

        // Scene lighting
        this.AmbientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.SpotLight = new THREE.SpotLight(0xffff00, 0.85);
        this.SpotLight.position.set(-50, 25, 0);
        this.SpotLight.decay = 2;
        this.SpotLight.penumbra = 0.35;
        this.SpotLight.angle = 0.12;
        this.SpotLight.distance = 100;
        //this.SpotLight.target = this.SpotLight.position.clone();

        //this.SpotLight.target.updateMatrixWorld();
        this.SpotLight.rotation.z = GameUtils.toRadians(45);
        this.SpotLight.updateMatrixWorld(true);
        this.SpotLight.castShadow = true;
        this.SpotLight.shadow.darkness = 1;
        this.SpotLight.shadow.camera.near = 500;
        this.SpotLight.shadow.camera.far = 4000;
        this.SpotLight.shadow.camera.fov = 30;
        this.SpotLight2 = this.SpotLight.clone();
        this.SpotLight2.position.x = 50;

        this.gameScene.add(this.AmbientLight, this.SpotLight, this.SpotLight2);

        // after setting up things...
        this.renderStates.Game.activate(this);
        //this.sfxMgr.GetAndPlayLooped(SoundManager.sounds.Mp3Loop); // play our game sound
    }


    update() // every game loop, we update
    {
        this.clockTime = this.clock.getElapsedTime();
        this.clockDelta = this.clock.getDelta();

        if (this.debugMode)// are we in debug mode?
        {
            this.stats.window.update();
            this.stats.renderWindow.update(this.gameRenderer.renderer);
        }

        if (this.gameMenu.active) // we are in menu.. update things
        {

        }
        else // we are not in menu.. update things
        {
            this.players.Player1.update();
            this.players.Player2.update();

            // Update Tween for animations
            TWEEN.update();

            this.objectMgr.objects.Keu.update(); // update keu
            this.gameControls.controls.update(); // update the game controls
            this.physxMgr.update(); // only update physics when in the game
        }

        this.render(); // render the game
    }

    render()
    {
        //this.gameRenderer.renderer.clear();

        // we call our renderer, with a callback
        this.gameRenderer.render(this, function()
        {
            for(let ball of this.objectMgr.objects.PoolBalls) // loop balls
            {
                ball.render(); // render them
            }
        });
    }
}
