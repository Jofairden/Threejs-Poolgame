/**
 * The ObjectManager handles all objects in our game scene, from instantiating and adding them to the scene, to applying physics force to them.
 */

class ObjectManager
{
    constructor(gameScene)
    {
        this.gameScene = gameScene;

        //@todo: figure out better way for this (constructors dont take object)
        let l1 = new THREE.AmbientLight(0xffffff, 0.1);
        let l2 = new THREE.SpotLight(0xffffff, 0.65);
        l2.position.set(20,15,3);
        l2.castShadow = true;
        l2.shadow.darkness = 0.5;
        l2.shadow.mapSize.width = 1024;
        l2.shadow.mapSize.height = 1024;
        l2.shadow.camera.near = 0.01;
        l2.shadow.camera.far = 25;

        let l3 = l2.clone();
        l3.position.x = -20;

        this.l4 = l2.clone();
        this.l4.position.x = 0;
        this.l4.position.y = 35;

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
                    new Ball(6.8, 0),
                    new Ball(7.35, -0.3),
                    new Ball(7.35, 0.3),
                    new Ball(7.9, -0.6),
                    new Ball(7.9, 0),
                    new Ball(7.9, 0.6),
                    new Ball(8.45, -0.9),
                    new Ball(8.45, -0.3),
                    new Ball(8.45, 0.3),
                    new Ball(8.45, 0.9),
                    new Ball(9, -1.2),
                    new Ball(9, -0.6),
                    new Ball(9, 0),
                    new Ball(9, 0.6),
                    new Ball(9, 1.2),
                ],
            Lights:
                [
                    l1,
                    //l2,
                    //l3,
                    this.l4,
                ],
            LightHelpers:
                [
                    new THREE.CameraHelper(this.l4.shadow.camera)
                ]
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
