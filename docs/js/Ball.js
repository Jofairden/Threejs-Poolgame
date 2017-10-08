/**
 * Defines a ball object
 */

class Ball
{
    constructor(x, z, id)
    {
        const radius = 0.3;
        const widthSegments = 32;
        const heightSegments = 32;

        this.id = id;

        //let map = ContentManager.LoadTexture(`balls/${this.id}.png`);

        this.velocity = new THREE.Vector3(0, 0, 0);
        if (id === 0)
            this.velocity = new THREE.Vector3();

        this.geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        this.material = new THREE.MeshPhongMaterial({ color: 0xffffff });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = "BALL-" + this.id;
        this.mesh.position.y = 0.66;
        this.mesh.position.x = x;
        this.mesh.position.z = z;
        this.mesh.castShadow = true;
        // this.mesh.receiveShadow = true;
        this.mesh.ballRef = this;

        this.mass = id === 0 ? 0.320 : 0.160; // cueball weighs more
        this.radius = radius;
        this.position = this.mesh.position;
        this.rotation = this.mesh.rotation;

        this.rayHelper = new THREE.ArrowHelper(this.angleOfVelocity, this.position, 1, 0xffff00);
        this.rayHelper.name = "BALL-RAYHELPER-" + this.id;
        this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
        this.boundingBoxHelper = new THREE.BoxHelper(this.mesh, 0xffff00 );
        //this.vertexNormalsHelper = new THREE.VertexNormalsHelper( this.mesh, 0.1, 0xff0000 );
    }

    get diameter()
    {
        return this.radius * 2;
    }

    get circumference()
    {
        return Math.PI * 2 * this.radius;
    }

    // angular velocity = angular speed
    // denoted by w (omega)
    // x revolutions / sec
    // linear velocity: v = s/t
    // s = arc length = 2pi*r * (theta/360) = 2pi*r * (theta/2pi) = r * theta
    // so v = (r*theta)/t
    // angular velocity: w = theta/t
    // so v = r*w

    get linearVelocity()
    {
        return this.angularVelocity * this.radius;
    }

    // the angular velocity of an object is the rate of change of its angular displacement with respect to time.
    get angularVelocity()
    {
        return Math.pow(Math.PI, 2) * this.velocity.length();
    }

    get rotationAxis()
    {
        return new THREE.Vector3(this.velocity.z, 0, -this.velocity.x).normalize();
    }

    get angleOfVelocity()
    {
        return Math.atan2(this.velocity.z, this.velocity.x);
    }

    get velocityDirection()
    {
        var angle = this.angleOfVelocity;
        return new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle));
    }

    update()
    {
        let debug = Game.instance.debugMode;

        if (!this.cube)
        {
            var geometry = new THREE.BoxGeometry( this.radius, this.radius, this.radius);
            var material = new THREE.MeshBasicMaterial( {color: new THREE.Color("rgba(255,0,0)")} );
            this.cube = new THREE.Mesh( geometry, material );
            this.cube.visible = false;
            this.cubeHelper = new THREE.BoxHelper(this.cube, new THREE.Color("rgb(255, 0, 0)"));
            this.cubeHelper.visible = true;
            Game.instance.gameScene.add(this.cube);
            Game.instance.gameScene.add(this.cubeHelper);
        }
        else
        {
            this.cubeHelper.visible = debug;

            var v1 = new THREE.Vector3();
            var halfSize = v1.copy(this.boundingBox.getSize()).multiplyScalar(0.5);
            var dirVec = this.velocityDirection.clone().normalize();

            // var bb = new THREE.Box3();
            // bb.min.copy(this.boundingBox.min).sub(halfSize.multiply(dirVec));
            // bb.max.copy(this.boundingBox.max).sub(halfSize.multiply(dirVec));

            this.cube.position.copy(this.position.clone().sub(halfSize.multiply(dirVec)));
            this.cubeHelper.update();
        }

        // this.boundingBox.min.copy(this.position).sub(halfSize);
        // this.boundingBox.max.copy(this.position).add(halfSize);

        // if(!this.afab)
        // {
        //     this.afab = true;
        //     console.log(this.boundingBoxHelper);
        // }

        this.boundingBoxHelper.visible = debug;
        this.rayHelper.visible = debug;

        if (debug)
        {
            this.boundingBoxHelper.update();
            this.rayHelper.position.copy(this.position);
            this.rayHelper.setDirection(this.velocityDirection);
        }

        //this.vertexNormalsHelper.update();
    }

    render()
    {

    }
}
