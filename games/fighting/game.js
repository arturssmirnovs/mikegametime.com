// ==================== GAME STATE ====================
const state = {
    username: 'Player',
    coins: 500,
    kills: 0,
    players: [
        { slot: 0, name: 'You', type: 'player', avatar: '🧑' }
    ],
    friends: ['CoolKid99', 'GameMaster', 'NinjaFighter'],
    gameMode: 'freeforall',
    ownedItems: ['fist'],
    equippedWeapon: 'fist',
    equippedSkin: 'default',
    currentSlot: -1,
};

// ==================== SHOP DATA ====================
const shopData = {
    weapons: [
        { id: 'fist', name: 'Fist', icon: '👊', price: 0, damage: 10, range: 30 },
        { id: 'sword', name: 'Sword', icon: '⚔️', price: 100, damage: 25, range: 50 },
        { id: 'axe', name: 'Battle Axe', icon: '🪓', price: 150, damage: 30, range: 45 },
        { id: 'bow', name: 'Bow', icon: '🏹', price: 200, damage: 20, range: 120 },
        { id: 'wand', name: 'Magic Wand', icon: '🪄', price: 250, damage: 35, range: 80 },
        { id: 'trident', name: 'Trident', icon: '🔱', price: 300, damage: 40, range: 55 },
    ],
    items: [
        { id: 'banana', name: 'Banana', icon: '🍌', price: 30, effect: 'Slip trap! Enemies slip on it' },
        { id: 'potion', name: 'Health Potion', icon: '🧪', price: 50, effect: 'Heal 30 HP' },
        { id: 'shield', name: 'Shield', icon: '🛡️', price: 80, effect: 'Block next attack' },
        { id: 'bomb', name: 'Bomb', icon: '💣', price: 120, effect: 'Boom! Area damage' },
        { id: 'apple', name: 'Golden Apple', icon: '🍎', price: 60, effect: 'Heal 50 HP' },
        { id: 'star', name: 'Power Star', icon: '⭐', price: 200, effect: '5s invincibility' },
    ],
    skins: [
        { id: 'default', name: 'Default', icon: '🧑', price: 0 },
        { id: 'ninja', name: 'Ninja', icon: '🥷', price: 150 },
        { id: 'knight', name: 'Knight', icon: '🤺', price: 200 },
        { id: 'robot', name: 'Robot', icon: '🤖', price: 250 },
        { id: 'alien', name: 'Alien', icon: '👽', price: 300 },
        { id: 'zombie', name: 'Zombie', icon: '🧟', price: 180 },
    ],
};

// Bot names for fun
const botNames = ['RoboFighter', 'BattleBot', 'CrushMaster', 'TurboKick', 'IronPunch', 'StormBlade'];
const botAvatars = ['🤖', '👾', '🎃', '👹', '🦾', '🦿'];

// ==================== SCREEN MANAGEMENT ====================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    if (screenId === 'shop-screen') {
        updateShopCoins();
        showShopTab('weapons');
    }
    if (screenId === 'start-screen') {
        updateCoinsDisplay();
        updatePlayerSlots();
    }
}

// ==================== SIGN IN ====================
document.getElementById('sign-in-btn').addEventListener('click', () => {
    document.getElementById('signin-popup').classList.remove('hidden');
    document.getElementById('username-input').focus();
});

function signIn() {
    const name = document.getElementById('username-input').value.trim();
    if (name) {
        state.username = name;
        state.players[0].name = name;
        document.getElementById('sign-in-btn').textContent = '👤 ' + name;
        updatePlayerSlots();
    }
    closePopup('signin-popup');
}

document.getElementById('username-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') signIn();
});

// ==================== POPUPS ====================
function closePopup(id) {
    document.getElementById(id).classList.add('hidden');
}

// ==================== COINS ====================
function updateCoinsDisplay() {
    document.getElementById('coins-amount').textContent = state.coins;
}

function updateShopCoins() {
    document.getElementById('shop-coins').textContent = state.coins;
}

// ==================== PLAYER SLOTS ====================
function updatePlayerSlots() {
    for (let i = 0; i < 5; i++) {
        const slot = document.getElementById('slot-' + i);
        const player = state.players.find(p => p.slot === i);
        if (player) {
            slot.className = 'player-slot filled';
            slot.querySelector('.slot-avatar').textContent = player.avatar;
            slot.querySelector('.slot-name').textContent = player.name;
            slot.onclick = i === 0 ? null : () => removePlayer(i);
        } else {
            slot.className = 'player-slot empty';
            slot.querySelector('.slot-avatar').textContent = '➕';
            slot.querySelector('.slot-name').textContent = 'Add';
            slot.onclick = () => addPlayer(i);
        }
    }
}

function addPlayer(slotIndex) {
    state.currentSlot = slotIndex;
    document.getElementById('add-player-popup').classList.remove('hidden');
}

function addFriend() {
    closePopup('add-player-popup');
    const friendName = state.friends[Math.floor(Math.random() * state.friends.length)];
    state.players.push({
        slot: state.currentSlot,
        name: friendName,
        type: 'friend',
        avatar: '🧑'
    });
    updatePlayerSlots();
}

function addBot() {
    closePopup('add-player-popup');
    const idx = Math.floor(Math.random() * botNames.length);
    state.players.push({
        slot: state.currentSlot,
        name: botNames[idx],
        type: 'bot',
        avatar: botAvatars[idx]
    });
    updatePlayerSlots();
}

function removePlayer(slotIndex) {
    state.players = state.players.filter(p => p.slot !== slotIndex);
    updatePlayerSlots();
}

// ==================== FRIENDS ====================
function inviteFriend(name) {
    // Find empty slot
    for (let i = 1; i < 5; i++) {
        if (!state.players.find(p => p.slot === i)) {
            state.players.push({ slot: i, name: name, type: 'friend', avatar: '🧑' });
            showScreen('start-screen');
            return;
        }
    }
    alert('All slots are full!');
}

function addNewFriend() {
    const input = document.getElementById('friend-name-input');
    const name = input.value.trim();
    if (name && !state.friends.includes(name)) {
        state.friends.push(name);
        const list = document.getElementById('friends-list');
        const div = document.createElement('div');
        div.className = 'friend-item';
        div.innerHTML = `<span>🧑 ${name}</span><button class="btn btn-small btn-green" onclick="inviteFriend('${name}')">Invite</button>`;
        list.appendChild(div);
        input.value = '';
    }
}

// ==================== GAME MODE ====================
function selectMode(mode) {
    state.gameMode = mode;
    startGame();
}

// ==================== FIND GAME ====================
function findGame() {
    showScreen('find-game-screen');
    const status = document.getElementById('find-status');
    const list = document.getElementById('game-list');
    list.innerHTML = '';
    status.textContent = 'Searching for games...';

    setTimeout(() => {
        status.textContent = 'Games found!';
        const games = [
            { host: 'xXSlayerXx', players: 3, mode: 'Free For All' },
            { host: 'ProGamer2025', players: 2, mode: 'Team Battle' },
            { host: 'BossKiller99', players: 4, mode: 'Boss Fight' },
        ];
        games.forEach(g => {
            const div = document.createElement('div');
            div.className = 'game-item';
            div.innerHTML = `
                <div>
                    <strong>${g.host}'s Game</strong><br>
                    <small>${g.mode} - ${g.players}/5 players</small>
                </div>
                <button class="btn btn-small btn-green" onclick="joinGame('${g.host}')">Join</button>
            `;
            list.appendChild(div);
        });
    }, 1500);
}

function joinGame(host) {
    startGame();
}

// ==================== SHOP ====================
let currentShopTab = 'weapons';

function showShopTab(tab) {
    currentShopTab = tab;
    document.querySelectorAll('.shop-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.shop-tab').forEach(t => {
        if (t.textContent.toLowerCase().includes(tab.slice(0, 4))) t.classList.add('active');
    });
    renderShopItems();
}

function renderShopItems() {
    const container = document.getElementById('shop-items');
    const items = shopData[currentShopTab];
    container.innerHTML = '';

    items.forEach(item => {
        const owned = state.ownedItems.includes(item.id);
        const div = document.createElement('div');
        div.className = 'shop-item' + (owned ? ' owned' : '');
        div.innerHTML = `
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-name">${item.name}</div>
            ${owned
                ? '<div class="shop-item-owned">Owned ✓</div>'
                : `<div class="shop-item-price">🪙 ${item.price}</div>`
            }
        `;
        div.addEventListener('click', () => buyItem(item));
        container.appendChild(div);
    });
}

function buyItem(item) {
    if (state.ownedItems.includes(item.id)) {
        // Equip if already owned
        if (currentShopTab === 'weapons') state.equippedWeapon = item.id;
        if (currentShopTab === 'skins') state.equippedSkin = item.id;
        return;
    }
    if (state.coins >= item.price) {
        state.coins -= item.price;
        state.ownedItems.push(item.id);
        if (currentShopTab === 'weapons') state.equippedWeapon = item.id;
        if (currentShopTab === 'skins') state.equippedSkin = item.id;
        updateShopCoins();
        updateCoinsDisplay();
        renderShopItems();
    } else {
        alert('Not enough coins!');
    }
}

// ==================== GAME ENGINE ====================
let canvas, ctx;
let gameRunning = false;
let gameTime = 120; // 2 minutes
let gameTimerInterval;
let animationFrameId;
let keys = {};
let entities = [];
let particles = [];
let items_on_ground = [];
let platforms = [];

const GRAVITY = 0.5;
const GROUND_Y_OFFSET = 80; // distance from bottom

// Colors for different players
const PLAYER_COLORS = ['#2ecc71', '#e74c3c', '#3498db', '#f1c40f', '#9b59b6'];

class Fighter {
    constructor(x, y, name, color, isPlayer, skin) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.width = 40;
        this.height = 60;
        this.name = name;
        this.color = color;
        this.health = 100;
        this.maxHealth = 100;
        this.isPlayer = isPlayer;
        this.skin = skin || '🧑';
        this.facing = 1; // 1 right, -1 left
        this.attacking = false;
        this.attackTimer = 0;
        this.attackCooldown = 0;
        this.hitCooldown = 0;
        this.dead = false;
        this.onGround = false;
        this.walkFrame = 0;
        this.walkTimer = 0;

        // AI stuff
        this.aiTarget = null;
        this.aiTimer = 0;
        this.aiAction = 'idle';
    }

    update(groundY) {
        if (this.dead) return;

        // Gravity
        this.vy += GRAVITY;

        // Move
        this.x += this.vx;
        this.y += this.vy;

        // Ground collision
        if (this.y + this.height > groundY) {
            this.y = groundY - this.height;
            this.vy = 0;
            this.onGround = true;
        }

        // Platform collision
        for (const plat of platforms) {
            if (this.vy > 0 &&
                this.x + this.width > plat.x &&
                this.x < plat.x + plat.w &&
                this.y + this.height > plat.y &&
                this.y + this.height < plat.y + plat.h + 10) {
                this.y = plat.y - this.height;
                this.vy = 0;
                this.onGround = true;
            }
        }

        // Wall bounds
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;

        // Friction
        this.vx *= 0.85;

        // Walk animation
        if (Math.abs(this.vx) > 0.5) {
            this.walkTimer++;
            if (this.walkTimer > 8) {
                this.walkTimer = 0;
                this.walkFrame = (this.walkFrame + 1) % 4;
            }
        } else {
            this.walkFrame = 0;
        }

        // Timers
        if (this.attackCooldown > 0) this.attackCooldown--;
        if (this.hitCooldown > 0) this.hitCooldown--;
        if (this.attackTimer > 0) {
            this.attackTimer--;
            if (this.attackTimer === 0) this.attacking = false;
        }
    }

    attack() {
        if (this.attackCooldown > 0 || this.dead) return;
        this.attacking = true;
        this.attackTimer = 15;
        this.attackCooldown = 25;

        // Get weapon stats
        const weapon = shopData.weapons.find(w => w.id === (this.isPlayer ? state.equippedWeapon : 'sword')) || shopData.weapons[0];
        const range = weapon.range;
        const damage = weapon.damage;

        // Check hits
        for (const other of entities) {
            if (other === this || other.dead) continue;
            const dx = other.x + other.width / 2 - (this.x + this.width / 2);
            const dy = other.y + other.height / 2 - (this.y + this.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < range + 20 && Math.sign(dx) === this.facing) {
                other.takeDamage(damage, this);
            }
        }

        // Attack particles
        for (let i = 0; i < 5; i++) {
            particles.push({
                x: this.x + this.width / 2 + this.facing * 30,
                y: this.y + this.height / 2,
                vx: this.facing * (2 + Math.random() * 4),
                vy: (Math.random() - 0.5) * 4,
                life: 15,
                color: '#ffcc00',
                size: 3 + Math.random() * 4
            });
        }
    }

    takeDamage(amount, attacker) {
        if (this.hitCooldown > 0 || this.dead) return;
        this.health -= amount;
        this.hitCooldown = 20;

        // Knockback
        const dir = Math.sign(this.x - attacker.x) || 1;
        this.vx = dir * 8;
        this.vy = -5;

        // Hit particles
        for (let i = 0; i < 8; i++) {
            particles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8,
                life: 20,
                color: '#ff0000',
                size: 2 + Math.random() * 3
            });
        }

        if (this.health <= 0) {
            this.die(attacker);
        }
    }

    die(killer) {
        this.dead = true;
        // Death particles
        for (let i = 0; i < 20; i++) {
            particles.push({
                x: this.x + this.width / 2,
                y: this.y + this.height / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 40,
                color: this.color,
                size: 3 + Math.random() * 5
            });
        }
        if (killer && killer.isPlayer) {
            state.kills++;
            document.getElementById('kill-count').textContent = 'Kills: ' + state.kills;
        }

        // Respawn after 3 seconds
        setTimeout(() => {
            if (!gameRunning) return;
            this.health = this.maxHealth;
            this.dead = false;
            this.x = 100 + Math.random() * (canvas.width - 200);
            this.y = 100;
            this.vx = 0;
            this.vy = 0;
        }, 3000);
    }

    runAI(groundY) {
        if (this.dead || this.isPlayer) return;

        this.aiTimer--;
        if (this.aiTimer <= 0) {
            this.aiTimer = 30 + Math.random() * 60;
            // Pick action
            const r = Math.random();
            if (r < 0.4) this.aiAction = 'chase';
            else if (r < 0.6) this.aiAction = 'wander';
            else if (r < 0.8) this.aiAction = 'jump';
            else this.aiAction = 'idle';

            // Pick target
            const alive = entities.filter(e => e !== this && !e.dead);
            if (alive.length > 0) {
                this.aiTarget = alive[Math.floor(Math.random() * alive.length)];
            }
        }

        if (this.aiAction === 'chase' && this.aiTarget && !this.aiTarget.dead) {
            const dx = this.aiTarget.x - this.x;
            this.facing = dx > 0 ? 1 : -1;
            this.vx += this.facing * 0.8;
            if (Math.abs(dx) < 60) {
                this.attack();
            }
            // Jump over obstacles or to platforms
            if (Math.random() < 0.02 && this.onGround) {
                this.vy = -12;
                this.onGround = false;
            }
        } else if (this.aiAction === 'wander') {
            this.vx += (Math.random() - 0.5) * 1.5;
        } else if (this.aiAction === 'jump' && this.onGround) {
            this.vy = -12;
            this.onGround = false;
        }

        // Limit speed
        if (this.vx > 5) this.vx = 5;
        if (this.vx < -5) this.vx = -5;
    }

    draw() {
        if (this.dead) return;

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 2, this.y + this.height + 2, 20, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Body bob for walking
        const bobY = Math.abs(this.vx) > 0.5 ? Math.sin(this.walkFrame * Math.PI / 2) * 3 : 0;

        // Flash when hit
        if (this.hitCooldown > 0 && this.hitCooldown % 4 < 2) {
            ctx.globalAlpha = 0.5;
        }

        // Body
        ctx.fillStyle = this.color;
        const bodyX = this.x + 5;
        const bodyY = this.y + 20 + bobY;
        const bodyW = this.width - 10;
        const bodyH = this.height - 25;

        // Draw rounded body
        ctx.beginPath();
        ctx.roundRect(bodyX, bodyY, bodyW, bodyH, 8);
        ctx.fill();

        // Head
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 14 + bobY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Skin emoji face
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.skin, this.x + this.width / 2, this.y + 20 + bobY);

        // Arms
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';

        // Left arm
        ctx.beginPath();
        ctx.moveTo(this.x + 5, this.y + 30 + bobY);
        if (this.attacking && this.facing === -1) {
            ctx.lineTo(this.x - 20, this.y + 25 + bobY);
        } else {
            ctx.lineTo(this.x - 5, this.y + 45 + bobY + Math.sin(this.walkFrame) * 5);
        }
        ctx.stroke();

        // Right arm
        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 5, this.y + 30 + bobY);
        if (this.attacking && this.facing === 1) {
            ctx.lineTo(this.x + this.width + 20, this.y + 25 + bobY);
        } else {
            ctx.lineTo(this.x + this.width + 5, this.y + 45 + bobY - Math.sin(this.walkFrame) * 5);
        }
        ctx.stroke();

        // Weapon in attacking hand
        if (this.attacking) {
            const weapon = shopData.weapons.find(w => w.id === (this.isPlayer ? state.equippedWeapon : 'sword'));
            if (weapon) {
                ctx.font = '22px serif';
                const weaponX = this.facing === 1
                    ? this.x + this.width + 18
                    : this.x - 22;
                ctx.fillText(weapon.icon, weaponX, this.y + 30 + bobY);
            }
        }

        // Legs
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 5;
        const legSpread = Math.abs(this.vx) > 0.5 ? Math.sin(this.walkFrame * Math.PI / 2) * 8 : 0;

        ctx.beginPath();
        ctx.moveTo(this.x + 12, this.y + this.height - 5);
        ctx.lineTo(this.x + 8 - legSpread, this.y + this.height + 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x + this.width - 12, this.y + this.height - 5);
        ctx.lineTo(this.x + this.width - 8 + legSpread, this.y + this.height + 2);
        ctx.stroke();

        ctx.globalAlpha = 1;

        // Health bar above head
        const barWidth = 40;
        const barHeight = 5;
        const barX = this.x + this.width / 2 - barWidth / 2;
        const barY = this.y - 10;

        ctx.fillStyle = '#333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        const healthPct = this.health / this.maxHealth;
        ctx.fillStyle = healthPct > 0.5 ? '#2ecc71' : healthPct > 0.25 ? '#f1c40f' : '#e74c3c';
        ctx.fillRect(barX, barY, barWidth * healthPct, barHeight);

        // Name
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + this.width / 2, this.y - 14);
    }
}

// ==================== START GAME ====================
function startGame() {
    showScreen('game-screen');
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    gameRunning = true;
    gameTime = 120;
    state.kills = 0;
    entities = [];
    particles = [];
    items_on_ground = [];
    keys = {};

    const groundY = canvas.height - GROUND_Y_OFFSET;

    // Create platforms
    platforms = [
        { x: canvas.width * 0.15, y: groundY - 120, w: 150, h: 15 },
        { x: canvas.width * 0.5 - 75, y: groundY - 200, w: 150, h: 15 },
        { x: canvas.width * 0.75, y: groundY - 120, w: 150, h: 15 },
        { x: canvas.width * 0.35, y: groundY - 80, w: 100, h: 15 },
        { x: canvas.width * 0.6, y: groundY - 80, w: 100, h: 15 },
    ];

    // Spawn player
    const playerSkin = shopData.skins.find(s => s.id === state.equippedSkin);
    const player = new Fighter(
        canvas.width / 2 - 20,
        groundY - 100,
        state.username,
        PLAYER_COLORS[0],
        true,
        playerSkin ? playerSkin.icon : '🧑'
    );
    entities.push(player);

    // Spawn other players/bots
    state.players.forEach((p, i) => {
        if (i === 0) return; // skip player
        const spawnX = 100 + (i * (canvas.width - 200) / 4);
        const fighter = new Fighter(
            spawnX,
            groundY - 100,
            p.name,
            PLAYER_COLORS[i % PLAYER_COLORS.length],
            false,
            p.avatar
        );
        entities.push(fighter);
    });

    // If no other players, add some bots automatically
    if (entities.length < 3) {
        for (let i = entities.length; i < 4; i++) {
            const idx = Math.floor(Math.random() * botNames.length);
            const fighter = new Fighter(
                100 + Math.random() * (canvas.width - 200),
                groundY - 100,
                botNames[idx],
                PLAYER_COLORS[i % PLAYER_COLORS.length],
                false,
                botAvatars[idx]
            );
            entities.push(fighter);
        }
    }

    // Spawn some items on ground
    spawnGroundItems(groundY);

    // HUD
    document.getElementById('player-name-hud').textContent = state.username;
    document.getElementById('kill-count').textContent = 'Kills: 0';

    // Timer
    clearInterval(gameTimerInterval);
    gameTimerInterval = setInterval(() => {
        if (!gameRunning) return;
        gameTime--;
        const mins = Math.floor(gameTime / 60);
        const secs = gameTime % 60;
        document.getElementById('game-timer').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;

        if (gameTime <= 0) {
            endGame();
        }
    }, 1000);

    // Start game loop
    cancelAnimationFrame(animationFrameId);
    gameLoop();
}

function spawnGroundItems(groundY) {
    const itemIcons = ['🍌', '🧪', '🍎', '⭐', '💣'];
    for (let i = 0; i < 5; i++) {
        items_on_ground.push({
            x: 80 + Math.random() * (canvas.width - 160),
            y: groundY - 20,
            icon: itemIcons[Math.floor(Math.random() * itemIcons.length)],
            collected: false,
            bobOffset: Math.random() * Math.PI * 2
        });
    }
    // Also put some on platforms
    for (const plat of platforms) {
        if (Math.random() > 0.5) {
            items_on_ground.push({
                x: plat.x + plat.w / 2 - 10,
                y: plat.y - 25,
                icon: itemIcons[Math.floor(Math.random() * itemIcons.length)],
                collected: false,
                bobOffset: Math.random() * Math.PI * 2
            });
        }
    }
}

// ==================== GAME LOOP ====================
function gameLoop() {
    if (!gameRunning) return;
    animationFrameId = requestAnimationFrame(gameLoop);

    const groundY = canvas.height - GROUND_Y_OFFSET;
    const player = entities[0];

    // Player input
    if (!player.dead) {
        if (keys['a'] || keys['arrowleft']) { player.vx -= 1.2; player.facing = -1; }
        if (keys['d'] || keys['arrowright']) { player.vx += 1.2; player.facing = 1; }
        if ((keys['w'] || keys['arrowup'] || keys[' ']) && player.onGround) {
            // Space alone = attack, w/up = jump
            if (keys['w'] || keys['arrowup']) {
                player.vy = -13;
                player.onGround = false;
            }
        }
        if (keys[' ']) { player.attack(); }

        // Limit speed
        if (player.vx > 6) player.vx = 6;
        if (player.vx < -6) player.vx = -6;
    }

    // Update entities
    for (const e of entities) {
        e.update(groundY);
        e.runAI(groundY);
    }

    // Item pickup
    for (const item of items_on_ground) {
        if (item.collected) continue;
        if (player.dead) continue;
        const dx = player.x + player.width / 2 - item.x;
        const dy = player.y + player.height / 2 - item.y;
        if (Math.abs(dx) < 30 && Math.abs(dy) < 30) {
            item.collected = true;
            // Apply item effect
            if (item.icon === '🧪') player.health = Math.min(player.maxHealth, player.health + 30);
            if (item.icon === '🍎') player.health = Math.min(player.maxHealth, player.health + 50);
            if (item.icon === '⭐') { player.hitCooldown = 100; } // temp invincibility
            if (item.icon === '💣') {
                // Damage all nearby enemies
                for (const e of entities) {
                    if (e === player || e.dead) continue;
                    const dist = Math.sqrt((e.x - player.x) ** 2 + (e.y - player.y) ** 2);
                    if (dist < 150) e.takeDamage(30, player);
                }
                // Explosion particles
                for (let i = 0; i < 20; i++) {
                    particles.push({
                        x: item.x, y: item.y,
                        vx: (Math.random() - 0.5) * 12,
                        vy: (Math.random() - 0.5) * 12,
                        life: 30, color: '#ff6600', size: 4 + Math.random() * 5
                    });
                }
            }
            if (item.icon === '🍌') {
                // Drop banana trap
                items_on_ground.push({
                    x: player.x,
                    y: groundY - 15,
                    icon: '🍌',
                    collected: false,
                    isTrap: true,
                    bobOffset: 0
                });
            }
        }
    }

    // Banana trap check for AI
    for (const item of items_on_ground) {
        if (!item.isTrap || item.collected) continue;
        for (const e of entities) {
            if (e === entities[0] || e.dead) continue;
            const dx = e.x + e.width / 2 - item.x;
            const dy = e.y + e.height / 2 - item.y;
            if (Math.abs(dx) < 25 && Math.abs(dy) < 30) {
                item.collected = true;
                e.vx = (Math.random() - 0.5) * 15;
                e.vy = -8;
                e.takeDamage(10, entities[0]);
                for (let i = 0; i < 8; i++) {
                    particles.push({
                        x: item.x, y: item.y,
                        vx: (Math.random() - 0.5) * 6,
                        vy: -Math.random() * 5,
                        life: 20, color: '#ffff00', size: 3
                    });
                }
            }
        }
    }

    // Update particles
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.vy += 0.1;
        if (p.life <= 0) particles.splice(i, 1);
    }

    // Update HUD
    if (!player.dead) {
        const healthPct = (player.health / player.maxHealth) * 100;
        document.getElementById('player-health').style.width = healthPct + '%';
    }

    // Respawn items occasionally
    if (Math.random() < 0.002) {
        const itemIcons = ['🍌', '🧪', '🍎', '⭐', '💣'];
        items_on_ground.push({
            x: 80 + Math.random() * (canvas.width - 160),
            y: groundY - 20,
            icon: itemIcons[Math.floor(Math.random() * itemIcons.length)],
            collected: false,
            bobOffset: Math.random() * Math.PI * 2
        });
    }

    // ==================== DRAW ====================
    // Sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#0f0c29');
    grad.addColorStop(0.5, '#302b63');
    grad.addColorStop(1, '#24243e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Stars
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
        const sx = (i * 137.5 + 50) % canvas.width;
        const sy = (i * 97.3 + 20) % (canvas.height * 0.4);
        const ss = (i % 3 === 0) ? 2 : 1;
        ctx.globalAlpha = 0.3 + Math.sin(Date.now() / 1000 + i) * 0.2;
        ctx.fillRect(sx, sy, ss, ss);
    }
    ctx.globalAlpha = 1;

    // Mountains in background
    ctx.fillStyle = '#1a1a3a';
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    for (let x = 0; x <= canvas.width; x += 80) {
        const h = 60 + Math.sin(x * 0.005) * 40 + Math.cos(x * 0.01) * 30;
        ctx.lineTo(x, groundY - h);
    }
    ctx.lineTo(canvas.width, groundY);
    ctx.closePath();
    ctx.fill();

    // Ground
    ctx.fillStyle = '#2d5016';
    ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);

    // Grass on top
    ctx.fillStyle = '#3a7d20';
    ctx.fillRect(0, groundY, canvas.width, 8);

    // Grass blades
    ctx.strokeStyle = '#4a9d30';
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 15) {
        const h = 8 + Math.sin(x + Date.now() / 500) * 4;
        ctx.beginPath();
        ctx.moveTo(x, groundY);
        ctx.lineTo(x + 3, groundY - h);
        ctx.stroke();
    }

    // Draw platforms
    for (const plat of platforms) {
        // Platform body
        ctx.fillStyle = '#5a3921';
        ctx.beginPath();
        ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 4);
        ctx.fill();

        // Platform top (grass)
        ctx.fillStyle = '#3a7d20';
        ctx.fillRect(plat.x, plat.y, plat.w, 4);
    }

    // Draw items on ground
    const now = Date.now();
    for (const item of items_on_ground) {
        if (item.collected) continue;
        const bob = Math.sin(now / 400 + item.bobOffset) * 4;
        ctx.font = '22px serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.icon, item.x, item.y + bob);

        // Glow
        ctx.beginPath();
        ctx.arc(item.x, item.y + bob - 5, 15, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255,255,100,0.1)';
        ctx.fill();
    }

    // Draw entities
    for (const e of entities) {
        e.draw();
    }

    // Draw particles
    for (const p of particles) {
        ctx.globalAlpha = p.life / 40;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;
}

// ==================== END GAME ====================
function endGame() {
    gameRunning = false;
    clearInterval(gameTimerInterval);
    cancelAnimationFrame(animationFrameId);

    const coinsEarned = 50 + state.kills * 25;
    state.coins += coinsEarned;

    document.getElementById('final-kills').textContent = state.kills;
    document.getElementById('coins-earned').textContent = coinsEarned;

    if (state.kills > 0) {
        document.getElementById('gameover-title').textContent = '🏆 Victory!';
    } else {
        document.getElementById('gameover-title').textContent = '💀 Game Over!';
    }

    showScreen('gameover-screen');
}

// ==================== INPUT ====================
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    if (e.key === 'Escape' && gameRunning) {
        endGame();
    }

    // E to use equipped item
    if (e.key.toLowerCase() === 'e' && gameRunning) {
        const player = entities[0];
        if (!player || player.dead) return;
        // heal if we have potion
        if (state.ownedItems.includes('potion')) {
            player.health = Math.min(player.maxHealth, player.health + 30);
            for (let i = 0; i < 8; i++) {
                particles.push({
                    x: player.x + player.width / 2,
                    y: player.y + player.height / 2,
                    vx: (Math.random() - 0.5) * 4,
                    vy: -Math.random() * 5,
                    life: 25, color: '#00ff88', size: 3
                });
            }
        }
    }
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

// Handle window resize
window.addEventListener('resize', () => {
    if (canvas && gameRunning) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});

// ==================== INIT ====================
updateCoinsDisplay();
updatePlayerSlots();
