// Menu and UI overlay drawing

class Menus {
    constructor() {
        this._menuAnimTimer = 0;
        this._flashTimer = 0;
        this._flashOn = true;
    }

    update(dt) {
        this._menuAnimTimer += dt * 1000;
        this._flashTimer += dt * 1000;
        if (this._flashTimer >= 600) {
            this._flashTimer = 0;
            this._flashOn = !this._flashOn;
        }
    }

    drawMainMenu(ctx) {
        // Animated background elements
        var t = this._menuAnimTimer;

        // Dark overlay
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Animated fire/glow at bottom
        for (var i = 0; i < 20; i++) {
            var fx = 30 + i * 38 + Math.sin(t * 0.002 + i) * 8;
            var fy = CANVAS_H - 20;
            var fh = 20 + Math.sin(t * 0.003 + i * 0.7) * 10;
            var alpha = 0.4 + Math.sin(t * 0.004 + i) * 0.2;
            ctx.fillStyle = 'rgba(255,' + Math.floor(80 + Math.sin(t * 0.003 + i) * 40) + ',0,' + alpha + ')';
            ctx.fillRect(fx - 3, fy - fh, 8, fh);
        }

        // Title background box
        ctx.fillStyle = 'rgba(20,5,0,0.85)';
        ctx.fillRect(80, 60, CANVAS_W - 160, 200);
        ctx.strokeStyle = '#8B4400';
        ctx.lineWidth = 3;
        ctx.strokeRect(80, 60, CANVAS_W - 160, 200);
        ctx.lineWidth = 1;

        // Corner decorations
        this._drawCornerDecor(ctx, 85, 65);
        this._drawCornerDecor(ctx, CANVAS_W - 115, 65);
        this._drawCornerDecor(ctx, 85, 235);
        this._drawCornerDecor(ctx, CANVAS_W - 115, 235);

        // Title "AGES OF WAR"
        this._drawOutlinedText(ctx, 'AGES OF WAR', CANVAS_W / 2, 90, 22, '#FF8C00', '#000');

        // Subtitle line
        ctx.fillStyle = '#8B4400';
        ctx.fillRect(100, 124, CANVAS_W - 200, 2);

        // "STONE AGE" subtitle
        this._drawOutlinedText(ctx, '- STONE AGE -', CANVAS_W / 2, 132, 14, '#D4AA60', '#000');

        // Decorative bones/rocks
        this._drawMenuDecor(ctx, t);

        // Blinking "PRESS ENTER" text
        if (this._flashOn) {
            this._drawOutlinedText(ctx, 'PRESS ENTER TO START', CANVAS_W / 2, 185, 9, '#FFFF44', '#000');
        }

        // Controls hint
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#888';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('ARROWS:MOVE  A:MELEE  S:RANGED  ESC:PAUSE', CANVAS_W / 2, 220);

        // Version/credit
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillStyle = '#444';
        ctx.fillText('AGES OF WAR - PHASE 1', CANVAS_W / 2, CANVAS_H - 15);
    }

    _drawCornerDecor(ctx, x, y) {
        ctx.fillStyle = '#8B4400';
        ctx.fillRect(x, y, 20, 3);
        ctx.fillRect(x, y, 3, 20);
    }

    _drawMenuDecor(ctx, t) {
        // Animated cave men silhouettes
        var walk = Math.floor(t / 200) % 2;

        ctx.fillStyle = 'rgba(60,30,0,0.7)';
        // Left cave man
        ctx.fillRect(110, 155, 8, 14);
        ctx.fillRect(108, 148, 10, 9);
        ctx.fillRect(107, 162, 4, 6 - walk);
        ctx.fillRect(112, 162, 4, 6 + walk);
        // Weapon
        ctx.fillRect(117, 150, 2, 12);
        ctx.fillRect(116, 149, 4, 3);

        // Right cave man
        ctx.fillRect(CANVAS_W - 120, 155, 8, 14);
        ctx.fillRect(CANVAS_W - 122, 148, 10, 9);
        ctx.fillRect(CANVAS_W - 121, 162, 4, 6 + walk);
        ctx.fillRect(CANVAS_W - 116, 162, 4, 6 - walk);
        // Weapon
        ctx.fillRect(CANVAS_W - 127, 150, 2, 12);
        ctx.fillRect(CANVAS_W - 128, 149, 4, 3);
    }

    _drawOutlinedText(ctx, text, x, y, size, color, outlineColor) {
        ctx.font = size + 'px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';

        // Outline
        ctx.fillStyle = outlineColor || '#000';
        var offsets = [-2, -1, 0, 1, 2];
        for (var ox = 0; ox < offsets.length; ox++) {
            for (var oy = 0; oy < offsets.length; oy++) {
                if (Math.abs(offsets[ox]) + Math.abs(offsets[oy]) <= 2 && (offsets[ox] !== 0 || offsets[oy] !== 0)) {
                    ctx.fillText(text, x + offsets[ox], y + offsets[oy]);
                }
            }
        }

        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
    }

    drawLevelUpPopup(ctx, charLevel, choiceConfig) {
        // Semi-transparent overlay
        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Main popup box
        var boxX = 60;
        var boxY = 50;
        var boxW = CANVAS_W - 120;
        var boxH = CANVAS_H - 100;

        ctx.fillStyle = '#1A0A00';
        ctx.fillRect(boxX, boxY, boxW, boxH);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(boxX, boxY, boxW, boxH);
        ctx.lineWidth = 1;

        // Inner glow border
        ctx.strokeStyle = '#8B4400';
        ctx.strokeRect(boxX + 4, boxY + 4, boxW - 8, boxH - 8);

        // "LEVEL UP!" title
        this._drawOutlinedText(ctx, 'LEVEL UP!', CANVAS_W / 2, boxY + 15, 18, '#FFD700', '#000');

        // Level indicator
        this._drawOutlinedText(ctx, 'LV.' + (charLevel - 1) + ' -> LV.' + charLevel, CANVAS_W / 2, boxY + 42, 10, '#FFCC88', '#000');

        // Divider
        ctx.fillStyle = '#8B4400';
        ctx.fillRect(boxX + 20, boxY + 60, boxW - 40, 2);

        // "CHOOSE YOUR WEAPON" text
        this._drawOutlinedText(ctx, 'CHOOSE YOUR WEAPON', CANVAS_W / 2, boxY + 70, 9, '#FF8844', '#000');

        if (!choiceConfig) return;

        var choiceA = choiceConfig.A;
        var choiceB = choiceConfig.B;

        // Choice A card
        this._drawChoiceCard(ctx, boxX + 20, boxY + 90, (boxW / 2) - 30, boxH - 110, 'A', choiceA, '#FF8844');

        // Choice B card
        this._drawChoiceCard(ctx, boxX + (boxW / 2) + 10, boxY + 90, (boxW / 2) - 30, boxH - 110, 'B', choiceB, '#44CCFF');

        // Instructions
        if (this._flashOn) {
            this._drawOutlinedText(ctx, 'PRESS A OR B TO CHOOSE', CANVAS_W / 2, boxY + boxH - 20, 8, '#FFFF44', '#000');
        }
    }

    _drawChoiceCard(ctx, x, y, w, h, key, choice, color) {
        // Card background
        ctx.fillStyle = 'rgba(30,15,0,0.9)';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        ctx.lineWidth = 1;

        // Key label
        ctx.font = '14px "Press Start 2P", monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('[' + key + ']', x + 8, y + 8);

        // Weapon icon using melee weapon type
        var iconWeapon = WEAPONS[choice.melee] || { type: 'melee', name: choice.label };
        this._drawWeaponIcon(ctx, x + w / 2, y + 50, iconWeapon, color);

        // Weapon name (same for both A and B)
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(choice.label, x + w / 2, y + 80);

        // Sublabel variant (HEAVY / SWIFT)
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = color;
        ctx.fillText(choice.sublabel, x + w / 2, y + 94);

        // Stats
        ctx.font = '6px "Press Start 2P", monospace';
        ctx.fillStyle = '#AAFFAA';
        ctx.fillText(choice.statA, x + w / 2, y + h - 36);
        ctx.fillStyle = '#FFDDAA';
        ctx.fillText(choice.statB, x + w / 2, y + h - 22);
    }

    _drawWeaponCard(ctx, x, y, w, h, key, weapon, color) {
        // Card background
        ctx.fillStyle = 'rgba(30,15,0,0.9)';
        ctx.fillRect(x, y, w, h);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, w, h);
        ctx.lineWidth = 1;

        // Key label
        ctx.font = '14px "Press Start 2P", monospace';
        ctx.fillStyle = color;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('[' + key + ']', x + 8, y + 8);

        // Weapon icon (small graphic)
        this._drawWeaponIcon(ctx, x + w / 2, y + 50, weapon, color);

        // Weapon name
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        var nameLines = this._wrapText(weapon.name, 12);
        for (var i = 0; i < nameLines.length; i++) {
            ctx.fillText(nameLines[i], x + w / 2, y + 78 + i * 12);
        }

        // Stats
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#AAFFAA';
        ctx.fillText(weapon.desc, x + w / 2, y + h - 30);

        // Type indicator
        ctx.fillStyle = weapon.type === 'melee' ? '#FF8844' : '#44CCFF';
        ctx.fillText(weapon.type.toUpperCase(), x + w / 2, y + h - 16);
    }

    _wrapText(text, maxLen) {
        if (text.length <= maxLen) return [text];
        var words = text.split(' ');
        var lines = [];
        var current = '';
        for (var i = 0; i < words.length; i++) {
            if ((current + words[i]).length > maxLen) {
                if (current) lines.push(current.trim());
                current = words[i] + ' ';
            } else {
                current += words[i] + ' ';
            }
        }
        if (current.trim()) lines.push(current.trim());
        return lines;
    }

    _drawWeaponIcon(ctx, cx, cy, weapon, color) {
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 2;

        if (weapon.type === 'melee') {
            if (weapon.name.indexOf('STICK') >= 0 || weapon.name.indexOf('CLUB') >= 0) {
                // Club/stick shape
                ctx.fillStyle = '#8B5E3C';
                ctx.fillRect(cx - 2, cy - 15, 4, 20);
                ctx.fillStyle = '#5C3D1E';
                ctx.fillRect(cx - 4, cy - 18, 8, 6);
            } else if (weapon.name.indexOf('SPEAR') >= 0) {
                // Spear
                ctx.fillStyle = '#8B5E3C';
                ctx.fillRect(cx - 1, cy - 18, 2, 22);
                ctx.fillStyle = '#888';
                ctx.beginPath();
                ctx.moveTo(cx, cy - 22);
                ctx.lineTo(cx - 4, cy - 14);
                ctx.lineTo(cx + 4, cy - 14);
                ctx.closePath();
                ctx.fill();
            } else {
                // Dagger/default
                ctx.fillStyle = '#1A1A2E';
                ctx.fillRect(cx - 2, cy - 16, 4, 18);
                ctx.fillStyle = '#4444AA';
                ctx.fillRect(cx - 1, cy - 16, 1, 14);
                ctx.fillStyle = '#8B5E3C';
                ctx.fillRect(cx - 3, cy + 2, 6, 4);
            }
        } else {
            if (weapon.name.indexOf('SLING') >= 0) {
                // Slingshot Y shape
                ctx.fillStyle = '#8B5E3C';
                ctx.fillRect(cx - 1, cy, 2, 16);
                ctx.fillRect(cx - 8, cy - 10, 8, 2);
                ctx.fillRect(cx + 1, cy - 10, 8, 2);
                ctx.fillRect(cx - 8, cy - 16, 2, 8);
                ctx.fillRect(cx + 7, cy - 16, 2, 8);
                // Stone
                ctx.fillStyle = '#888';
                ctx.fillRect(cx - 3, cy - 20, 5, 5);
            } else if (weapon.name.indexOf('SPEAR') >= 0) {
                // Thrown spear
                ctx.fillStyle = '#1A1A2E';
                ctx.save();
                ctx.translate(cx, cy);
                ctx.rotate(-Math.PI / 6);
                ctx.fillRect(-1, -15, 2, 25);
                ctx.fillStyle = '#4444AA';
                ctx.fillRect(-1, -15, 1, 15);
                ctx.restore();
            } else {
                // Stones
                ctx.fillStyle = '#888';
                ctx.fillRect(cx - 4, cy - 5, 6, 6);
                ctx.fillRect(cx + 2, cy - 8, 5, 5);
                ctx.fillRect(cx - 6, cy - 10, 4, 4);
            }
        }
        ctx.lineWidth = 1;
    }

    drawPauseScreen(ctx) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Box
        ctx.fillStyle = '#0A0A14';
        ctx.fillRect(200, 130, 400, 190);
        ctx.strokeStyle = '#8888FF';
        ctx.lineWidth = 3;
        ctx.strokeRect(200, 130, 400, 190);
        ctx.lineWidth = 1;

        this._drawOutlinedText(ctx, 'PAUSED', CANVAS_W / 2, 155, 22, '#8888FF', '#000');

        ctx.fillStyle = '#5A5A5A';
        ctx.fillRect(220, 196, 360, 2);

        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillStyle = '#CCCCCC';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('ESC / ENTER  -  RESUME', CANVAS_W / 2, 212);
        ctx.fillStyle = '#CC6644';
        ctx.fillText('M  -  MAIN MENU', CANVAS_W / 2, 235);

        if (this._flashOn) {
            ctx.fillStyle = '#8888FF';
            ctx.fillText('> GAME PAUSED <', CANVAS_W / 2, 270);
        }
    }

    drawSublevelClear(ctx, sublevel) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        var text = sublevel === 'boss' ? 'BOSS DEFEATED!' : 'SUBLEVEL ' + sublevel + ' CLEAR!';

        // Flash colors
        var flashColor = this._flashOn ? '#FFD700' : '#FF8C00';
        this._drawOutlinedText(ctx, text, CANVAS_W / 2, CANVAS_H / 2 - 30, 16, flashColor, '#000');

        this._drawOutlinedText(ctx, 'PREPARE FOR BATTLE!', CANVAS_W / 2, CANVAS_H / 2 + 20, 10, '#FFCC88', '#000');
    }

    drawBossIntro(ctx) {
        // Darken screen
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // WARNING flash
        if (this._flashOn) {
            ctx.fillStyle = 'rgba(180,0,0,0.3)';
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        }

        // Warning symbol
        this._drawOutlinedText(ctx, '! WARNING !', CANVAS_W / 2, 80, 20, '#FF0000', '#000');

        // Red horizontal lines (like danger stripes)
        ctx.fillStyle = 'rgba(180,0,0,0.4)';
        for (var i = 0; i < 5; i++) {
            ctx.fillRect(0, 140 + i * 15, CANVAS_W, 6);
        }

        // Boss name reveal
        this._drawOutlinedText(ctx, 'T-REX APPROACHES!', CANVAS_W / 2, CANVAS_H / 2 - 20, 14, '#FF4444', '#000');
        this._drawOutlinedText(ctx, 'THE KING OF DINOSAURS', CANVAS_W / 2, CANVAS_H / 2 + 20, 9, '#FFAAAA', '#000');

        if (this._flashOn) {
            this._drawOutlinedText(ctx, 'GET READY!', CANVAS_W / 2, CANVAS_H / 2 + 55, 12, '#FFD700', '#000');
        }
    }

    drawGameOver(ctx, score) {
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Animated red vignette
        if (this._flashOn) {
            ctx.fillStyle = 'rgba(120,0,0,0.2)';
            ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
        }

        // Box
        ctx.fillStyle = '#1A0000';
        ctx.fillRect(100, 80, CANVAS_W - 200, 290);
        ctx.strokeStyle = '#CC0000';
        ctx.lineWidth = 3;
        ctx.strokeRect(100, 80, CANVAS_W - 200, 290);
        ctx.lineWidth = 1;

        // GAME OVER text
        this._drawOutlinedText(ctx, 'GAME OVER', CANVAS_W / 2, 105, 24, '#CC0000', '#000');

        // Skull decoration
        this._drawSkull(ctx, CANVAS_W / 2 - 15, 155);

        // Score
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#FFCC88';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText('SCORE: ' + score, CANVAS_W / 2, 225);

        // Prompt
        if (this._flashOn) {
            this._drawOutlinedText(ctx, 'PRESS ENTER TO RETRY', CANVAS_W / 2, 290, 9, '#FFFF44', '#000');
        }

        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#666';
        ctx.fillText('YOUR TRIBE HAS FALLEN...', CANVAS_W / 2, 315);
    }

    _drawSkull(ctx, x, y) {
        ctx.fillStyle = '#D4C89A';
        ctx.fillRect(x, y, 30, 25);
        ctx.fillRect(x + 5, y + 23, 20, 10);
        ctx.fillRect(x + 5, y + 31, 5, 5);
        ctx.fillRect(x + 20, y + 31, 5, 5);
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(x + 6, y + 6, 7, 9);
        ctx.fillRect(x + 17, y + 6, 7, 9);
        ctx.fillRect(x + 12, y + 18, 6, 5);
    }

    drawWin(ctx, stats) {
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Golden glow
        ctx.fillStyle = 'rgba(255,200,0,0.1)';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Box
        ctx.fillStyle = '#0A0800';
        ctx.fillRect(60, 50, CANVAS_W - 120, 350);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.strokeRect(60, 50, CANVAS_W - 120, 350);
        ctx.lineWidth = 1;

        // Inner border
        ctx.strokeStyle = '#8B6400';
        ctx.strokeRect(65, 55, CANVAS_W - 130, 340);

        // VICTORY title
        this._drawOutlinedText(ctx, 'VICTORY!', CANVAS_W / 2, 70, 20, '#FFD700', '#000');

        // Divider
        ctx.fillStyle = '#8B6400';
        ctx.fillRect(80, 100, CANVAS_W - 160, 2);

        // Subtitle
        this._drawOutlinedText(ctx, 'STONE AGE COMPLETE!', CANVAS_W / 2, 110, 11, '#D4AA60', '#000');

        // Trophy decoration
        this._drawTrophy(ctx, CANVAS_W / 2 - 20, 140);

        // Stats
        if (stats) {
            ctx.font = '9px "Press Start 2P", monospace';
            ctx.fillStyle = '#FFCC88';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText('FINAL SCORE: ' + (stats.score || 0), CANVAS_W / 2, 240);
            ctx.fillText('TOTAL KILLS: ' + (stats.kills || 0), CANVAS_W / 2, 262);
            ctx.fillText('LIVES REMAINING: ' + (stats.lives || 0), CANVAS_W / 2, 284);
        }

        // Divider
        ctx.fillStyle = '#8B6400';
        ctx.fillRect(80, 310, CANVAS_W - 160, 2);

        // Prompt
        if (this._flashOn) {
            this._drawOutlinedText(ctx, 'PRESS ENTER TO CONTINUE', CANVAS_W / 2, 325, 9, '#FFFF44', '#000');
        }

        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#888';
        ctx.textAlign = 'center';
        ctx.fillText('YOUR LEGEND GROWS...', CANVAS_W / 2, 370);
    }

    _drawTrophy(ctx, x, y) {
        ctx.fillStyle = '#FFD700';
        // Cup body
        ctx.fillRect(x + 5, y, 30, 25);
        ctx.fillRect(x, y + 5, 10, 15);
        ctx.fillRect(x + 30, y + 5, 10, 15);
        // Stem
        ctx.fillRect(x + 15, y + 25, 10, 10);
        // Base
        ctx.fillRect(x + 8, y + 35, 24, 6);
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(x + 12, y + 5, 16, 15);
        // Stars inside
        ctx.fillStyle = '#FFF8A0';
        ctx.fillRect(x + 14, y + 8, 4, 4);
        ctx.fillRect(x + 22, y + 8, 4, 4);
        ctx.fillRect(x + 18, y + 14, 4, 4);
    }
}
