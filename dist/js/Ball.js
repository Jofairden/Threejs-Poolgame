/**
 * Defines a ball object
 */

class Ball
{
    constructor(x, z, id)
    {
        this.id = id;
        this.radius = 0.3;
        let map = ContentManager.LoadTexture(`balls/${this.id}.png`);

        //Testing
        this.derpx = Math.floor(Math.random() * 10)/100;
        this.derpx *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        this.derpy = Math.floor(Math.random() * 10)/100;
        this.derpy *= Math.floor(Math.random()*2) == 1 ? 1 : -1;

        //

        this.velocity = new THREE.Vector3(this.derpx * Math.PI, 0, this.derpy * Math.PI);

        this.geometry = new THREE.SphereGeometry(0.3, 36, 16);
        this.material = new THREE.MeshPhongMaterial(id === 0 ? { color: 0xffffff } : {
            map: map
        });

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.y = 0.66;
        this.mesh.position.x = x;
        this.mesh.position.z = z;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.position = this.mesh.position;


        //this.boundingBox = new THREE.Box3().setFromObject(this.mesh);
        //this.boundingBoxHelper = new THREE.BoxHelper(this.mesh, 0xffff00 );
        //this.vertexNormalsHelper = new THREE.VertexNormalsHelper( this.mesh, 0.1, 0xff0000 );
    }

    get diameter()
    {
        return this.radius * 2;
    }


    update()
    {
        //this.boundingBoxHelper.update();
        //this.vertexNormalsHelper.update();
    }

    render()
    {

    }
}
