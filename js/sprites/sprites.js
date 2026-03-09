// All sprite drawing functions using canvas rect primitives
// Each "pixel" = SCALE (3) canvas pixels

// Color palette
var COLORS = {
    // Skin tones
    skin:        '#C8956C',
    skinDark:    '#A0724A',
    skinLight:   '#DEB887',
    skinVDark:   '#7A5230',

    // Hair
    hairBrown:   '#5C3317',
    hairBlack:   '#1A1A1A',
    hairGrey:    '#888888',

    // Clothing
    leather:     '#8B6914',
    leatherDark: '#6B4F10',
    leatherLight:'#C4922A',
    fur:         '#D4C2A0',
    furDark:     '#A89070',
    loincloth:   '#7D5A2C',

    // Weapons
    wood:        '#8B5E3C',
    woodDark:    '#5C3D1E',
    stone:       '#888888',
    stoneDark:   '#555555',
    stoneLight:  '#AAAAAA',
    obsidian:    '#1A1A2E',
    obsidianShine:'#4444AA',

    // Enemies
    neanderthal: '#9B7B5B',
    neanderthalDark:'#7A5C3C',
    animalOrange:'#D4681A',
    animalSpot:  '#6B3010',
    animalWhite: '#E8E8E0',
    dinoGreen:   '#4A7A3A',
    dinoDark:    '#2A4A1A',
    dinoGrey:    '#8A8A7A',
    bossDark:    '#2A5A1A',

    // Environment
    skyOrange:   '#FF6B35',
    skyPurple:   '#7B2D8B',
    skyPink:     '#FF4D88',
    groundBrown: '#8B6914',
    groundDark:  '#5C4510',
    rockGrey:    '#777777',
    fernGreen:   '#2D5A1A',

    // UI
    hpGreen:     '#00CC44',
    hpRed:       '#CC2200',
    hpYellow:    '#CCCC00',
    gold:        '#FFD700',
    white:       '#FFFFFF',
    black:       '#000000',
    red:         '#FF0000',
    blue:        '#0044FF',
    cyan:        '#00FFFF',

    // Potion
    potionRed:   '#FF2244',
    potionBone:  '#D4C89A'
};

var S = 3; // scale shorthand = SCALE

function px(ctx, gx, gy, color, w, h) {
    // Draw a game-pixel at game coords (gx, gy) in canvas space
    // gx, gy are offsets in game pixels from the sprite's top-left
    ctx.fillStyle = color;
    w = w || 1;
    h = h || 1;
    ctx.fillRect(Math.floor(gx * S), Math.floor(gy * S), w * S, h * S);
}

function pxAt(ctx, baseX, baseY, gx, gy, color, w, h) {
    // Draw a game-pixel at absolute canvas position baseX+gx*S, baseY+gy*S
    w = w || 1;
    h = h || 1;
    ctx.fillStyle = color;
    ctx.fillRect(Math.floor(baseX + gx * S), Math.floor(baseY + gy * S), w * S, h * S);
}

// =====================
// PLAYER SPRITES
// =====================

function drawPlayer(ctx, x, y, charLevel, animFrame, facing) {
    charLevel = charLevel || 0;
    animFrame = animFrame || 0;
    facing = facing || 'right';

    ctx.save();

    if (facing === 'left') {
        // Flip horizontally around the sprite center
        ctx.translate(x + 18, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(x + 18), 0);
    }

    var bx = x;
    var by = y;

    // Leg animation bob
    var legOff = (animFrame % 2 === 0) ? 0 : 1;

    if (charLevel === 0) {
        _drawPlayerLv0(ctx, bx, by, animFrame, legOff);
    } else if (charLevel === 1) {
        _drawPlayerLv1(ctx, bx, by, animFrame, legOff);
    } else if (charLevel === 2) {
        _drawPlayerLv2(ctx, bx, by, animFrame, legOff);
    } else {
        _drawPlayerLv3(ctx, bx, by, animFrame, legOff);
    }

    ctx.restore();
}

function _drawPlayerLv0(ctx, bx, by, animFrame, legOff) {
    // Messy hair
    pxAt(ctx, bx, by, 3, 0, COLORS.hairBrown, 6, 1);
    pxAt(ctx, bx, by, 2, 1, COLORS.hairBrown, 1, 1);
    pxAt(ctx, bx, by, 8, 1, COLORS.hairBrown, 1, 1);
    pxAt(ctx, bx, by, 4, 0, COLORS.hairBrown, 1, 1);
    pxAt(ctx, bx, by, 7, 0, COLORS.hairBlack, 1, 1);
    // Head
    pxAt(ctx, bx, by, 2, 1, COLORS.skin, 8, 5);
    pxAt(ctx, bx, by, 3, 0, COLORS.hairBrown, 6, 2);
    // Eyes
    pxAt(ctx, bx, by, 3, 3, COLORS.hairBlack, 1, 1);
    pxAt(ctx, bx, by, 7, 3, COLORS.hairBlack, 1, 1);
    // Mouth
    pxAt(ctx, bx, by, 4, 5, COLORS.skinDark, 3, 1);
    // Brow ridge
    pxAt(ctx, bx, by, 3, 2, COLORS.skinDark, 2, 1);
    pxAt(ctx, bx, by, 6, 2, COLORS.skinDark, 2, 1);

    // Torso (bare)
    pxAt(ctx, bx, by, 2, 6, COLORS.skin, 8, 5);
    pxAt(ctx, bx, by, 2, 6, COLORS.skinDark, 1, 5); // shadow left
    pxAt(ctx, bx, by, 9, 6, COLORS.skinDark, 1, 5); // shadow right

    // Loincloth
    pxAt(ctx, bx, by, 2, 11, COLORS.loincloth, 8, 3);
    pxAt(ctx, bx, by, 3, 12, COLORS.leatherDark, 6, 2);

    // Legs
    var lOff = legOff;
    pxAt(ctx, bx, by, 2, 14, COLORS.skin, 3, 4 - lOff);
    pxAt(ctx, bx, by, 7, 14, COLORS.skin, 3, 4 + lOff);
    // Feet
    pxAt(ctx, bx, by, 2, 17 - lOff, COLORS.leatherDark, 3, 1);
    pxAt(ctx, bx, by, 7, 17 + lOff, COLORS.leatherDark, 3, 1);

    // Arm holding stick
    pxAt(ctx, bx, by, 9, 7, COLORS.skin, 2, 4);
    // Stick — dark outline, 2px wide shaft, bright tip
    pxAt(ctx, bx, by, 9, 1, COLORS.woodDark, 3, 9);    // shadow/outline
    pxAt(ctx, bx, by, 10, 2, COLORS.wood, 2, 7);        // shaft
    pxAt(ctx, bx, by, 10, 1, '#D4A050', 2, 2);          // bright top

    // Left arm
    pxAt(ctx, bx, by, 1, 7, COLORS.skin, 2, 4);
}

function _drawPlayerLv1(ctx, bx, by, animFrame, legOff) {
    // Hair
    pxAt(ctx, bx, by, 3, 0, COLORS.hairBrown, 6, 2);
    // Head
    pxAt(ctx, bx, by, 2, 1, COLORS.skin, 8, 5);
    // Eyes
    pxAt(ctx, bx, by, 3, 3, COLORS.hairBlack, 1, 1);
    pxAt(ctx, bx, by, 7, 3, COLORS.hairBlack, 1, 1);
    // Leather shirt
    pxAt(ctx, bx, by, 2, 6, COLORS.leather, 8, 5);
    pxAt(ctx, bx, by, 2, 6, COLORS.leatherDark, 1, 5);
    pxAt(ctx, bx, by, 9, 6, COLORS.leatherDark, 1, 5);
    // Stitching
    pxAt(ctx, bx, by, 5, 7, COLORS.leatherLight, 2, 1);
    // Leather pants
    pxAt(ctx, bx, by, 2, 11, COLORS.leatherDark, 8, 3);

    // Legs with boots
    var lOff = legOff;
    pxAt(ctx, bx, by, 2, 14, COLORS.leatherDark, 3, 3 - lOff);
    pxAt(ctx, bx, by, 7, 14, COLORS.leatherDark, 3, 3 + lOff);
    pxAt(ctx, bx, by, 2, 16 - lOff, COLORS.stoneDark, 3, 2);
    pxAt(ctx, bx, by, 7, 16 + lOff, COLORS.stoneDark, 3, 2);

    // Club (right arm up) — big visible head + wide shaft
    pxAt(ctx, bx, by, 9, 7, COLORS.skin, 2, 4);
    pxAt(ctx, bx, by, 9, 1, COLORS.woodDark, 4, 10);    // dark outline
    pxAt(ctx, bx, by, 10, 5, COLORS.wood, 2, 5);         // shaft
    pxAt(ctx, bx, by, 9, 1, COLORS.woodDark, 5, 4);      // club head (dark)
    pxAt(ctx, bx, by, 10, 2, COLORS.wood, 3, 3);          // club head (fill)
    pxAt(ctx, bx, by, 10, 2, '#D4A050', 1, 1);            // highlight

    // Left arm
    pxAt(ctx, bx, by, 1, 7, COLORS.skin, 2, 4);
}

function _drawPlayerLv2(ctx, bx, by, animFrame, legOff) {
    // Hair
    pxAt(ctx, bx, by, 3, 0, COLORS.hairBrown, 6, 2);
    // Head
    pxAt(ctx, bx, by, 2, 1, COLORS.skin, 8, 5);
    // Eyes
    pxAt(ctx, bx, by, 3, 3, COLORS.hairBlack, 1, 1);
    pxAt(ctx, bx, by, 7, 3, COLORS.hairBlack, 1, 1);

    // White fur cloak (over leather)
    pxAt(ctx, bx, by, 1, 6, COLORS.fur, 10, 6);
    pxAt(ctx, bx, by, 2, 6, COLORS.leather, 8, 4);
    // Fur trim
    pxAt(ctx, bx, by, 1, 7, COLORS.fur, 1, 5);
    pxAt(ctx, bx, by, 10, 7, COLORS.fur, 1, 5);
    pxAt(ctx, bx, by, 2, 11, COLORS.fur, 8, 1);
    // Fur detail
    pxAt(ctx, bx, by, 2, 12, COLORS.leatherDark, 8, 2);

    // Legs
    var lOff = legOff;
    pxAt(ctx, bx, by, 2, 14, COLORS.leather, 3, 3 - lOff);
    pxAt(ctx, bx, by, 7, 14, COLORS.leather, 3, 3 + lOff);
    pxAt(ctx, bx, by, 2, 16 - lOff, COLORS.leatherDark, 4, 2);
    pxAt(ctx, bx, by, 7, 16 + lOff, COLORS.leatherDark, 4, 2);

    // Spear — wide shaft, prominent stone head
    pxAt(ctx, bx, by, 9, 0, COLORS.woodDark, 3, 12);     // dark outline
    pxAt(ctx, bx, by, 10, 4, COLORS.wood, 2, 8);          // shaft (2px)
    pxAt(ctx, bx, by, 9, 0, COLORS.stoneDark, 4, 5);      // spear head (dark)
    pxAt(ctx, bx, by, 10, 1, COLORS.stone, 2, 4);          // spear head (fill)
    pxAt(ctx, bx, by, 10, 1, COLORS.stoneLight, 1, 2);    // highlight
    pxAt(ctx, bx, by, 9, 7, COLORS.skin, 2, 4);

    // Left arm
    pxAt(ctx, bx, by, 1, 7, COLORS.skin, 2, 4);
}

function _drawPlayerLv3(ctx, bx, by, animFrame, legOff) {
    // Dinosaur skull helmet
    pxAt(ctx, bx, by, 2, 0, COLORS.fur, 8, 3);
    pxAt(ctx, bx, by, 3, 1, COLORS.white, 6, 2);
    pxAt(ctx, bx, by, 2, 2, COLORS.skinLight, 1, 1);
    pxAt(ctx, bx, by, 9, 2, COLORS.skinLight, 1, 1);
    // Eye sockets of skull
    pxAt(ctx, bx, by, 4, 1, COLORS.black, 1, 1);
    pxAt(ctx, bx, by, 7, 1, COLORS.black, 1, 1);
    // Teeth
    pxAt(ctx, bx, by, 3, 3, COLORS.white, 1, 1);
    pxAt(ctx, bx, by, 5, 3, COLORS.white, 1, 1);
    pxAt(ctx, bx, by, 7, 3, COLORS.white, 1, 1);

    // Head
    pxAt(ctx, bx, by, 2, 2, COLORS.skin, 8, 4);

    // Eyes
    pxAt(ctx, bx, by, 3, 4, COLORS.hairBlack, 1, 1);
    pxAt(ctx, bx, by, 7, 4, COLORS.hairBlack, 1, 1);

    // Leather + fur armor
    pxAt(ctx, bx, by, 1, 6, COLORS.fur, 10, 7);
    pxAt(ctx, bx, by, 2, 6, COLORS.leather, 8, 5);
    pxAt(ctx, bx, by, 1, 7, COLORS.fur, 1, 5);
    pxAt(ctx, bx, by, 10, 7, COLORS.fur, 1, 5);
    // Bone decorations
    pxAt(ctx, bx, by, 3, 7, COLORS.white, 1, 2);
    pxAt(ctx, bx, by, 5, 7, COLORS.white, 1, 2);
    pxAt(ctx, bx, by, 7, 7, COLORS.white, 1, 2);
    pxAt(ctx, bx, by, 2, 11, COLORS.fur, 8, 2);

    // Legs
    var lOff = legOff;
    pxAt(ctx, bx, by, 2, 13, COLORS.leather, 3, 4 - lOff);
    pxAt(ctx, bx, by, 7, 13, COLORS.leather, 3, 4 + lOff);
    pxAt(ctx, bx, by, 2, 16 - lOff, COLORS.leatherDark, 4, 2);
    pxAt(ctx, bx, by, 7, 16 + lOff, COLORS.leatherDark, 4, 2);

    // Obsidian weapon — wide blade, bright shine edge
    pxAt(ctx, bx, by, 8, 1, '#8888FF', 4, 10);           // glow outline
    pxAt(ctx, bx, by, 9, 2, COLORS.obsidian, 4, 9);      // wide dark blade
    pxAt(ctx, bx, by, 9, 1, COLORS.obsidian, 4, 3);      // pointed top
    pxAt(ctx, bx, by, 10, 2, COLORS.obsidianShine, 2, 7); // shine stripe
    pxAt(ctx, bx, by, 10, 1, '#AAAAFF', 2, 2);            // bright tip
    pxAt(ctx, bx, by, 9, 7, COLORS.skin, 2, 4);

    // Left arm
    pxAt(ctx, bx, by, 1, 7, COLORS.skin, 2, 4);
}

// =====================
// ENEMY: NEANDERTHAL
// =====================

function drawEnemyNeanderthal(ctx, x, y, type, animFrame, facing) {
    type = type || 'MELEE';
    animFrame = animFrame || 0;
    facing = facing || 'right';

    ctx.save();
    if (facing === 'right') {
        ctx.translate(x + 15, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(x + 15), 0);
    }

    var bx = x;
    var by = y;
    var lOff = (animFrame % 2 === 0) ? 0 : 1;

    if (type === 'BULK') {
        _drawNeanderthalBulk(ctx, bx, by, lOff);
    } else if (type === 'RANGED') {
        _drawNeanderthalRanged(ctx, bx, by, lOff);
    } else {
        _drawNeanderthalMelee(ctx, bx, by, lOff);
    }

    ctx.restore();
}

function _drawNeanderthalMelee(ctx, bx, by, lOff) {
    // Thick brow ridge
    pxAt(ctx, bx, by, 1, 0, COLORS.hairBrown, 8, 2);
    pxAt(ctx, bx, by, 1, 1, COLORS.neanderthal, 8, 1); // brow
    // Head (hunched, so lower)
    pxAt(ctx, bx, by, 1, 2, COLORS.neanderthal, 8, 5);
    // Eyes under heavy brow
    pxAt(ctx, bx, by, 2, 3, COLORS.hairBlack, 2, 1);
    pxAt(ctx, bx, by, 6, 3, COLORS.hairBlack, 2, 1);
    // Wide flat nose
    pxAt(ctx, bx, by, 4, 5, COLORS.neanderthalDark, 2, 1);
    // Mouth
    pxAt(ctx, bx, by, 3, 6, COLORS.neanderthalDark, 4, 1);

    // Hunched body
    pxAt(ctx, bx, by, 0, 7, COLORS.neanderthal, 10, 6);
    pxAt(ctx, bx, by, 1, 7, COLORS.neanderthalDark, 1, 6); // shadow
    pxAt(ctx, bx, by, 9, 7, COLORS.neanderthalDark, 1, 6);
    // Loincloth
    pxAt(ctx, bx, by, 2, 11, COLORS.loincloth, 6, 3);

    // Legs
    pxAt(ctx, bx, by, 1, 13, COLORS.neanderthal, 3, 3 - lOff);
    pxAt(ctx, bx, by, 6, 13, COLORS.neanderthal, 3, 3 + lOff);

    // Club arm
    pxAt(ctx, bx, by, 9, 8, COLORS.neanderthal, 2, 4);
    pxAt(ctx, bx, by, 10, 4, COLORS.wood, 2, 5);
    pxAt(ctx, bx, by, 9, 3, COLORS.woodDark, 4, 2);
    pxAt(ctx, bx, by, 10, 2, COLORS.woodDark, 2, 1);

    // Other arm
    pxAt(ctx, bx, by, 0, 8, COLORS.neanderthal, 2, 4);
}

function _drawNeanderthalRanged(ctx, bx, by, lOff) {
    // Slightly smaller, upright
    pxAt(ctx, bx, by, 2, 0, COLORS.hairBrown, 6, 2);
    pxAt(ctx, bx, by, 2, 1, COLORS.neanderthal, 6, 5);
    pxAt(ctx, bx, by, 3, 3, COLORS.hairBlack, 1, 1);
    pxAt(ctx, bx, by, 6, 3, COLORS.hairBlack, 1, 1);
    pxAt(ctx, bx, by, 4, 5, COLORS.neanderthalDark, 2, 1);

    // Body
    pxAt(ctx, bx, by, 2, 6, COLORS.neanderthal, 6, 5);
    pxAt(ctx, bx, by, 2, 9, COLORS.loincloth, 6, 2);

    // Legs
    pxAt(ctx, bx, by, 2, 11, COLORS.neanderthal, 2, 4 - lOff);
    pxAt(ctx, bx, by, 6, 11, COLORS.neanderthal, 2, 4 + lOff);

    // Arm raised with stone
    pxAt(ctx, bx, by, 8, 6, COLORS.neanderthal, 2, 3);
    // Stone to throw
    pxAt(ctx, bx, by, 8, 4, COLORS.stone, 2, 2);
    pxAt(ctx, bx, by, 8, 4, COLORS.stoneLight, 1, 1);

    // Other arm
    pxAt(ctx, bx, by, 1, 7, COLORS.neanderthal, 2, 3);
}

function _drawNeanderthalBulk(ctx, bx, by, lOff) {
    // Huge head
    pxAt(ctx, bx, by, 2, 0, COLORS.hairBrown, 10, 2);
    pxAt(ctx, bx, by, 1, 1, COLORS.neanderthal, 12, 7);
    pxAt(ctx, bx, by, 2, 3, COLORS.hairBlack, 2, 1); // eye
    pxAt(ctx, bx, by, 8, 3, COLORS.hairBlack, 2, 1);
    pxAt(ctx, bx, by, 4, 6, COLORS.neanderthalDark, 4, 1);
    pxAt(ctx, bx, by, 3, 7, COLORS.white, 1, 1); // tusk
    pxAt(ctx, bx, by, 9, 7, COLORS.white, 1, 1);

    // Wide body
    pxAt(ctx, bx, by, 0, 8, COLORS.neanderthal, 14, 7);
    pxAt(ctx, bx, by, 0, 8, COLORS.neanderthalDark, 1, 7);
    pxAt(ctx, bx, by, 13, 8, COLORS.neanderthalDark, 1, 7);
    pxAt(ctx, bx, by, 2, 13, COLORS.loincloth, 10, 3);

    // Thick legs
    pxAt(ctx, bx, by, 1, 15, COLORS.neanderthal, 4, 3 - lOff);
    pxAt(ctx, bx, by, 9, 15, COLORS.neanderthal, 4, 3 + lOff);

    // Two clubs
    pxAt(ctx, bx, by, 13, 9, COLORS.neanderthal, 2, 4); // right arm
    pxAt(ctx, bx, by, 14, 5, COLORS.wood, 2, 5);
    pxAt(ctx, bx, by, 13, 4, COLORS.woodDark, 4, 2);

    pxAt(ctx, bx, by, 0, 9, COLORS.neanderthal, 2, 4); // left arm
    pxAt(ctx, bx, by, -1, 5, COLORS.wood, 2, 5);
    pxAt(ctx, bx, by, -2, 4, COLORS.woodDark, 4, 2);
}

// =====================
// ENEMY: ANIMALS (Sabre-tooth variants)
// =====================

function drawEnemyAnimal(ctx, x, y, design, animFrame, facing) {
    design = design || 0;
    animFrame = animFrame || 0;
    facing = facing || 'right';

    ctx.save();
    if (facing === 'right') {
        ctx.translate(x + 21, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(x + 21), 0);
    }

    var bx = x;
    var by = y;
    var lOff = (animFrame % 2 === 0) ? 0 : 1;

    if (design === 0) {
        _drawAnimalOrange(ctx, bx, by, lOff);
    } else if (design === 1) {
        _drawAnimalSpotted(ctx, bx, by, lOff);
    } else {
        _drawAnimalWhite(ctx, bx, by, lOff);
    }

    ctx.restore();
}

function _drawAnimalOrange(ctx, bx, by, lOff) {
    var c = COLORS.animalOrange;
    var cd = '#8B3A0A';

    // Body
    pxAt(ctx, bx, by, 2, 2, c, 10, 7);
    pxAt(ctx, bx, by, 2, 2, cd, 1, 7); // shadow

    // Head
    pxAt(ctx, bx, by, 9, 1, c, 5, 6);
    pxAt(ctx, bx, by, 9, 1, COLORS.white, 1, 4); // white cheek
    // Eye
    pxAt(ctx, bx, by, 11, 2, COLORS.black, 1, 1);
    pxAt(ctx, bx, by, 12, 2, '#FFFF00', 1, 1); // pupils

    // Sabre teeth
    pxAt(ctx, bx, by, 10, 6, COLORS.white, 1, 3);
    pxAt(ctx, bx, by, 12, 6, COLORS.white, 1, 2);

    // Tail
    pxAt(ctx, bx, by, 0, 3, c, 3, 2);
    pxAt(ctx, bx, by, 0, 2, c, 2, 1);

    // Legs
    pxAt(ctx, bx, by, 3, 8, c, 2, 4 - lOff);
    pxAt(ctx, bx, by, 6, 8, c, 2, 4 + lOff);
    pxAt(ctx, bx, by, 9, 8, c, 2, 4 - lOff);
    pxAt(ctx, bx, by, 12, 8, c, 2, 4 + lOff);
    // Paws
    pxAt(ctx, bx, by, 3, 11 - lOff, cd, 3, 1);
    pxAt(ctx, bx, by, 6, 11 + lOff, cd, 3, 1);
    pxAt(ctx, bx, by, 9, 11 - lOff, cd, 3, 1);
    pxAt(ctx, bx, by, 12, 11 + lOff, cd, 3, 1);

    // Ear
    pxAt(ctx, bx, by, 13, 0, c, 2, 2);
}

function _drawAnimalSpotted(ctx, bx, by, lOff) {
    var c = '#704010';
    var spot = '#3A2008';

    pxAt(ctx, bx, by, 2, 2, c, 10, 7);
    pxAt(ctx, bx, by, 2, 2, spot, 1, 7);
    // Spots
    pxAt(ctx, bx, by, 4, 3, spot, 2, 2);
    pxAt(ctx, bx, by, 8, 4, spot, 2, 2);
    pxAt(ctx, bx, by, 6, 6, spot, 2, 1);

    // Head
    pxAt(ctx, bx, by, 9, 1, c, 5, 6);
    pxAt(ctx, bx, by, 9, 1, COLORS.white, 1, 4);
    pxAt(ctx, bx, by, 11, 2, COLORS.black, 1, 1);
    pxAt(ctx, bx, by, 12, 2, '#FFAA00', 1, 1);

    // Sabre teeth
    pxAt(ctx, bx, by, 10, 6, COLORS.white, 1, 3);
    pxAt(ctx, bx, by, 12, 6, COLORS.white, 1, 2);

    // Tail
    pxAt(ctx, bx, by, 0, 3, spot, 3, 2);

    // Legs
    pxAt(ctx, bx, by, 3, 8, c, 2, 4 - lOff);
    pxAt(ctx, bx, by, 6, 8, c, 2, 4 + lOff);
    pxAt(ctx, bx, by, 9, 8, c, 2, 4 - lOff);
    pxAt(ctx, bx, by, 12, 8, c, 2, 4 + lOff);
    pxAt(ctx, bx, by, 3, 11 - lOff, spot, 3, 1);
    pxAt(ctx, bx, by, 6, 11 + lOff, spot, 3, 1);
    pxAt(ctx, bx, by, 9, 11 - lOff, spot, 3, 1);
    pxAt(ctx, bx, by, 12, 11 + lOff, spot, 3, 1);

    pxAt(ctx, bx, by, 13, 0, c, 2, 2);
}

function _drawAnimalWhite(ctx, bx, by, lOff) {
    var c = COLORS.animalWhite;
    var cd = '#C0C0B8';

    // Larger body
    pxAt(ctx, bx, by, 1, 2, c, 13, 8);
    pxAt(ctx, bx, by, 1, 2, cd, 1, 8);
    pxAt(ctx, bx, by, 13, 2, cd, 1, 8);

    // Head - bigger
    pxAt(ctx, bx, by, 10, 0, c, 6, 7);
    pxAt(ctx, bx, by, 10, 0, COLORS.white, 1, 5);
    pxAt(ctx, bx, by, 13, 1, COLORS.black, 1, 1);
    pxAt(ctx, bx, by, 14, 1, '#FF0000', 1, 1); // red eyes

    // Large sabre teeth
    pxAt(ctx, bx, by, 11, 6, COLORS.white, 1, 4);
    pxAt(ctx, bx, by, 13, 6, COLORS.white, 1, 3);

    // Tail
    pxAt(ctx, bx, by, 0, 3, c, 2, 2);
    pxAt(ctx, bx, by, 0, 2, c, 2, 2);

    // Thick legs
    pxAt(ctx, bx, by, 2, 9, c, 3, 4 - lOff);
    pxAt(ctx, bx, by, 6, 9, c, 3, 4 + lOff);
    pxAt(ctx, bx, by, 10, 9, c, 3, 4 - lOff);
    pxAt(ctx, bx, by, 14, 9, c, 3, 4 + lOff);
    pxAt(ctx, bx, by, 2, 12 - lOff, cd, 4, 1);
    pxAt(ctx, bx, by, 6, 12 + lOff, cd, 4, 1);
    pxAt(ctx, bx, by, 10, 12 - lOff, cd, 4, 1);
    pxAt(ctx, bx, by, 14, 12 + lOff, cd, 4, 1);

    // Ear
    pxAt(ctx, bx, by, 15, 0, c, 2, 2);
}

// =====================
// ENEMY: DINOSAURS
// =====================

function drawEnemyDino(ctx, x, y, design, animFrame, facing) {
    design = design || 0;
    animFrame = animFrame || 0;
    facing = facing || 'right';

    ctx.save();
    if (facing === 'right') {
        var centerX = x + (design === 0 ? 19 : design === 1 ? 30 : 27);
        ctx.translate(centerX, 0);
        ctx.scale(-1, 1);
        ctx.translate(-centerX, 0);
    }

    var bx = x;
    var by = y;
    var lOff = (animFrame % 2 === 0) ? 0 : 1;

    if (design === 0) {
        _drawDinoRaptor(ctx, bx, by, lOff);
    } else if (design === 1) {
        _drawDinoTriceratops(ctx, bx, by, lOff);
    } else {
        _drawDinoAnkylosaur(ctx, bx, by, lOff);
    }

    ctx.restore();
}

function _drawDinoRaptor(ctx, bx, by, lOff) {
    var c = COLORS.dinoGreen;
    var cd = COLORS.dinoDark;

    // Head
    pxAt(ctx, bx, by, 7, 0, c, 6, 5);
    pxAt(ctx, bx, by, 10, 1, COLORS.black, 1, 1); // eye
    pxAt(ctx, bx, by, 10, 1, '#FFFF00', 1, 1);
    // Snout
    pxAt(ctx, bx, by, 11, 3, c, 2, 2);
    pxAt(ctx, bx, by, 11, 4, cd, 2, 1); // teeth
    pxAt(ctx, bx, by, 12, 3, COLORS.white, 1, 1);

    // Body (upright)
    pxAt(ctx, bx, by, 4, 4, c, 8, 8);
    pxAt(ctx, bx, by, 4, 4, cd, 1, 8);
    pxAt(ctx, bx, by, 11, 4, cd, 1, 8);

    // Tail
    pxAt(ctx, bx, by, 1, 5, c, 4, 4);
    pxAt(ctx, bx, by, 0, 6, c, 2, 3);

    // Small arms
    pxAt(ctx, bx, by, 11, 5, c, 2, 3);
    pxAt(ctx, bx, by, 12, 7, cd, 2, 1); // claws

    // Legs (bipedal)
    pxAt(ctx, bx, by, 5, 11, c, 3, 4 - lOff);
    pxAt(ctx, bx, by, 8, 11, c, 3, 4 + lOff);
    pxAt(ctx, bx, by, 5, 14 - lOff, cd, 4, 1);
    pxAt(ctx, bx, by, 8, 14 + lOff, cd, 4, 1);

    // Dorsal stripes
    pxAt(ctx, bx, by, 5, 4, cd, 1, 7);
    pxAt(ctx, bx, by, 8, 4, cd, 1, 7);
}

function _drawDinoTriceratops(ctx, bx, by, lOff) {
    var c = COLORS.dinoGrey;
    var cd = '#5A5A4A';

    // Body (large, quadruped)
    pxAt(ctx, bx, by, 2, 2, c, 15, 9);
    pxAt(ctx, bx, by, 2, 2, cd, 1, 9);
    pxAt(ctx, bx, by, 16, 2, cd, 1, 9);

    // Head
    pxAt(ctx, bx, by, 14, 0, c, 6, 7);
    pxAt(ctx, bx, by, 17, 2, COLORS.black, 1, 1); // eye
    pxAt(ctx, bx, by, 18, 2, '#FFFF00', 1, 1);

    // Frill
    pxAt(ctx, bx, by, 14, 0, '#AA4400', 6, 3);
    pxAt(ctx, bx, by, 15, 0, '#CC6600', 4, 2);

    // Three horns
    pxAt(ctx, bx, by, 18, -2, COLORS.skinLight, 1, 3); // nose horn
    pxAt(ctx, bx, by, 16, -1, COLORS.skinLight, 1, 2); // left eye horn
    pxAt(ctx, bx, by, 20, -1, COLORS.skinLight, 1, 2); // right eye horn

    // Snout/beak
    pxAt(ctx, bx, by, 18, 4, c, 4, 3);
    pxAt(ctx, bx, by, 20, 5, cd, 2, 1);

    // Tail
    pxAt(ctx, bx, by, 0, 3, c, 3, 5);
    pxAt(ctx, bx, by, 0, 4, cd, 1, 3);

    // Four thick legs
    pxAt(ctx, bx, by, 3, 10, c, 3, 4 - lOff);
    pxAt(ctx, bx, by, 7, 10, c, 3, 4 + lOff);
    pxAt(ctx, bx, by, 11, 10, c, 3, 4 - lOff);
    pxAt(ctx, bx, by, 15, 10, c, 3, 4 + lOff);
    pxAt(ctx, bx, by, 3, 13 - lOff, cd, 4, 1);
    pxAt(ctx, bx, by, 7, 13 + lOff, cd, 4, 1);
    pxAt(ctx, bx, by, 11, 13 - lOff, cd, 4, 1);
    pxAt(ctx, bx, by, 15, 13 + lOff, cd, 4, 1);
}

function _drawDinoAnkylosaur(ctx, bx, by, lOff) {
    var c = '#7A6030';
    var cd = '#5A4020';
    var plate = '#8A7040';

    // Low wide armored body
    pxAt(ctx, bx, by, 1, 3, c, 15, 7);
    pxAt(ctx, bx, by, 1, 3, cd, 1, 7);
    pxAt(ctx, bx, by, 15, 3, cd, 1, 7);

    // Armor plates on back
    for (var i = 0; i < 5; i++) {
        pxAt(ctx, bx, by, 2 + i * 3, 1, plate, 2, 3);
        pxAt(ctx, bx, by, 2 + i * 3, 1, COLORS.stoneLight, 1, 1);
    }

    // Head (small, rounded)
    pxAt(ctx, bx, by, 13, 4, c, 5, 5);
    pxAt(ctx, bx, by, 16, 5, COLORS.black, 1, 1);
    pxAt(ctx, bx, by, 14, 7, cd, 4, 1);

    // Tail with club
    pxAt(ctx, bx, by, 0, 4, c, 2, 5);
    pxAt(ctx, bx, by, -1, 3, cd, 3, 6); // tail club
    pxAt(ctx, bx, by, -2, 4, plate, 2, 3);

    // Short stubby legs
    pxAt(ctx, bx, by, 2, 9, c, 3, 3 - lOff);
    pxAt(ctx, bx, by, 6, 9, c, 3, 3 + lOff);
    pxAt(ctx, bx, by, 10, 9, c, 3, 3 - lOff);
    pxAt(ctx, bx, by, 14, 9, c, 3, 3 + lOff);
    pxAt(ctx, bx, by, 2, 11 - lOff, cd, 4, 1);
    pxAt(ctx, bx, by, 6, 11 + lOff, cd, 4, 1);
    pxAt(ctx, bx, by, 10, 11 - lOff, cd, 4, 1);
    pxAt(ctx, bx, by, 14, 11 + lOff, cd, 4, 1);
}

// =====================
// BOSS: T-REX
// =====================

function drawBossTRex(ctx, x, y, animFrame, facing, phase) {
    facing = facing || 'right';
    animFrame = animFrame || 0;
    phase = phase || 1;

    ctx.save();
    if (facing === 'right') {
        ctx.translate(x + 42, 0);
        ctx.scale(-1, 1);
        ctx.translate(-(x + 42), 0);
    }

    var bx = x;
    var by = y;
    var lOff = (animFrame % 2 === 0) ? 0 : 2;

    var bodyColor = phase === 2 ? '#1A4A0A' : COLORS.bossDark;
    var darkColor = '#0A2A00';
    var eyeColor = phase === 2 ? '#FF0000' : '#FFFF00';

    // Tail
    pxAt(ctx, bx, by, 0, 8, bodyColor, 5, 10);
    pxAt(ctx, bx, by, 2, 8, darkColor, 1, 10);
    pxAt(ctx, bx, by, 0, 14, bodyColor, 4, 4);

    // Massive body
    pxAt(ctx, bx, by, 4, 4, bodyColor, 16, 14);
    pxAt(ctx, bx, by, 4, 4, darkColor, 2, 14);
    pxAt(ctx, bx, by, 18, 4, darkColor, 2, 14);

    // Belly lighter
    pxAt(ctx, bx, by, 7, 8, '#3A7A2A', 9, 8);

    // Large head
    pxAt(ctx, bx, by, 14, 0, bodyColor, 14, 10);
    pxAt(ctx, bx, by, 14, 0, darkColor, 2, 10);
    pxAt(ctx, bx, by, 26, 0, darkColor, 2, 10);

    // Eyes
    pxAt(ctx, bx, by, 22, 1, eyeColor, 2, 2);
    pxAt(ctx, bx, by, 22, 1, COLORS.black, 1, 1);
    if (phase === 2) {
        // Glowing red eye effect
        ctx.fillStyle = 'rgba(255,0,0,0.4)';
        ctx.beginPath();
        ctx.arc(Math.floor(bx + 22 * S + S), Math.floor(by + 1 * S + S), S * 3, 0, Math.PI * 2);
        ctx.fill();
    }

    // Huge jaw
    pxAt(ctx, bx, by, 16, 9, bodyColor, 14, 5);
    pxAt(ctx, bx, by, 16, 10, darkColor, 14, 2); // open mouth dark

    // Teeth
    for (var t = 0; t < 5; t++) {
        pxAt(ctx, bx, by, 17 + t * 2, 8, COLORS.white, 1, 2);
        pxAt(ctx, bx, by, 17 + t * 2, 12, COLORS.white, 1, 2);
    }

    // Tiny arms
    pxAt(ctx, bx, by, 17, 6, bodyColor, 3, 4);
    pxAt(ctx, bx, by, 19, 9, darkColor, 2, 1); // claws

    // Huge legs
    pxAt(ctx, bx, by, 6, 17, bodyColor, 6, 6 - lOff);
    pxAt(ctx, bx, by, 13, 17, bodyColor, 6, 6 + lOff);
    pxAt(ctx, bx, by, 5, 22 - lOff, darkColor, 8, 2);
    pxAt(ctx, bx, by, 12, 22 + lOff, darkColor, 8, 2);

    // Claws on feet
    pxAt(ctx, bx, by, 5, 23 - lOff, COLORS.white, 2, 1);
    pxAt(ctx, bx, by, 8, 23 - lOff, COLORS.white, 2, 1);
    pxAt(ctx, bx, by, 12, 23 + lOff, COLORS.white, 2, 1);
    pxAt(ctx, bx, by, 15, 23 + lOff, COLORS.white, 2, 1);

    // Dorsal ridge
    for (var r = 0; r < 5; r++) {
        pxAt(ctx, bx, by, 5 + r * 2, 3, bodyColor, 1, 2 + (r % 2));
    }

    ctx.restore();
}

// =====================
// PROJECTILES
// =====================

function drawProjectileStone(ctx, x, y) {
    ctx.fillStyle = COLORS.stone;
    ctx.fillRect(Math.floor(x), Math.floor(y), S * 2, S * 2);
    ctx.fillStyle = COLORS.stoneLight;
    ctx.fillRect(Math.floor(x), Math.floor(y), S, S);
}

function drawProjectileSlingshot(ctx, x, y) {
    ctx.fillStyle = COLORS.stone;
    ctx.fillRect(Math.floor(x), Math.floor(y), S * 2, S * 2);
    ctx.fillStyle = COLORS.stoneLight;
    ctx.fillRect(Math.floor(x), Math.floor(y), S, S);
    // Motion lines
    ctx.fillStyle = 'rgba(180,180,180,0.5)';
    ctx.fillRect(Math.floor(x - S * 3), Math.floor(y + S / 2), S * 2, 2);
    ctx.fillRect(Math.floor(x - S * 2), Math.floor(y + S), S, 2);
}

function drawProjectileAdvSlingshot(ctx, x, y) {
    ctx.fillStyle = '#8844FF';
    ctx.fillRect(Math.floor(x), Math.floor(y), S * 2, S * 2);
    ctx.fillStyle = '#AA88FF';
    ctx.fillRect(Math.floor(x), Math.floor(y), S, S);
    // Glow
    ctx.fillStyle = 'rgba(136,68,255,0.3)';
    ctx.fillRect(Math.floor(x - S), Math.floor(y - S), S * 4, S * 4);
}

function drawProjectileObsidianSpear(ctx, x, y, angle) {
    angle = angle || 0;
    ctx.save();
    ctx.translate(Math.floor(x + S * 2), Math.floor(y + S));
    ctx.rotate(angle);
    ctx.fillStyle = COLORS.obsidian;
    ctx.fillRect(-S * 4, -S / 2, S * 8, S);
    ctx.fillStyle = COLORS.obsidianShine;
    ctx.fillRect(-S * 4, -S / 2, S * 2, S);
    ctx.fillStyle = '#8888FF';
    ctx.fillRect(-S * 4, -S / 2, S, S);
    ctx.restore();
}

// =====================
// HP POTION
// =====================

function drawHPPotion(ctx, x, y, animFrame) {
    animFrame = animFrame || 0;
    var shimmer = (Math.floor(animFrame / 10) % 2 === 0);

    // Bone flask body
    pxAt(ctx, x, y, 1, 2, COLORS.potionBone, 4, 7);
    pxAt(ctx, x, y, 0, 3, COLORS.potionBone, 1, 5);
    pxAt(ctx, x, y, 5, 3, COLORS.potionBone, 1, 5);
    // Neck
    pxAt(ctx, x, y, 2, 0, COLORS.potionBone, 2, 3);
    // Cork
    pxAt(ctx, x, y, 2, 0, COLORS.woodDark, 2, 1);

    // Red liquid inside
    pxAt(ctx, x, y, 1, 5, COLORS.potionRed, 4, 4);
    pxAt(ctx, x, y, 2, 4, COLORS.potionRed, 2, 1);

    // Shimmer effect
    if (shimmer) {
        pxAt(ctx, x, y, 2, 5, '#FF6688', 1, 1);
        pxAt(ctx, x, y, 4, 6, '#FF6688', 1, 1);
    }

    // Highlight on flask
    pxAt(ctx, x, y, 1, 2, COLORS.white, 1, 2);
}

// =====================
// BACKGROUND
// =====================

function drawBackground(ctx, scrollX, sublevel) {
    scrollX = scrollX || 0;
    sublevel = sublevel || 1;

    var W = CANVAS_W;
    var H = CANVAS_H;

    // Layer 0: Sky gradient (fixed — no parallax)
    var skyColors = ['#FF6B35', '#CC4422', '#7B2D8B', '#2D1155'];
    var segH = GROUND_Y / skyColors.length;
    for (var i = 0; i < skyColors.length; i++) {
        ctx.fillStyle = skyColors[i];
        ctx.fillRect(0, i * segH, W, segH + 1);
    }

    // Pterodactyl silhouette (slow drift, 0.1x)
    var ptX = ((550 + Math.sin(Date.now() * 0.0003) * 30 - scrollX * 0.1) % (W + 100) + W + 100) % (W + 100) - 50;
    var ptY = 60 + Math.sin(Date.now() * 0.0005) * 15;
    _drawPterodactyl(ctx, ptX, ptY);

    // Layer 1: Distant volcanoes (0.15x parallax)
    var v1Off = -(scrollX * 0.15);
    ctx.fillStyle = '#1A0A00';
    var volcX = [80, 350, 600, 850, 30, 500];
    var volcH = [130, 160, 100, 140, 110, 90];
    var volcW = [60, 70, 45, 65, 50, 40];
    for (var v = 0; v < volcX.length; v++) {
        var vx = ((volcX[v] + v1Off) % (W * 3) + W * 3) % (W * 3) - W;
        if (vx > -100 && vx < W + 100) {
            _drawVolcano(ctx, vx, GROUND_Y - volcH[v], volcW[v], volcH[v]);
            ctx.fillStyle = 'rgba(255,80,0,0.5)';
            ctx.fillRect(vx - 5, GROUND_Y - volcH[v] - 2, 10, 5);
            ctx.fillStyle = '#1A0A00';
        }
    }

    // Layer 2: Mid trees (0.35x parallax)
    ctx.fillStyle = '#0A1A05';
    var treeSpacing = 110;
    var treeOff = -(scrollX * 0.35);
    var tBase = Math.floor(-treeOff / treeSpacing) * treeSpacing + treeOff;
    for (var t = 0; t < 12; t++) {
        var tx = tBase + t * treeSpacing + 20;
        if (tx > -70 && tx < W + 70) {
            var th = 80 + (Math.abs(t) % 3) * 20;
            _drawPalmTree(ctx, tx, GROUND_Y - th, th);
        }
    }

    // Layer 3: Ferns and rocks (0.65x parallax)
    var nearOff = -(scrollX * 0.65);

    ctx.fillStyle = '#0D2A06';
    var fernSpacing = 165;
    var fBase = Math.floor(-nearOff / fernSpacing) * fernSpacing + nearOff;
    for (var f = 0; f < 10; f++) {
        var fx = fBase + f * fernSpacing + 30;
        if (fx > -80 && fx < W + 80) {
            _drawFern(ctx, fx, GROUND_Y - 40, 50);
        }
    }

    ctx.fillStyle = '#3A3028';
    var rockSpacing = 400;
    var rBase = Math.floor(-nearOff / rockSpacing) * rockSpacing + nearOff;
    for (var r = 0; r < 6; r++) {
        var rx = rBase + r * rockSpacing + 150;
        if (rx > -80 && rx < W + 80) {
            _drawRockFormation(ctx, rx, GROUND_Y - 30 + (r % 2) * 10);
        }
    }

    // Ground platform (1:1 scroll — tiles shift with camera)
    var groundColor = '#6B4F1A';
    var groundDark  = '#3A2A08';
    var groundLight = '#8B6A2A';

    ctx.fillStyle = groundColor;
    ctx.fillRect(0, GROUND_Y, W, H - GROUND_Y);

    ctx.fillStyle = groundDark;
    var tileOff = scrollX % 40;
    for (var gx = -tileOff; gx < W; gx += 40) {
        ctx.fillRect(gx, GROUND_Y, 2, H - GROUND_Y);
    }
    for (var gy = GROUND_Y; gy < H; gy += 20) {
        ctx.fillRect(0, gy, W, 2);
    }

    ctx.fillStyle = groundLight;
    ctx.fillRect(0, GROUND_Y, W, 4);

    // Grass tufts (tiled at 1:1)
    ctx.fillStyle = '#2A5A10';
    var grassOff = scrollX % 42;
    for (var gr = 0; gr < 22; gr++) {
        var gxx = gr * 42 + 5 - grassOff;
        ctx.fillRect(gxx, GROUND_Y - 5, 3, 6);
        ctx.fillRect(gxx + 5, GROUND_Y - 3, 2, 4);
        ctx.fillRect(gxx - 3, GROUND_Y - 4, 2, 5);
    }
}

function _drawVolcano(ctx, cx, top, halfW, h) {
    ctx.beginPath();
    ctx.moveTo(cx - halfW, top + h);
    ctx.lineTo(cx, top);
    ctx.lineTo(cx + halfW, top + h);
    ctx.closePath();
    ctx.fill();
    // Crater
    ctx.fillStyle = 'rgba(40,5,0,0.8)';
    ctx.beginPath();
    ctx.moveTo(cx - 8, top + 2);
    ctx.lineTo(cx, top);
    ctx.lineTo(cx + 8, top + 2);
    ctx.closePath();
    ctx.fill();
}

function _drawPalmTree(ctx, x, top, h) {
    // Trunk
    ctx.fillRect(x - 3, top, 6, h);
    // Fronds
    ctx.fillRect(x - 25, top - 10, 50, 15);
    ctx.fillRect(x - 15, top - 20, 30, 12);
    ctx.fillRect(x - 8, top - 28, 16, 10);
}

function _drawPterodactyl(ctx, x, y) {
    ctx.fillStyle = '#0A0A15';
    // Body
    ctx.fillRect(x - 5, y, 10, 8);
    // Wings
    ctx.fillRect(x - 30, y - 5, 25, 6);
    ctx.fillRect(x + 5, y - 5, 25, 6);
    // Head/beak
    ctx.fillRect(x - 12, y - 3, 8, 5);
    // Wing fold
    ctx.fillStyle = '#15152A';
    ctx.fillRect(x - 25, y - 3, 20, 3);
    ctx.fillRect(x + 5, y - 3, 20, 3);
}

function _drawFern(ctx, x, y, size) {
    // Central stem
    ctx.fillRect(x, y - size, 3, size);
    // Fronds on each side
    for (var i = 0; i < 5; i++) {
        var fy = y - size + i * (size / 5);
        var fw = (size / 2) * (1 - i / 6);
        ctx.fillRect(x - fw, fy, fw, 3);
        ctx.fillRect(x + 3, fy, fw, 3);
    }
}

function _drawRockFormation(ctx, x, y) {
    ctx.fillRect(x, y, 40, 30);
    ctx.fillRect(x + 10, y - 15, 25, 20);
    ctx.fillRect(x - 5, y + 5, 15, 20);
    ctx.fillStyle = '#5A4838';
    ctx.fillRect(x + 5, y, 5, 30);
}

function drawCaveEntrance(ctx, x, y) {
    // Dark cave mouth
    ctx.fillStyle = '#0A0A0A';
    ctx.beginPath();
    ctx.arc(x + 60, y + 80, 60, Math.PI, 0, false);
    ctx.rect(x, y + 80, 120, 60);
    ctx.fill();

    // Stone frame
    ctx.fillStyle = '#5A5050';
    ctx.fillRect(x - 5, y + 70, 15, 80);
    ctx.fillRect(x + 110, y + 70, 15, 80);
    ctx.fillRect(x, y + 65, 120, 20);

    // Stalactites
    ctx.fillStyle = '#4A4040';
    for (var i = 0; i < 5; i++) {
        var sx = x + 15 + i * 22;
        var sh = 10 + (i % 3) * 8;
        ctx.beginPath();
        ctx.moveTo(sx, y + 80);
        ctx.lineTo(sx + 5, y + 80 + sh);
        ctx.lineTo(sx + 10, y + 80);
        ctx.closePath();
        ctx.fill();
    }
}
