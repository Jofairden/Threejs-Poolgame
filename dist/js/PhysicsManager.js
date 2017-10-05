/**
 * Contains physics logic used in the game
 */

class PhysicsManager
{
    constructor(game)
    {
        this.instance = game;
        this.collisions = [];
        this.previousCollisions = [];
        this.rayCaster = new THREE.Raycaster();
    }

    get anyBalls()
    {
        var anyBalls = [];
        var balls = this.instance.objectMgr.objects.PoolBalls.filter(b => b instanceof Ball);
        for (var ball of balls)
        {
            anyBalls.push(ball.mesh);
        }
        return anyBalls;
    }

    get balls()
    {
        return this.instance.objectMgr.objects.PoolBalls.filter(b => b instanceof Ball && b.position && b.velocity && b.velocity !== new THREE.Vector3());
    }

    get walls()
    {
        return this.instance.objectMgr.objects.PoolTable[0].children.filter(o => o.name === "TABLE-WALL");
    }

    update()
    {
        // update physics
        // check collisions
        this.previousCollisions = this.collisions;
        this.collisions = [];

        for (let ball of this.balls)
        {
            this.getCollisions(ball);
            this.applyForces(ball);
            //this.applyResistances(ball);
            this.updateObjects(ball);
        }
    }


    getCollisions(ball)
    {
        this.rayCaster.set(ball.position, ball.velocityDirection);
        // this.rayCaster.near = ball.radius;
        // this.rayCaster.far = ball.radius + ball.radius;
        this.rayCaster.near = 0;
        this.rayCaster.far = ball.radius;


        // collision met andere balls:
        // this.anyBalls.concat(this.walls)
        // bugs: vreemde rotatie met ballen, en ze schrinken?!?!

        var collisions = this.rayCaster.intersectObjects(this.walls);

        if (collisions.length > 0)
        {
            this.collisions.push({ID: ball.id, Collisions:collisions});
        }
    }

    applyForces(ball)
    {
        if (this.collisions.length > 0)
        {
            var collisions = this.collisions.filter(x => x.ID === ball.id);
            if (collisions.length > 0)
            {
                for (var colSet of collisions)
                {
                    for (var collision of colSet.Collisions)
                    {
                        ball.velocity = ball.velocity.reflect(collision.face.normal);
                    }
                }
            }
        }

        ball.position.x += ball.velocity.x;
        ball.position.z += ball.velocity.z;
    }

    applyResistances(ball)
    {
        // for velocity, apply resistance if value is >= threshold,
        // if value reaches below threshold, hard reset the value to 0

        if (Math.abs(ball.velocity.x) >= 0.001)
            ball.velocity.x *= 0.99;
        else
            ball.velocity.x = 0;

        if (Math.abs(ball.velocity.z) >= 0.001)
            ball.velocity.z *= 0.99;
        else
            ball.velocity.z = 0;
    }

    updateObjects(ball)
    {
        updateAngularVelocity(ball);
        ball.update();

        function updateAngularVelocity(ball)
        {
            var quaternion = new THREE.Quaternion().setFromAxisAngle(ball.rotationAxis, ball.angularVelocity);
            quaternion.multiplyQuaternions(quaternion, ball.mesh.quaternion);
            ball.mesh.setRotationFromQuaternion(quaternion);
        }

    }
}
