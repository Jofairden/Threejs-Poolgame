/**
 * Defines the pool table object (the table we play on)
 */

class PoolTable
{
    constructor()
    {
        let colGroup = new THREE.Group(),
            clothTexture,
            woodTexture,
            tableMesh,
            tableWall1,
            tableWall2,
            tableWall3,
            tableWall4;

        makeTextures();
        makeMeshes();
        setPositions();

        function makeTextures()
        {
            clothTexture = ContentManager.LoadTexture("cloth.jpg");
            woodTexture = ContentManager.LoadTexture("wood.jpg");

            clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
            clothTexture.repeat.set(2,2);

            woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
            woodTexture.repeat.set(1,1);
        }

        function makeMeshes()
        {
            tableMesh = makeMesh(27.2, 0.7, 14.4, 1, clothTexture, "TABLE");
            tableWall1 = makeMesh(28.2, 1.2, 0.5, 1, woodTexture, "TABLE-WALL");
            tableWall2 = tableWall1.clone();
            tableWall3 = makeMesh(0.5, 1.2, 14.4, 1, woodTexture, "TABLE-WALL");
            tableWall4 = tableWall3.clone();

            function makeMesh(a, b, c, d, texturemap, name)
            {
                var mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(a, b, c, d, 0),
                    new THREE.MeshPhongMaterial( {flatShading: true, map:texturemap, side: THREE.FrontSide } )
                );
                mesh.name = name;
                return mesh;
            }
        }

        function setPositions()
        {
            tableMesh.position.y = 0;

            tableWall1.position.y = 0.25;
            tableWall1.position.z = 7.45;

            tableWall2.position.y = 0.25;
            tableWall2.position.z = -7.45;

            tableWall3.position.x = 13.85;
            tableWall3.position.y = 0.25;

            tableWall4.position.x = -13.85;
            tableWall4.position.y = 0.25;
        }

        tableMesh.receiveShadow = true;

        // Combine and return
        colGroup.add(tableMesh, tableWall1, tableWall2, tableWall3, tableWall4);
        return colGroup;
    }
}
