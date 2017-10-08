class GameControls
{
    constructor()
    {
        this.camera = makeGameCamera();
        this.resetCamera();
        this.controls = new THREE.OrbitControls(this.camera);

        // Settings
        this.controls.maxPolarAngle = Math.PI / 2 - 0.1;
        this.controls.maxDistance = 50;
        this.controls.minDistance = 5;
        this.controls.rotateSpeed = .6; // .6

        // Optional
        // enable panning while debugging for more control
        this.controls.enablePan = true;
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = .5;
        this.controls.enableDamping = true;

        function makeGameCamera()
        {
            return new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
        }
    }

    resetCamera()
    {
        this.camera.position.x = 0;
        this.camera.position.y = 25;
        this.camera.position.z = 20;
    }
}
