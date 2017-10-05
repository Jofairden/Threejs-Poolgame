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
        this.applyForces();
        this.applyResistances();
        //this.updateRotation();
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
                if (ball.velocity !== new THREE.Vector3())  // Check if the balls are still rolling
                {
                        ball.velocity.x *= 0.99;
                        ball.velocity.z *= 0.99;
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
            const velocity = ball.velocity;
            const velocityN = ball.velocity.clone().normalize();
            const distance = velocity.length;
            let angle = (distance / (2 * 0.3 * Math.PI)) * Math.PI,
                axis = new THREE.Vector3(velocityN.z, velocityN.y, -velocityN.x),
                quaternion = new THREE.Quaternion(),
                currentQuaternion = ball.mesh.quaternion.clone();

            quaternion.setFromAxisAngle(axis, angle);

            currentQuaternion.multiplyQuaternions(quaternion, currentQuaternion).normalize();
            ball.mesh.setRotationFromQuaternion(currentQuaternion);
        }
    }
}
