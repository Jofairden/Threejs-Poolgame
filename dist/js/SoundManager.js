// A sound object
class Sound
{
    constructor(name, format, nextSound)
    {
        this.name = name;
        this.format = format;
        this.nextSound = nextSound;
    }

}

// A sound exception, used by the sound manager
class SoundException
{
    constructor(message)
    {
        this.message = message;
    }
}

// The sound manager
class SoundManager
{
    // Possible exceptions
    get _exceptions()
    {
        return {
            IncorrectType: new SoundException("sound requested but not the correct type")
        };
    };

    // Logs exceptions
    get _exceptionLog()
    {
        return function(exc)
        {
            if (exc instanceof SoundException)
            {
                console.warn(exc.message);
            }
        };
    };

    // Throws exceptions
    get _throw()
    {
        return function(exc)
        {
            if (exc instanceof SoundException)
            {
                throw exc.message;
            }
        };
    };

    // relative path for sounds
    get _relPath()
    {
        return  "./resources/sounds/";
    };

    // Stores sounds
    static get sounds()
    {
        return {
            Mp3Loop: new Sound("gameloop", "mp3", 1),
            WavLoop: new Sound("multiloop", "mp3", 0)
        };
    };

    // Returns array of sound keys:
    // [0] = Mp3Loop
    // [1] = WavLoop
    static get soundsIndexed()
    {
        return Object.keys(SoundManager.sounds).map((val) => val);
    }

    // Gets a path to a sound
    GetSoundPath(sound)
    {
        if (sound.constructor.name === Sound.name)
            return this._relPath + sound.name + "." + sound.format;
        else
        {
            this._exceptionLog(this._exceptions.IncorrectType);
            return undefined;
        }
    };

    // Gets a sound (if possible), returns a sound instance
    GetSound(sound)
    {
        if (sound.constructor.name === Sound.name)
            return new Audio(this.GetSoundPath(sound));
        else
        {
            this._exceptionLog(this._exceptions.IncorrectType);
            return undefined;
        }
    };

    // Gets a sound instance and plays the sound
    GetAndPlay(sound)
    {
        if (sound.constructor.name === Sound.name)
            return this.GetSound(sound).play();
        else
        {
            this._exceptionLog(this._exceptions.IncorrectType);
            return undefined;
        }
    };

    // required
    static GetAndPlayLooped(sound)
    {
        Game.instance.sfxMgr.GetAndPlayLooped(sound);
    }

    // Gets a sound instance and plays the sound looped
    GetAndPlayLooped(sound)
    {
        if (sound.constructor.name === Sound.name)
        {
            let instance = this.GetSound(sound);
            instance.addEventListener('ended', function()
            {
                if ((sound.nextSound + 1))
                {
                    SoundManager.GetAndPlayLooped(SoundManager.sounds[SoundManager.soundsIndexed[sound.nextSound]]);
                }
                else
                {
                    this.currentTime = 0;
                    this.play();
                }
            }, false);
            return instance.play();
        }
        else
        {
            this._exceptionLog(this._exceptions.IncorrectType);
            return undefined;
        }
    }
}
