class StatsWindow
{
    constructor()
    {
        this.window = new Stats();
        this.window.showPanel(0);
        document.body.appendChild(this.window.domElement);

        // The possible window states
        this.states = {
            FPS:   new this.StatState(0, "FPS"),
            MS:    new this.StatState(1,  "MS"),
            //MB:    new this.StatState(2,  "MB")
            // 3+ custom
        };

        // render stats window
        this.renderWindow = new THREEx.RendererStats();
        this.renderWindow.domElement.style.position	= 'absolute';
        this.renderWindow.domElement.style.left	= '0px';
        this.renderWindow.domElement.style.top	= '48px';
        document.body.appendChild(this.renderWindow.domElement);

        this.shown = false;
        this.hide();
    }

    update(debug)
    {
        if (debug)
            this.show();
        else
            this.hide();
    }

    hide()
    {
        this.shown = false;
        this.window.domElement.style.visibility = 'hidden';
        this.window.domElement.style.display = 'none';
        this.renderWindow.domElement.style.visibility = 'hidden';
        this.renderWindow.domElement.style.display = 'none';
    }

    show()
    {
        this.shown = true;
        this.window.domElement.style.visibility = 'visible';
        this.window.domElement.style.display = 'inline-block';
        this.renderWindow.domElement.style.visibility = 'visible';
        this.renderWindow.domElement.style.display = 'inline-block';
    }

    // Can change the window state
    changeState(state)
    {
        if (state && state.constructor.name === this.StatState.name)
        {
            this.window.showPanel(state.value);
        }
    };

    // Information of a window state
    static get StatState()
    {
        return class
        {
            constructor(value, name)
            {
                this.value = value;
                this.name = name;
            }
        }
    }

    get StatState()
    {
        return StatsWindow.StatState;
    }
}
