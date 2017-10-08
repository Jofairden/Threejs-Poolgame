class GameMenu
{
    constructor()
    {
        this.clock = new THREE.Clock(true);
        this.active = false;

        this.scene = new THREE.Scene();
        this.controls = new MenuControls();

        this.texts = [];

        ContentManager.FontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font )
        {
            var playText = makeText("PLAY", new THREE.Color("rgb(0, 255, 0)").getHex()),
                debugText =  makeText("TOGGLE DEBUG", new THREE.Color("rgb(0, 255, 0)").getHex());

            playText.mesh.onClick = function()
            {
                Game.instance.renderStates.Game.activate(Game.instance);
            };

            debugText.mesh.onClick = function()
            {
                Game.instance.toggleDebug();
            };

            debugText.mesh.position.y -= 1.5;

            this.scene.add(playText.mesh);
            this.scene.add(debugText.mesh);

            this.texts.push(playText);
            this.texts.push(debugText);

            function makeText(text, color)
            {
                return new MenuText(font, text, color);
            }

        }.bind(this) );

        //create two spotlights to illuminate the scene
        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( -40, 60, -10 );
        spotLight.intensity = .5;
        this.scene.add( spotLight );

        var spotLight2 = new THREE.SpotLight( 0x5192e9 );
        spotLight2.position.set( 40, -60, 30 );
        spotLight2.intensity = .5;
        this.scene.add( spotLight2 );

        document.addEventListener('mousemove', this.update.bind(this), false );
        document.addEventListener('mousedown', this.mouseDown, false );

        this.remainingRot = new THREE.Vector3(0, 0, 0);

        //Space background is a large sphere
        var spacetex = ContentManager.LoadTexture("space.jpg");
        var spacesphereGeo = new THREE.SphereGeometry(20,20,20);
        var spacesphereMat = new THREE.MeshPhongMaterial();
        spacesphereMat.map = spacetex;

        this.spacesphere = new THREE.Mesh(spacesphereGeo,spacesphereMat);

        //spacesphere needs to be double sided as the camera is within the spacesphere
        this.spacesphere.material.side = THREE.BackSide;

        this.spacesphere.material.map.wrapS = THREE.RepeatWrapping;
        this.spacesphere.material.map.wrapT = THREE.RepeatWrapping;
        this.spacesphere.material.map.repeat.set( 5, 3);

        this.scene.add(this.spacesphere);
    }

    mouseDown(e)
    {
        e.preventDefault();

        var intersects = Game.instance.getMouseIntersects();

        for ( var i = 0; i < intersects.length; i++ )
        {
            if (intersects[i].object.onClick)
                intersects[i].object.onClick();
        }
    }

    update(e)
    {
        if (e)
        {
            var halfWidth = window.innerWidth/2,
                halfHeight = window.innerHeight/2,
                mouseX = e.clientX - halfWidth,
                mouseY = e.clientY - halfHeight;

            var x = ( mouseX - this.controls.camera.position.x ) * 0.001,
                y = ( -mouseY - this.controls.camera.position.y ) * 0.001,
                z = ( mouseX - this.controls.camera.position.x -mouseY - this.controls.camera.position.y) * 0.00005;


            this.controls.camera.position.x += x/50;
            this.controls.camera.position.y += y/50;
            this.controls.camera.position.z += z/50;
            this.controls.camera.lookAt( this.scene.position );

            this.remainingRot.x = x/1000;
            this.remainingRot.y = y/1000;
            this.remainingRot.z = z/1000;
        }

        if (this.remainingRot
            && this.remainingRot instanceof THREE.Vector3)
        {
            this.spacesphere.rotation.x += this.remainingRot.x;
            this.spacesphere.rotation.y += this.remainingRot.y;
            this.spacesphere.rotation.z += this.remainingRot.z;
            this.controls.camera.lookAt( this.scene.position );

            this.remainingRot.x *= 0.90;
            this.remainingRot.y *= 0.90;
            this.remainingRot.z *= 0.90;
        }

        this.spacesphere.rotation.y += 0.001 + this.remainingRot.y/100;
    }

    render()
    {
        this.update();
    }
}

class MenuText
{
    constructor(font, text, color)
    {
        this.material = new THREE.MeshPhongMaterial({
            color: color
        });

        this.geometry = new THREE.TextGeometry(text, {
            font: font,
            size: 1,
            height: 1,
            curveSegments: 10,
        } );

        this.geometry.computeBoundingBox();
        this.geometry.textWidth = this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x;

        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x -= this.geometry.textWidth/2;
    }

    onClick()
    {
        console.log("onClick() was called on menu text, but had no code")
    }
}

class MenuControls
{
    constructor()
    {
        this.camera = makeGameCamera();
        this.resetCamera();
        this.controls = new THREE.OrbitControls(this.camera);

        this.controls.enableZoom = false;
        this.controls.enableRotate = false;
        this.controls.enablePan = false;
        //this.controls.enableDamping = false;

        function makeGameCamera()
        {
            return new THREE.PerspectiveCamera(45 , window.innerWidth / window.innerHeight , 0.1, 1000);
        }
    }

    resetCamera()
    {
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 15;
    }
}

