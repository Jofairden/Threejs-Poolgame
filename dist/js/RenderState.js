class RenderState
{
    constructor(name, scene, camera)
    {
        this.name = name;
        this.innerScene = scene;
        this.innerCamera = camera;
    }

    activate(game)
    {
        if (game instanceof Game)
        {
            game.activeScene = this.innerScene;
            game.activeCamera = this.innerCamera;
        }
    }
}
