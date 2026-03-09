// Weapon definitions
// Starting weapons + all level-up variants

var WEAPONS = {
    // ── Starting weapons ──────────────────────────────────────────────────────
    stick: {
        name: 'WOODEN STICK', type: 'melee',
        dmg: 10, range: 50, cooldown: 600
    },
    stones: {
        name: 'STONES', type: 'ranged',
        dmg: 8, speed: 250, cooldown: 800
    },

    // ── Level 1 variants: Wooden Club ─────────────────────────────────────────
    clubHeavy: {
        name: 'WOODEN CLUB', type: 'melee',
        dmg: 22, range: 58, cooldown: 780
    },
    slingshotHeavy: {
        name: 'SLINGSHOT', type: 'ranged',
        dmg: 15, speed: 270, cooldown: 650
    },
    clubSwift: {
        name: 'WOODEN CLUB', type: 'melee',
        dmg: 14, range: 50, cooldown: 460, hpBonus: 20
    },
    slingshotSwift: {
        name: 'SLINGSHOT', type: 'ranged',
        dmg: 9, speed: 380, cooldown: 380
    },

    // ── Level 2 variants: Wooden Spear ────────────────────────────────────────
    spearHeavy: {
        name: 'WOODEN SPEAR', type: 'melee',
        dmg: 30, range: 78, cooldown: 700
    },
    advSlingshotHeavy: {
        name: 'ADV. SLINGSHOT', type: 'ranged',
        dmg: 22, speed: 320, cooldown: 560
    },
    spearSwift: {
        name: 'WOODEN SPEAR', type: 'melee',
        dmg: 20, range: 65, cooldown: 450, hpBonus: 20
    },
    advSlingshotSwift: {
        name: 'ADV. SLINGSHOT', type: 'ranged',
        dmg: 14, speed: 420, cooldown: 350
    },

    // ── Level 3 variants: Obsidian Blade ─────────────────────────────────────
    obsidianHeavy: {
        name: 'OBSIDIAN BLADE', type: 'melee',
        dmg: 38, range: 48, cooldown: 520
    },
    obsidianSpearHeavy: {
        name: 'OBSIDIAN SPEAR', type: 'ranged',
        dmg: 32, speed: 340, cooldown: 700
    },
    obsidianSwift: {
        name: 'OBSIDIAN BLADE', type: 'melee',
        dmg: 26, range: 42, cooldown: 340, hpBonus: 20
    },
    obsidianSpearSwift: {
        name: 'OBSIDIAN SPEAR', type: 'ranged',
        dmg: 22, speed: 450, cooldown: 460
    }
};

// Each level-up choice upgrades BOTH weapons simultaneously.
// A = HEAVY path (more ATK), B = SWIFT path (less ATK + 20 HP)
var LEVELUP_CHOICES = [
    {
        level: 1,
        A: {
            label: 'WOODEN CLUB',
            sublabel: '(HEAVY)',
            melee: 'clubHeavy',
            ranged: 'slingshotHeavy',
            statA: 'ATK +22 / PROJ +15',
            statB: 'STRONG & STEADY'
        },
        B: {
            label: 'WOODEN CLUB',
            sublabel: '(SWIFT)',
            melee: 'clubSwift',
            ranged: 'slingshotSwift',
            statA: 'ATK +14 / PROJ +9',
            statB: '+20 MAX HP  |  FAST'
        }
    },
    {
        level: 2,
        A: {
            label: 'WOODEN SPEAR',
            sublabel: '(HEAVY)',
            melee: 'spearHeavy',
            ranged: 'advSlingshotHeavy',
            statA: 'ATK +30 / PROJ +22',
            statB: 'LONG REACH'
        },
        B: {
            label: 'WOODEN SPEAR',
            sublabel: '(SWIFT)',
            melee: 'spearSwift',
            ranged: 'advSlingshotSwift',
            statA: 'ATK +20 / PROJ +14',
            statB: '+20 MAX HP  |  FAST'
        }
    },
    {
        level: 3,
        A: {
            label: 'OBSIDIAN BLADE',
            sublabel: '(BRUTAL)',
            melee: 'obsidianHeavy',
            ranged: 'obsidianSpearHeavy',
            statA: 'ATK +38 / PROJ +32',
            statB: 'MAXIMUM DAMAGE'
        },
        B: {
            label: 'OBSIDIAN BLADE',
            sublabel: '(PRECISE)',
            melee: 'obsidianSwift',
            ranged: 'obsidianSpearSwift',
            statA: 'ATK +26 / PROJ +22',
            statB: '+20 MAX HP  |  FAST'
        }
    }
];

// Returns the choice config for a given level (1, 2, 3)
function getLevelUpChoiceForLevel(level) {
    for (var i = 0; i < LEVELUP_CHOICES.length; i++) {
        if (LEVELUP_CHOICES[i].level === level) return LEVELUP_CHOICES[i];
    }
    return null;
}
