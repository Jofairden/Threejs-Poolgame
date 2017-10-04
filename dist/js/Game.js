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
        this.physxMgr = new PhysicsManager();

        // Debug windows
        this.stats = new StatsWindow();

        // Other
        this.gameControls = new GameControls();
        //this.rayCaster = new THREE.Raycaster();
        this.skyBox = new Skybox(1000, 1000, 1000, ...GameContent.SkyboxTexures);
        this.gameRenderer = new GameRenderer("game");
        this.debugMode = true;
        this.stats.update(this.debugMode);
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
    }

    getMouseIntersects()
    {
        var raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(this.mousePos, this.activeCamera);

        return raycaster.intersectObjects(this.activeScene.children);
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
            if (!this.gameMenu.enabled)
            {
                this.gameControls.controls.update();
            }

            // optimization: only update on debug mode
            if (this.debugMode)
            {
                this.stats.window.update();
                this.stats.renderWindow.update(this.gameRenderer.renderer);
            }
        });
    }
}
