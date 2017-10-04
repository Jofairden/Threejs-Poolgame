/**
 * Defines a ball object
 */

class Ball {
    constructor(x, z) {

        this.geometry = new THREE.SphereGeometry(0.3, 36, 16);
        this.material = new THREE.MeshPhongMaterial({color: 0xffffff, side:THREE.FrontSide});

        this.ballMesh = new THREE.Mesh(this.geometry, this.material);

        this.ballMesh.position.y = 1;
        this.ballMesh.position.x = x;
        this.ballMesh.position.z = z;
        this.ballMesh.castShadow = true;
        this.ballMesh.receiveShadow = true;

        return this.ballMesh;
    }
}
