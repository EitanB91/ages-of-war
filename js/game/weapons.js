// Weapon definitions and level-up choices

var WEAPONS = {
    stick: {
        name: 'WOODEN STICK',
        type: 'melee',
        dmg: 10,
        range: 50,
        cooldown: 600,
        desc: '+10 ATK'
    },
    stones: {
        name: 'STONES',
        type: 'ranged',
        dmg: 8,
        speed: 250,
        cooldown: 800,
        desc: '+8 ATK'
    },
    club: {
        name: 'WOODEN CLUB',
        type: 'melee',
        dmg: 18,
        range: 55,
        cooldown: 700,
        desc: '+18 ATK +10 HP',
        hpBonus: 10
    },
    slingshot: {
        name: 'BASIC SLINGSHOT',
        type: 'ranged',
        dmg: 12,
        speed: 320,
        cooldown: 500,
        desc: '+12 ATK +5 HP',
        hpBonus: 5
    },
    spearMelee: {
        name: 'WOODEN SPEAR',
        type: 'melee',
        dmg: 22,
        range: 70,
        cooldown: 550,
        desc: '+22 ATK'
    },
    advSling: {
        name: 'ADV. SLINGSHOT',
        type: 'ranged',
        dmg: 18,
        speed: 380,
        cooldown: 400,
        desc: '+18 ATK +10 HP',
        hpBonus: 10
    },
    obDagger: {
        name: 'OBSIDIAN DAGGER',
        type: 'melee',
        dmg: 30,
        range: 40,
        cooldown: 400,
        desc: '+30 ATK (FAST)'
    },
    obSpear: {
        name: 'OBSIDIAN SPEAR',
        type: 'ranged',
        dmg: 28,
        speed: 350,
        cooldown: 600,
        desc: '+28 ATK +15 HP',
        hpBonus: 15
    }
};

// Level-up choices per character level transition
var LEVELUP_CHOICES = [
    { level: 1, A: 'club',       B: 'slingshot'  },  // 0 -> 1
    { level: 2, A: 'spearMelee', B: 'advSling'   },  // 1 -> 2
    { level: 3, A: 'obDagger',   B: 'obSpear'    },  // 2 -> 3
];
