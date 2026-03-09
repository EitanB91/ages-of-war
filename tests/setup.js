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
  stick:              { name: 'Wooden Stick',          type: 'melee',  dmg: 10, range: 50,  cooldown: 600 },
  stones:             { name: 'Stones',                type: 'ranged', dmg: 8,  speed: 250, cooldown: 800 },
  clubHeavy:          { name: 'Wooden Club (Heavy)',   type: 'melee',  dmg: 22, range: 58,  cooldown: 750 },
  clubSwift:          { name: 'Wooden Club (Swift)',   type: 'melee',  dmg: 14, range: 52,  cooldown: 450, hpBonus: 20 },
  slingshotHeavy:     { name: 'Slingshot (Heavy)',     type: 'ranged', dmg: 15, speed: 260, cooldown: 700 },
  slingshotSwift:     { name: 'Slingshot (Swift)',     type: 'ranged', dmg: 9,  speed: 340, cooldown: 380 },
  spearHeavy:         { name: 'Wooden Spear (Heavy)',  type: 'melee',  dmg: 30, range: 75,  cooldown: 650 },
  spearSwift:         { name: 'Wooden Spear (Swift)',  type: 'melee',  dmg: 20, range: 68,  cooldown: 400, hpBonus: 20 },
  advSlingshotHeavy:  { name: 'Adv. Sling (Heavy)',   type: 'ranged', dmg: 22, speed: 270, cooldown: 600 },
  advSlingshotSwift:  { name: 'Adv. Sling (Swift)',   type: 'ranged', dmg: 14, speed: 360, cooldown: 320 },
  obsidianHeavy:      { name: 'Obsidian Blade (Brutal)',  type: 'melee',  dmg: 38, range: 60,  cooldown: 550 },
  obsidianSwift:      { name: 'Obsidian Blade (Precise)', type: 'melee',  dmg: 26, range: 55,  cooldown: 350, hpBonus: 20 },
  obsidianSpearHeavy: { name: 'Ob. Spear (Heavy)',    type: 'ranged', dmg: 32, speed: 300, cooldown: 700 },
  obsidianSpearSwift: { name: 'Ob. Spear (Swift)',    type: 'ranged', dmg: 22, speed: 400, cooldown: 400 },
};

global.LEVELUP_CHOICES = [
  { level: 1,
    A: { label: 'WOODEN CLUB', sublabel: '(HEAVY)', melee: 'clubHeavy', ranged: 'slingshotHeavy', statA: 'ATK +22 / PROJ +15', statB: 'STRONG & STEADY' },
    B: { label: 'WOODEN CLUB', sublabel: '(SWIFT)',  melee: 'clubSwift', ranged: 'slingshotSwift',  statA: 'ATK +14 / PROJ +9',  statB: '+20 MAX HP  |  FAST' }
  },
  { level: 2,
    A: { label: 'WOODEN SPEAR', sublabel: '(HEAVY)', melee: 'spearHeavy', ranged: 'advSlingshotHeavy', statA: 'ATK +30 / PROJ +22', statB: 'LONG REACH' },
    B: { label: 'WOODEN SPEAR', sublabel: '(SWIFT)',  melee: 'spearSwift', ranged: 'advSlingshotSwift',  statA: 'ATK +20 / PROJ +14', statB: '+20 MAX HP  |  FAST' }
  },
  { level: 3,
    A: { label: 'OBSIDIAN BLADE', sublabel: '(BRUTAL)',  melee: 'obsidianHeavy', ranged: 'obsidianSpearHeavy', statA: 'ATK +38 / PROJ +32', statB: 'MAXIMUM DAMAGE' },
    B: { label: 'OBSIDIAN BLADE', sublabel: '(PRECISE)', melee: 'obsidianSwift', ranged: 'obsidianSpearSwift',  statA: 'ATK +26 / PROJ +22', statB: '+20 MAX HP  |  FAST' }
  },
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
