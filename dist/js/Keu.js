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
    }

    update()
    {
        //this.position.copy(Game.instance.objectMgr.objects.PoolBalls[0].position);
        //this.position.y = 1.3;
        //this.position.x = -15;
    }

    shoot() {
        var position = this.position.clone();
        var tween = new TWEEN.Tween(position);
        tween.to(new THREE.Vector3(-18, 1.4, 0), 500)
            .onUpdate(() => {
                console.log(position.x);
                this.position.set(position.x, position.y, position.z);
            })

        var position2 = new THREE.Vector3(-18, 1.4, 0);
        var tween2 = new TWEEN.Tween(position2);
        tween2.to(new THREE.Vector3(-14.5, 1.4, 0), 150)
            .onUpdate(() => {
                console.log(position2.x);
                this.position.set(position2.x, position2.y, position2.z);
            })

            tween.chain(tween2)
            .start();
    }
}
