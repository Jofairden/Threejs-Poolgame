class Player // a player
{
    constructor(id)
    {
        this.id = id; // player 1 or 2?
        this.stats = new PlayerGameStats(this); // my player stats
        this.turn = new PlayerTurn(this); // my player turn
    }

    get otherPlayer() // get other player
    {
        if (this.id === 1)
            return Game.instance.players.Player2;
        else
            return Game.instance.players.Player1;
    }

    update()
    {
        this.turn.update();

        var class_name = this.turn.myTurn ? "activePlayer" : "";
        var el = document.getElementById(`player${this.id}`);
        var el2 = document.getElementById(`score${this.id}`);
        el.textContent = `Player${this.id}: `;
        el2.textContent = `${this.points} (W:${this.stats.wins})`;
        el.className = class_name;
    }

    animateScorePoint()
    {
        // $("#score" + this.id)
        //     .animate({"color": "#ffff00"}, {duration:1000, easing:'easeInOutBounce', complete: () => {}})
        //     .delay(1000)
        //     .queue(function(){
        //         $("#score" + this.id).animate({"color": "#ffffff"}, {duration:550, easing:'easeInOutBounce', complete: () => {}});
        //     });
    }

    get points() // how many points do we have currently?
    {
        return this.stats.points;
    }

    get wins() // how many wins do we have?
    {
        return this.stats.wins;
    }

    get turnTimeLeft() // how much time do we have left in our turn?
    {
        return this.turn.time;
    }
}

class PlayerGameStats
{
    constructor(player)
    {
        this.player = player;
        this.turns = 0; // how many turns used?
        this.scores = []; // the balls we scored
        this.games = []; // the games we played
        this.justWon = false;
        this.loseGame = false;
        this.scoreForOther = false;
    }

    get points()
    {
        if (this.scores.length <= 0)
            return 0;
        else
            return this.scores.map(v => v.points).reduce(add, 0);

        function add(a, b) {
            return a + b;
        }
    }

    get firstScoredBall() // which ball we first scored?
    {
        if (this.scores.length <= 0)
            return undefined;
        else
            return this.scores[0];
    }

    get lastScoredBall() // which ball we last scored?
    {
        if (this.scores.length <= 0)
            return undefined;
        else
            return this.scores[this.scores.length - 1];
    }

    get wins() // how many wins do we have?
    {
        return this.games.filter(v => v.Win).length;
    }

    finishCurrentGame(win) // we won or lost, store stats and reset
    {
        this.games.push( // push a new game
            {
                Points: this.points,
                Turns: this.turns,
                Scores: this.scores,
                Win: win
            }
        );
        console.log(this.games);
        this.resetStats();
    }

    resetStats() // reset stats
    {
        this.turns = 0;
        this.scores = [];
    }

    addTurn() // add a turn
    {
        this.turns++;
    }

    score(ball) // score a ball
    {
        //console.log("turn score");
        if (ball instanceof Ball)
        {
            if (this.checkGameRules(ball))
            {
                this.scores.push(ball);
                this.player.turn.justScored = true;
                //console.log(this.scores);

                if (this.justWon)
                {
                    // we just won!
                    this.finishCurrentGame(true);
                    this.player.otherPlayer.stats.finishCurrentGame(false);
                    Game.instance.resetGame();
                    this.player.turn.reset();
                }
                else
                {
                    // we scored but didnt win, we get another turn
                    this.addTurn();
                    this.time = 30;
                    this.myTurn = true;
                    this.freeze = false;
                }
            }
            else
            {
                if (this.loseGame)
                {
                    // rules not abided, lose!
                    console.log("lose game", ball);
                    this.finishCurrentGame(false);
                    this.player.otherPlayer.stats.finishCurrentGame(true);
                    Game.instance.resetGame();
                    this.player.turn.reset();
                }
                else if (this.scoreForOther)
                {
                    this.player.otherPlayer.stats.scores.push(ball);
                }
            }
        }
    }

    checkGameRules(ball) // check if we abide the game rules
    {
        // scored the white ball?
        if (ball.id === 0)
        {
            //console.log("white ball");
            this.loseGame = false; // dont lose!
            this.player.turn.reset();
            ball.reset();

            //Game.instance.objectMgr.objects.Keu.reset();
            return false;
        }

        // we have a last scored ball. check rules
        // scored black ball?
        let scoredBlackBall =  ball.blackBall;
        if (scoredBlackBall && this.scores.length < 7)
        {
            this.loseGame = true;
            return false; // lose
        }

        if (this.firstScoredBall)
        {
            let abided = false; // we abide the rules?
            let otherPlayerStriped = this.player.otherPlayer.firstScoredBall && this.player.otherPlayer.firstScoredBall.stripedBall; // did other player score striped before?

            let needStriped = this.firstScoredBall.stripedBall || otherPlayerStriped; // need striped?

            if (needStriped)
                abided = ball.stripedBall || scoredBlackBall;
            else
                abided = !ball.stripedBall || scoredBlackBall;

            // did we win?
            this.justWon = scoredBlackBall && this.scores.length >= 7;
            this.scoreForOther = !abided;
            this.loseGame = false;

            return abided;
        }
        else return true;
    }
}

class PlayerTurn
{
    constructor(player)
    {
        this.player = player; // reference to player
        this.time = 30; // how much time do I have left?
        this.myTurn = false; // is it my turn?
        this.freeze = false; // is turn frozen?
        this.justScored = false; // just scored?
    }

    get turnEnded() // is our turn ended?
    {
        return !this.myTurn || this.time <= 0;
    }

    update() // update the turn
    {
        if (!this._update)
        {
            this._update = setInterval(() =>
            {
                if (!Game.instance.gameMenu.active && !this.player.stats.justWon)
                {
                    var objs = Game.instance.objectMgr.objects;
                    // our turn and not frozen
                    if (this.myTurn && !this.freeze)
                    {
                        if (this.turnEnded) // did our turn end?
                        {
                            this.reset();
                        }
                        document.getElementById("turn-time").textContent = this.time.toString();
                        this.time--; // countdown time
                        //console.log("update turn", this.time, this.player);
                    }
                    else if (this.freeze) // we are frozen
                    {
                        //console.log("turn frozen", this);
                        if (objs.PoolBalls.filter(v => v.velocity.length() === 0).length === objs.PoolBalls.length
                            && !objs.Keu.animating)
                        {
                            //console.log("freeze finish", cue.ball.velocity);
                            this.reset();
                        }
                    }
                }
            }, 1000);
        }
    }

    reset() // reset the turn
    {
        //console.log("reset");
        this.time = 30;
        this.myTurn = false;
        this.freeze = false;
        Game.instance.updatePlayerTurn();
    }
}
