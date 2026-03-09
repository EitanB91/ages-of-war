// Canvas renderer wrapper
class Renderer {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.width = canvas.width;
        this.height = canvas.height;
    }

    clear(color) {
        color = color || '#000';
        this.ctx.fillStyle = color;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    fillRect(x, y, w, h, color) {
        this.ctx.fillStyle = color;
        this.ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h));
    }

    fillPx(x, y, size, color) {
        size = size || SCALE;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
    }

    drawText(text, x, y, size, color, align) {
        align = align || 'left';
        this.ctx.font = size + 'px "Press Start 2P", monospace';
        this.ctx.fillStyle = color;
        this.ctx.textAlign = align;
        this.ctx.textBaseline = 'top';
        this.ctx.fillText(text, Math.floor(x), Math.floor(y));
    }

    drawTextOutlined(text, x, y, size, color, outlineColor) {
        outlineColor = outlineColor || '#000';
        this.ctx.font = size + 'px "Press Start 2P", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';

        // Draw outline by drawing text in 8 directions
        this.ctx.fillStyle = outlineColor;
        var offsets = [-1, 0, 1];
        for (var ox = 0; ox < offsets.length; ox++) {
            for (var oy = 0; oy < offsets.length; oy++) {
                if (offsets[ox] !== 0 || offsets[oy] !== 0) {
                    this.ctx.fillText(text, Math.floor(x) + offsets[ox] * 2, Math.floor(y) + offsets[oy] * 2);
                }
            }
        }

        this.ctx.fillStyle = color;
        this.ctx.fillText(text, Math.floor(x), Math.floor(y));
    }

    save() {
        this.ctx.save();
    }

    restore() {
        this.ctx.restore();
    }

    flipH(x, centerX) {
        // Translate to center, scale -1 on x, translate back
        this.ctx.translate(centerX * 2, 0);
        this.ctx.scale(-1, 1);
    }

    setAlpha(alpha) {
        this.ctx.globalAlpha = alpha;
    }

    resetAlpha() {
        this.ctx.globalAlpha = 1.0;
    }
}

// Will be created in main.js after canvas is available
var renderer = null;
