/**
 * The ObjectManager handles all objects in our game scene, from instantiating and adding them to the scene, to applying physics force to them.
 */

class ObjectManager
{
    constructor(game)
    {
        this.game = game;

        this.objects = {
            PoolTable: new PoolTable(),
            PoolBalls:
            [
                new Ball(-6.8, 0, 0),
                new Ball(6.8, 0, 1),
                new Ball(7.35, -0.3, 9),
                new Ball(7.35, 0.3, 3),
                new Ball(7.9, -0.6, 14),
                new Ball(7.9, 0, 8),
                new Ball(7.9, 0.6, 12),
                new Ball(8.45, -0.9, 7),
                new Ball(8.45, -0.3, 10),
                new Ball(8.45, 0.3, 6),
                new Ball(8.45, 0.9, 5),
                new Ball(9, -1.2, 11),
                new Ball(9, -0.6, 4),
                new Ball(9, 0, 13),
                new Ball(9, 0.6, 2),
                new Ball(9, 1.2, 15),
            ],
            Keu: new Keu()
        };
        this.objects.Keu.setupCueBall(this.objects.PoolBalls[0], game.gameScene);

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
        if (obj instanceof THREE.Object3D && !obj.__skip) // check again, we could  be called from outside setupScene()
            this.game.gameScene.add(obj);
    }

    // sets up scene
    setupScene()
    {
        // this function tries to add a mesh to the game scene
        // if an obj is not a mesh itself, it will look for it
        let tryToAdd = function(obj)
        {
            if (obj instanceof THREE.Object3D) // our obj is an Object3D, safe to add
                this.addToScene(obj);
            else if (obj.mesh && obj.mesh instanceof THREE.Object3D) // .mesh is defined and is an Object3D
                this.addToScene(obj.mesh);
            else
            {
                // no mesh found, iterate
                for (var prop in obj)
                {
                    if (obj.hasOwnProperty(prop))
                    {
                        if (prop instanceof THREE.Object3D && prop instanceof THREE.Mesh)
                        {
                            this.addToScene(prop);
                            break; // found mesh, break the loop
                        }
                    }
                }
            }
        }.bind(this);

        // iterate .objects
        for(let arr of this.objects)
        {
            // key has an iterator, likely an array so for..of loop the array
            if (typeof arr[Symbol.iterator] === 'function')
            {
                for(let obj of arr)
                {
                    tryToAdd(obj);
                }
            }
            else // no iterator, we imply it's an object
                tryToAdd(arr);
        }
    }

    // clears scene
    clearScene()
    {
        while(this.game.gameScene.children.length > 0)
        {
            disposeHierarchy(this.game.gameScene.children[0], disposeNode);
            this.game.gameScene.remove(this.game.gameScene.children[0]);
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
