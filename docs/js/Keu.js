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
    }

    setupCueBall(ball, scene)
    {
        this.ball = ball;
        this.pivot = new THREE.Object3D();
        this.pivot.add(this.mesh);
        //this.ball.mesh.add(this.pivot);
        scene.add(this.pivot);
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
        //this.pivot.position.copy(this.ball.position.clone().add(this.directionBackward.multiplyScalar(this.ball.radius*50)));
        this.pivot.position.copy(this.ball.position);

        if (!this.animating)
        {
            this.position.copy(this.pivot.position);
            //this.rotation = this.ball.angleOfVelocity;
            this.position.x -= this.mesh.rotation.x * this.ball.radius * 3;
            //this.pivot.rotation.y += 0.01;
        }
    }

    shoot() {

        // console.log(this.position);
        // console.log(this.directionBackward, this.directionForward, this.mesh.geometry);
        // // wat is our start position?, take the cueball position, subtract half our length and some padding (about the cueball radius)
        // let position = this.ball.position.clone().sub(this.heightVector.multiply(this.directionForward));
        // this.position.copy(position);
        // console.log(this.position);

        this.animating = true;

        let distance = 18; // how far back?

        let posBack = this.position.clone().sub(this.directionForward.multiplyScalar(distance));
        let posFront = this.position.clone();

        // animations
        let tween = new TWEEN.Tween(posBack);
        tween.to(posBack, 500)
            .onUpdate(() => {
                //console.log(position.x);
                this.position.set(posBack.x, posBack.y, posBack.z);
            });

        let position2 = posFront.clone();
        let tween2 = new TWEEN.Tween(position2);
        tween2.to(posFront, 150)
            .onUpdate(() => {
                //console.log(position2.x);
                this.position.set(position2.x, position2.y, position2.z);
            });

        tween.chain(tween2)
            .start();
        tween2.onComplete(function () {
            this.animating = false;
            shootBall.call(this);
        }.bind(this));

        function shootBall()
        {
            setTimeout(function()
                {
                    //this.mesh.visible = false;
                    this.ball.velocity.copy(this.directionForward).multiplyScalar(5);
                }.bind(this),
                100);
        }
    }
}
