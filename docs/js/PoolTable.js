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
            tableWall1,
            tableWall2,
            tableWall3,
            tableWall4,
            pocket1,
            pocket2,
            pocket3,
            pocket4,
            pocket5,
            pocket6,
            triangle1;

        this.tableMesh = new THREE.Mesh();
        this.fullWall = new THREE.Mesh();

        makeTextures.call(this);
        makeMeshes.call(this);
        setPositions.call(this);
        // makeHoles(pocket1);
        // makeHoles(pocket2);
        // makeHoles(pocket3);
        // makeHoles(pocket4);
        // makeHoles(pocket5);
        // makeHoles(pocket6);

        function makeTextures()
        {
            clothTexture = ContentManager.LoadTexture("cloth.jpg");
            woodTexture = ContentManager.LoadTexture("wood.jpg");

            clothTexture.wrapS = clothTexture.wrapT = THREE.RepeatWrapping;
            clothTexture.offset.set(0,0);
            clothTexture.repeat.set(2,2);

            woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
            woodTexture.offset.set(0,0);
            woodTexture.repeat.set(1,1);
        }

        function makeMeshes()
        {
            var thickness = 2;

            this.tableMesh = makeMesh(27.2, 0.7, 14.4, 1, "TABLE");
            tableWall1 = makeMesh(25.7, 1.2, thickness, 1, "TABLE-WALL");
            tableWall2 = tableWall1.clone();
            tableWall3 = makeMesh(thickness, 1.2, 16.9, 1, "TABLE-WALL");
            tableWall4 = tableWall3.clone();

            pocket1 = makePocket("POCKET-1");
            pocket2 = makePocket("POCKET-2");
            pocket3 = makePocket("POCKET-3");
            pocket4 = makePocket("POCKET-4");
            pocket5 = makePocket("POCKET-5");
            pocket6 = makePocket("POCKET-6");

            triangle1 = makeTriangle();

            function makeMesh(a, b, c, d, name)
            {
                var mesh = new THREE.Mesh(new THREE.BoxGeometry(a, b, c, d, 0));
                mesh.name = name;
                return mesh;
            }

            function makePocket(name)
            {
                var mesh = new THREE.Mesh(
                    new THREE.CylinderGeometry(0.7, 0.7, 1.2, 12, 1),
                    new THREE.MeshBasicMaterial({color: 0xffff00})
                );
                mesh.name = name;
                mesh.visible = false;// do not render
                return mesh;
            }
            function makeTriangle()
            {
                let geom = new THREE.Geometry();
                let v1 = new THREE.Vector3(0,0,0);
                let v2 = new THREE.Vector3(30,0,0);
                let v3 = new THREE.Vector3(30,30,0);

                console.log(geom.vertices);
                geom.vertices.push(new THREE.Vertex(v1));
                geom.vertices.push(new THREE.Vertex(v2));
                geom.vertices.push(new THREE.Vertex(v3));

                geom.faces.push( new THREE.Face3( 0, 1, 2 ) );
                //geom.computeFaceNormals();

                var mesh = new THREE.Mesh( geom, new THREE.MeshNormalMaterial() );
                return mesh;
            }
        }

        function setPositions()
        {
            this.tableMesh.position.y = 0;

            // top
            tableWall1.position.y = 0.25;
            tableWall1.position.z = 7.45;

            // bottom
            tableWall2.position.y = 0.25;
            tableWall2.position.z = -7.45;

            // right
            tableWall3.position.x = 13.85;
            tableWall3.position.y = 0.25;

            // left
            tableWall4.position.x = -13.85;
            tableWall4.position.y = 0.25;

            // pocket direction: top to bottom, left to right
            // 6 total pockets for 8ball table
            // top left

            var pX = 12.9;
            var pY = 0.25;
            var pZ = 7;

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

            triangle1.position.x = pX;
            triangle1.position.y = pY + 1;
            triangle1.position.z = pZ;
        }

        function makeHoles()
        {
            var pockets = [pocket1, pocket2, pocket3, pocket4, pocket5, pocket6];

            let wallbsp  = new ThreeBSP(this.fullWall),
                tablebsp = new ThreeBSP(this.tableMesh);

            for (let pocket of pockets)
            {
                var pocketMesh = new THREE.Mesh(pocket.geometry);
                pocketMesh.position.copy(pocket.position);
                var bsp2 = new ThreeBSP(pocketMesh);
                wallbsp = wallbsp.subtract(bsp2);
                tablebsp = tablebsp.subtract(bsp2);
            }
            // for (let triangle of triangles)
            // {
            //
            // }

            this.fullWall = wallbsp.toMesh(new THREE.MeshPhongMaterial({
                flatShading: true,
                map: woodTexture,
                side: THREE.FrontSide
            }));
            this.tableMesh = tablebsp.toMesh(new THREE.MeshPhongMaterial({
                flatShading: true,
                map: clothTexture,
                side: THREE.FrontSide
            }));
            this.fullWall.geometry.computeVertexNormals();
            this.tableMesh.geometry.computeVertexNormals();
            this.fullWall.name = "TABLE-WALL";
            this.tableMesh.name = "TABLE";
        }

        // merge walls
        // we merge walls into a single object to make it easier to create the pocket holes
        // the three js csg is very unoptimized when not starting out with BSP trees
        // creating a lot of redundant vertices in the geometries
        // this can be seen enabling the debug mode (F1) to toggle wireframes and increasing the pocket radiusSegments and heightSegments
        tableWall1.updateMatrix();
        tableWall2.updateMatrix();
        tableWall3.updateMatrix();
        tableWall4.updateMatrix();
        this.fullWall = new THREE.Geometry();
        this.fullWall.merge(tableWall1.geometry, tableWall1.matrix);
        this.fullWall.merge(tableWall2.geometry, tableWall2.matrix);
        this.fullWall.merge(tableWall3.geometry, tableWall3.matrix);
        this.fullWall.merge(tableWall4.geometry, tableWall4.matrix);
        this.fullWall = new THREE.Mesh(this.fullWall);
        this.fullWall.name = "TABLE-WALL";
        makeHoles.call(this);
        //makeOtherholes.call(this);
        this.fullWall.geometry.computeVertexNormals();
        this.tableMesh.geometry.computeVertexNormals();
        this.fullWall.name = "TABLE-WALL";
        this.tableMesh.name = "TABLE";
        //this.fullWall.material.wireframe = true;
        this.tableMesh.receiveShadow = true;
        // Combine and return
        //colGroup.add(tableMesh, tableWall1, tableWall2, tableWall3, tableWall4, pocket1, pocket2, pocket3, pocket4, pocket5, pocket6);
        colGroup.add(this.tableMesh, this.fullWall, pocket1, pocket2, pocket3, pocket4, pocket5, pocket6);
        this.mesh = colGroup;
    }
}
