class Keu
{
    constructor(gameScene)
    {
        let keuGeometry = new THREE.CylinderGeometry(0.06, 0.1, 15, 32, 32),
            keuMaterial = new THREE.MeshStandardMaterial({ color: 0xfda43a }),
            keuMesh = new THREE.Mesh(keuGeometry, keuMaterial);
        keuMesh.position.y = 1.2;
        keuMesh.rotateX(Math.PI / 2);
        keuMesh.rotateZ((Math.PI / 2)*-1);
        //keuMesh.position.x -= 15;
        keuMesh.rotateX(0.066);

        let whiteBall = gameScene.PoolBalls[0];

        keuMesh.position.x = whiteBall.position.x;
        keuMesh.position.z = whiteBall.position.z;

        keuMesh.receiveShadow = true;
        return keuMesh;
    }

}
