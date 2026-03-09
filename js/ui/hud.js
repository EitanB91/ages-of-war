// HUD (Heads-Up Display) drawing

class HUD {
    constructor() {
        this.bossHpVisible = false;
        this.bossEnemy = null;
    }

    draw(ctx, player, killCount, totalKills, sublevelNum) {
        killCount = killCount || 0;
        totalKills = totalKills || 20;
        sublevelNum = sublevelNum || 1;

        this._drawHPBar(ctx, player);
        this._drawLevelAndLives(ctx, player);
        this._drawKillCounter(ctx, killCount, totalKills, sublevelNum);
        this._drawWeaponInfo(ctx, player);

        // Boss HP bar if boss fight
        if (this.bossEnemy && this.bossEnemy.hp > 0) {
            this._drawBossHpBar(ctx, this.bossEnemy);
        }
    }

    _drawHPBar(ctx, player) {
        var barW = 120;
        var barH = 14;
        var bx = 8;
        var by = 8;
        var ratio = player.hp / player.maxHp;

        // Background
        ctx.fillStyle = '#1A0000';
        ctx.fillRect(bx - 1, by - 1, barW + 2, barH + 2);

        // Bar segments (pixel blocks)
        var segW = 6;
        var segGap = 1;
        var numSegs = Math.floor(barW / (segW + segGap));
        var filledSegs = Math.floor(numSegs * ratio);

        for (var i = 0; i < numSegs; i++) {
            var sx = bx + i * (segW + segGap);
            if (i < filledSegs) {
                // Filled
                ctx.fillStyle = ratio > 0.5 ? '#00CC44' : ratio > 0.25 ? '#CCAA00' : '#CC2200';
            } else {
                ctx.fillStyle = '#2A1A1A';
            }
            ctx.fillRect(sx, by, segW, barH);
        }

        // Border
        ctx.strokeStyle = '#888';
        ctx.lineWidth = 1;
        ctx.strokeRect(bx - 1, by - 1, barW + 2, barH + 2);

        // HP text
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#FFF';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('HP', bx + 2, by + 2);

        // HP numbers
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#FFF';
        ctx.textAlign = 'right';
        ctx.fillText(player.hp + '/' + player.maxHp, bx + barW - 2, by + 2);
    }

    _drawLevelAndLives(ctx, player) {
        var bx = 8;
        var by = 26;

        // Level text
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('LV.' + player.charLevel, bx, by);

        // Lives (hearts)
        by += 14;
        for (var i = 0; i < 3; i++) {
            var hx = bx + i * 16;
            if (i < player.lives) {
                this._drawHeart(ctx, hx, by, '#FF2244');
            } else {
                this._drawHeart(ctx, hx, by, '#440A14');
            }
        }
    }

    _drawHeart(ctx, x, y, color) {
        ctx.fillStyle = color;
        // Simple heart shape with rectangles
        ctx.fillRect(x + 2, y, 4, 4);
        ctx.fillRect(x + 8, y, 4, 4);
        ctx.fillRect(x, y + 2, 12, 6);
        ctx.fillRect(x + 2, y + 7, 8, 3);
        ctx.fillRect(x + 4, y + 9, 4, 2);
        ctx.fillRect(x + 5, y + 10, 2, 2);
    }

    _drawKillCounter(ctx, killCount, totalKills, sublevelNum) {
        var text = 'KILLS: ' + killCount + '/' + totalKills;
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';

        // Outline
        ctx.fillStyle = '#000';
        ctx.fillText(text, CANVAS_W - 7, 9);
        ctx.fillText(text, CANVAS_W - 9, 9);
        ctx.fillText(text, CANVAS_W - 8, 8);
        ctx.fillText(text, CANVAS_W - 8, 10);

        ctx.fillStyle = '#FFD700';
        ctx.fillText(text, CANVAS_W - 8, 9);

        // Sublevel indicator
        var slText = 'SUB-' + (sublevelNum === 'boss' ? 'BOSS' : sublevelNum);
        ctx.fillStyle = '#000';
        ctx.fillText(slText, CANVAS_W - 7, 21);
        ctx.fillStyle = '#FF8844';
        ctx.fillText(slText, CANVAS_W - 8, 20);
    }

    _drawWeaponInfo(ctx, player) {
        var bx = 8;
        var by = CANVAS_H - 36;

        ctx.font = '7px "Press Start 2P", monospace';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Melee weapon
        ctx.fillStyle = '#000';
        ctx.fillText('[A]', bx + 1, by + 1);
        ctx.fillStyle = '#FF8844';
        ctx.fillText('[A]', bx, by);

        ctx.fillStyle = '#000';
        ctx.fillText(WEAPONS[player.meleeWeapon].name, bx + 22, by + 1);
        ctx.fillStyle = '#FFCC88';
        ctx.fillText(WEAPONS[player.meleeWeapon].name, bx + 21, by);

        // Ranged weapon
        by += 14;
        ctx.fillStyle = '#000';
        ctx.fillText('[B]', bx + 1, by + 1);
        ctx.fillStyle = '#44CCFF';
        ctx.fillText('[B]', bx, by);

        ctx.fillStyle = '#000';
        ctx.fillText(WEAPONS[player.rangedWeapon].name, bx + 22, by + 1);
        ctx.fillStyle = '#88DDFF';
        ctx.fillText(WEAPONS[player.rangedWeapon].name, bx + 21, by);

        // Cooldown indicators
        this._drawCooldownDot(ctx, bx + 18, CANVAS_H - 36 + 4, player.meleeCooldownTimer, WEAPONS[player.meleeWeapon].cooldown, '#FF8844');
        this._drawCooldownDot(ctx, bx + 18, CANVAS_H - 22 + 4, player.rangedCooldownTimer, WEAPONS[player.rangedWeapon].cooldown, '#44CCFF');
    }

    _drawCooldownDot(ctx, x, y, timer, maxCooldown, color) {
        var ready = timer <= 0;
        ctx.fillStyle = ready ? color : '#333';
        ctx.fillRect(x, y, 4, 4);
        if (!ready) {
            var ratio = 1 - (timer / maxCooldown);
            ctx.fillStyle = color;
            ctx.fillRect(x, y, Math.floor(4 * ratio), 4);
        }
    }

    _drawBossHpBar(ctx, boss) {
        var barW = 400;
        var barH = 20;
        var bx = (CANVAS_W - barW) / 2;
        var by = CANVAS_H - 45;
        var ratio = boss.hp / boss.maxHp;

        // Background
        ctx.fillStyle = '#1A0000';
        ctx.fillRect(bx - 2, by - 2, barW + 4, barH + 4);

        // Bar
        ctx.fillStyle = '#CC0000';
        ctx.fillRect(bx, by, Math.floor(barW * ratio), barH);

        // Damage overlay
        ctx.fillStyle = '#440000';
        ctx.fillRect(bx + Math.floor(barW * ratio), by, Math.ceil(barW * (1 - ratio)), barH);

        // Segments
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        for (var i = 0; i < 10; i++) {
            ctx.fillRect(bx + i * (barW / 10), by, 1, barH);
        }

        // Border
        ctx.strokeStyle = '#FF4444';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx - 2, by - 2, barW + 4, barH + 4);
        ctx.lineWidth = 1;

        // Boss name
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.fillStyle = '#000';
        ctx.fillText('T-REX', CANVAS_W / 2 + 1, by - 2);
        ctx.fillStyle = '#FF4444';
        ctx.fillText('T-REX', CANVAS_W / 2, by - 3);

        // HP numbers
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = '#FFAAAA';
        ctx.textBaseline = 'middle';
        ctx.fillText(boss.hp + ' / ' + boss.maxHp, CANVAS_W / 2, by + barH / 2);
    }

    setBossEnemy(enemy) {
        this.bossEnemy = enemy;
    }
}
