
class Game
{
    constructor()
    {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        this.renderer = new GRenderer("game");
    }

    render()
    {
        this.renderer.render(this, function()
        {
            // callback
        });
    }

    init()
    {
        let geometry = new THREE.BoxGeometry( 1, 1, 1 );
        let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        this.cube = new THREE.Mesh( geometry, material );
        this.scene.add( this.cube );

        this.camera.position.z = 5;
    }
}

class GRenderer
{
    constructor(element)
    {
        this.webGLRenderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
            shadowMapEnabled: true,
            shadowMapType: THREE.PCFSoftShadowMap
        });
        this.webGLRenderer.setSize(window.innerWidth, window.innerHeight);

        document.getElementById(element).appendChild(this.webGLRenderer.domElement);
    }

    render(game, callback)
    {
        if (game instanceof Game)
        {
            this.webGLRenderer.render(game.scene, game.camera);
            if (callback)
                callback.call(game);
        }
    }
}

let game = new Game();
game.init();

function gameLoop()
{
    requestAnimationFrame(gameLoop);

    // physics
    // render
    // loop

    game.cube.rotation.x += 0.1;
    game.cube.rotation.y += 0.1;
    game.render();

}

gameLoop();