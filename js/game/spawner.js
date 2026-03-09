// Enemy spawner class

var SUBLEVEL_CONFIGS = {
    1: {
        name: 'NEANDERTHALS',
        totalToSpawn: 20,
        spawnInterval: 3000,
        types: [
            { key: 'neanderthal_MELEE', weight: 0.5 },
            { key: 'neanderthal_RANGED', weight: 0.3 },
            { key: 'neanderthal_BULK', weight: 0.2 }
        ]
    },
    2: {
        name: 'BEASTS',
        totalToSpawn: 20,
        spawnInterval: 2500,
        types: [
            { key: 'animal_MELEE_0', weight: 0.4 },
            { key: 'animal_MELEE_1', weight: 0.4 },
            { key: 'animal_BULK_2',  weight: 0.2 }
        ]
    },
    3: {
        name: 'DINOSAURS',
        totalToSpawn: 20,
        spawnInterval: 2000,
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
        this.spawnInterval = 3000;
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
        this.spawned = 0;
        this.killed = 0;
        this.spawnTimer = 1000; // first spawn after 1 second
        this.active = true;
        this.bossSpawned = sublevelNum === 'boss';

        // Clear existing enemies
        this.enemies.length = 0;
    }

    update(dt) {
        if (!this.active) return;
        if (this.spawned >= this.totalToSpawn) return;

        this.spawnTimer -= dt * 1000;
        if (this.spawnTimer <= 0) {
            this.spawnTimer = this.spawnInterval;
            this.spawnEnemy();
        }
    }

    spawnEnemy() {
        if (this.spawned >= this.totalToSpawn) return;
        if (!this.config) return;

        var typeKey = this._pickRandomType();
        var baseConfig = ENEMY_CONFIGS[typeKey];
        if (!baseConfig) return;

        // Alternate spawn sides
        this._spawnSide = 1 - this._spawnSide;
        var spawnX;
        if (this._spawnSide === 0) {
            spawnX = -60; // left edge
        } else {
            spawnX = CANVAS_W + 20; // right edge
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
        var config = Object.assign({}, ENEMY_CONFIGS['boss_trex']);
        config.x = CANVAS_W - 150;
        var boss = new Enemy(config);
        this.enemies.push(boss);
        this.bossSpawned = true;
        return boss;
    }
}
