class Skybox
{
    constructor(a,b,c,...meshes)
    {
        const geometry = new THREE.CubeGeometry(a,b,c);
        const materials =
            [
                ContentManager.SkyboxMesh(meshes[0]),
                ContentManager.SkyboxMesh(meshes[1]),
                ContentManager.SkyboxMesh(meshes[2]),
                ContentManager.SkyboxMesh(meshes[3]),
                ContentManager.SkyboxMesh(meshes[4]),
                ContentManager.SkyboxMesh(meshes[5]),
            ];

        // this.boxMaterial = new THREE.MeshFaceMaterial(this.materials.map(mesh => mesh.mesh));
        return new THREE.Mesh(geometry, materials);
    }
}
