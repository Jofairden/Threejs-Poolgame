/**
 * Main
 */

GameUtils.rotObjectMatrix = 0;
GameUtils.rotWorldMatrix = 0;

// Init
let game = new Game();
Game.instance = game;
game.init();
// test renew, works!
game.objectMgr.renewScene();
game.init(); // uncomment, see what happens

game.renderStates.Menu.activate(game);

// Test change stats:
// game.stats.changeState(game.stats.states.MS);

function animate()
{
    requestAnimationFrame( animate );

    // @todo: why doesnt this work?
    GameUtils.rotateAroundWorldAxis(game.objectMgr.l4, GameUtils.yAxis, GameUtils.toRadians(1));

    //Physics
    for (var ball of game.objectMgr.objects.PoolBalls)
    {
        ball.updateVelocity();
        ball.applyDrag();
    }

    game.render();
}

animate();
//SoundManager.GetAndPlayLooped(SoundManager.sounds.Mp3Loop);



