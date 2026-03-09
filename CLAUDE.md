# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Ages of War** — A browser-based 8-bit style platformer. Open `index.html` directly in any browser (no build step, no server required). Uses vanilla JavaScript with regular `<script>` tags (not ES6 modules) so it works on the `file://` protocol.

## Running the Game

Just open `index.html` in a browser. No install, no build, no dev server needed.

## Architecture

### Global State Pattern
All major game objects are browser globals, initialized in `js/main.js` after the DOM loads:
- `input` — `Input` instance (keyboard state)
- `renderer` — `Renderer` instance (canvas wrapper)
- `audio` — `Audio8Bit` instance (Web Audio SFX + music)
- `player` — `Player` instance
- `spawner` — `Spawner` instance
- `hud` — `HUD` instance
- `menus` — `Menus` instance
- `enemies[]`, `projectiles[]`, `items[]` — shared arrays passed into update calls
- `gameState` — plain object with `.state` string + game progress fields

### Script Load Order (must be preserved in index.html)
```
input.js → physics.js → audio.js → renderer.js → sprites.js →
weapons.js → enemy.js → player.js → spawner.js → levels.js →
hud.js → menus.js → gameState.js → main.js
```

### Game State Machine
States: `MENU → PLAYING → SUBLEVEL_CLEAR → LEVELUP → PLAYING → ... → BOSS_INTRO → BOSS_FIGHT → WIN`

State transitions live in `js/game/gameState.js`. `js/main.js` dispatches `update(dt)` and `render()` per state via switch statements.

### Physics Constants (defined in `js/engine/physics.js`, global)
`CANVAS_W=800`, `CANVAS_H=450`, `GROUND_Y=380`, `SCALE=3`, `GRAVITY=900`, `JUMP_FORCE=-520`, `PLAYER_SPEED=180`

### Sprite Drawing
All sprites are drawn **procedurally** using canvas `fillRect` calls — no image files. Every sprite function lives in `js/sprites/sprites.js`. The helper `px(ctx, gx, gy, color, w, h)` draws a game-pixel at game-grid coordinates, where 1 game pixel = `SCALE` (3) canvas pixels. The `COLORS` palette object is also defined there.

### Adding a New Enemy Type
1. Add a draw function `drawEnemyX(ctx, x, y, type, animFrame, facing)` in `js/sprites/sprites.js`
2. Add enemy config constants to `js/game/enemy.js` in the `ENEMY_CONFIGS` object
3. Add the enemy type to a sublevel config in `js/game/spawner.js`
4. Call the new draw function from `Enemy.draw()` in `js/game/enemy.js`

### Adding a New Weapon
1. Add the weapon definition to `WEAPONS` in `js/game/weapons.js`
2. Add the choice to `LEVELUP_CHOICES` in `js/game/weapons.js`
3. Handle the weapon's projectile `type` string in `Projectile.draw()` in `js/game/enemy.js` and add a draw function in `js/sprites/sprites.js`
4. Handle the weapon key in `Player.applyWeaponChoice()` in `js/game/player.js`

### Adding a New Era (Level)
Each era adds: new background drawing in `drawBackground()` (`sprites.js`), new enemy sprite functions (`sprites.js`), new enemy configs (`enemy.js`), new sublevel configs (`spawner.js`), and a new level config object (`levels.js`).

## Key Behavioral Notes
- `input.clear()` is called at the **end** of each frame in `main.js` — `justPressed()` is only valid within the same frame it's called
- Enemy dead-state cleanup happens in `updatePlaying()` — enemies are spliced from the array when `state === 'dead'`
- Player invincibility frames (`invincibleTimer`) prevent damage after being hit; sprite flickers when invincible
- HP potions (`Item` class in `enemy.js`) drop with 20% probability on non-boss enemy death, despawn after 8 seconds
- `Audio8Bit` constructor wraps `AudioContext` creation in try/catch — all audio calls are safe to make even if Web Audio is unavailable
- Boss HP bar is shown via `hud.setBossEnemy(bossRef)` — pass `null` to hide it
