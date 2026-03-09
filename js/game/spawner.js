// Enemy spawner class

var SUBLEVEL_CONFIGS = {
    1: {
        name: 'NEANDERTHALS',
        totalToSpawn: 20,
        spawnInterval: 4500,
        maxConcurrent: 3,
        types: [
            { key: 'neanderthal_MELEE', weight: 0.5 },
            { key: 'neanderthal_RANGED', weight: 0.3 },
            { key: 'neanderthal_BULK', weight: 0.2 }
        ]
    },
    2: {
        name: 'BEASTS',
        totalToSpawn: 20,
        spawnInterval: 4000,
        maxConcurrent: 3,
        types: [
            { key: 'animal_MELEE_0', weight: 0.4 },
            { key: 'animal_MELEE_1', weight: 0.4 },
            { key: 'animal_BULK_2',  weight: 0.2 }
        ]
    },
    3: {
        name: 'DINOSAURS',
        totalToSpawn: 20,
        spawnInterval: 3500,
        maxConcurrent: 3,
        types: [
            { key: 'dino_MELEE_0', weight: 0.5 },
            { key: 'dino_BULK_1',  weight: 0.3 },
            { key: 'dino_BULK_2',  weight: 0.2 }
        ]
    },
    'boss': {
        name: 'T-REX BOSS',
        totalToSpawn: 1,
        spawnInterval: 1000,
        maxConcurrent: 1,
        types: [
            { key: 'boss_trex', weight: 1.0 }
        ]
    }
};

class Spawner {
    constructor(enemiesArray) {
        this.enemies = enemiesArray;
        this.sublevel = 1;
        this.totalToSpawn = 20;
        this.spawned = 0;
        this.killed = 0;
        this.spawnTimer = 0;
        this.spawnInterval = 4500;
        this.maxConcurrent = 3;
        this.active = false;
        this.bossSpawned = false;
        this.config = null;
        this._spawnSide = 0; // alternate sides
    }

    startSublevel(sublevelNum) {
        this.sublevel = sublevelNum;
        this.config = SUBLEVEL_CONFIGS[sublevelNum];
        if (!this.config) return;

        this.totalToSpawn = this.config.totalToSpawn;
        this.spawnInterval = this.config.spawnInterval;
        this.maxConcurrent = this.config.maxConcurrent || 3;
        this.spawned = 0;
        this.killed = 0;
        this.spawnTimer = 1500; // first spawn after 1.5 seconds
        this.active = true;
        this.bossSpawned = sublevelNum === 'boss';

        // Clear existing enemies
        this.enemies.length = 0;
    }

    update(dt) {
        if (!this.active) return;
        if (this.spawned >= this.totalToSpawn) return;

        // Don't spawn if too many enemies are already on screen
        var activeCount = this.enemies.filter(function(e) { return e.state !== 'dead'; }).length;
        if (activeCount >= this.maxConcurrent) return;

        this.spawnTimer -= dt * 1000;
        if (this.spawnTimer <= 0) {
            this.spawnTimer = this.spawnInterval;
            this.spawnEnemy();
        }
    }

    spawnEnemy() {
        if (this.spawned >= this.totalToSpawn) return;
        if (!this.config) return;

        // Check concurrent limit again
        var activeCount = this.enemies.filter(function(e) { return e.state !== 'dead'; }).length;
        if (activeCount >= this.maxConcurrent) return;

        var typeKey = this._pickRandomType();
        var baseConfig = ENEMY_CONFIGS[typeKey];
        if (!baseConfig) return;

        // Spawn just outside camera view
        var camX = (typeof camera !== 'undefined') ? camera.x : 0;
        this._spawnSide = 1 - this._spawnSide;
        var spawnX;
        if (this._spawnSide === 0) {
            spawnX = camX - 60; // left of camera view
        } else {
            spawnX = camX + CANVAS_W + 30; // right of camera view
        }

        var config = Object.assign({}, baseConfig);
        config.x = spawnX;

        var enemy = new Enemy(config);
        this.enemies.push(enemy);
        this.spawned++;
    }

    _pickRandomType() {
        var types = this.config.types;
        var r = Math.random();
        var cumulative = 0;
        for (var i = 0; i < types.length; i++) {
            cumulative += types[i].weight;
            if (r <= cumulative) {
                return types[i].key;
            }
        }
        return types[types.length - 1].key;
    }

    onEnemyKilled() {
        this.killed++;
    }

    isSublevelComplete() {
        return this.killed >= this.totalToSpawn && this.spawned >= this.totalToSpawn;
    }

    getRemainingCount() {
        return Math.max(0, this.totalToSpawn - this.killed);
    }

    spawnBoss() {
        this.enemies.length = 0;
        var camX = (typeof camera !== 'undefined') ? camera.x : 0;
        var config = Object.assign({}, ENEMY_CONFIGS['boss_trex']);
        config.x = camX + CANVAS_W - 200; // spawn on right side of screen
        var boss = new Enemy(config);
        this.enemies.push(boss);
        this.bossSpawned = true;
        return boss;
    }
}
