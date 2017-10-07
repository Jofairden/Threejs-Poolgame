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
            tableWall4,
            pocket1,
            pocket2,
            pocket3,
            pocket4,
            pocket5,
            pocket6;

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

            pocket1 = makePocket("POCKET-1");
            pocket2 = makePocket("POCKET-2");
            pocket3 = makePocket("POCKET-3");
            pocket4 = makePocket("POCKET-4");
            pocket5 = makePocket("POCKET-5");
            pocket6 = makePocket("POCKET-6");

            function makeMesh(a, b, c, d, texturemap, name)
            {
                var mesh = new THREE.Mesh(
                    new THREE.BoxGeometry(a, b, c, d, 0),
                    new THREE.MeshPhongMaterial( {flatShading: true, map:texturemap, side: THREE.FrontSide } )
                );
                mesh.name = name;
                return mesh;
            }

            function makePocket(name)
            {
                var mesh = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.6, 0.6, 0.6, 32, 32),
                    new THREE.MeshBasicMaterial({color: 0xffff00})
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

            // pocket direction: top to bottom, left to right
            // 6 total pockets for 8ball table
            // top left

            var pX = 13.6;
            var pY = 0.45;
            var pZ = 7.2;

            pocket1.position.x = -pX;
            pocket1.position.y = pY;
            pocket1.position.z = -pZ;

            // top middle
            pocket2.position.x = 0;
            pocket2.position.y = pY;
            pocket2.position.z = -pZ;

            // top right
            pocket3.position.x = pX;
            pocket3.position.y = pY;
            pocket3.position.z = -pZ;

            // bottom left
            pocket4.position.x = -pX;
            pocket4.position.y = pY;
            pocket4.position.z = pZ;

            // bottom middle
            pocket5.position.x = 0;
            pocket5.position.y = pY;
            pocket5.position.z = pZ;

            // bottom right
            pocket6.position.x = pX;
            pocket6.position.y = pY;
            pocket6.position.z = pZ;
        }

        tableMesh.receiveShadow = true;

        // Combine and return
        colGroup.add(tableMesh, tableWall1, tableWall2, tableWall3, tableWall4, pocket1, pocket2, pocket3, pocket4, pocket5, pocket6);
        return colGroup;
    }
}
