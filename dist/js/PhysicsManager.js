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
            //this.getCollisions(ball);
            //this.applyForces(ball);
            //this.applyResistances(ball);
            this.updateObjects(ball);
        }

        for (let ball of this.balls)
        {
            this.getCollisions(ball);
        }
    }


    getCollisions(ball)
    {
        this.rayCaster.set(ball.position, ball.velocityDirection);
        // this.rayCaster.near = ball.radius;
        // this.rayCaster.far = ball.radius + ball.radius;
        this.rayCaster.near = 0;
        this.rayCaster.far = ball.radius + 0.01;

        // working on:

        // var collisionObjects = this.walls.concat(this.anyBalls);
        //
        // for (let obj of collisionObjects)
        // {
        //     if (!obj.boundingBox)
        //     {
        //         var mesh = undefined;
        //         if (obj instanceof THREE.Mesh)
        //             mesh = obj;
        //         else
        //             if (obj.mesh instanceof THREE.Mesh)
        //                 mesh = obj.mesh;
        //
        //         if (mesh)
        //         {
        //             obj.boundingBox = new THREE.Box3().setFromObject(mesh);
        //         }
        //     }
        //
        //     if (obj.boundingBox)
        //     {
        //         if (obj.boundingBox.intersectsBox(ball.boundingBox))
        //         {
        //             var reflect = undefined;
        //
        //             if (obj instanceof Ball)
        //             {
        //                 reflect = obj.velocityDirection;
        //             }
        //             else if (obj instanceof THREE.Mesh)
        //             {
        //                 reflect = obj.;
        //             }
        //             else if (obj.mesh && obj.mesh instanceof THREE.Mesh)
        //             {
        //                 reflect = obj.mesh
        //             }
        //         }
        //     }
        // }



        // try to get collisions
        let collisions = this.rayCaster.intersectObjects(this.anyBalls.concat(this.walls));

        // we have collisions
        if (collisions.length > 0)
        {
            // for every collision..
            for (let collision of collisions)
            {
                //The conservation of the total momentum demands that the total momentum before the collision is the same as the total momentum after the collision
                //v1 = ()
                if (collision.object.ballRef)
                {
                    //console.log(collision.object.ballRef);
                    let otherBall = collision.object.ballRef;
                    let reflectAngle = Math.atan2((otherBall.position.z - ball.position.z), (otherBall.position.x - ball.position.x));
                    let collisionPoint = collision.point;

                    if (otherBall.velocity.length() > 0)
                    {

                    }
                    else
                    {
                        let midpointx = .5 * (ball.velocity.x + otherBall.velocity.x);
                        let midpointy = .5 * (ball.velocity.z + otherBall.velocity.z);
                        let dist = ball.position.distanceTo(otherBall.position);
                        ball.velocity.x = midpointx + ball.radius * (ball.velocity.x - otherBall.velocity.x) / dist;
                        ball.velocity.z = midpointy + ball.radius * (ball.velocity.z - otherBall.velocity.z) / dist;
                        otherBall.velocity.x = midpointx + ball.radius * (otherBall.velocity.x - ball.velocity.x) / dist;
                        otherBall.velocity.z = midpointy + ball.radius * (otherBall.velocity.z - ball.velocity.z) / dist;
                    }

                    // let xDist = ball.position.x - otherBall.position.x;
                    // let zDist = ball.position.z - otherBall.position.z;
                    // let distSQ = xDist*xDist + zDist*zDist;
                    // if (distSQ <= (ball.radius + otherBall.radius)*(ball.radius * otherBall.radius))
                    // {
                    //     let xVelocity = otherBall.velocity.x - ball.velocity.x;
                    //     let zVelocity = otherBall.velocity.z - ball.velocity.z;
                    //     let dotProduct = xDist*xVelocity + zDist*zVelocity;
                    //     if (dotProduct > 0)
                    //     {
                    //         let colScale = dotProduct / distSQ;
                    //         let xCol = xDist * colScale;
                    //         let zCol = zDist * colScale;
                    //         let combinedMass = ball.mass + otherBall.mass;
                    //         let colWeightA = 2 * otherBall.mass / combinedMass;
                    //         let colWeightB = 2 * ball.mass / combinedMass;
                    //         ball.velocity.x += colWeightA * xCol;
                    //         ball.velocity.z += colWeightA * zCol;
                    //         otherBall.velocity.x -= colWeightB * xCol;
                    //         otherBall.velocity.z -= colWeightB * zCol;
                    //     }
                    // }

                    // if (otherBall.velocity.length() > 0)
                    // {
                    //     // there is velocity, two moving spheres
                    //     // first ball
                    //     // let oldVel = ball.velocity.clone();
                    //     // let otherOldVel = otherBall.velocity.clone();
                    //     // let velX1 = oldVel.x;
                    //     // let velY1 = oldVel.y;
                    //     // let velX2 = otherOldVel.x;
                    //     // let velY2 = otherOldVel.y;
                    //     // let mass1 = ball.mass;
                    //     // let mass2 = otherBall.mass;
                    //     //
                    //     // // ball.velocity.x = ((oldVel.x * (ball.mass - otherBall.mass)) + (2 * otherBall.mass * otherOldVel.x)) / (ball.mass + otherBall.mass);
                    //     // // ball.velocity.y = ((oldVel.y * (ball.mass - otherBall.mass)) + (2 * otherBall.mass * otherOldVel.y)) / (ball.mass + otherBall.mass);
                    //     // // otherBall.velocity.x = ((otherOldVel.x * (otherBall.mass - ball.mass)) + (2 * ball.mass * oldVel.x)) / (ball.mass + otherBall.mass);
                    //     // // otherBall.velocity.y = ((otherOldVel.y * (otherBall.mass - ball.mass)) + (2 * ball.mass * oldVel.y)) / (ball.mass + otherBall.mass);
                    //     //
                    //     // ball.velocity.x = (velX1 * (mass1 - mass2) + (2 * mass2 * velX2)) / (mass1 + mass2);
                    //     // otherBall.velocity.x = (velX2 * (mass2 - mass1) + (2 * mass1 * velX1)) / (mass1 + mass2);
                    //     // ball.velocity.y = (velY1 * (mass1 - mass2) + (2 * mass2 * velY2)) / (mass1 + mass2);
                    //     // otherBall.velocity.y = (velY2 * (mass2 - mass1) + (2 * mass1 * velY1)) / (mass1 + mass2);
                    //     //
                    //     // this.applyForces(ball);
                    //     // this.applyForces(otherBall);
                    //
                    //
                    // }
                    // else
                    // {
                    //     // //no velocity, collided sphere is standing still
                    //     // let deflectAngle1 = Math.tan((otherBall.mass * Math.sin(reflectAngle)) / (ball.mass + (otherBall.mass * Math.cos(reflectAngle))));
                    //     // let deflectAngle2 = (Math.PI - reflectAngle) / 2;
                    //     // //console.log(v1,v2,ball.mesh.name,otherBall.mesh.name);
                    //     //
                    //     // let velX1 = deflectAngle1 * (Math.sqrt(Math.pow(ball.mass, 2) + Math.pow(otherBall.mass, 2) + 2 * ball.mass * otherBall.mass * Math.cos(reflectAngle))) / (ball.mass + otherBall.mass);
                    //     // let velY1 = deflectAngle1 * (2 * ball.mass) / (ball.mass + otherBall.mass) * Math.sin(reflectAngle/2);
                    //     //
                    //     // let velX2 = deflectAngle2 * (Math.sqrt(Math.pow(ball.mass, 2) + Math.pow(otherBall.mass, 2) + 2 * ball.mass * otherBall.mass * Math.cos(reflectAngle))) / (ball.mass + otherBall.mass);
                    //     // let velY2 = deflectAngle2 * (2 * ball.mass) / (ball.mass + otherBall.mass) * Math.sin(reflectAngle/2);
                    //     //
                    //     // ball.velocity.x = velX1;
                    //     // ball.velocity.z = velY1;
                    //     // otherBall.velocity.x = velX2;
                    //     // otherBall.velocity.y = velY2;
                    // }
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
        updateAngularVelocity(ball);
        ball.update();

        function updateAngularVelocity(ball)
        {
            var quaternion = new THREE.Quaternion().setFromAxisAngle(ball.rotationAxis, ball.linearVelocity);
            quaternion.multiplyQuaternions(quaternion, ball.mesh.quaternion).normalize();
            ball.mesh.setRotationFromQuaternion(quaternion);
        }

    }
}
