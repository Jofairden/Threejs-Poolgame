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
    }

    update()
    {
        // update physics
        // check collisions

        this.getCollisions();
        //this.applyForces();
        //this.applyResistances();
        this.updateRotation();
        this.updateObjects();
    }


    getCollisions()
    {
        this.previousCollisions = this.collisions;
        this.collisions = [];

        let balls = this.instance.objectMgr.objects.PoolBalls;

        for(let ball of balls.filter(v => v.velocity !== new THREE.Vector2()))
        {
            // for (var vertexIndex = 0; vertexIndex < ball.mesh.geometry.vertices.length; vertexIndex++)
            // {
            //     var localVertex = ball.mesh.geometry.vertices[vertexIndex].clone();
            //     var globalVertex = localVertex.applyMatrix4( ball.mesh.matrix );
            //     var directionVector = globalVertex.sub( ball.mesh.position );
            //
            //     var originPoint = ball.mesh.position.clone();
            //     var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
            //     var collisionResults = ray.intersectObjects( this.instance.gameScene.children.filter(v => v !== ball && v instanceof Ball) );
            //
            //     if (!collisionResults.contains(ball))
            //     {
            //         if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() )
            //         {
            //             // collision
            //         }
            //     }
            // }
        }

        // for (let i = 0; i <= balls.length; i++)
        // {
        //     let ball = balls[i];
        //     for (let j = 0; j <= balls.length; j++)
        //     {
        //         if (i !== j)
        //         {
        //             let otherBall = balls[j];
        //
        //             if (ball.boundingBox.isIntersectionBox(otherBall.boundingBox))
        //             {
        //                 this.collisions.push({
        //                     objects: [ball, otherBall]
        //                 });
        //             }
        //         }
        //     }
        // }
    }

    applyForces()
    {
        for(var ball of this.instance.objectMgr.objects.PoolBalls)
        {
            if (ball.position && ball.velocity && ball.velocity instanceof THREE.Vector3)
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
            if (ball.velocity && ball.velocity instanceof THREE.Vector3)
            {
                // for velocity, apply resistance if value is >= treshold,
                // if value reaches below treshold, hard reset the value to 0

                if (ball.velocity !== new THREE.Vector3())  // if there is velocity
                {
                    if (Math.abs(ball.velocity.x) >= 0.001)
                        ball.velocity.x *= 0.99;
                    else
                        ball.velocity.x = 0;

                    if (Math.abs(ball.velocity.z) >= 0.001)
                        ball.velocity.z *= 0.99;
                    else
                        ball.velocity.z = 0;
                }
            }
        }
    }

    updateObjects()
    {
        for(var ball of this.instance.objectMgr.objects.PoolBalls)
        {
            ball.update();
        }
    }

    updateRotation()
    {
        for(var ball of this.instance.objectMgr.objects.PoolBalls)
        {
            var angle = (Math.abs(ball.velocity.length()) / (ball.radius * Math.PI)) * Math.PI;
            var axis = new THREE.Vector3(ball.velocity.z, 0, -ball.velocity.x).normalize();
            var quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
            quaternion.multiplyQuaternions(quaternion, ball.mesh.quaternion);
            ball.mesh.setRotationFromQuaternion(quaternion);


            // var vel = ball.velocity.clone();
            // var velN = vel.clone().normalize();
            // var angle = Math.atan2(-vel.z, vel.x) * Math.RAD2DEG;
            // var quaternion = new THREE.Quaternion().setFromAxisAngle(velN, angle);
            //
            //
            // var curQuaternion = ball.mesh.quaternion.clone();
            // curQuaternion.multiplyQuaternions(quaternion, curQuaternion).normalize();
            // ball.mesh.setRotationFromQuaternion(curQuaternion);


            // let velocityN = ball.velocity.clone().normalize(),
            //     distance = ball.velocity.length(),
            //     angle = (distance / (ball.radius * Math.PI)) * Math.PI,
            //     axis = new THREE.Vector3(velocityN.z, 0, -velocityN.x),
            //     quaternion = new THREE.Quaternion(),
            //     currentQuaternion = ball.mesh.quaternion;
            //
            // quaternion.setFromAxisAngle(axis, angle);
            // currentQuaternion.multiplyQuaternions(quaternion, currentQuaternion).normalize();
            // ball.mesh.setRotationFromQuaternion(currentQuaternion);

            // const velocity = ball.velocity.clone();
            // // var temp = velocity.z;
            // // velocity.z = velocity.y;
            // // velocity.y = temp;
            // const velocityN = velocity.clone().normalize();
            // const distance = velocity.length;
            //
            // let rotOff = ball.mesh.quaternion.clone().inverse(),
            //     angle = this.instance.activeCamera.quaternion.clone().multiply(rotOff),
            //     axis = new THREE.Vector3(velocityN.z, 0, -velocityN.x),
            //     quaternion = new THREE.Quaternion().setFromUnitVectors(axis, velocity),
            //     currentQuaternion = ball.mesh.quaternion.clone();
            //
            // //quaternion.multiplyQuaternions(axis, angle).normalize();
            // //quaternion.setFromAxisAngle(axis, angle);
            // currentQuaternion.multiplyQuaternions(quaternion, currentQuaternion).normalize();
            // ball.mesh.setRotationFromQuaternion(currentQuaternion);
        }
    }
}
