// Main entry point - Ages of War: Stone Age

// Global game objects (created after DOM loads)
var canvas;
var ctx;
var player;
var spawner;
var hud;
var menus;

// Global arrays
var enemies = [];
var projectiles = [];
var items = [];

// Camera
var camera = { x: 0 };

var lastTime = 0;

window.addEventListener('load', function() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');

    // Set pixel rendering
    ctx.imageSmoothingEnabled = false;

    // Create global renderer
    renderer = new Renderer(canvas, ctx);

    // Create game objects
    player = new Player();
    spawner = new Spawner(enemies);
    hud = new HUD();
    menus = new Menus();

    // Initialize game state (don't start game yet, show menu)
    initGame();
    gameState.state = 'MENU';

    // Start game loop
    requestAnimationFrame(gameLoop);
});

function gameLoop(timestamp) {
    var dt = Math.min((timestamp - lastTime) / 1000, 0.05); // cap dt at 50ms
    if (lastTime === 0) dt = 0.016; // first frame
    lastTime = timestamp;

    update(dt);
    render();

    requestAnimationFrame(gameLoop);
}

function update(dt) {
    // Update menu animations
    menus.update(dt);

    // Global pause/resume (ESC) and quit to menu (M) — checked every frame
    if (input.justPressed('pause')) {
        if (gameState.state === 'PLAYING' || gameState.state === 'BOSS_FIGHT') {
            pauseGame();
        } else if (gameState.state === 'PAUSED') {
            resumeGame();
        }
    }
    if (input.justPressed('menu') && gameState.state === 'PAUSED') {
        quitToMenu();
    }
    // Resume with Enter too
    if (input.justPressed('enter') && gameState.state === 'PAUSED') {
        resumeGame();
    }

    switch(gameState.state) {
        case 'MENU':
            updateMenu(dt);
            break;
        case 'PLAYING':
            updatePlaying(dt);
            break;
        case 'LEVELUP':
            updateLevelUp(dt);
            break;
        case 'SUBLEVEL_CLEAR':
            updateSublevelClear(dt);
            break;
        case 'BOSS_INTRO':
            updateBossIntro(dt);
            break;
        case 'BOSS_FIGHT':
            updateBossFight(dt);
            break;
        case 'PAUSED':
            // Nothing to update while paused
            break;
        case 'GAME_OVER':
            updateGameOver(dt);
            break;
        case 'WIN':
            updateWin(dt);
            break;
    }

    input.clear(); // clear justPressed at end of frame
}

function updateMenu(dt) {
    if (input.justPressed('enter')) {
        startGame();
    }
}

function updatePlaying(dt) {
    // Update spawner
    spawner.update(dt);

    // Update player
    player.update(dt, input, enemies, projectiles, items);

    // Update enemies
    for (var i = enemies.length - 1; i >= 0; i--) {
        var e = enemies[i];
        e.update(dt, player, projectiles);

        // Remove dead enemies that have been "dead" for a frame
        if (e.state === 'dead') {
            enemies.splice(i, 1);
        }
    }

    // Update projectiles
    for (var pi = projectiles.length - 1; pi >= 0; pi--) {
        var p = projectiles[pi];
        p.update(dt);

        // Check player projectile hits on enemies
        if (p.active && p.owner === 'player') {
            for (var ei = 0; ei < enemies.length; ei++) {
                var enemy = enemies[ei];
                if (enemy.state === 'dead') continue;
                if (checkAABB(p, enemy)) {
                    p.active = false;
                    var killed = enemy.takeDamage(p.dmg);
                    if (killed) {
                        audio.sfx.enemyDie();
                        onEnemyKilled(enemy);
                    } else {
                        audio.sfx.meleeHit();
                    }
                    break;
                }
            }
        }

        if (!p.active) {
            projectiles.splice(pi, 1);
        }
    }

    // Update items
    for (var ii = items.length - 1; ii >= 0; ii--) {
        items[ii].update(dt);
        if (!items[ii].active) {
            items.splice(ii, 1);
        }
    }

    // Update camera to follow player (center player on screen)
    var targetCamX = player.x + player.w / 2 - CANVAS_W / 2;
    if (targetCamX < 0) targetCamX = 0;
    if (targetCamX > WORLD_W - CANVAS_W) targetCamX = WORLD_W - CANVAS_W;
    camera.x += (targetCamX - camera.x) * 0.12; // smooth follow

    // Check if sublevel is complete (from spawner)
    if (spawner.isSublevelComplete() && gameState.state === 'PLAYING') {
        triggerSublevelClear();
    }
}

function updateBossFight(dt) {
    // Same as playing but no new spawning
    // Update player
    player.update(dt, input, enemies, projectiles, items);

    // Update boss enemy
    for (var i = enemies.length - 1; i >= 0; i--) {
        var e = enemies[i];
        e.update(dt, player, projectiles);

        if (e.state === 'dead') {
            enemies.splice(i, 1);
        }
    }

    // Update projectiles
    for (var pi = projectiles.length - 1; pi >= 0; pi--) {
        var p = projectiles[pi];
        p.update(dt);

        if (p.active && p.owner === 'player') {
            for (var ei = 0; ei < enemies.length; ei++) {
                var enemy = enemies[ei];
                if (enemy.state === 'dead') continue;
                if (checkAABB(p, enemy)) {
                    p.active = false;
                    var killed = enemy.takeDamage(p.dmg);
                    if (killed) {
                        audio.sfx.enemyDie();
                        onEnemyKilled(enemy);
                    } else {
                        audio.sfx.meleeHit();
                    }
                    break;
                }
            }
        }

        if (!p.active) {
            projectiles.splice(pi, 1);
        }
    }

    // Update items
    for (var ii = items.length - 1; ii >= 0; ii--) {
        items[ii].update(dt);
        if (!items[ii].active) {
            items.splice(ii, 1);
        }
    }

    // Update camera during boss fight too
    var targetCamX = player.x + player.w / 2 - CANVAS_W / 2;
    if (targetCamX < 0) targetCamX = 0;
    if (targetCamX > WORLD_W - CANVAS_W) targetCamX = WORLD_W - CANVAS_W;
    camera.x += (targetCamX - camera.x) * 0.12;
}

function updateLevelUp(dt) {
    // Wait for player input A or B
    if (input.justPressed('melee')) {
        onLevelUpChoice('A');
    } else if (input.justPressed('ranged')) {
        onLevelUpChoice('B');
    }
}

function updateSublevelClear(dt) {
    gameState.sublevelClearTimer -= dt * 1000;
    if (gameState.sublevelClearTimer <= 0) {
        gameState.sublevelClearTimer = 0;
        if (gameState.pendingLevelUp) {
            gameState.pendingLevelUp = false;
            onSublevelClearDone();
        }
    }
}

function updateBossIntro(dt) {
    gameState.bossIntroTimer -= dt * 1000;
    if (gameState.bossIntroTimer <= 0) {
        gameState.bossIntroTimer = 0;
        startBossFight();
    }
}

function updateGameOver(dt) {
    if (input.justPressed('enter')) {
        // Restart game
        startGame();
    }
}

function updateWin(dt) {
    if (input.justPressed('enter')) {
        // Return to menu or restart
        gameState.state = 'MENU';
        enemies.length = 0;
        projectiles.length = 0;
        items.length = 0;
    }
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

    // Background drawn in screen-space with parallax offset
    drawBackground(ctx, Math.floor(camera.x), gameState.sublevel);

    // Determine if we should draw game objects
    var drawGame = ['PLAYING', 'LEVELUP', 'BOSS_FIGHT', 'BOSS_INTRO', 'SUBLEVEL_CLEAR', 'PAUSED'].indexOf(gameState.state) >= 0;

    if (drawGame) {
        // Apply camera transform for world-space objects
        ctx.save();
        ctx.translate(-Math.floor(camera.x), 0);

        // Draw items
        for (var ii = 0; ii < items.length; ii++) {
            items[ii].draw(ctx);
        }

        // Draw enemies
        for (var ei = 0; ei < enemies.length; ei++) {
            enemies[ei].draw(ctx);
        }

        // Draw projectiles
        for (var pi = 0; pi < projectiles.length; pi++) {
            projectiles[pi].draw(ctx);
        }

        // Draw player
        player.draw(ctx);

        ctx.restore(); // end camera transform

        // Draw HUD (screen-space)
        var killCount = gameState.sublevelKills;
        var totalForSublevel = (gameState.state === 'BOSS_FIGHT') ? 1 : 20;
        hud.draw(ctx, player, killCount, totalForSublevel, gameState.sublevel);
    }

    // Draw UI overlays based on state
    switch(gameState.state) {
        case 'MENU':
            menus.drawMainMenu(ctx);
            break;

        case 'LEVELUP':
            menus.drawLevelUpPopup(ctx, gameState.charLevel, gameState.levelUpChoice);
            break;

        case 'SUBLEVEL_CLEAR':
            menus.drawSublevelClear(ctx, gameState.sublevel);
            break;

        case 'BOSS_INTRO':
            menus.drawBossIntro(ctx);
            break;

        case 'PAUSED':
            menus.drawPauseScreen(ctx);
            break;

        case 'GAME_OVER':
            menus.drawGameOver(ctx, gameState.score);
            break;

        case 'WIN':
            menus.drawWin(ctx, {
                score: gameState.score,
                kills: gameState.totalKills,
                lives: player.lives
            });
            break;
    }
}
