/**
 * Main
 */

GameUtils.rotObjectMatrix = 0;
GameUtils.rotWorldMatrix = 0;

// Init
let game = new Game();
Game.instance = game;
game.init();

// Test change stats:
// game.stats.changeState(game.stats.states.MS);

function animate()
{
    requestAnimationFrame( animate );
    game.update();
}

animate();
//SoundManager.GetAndPlayLooped(SoundManager.sounds.Mp3Loop);



