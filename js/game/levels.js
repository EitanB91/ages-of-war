// Level configuration

var STONE_AGE_LEVEL = {
    name: 'STONE AGE',
    sublevels: [
        {
            num: 1,
            name: 'NEANDERTHAL TERRITORY',
            description: 'Survive the neanderthal onslaught!',
            enemyType: 'neanderthal',
            background: 'cave',
            weaponSetIndex: 0
        },
        {
            num: 2,
            name: 'THE SAVAGE PLAINS',
            description: 'Beware the sabre-tooth beasts!',
            enemyType: 'animal',
            background: 'plains',
            weaponSetIndex: 1
        },
        {
            num: 3,
            name: 'DINOSAUR VALLEY',
            description: 'The dinosaurs rule this land!',
            enemyType: 'dino',
            background: 'jungle',
            weaponSetIndex: 2
        }
    ],
    boss: {
        name: 'T-REX',
        description: 'The mighty T-Rex approaches!',
        enemyType: 'boss',
        background: 'volcano'
    }
};

function getSublevelConfig(sublevelNum) {
    if (sublevelNum === 'boss' || sublevelNum === 4) {
        return STONE_AGE_LEVEL.boss;
    }
    for (var i = 0; i < STONE_AGE_LEVEL.sublevels.length; i++) {
        if (STONE_AGE_LEVEL.sublevels[i].num === sublevelNum) {
            return STONE_AGE_LEVEL.sublevels[i];
        }
    }
    return null;
}

function getCharAppearance(charLevel) {
    var appearances = [
        {
            level: 0,
            name: 'CAVE DWELLER',
            description: 'A primitive human with a wooden stick',
            meleeWeapon: 'stick',
            rangedWeapon: 'stones'
        },
        {
            level: 1,
            name: 'HUNTER',
            description: 'A capable hunter with leather armor',
            meleeWeapon: 'club',
            rangedWeapon: 'slingshot'
        },
        {
            level: 2,
            name: 'WARRIOR',
            description: 'A seasoned warrior with fur cloak',
            meleeWeapon: 'spearMelee',
            rangedWeapon: 'advSling'
        },
        {
            level: 3,
            name: 'WARCHIEF',
            description: 'A fearsome warchief adorned in bone',
            meleeWeapon: 'obDagger',
            rangedWeapon: 'obSpear'
        }
    ];
    return appearances[charLevel] || appearances[0];
}

function getLevelUpChoiceForLevel(newLevel) {
    for (var i = 0; i < LEVELUP_CHOICES.length; i++) {
        if (LEVELUP_CHOICES[i].level === newLevel) {
            return LEVELUP_CHOICES[i];
        }
    }
    return null;
}
