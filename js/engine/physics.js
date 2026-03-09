// Physics constants and functions
var GRAVITY = 900;
var JUMP_FORCE = -520;
var MAX_FALL = 600;
var CANVAS_W = 800;
var CANVAS_H = 450;
var GROUND_Y = 380;
var SCALE = 3;
var PLAYER_SPEED = 180;
var WORLD_W = 2400;

function applyGravity(entity, dt) {
    if (!entity.onGround) {
        entity.vy += GRAVITY * dt;
        if (entity.vy > MAX_FALL) {
            entity.vy = MAX_FALL;
        }
    }
}

function applyMovement(entity, dt) {
    entity.x += entity.vx * dt;
    entity.y += entity.vy * dt;
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
    return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
    );
}

function clampToScreen(entity) {
    if (entity.x < 0) {
        entity.x = 0;
        entity.vx = 0;
    }
    if (entity.x + entity.w > WORLD_W) {
        entity.x = WORLD_W - entity.w;
        entity.vx = 0;
    }
}
