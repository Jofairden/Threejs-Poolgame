/**
 * Main
 */

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};

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
    game.update();

    requestAnimationFrame( animate );
}

animate();
//SoundManager.GetAndPlayLooped(SoundManager.sounds.Mp3Loop);
//game.activePlayer.animateScorePoint();


