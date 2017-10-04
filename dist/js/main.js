/**
 * Main
 */

GameUtils.rotObjectMatrix = 0;
GameUtils.rotWorldMatrix = 0;

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



