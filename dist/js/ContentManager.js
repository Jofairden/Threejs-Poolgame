/**
 * The content manager handles all loading and integrating of 'literal' content for the game (i.e. textures)
 */

class ContentManager
{
    /**
     * The static THREE Texture loader
     * Note: THREE.ImageUtils.loadTexture is being deprecated. Use THREE.TextureLoader() instead.
     * @get ContentManager.TextureLoader
     * @returns {TextureLoader} static TextureLoader
     * @constructor
     */
    static get TextureLoader()
    {
        return new THREE.TextureLoader();
    }

    /**
     * Loads a texture using the static TextureLoader
     * Uses the /img/ directory as root
     * @param {string} path - Path to texture
     * @constructor
     */
    static LoadTexture(path)
    {
        return ContentManager.TextureLoader.load('img/' + path);
    }

    /**
     * Generates a THREE.MeshBasicMaterial for a Skybox face, automatically loading the texture with the provided path
     * @param {string} path - Path to texture, using root /img/skybox/
     * @returns {MeshBasicMaterial} Generated Skybox 'face' (mesh)
     * @constructor
     */
    static SkyboxMesh(path)
    {
        // Optimization: do not render the front side of our Skybox, it remains unseen
        return new THREE.MeshBasicMaterial( { map: ContentManager.TextureLoader.load('img/skybox/' + path + '.jpg'), side: THREE.BackSide });
    }
}
