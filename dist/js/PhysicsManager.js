/**
 * Contains physics logic used in the game
 */

class PhysicsManager
{
    constructor(game)
    {
        this.instance = game;
    }

    update()
    {
        // update physics
        // check collisions
        this.applyForces();
        this.applyResistances();
    }

    applyForces()
    {
        for(var ball of this.instance.objectMgr.objects.PoolBalls)
        {
            if (ball.position && ball.velocity && ball.velocity instanceof THREE.Vector2)
            {
                ball.position.x += ball.velocity.x;
                ball.position.z += ball.velocity.z;
            }
        }
    }

    applyResistances()
    {
        for(var ball of this.instance.objectMgr.objects.PoolBalls)
        {
            if (ball.velocity && ball.velocity instanceof THREE.Vector2)
            {
                // for velocity, apply resistance if value is >= treshold,
                // if value reaches below treshold, hard reset the value to 0

                if (ball.velocity !== new THREE.Vector2())  // if there is velocity
                {
                    if (ball.velocity.x >= 0.001)
                        ball.velocity.x *= 0.99;
                    else
                        ball.velocity.x = 0;

                    if (ball.velocity.z >= 0.001)
                        ball.velocity.z *= 0.99;
                    else
                        ball.velocity.z = 0;
                }
            }
        }
    }
}
