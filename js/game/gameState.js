// Game state management

var gameState = {
    state: 'MENU',
    sublevel: 1,
    charLevel: 0,
    totalKills: 0,
    sublevelKills: 0,
    score: 0,
    levelUpChoice: null,
    sublevelClearTimer: 0,
    bossIntroTimer: 0,
    pendingLevelUp: false
};

function initGame() {
    // Reset all state
    gameState.state = 'MENU';
    gameState.sublevel = 1;
    gameState.charLevel = 0;
    gameState.totalKills = 0;
    gameState.sublevelKills = 0;
    gameState.score = 0;
    gameState.levelUpChoice = null;
    gameState.sublevelClearTimer = 0;
    gameState.bossIntroTimer = 0;
    gameState.pendingLevelUp = false;

    // Reset player
    player.x = CANVAS_W / 2 - 18;
    player.y = GROUND_Y - player.h;
    player.vx = 0;
    player.vy = 0;
    player.hp = 80;
    player.maxHp = 80;
    player.lives = 3;
    player.charLevel = 0;
    player.meleeWeapon = 'stick';
    player.rangedWeapon = 'stones';
    player.meleeCooldownTimer = 0;
    player.rangedCooldownTimer = 0;
    player.attackTimer = 0;
    player.hurtTimer = 0;
    player.invincibleTimer = 0;
    player.state = 'idle';
    player.animFrame = 0;
    player.score = 0;
    player.kills = 0;

    // Clear arrays
    enemies.length = 0;
    projectiles.length = 0;
    items.length = 0;

    // Reset camera
    camera.x = 0;

    // Reset HUD boss reference
    hud.setBossEnemy(null);

    // Start first sublevel
    spawner.startSublevel(1);
}

function startGame() {
    initGame();
    gameState.state = 'PLAYING';
    audio.startMusic('stone_age');
}

function onEnemyKilled(enemy) {
    gameState.sublevelKills++;
    gameState.totalKills++;
    gameState.score += enemy.isBoss ? 500 : (enemy.type === 'BULK' ? 100 : 50);
    spawner.onEnemyKilled();

    // Drop HP potion (20% chance, not from boss)
    if (!enemy.isBoss && Math.random() < 0.20) {
        var item = new Item(
            enemy.x + enemy.w / 2 - 9,
            enemy.y
        );
        items.push(item);
    }

    // Check if boss was killed
    if (enemy.isBoss) {
        onBossKilled();
        return;
    }

    // Check sublevel completion
    if (spawner.isSublevelComplete()) {
        triggerSublevelClear();
    }
}

function triggerSublevelClear() {
    if (gameState.state === 'SUBLEVEL_CLEAR') return;

    gameState.state = 'SUBLEVEL_CLEAR';
    gameState.sublevelClearTimer = 2500; // show for 2.5 seconds
    gameState.pendingLevelUp = true;
}

function onSublevelClearDone() {
    // Trigger level-up
    triggerLevelUp();
}

function triggerLevelUp() {
    var newLevel = gameState.charLevel + 1;
    if (newLevel > 3) {
        // All sublevels done, go to boss
        triggerBossIntro();
        return;
    }

    gameState.state = 'LEVELUP';
    gameState.charLevel = newLevel;
    player.charLevel = newLevel;
    audio.sfx.levelUp();

    var choice = getLevelUpChoiceForLevel(newLevel);
    gameState.levelUpChoice = choice;
}

function onLevelUpChoice(choiceKey) {
    if (!gameState.levelUpChoice) return;

    // choice is a full {label, melee, ranged, ...} object now
    var choiceObj = choiceKey === 'A' ? gameState.levelUpChoice.A : gameState.levelUpChoice.B;
    player.applyWeaponChoice(choiceObj);

    gameState.levelUpChoice = null;

    // Determine what comes next
    var nextSublevel = gameState.sublevel + 1;

    if (nextSublevel > 3) {
        // Done with all sublevels, go to boss
        triggerBossIntro();
    } else {
        nextSublevel_start(nextSublevel);
    }
}

function nextSublevel_start(sublevelNum) {
    gameState.sublevel = sublevelNum;
    gameState.sublevelKills = 0;
    gameState.state = 'PLAYING';

    // Clear existing enemies and projectiles
    enemies.length = 0;
    projectiles.length = 0;
    items.length = 0;

    // Reposition player and reset camera
    player.x = CANVAS_W / 2 - 18;
    player.y = GROUND_Y - player.h;
    player.vx = 0;
    player.vy = 0;
    player.hp = player.maxHp;
    player.state = 'idle';
    camera.x = 0;

    spawner.startSublevel(sublevelNum);
}

function triggerBossIntro() {
    gameState.state = 'BOSS_INTRO';
    gameState.bossIntroTimer = 4000; // 4 seconds of boss intro

    // Clear everything
    enemies.length = 0;
    projectiles.length = 0;
    items.length = 0;

    audio.stopMusic();
    audio.sfx.bossRoar();
}

function startBossFight() {
    gameState.state = 'BOSS_FIGHT';
    gameState.sublevelKills = 0;

    // Spawn the boss
    var boss = spawner.spawnBoss();
    hud.setBossEnemy(boss);

    // Reposition player
    player.x = 80;
    player.y = GROUND_Y - player.h;
    player.vx = 0;
    player.vy = 0;
    player.hp = player.maxHp;
    player.state = 'idle';

    audio.startMusic('stone_age');
}

function onBossKilled() {
    gameState.state = 'WIN';
    audio.stopMusic();
    audio.sfx.levelUp();
    hud.setBossEnemy(null);
}

function onPlayerDied() {
    gameState.state = 'GAME_OVER';
    audio.stopMusic();
}

function pauseGame() {
    if (gameState.state === 'PLAYING' || gameState.state === 'BOSS_FIGHT') {
        gameState._stateBeforePause = gameState.state;
        gameState.state = 'PAUSED';
        audio.stopMusic();
    }
}

function resumeGame() {
    if (gameState.state === 'PAUSED') {
        gameState.state = gameState._stateBeforePause || 'PLAYING';
        audio.startMusic('stone_age');
    }
}

function quitToMenu() {
    gameState.state = 'MENU';
    enemies.length = 0;
    projectiles.length = 0;
    items.length = 0;
    audio.stopMusic();
    hud.setBossEnemy(null);
}
