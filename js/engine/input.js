// Input manager - tracks keyboard state
class Input {
    constructor() {
        this._down = {};
        this._pressed = {};
        this._released = {};

        this._keyMap = {
            'ArrowLeft':  'left',
            'ArrowRight': 'right',
            'ArrowUp':    'jump',
            'KeyA':       'melee',
            'KeyB':       'ranged',
            'Enter':      'enter',
            'Space':      'jump',
            'KeyZ':       'melee',
            'KeyX':       'ranged'
        };

        window.addEventListener('keydown', (e) => {
            const action = this._keyMap[e.code];
            if (action) {
                if (!this._down[action]) {
                    this._pressed[action] = true;
                }
                this._down[action] = true;
            }
            // Prevent arrow keys from scrolling page
            if (['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Space'].includes(e.code)) {
                e.preventDefault();
            }
        });

        window.addEventListener('keyup', (e) => {
            const action = this._keyMap[e.code];
            if (action) {
                this._down[action] = false;
                this._released[action] = true;
            }
        });
    }

    isDown(action) {
        return !!this._down[action];
    }

    justPressed(action) {
        return !!this._pressed[action];
    }

    justReleased(action) {
        return !!this._released[action];
    }

    clear() {
        this._pressed = {};
        this._released = {};
    }
}

const input = new Input();
