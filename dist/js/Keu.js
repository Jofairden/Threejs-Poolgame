class Keu
{
    constructor()
    {
        this.geometry = new THREE.CylinderGeometry(0.06, 0.1, 15, 32, 32);
        this.material = new THREE.MeshStandardMaterial({ color: 0xfda43a });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.y = 1.4;
        this.mesh.position.z = -8;
        this.mesh.rotateX(Math.PI / 2);
        this.mesh.rotateZ((Math.PI / 2)*-1);
        //mesh.position.x -= 15;
        this.mesh.rotateX(0.066);
        this.mesh.receiveShadow = true;
        this.position = this.mesh.position;
        this.rotation = this.mesh.rotation;
        this.ball = new THREE.Object3D(); // set this in object manager
        this.mesh.__skip = true; // dont automatically add us to the scene
        this.animating = false;
        this.__requireUpdate = true;
    }

    setupCueBall(ball, scene)
    {
        this.ball = ball;
        this.pivot = new THREE.Object3D();
        this.pivot.add(this.mesh);
        //this.ball.mesh.add(this.pivot);
        scene.add(this.pivot);
    }

    get direction()
    {
        let rotation = 2 * Math.PI - this.pivot.rotation.y;
        return new THREE.Vector3(Math.cos(rotation), 0, Math.sin(rotation));
    }

    get directionForward()
    {
        return this.directionBackward.negate();
    }

    get directionBackward()
    {
        // get the mesh matrix rotation
        let matrix = new THREE.Matrix4();
        matrix.extractRotation( this.mesh.matrix );

        // get the direction we are looking at!
        let direction = new THREE.Vector3( 0, 0, 1 );
        direction  = matrix.multiplyVector3( direction );
        direction.y = 0;
        return direction;
    }

    get heightVector()
    {
        var height = Math.pow(this.geometry.parameters.height, this.geometry.parameters.height);
        return new THREE.Vector3(height, 0, height);
    }

    update()
    {
        this.pivot.position.copy(this.ball.position);
        //this.position.copy(this.pivot.position);

        if (this.__requireUpdate)
        {
            this.position.copy(this.pivot.position);
            this.position.x -= this.direction.x * this.ball.diameter * 2;
            this.__requireUpdate = false;
        }
    }

    shoot()
    {

        // console.log(this.position);
        // console.log(this.directionBackward, this.directionForward, this.mesh.geometry);
        // // wat is our start position?, take the cueball position, subtract half our length and some padding (about the cueball radius)
        // let position = this.ball.position.clone().sub(this.heightVector.multiply(this.directionForward));
        // this.position.copy(position);
        // console.log(this.position);

        this.animating = true;

        let distance = 18; // how far back?
        let startPos = this.position.clone(); // start at this position

        let targetPos = this.position.clone().sub(this.directionForward.multiplyScalar(distance)); // move to here
        let backPos = targetPos.clone();
        let tween = new TWEEN.Tween(startPos)
            .to(targetPos, 500)
            .onUpdate(() =>
            {
                this.position.copy(startPos);
            });
        tween.easing(TWEEN.Easing.Cubic.InOut);

        let targetBackPos = backPos.clone().add(this.directionForward.multiplyScalar(distance + this.ball.diameter * 4)); // we want to go back here
        let tweenBack = new TWEEN.Tween(backPos)
            .to(targetBackPos, 150)
            .onUpdate(() =>
            {
               this.position.copy(backPos);
            })
            .onComplete(() =>
            {
                //this.position.x -= this.direction.x * this.ball.radius * 0.5;
                this.animating = false;
                shootBall.call(this);
            });
        tweenBack.easing(TWEEN.Easing.Elastic.In);

        // Chain the animations and start
        tween.chain(tweenBack).start();

        function shootBall()
        {
            setTimeout(function()
                {
                    //this.mesh.visible = false;
                    this.ball.velocity.copy(this.direction.divideScalar(Math.PI));

                }.bind(this),
                100);
        }
    }
}
