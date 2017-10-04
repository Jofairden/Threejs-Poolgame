/**
 * Defines a ball object
 */

class Ball {
    constructor(x, z) {

        //Testing
        this.derpx = Math.floor(Math.random() * 10)/100;
        this.derpx *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        this.derpy = Math.floor(Math.random() * 10)/100;
        this.derpy *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        //

        this.velocity = new THREE.Vector2(this.derpx, this.derpy);

        this.geometry = new THREE.SphereGeometry(0.3, 36, 16);
        this.material = new THREE.MeshPhongMaterial({color: 0xffffff, side:THREE.FrontSide});

        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.mesh.position.y = 0.66;
        this.mesh.position.x = x;
        this.mesh.position.z = z;
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;

        this.velocity.z = this.velocity.y;
        this.position = this.mesh.position;
    }

    updateVelocity()
    {
        this.position.x += this.velocity.x;
        this.position.z += this.velocity.z;
    }

    applyDrag()
    {
        this.velocity.x *= 0.99;
        this.velocity.z *= 0.99;
    }
}
