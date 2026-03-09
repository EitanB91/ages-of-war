// Global constants required by game files
global.CANVAS_W    = 800;
global.CANVAS_H    = 450;
global.GROUND_Y    = 380;
global.SCALE       = 3;
global.GRAVITY     = 900;
global.JUMP_FORCE  = -520;
global.MAX_FALL    = 600;
global.PLAYER_SPEED = 180;

// Weapon definitions (mirrors js/game/weapons.js)
global.WEAPONS = {
  stick:      { name: 'Wooden Stick',       type: 'melee',  dmg: 10, range: 50,  cooldown: 600  },
  stones:     { name: 'Stones',             type: 'ranged', dmg: 8,  speed: 5,   cooldown: 800  },
  club:       { name: 'Wooden Club',        type: 'melee',  dmg: 18, range: 55,  cooldown: 700,  hpBonus: 10 },
  slingshot:  { name: 'Basic Slingshot',    type: 'ranged', dmg: 12, speed: 7,   cooldown: 500,  hpBonus: 5  },
  spearMelee: { name: 'Wooden Spear',       type: 'melee',  dmg: 22, range: 70,  cooldown: 550  },
  advSling:   { name: 'Adv. Slingshot',     type: 'ranged', dmg: 18, speed: 9,   cooldown: 400,  hpBonus: 10 },
  obDagger:   { name: 'Obsidian Dagger',    type: 'melee',  dmg: 30, range: 40,  cooldown: 400  },
  obSpear:    { name: 'Obsidian Spear',     type: 'ranged', dmg: 28, speed: 8,   cooldown: 600,  hpBonus: 15 },
};

global.LEVELUP_CHOICES = [
  { level: 1, A: 'club',       B: 'slingshot'  },
  { level: 2, A: 'spearMelee', B: 'advSling'   },
  { level: 3, A: 'obDagger',   B: 'obSpear'    },
];

// Stub audio so game code that calls audio.sfx.X() doesn't crash in tests
global.audio = {
  sfx: {
    jump: () => {},
    meleeHit: () => {},
    rangedShoot: () => {},
    enemyDie: () => {},
    playerHurt: () => {},
    levelUp: () => {},
    potion: () => {},
    bossRoar: () => {},
  },
  startMusic: () => {},
  stopMusic: () => {},
};

// Stub canvas context
global.document = global.document || {};
