/**
 * Contains physics logic used in the game
 */

class PhysicsManager
{
    constructor(game)
    {
        this.instance = game;
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
        return this.instance.objectMgr.objects.PoolBalls.filter(b => b instanceof Ball && b.position && b.velocity);
    }

    get walls()
    {
        return this.instance.objectMgr.objects.PoolTable[0].children.filter(o => o.name === "TABLE-WALL");
    }

    update()
    {
        for (let ball of this.balls)
        {
            this.getCollisions(ball);
        }

        for (let ball of this.balls)
        {
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
        this.rayCaster.far = ball.diameter + 0.001;

        // try to get collisions
        let collisions = this.rayCaster.intersectObjects(this.anyBalls.concat(this.walls));

        // we have collisions
        if (collisions.length > 0)
        {
            // for every collision..
            for (let collision of collisions)
            {
                if (collision.object.ballRef)
                {
                    let otherBall = collision.object.ballRef;

                    // m = mass, v = velocity
                    // momentum: p = mv
                    // kinetic energy: e = 0.5mv^2
                    // conservation of momentum: (mv)(1)+(mv)(2) = (mv')(1) +(mv')(2)

                    let ballPos = ball.position.clone();
                    let otherBallPos = otherBall.position.clone();
                    let ballVel = ball.velocity.clone();
                    let otherBallVel = otherBall.velocity.clone();
                    let ballMass = ball.mass;
                    let otherBallMass = otherBall.mass;

                    // 1 -- calculate normal vector (n), unit normal (un), unit tangent vector (ut)
                    let n = new THREE.Vector3(otherBallPos.x - ballPos.x, 0, otherBallPos.z - ballPos.z).normalize();
                    let un = n.clone().divideScalar(Math.sqrt(Math.pow(n.x, 2) + Math.pow(n.z, 2)));
                    let ut = new THREE.Vector3(-un.z, 0, un.x).normalize();

                    //2
                    let v1 = ballVel.clone();
                    let v2 = otherBallVel.clone();

                    //3 -- dot products
                    let v1n = un.clone().dot(v1);
                    let v1t = ut.clone().dot(v1);
                    let v2n = un.clone().dot(v2);
                    let v2t = ut.clone().dot(v2);

                    //4
                    // tangential velocities AFTER collision
                    // _ denotes AFTER collision
                    let v1t_ = v1t;
                    let v2t_ = v2t;

                    //5
                    let v1n_ = (v1n*(ballMass-otherBallMass)+2*otherBallMass*v2n)/(ballMass+otherBallMass);
                    let v2n_ = (v2n*(otherBallMass-ballMass)+2*ballMass*v1n)/(ballMass+otherBallMass);

                    //6
                    let vec1n_ = un.clone().multiplyScalar(v1n_);
                    let vec1t_ = ut.clone().multiplyScalar(v1t_);
                    let vec2n_ = un.clone().multiplyScalar(v2n_);
                    let vec2t_ = ut.clone().multiplyScalar(v2t_);

                    //7
                    let v1_ = vec1n_.clone().add(vec1t_);
                    let v2_ = vec2n_.clone().add(vec2t_);

                    ball.velocity = v1_.clone();
                    otherBall.velocity = v2_.clone();

                    //console.log(v1n_, v2n_);
                }
                else
                {
                    // we have a collision with static object! reflect our velocity
                    ball.velocity = ball.velocity.reflect(collision.face.normal);
                }
            }
            //this.collisions.push({ID: ball.id, Collisions:collisions});
        }
    }

    applyForces(ball)
    {
        // if (this.collisions.length > 0)
        // {
        //     var collisions = this.collisions.filter(x => x.ID === ball.id);
        //     if (collisions.length > 0)
        //     {
        //         for (var colSet of collisions)
        //         {
        //             for (var collision of colSet.Collisions)
        //             {
        //                 var norm = ball.velocityDirection.clone();
        //                 ball.velocity = ball.velocity.reflect(collision.face.normal);
        //                 if (collision.object.ballRef)
        //                 {
        //                     console.log('collision!');
        //                     collision.object.ballRef.velocity = collision.object.ballRef.velocity.reflect(norm);
        //                 }
        //
        //             }
        //         }
        //     }
        // }

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
        // update balls, first update the angular velocity (also called angular speed)
        updateAngularVelocity(ball);

        // now call .update()
        ball.update();

        function updateAngularVelocity(ball)
        {
            // set Quaternion from axis angle: the ball's rotation axis and the linear velocity
            // see the Ball class for more details
            var quaternion = new THREE.Quaternion().setFromAxisAngle(ball.rotationAxis, ball.linearVelocity);
            // multiply the new quaternion with the old, normalize
            quaternion.multiplyQuaternions(quaternion, ball.mesh.quaternion).normalize();
            ball.mesh.setRotationFromQuaternion(quaternion);
        }

    }
}
