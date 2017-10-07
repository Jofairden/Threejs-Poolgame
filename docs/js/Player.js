class Player // a player
{
    constructor(id)
    {
        this.id = id; // player 1 or 2?
        this.stats = new PlayerGameStats(); // my player stats
        this.turn = new PlayerTurn(); // my player turn
    }

    update()
    {
        this.turn.update();
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
    constructor()
    {
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
    constructor()
    {
        this.time = 30 * 100; // how much time do I have left?
        this.myTurn = false; // is it my turn?
    }

    get turnEnded() // is our turn ended?
    {
        return !this.myTurn || this.time <= 0;
    }

    update() // update the turn
    {
        if (this.turnEnded)
            this.reset();
        else if (this.myTurn)
            this.time--;

        //console.log(this.time);
    }

    reset() // reset the turn
    {
        this.time = 30 * 100;
        this.myTurn = false;
    }
}
