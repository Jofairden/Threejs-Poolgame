class Player // a player
{
    constructor(id)
    {
        this.id = id; // player 1 or 2?
        this.stats = new PlayerGameStats(this); // my player stats
        this.turn = new PlayerTurn(this); // my player turn
    }

    update()
    {
        this.turn.update();

        var class_name = this.turn.myTurn ? "activePlayer" : "";
        var el = document.getElementById(`player${this.id}`);
        var el2 = document.getElementById(`score${this.id}`);
        el.textContent = `Player${this.id}: `;
        el2.textContent = this.points.toString();
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
        this.points = 0; // how many points?
        this.turns = 0; // how many turns used?
        this.scores = {}; // the balls we scored
        this.games = []; // the games we played
    }

    get wins() // how many wins do we have?
    {
        return this.games.filter(v => v.Win).length;
    }

    finishCurrentGame(win = false) // we won or lost, store stats and reset
    {
        this.games.push( // push a new game
            {
                Points: this.points,
                Turns: this.turns,
                Scores: this.scores,
                Win: win
            }
        );
        this.resetStats();
    }

    resetStats() // reset stats
    {
        this.points = 0;
        this.turns = 0;
        this.scores = {};
    }

    addTurn() // add a turn
    {
        this.turns++;
    }

    score(ball) // score a ball
    {
        if (ball instanceof Ball)
        {
            this.scores[ball.mesh.name] = ball;
            //this.points += ball.points;
            console.log(this.scores);
        }
    }
}

class PlayerTurn
{
    constructor(player)
    {
        this.player = player; // reference to player
        this.time = 30; // how much time do I have left?
        this.myTurn = false; // is it my turn?
        this.freeze = false;
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
                // our turn and not frozen
                if (this.myTurn && !this.freeze)
                {
                    document.getElementById("turn-time").textContent = this.time.toString();
                    if (this.turnEnded) // did our turn end?
                    {
                        this.reset();
                    }
                    this.time--; // countdown time
                    console.log("update turn", this.time, this.player);
                }
                else if (this.freeze)
                {
                    console.log("turn frozen", this);
                    if (Game.instance.objectMgr.objects.PoolBalls[0].velocity.length() === 0)
                    {
                        // we are frozen (We took a shot) and the cueball stopped moving
                        this.reset();
                    }
                }
            }, 1000);
        }
    }

    reset() // reset the turn
    {
        this.time = 30;
        this.myTurn = false;
        this.freeze = false;
        Game.instance.updatePlayerTurn();
    }
}
