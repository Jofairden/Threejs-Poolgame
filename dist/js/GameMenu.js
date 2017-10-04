class GameMenu
{
    constructor()
    {
        this.clock = new THREE.Clock(true);
        this.enabled = false;

        this.scene = new THREE.Scene();
        this.controls = new MenuControls();

        this.texts = [];

        ContentManager.FontLoader.load( 'fonts/helvetiker_regular.typeface.json', function ( font )
        {
            var playText = makeText("PLAY", new THREE.Color("rgb(0, 255, 0)").getHex()),
                debugText =  makeText("TOGGLE DEBUG", new THREE.Color("rgb(0, 0, 255)").getHex());

            playText.mesh.onClick = function()
            {
                Game.instance.renderStates.Game.activate(Game.instance);
            };

            debugText.mesh.onClick = function()
            {
                Game.instance.debugMode = !Game.instance.debugMode;
                Game.instance.stats.update(Game.instance.debugMode);
            };

            console.log(playText);

            debugText.mesh.position.y -= 120;

            this.scene.add(playText.mesh);
            this.scene.add(debugText.mesh);

            this.texts.push(playText);
            this.texts.push(debugText);

            function makeText(text, color)
            {
                return new MenuText(font, text, color);
            }

        }.bind(this) );

        this.scene.add(new THREE.AmbientLight(0xfff, 0.33));

        document.addEventListener('mousemove', this.update.bind(this), false );
        document.addEventListener('mousedown', this.mouseDown, false );

        this.remainingRot = new THREE.Vector3(0, 0, 0);
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

            var x = ( mouseX - this.controls.camera.position.x ) * 0.05,
                y = ( -mouseY - this.controls.camera.position.y ) * 0.05,
                z = ( mouseX - this.controls.camera.position.x -mouseY - this.controls.camera.position.y) * 0.005;


            this.controls.camera.position.x += x;
            this.controls.camera.position.y += y;
            this.controls.camera.position.z += z;
            this.controls.camera.lookAt( this.scene.position );

            this.remainingRot.x = x/5;
            this.remainingRot.y = y/5;
            this.remainingRot.z = z/5;
        }

        if (this.remainingRot
            && this.remainingRot instanceof THREE.Vector3)
        {
            this.controls.camera.position.x += this.remainingRot.x;
            this.controls.camera.position.y += this.remainingRot.y;
            this.controls.camera.position.z += this.remainingRot.z;
            this.controls.camera.lookAt( this.scene.position );

            this.remainingRot.x *= 0.98;
            this.remainingRot.y *= 0.98;
            this.remainingRot.z *= 0.98;
        }
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
            size: 80,
            height: 10,
            curveSegments: 24,
            bevelEnabled: true,
            bevelThickness: 5,
            bevelSize: 8,
            bevelSegments: 5
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
        this.controls.enableDamping = false;

        function makeGameCamera()
        {
            return new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000);
        }
    }

    resetCamera()
    {
        this.camera.position.x = 0;
        this.camera.position.y = 0;
        this.camera.position.z = 750;
    }
}

