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
        this.objectMgr = new ObjectManager(this.gameScene);
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
        window.addEventListener('keypress', this.triggerDebug.bind(this), false);
        window.addEventListener('mousemove', this.mouseMove.bind(this), false);

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

    mouseMove(e)
    {
        this.mousePos.x =  ( e.clientX / window.innerWidth  ) * 2 - 1;
        this.mousePos.y = -( e.clientY / window.innerHeight ) * 2 + 1;
    }

    windowResize(e)
    {
        this.activeCamera.aspect = window.innerWidth / window.innerHeight;
        this.activeCamera.updateProjectionMatrix();
        this.gameRenderer.renderer.setSize( window.innerWidth, window.innerHeight );
    }

    triggerDebug(e)
    {
        let key = e.keyCode ? e.keyCode : e.which;
        if (key === 112 || key === "f1") // debug
        {
            // toggle debug
            this.debugMode = !this.debugMode;
            this.stats.update(this.debugMode);
        }
        if (key === 27 || key === "Escape")
        {
            this.renderStates.Menu.activate(this);
        }
    }

    getMouseIntersects()
    {
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.mousePos, this.activeCamera);

        return raycaster.intersectObjects(this.activeScene.children);
    }

    init()
    {
        this.objectMgr.setupScene();

        //@todo: beautify this, use ContentManager + PhysicsManager + GameManager

        //this.gameScene.add(new THREE.AmbientLight(0x444444));
        //this.gameScene.add(new THREE.DirectionalLight(0xcccccc, 1));

        this.gameScene.add(this.skyBox);

        var ballWorker = new Worker('js/workers/BallLoaderWorker.js');
        ballWorker.addEventListener('message', e => {
            var b = this.gameScene.getObjectByName(`BALL-${e.data}`);
            b.material.map = ContentManager.LoadTexture(`balls/${e.data}.png`);
            b.material.needsUpdate = true;
        }, false);

        for(var ball of this.objectMgr.objects.PoolBalls)
        {
            this.gameScene.add(ball.rayHelper);
            this.gameScene.add(ball.boundingBoxHelper);
            //this.gameScene.add(ball.vertexNormalsHelper);

            ballWorker.postMessage(ball.id); // Send data to our worker.
        }

        this.l1 = new THREE.AmbientLight(0xffffff, 1.1);
        this.l2 = new THREE.SpotLight(0xffffff, 0.65);
        this.l2.position.set(10, 10, 10);
        this.l2.decay = 2;
        this.l2.penumba = 0.2;
        this.l2.angle = 0.3;
        this.l2.distance = 50;
        this.l2.castShadow = true;
        this.l2.shadow.mapSize.width = this.l2.shadow.mapSize.height = 1024;
        this.l2.shadow.darkness = 0.5;
        this.l2.shadow.camera.near = 20;
        this.l2.shadow.camera.far = 30;
        this.l2.shadow.camera.matrixAutoUpdate = false;
        this.lightHelper = new THREE.SpotLightHelper(this.l2);
        this.lightHelper.matrixAutoUpdate = false;
        this.lightCameraHelper = new THREE.CameraHelper(this.l2.shadow.camera);
        this.lightCameraHelper.matrixAutoUpdate = false;

        this.gameScene.add(this.l1, this.l2);
        this.gameScene.add(this.lightHelper, this.lightCameraHelper);

        // after setting up things...
        this.renderStates.Game.activate(this);

        this.sfxMgr.GetAndPlayLooped(SoundManager.sounds.Mp3Loop);



    }

    update()
    {
        this.clockTime = this.clock.getElapsedTime();
        this.clockDelta = this.clock.getDelta();

        if (this.debugMode)
        {
            this.stats.window.update();
            this.stats.renderWindow.update(this.gameRenderer.renderer);
        }

        if (this.gameMenu.active)
        {

        }
        else
        {
            // lights rotation
            //this.objectMgr.l4.angle = (Math.random() * 0.7) + 0.1;
            //this.objectMgr.l4.penumbra = Math.random() + 1;

            this.l2.updateMatrixWorld(true);
            //this.l2.shadow.camera.updateMatrixWorld(true);
            //this.lightHelper.position.setFromMatrixPosition(this.l2.matrixWorld);
            this.lightCameraHelper.position.setFromMatrixPosition(this.l2.matrixWorld);
            //this.lightCameraHelper.updateMatrixWorld(true);
            //this.lightHelper.updateMatrix();
            this.lightHelper.update(this.l2);
            this.lightCameraHelper.updateMatrix();
            this.lightCameraHelper.update(this.l2);
            this.lightHelper.visible = false;
            this.lightCameraHelper.visible = false;

            this.gameControls.controls.update();
            // only update physics when in the game
            this.physxMgr.update();
        }

        this.render();
    }

    render()
    {
        this.gameRenderer.renderer.clear();

        this.gameRenderer.render(this, function()
        {
            for(var ball of this.objectMgr.objects.PoolBalls)
            {
                ball.render();
            }

            // optimization: only update on debug mode

        });
    }
}
