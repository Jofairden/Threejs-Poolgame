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
            preserveDrawingBuffer: true,
            gammaInput: true,
            gammaOutput: true
        });
        this.renderer.shadowMap.renderReverseSided = false;
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.getElementById(domContainer).appendChild(this.renderer.domElement);
    }

    render(gameInst, callback)
    {
        if (gameInst instanceof Game)
        {
            if (gameInst.gameMenu.active)
                gameInst.gameMenu.render();

            this.renderer.render(gameInst.activeScene, gameInst.activeCamera);

            if (callback)
                callback.call(gameInst);
        }
    };
}
