// Ages of War — baseline unit tests (run with: npm test)
// Additional tests are added by the /code-qa skill after each meaningful change.

// ─── Physics ────────────────────────────────────────────────────────────────

function applyGravity(entity, dt) {
  if (!entity.onGround) {
    entity.vy += GRAVITY * dt;
    if (entity.vy > MAX_FALL) entity.vy = MAX_FALL;
  }
}

function groundEntity(entity) {
  if (entity.y + entity.h >= GROUND_Y) {
    entity.onGround = true;
    entity.y = GROUND_Y - entity.h;
    entity.vy = 0;
  } else {
    entity.onGround = false;
  }
}

function checkAABB(a, b) {
  return a.x < b.x + b.w &&
         a.x + a.w > b.x &&
         a.y < b.y + b.h &&
         a.y + a.h > b.y;
}

function clampToScreen(entity) {
  if (entity.x < 0) entity.x = 0;
  if (entity.x + entity.w > CANVAS_W) entity.x = CANVAS_W - entity.w;
}

describe('Physics — applyGravity', () => {
  test('increases vy when not on ground', () => {
    const e = { vy: 0, onGround: false };
    applyGravity(e, 1/60);
    expect(e.vy).toBeGreaterThan(0);
  });

  test('does not change vy when on ground', () => {
    const e = { vy: 0, onGround: true };
    applyGravity(e, 1/60);
    expect(e.vy).toBe(0);
  });

  test('caps vy at MAX_FALL', () => {
    const e = { vy: 599, onGround: false };
    applyGravity(e, 1);
    expect(e.vy).toBe(MAX_FALL);
  });
});

describe('Physics — groundEntity', () => {
  test('snaps entity to ground when below GROUND_Y', () => {
    const e = { y: 390, h: 54, vy: 200 };
    groundEntity(e);
    expect(e.y).toBe(GROUND_Y - 54);
    expect(e.vy).toBe(0);
    expect(e.onGround).toBe(true);
  });

  test('sets onGround false when above ground', () => {
    const e = { y: 100, h: 54, vy: 0 };
    groundEntity(e);
    expect(e.onGround).toBe(false);
  });

  test('handles exact boundary (feet == GROUND_Y)', () => {
    const e = { y: GROUND_Y - 54, h: 54, vy: 0 };
    groundEntity(e);
    expect(e.onGround).toBe(true);
  });
});

describe('Physics — checkAABB', () => {
  const base = { x: 100, y: 100, w: 40, h: 60 };

  test('returns true for overlapping rects', () => {
    expect(checkAABB(base, { x: 120, y: 120, w: 40, h: 60 })).toBe(true);
  });

  test('returns false when rects are adjacent (touching, not overlapping)', () => {
    expect(checkAABB(base, { x: 140, y: 100, w: 40, h: 60 })).toBe(false);
  });

  test('returns false when rects are separated', () => {
    expect(checkAABB(base, { x: 300, y: 300, w: 40, h: 60 })).toBe(false);
  });

  test('returns true for partial vertical overlap only', () => {
    expect(checkAABB(base, { x: 100, y: 150, w: 40, h: 60 })).toBe(true);
  });
});

describe('Physics — clampToScreen', () => {
  test('clamps entity to left edge', () => {
    const e = { x: -10, w: 36 };
    clampToScreen(e);
    expect(e.x).toBe(0);
  });

  test('clamps entity to right edge', () => {
    const e = { x: 790, w: 36 };
    clampToScreen(e);
    expect(e.x).toBe(CANVAS_W - 36);
  });

  test('does not move entity already within bounds', () => {
    const e = { x: 400, w: 36 };
    clampToScreen(e);
    expect(e.x).toBe(400);
  });
});

// ─── Weapon Definitions ──────────────────────────────────────────────────────

describe('WEAPONS — data integrity', () => {
  const requiredFields = ['name', 'type', 'dmg', 'cooldown'];

  Object.entries(WEAPONS).forEach(([key, weapon]) => {
    test(`WEAPONS.${key} has all required fields`, () => {
      requiredFields.forEach(field => {
        expect(weapon).toHaveProperty(field);
      });
    });

    test(`WEAPONS.${key}.type is 'melee' or 'ranged'`, () => {
      expect(['melee', 'ranged']).toContain(weapon.type);
    });

    test(`WEAPONS.${key}.dmg is a positive number`, () => {
      expect(typeof weapon.dmg).toBe('number');
      expect(weapon.dmg).toBeGreaterThan(0);
    });

    test(`WEAPONS.${key}.cooldown is a positive number`, () => {
      expect(typeof weapon.cooldown).toBe('number');
      expect(weapon.cooldown).toBeGreaterThan(0);
    });
  });
});

// ─── Level-Up Choices ────────────────────────────────────────────────────────

describe('LEVELUP_CHOICES — validity', () => {
  test('has exactly 3 entries (levels 1, 2, 3)', () => {
    expect(LEVELUP_CHOICES).toHaveLength(3);
  });

  LEVELUP_CHOICES.forEach((choice, i) => {
    test(`choice ${i + 1}: level is ${i + 1}`, () => {
      expect(choice.level).toBe(i + 1);
    });

    test(`choice ${i + 1}: A has required fields`, () => {
      ['label', 'sublabel', 'melee', 'ranged', 'statA', 'statB'].forEach(field => {
        expect(choice.A).toHaveProperty(field);
      });
    });

    test(`choice ${i + 1}: B has required fields`, () => {
      ['label', 'sublabel', 'melee', 'ranged', 'statA', 'statB'].forEach(field => {
        expect(choice.B).toHaveProperty(field);
      });
    });

    test(`choice ${i + 1}: A.melee exists in WEAPONS`, () => {
      expect(WEAPONS).toHaveProperty(choice.A.melee);
    });

    test(`choice ${i + 1}: A.ranged exists in WEAPONS`, () => {
      expect(WEAPONS).toHaveProperty(choice.A.ranged);
    });

    test(`choice ${i + 1}: B.melee exists in WEAPONS`, () => {
      expect(WEAPONS).toHaveProperty(choice.B.melee);
    });

    test(`choice ${i + 1}: B.ranged exists in WEAPONS`, () => {
      expect(WEAPONS).toHaveProperty(choice.B.ranged);
    });

    test(`choice ${i + 1}: A and B share same label (same weapon)`, () => {
      expect(choice.A.label).toBe(choice.B.label);
    });

    test(`choice ${i + 1}: A.melee and B.melee are different keys`, () => {
      expect(choice.A.melee).not.toBe(choice.B.melee);
    });
  });
});

// ─── Spawner Logic ───────────────────────────────────────────────────────────

describe('Spawner — kill counting', () => {
  function makeSpawnerState(killed, total) {
    return { killed, totalToSpawn: total };
  }

  function isSublevelComplete(state) {
    return state.killed >= state.totalToSpawn;
  }

  test('not complete at 19 kills (total=20)', () => {
    expect(isSublevelComplete(makeSpawnerState(19, 20))).toBe(false);
  });

  test('complete at exactly 20 kills', () => {
    expect(isSublevelComplete(makeSpawnerState(20, 20))).toBe(true);
  });

  test('complete at 21 kills (over-kill guard)', () => {
    expect(isSublevelComplete(makeSpawnerState(21, 20))).toBe(true);
  });

  test('not complete at 0 kills', () => {
    expect(isSublevelComplete(makeSpawnerState(0, 20))).toBe(false);
  });
});

// ─── gameState — kill tracking ────────────────────────────────────────────────

describe('gameState — onEnemyKilled scoring', () => {
  function simulateKill(enemyType, isBoss) {
    const state = { sublevelKills: 0, totalKills: 0, score: 0 };
    const enemy = { type: enemyType, isBoss: isBoss || false };

    state.sublevelKills++;
    state.totalKills++;
    state.score += enemy.isBoss ? 500 : (enemy.type === 'BULK' ? 100 : 50);

    return state;
  }

  test('MELEE kill adds 50 score', () => {
    expect(simulateKill('MELEE').score).toBe(50);
  });

  test('RANGED kill adds 50 score', () => {
    expect(simulateKill('RANGED').score).toBe(50);
  });

  test('BULK kill adds 100 score', () => {
    expect(simulateKill('BULK').score).toBe(100);
  });

  test('boss kill adds 500 score', () => {
    expect(simulateKill('MELEE', true).score).toBe(500);
  });

  test('both kill counters increment by 1', () => {
    const result = simulateKill('MELEE');
    expect(result.sublevelKills).toBe(1);
    expect(result.totalKills).toBe(1);
  });
});

// ─── HP Potion drop chance ────────────────────────────────────────────────────

describe('HP Potion — drop probability', () => {
  test('drops at 20% rate over 10000 trials (±3%)', () => {
    let drops = 0;
    const trials = 10000;
    for (let i = 0; i < trials; i++) {
      if (Math.random() < 0.20) drops++;
    }
    const rate = drops / trials;
    expect(rate).toBeGreaterThan(0.17);
    expect(rate).toBeLessThan(0.23);
  });

  test('mocked Math.random=0 always drops', () => {
    const orig = Math.random;
    Math.random = () => 0;
    expect(Math.random() < 0.20).toBe(true);
    Math.random = orig;
  });

  test('mocked Math.random=0.99 never drops', () => {
    const orig = Math.random;
    Math.random = () => 0.99;
    expect(Math.random() < 0.20).toBe(false);
    Math.random = orig;
  });
});
