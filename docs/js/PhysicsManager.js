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
        return this.balls.map(b => b.mesh);
    }

    get balls()
    {
        return this.instance.objectMgr.objects.PoolBalls.filter(b => b instanceof Ball && b.position && b.velocity && !b.scored);
    }

    get walls()
    {
        return this.instance.objectMgr.objects.PoolTable.fullWall;
    }

    update()
    {
        // we want to loop collisions on ALL balls
        // separate loops is safer
        for (let ball of this.balls)
        {
            this.getCollisions(ball);
        }

        for (let ball of this.balls)
        {
            this.applyForces(ball);
            this.applyResistances(ball);
            this.updateObjects(ball);
        }
    }


    getCollisions(ball)
    {
        this.rayCaster.set(ball.position, ball.velocityDirection, 0, 0);
        // this.rayCaster.near = ball.radius;
        // this.rayCaster.far = ball.radius + ball.radius;
        this.rayCaster.linePrecision = 100;
        this.rayCaster.near = 0;
        this.rayCaster.far = ball.radius + ball.velocity.length() * this.instance.clockDelta;

        // first loop pockets and check if we collide
        // if we collide, score a point
        for(let pocket of this.instance.objectMgr.objects.PoolTable.pockets)
        {
            // use the following to visuale the bounding boxes
            // if (!pocket.bb)
            //     pocket.bb = new THREE.Box3().setFromObject(pocket);
            // if (!pocket.bbHelper)
            // {
            //     pocket.bbHelper = new THREE.BoxHelper(pocket);
            //     this.instance.gameScene.add(pocket.bbHelper);
            // }
            // pocket.bbHelper.update();

            // console.log(pocket.bb.intersectsBox(new THREE.Box3().setFromObject(ball)));
            if (new THREE.Box3().setFromObject(pocket).intersectsBox(new THREE.Box3().setFromObject(ball.mesh)))
            {
                //console.log("physx score");
                ball.score();
                return;
            }
        }

        // for(let wall of this.walls)
        // {
        //     if (!wall.boundingBox)
        //     {
        //         wall.boundingBox = new THREE.Box3().setFromObject(wall);
        //         //wall.boundingBoxHelper = new THREE.BoxHelper(wall, 0xffff00);
        //         //this.instance.gameScene.add(wall.boundingBoxHelper);
        //     }
        //
        //
        //     // let size = Math.sqrt(Math.pow(sizeX, 2) + Math.pow(sizeY, 2) + Math.pow(sizeZ, 2));
        //     // let BB_preCheck = new THREE.Box3().setFromCenterAndSize(ball.position.clone().sub(new THREE.Vector3(size, size, size).multiply(new THREE.Vector3(Math.sign(reflectedVelocity.x), Math.sign(reflectedVelocity.y), Math.sign(reflectedVelocity.z)))), size);
        //
        //     // let BB_preCheck = new THREE.Box3().setFromObject(ball.mesh);
        //     //
        //     // let size = Math.sqrt(Math.pow(sizeX, 2) + Math.pow(sizeY, 2) + Math.pow(sizeZ, 2));
        //     // let halfSize = new THREE.Vector3().copy(size).multiplyScalar(0.5);
        //     // BB_preCheck.min.sub(halfSize);
        //     // BB_preCheck.max.add(halfSize);
        //
        //     var v1 = new THREE.Vector3();
        //     var halfSize = v1.copy(ball.boundingBox.getSize()).multiplyScalar(0.5);
        //     var dirVec = ball.velocityDirection.clone().normalize();
        //
        //     var bb = new THREE.Box3();
        //     bb.min.copy(ball.boundingBox.min).sub(halfSize.multiply(dirVec));
        //     bb.max.copy(ball.boundingBox.max).sub(halfSize.multiply(dirVec));
        //
        //     if (bb.intersectsBox(wall.boundingBox))
        //     {
        //         // we are inside a wall
        //         let ballBB_ = ball.boundingBox.clone();
        //         let sizeX = ballBB_.max.x - ballBB_.min.x;
        //         let sizeY = ballBB_.max.y - ballBB_.min.y;
        //         let sizeZ = ballBB_.max.z - ballBB_.min.z;
        //         let sizeVec = new THREE.Vector3(sizeX, sizeY, sizeZ);
        //         let reflectedVelocity = ball.velocity.clone().negate();
        //         let newPos = ball.position.clone();
        //         let finished = false;
        //
        //         let iMax = 10 + (30 * ball.velocity.length() * 30);
        //         let i = 0;
        //
        //         while (!finished)
        //         {
        //             newPos.add(reflectedVelocity);
        //             ballBB_.min.copy(newPos).sub(sizeVec);
        //             ballBB_.max.copy(newPos).add(sizeVec);
        //             finished = !ballBB_.intersectsBox(wall.boundingBox);
        //             i++;
        //             if (i >= iMax)
        //                 break;
        //         }
        //
        //         if (finished)
        //         {
        //             ball.mesh.position.copy(new THREE.Vector3(newPos.x, ball.position.y, newPos.z));
        //             ball.mesh.__dirtyPosition = true;
        //         }
        //     }
        // }

        // try to get collisions
        let collideables = this.anyBalls;
        collideables.push(this.walls);

        //console.log(this.walls);
        let collisions = this.rayCaster.intersectObjects(collideables);

        // the following code was an attempt at 'fixing' collisions for balls not directly shooting at each other
        // unfortunately it's too buggy, and raycasters are too expensive to use full 360 degrees (fps drop to 15-20)
        // get collisions with balls, select their id
        // let _balls = collisions.filter(v => v.object.ballRef).map(v => v.id);
        //
        // // loop balls
        // for(let _ball of this.balls)
        // {
        //     // not us, and not already a collision present
        //     if (_ball.id !== ball.id && _balls.indexOf(_ball.id) === -1)
        //     {
        //         // make bounding spheres if not present
        //         if (!_ball.boundingSphere)
        //         {
        //             _ball.boundingSphere = _ball.boundingBox.clone().getBoundingSphere();
        //             _ball.boundingSphere.radius = _ball.radius* (2/3);
        //         }
        //
        //         if (!ball.boundingSphere)
        //         {
        //             ball.boundingSphere = ball.boundingBox.clone().getBoundingSphere();
        //             ball.boundingSphere.radius = ball.radius * (2/3);
        //         }
        //
        //         // do we intersect?
        //         if (_ball.boundingSphere.intersectsBox(ball.boundingSphere))
        //         {
        //             //console.log("intersect");
        //             let n = new THREE.Vector3(_ball.position.x - ball.position.x, 0, _ball.position.z - ball.position.z).normalize();
        //             let un = n.clone().divideScalar(Math.sqrt(Math.pow(n.x, 2) + Math.pow(n.z, 2)));
        //             let ut = new THREE.Vector3(-un.z, 0, un.x).normalize();
        //             collisions.push({object: _ball, face:{normal:ut}});
        //         }
        //     }
        // }

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
                    let v1_ = vec1n_.add(vec1t_);
                    let v2_ = vec2n_.add(vec2t_);

                    ball.velocity.copy(v1_);
                    otherBall.velocity.copy(v2_);

                    //console.log(v1n_, v2n_);
                }
                else
                {
                    // we have a collision with static object! reflect our velocity
                    // let oldRot = ball.mesh.rotation.clone();
                    // let colDirX = Math.sign(ball.velocity.x);
                    // let colDirZ = Math.sign(ball.velocity.z);

                    ball.velocity = ball.velocity.reflect(collision.face.normal);
                    //ball.velocity = new THREE.Vector3();

                    // let colDist = new THREE.Vector3(Math.abs(ball.position.x - collision.point.x) * colDirX, 0, Math.abs(ball.position.z - collision.point.z) * colDirZ).normalize();
                    // ball.mesh.position.copy(collision.point.clone().sub(colDist.multiplyScalar(ball.radius + 0.001)));
                    // ball.mesh.__dirtyPosition = true;
                    // ball.mesh.rotation.copy(oldRot);
                    // ball.mesh.__dirtyRotation = true;
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

        if(ball.velocity.x === 0 && ball.velocity.z === 0)
             ball.velocity.copy(new THREE.Vector3(0,0,0));
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
