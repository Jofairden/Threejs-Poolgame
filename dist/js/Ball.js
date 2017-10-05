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
        let map = ContentManager.LoadTexture(`balls/${this.id}.png`);

        //Testing
        this.derpx = Math.floor(Math.random() * 10)/100;
        this.derpx *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        this.derpy = Math.floor(Math.random() * 10)/100;
        this.derpy *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

        //

        this.velocity = new THREE.Vector3(this.derpx * 3, 0, this.derpy * 3);

        this.geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        this.material = new THREE.MeshPhongMaterial(id === 0 ? { color: 0xffffff } : {
            map: map
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.name = "BALL-" + this.id;
        this.mesh.position.y = 0.66;
        this.mesh.position.x = x;
        this.mesh.position.z = z;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.position = this.mesh.position;
        this.radius = radius;

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

    // the angular velocity of an object is the rate of change of its angular displacement with respect to time.
    get angularVelocity()
    {
        return (this.radius * this.velocity.length()) / Math.pow(this.radius, 2);
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
        this.boundingBoxHelper.update();

        Game.instance.gameScene.remove(Game.instance.gameScene.getObjectByName(this.rayHelper.name));
        this.boundingBoxHelper.visible = false;

        if (Game.instance.debugMode)
        {
            this.rayHelper = new THREE.ArrowHelper(this.velocityDirection, this.position, 1, 0xffff00);
            this.rayHelper.name = "BALL-RAYHELPER-" + this.id;
            Game.instance.gameScene.add(this.rayHelper);
            this.boundingBoxHelper.visible = true;
        }

        //this.vertexNormalsHelper.update();
    }

    render()
    {

    }
}
