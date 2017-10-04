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
            {
                this.renderer.render(gameInst.gameMenu.scene, gameInst.gameMenu.controls.camera);
                gameInst.gameMenu.render();
            }
            else
            {
                this.renderer.render(gameInst.gameScene, gameInst.gameControls.camera);
            }

            if (callback)
                callback.call(gameInst);
        }
    };
}
