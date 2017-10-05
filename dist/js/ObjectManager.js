/**
 * The ObjectManager handles all objects in our game scene, from instantiating and adding them to the scene, to applying physics force to them.
 */

class ObjectManager
{
    constructor(gameScene)
    {
        this.gameScene = gameScene;

        //@todo: figure out better way for this (constructors dont take object)
        // this.l1 = new THREE.AmbientLight(0xffffff, 0.1);
        // this.l2 = new THREE.SpotLight(0xffffff, 0.65);
        // this.l2.position.set(10, 10, 10);
        // this.l2.decay = 2;
        // this.l2.penumba = 0.2;
        // this.l2.angle = 0.3;
        // this.l2.distance = 50;
        // this.l2.castShadow = true;
        // this.l2.shadow.mapSize.width = this.l2.shadow.mapSize.height = 1024;
        // this.l2.shadow.darkness = 0.5;
        // this.l2.shadow.camera.near = 20;
        // this.l2.shadow.camera.far = 30;
        //
        // this.lightHelper = new THREE.SpotLightHelper(this.l2);
        // this.lightHelper.matrixAutoUpdate = false;
        // this.lightCameraHelper = new THREE.CameraHelper(this.l2.shadow.camera);
        // this.lightCameraHelper.matrixAutoUpdate = false;


        // l2.shadow.camera.near = 500;
        // l2.shadow.camera.far = 4000;
        // l2.shadow.camera.fov = 30;

        this.objects = {
            PoolTable:
            [
                new PoolTable()
            ],
            PoolBalls:
            [
                new Ball(6.8, 0, 1),
                new Ball(7.35, -0.3, 2),
                new Ball(7.35, 0.3, 3),
                new Ball(7.9, -0.6, 4),
                new Ball(7.9, 0, 5),
                new Ball(7.9, 0.6, 6),
                new Ball(8.45, -0.9, 7),
                new Ball(8.45, -0.3, 8),
                new Ball(8.45, 0.3, 9),
                new Ball(8.45, 0.9, 10),
                new Ball(9, -1.2, 11),
                new Ball(9, -0.6, 12),
                new Ball(9, 0, 13),
                new Ball(9, 0.6, 14),
                new Ball(9, 1.2, 15),
            ],
            // Lights:
            // [
            //     this.l1,
            //     this.l2
            // ],
            // LightHelpers:
            // [
            //     this.lightHelper,
            //     this.lightCameraHelper
            // ]
        };
        this.objects[Symbol.iterator] = function()
        {
            var keys = [];
            var ref = this;
            for (var key in this) {
                //note:  can do hasOwnProperty() here, etc.
                keys.push(key);
            }

            return {
                next: function() {
                    if (this._keys && this._obj && this._index < this._keys.length) {
                        var key = this._keys[this._index];
                        this._index++;
                        return { key: key, value: this._obj[key], done: false };
                    } else {
                        return { done: true };
                    }
                },
                _index: 0,
                _keys: keys,
                _obj: ref
            };
        }
    }

    // ctorObj(child)
    // {
    //     return $.extend(true, Object.create(Object.getPrototypeOf(child)), child);
    // }

    /**
     * Adds specified object to the game scene
     * @param {THREE.Object3D} obj - The object
     */
    addToScene(obj)
    {
        if (obj instanceof THREE.Object3D)
            this.gameScene.add(obj);
    }

    // sets up scene
    setupScene()
    {
        // Add objs
        for(let arr of this.objects)
        {
            for(let obj of arr)
            {
                if (obj.mesh)
                    this.addToScene(obj.mesh);
                else
                    this.addToScene(obj);
            }
        }
    }

    // clears scene
    clearScene()
    {
        while(this.gameScene.children.length > 0)
        {
            disposeHierarchy(this.gameScene.children[0], disposeNode);
            this.gameScene.remove(this.gameScene.children[0]);
        }

        function disposeNode(node)
        {
            if (node instanceof THREE.Mesh)
            {
                if (node.geometry)
                {
                    node.geometry.dispose();
                }

                if (node.material)
                {
                    if (node.material instanceof THREE.MeshFaceMaterial)
                    {
                        $.each (node.material.materials, function (idx, mtrl)
                        {
                            if (mtrl.map)           mtrl.map.dispose();
                            if (mtrl.lightMap)      mtrl.lightMap.dispose();
                            if (mtrl.bumpMap)       mtrl.bumpMap.dispose();
                            if (mtrl.normalMap)     mtrl.normalMap.dispose();
                            if (mtrl.specularMap)   mtrl.specularMap.dispose();
                            if (mtrl.envMap)        mtrl.envMap.dispose();

                            mtrl.dispose(); // disposes any programs associated with the material
                        });
                    }
                    else
                    {
                        if (node.material.map)          node.material.map.dispose();
                        if (node.material.lightMap)     node.material.lightMap.dispose();
                        if (node.material.bumpMap)      node.material.bumpMap.dispose();
                        if (node.material.normalMap)    node.material.normalMap.dispose();
                        if (node.material.specularMap)  node.material.specularMap.dispose();
                        if (node.material.envMap)       node.material.envMap.dispose();

                        node.material.dispose(); // disposes any programs associated with the material
                    }
                }
            }
        }

        // recursive dispose
        function disposeHierarchy(node, callback)
        {
            for (var i = node.children.length - 1; i >= 0; i--)
            {
                var child = node.children[i];
                disposeHierarchy (child, callback);
                callback(child);
            }
        }
    }

    // clears, then setup
    renewScene()
    {
        this.clearScene();
        this.setupScene();
    }
}
