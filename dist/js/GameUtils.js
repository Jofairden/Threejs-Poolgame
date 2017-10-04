class GameUtils {

    static get xAxis() {
        return new THREE.Vector3(1, 0, 0);
    }

    static get yAxis() {
        return new THREE.Vector3(0, 1, 0);
    }

    static get zAxis() {
        return new THREE.Vector3(0, 0, 1);
    }

    static toRadians(deg)
    {
        return deg * Math.PI / 180;
    }

    static toDegrees(rad)
    {
        return rad * 180 / Math.PI;
    }

    // Rotate an object around an arbitrary axis in object space
    static rotateAroundObjectAxis(object, axis, radians) {
        GameUtils.rotObjectMatrix = new THREE.Matrix4();
        GameUtils.rotObjectMatrix.makeRotationAxis(axis.normalize(), radians);

        // old code for Three.JS pre r54:
        // object.matrix.multiplySelf(rotObjectMatrix);      // post-multiply
        // new code for Three.JS r55+:
        object.matrix.multiply(GameUtils.rotObjectMatrix);

        // old code for Three.js pre r49:
        // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
        // old code for Three.js r50-r58:
        // object.rotation.setEulerFromRotationMatrix(object.matrix);
        // new code for Three.js r59+:
        object.rotation.setFromRotationMatrix(object.matrix);
    }

    // Rotate an object around an arbitrary axis in world space
    static rotateAroundWorldAxis(object, axis, radians) {
        GameUtils.rotWorldMatrix = new THREE.Matrix4();
        GameUtils.rotWorldMatrix.makeRotationAxis(axis.normalize(), radians);

        // old code for Three.JS pre r54:
        //  rotWorldMatrix.multiply(object.matrix);
        // new code for Three.JS r55+:
        GameUtils.rotWorldMatrix.multiply(object.matrix);                // pre-multiply

        object.matrix = GameUtils.rotWorldMatrix;

        // old code for Three.js pre r49:
        // object.rotation.getRotationFromMatrix(object.matrix, object.scale);
        // old code for Three.js pre r59:
        // object.rotation.setEulerFromRotationMatrix(object.matrix);
        // code for r59+:
        object.rotation.setFromRotationMatrix(object.matrix);
    }
}
