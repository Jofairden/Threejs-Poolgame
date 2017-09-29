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
    static get _exceptions()
    {
        return {
            IncorrectType: new SoundException("sound requested but not the correct type")
        };
    };

    // Logs exceptions
    static get _exceptionLog()
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
    static get _throw()
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
    static get _relPath()
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
    static GetSoundPath(sound)
    {
        if (sound.constructor.name === Sound.name)
            return SoundManager._relPath + sound.name + "." + sound.format;
        else
        {
            SoundManager._exceptionLog(SoundManager._exceptions.IncorrectType);
            return undefined;
        }
    };

    // Gets a sound (if possible), returns a sound instance
    static GetSound(sound)
    {
        if (sound.constructor.name === Sound.name)
            return new Audio(SoundManager.GetSoundPath(sound));
        else
        {
            SoundManager._exceptionLog(SoundManager._exceptions.IncorrectType);
            return undefined;
        }
    };

    // Gets a sound instance and plays the sound
    static GetAndPlay(sound)
    {
        if (sound.constructor.name === Sound.name)
            return SoundManager.GetSound(sound).play();
        else
        {
            SoundManager._exceptionLog(SoundManager._exceptions.IncorrectType);
            return undefined;
        }
    };

    // Gets a sound instance and plays the sound looped
    static GetAndPlayLooped(sound)
    {
        if (sound.constructor.name === Sound.name)
        {
            let instance = SoundManager.GetSound(sound);
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
            SoundManager._exceptionLog(SoundManager._exceptions.IncorrectType);
            return undefined;
        }
    }
}
