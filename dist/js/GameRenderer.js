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
            if (gameInst.gameMenu.enabled)
                gameInst.gameMenu.render();

            this.renderer.render(gameInst.activeScene, gameInst.activeCamera);

            if (callback)
                callback.call(gameInst);
        }
    };
}
