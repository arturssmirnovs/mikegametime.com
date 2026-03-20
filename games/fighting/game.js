// ==================== GAME STATE ====================
const state = {
    username: 'Player',
    coins: 0,
    diamonds: 5,
    kills: 0,
    botKills: 0,      // lifetime bot kills (toward VIP)
    playerKills: 0,   // lifetime player kills (toward VIP)
    vipUnlocked: false,
    gold: 2,         // VIP currency — earned by kills
    players: [
        { slot: 0, name: 'You', type: 'player', avatar: '🧑' }
    ],
    friends: ['CoolKid99', 'GameMaster', 'NinjaFighter'],
    gameMode: 'freeforall',
    ownedItems: ['fist'],
    equippedWeapon: 'fist',
    equippedSkin: 'default',
    equippedGear: [],
    buildsRemaining: 0,
    gameInventory: [],
    currentSlot: -1,
};

const groundItemDefs = {
    '🧪': { id: 'potion',      name: 'Health Potion',    icon: '🧪' },
    '🍎': { id: 'apple',       name: 'Golden Apple',     icon: '🍎' },
    '⭐': { id: 'star',        name: 'Power Star',       icon: '⭐' },
    '💣': { id: 'bomb',        name: 'Bomb',             icon: '💣' },
    '🍌': { id: 'banana',      name: 'Banana',           icon: '🍌' },
    '🫀': { id: 'heart',       name: 'Extra Heart',      icon: '🫀' },
    '🧊': { id: 'icecube',     name: 'Ice Cube',         icon: '🧊' },
    '🧨': { id: 'firecracker', name: 'Firecracker',      icon: '🧨' },
    '🍄': { id: 'mushroom',    name: 'Power Mushroom',   icon: '🍄' },
    '💊': { id: 'pill',        name: 'Speed Pill',       icon: '💊' },
    '🗡️': { id: 'dagger',      name: 'Dagger',           icon: '🗡️' },
    '🎯': { id: 'bullseye',    name: 'Target Lock',      icon: '🎯' },
    '🌀': { id: 'vortex',      name: 'Vortex Scroll',    icon: '🌀' },
    '🪬': { id: 'charm',       name: 'Protection Charm', icon: '🪬' },
    '🔮': { id: 'crystal',     name: 'Crystal Ball',     icon: '🔮' },
};

// ==================== SAVE / LOAD ====================
const SAVE_KEY = 'mgt_fighting_save';

function saveState() {
    const data = {
        username:       state.username,
        coins:          state.coins,
        diamonds:       state.diamonds,
        ownedItems:     state.ownedItems,
        equippedWeapon: state.equippedWeapon,
        equippedSkin:   state.equippedSkin,
        equippedGear:   state.equippedGear,
        friends:        state.friends,
        botKills:       state.botKills,
        playerKills:    state.playerKills,
        vipUnlocked:    state.vipUnlocked,
        gold:           state.gold,
    };
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch(e) {}
}

function loadState() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (data.username)       state.username       = data.username;
        if (typeof data.coins === 'number')    state.coins    = data.coins;
        if (typeof data.diamonds === 'number') state.diamonds = data.diamonds;
        if (Array.isArray(data.ownedItems))    state.ownedItems    = data.ownedItems;
        if (data.equippedWeapon) state.equippedWeapon = data.equippedWeapon;
        if (data.equippedSkin)   state.equippedSkin   = data.equippedSkin;
        if (Array.isArray(data.equippedGear))  state.equippedGear  = data.equippedGear;
        if (Array.isArray(data.friends))       state.friends       = data.friends;
        if (typeof data.botKills === 'number')    state.botKills    = data.botKills;
        if (typeof data.playerKills === 'number') state.playerKills = data.playerKills;
        if (data.vipUnlocked)                     state.vipUnlocked = data.vipUnlocked;
        if (typeof data.gold === 'number')        state.gold        = data.gold;
        // Sync player slot name
        state.players[0].name = state.username;
    } catch(e) {}
}

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
        { id: 'ninja', name: 'Ninja', icon: '🥷', price: 1000 },
        { id: 'knight', name: 'Knight', icon: '🤺', price: 1000 },
        { id: 'robot', name: 'Robot', icon: '🤖', price: 1000 },
        { id: 'alien', name: 'Alien', icon: '👽', price: 1000 },
        { id: 'zombie', name: 'Zombie', icon: '🧟', price: 1000 },
    ],
    gear: [
        { id: 'helmet', name: 'Helmet', icon: '🪖', price: 1000, effect: 'Take 20% less damage' },
        { id: 'armor', name: 'Chest Armor', icon: '🦺', price: 1000, effect: 'Take 35% less damage' },
        { id: 'boots', name: 'Speed Boots', icon: '👟', price: 1000, effect: 'Move 40% faster' },
        { id: 'gloves', name: 'Power Gloves', icon: '🥊', price: 1000, effect: 'Deal 25% more damage' },
    ],
    powers: [
        { id: 'doublejump', name: 'Double Jump', icon: '🦘', price: 220, effect: 'Jump again mid-air (W / ↑)' },
        { id: 'builder', name: 'Builder', icon: '🏗️', price: 280, effect: 'Place 5 platforms per game (B key)' },
        { id: 'rage', name: 'Rage Mode', icon: '😤', price: 200, effect: '+50% damage when below 30% HP' },
        { id: 'magnet', name: 'Magnet', icon: '🧲', price: 160, effect: 'Auto-collect nearby items' },
    ],
    premium: [
        { id: 'prem_dragon', name: 'Dragon Skin', icon: '🐉', diamondPrice: 100, effect: 'Legendary dragon look' },
        { id: 'prem_crown', name: 'Golden Crown', icon: '👑', diamondPrice: 100, effect: '+10% coins from kills' },
        { id: 'prem_fire', name: 'Fire Trail', icon: '🔥', diamondPrice: 100, effect: 'Leave fire behind you' },
        { id: 'prem_lightning', name: 'Lightning Strike', icon: '⚡', diamondPrice: 100, effect: 'Instant kill move (1x per game)' },
        { id: 'prem_angel', name: 'Angel Wings', icon: '👼', diamondPrice: 100, effect: 'Fly for 5 seconds (1x per game)' },
        { id: 'prem_ghost', name: 'Ghost Mode', icon: '👻', diamondPrice: 100, effect: 'Phase through walls (1x per game)' },
        { id: 'prem_titan', name: 'Titan Armor', icon: '🛡️', diamondPrice: 1000, effect: 'Take 60% less damage — near invincible' },
        { id: 'prem_meteor', name: 'Meteor Crash', icon: '☄️', diamondPrice: 1000, effect: 'Smash down from sky (3x per game)' },
        { id: 'prem_vampire', name: 'Vampire Bite', icon: '🧛', diamondPrice: 1000, effect: 'Steal 20 HP on every hit' },
        { id: 'prem_blackhole', name: 'Black Hole', icon: '🕳️', diamondPrice: 1000, effect: 'Pull all enemies toward you (2x per game)' },
        { id: 'prem_unicorn', name: 'Unicorn Skin', icon: '🦄', diamondPrice: 1000, effect: 'Ultra rare rainbow fighter skin' },
        { id: 'prem_tornado', name: 'Tornado Spin', icon: '🌪️', diamondPrice: 1000, effect: 'Spin and deal damage around you (3x per game)' },
        { id: 'prem_icecrown', name: 'Ice Crown', icon: '❄️', diamondPrice: 1000, effect: 'Freeze nearby enemies on spawn' },
        { id: 'prem_beast', name: 'Beast Mode', icon: '🐺', diamondPrice: 1000, effect: 'Double speed and damage for 10s (1x per game)' },
        { id: 'prem_nuke', name: 'Nuke', icon: '💥', diamondPrice: 1000, effect: 'Massive explosion — KO all enemies (1x per game)' },
        { id: 'prem_phoenix', name: 'Phoenix Rebirth', icon: '🦅', diamondPrice: 1000, effect: 'Revive once with full HP when you die' },
    ],
    vip: [
        // ── League 1: Bronze VIP ──
        { id: 'vip_badge',    league: 1, name: 'VIP Badge',      icon: '💠', price: 5000000,    effect: 'Show a VIP crown above your fighter' },
        { id: 'vip_aura',     league: 1, name: 'Gold Aura',      icon: '✨', price: 5000000,    effect: 'Golden glow around your fighter' },
        { id: 'vip_rainbow',  league: 1, name: 'Rainbow Trail',  icon: '🌈', price: 5000000,    effect: 'Leave a rainbow particle trail as you run' },
        { id: 'vip_banner',   league: 1, name: 'Elite Banner',   icon: '🎖️', price: 5000000,    effect: 'Show your elite VIP rank above your name' },
        // ── League 2: Silver VIP ──
        { id: 'vip_plasma',   league: 2, name: 'Plasma Blade',   icon: '⚔️', price: 5000000, damage: 80, range: 60, effect: '3x sword damage — sizzles enemies' },
        { id: 'vip_force',    league: 2, name: 'Force Field',    icon: '🛡️', price: 5000000,    effect: 'Take 40% less damage at all times' },
        { id: 'vip_turbo',    league: 2, name: 'Turbo Legs',     icon: '💨', price: 5000000,    effect: '70% movement speed boost' },
        { id: 'vip_hawkeye',  league: 2, name: 'Hawk Eye',       icon: '👁️', price: 5000000,    effect: 'Double attack range — hit from far away' },
        // ── League 3: Gold VIP ──
        { id: 'vip_dragon',   league: 3, name: 'Dragon Soul',    icon: '🐲', price: 5000000,    effect: 'Fire breath aura that burns nearby enemies' },
        { id: 'vip_warp',     league: 3, name: 'Warp Dash',      icon: '🌀', price: 5000000,    effect: 'Teleport dash through enemies (W key in-air)' },
        { id: 'vip_hyperbomb',league: 3, name: 'Hyper Bomb',     icon: '💣', price: 5000000,    effect: 'Mega explosion — 3x bomb radius and damage' },
        { id: 'vip_regen',    league: 3, name: 'Bio Regen',      icon: '🧬', price: 5000000,    effect: 'Slowly recover HP during battle' },
        // ── League 4: Platinum VIP ──
        { id: 'vip_emperor',  league: 4, name: 'Emperor Skin',   icon: '👑', price: 5000000,    effect: 'Legendary emperor look — ultra rare' },
        { id: 'vip_zeus',     league: 4, name: 'Zeus Strike',    icon: '⚡', price: 5000000, damage: 150, range: 999, effect: 'Chain lightning that arcs to all enemies' },
        { id: 'vip_mystic',   league: 4, name: 'Mystic Shield',  icon: '🔮', price: 5000000,    effect: 'Absorb one fatal hit — saves you from death' },
        { id: 'vip_star',     league: 4, name: 'Shooting Star',  icon: '🌠', price: 5000000,    effect: 'Rain stars down on all enemies (2x per game)' },
        // ── League 5: Diamond VIP — God Tier ──
        { id: 'vip_godskin',  league: 5, name: 'God Skin',       icon: '🌟', price: 5000000,    effect: 'Legendary golden godlike appearance' },
        { id: 'vip_worldend', league: 5, name: 'World Ender',    icon: '💥', price: 5000000,    effect: 'One-tap ability — destroys every enemy at once' },
        { id: 'vip_immortal', league: 5, name: 'Immortal Soul',  icon: '♾️', price: 5000000,    effect: 'Never die — respawn infinitely with full HP' },
        { id: 'vip_cosmic',   league: 5, name: 'Cosmic Power',   icon: '🪐', price: 5000000,    effect: 'Every stat maxed — the ultimate VIP power' },
    ],
};

// Bot names for fun
const botNames = ['RoboFighter', 'BattleBot', 'CrushMaster', 'TurboKick', 'IronPunch', 'StormBlade'];
const botAvatars = ['🤖', '👾', '🎃', '👹', '🦾', '🦿'];

// ==================== SOUND EFFECTS ====================
function playLaughSound() {
    try {
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        for (let ha = 0; ha < 4; ha++) {
            const osc = ac.createOscillator();
            const gain = ac.createGain();
            osc.connect(gain);
            gain.connect(ac.destination);
            osc.type = 'sine';
            const t = ac.currentTime + ha * 0.2;
            osc.frequency.setValueAtTime(580, t);
            osc.frequency.exponentialRampToValueAtTime(360, t + 0.16);
            gain.gain.setValueAtTime(0.28, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
            osc.start(t);
            osc.stop(t + 0.16);
        }
    } catch(e) {}
}

// ==================== GALAXY BACKGROUND ====================
const galaxyCanvas = document.getElementById('galaxy-bg');
const gctx = galaxyCanvas.getContext('2d');
let galaxyAnimId;

const stars = [];
const shootingStars = [];
const nebulae = [
    { x: 0.25, y: 0.35, r: 220, color: '120,60,200' },
    { x: 0.75, y: 0.55, r: 180, color: '0,100,200' },
    { x: 0.5,  y: 0.75, r: 150, color: '200,40,120' },
];

function initGalaxy() {
    galaxyCanvas.width = window.innerWidth;
    galaxyCanvas.height = window.innerHeight;
    stars.length = 0;
    for (let i = 0; i < 280; i++) {
        stars.push({
            x: Math.random(),
            y: Math.random(),
            size: Math.random() * 2.2 + 0.3,
            brightness: Math.random(),
            twinkleSpeed: 0.01 + Math.random() * 0.03,
            twinkleOffset: Math.random() * Math.PI * 2,
        });
    }
}

function spawnShootingStar() {
    shootingStars.push({
        x: Math.random() * galaxyCanvas.width,
        y: Math.random() * galaxyCanvas.height * 0.5,
        len: 80 + Math.random() * 120,
        speed: 8 + Math.random() * 8,
        angle: Math.PI / 5 + (Math.random() - 0.5) * 0.3,
        life: 1,
        decay: 0.025 + Math.random() * 0.02,
    });
}

function drawGalaxy() {
    const w = galaxyCanvas.width;
    const h = galaxyCanvas.height;

    // Deep space background
    gctx.fillStyle = '#04010f';
    gctx.fillRect(0, 0, w, h);

    // Nebula clouds
    for (const n of nebulae) {
        const grad = gctx.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, n.r);
        grad.addColorStop(0,   `rgba(${n.color},0.18)`);
        grad.addColorStop(0.5, `rgba(${n.color},0.07)`);
        grad.addColorStop(1,   `rgba(${n.color},0)`);
        gctx.fillStyle = grad;
        gctx.fillRect(0, 0, w, h);
    }

    // Stars
    const t = Date.now() / 1000;
    for (const s of stars) {
        const alpha = 0.4 + Math.sin(t * s.twinkleSpeed * 60 + s.twinkleOffset) * 0.4 + 0.2;
        gctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        gctx.fillStyle = '#fff';
        gctx.beginPath();
        gctx.arc(s.x * w, s.y * h, s.size, 0, Math.PI * 2);
        gctx.fill();
    }
    gctx.globalAlpha = 1;

    // Shooting stars
    for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        const tx = Math.cos(ss.angle) * ss.len;
        const ty = Math.sin(ss.angle) * ss.len;
        const grad = gctx.createLinearGradient(ss.x, ss.y, ss.x - tx, ss.y - ty);
        grad.addColorStop(0, `rgba(255,255,255,${ss.life})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        gctx.strokeStyle = grad;
        gctx.lineWidth = 2;
        gctx.beginPath();
        gctx.moveTo(ss.x, ss.y);
        gctx.lineTo(ss.x - tx, ss.y - ty);
        gctx.stroke();

        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.life -= ss.decay;
        if (ss.life <= 0) shootingStars.splice(i, 1);
    }

    // Randomly spawn shooting stars
    if (Math.random() < 0.008) spawnShootingStar();

    // Black hole
    const bx = w * 0.5;
    const by = h * 0.38;
    const angle = t * 1.2;

    // Outer glow
    const outerGlow = gctx.createRadialGradient(bx, by, 45, bx, by, 160);
    outerGlow.addColorStop(0,   'rgba(80,20,120,0.0)');
    outerGlow.addColorStop(0.4, 'rgba(80,20,120,0.15)');
    outerGlow.addColorStop(0.7, 'rgba(40,10,80,0.08)');
    outerGlow.addColorStop(1,   'rgba(0,0,0,0)');
    gctx.fillStyle = outerGlow;
    gctx.beginPath();
    gctx.arc(bx, by, 160, 0, Math.PI * 2);
    gctx.fill();

    // Accretion disk (spinning ellipse rings)
    gctx.save();
    gctx.translate(bx, by);
    gctx.rotate(angle);
    for (let ring = 0; ring < 6; ring++) {
        const ri = ring / 6;
        const rx = 80 + ring * 14;
        const ry = 15 + ring * 3;
        const alpha = (0.6 - ri * 0.5) * 0.9;
        const r = Math.floor(180 + ring * 12);
        const g2 = Math.floor(80 + ring * 15);
        const b2 = Math.floor(20 + ring * 8);
        gctx.strokeStyle = `rgba(${r},${g2},${b2},${alpha})`;
        gctx.lineWidth = 3 - ring * 0.3;
        gctx.beginPath();
        gctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        gctx.stroke();
    }
    gctx.restore();

    // Second disk layer spinning opposite
    gctx.save();
    gctx.translate(bx, by);
    gctx.rotate(-angle * 0.6);
    for (let ring = 0; ring < 4; ring++) {
        const rx = 70 + ring * 12;
        const ry = 11 + ring * 2;
        const alpha = 0.25 - ring * 0.05;
        gctx.strokeStyle = `rgba(255,160,60,${alpha})`;
        gctx.lineWidth = 1.5;
        gctx.beginPath();
        gctx.ellipse(0, 0, rx, ry, 0.3, 0, Math.PI * 2);
        gctx.stroke();
    }
    gctx.restore();

    // Event horizon (pure black circle)
    gctx.beginPath();
    gctx.arc(bx, by, 42, 0, Math.PI * 2);
    gctx.fillStyle = '#000';
    gctx.fill();

    // Inner glow ring around event horizon
    const innerGlow = gctx.createRadialGradient(bx, by, 40, bx, by, 58);
    innerGlow.addColorStop(0,   'rgba(255,120,0,0.55)');
    innerGlow.addColorStop(0.5, 'rgba(200,60,0,0.2)');
    innerGlow.addColorStop(1,   'rgba(0,0,0,0)');
    gctx.fillStyle = innerGlow;
    gctx.beginPath();
    gctx.arc(bx, by, 58, 0, Math.PI * 2);
    gctx.fill();

    // Re-draw black center so it stays solid
    gctx.beginPath();
    gctx.arc(bx, by, 41, 0, Math.PI * 2);
    gctx.fillStyle = '#000';
    gctx.fill();
}

function startGalaxy() {
    galaxyCanvas.classList.add('visible');
    initGalaxy();
    function loop() {
        drawGalaxy();
        galaxyAnimId = requestAnimationFrame(loop);
    }
    loop();
}

function stopGalaxy() {
    cancelAnimationFrame(galaxyAnimId);
    galaxyCanvas.classList.remove('visible');
}

window.addEventListener('resize', () => {
    if (galaxyCanvas.classList.contains('visible')) initGalaxy();
});

// ==================== SCREEN MANAGEMENT ====================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');

    if (screenId === 'start-screen') {
        updateCoinsDisplay();
        updatePlayerSlots();
        startGalaxy();
    } else {
        stopGalaxy();
    }

    if (screenId === 'shop-screen') {
        updateShopCoins();
        showShopTab('weapons');
    }
    if (screenId === 'inventory-screen') {
        renderInventory();
    }
}

// ==================== POPUPS ====================
function closePopup(id) {
    document.getElementById(id).classList.add('hidden');
}

// ==================== COINS & DIAMONDS ====================
function updateCoinsDisplay() {
    document.getElementById('coins-amount').textContent = state.coins;
    document.getElementById('diamonds-amount').textContent = state.diamonds;
    const sg = document.getElementById('shop-gold');
    if (sg) sg.textContent = state.gold.toLocaleString();
    saveState();
}

function updateShopCoins() {
    document.getElementById('shop-coins').textContent = state.coins;
    document.getElementById('shop-diamonds').textContent = state.diamonds;
    const sg = document.getElementById('shop-gold');
    if (sg) sg.textContent = state.gold.toLocaleString();
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
        saveState();
    }
}

// ==================== GAME MODE ====================
function selectMode(mode) {
    state.gameMode = mode;
    customGame.mode = mode;
    startGame();
}

// ==================== CREATE GAME ====================
function showCreateGame() {
    showScreen('create-game-screen');
    renderCreateGame();
}

function renderCreateGame() {
    // Difficulty buttons
    ['easy','normal','hard','extreme'].forEach(d => {
        const btn = document.getElementById('diff-' + d);
        if (btn) btn.classList.toggle('cg-selected', customGame.difficulty === d);
    });
    // Mode buttons
    ['freeforall','teams','boss','space','hideseek'].forEach(m => {
        const btn = document.getElementById('cgmode-' + m);
        if (btn) btn.classList.toggle('cg-selected', customGame.mode === m);
    });
    // Counts
    document.getElementById('cg-player-count').textContent = customGame.playerCount;
    document.getElementById('cg-bot-count').textContent    = customGame.botCount;
}

function cgSetDiff(d)   { customGame.difficulty = d; renderCreateGame(); }
function cgSetMode(m)   { customGame.mode = m;       renderCreateGame(); }
function cgAddPlayer()  { if (customGame.playerCount < 5) { customGame.playerCount++; renderCreateGame(); } }
function cgSubPlayer()  { if (customGame.playerCount > 1) { customGame.playerCount--; renderCreateGame(); } }
function cgAddBot()     { if (customGame.botCount < 5)    { customGame.botCount++;    renderCreateGame(); } }
function cgSubBot()     { if (customGame.botCount > 0)    { customGame.botCount--;    renderCreateGame(); } }

function startCustomGame() {
    state.gameMode = customGame.mode;
    startGame();
}

function startPractice() {
    // Solo practice: easy difficulty, freeforall, 1 player, 0 bots
    customGame.difficulty  = 'easy';
    customGame.playerCount = 1;
    customGame.botCount    = 0;
    state.gameMode         = 'freeforall';
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
        const match = tab === 'vip' ? t.textContent.toLowerCase().includes('vip') : t.textContent.toLowerCase().includes(tab.slice(0, 4));
        if (match) t.classList.add('active');
    });
    renderShopItems();
}

function renderShopItems() {
    const container = document.getElementById('shop-items');
    container.innerHTML = '';

    // ---- VIP tab ----
    if (currentShopTab === 'vip') {
        const unlocked = state.vipUnlocked;
        const botPct   = Math.min(100, (state.botKills / 1000000) * 100).toFixed(2);
        const playerOk = state.playerKills >= 1;

        // Top banner — progress if locked, welcome if unlocked
        const banner = document.createElement('div');
        if (!unlocked) {
            banner.className = 'vip-header vip-header-locked';
            banner.innerHTML = `
                <div class="vip-banner-title">🔒 VIP — Locked &nbsp;|&nbsp; Complete both challenges to unlock purchasing</div>
                <div class="vip-banner-reqs">
                    <div class="vip-req ${state.botKills >= 1000000 ? 'vip-req-done' : ''}">
                        <span>☠️ Bot kills: <strong>${state.botKills.toLocaleString()}</strong> / 1,000,000</span>
                        <div class="vip-bar-wrap"><div class="vip-bar" style="width:${botPct}%"></div></div>
                    </div>
                    <div class="vip-req ${playerOk ? 'vip-req-done' : ''}">
                        <span>🧑 Player kills: <strong>${state.playerKills}</strong> / 1</span>
                        <div class="vip-bar-wrap"><div class="vip-bar vip-bar-player" style="width:${playerOk ? 100 : 0}%"></div></div>
                    </div>
                </div>`;
        } else {
            banner.className = 'vip-header';
            banner.innerHTML = `💠 Welcome, VIP. You've earned your place here. &nbsp;|&nbsp; 🥇 Gold: <strong>${state.gold.toLocaleString()}</strong>`;
        }
        container.appendChild(banner);

        // Render all 5 leagues
        const leagueNames = ['', '🥉 League 1 — Bronze VIP', '🥈 League 2 — Silver VIP', '🥇 League 3 — Gold VIP', '💿 League 4 — Platinum VIP', '💎 League 5 — Diamond VIP · GOD TIER'];
        const leagueColors = ['', '#cd7f32', '#aaa', '#ffd700', '#a0c4ff', '#e0aaff'];
        let lastLeague = 0;

        shopData.vip.forEach(item => {
            // League header
            if (item.league !== lastLeague) {
                lastLeague = item.league;
                const lh = document.createElement('div');
                lh.className = 'vip-league-header';
                lh.style.borderColor = leagueColors[item.league];
                lh.style.color = leagueColors[item.league];
                lh.textContent = leagueNames[item.league];
                container.appendChild(lh);
            }

            const owned  = state.ownedItems.includes(item.id);
            const free   = item.price === 0;
            const locked = !unlocked;
            const div = document.createElement('div');
            div.className = 'shop-item vip-item' + (owned ? ' owned' : '') + (locked ? ' vip-item-locked' : '');
            div.innerHTML = `
                ${locked ? `<div class="vip-item-lock-overlay">🔒</div>` : ''}
                <div class="shop-item-icon">${item.icon}</div>
                <div class="shop-item-name">${item.name}</div>
                <div class="shop-item-effect">${item.effect}</div>
                ${owned
                    ? `<div class="shop-item-owned">Owned ✓</div>`
                    : locked
                        ? `<div class="shop-item-price vip-locked-price">${free ? 'FREE' : '🥇 ' + item.price.toLocaleString()} — Unlock VIP</div>`
                        : free
                            ? `<div class="shop-item-price vip-free-price">FREE 💠</div>`
                            : `<div class="shop-item-price vip-coin-price">🥇 ${item.price.toLocaleString()}</div>`
                }`;
            if (!locked) div.addEventListener('click', () => buyVipItem(item));
            else div.addEventListener('click', () => alert('🔒 Unlock VIP first!\n☠️ Kill 1,000,000 bots and 1 player.'));
            container.appendChild(div);
        });
        return;
    }

    const items = shopData[currentShopTab];

    if (currentShopTab === 'premium') {
        const header = document.createElement('div');
        header.className = 'premium-header';
        header.innerHTML = `<span>💎 Premium items cost diamonds — earn 5 💎 per kill! &nbsp;|&nbsp; 100 💎 items &amp; 1000 💎 legendary items</span>`;
        container.appendChild(header);
    }

    items.forEach(item => {
        const owned = state.ownedItems.includes(item.id);
        const isPremium = currentShopTab === 'premium';
        let statusLabel = '';
        if (owned) {
            if (currentShopTab === 'weapons' && state.equippedWeapon === item.id) statusLabel = 'Equipped ✓';
            else if (currentShopTab === 'skins' && state.equippedSkin === item.id) statusLabel = 'Equipped ✓';
            else if (currentShopTab === 'gear' && state.equippedGear.includes(item.id)) statusLabel = 'Equipped ✓';
            else if (currentShopTab === 'powers') statusLabel = 'Active ✓';
            else statusLabel = 'Owned ✓';
        }
        const div = document.createElement('div');
        div.className = 'shop-item' + (owned ? ' owned' : '') + (isPremium ? ' premium-item' : '');
        div.innerHTML = `
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-name">${item.name}</div>
            ${item.effect ? `<div class="shop-item-effect">${item.effect}</div>` : ''}
            ${owned
                ? `<div class="shop-item-owned">${statusLabel}</div>`
                : isPremium
                    ? `<div class="shop-item-price diamond-price">💎 ${item.diamondPrice}</div>`
                    : `<div class="shop-item-price">🪙 ${item.price}</div>`
            }
        `;
        div.addEventListener('click', () => buyItem(item));
        container.appendChild(div);
    });
}

function buyItem(item) {
    if (state.ownedItems.includes(item.id)) {
        if (currentShopTab === 'weapons') state.equippedWeapon = item.id;
        if (currentShopTab === 'skins') state.equippedSkin = item.id;
        if (currentShopTab === 'gear') {
            if (state.equippedGear.includes(item.id)) {
                state.equippedGear = state.equippedGear.filter(g => g !== item.id);
            } else {
                state.equippedGear.push(item.id);
            }
        }
        saveState();
        renderShopItems();
        return;
    }
    if (currentShopTab === 'premium') {
        if (state.diamonds >= item.diamondPrice) {
            state.diamonds -= item.diamondPrice;
            state.ownedItems.push(item.id);
            updateShopCoins();
            updateCoinsDisplay();
            renderShopItems();
        } else {
            alert('Not enough diamonds! 💎 Kill enemies to earn diamonds.');
        }
        return;
    }
    if (state.coins >= item.price) {
        state.coins -= item.price;
        state.ownedItems.push(item.id);
        if (currentShopTab === 'weapons') state.equippedWeapon = item.id;
        if (currentShopTab === 'skins') state.equippedSkin = item.id;
        if (currentShopTab === 'gear') state.equippedGear.push(item.id);
        updateShopCoins();
        updateCoinsDisplay();
        renderShopItems();
    } else {
        alert('Not enough coins!');
    }
}

function buyVipItem(item) {
    if (state.ownedItems.includes(item.id)) return;
    if (item.price === 0) {
        state.ownedItems.push(item.id);
        saveState();
        updateShopCoins();
        renderShopItems();
        return;
    }
    if (state.gold >= item.price) {
        state.gold -= item.price;
        state.ownedItems.push(item.id);
        saveState();
        updateShopCoins();
        renderShopItems();
    } else {
        alert('Not enough gold! 🥇 Kill enemies to earn gold.');
    }
}

// ==================== INVENTORY ====================
function renderInventory() {
    document.getElementById('inv-coins').textContent = state.coins;

    const sections = [
        { gridId: 'inv-weapons', category: 'weapons', getEquipped: item => item.id === state.equippedWeapon },
        { gridId: 'inv-items',   category: 'items',   getEquipped: () => false },
        { gridId: 'inv-gear',    category: 'gear',    getEquipped: item => state.equippedGear.includes(item.id) },
        { gridId: 'inv-powers',  category: 'powers',  getEquipped: () => true },
        { gridId: 'inv-skins',   category: 'skins',   getEquipped: item => item.id === state.equippedSkin },
    ];

    for (const sec of sections) {
        const grid = document.getElementById(sec.gridId);
        grid.innerHTML = '';
        const owned = shopData[sec.category].filter(item => state.ownedItems.includes(item.id));

        if (owned.length === 0) {
            grid.innerHTML = '<div class="inv-empty">Nothing here yet — visit the Shop!</div>';
            continue;
        }

        for (const item of owned) {
            const isEquipped = sec.getEquipped(item);
            const card = document.createElement('div');
            card.className = 'inv-card' + (isEquipped ? ' equipped' : '');
            card.innerHTML = `
                <div class="inv-card-icon">${item.icon}</div>
                <div class="inv-card-name">${item.name}</div>
                ${item.effect ? `<div class="inv-card-name" style="color:#aaa;font-size:10px">${item.effect}</div>` : ''}
                ${isEquipped ? '<div class="inv-card-badge">Active</div>' : ''}
            `;
            grid.appendChild(card);
        }
    }
}

// ==================== PAUSE BACKGROUND ANIMATION ====================
let pauseAnimId;
const pauseFire = [];
let carX = -400;
let wheelAngle = 0;

function startPauseAnimation() {
    const c = document.getElementById('pause-bg-canvas');
    c.width = c.offsetWidth || window.innerWidth;
    c.height = c.offsetHeight || window.innerHeight;
    pauseFire.length = 0;
    carX = -400;
    wheelAngle = 0;
    animatePauseBg();
}

function stopPauseAnimation() {
    cancelAnimationFrame(pauseAnimId);
}

function spawnFlame(c, x, count, big) {
    for (let i = 0; i < count; i++) {
        pauseFire.push({
            x: x + (Math.random() - 0.5) * 40,
            y: c.height + 5,
            vx: (Math.random() - 0.5) * 1.8,
            vy: -(big ? 3 : 1.5) - Math.random() * (big ? 4 : 3),
            life: 0.7 + Math.random() * 0.3,
            size: (big ? 18 : 8) + Math.random() * (big ? 22 : 12),
        });
    }
}

function animatePauseBg() {
    const c = document.getElementById('pause-bg-canvas');
    if (!c) return;
    const cx = c.getContext('2d');
    const w = c.width;
    const h = c.height;
    const t = Date.now() / 1000;

    cx.clearRect(0, 0, w, h);

    // Ground fire across the bottom third
    for (let fx = 0; fx < w; fx += 28) spawnFlame(c, fx + Math.random() * 28, 1, false);

    // Exhaust flames trailing behind the car (left side since car moves right)
    const carY = h * 0.42 + Math.sin(t * 1.6) * 20;
    // tilt = derivative of carY — nose up when climbing, nose down when diving
    const tilt = Math.cos(t * 1.6) * 0.18;
    for (let i = 0; i < 6; i++) {
        pauseFire.push({
            x: carX - 10 + (Math.random() - 0.5) * 12,
            y: carY - 20 + (Math.random() - 0.5) * 10,
            vx: -3 - Math.random() * 4,
            vy: (Math.random() - 0.5) * 1.5,
            life: 0.6 + Math.random() * 0.3,
            size: 14 + Math.random() * 18,
        });
    }

    // Draw fire particles
    for (let i = pauseFire.length - 1; i >= 0; i--) {
        const p = pauseFire[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.022;
        if (p.life <= 0) { pauseFire.splice(i, 1); continue; }
        const r = p.size * p.life;
        const grad = cx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        grad.addColorStop(0,    `rgba(255,255,200,${p.life})`);
        grad.addColorStop(0.25, `rgba(255,180,0,${p.life * 0.95})`);
        grad.addColorStop(0.6,  `rgba(220,40,0,${p.life * 0.7})`);
        grad.addColorStop(1,    'rgba(80,0,0,0)');
        cx.fillStyle = grad;
        cx.beginPath();
        cx.arc(p.x, p.y, r, 0, Math.PI * 2);
        cx.fill();
    }

    // Move car
    carX += 2.8;
    wheelAngle = carX / 28;
    if (carX > w + 50) carX = -400;

    drawLamborghini(cx, carX, carY, wheelAngle, tilt);

    pauseAnimId = requestAnimationFrame(animatePauseBg);
}

function drawLamborghini(cx, x, y, wa, tilt) {
    cx.save();
    // Pivot around center of car for tilt
    cx.translate(x + 154, y);
    cx.rotate(tilt);
    cx.translate(-(x + 154), -y);

    // Flying glow beneath car
    const glow = cx.createRadialGradient(x + 154, y + 30, 0, x + 154, y + 50, 160);
    glow.addColorStop(0, 'rgba(255,100,0,0.35)');
    glow.addColorStop(1, 'rgba(255,50,0,0)');
    cx.fillStyle = glow;
    cx.fillRect(x - 20, y - 10, 370, 120);

    // Main body
    cx.fillStyle = '#0a0a0a';
    cx.beginPath();
    cx.moveTo(x,       y);
    cx.lineTo(x + 20,  y - 22);
    cx.lineTo(x + 50,  y - 42);
    cx.lineTo(x + 80,  y - 55);
    cx.lineTo(x + 110, y - 65);
    cx.lineTo(x + 150, y - 78);
    cx.lineTo(x + 200, y - 78);
    cx.lineTo(x + 240, y - 62);
    cx.lineTo(x + 270, y - 44);
    cx.lineTo(x + 295, y - 26);
    cx.lineTo(x + 308, y);
    cx.closePath();
    cx.fill();

    // ---- FLAME STICKERS ----
    // Front flame sticker (near front bumper)
    function drawFlameSicker(fx, fy, scale, flip) {
        cx.save();
        cx.translate(fx, fy);
        if (flip) cx.scale(-1, 1);
        cx.scale(scale, scale);
        for (let fi = 0; fi < 3; fi++) {
            const ox = fi * 11;
            const colors = [['#ff2200','#ff6600','#ffcc00'],['#ff4400','#ff8800','#ffee00'],['#ff0000','#ff5500','#ffbb00']];
            const [c1, c2, c3] = colors[fi];
            cx.fillStyle = c1;
            cx.beginPath();
            cx.moveTo(ox,      0);
            cx.bezierCurveTo(ox - 5, -10, ox + 2,  -22, ox,     -30);
            cx.bezierCurveTo(ox + 4, -18, ox + 10, -25, ox + 8, -35);
            cx.bezierCurveTo(ox + 6, -20, ox + 14, -14, ox + 10,  0);
            cx.closePath();
            cx.fill();
            // Inner glow
            cx.fillStyle = c3;
            cx.beginPath();
            cx.moveTo(ox + 3,  -4);
            cx.bezierCurveTo(ox + 2, -12, ox + 5, -18, ox + 4, -24);
            cx.bezierCurveTo(ox + 6, -16, ox + 9, -18, ox + 7,  -4);
            cx.closePath();
            cx.fill();
        }
        cx.restore();
    }

    // Front door flame
    drawFlameSicker(x + 60,  y - 2,  1.1, false);
    // Mid body flame (larger)
    drawFlameSicker(x + 130, y - 2,  1.3, false);
    // Rear flame (flipped for symmetry)
    drawFlameSicker(x + 220, y - 2,  1.0, true);

    // Body panel line
    cx.strokeStyle = '#1e1e1e';
    cx.lineWidth = 1.5;
    cx.beginPath();
    cx.moveTo(x + 50, y - 42);
    cx.lineTo(x + 270, y - 38);
    cx.stroke();

    // Orange racing stripe
    cx.strokeStyle = '#ff5500';
    cx.lineWidth = 3;
    cx.shadowColor = '#ff7700';
    cx.shadowBlur = 10;
    cx.beginPath();
    cx.moveTo(x + 55, y - 46);
    cx.lineTo(x + 265, y - 42);
    cx.stroke();
    cx.shadowBlur = 0;

    // Windshield
    cx.fillStyle = 'rgba(80,180,255,0.28)';
    cx.beginPath();
    cx.moveTo(x + 110, y - 65);
    cx.lineTo(x + 150, y - 78);
    cx.lineTo(x + 168, y - 76);
    cx.lineTo(x + 125, y - 62);
    cx.closePath();
    cx.fill();

    // Rear window
    cx.beginPath();
    cx.moveTo(x + 200, y - 78);
    cx.lineTo(x + 240, y - 62);
    cx.lineTo(x + 222, y - 64);
    cx.lineTo(x + 188, y - 76);
    cx.closePath();
    cx.fill();

    // Spoiler
    cx.fillStyle = '#111';
    cx.fillRect(x + 270, y - 62, 7, 22);
    cx.fillRect(x + 256, y - 66, 34, 7);
    cx.fillStyle = '#ff5500';
    cx.fillRect(x + 256, y - 68, 34, 3);

    // Headlights
    cx.fillStyle = '#ffffaa';
    cx.shadowColor = '#ffff00';
    cx.shadowBlur = 14;
    cx.beginPath();
    cx.moveTo(x + 22, y - 18);
    cx.lineTo(x + 48, y - 30);
    cx.lineTo(x + 48, y - 22);
    cx.lineTo(x + 22, y - 12);
    cx.closePath();
    cx.fill();

    // Taillights
    cx.fillStyle = '#ff2200';
    cx.shadowColor = '#ff0000';
    cx.shadowBlur = 16;
    cx.beginPath();
    cx.moveTo(x + 290, y - 18);
    cx.lineTo(x + 265, y - 30);
    cx.lineTo(x + 265, y - 22);
    cx.lineTo(x + 290, y - 12);
    cx.closePath();
    cx.fill();
    cx.shadowBlur = 0;

    // Wheels (spinning)
    function drawWheel(wx, wy) {
        const R = 28, r = 18;
        cx.fillStyle = '#111';
        cx.beginPath();
        cx.arc(wx, wy, R, 0, Math.PI * 2);
        cx.fill();
        cx.strokeStyle = '#333';
        cx.lineWidth = 4;
        cx.stroke();
        cx.fillStyle = '#888';
        cx.beginPath();
        cx.arc(wx, wy, r, 0, Math.PI * 2);
        cx.fill();
        cx.strokeStyle = '#bbb';
        cx.lineWidth = 2.5;
        for (let i = 0; i < 5; i++) {
            const a = wa + (i / 5) * Math.PI * 2;
            cx.beginPath();
            cx.moveTo(wx + Math.cos(a) * 5,  wy + Math.sin(a) * 5);
            cx.lineTo(wx + Math.cos(a) * r, wy + Math.sin(a) * r);
            cx.stroke();
        }
        cx.fillStyle = '#ff5500';
        cx.beginPath();
        cx.arc(wx, wy, 5, 0, Math.PI * 2);
        cx.fill();
    }

    drawWheel(x + 72,  y + 8);
    drawWheel(x + 232, y + 8);

    cx.restore();
}

// ==================== PAUSE & GAME INVENTORY ====================
let gamePaused = false;

function togglePause() {
    if (!gameRunning) return;
    gamePaused = !gamePaused;
    if (gamePaused) {
        cancelAnimationFrame(animationFrameId);
        renderGameInventory();
        document.getElementById('pause-overlay').classList.remove('hidden');
        startPauseAnimation();
    } else {
        stopPauseAnimation();
        document.getElementById('pause-overlay').classList.add('hidden');
        gameLoop();
    }
}

function renderGameInventory() {
    const grid = document.getElementById('game-inv-grid');
    grid.innerHTML = '';
    if (state.gameInventory.length === 0) {
        grid.innerHTML = '<div class="inv-empty" style="padding:16px">No items collected yet! Pick up items on the battlefield.</div>';
        return;
    }
    const counts = {};
    for (const item of state.gameInventory) counts[item.id] = (counts[item.id] || 0) + 1;
    const shown = new Set();
    for (const item of state.gameInventory) {
        if (shown.has(item.id)) continue;
        shown.add(item.id);
        const card = document.createElement('div');
        card.className = 'game-inv-card';
        card.innerHTML = `
            <div class="inv-card-icon">${item.icon}</div>
            <div class="inv-card-name">${item.name}</div>
            <div class="inv-card-badge">x${counts[item.id]}</div>
            <button class="btn btn-small btn-green" onclick="useGameItem('${item.id}')">Use</button>
        `;
        grid.appendChild(card);
    }
}

function useGameItem(id) {
    const idx = state.gameInventory.findIndex(i => i.id === id);
    if (idx === -1) return;
    state.gameInventory.splice(idx, 1);

    const player = entities[0];
    if (!player || player.dead) { renderGameInventory(); return; }

    if (id === 'potion') player.health = Math.min(player.maxHealth, player.health + 30);
    if (id === 'apple')  player.health = Math.min(player.maxHealth, player.health + 50);
    if (id === 'star')   player.hitCooldown = 300;
    if (id === 'bomb') {
        for (const e of entities) {
            if (e === player || e.dead) continue;
            const dist = Math.sqrt((e.x - player.x) ** 2 + (e.y - player.y) ** 2);
            if (dist < 150) e.takeDamage(30, player);
        }
        for (let i = 0; i < 20; i++) {
            particles.push({ x: player.x + player.width / 2, y: player.y + player.height / 2,
                vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12,
                life: 30, color: '#ff6600', size: 4 + Math.random() * 5 });
        }
    }
    if (id === 'banana') {
        const groundY = canvas.height - GROUND_Y_OFFSET;
        items_on_ground.push({ x: player.x + player.width / 2, y: groundY - 15,
            icon: '🍌', type: 'trap', trapOwner: player, collected: false, isTrap: true, bobOffset: 0 });
    }
    if (id === 'heart') player.health = Math.min(player.maxHealth, player.health + 20);
    if (id === 'charm') { player.hitCooldown = 120; showAbilityPopup('🪬 Protected! Next hit blocked!'); }
    if (id === 'crystal') { player.health = Math.min(player.maxHealth, player.health + 10); showAbilityPopup('🔮 Crystal Ball! +10 HP & enemies revealed!'); }
    if (id === 'mushroom') {
        state.premMushroomActive = true;
        state.premMushroomTimer = 600;
        showAbilityPopup('🍄 Power Mushroom! +50% damage for 10s!');
    }
    if (id === 'pill') {
        state.premPillActive = true;
        state.premPillTimer = 600;
        showAbilityPopup('💊 Speed Pill! 1.6x speed for 10s!');
    }
    if (id === 'icecube') {
        let nearest = null, minDist = Infinity;
        for (const e of entities) {
            if (e === player || e.dead) continue;
            const d = Math.sqrt((e.x-player.x)**2 + (e.y-player.y)**2);
            if (d < minDist) { minDist = d; nearest = e; }
        }
        if (nearest) { nearest.frozen = true; nearest.frozenTimer = 300; showAbilityPopup('🧊 Frozen! Enemy stuck for 5s!'); }
    }
    if (id === 'firecracker') {
        for (const e of entities) {
            if (e === player || e.dead) continue;
            const dist = Math.sqrt((e.x-player.x)**2 + (e.y-player.y)**2);
            if (dist < 130) e.takeDamage(20, player);
        }
        for (let i = 0; i < 15; i++) {
            particles.push({ x: player.x+player.width/2, y: player.y+player.height/2,
                vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10,
                life: 25, color: Math.random()<0.5 ? '#ff4400' : '#ffcc00', size: 3+Math.random()*5 });
        }
        showAbilityPopup('🧨 Firecracker! Pop!');
    }
    if (id === 'dagger') {
        let nearest = null, minDist = Infinity;
        for (const e of entities) {
            if (e === player || e.dead) continue;
            const d = Math.sqrt((e.x-player.x)**2 + (e.y-player.y)**2);
            if (d < minDist) { minDist = d; nearest = e; }
        }
        if (nearest) { nearest.takeDamage(35, player); showAbilityPopup('🗡️ Dagger thrown! 35 damage!'); }
    }
    if (id === 'bullseye') {
        let nearest = null, minDist = Infinity;
        for (const e of entities) {
            if (e === player || e.dead) continue;
            const d = Math.sqrt((e.x-player.x)**2 + (e.y-player.y)**2);
            if (d < minDist) { minDist = d; nearest = e; }
        }
        if (nearest) { nearest.takeDamage(25, player); showAbilityPopup('🎯 Target locked! 25 damage!'); }
    }
    if (id === 'vortex') {
        for (const e of entities) {
            if (e === player || e.dead) continue;
            const dx = e.x - player.x;
            const dy = e.y - player.y;
            const dist = Math.sqrt(dx*dx + dy*dy) || 1;
            e.vx += (dx / dist) * 18;
            e.vy += (dy / dist) * 14;
        }
        showAbilityPopup('🌀 Vortex! Enemies blasted away!');
    }
    renderGameInventory();
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

// ==================== CUSTOM GAME CONFIG ====================
const customGame = {
    botCount: 3,
    playerCount: 1,
    difficulty: 'normal',
    mode: 'freeforall',
};

function diffMult() {
    return { easy: 0.5, normal: 1, hard: 1.6, extreme: 2.5 }[customGame.difficulty] || 1;
}

// ==================== SECRET SPACE BUTTON ====================
let abductionBeams = []; // active alien beam animations

// ==================== RANDOM EVENTS ====================
let activeEvent      = null;
let eventCooldown    = 1200; // first event ~20s in
let eventAnnounceText  = '';
let eventAnnounceColor = '#fff';
let eventAnnounceTimer = 0;

// ==================== HIDE AND SEEK ====================
let hsHouses = [];
let hsPhase = 'counting'; // 'counting' | 'seeking' | 'ended'
let hsCountFrames = 0;
const HS_COUNT_SECONDS = 10;
let hsTotalHiders = 0;
let hsFoundCount = 0;

function updateSecretBtn() {
    const btn = document.getElementById('secret-space-btn');
    if (!btn) return;
    if (state.gameMode === 'space' && gameRunning && !gamePaused) {
        const botsAlive = entities.filter(e => !e.isPlayer && !e.dead).length;
        btn.style.display = botsAlive > 0 ? 'block' : 'none';
    } else {
        btn.style.display = 'none';
    }
}

function triggerAlienAbduction() {
    const bots = entities.filter(e => !e.isPlayer && !e.dead);
    if (bots.length === 0) return;
    document.getElementById('secret-space-btn').style.display = 'none';

    for (const bot of bots) {
        abductionBeams.push({
            x: bot.x + bot.width / 2,
            targetBot: bot,
            y: 0,
            alpha: 1,
            done: false,
            timer: 0,
        });
    }
}

document.getElementById('secret-space-btn').addEventListener('click', triggerAlienAbduction);
document.getElementById('secret-space-btn').addEventListener('touchstart', (e) => {
    triggerAlienAbduction();
    e.preventDefault();
}, { passive: false });

// Colors for different players
const PLAYER_COLORS = ['#2ecc71','#e74c3c','#3498db','#f1c40f','#9b59b6','#1abc9c','#e67e22','#e91e63','#00bcd4','#ff5722'];

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
        this.jumpsLeft = 0;
        this.botCoins = isPlayer ? 0 : Math.floor(Math.random() * 51) + 10;
        this.botDiamonds = isPlayer ? 0 : Math.floor(Math.random() * 5) + 1;
        this.spawnTime = Date.now();
        this.walkFrame = 0;
        this.walkTimer = 0;
        this.frozen = false;
        this.frozenTimer = 0;
        this.team = 'hero';   // 'hero' or 'boss'
        this.isBoss = false;
        this.hsIsSeeker   = false;
        this.hsHiding     = false;
        this.hsHouse      = null;
        this.hsTargetHouse = null;

        // AI stuff
        this.aiTarget = null;
        this.aiTimer = 0;
        this.aiAction = 'idle';

        // Bot type
        this.botType = 'normal'; // 'normal' | 'berserker' | 'tank' | 'ninja' | 'coward' | 'trickster'
        this.dashCooldown = 0;
        this.trapCooldown = 0;
        this.circleDir = Math.random() < 0.5 ? 1 : -1;
    }

    _grav() {
        if (activeEvent && activeEvent.type === 'gravity') return GRAVITY * -1.5;
        return state.gameMode === 'space' ? GRAVITY * 0.28 : GRAVITY;
    }

    update(groundY) {
        if (this.dead) return;

        // Frozen: barely move, decrement timer
        if (this.frozen) {
            this.frozenTimer--;
            if (this.frozenTimer <= 0) this.frozen = false;
            this.vx *= 0.2;
            this.vy += this._grav();
            if (this.y + this.height > groundY) { this.y = groundY - this.height; this.vy = 0; this.onGround = true; }
            if (this.attackCooldown > 0) this.attackCooldown--;
            if (this.hitCooldown > 0) this.hitCooldown--;
            return;
        }

        // Hide and seek: hiding in house — skip all physics
        if (this.hsHiding) {
            if (this.attackCooldown > 0) this.attackCooldown--;
            if (this.hitCooldown > 0) this.hitCooldown--;
            return;
        }

        // Angel flight — cancel most gravity for player
        if (this.isPlayer && state.premAngelActive) this.vy -= this._grav() * 1.4;

        // Gravity
        this.vy += this._grav();

        // Move
        this.x += this.vx;
        this.y += this.vy;

        // Ground collision
        if (this.y + this.height > groundY) {
            this.y = groundY - this.height;
            this.vy = 0;
            this.onGround = true;
            if (this.isPlayer) this.jumpsLeft = 0;
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
                if (this.isPlayer) this.jumpsLeft = 0;
            }
        }

        // Hide and seek: seeker is blocked by house walls
        if (state.gameMode === 'hideseek' && this.hsIsSeeker) {
            for (const house of hsHouses) {
                const hbx = house.x, hby = house.y + 22, hbw = house.w, hbh = house.h - 22;
                if (this.x + this.width > hbx && this.x < hbx + hbw &&
                    this.y + this.height > hby && this.y < hby + hbh) {
                    const ol = this.x + this.width - hbx;
                    const or2 = hbx + hbw - this.x;
                    const ot = this.y + this.height - hby;
                    const ob = hby + hbh - this.y;
                    const mn = Math.min(ol, or2, ot, ob);
                    if (mn === ol)       { this.x = hbx - this.width; this.vx = 0; }
                    else if (mn === or2) { this.x = hbx + hbw;        this.vx = 0; }
                    else if (mn === ot)  { this.y = hby - this.height; this.vy = 0; this.onGround = true; }
                    else                 { this.y = hby + hbh;         this.vy = 0.5; }
                }
            }
        }

        // Hide and seek: hider auto-enters house when close to door
        if (state.gameMode === 'hideseek' && !this.hsIsSeeker && !this.hsHiding && this.hsTargetHouse && this.onGround) {
            const house = this.hsTargetHouse;
            if (house.hiders.length < house.maxHiders) {
                const doorCX = house.x + house.w / 2;
                if (Math.abs(this.x + this.width / 2 - doorCX) < 40) {
                    this.hsHiding = true;
                    this.hsHouse  = house;
                    house.hiders.push(this);
                }
            }
        }

        // Wall bounds (ghost mode phases through)
        if (!this.isPlayer || !state.premGhostActive) {
            if (this.x < 0) this.x = 0;
            if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
        }

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
        const range = this.isBoss ? 140 : weapon.range;
        let damage = this.isBoss ? 40 : weapon.damage;
        if (!this.isPlayer && !this.isBoss) damage = Math.floor(damage * diffMult()); // bots scale with difficulty
        if (this.isPlayer) {
            if (state.equippedGear.includes('gloves')) damage = Math.floor(damage * 1.25);
            if (state.ownedItems.includes('rage') && this.health < this.maxHealth * 0.3) damage = Math.floor(damage * 1.5);
            if (state.premBeastActive) damage = Math.floor(damage * 2);
            if (state.premMushroomActive) damage = Math.floor(damage * 1.5);
        }

        // Check hits
        let hitCount = 0;
        for (const other of entities) {
            if (other === this || other.dead) continue;
            const dx = other.x + other.width / 2 - (this.x + this.width / 2);
            const dy = other.y + other.height / 2 - (this.y + this.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < range + 20 && Math.sign(dx) === this.facing) {
                other.takeDamage(damage, this);
                hitCount++;
            }
        }
        // Vampire Bite: steal 20 HP per hit
        if (this.isPlayer && hitCount > 0 && state.ownedItems.includes('prem_vampire')) {
            this.health = Math.min(this.maxHealth, this.health + 20 * hitCount);
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
        if (this.hsHiding) return; // safe inside house
        // No friendly fire — same team can't hurt each other
        if (attacker && attacker.team === this.team) return;
        // Ghost mode: fully immune
        if (this.isPlayer && state.premGhostActive) return;
        if (this.isPlayer) {
            if (state.equippedGear.includes('helmet')) amount = Math.floor(amount * 0.8);
            if (state.equippedGear.includes('armor')) amount = Math.floor(amount * 0.65);
            if (state.ownedItems.includes('prem_titan')) amount = Math.floor(amount * 0.4);
        }
        // Tank: heavy armor — takes 45% damage
        if (!this.isPlayer && this.botType === 'tank') amount = Math.floor(amount * 0.45);
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
        // Phoenix Rebirth — revive before dying
        if (this.isPlayer && state.ownedItems.includes('prem_phoenix') && !state.premPhoenixUsed) {
            state.premPhoenixUsed = true;
            this.health = this.maxHealth;
            this.hitCooldown = 80;
            for (let i = 0; i < 25; i++) {
                particles.push({ x: this.x + this.width/2, y: this.y + this.height/2,
                    vx: (Math.random()-0.5)*12, vy: (Math.random()-0.5)*12,
                    life: 50, color: Math.random() < 0.5 ? '#ff6600' : '#ffcc00', size: 4+Math.random()*5 });
            }
            showAbilityPopup('🦅 Phoenix Rebirth! Revived with full HP!');
            return;
        }
        this.dead = true;

        // Hide and seek: no respawn, track found count
        if (state.gameMode === 'hideseek') {
            // Remove from house if they were hiding
            if (this.hsHouse) {
                const hi = this.hsHouse.hiders.indexOf(this);
                if (hi >= 0) this.hsHouse.hiders.splice(hi, 1);
                this.hsHouse = null;
            }
            // Death particles
            for (let i = 0; i < 20; i++) {
                particles.push({ x: this.x + this.width/2, y: this.y + this.height/2,
                    vx: (Math.random()-0.5)*10, vy: (Math.random()-0.5)*10,
                    life: 40, color: this.color, size: 3+Math.random()*5 });
            }
            if (!this.hsIsSeeker) {
                hsFoundCount++;
                showAbilityPopup('🔍 ' + this.name + ' found! (' + hsFoundCount + '/' + hsTotalHiders + ')');
                if (hsFoundCount >= hsTotalHiders) {
                    setTimeout(() => {
                        document.getElementById('gameover-title').textContent = '🔍 Seeker Wins! All Found!';
                        endGame();
                    }, 800);
                }
            } else {
                setTimeout(() => {
                    document.getElementById('gameover-title').textContent = '🙈 Hiders Win! Seeker out!';
                    endGame();
                }, 800);
            }
            return; // no respawn in hide & seek
        }

        // Boss mode: check win/lose condition
        if (state.gameMode === 'boss') {
            if (this.isBoss) {
                // Boss is dead — heroes win!
                for (let i = 0; i < 60; i++) {
                    particles.push({ x: this.x + this.width/2, y: this.y + this.height/2,
                        vx: (Math.random()-0.5)*20, vy: (Math.random()-0.5)*20,
                        life: 80, color: ['#ff0','#f80','#f00','#fff'][Math.floor(Math.random()*4)], size: 5+Math.random()*10 });
                }
                setTimeout(() => {
                    document.getElementById('gameover-title').textContent = '🏆 BOSS DEFEATED!';
                    endGame();
                }, 1200);
                return;
            }
            // A hero died — check if all heroes are dead
            const heroesAlive = entities.filter(e => !e.dead && e.team === 'hero');
            if (heroesAlive.length === 0) {
                setTimeout(() => {
                    document.getElementById('gameover-title').textContent = '💀 BOSS WINS!';
                    endGame();
                }, 800);
                return;
            }
        }

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
            // Track lifetime kills for VIP unlock
            if (this.isPlayer) {
                state.playerKills++;
            } else {
                state.botKills++;
            }
            // Check VIP unlock
            if (!state.vipUnlocked && state.botKills >= 1000000 && state.playerKills >= 1) {
                state.vipUnlocked = true;
                setTimeout(() => {
                    const popup = document.getElementById('kill-coins-popup');
                    popup.textContent = '💠 VIP UNLOCKED! Check the Shop!';
                    popup.style.opacity = '1';
                    popup.style.color = '#ffe066';
                    clearTimeout(popup._hideTimer);
                    popup._hideTimer = setTimeout(() => { popup.style.opacity = '0'; popup.style.color = ''; }, 4000);
                }, 500);
            }
            state.coins += 1;
            state.diamonds += 5;
            state.gold += 1;
            document.getElementById('kill-count').textContent = 'Kills: ' + state.kills;
            const popup = document.getElementById('kill-coins-popup');
            popup.textContent = '+1 🪙 +5 💎 +1 🥇';
            popup.style.opacity = '1';
            clearTimeout(popup._hideTimer);
            popup._hideTimer = setTimeout(() => popup.style.opacity = '0', 1200);
        }

        // Drop coins on death
        const groundY = canvas.height - GROUND_Y_OFFSET;
        if (this.isPlayer && state.coins > 0) {
            items_on_ground.push({
                x: this.x + this.width / 2,
                y: groundY - 20,
                icon: '💰',
                type: 'coins',
                amount: state.coins,
                collected: false,
                bobOffset: Math.random() * Math.PI * 2,
            });
            state.coins = 0;
        }
        if (!this.isPlayer && this.botCoins > 0) {
            items_on_ground.push({
                x: this.x + this.width / 2,
                y: groundY - 20,
                icon: '💰',
                type: 'coins',
                amount: this.botCoins,
                collected: false,
                bobOffset: Math.random() * Math.PI * 2,
            });
            this.botCoins = 0;
        }
        if (!this.isPlayer && this.botDiamonds > 0) {
            items_on_ground.push({
                x: this.x + this.width / 2 + 20,
                y: groundY - 20,
                icon: '💎',
                type: 'diamonds',
                amount: this.botDiamonds,
                collected: false,
                bobOffset: Math.random() * Math.PI * 2,
            });
            this.botDiamonds = 0;
        }

        // Respawn after 3 seconds (no respawn for heroes in boss mode)
        if (!(state.gameMode === 'boss' && this.team === 'hero')) {
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
    }

    runAI(groundY) {
        if (this.dead || this.isPlayer) return;

        // ---- Hide and Seek AI ----
        if (state.gameMode === 'hideseek') {
            if (this.hsIsSeeker) {
                if (hsPhase !== 'seeking') return;
                // Find nearest visible (non-hiding) hider
                const targets = entities.filter(e => e !== this && !e.dead && !e.hsIsSeeker && !e.hsHiding);
                if (targets.length > 0) {
                    const tgt = targets.reduce((a, b) =>
                        Math.abs(a.x - this.x) <= Math.abs(b.x - this.x) ? a : b);
                    const dx = tgt.x - this.x;
                    this.facing = dx > 0 ? 1 : -1;
                    this.vx += this.facing * 1.0;
                    if (Math.abs(dx) < 55) this.attack();
                    if (Math.random() < 0.025 && this.onGround) { this.vy = -12; this.onGround = false; }
                } else {
                    this.vx += (Math.random() - 0.5) * 2; // wander
                }
                const ms = 5 * diffMult();
                if (this.vx >  ms) this.vx =  ms;
                if (this.vx < -ms) this.vx = -ms;
                return;
            } else {
                // Hider AI
                if (this.hsHiding) return; // already safe
                // Pick nearest available house if none assigned
                if (!this.hsTargetHouse) {
                    const avail = hsHouses.filter(h => h.hiders.length < h.maxHiders);
                    if (avail.length > 0) {
                        this.hsTargetHouse = avail.reduce((a, b) =>
                            Math.abs(a.x + a.w / 2 - this.x) <= Math.abs(b.x + b.w / 2 - this.x) ? a : b);
                    }
                }
                if (this.hsTargetHouse) {
                    const tx = this.hsTargetHouse.x + this.hsTargetHouse.w / 2 - this.width / 2;
                    const dx = tx - this.x;
                    this.facing = dx > 0 ? 1 : -1;
                    this.vx += this.facing * 1.8;
                    const ms = 6;
                    if (this.vx >  ms) this.vx =  ms;
                    if (this.vx < -ms) this.vx = -ms;
                }
                return;
            }
        }

        // Decrement special cooldowns
        if (this.dashCooldown > 0) this.dashCooldown--;
        if (this.trapCooldown > 0) this.trapCooldown--;

        const dm = diffMult();
        const isExtreme = customGame.difficulty === 'extreme';
        const jumpV = state.gameMode === 'space' ? -7 : (this.isBoss ? -18 : -12);

        // ---- BOT TYPE AI ----
        const enemies = entities.filter(e => e !== this && !e.dead && e.team !== this.team);
        const nearest = enemies.length > 0 ? enemies.reduce((a, b) =>
            Math.hypot(a.x - this.x, a.y - this.y) <= Math.hypot(b.x - this.x, b.y - this.y) ? a : b) : null;

        if (this.botType === 'berserker') {
            // Always chases nearest enemy, gets faster/stronger at low HP
            if (nearest) {
                const rageBoost = this.health < this.maxHealth * 0.4 ? 2.0 : 1.0;
                const dx = nearest.x - this.x;
                this.facing = dx > 0 ? 1 : -1;
                this.vx += this.facing * 1.2 * dm * rageBoost;
                if (Math.abs(dx) < 65) this.attack();
                if (Math.random() < 0.025 && this.onGround) { this.vy = jumpV; this.onGround = false; }
            }
            const ms = isExtreme ? 1000 : 6 * dm * (this.health < this.maxHealth * 0.4 ? 1.8 : 1);
            if (this.vx > ms) this.vx = ms; if (this.vx < -ms) this.vx = -ms;
            return;
        }

        if (this.botType === 'tank') {
            // Slow but hits hard, always chases
            if (nearest) {
                const dx = nearest.x - this.x;
                this.facing = dx > 0 ? 1 : -1;
                this.vx += this.facing * 0.5 * dm; // slow
                if (Math.abs(dx) < 70) this.attack(); // big swing range
                if (Math.random() < 0.01 && this.onGround) { this.vy = jumpV * 0.8; this.onGround = false; }
            }
            const ms = isExtreme ? 500 : 3 * dm;
            if (this.vx > ms) this.vx = ms; if (this.vx < -ms) this.vx = -ms;
            return;
        }

        if (this.botType === 'ninja') {
            // Fast, dash attacks, random dodge jumps
            if (nearest) {
                const dx = nearest.x - this.x;
                const dist = Math.abs(dx);
                this.facing = dx > 0 ? 1 : -1;
                if (dist > 80) {
                    this.vx += this.facing * 1.5 * dm;
                } else {
                    // Dash attack when close and cooldown is ready
                    if (this.dashCooldown <= 0) {
                        this.vx = this.facing * 14;
                        this.dashCooldown = 90;
                    }
                    this.attack();
                }
                // Dodge jump randomly
                if (Math.random() < 0.04 * dm && this.onGround) { this.vy = jumpV; this.onGround = false; }
            }
            const ms = isExtreme ? 1000 : 8 * dm;
            if (this.vx > ms) this.vx = ms; if (this.vx < -ms) this.vx = -ms;
            return;
        }

        if (this.botType === 'coward') {
            // Runs away from nearby enemies, drops banana traps while fleeing
            if (nearest) {
                const dx = nearest.x - this.x;
                const dist = Math.hypot(nearest.x - this.x, nearest.y - this.y);
                this.facing = dx > 0 ? 1 : -1;
                if (dist < 200) {
                    // Flee!
                    this.vx -= this.facing * 1.5 * dm;
                    if (this.onGround && Math.random() < 0.04) { this.vy = jumpV; this.onGround = false; }
                    // Drop a banana trap
                    if (this.trapCooldown <= 0) {
                        items_on_ground.push({
                            x: this.x + this.width / 2,
                            y: groundY - 20,
                            icon: '🍌',
                            type: 'trap',
                            isTrap: true,
                            trapOwner: this,
                            collected: false,
                            bobOffset: 0,
                        });
                        this.trapCooldown = 180;
                    }
                } else {
                    // Wander if safe
                    this.vx += (Math.random() - 0.5) * 2 * dm;
                    if (Math.random() < 0.01 && this.onGround) { this.vy = jumpV; this.onGround = false; }
                }
            }
            const ms = isExtreme ? 1000 : 6 * dm;
            if (this.vx > ms) this.vx = ms; if (this.vx < -ms) this.vx = -ms;
            return;
        }

        if (this.botType === 'trickster') {
            // Circles enemies and places traps; unpredictable
            if (nearest) {
                const dx = nearest.x - this.x;
                const dist = Math.hypot(dx, nearest.y - this.y);
                this.facing = dx > 0 ? 1 : -1;
                if (dist < 150) {
                    // Circle around the target
                    this.vx += this.circleDir * 1.5 * dm;
                    if (Math.random() < 0.008) this.circleDir *= -1; // randomly reverse circle
                    if (Math.abs(dx) < 60) this.attack();
                    // Place trap randomly
                    if (this.trapCooldown <= 0 && Math.random() < 0.3) {
                        items_on_ground.push({
                            x: this.x + this.width / 2,
                            y: groundY - 20,
                            icon: '⚡',
                            type: 'trap',
                            isTrap: true,
                            trapOwner: this,
                            collected: false,
                            bobOffset: 0,
                        });
                        this.trapCooldown = 150;
                    }
                    if (Math.random() < 0.03 && this.onGround) { this.vy = jumpV; this.onGround = false; }
                } else {
                    this.vx += this.facing * 1.0 * dm;
                }
            }
            const ms = isExtreme ? 1000 : 5 * dm;
            if (this.vx > ms) this.vx = ms; if (this.vx < -ms) this.vx = -ms;
            return;
        }

        // ---- NORMAL AI (unchanged) ----
        this.aiTimer--;
        if (this.aiTimer <= 0) {
            this.aiTimer = 30 + Math.random() * 60;
            // Pick action
            const r = Math.random();
            if (r < 0.4) this.aiAction = 'chase';
            else if (r < 0.6) this.aiAction = 'wander';
            else if (r < 0.8) this.aiAction = 'jump';
            else this.aiAction = 'idle';

            // Pick target — only enemies (different team)
            const alive = entities.filter(e => e !== this && !e.dead && e.team !== this.team);
            if (alive.length > 0) {
                this.aiTarget = alive[Math.floor(Math.random() * alive.length)];
            }
        }

        // Boss always chases
        if (this.isBoss) this.aiAction = 'chase';

        if (this.aiAction === 'chase' && this.aiTarget && !this.aiTarget.dead) {
            const dx = this.aiTarget.x - this.x;
            this.facing = dx > 0 ? 1 : -1;
            if (isExtreme) {
                this.vx = this.facing * 1000;
            } else {
                this.vx += this.facing * (this.isBoss ? 1.4 : 0.8) * dm;
            }
            if (Math.abs(dx) < (this.isBoss ? 120 : 60)) {
                this.attack();
            }
            if (Math.random() < 0.02 * dm && this.onGround) {
                this.vy = jumpV;
                this.onGround = false;
            }
        } else if (this.aiAction === 'wander') {
            this.vx += (Math.random() - 0.5) * 1.5 * (isExtreme ? 200 : dm);
        } else if (this.aiAction === 'jump' && this.onGround) {
            this.vy = jumpV;
            this.onGround = false;
        }

        // Limit speed (scales with difficulty)
        const maxSpd = isExtreme ? 1000 : 5 * dm;
        if (this.vx > maxSpd) this.vx = maxSpd;
        if (this.vx < -maxSpd) this.vx = -maxSpd;
    }

    drawBoss() {
        const cx = ctx;
        const mx = this.x + this.width / 2;
        const by = 0;

        // Shadow
        cx.fillStyle = 'rgba(180,0,0,0.35)';
        cx.beginPath();
        cx.ellipse(mx, this.y + this.height + 4, this.width * 0.6, 10, 0, 0, Math.PI * 2);
        cx.fill();

        // Body
        const grad = cx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
        grad.addColorStop(0, '#8b0000');
        grad.addColorStop(0.5, '#cc0000');
        grad.addColorStop(1, '#550000');
        cx.fillStyle = grad;
        cx.strokeStyle = '#ff4400';
        cx.lineWidth = 3;
        cx.beginPath();
        cx.roundRect(this.x, this.y + 30, this.width, this.height - 30, 8);
        cx.fill(); cx.stroke();

        // Head
        cx.fillStyle = '#aa0000';
        cx.strokeStyle = '#ff4400';
        cx.lineWidth = 3;
        cx.beginPath();
        cx.arc(mx, this.y + 20, 28, 0, Math.PI * 2);
        cx.fill(); cx.stroke();

        // Horns
        cx.fillStyle = '#2a0000';
        cx.strokeStyle = '#ff4400';
        cx.lineWidth = 2;
        // Left horn
        cx.beginPath();
        cx.moveTo(mx - 18, this.y);
        cx.lineTo(mx - 30, this.y - 30);
        cx.lineTo(mx - 8, this.y - 5);
        cx.closePath(); cx.fill(); cx.stroke();
        // Right horn
        cx.beginPath();
        cx.moveTo(mx + 18, this.y);
        cx.lineTo(mx + 30, this.y - 30);
        cx.lineTo(mx + 8, this.y - 5);
        cx.closePath(); cx.fill(); cx.stroke();

        // Eyes — glowing red
        cx.fillStyle = '#ff0000';
        cx.shadowColor = '#ff0000';
        cx.shadowBlur = 12;
        cx.beginPath(); cx.arc(mx - 10, this.y + 15, 7, 0, Math.PI * 2); cx.fill();
        cx.beginPath(); cx.arc(mx + 10, this.y + 15, 7, 0, Math.PI * 2); cx.fill();
        cx.fillStyle = '#fff';
        cx.shadowBlur = 0;
        cx.beginPath(); cx.arc(mx - 10, this.y + 15, 3, 0, Math.PI * 2); cx.fill();
        cx.beginPath(); cx.arc(mx + 10, this.y + 15, 3, 0, Math.PI * 2); cx.fill();

        // Mouth
        cx.strokeStyle = '#ff4400';
        cx.lineWidth = 3;
        cx.beginPath();
        cx.arc(mx, this.y + 28, 12, 0.2, Math.PI - 0.2);
        cx.stroke();
        // Teeth
        cx.fillStyle = '#fff';
        for (let t = -1; t <= 1; t++) {
            cx.beginPath();
            cx.moveTo(mx + t * 7, this.y + 28);
            cx.lineTo(mx + t * 7 - 3, this.y + 36);
            cx.lineTo(mx + t * 7 + 3, this.y + 36);
            cx.closePath(); cx.fill();
        }

        // Arms
        cx.strokeStyle = '#cc0000';
        cx.lineWidth = 10;
        cx.lineCap = 'round';
        const armSwing = Math.abs(this.vx) > 0.5 ? Math.sin(this.walkFrame * Math.PI / 2) * 10 : 0;
        const atkSwing = this.attacking && this.facing === 1 ? -25 : 0;
        cx.beginPath();
        cx.moveTo(this.x + 5, this.y + 50);
        cx.lineTo(this.x - 20, this.y + 70 + armSwing);
        cx.stroke();
        cx.beginPath();
        cx.moveTo(this.x + this.width - 5, this.y + 50);
        cx.lineTo(this.x + this.width + 20, this.y + 70 - armSwing + atkSwing);
        cx.stroke();

        // Legs
        cx.strokeStyle = '#880000';
        cx.lineWidth = 12;
        const legSwing = Math.abs(this.vx) > 0.5 ? Math.sin(this.walkFrame * Math.PI / 2) * 12 : 0;
        cx.beginPath();
        cx.moveTo(mx - 14, this.y + this.height - 20);
        cx.lineTo(mx - 16, this.y + this.height + legSwing);
        cx.stroke();
        cx.beginPath();
        cx.moveTo(mx + 14, this.y + this.height - 20);
        cx.lineTo(mx + 16, this.y + this.height - legSwing);
        cx.stroke();

        // HP bar (large)
        const barW = this.width + 20, barH = 10;
        const barX = mx - barW / 2;
        const barY = this.y - 50;
        cx.fillStyle = '#333';
        cx.fillRect(barX, barY, barW, barH);
        const hp = this.health / this.maxHealth;
        cx.fillStyle = hp > 0.5 ? '#e74c3c' : hp > 0.25 ? '#e67e22' : '#ff0000';
        cx.shadowColor = '#ff0000';
        cx.shadowBlur = 8;
        cx.fillRect(barX, barY, barW * hp, barH);
        cx.shadowBlur = 0;
        cx.fillStyle = '#ff4';
        cx.font = 'bold 13px sans-serif';
        cx.textAlign = 'center';
        cx.fillText('👹 ' + this.name, mx, barY - 6);
    }

    draw() {
        if (this.dead) return;
        if (this.hsHiding) return; // safe inside house, not drawn
        if (this.isBoss) { this.drawBoss(); return; }

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

        // ---- SPACE MODE DRAW ----
        if (state.gameMode === 'space') {
            this.drawSpacesuit(bobY);
            ctx.globalAlpha = 1;
            return;
        }

        // Body — unicorn rainbow, frozen blue, beast red, ghost transparent
        let bodyColor = this.color;
        if (this.isPlayer && state.ownedItems.includes('prem_unicorn')) {
            bodyColor = `hsl(${(Date.now() / 8) % 360}, 100%, 60%)`;
        }
        if (this.frozen) bodyColor = '#aaddff';
        if (this.isPlayer && state.premBeastActive) bodyColor = '#ff2200';
        if (this.isPlayer && state.premGhostActive) ctx.globalAlpha = 0.4;

        ctx.fillStyle = bodyColor;
        const bodyX = this.x + 5;
        const bodyY = this.y + 20 + bobY;
        const bodyW = this.width - 10;
        const bodyH = this.height - 25;

        // Draw rounded body
        ctx.beginPath();
        ctx.roundRect(bodyX, bodyY, bodyW, bodyH, 8);
        ctx.fill();

        // Head
        ctx.fillStyle = bodyColor;
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + 14 + bobY, 14, 0, Math.PI * 2);
        ctx.fill();

        // Skin emoji face
        ctx.font = '20px serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.skin, this.x + this.width / 2, this.y + 20 + bobY);

        // Arms
        ctx.strokeStyle = bodyColor;
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
        ctx.strokeStyle = bodyColor;
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

        // Bot type badge
        if (!this.isPlayer && this.botType && this.botType !== 'normal') {
            const badges = { berserker: '🔥', tank: '🛡️', ninja: '🥷', coward: '💨', trickster: '🃏' };
            const badge = badges[this.botType] || '';
            ctx.font = '12px serif';
            ctx.fillText(badge, this.x + this.width / 2, this.y - 26);
            // Rage glow for berserker at low HP
            if (this.botType === 'berserker' && this.health < this.maxHealth * 0.4) {
                ctx.shadowColor = '#ff2200';
                ctx.shadowBlur = 14;
                ctx.strokeStyle = '#ff4400';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.roundRect(bodyX - 2, bodyY - 2, bodyW + 4, bodyH + 4, 10);
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    }

    drawSpacesuit(bobY) {
        const cx = ctx;
        const mx = this.x + this.width / 2;
        const by = bobY;
        const suitColor = this.isPlayer ? '#d0e8ff' : '#ccc';
        const accentColor = this.isPlayer ? '#3af' : '#888';

        const tx = this.x + 3;
        const tw = this.width - 6;
        const torsoTop = this.y + 26 + by;
        const torsoH = 24;

        // ---- O2 TANKS (behind body) ----
        cx.fillStyle = '#aaa';
        cx.strokeStyle = '#777';
        cx.lineWidth = 1.5;
        cx.beginPath();
        cx.roundRect(tx - 4, torsoTop + 4, 5, 14, 2);
        cx.fill(); cx.stroke();
        cx.beginPath();
        cx.roundRect(tx + tw - 1, torsoTop + 4, 5, 14, 2);
        cx.fill(); cx.stroke();

        // ---- HELMET ----
        cx.fillStyle = suitColor;
        cx.strokeStyle = accentColor;
        cx.lineWidth = 2.5;
        cx.beginPath();
        cx.arc(mx, this.y + 14 + by, 15, 0, Math.PI * 2);
        cx.fill(); cx.stroke();

        // Visor (dark face shield)
        cx.fillStyle = '#001833';
        cx.strokeStyle = accentColor;
        cx.lineWidth = 1.5;
        cx.beginPath();
        cx.ellipse(mx, this.y + 14 + by, 9, 7, 0, 0, Math.PI * 2);
        cx.fill(); cx.stroke();

        // Visor glare
        cx.fillStyle = 'rgba(100,200,255,0.35)';
        cx.beginPath();
        cx.ellipse(mx - 3, this.y + 10 + by, 3, 2, -0.5, 0, Math.PI * 2);
        cx.fill();

        // ---- TORSO ----
        cx.fillStyle = suitColor;
        cx.strokeStyle = accentColor;
        cx.lineWidth = 2;
        cx.beginPath();
        cx.roundRect(tx, torsoTop, tw, torsoH, 5);
        cx.fill(); cx.stroke();

        // Chest panel / logo
        cx.fillStyle = accentColor;
        cx.globalAlpha = 0.7;
        cx.beginPath();
        cx.roundRect(mx - 7, torsoTop + 5, 14, 10, 3);
        cx.fill();
        cx.globalAlpha = 1;
        cx.font = 'bold 8px sans-serif';
        cx.fillStyle = '#fff';
        cx.textAlign = 'center';
        cx.fillText('NASA', mx, torsoTop + 13);

        // ---- HIPS ----
        cx.fillStyle = '#9ab';
        cx.strokeStyle = accentColor;
        cx.lineWidth = 1.5;
        cx.beginPath();
        cx.roundRect(tx + 2, torsoTop + torsoH, tw - 4, 7, 3);
        cx.fill(); cx.stroke();

        // ---- LEGS ----
        const legTop = torsoTop + torsoH + 7;
        const legH = 16;
        const legW = (tw - 4) / 2 - 1;
        const legSwing = Math.abs(this.vx) > 0.5 ? Math.sin(this.walkFrame * Math.PI / 2) * 5 : 0;

        cx.fillStyle = suitColor;
        cx.strokeStyle = accentColor;
        cx.lineWidth = 1.5;
        // Left leg
        cx.beginPath();
        cx.roundRect(tx + 2, legTop - legSwing, legW, legH + legSwing, 3);
        cx.fill(); cx.stroke();
        // Right leg
        cx.beginPath();
        cx.roundRect(tx + 2 + legW + 2, legTop + legSwing, legW, legH - legSwing, 3);
        cx.fill(); cx.stroke();

        // Boots
        cx.fillStyle = '#445';
        cx.beginPath();
        cx.roundRect(tx,           legTop - legSwing  + legH + legSwing  - 4, legW + 4, 6, 2);
        cx.fill();
        cx.beginPath();
        cx.roundRect(tx + legW + 2, legTop + legSwing  + legH - legSwing  - 4, legW + 4, 6, 2);
        cx.fill();

        // ---- ARMS ----
        const armY = torsoTop + 4;
        const armSwing = Math.abs(this.vx) > 0.5 ? Math.sin(this.walkFrame * Math.PI / 2) * 6 : 0;

        cx.fillStyle = suitColor;
        cx.strokeStyle = accentColor;
        cx.lineWidth = 1.5;
        // Left arm
        const laX = tx - 7;
        cx.beginPath();
        cx.roundRect(laX, armY + armSwing, 7, 14, 3);
        cx.fill(); cx.stroke();
        // Left glove
        cx.fillStyle = '#445';
        cx.beginPath();
        cx.arc(laX + 3, armY + armSwing + 16, 4, 0, Math.PI * 2);
        cx.fill();

        // Right arm
        const raX = tx + tw;
        const raSwing = this.attacking && this.facing === 1 ? -18 : -armSwing;
        cx.fillStyle = suitColor;
        cx.strokeStyle = accentColor;
        cx.beginPath();
        cx.roundRect(raX, armY + raSwing, 7, 14, 3);
        cx.fill(); cx.stroke();
        // Right glove
        cx.fillStyle = '#445';
        cx.beginPath();
        cx.arc(raX + 3, armY + raSwing + 16, 4, 0, Math.PI * 2);
        cx.fill();

        // Weapon if attacking
        if (this.attacking) {
            const weapon = shopData.weapons.find(w => w.id === (this.isPlayer ? state.equippedWeapon : 'sword'));
            if (weapon) {
                cx.font = '18px serif';
                cx.textAlign = 'center';
                const wax = this.facing === 1 ? raX + 20 : laX - 14;
                cx.fillText(weapon.icon, wax, armY + 8 + by);
            }
        }

        // Health bar
        const barW = 40, barH = 5;
        const barX = mx - barW / 2;
        const barY = this.y - 10;
        cx.fillStyle = '#333';
        cx.fillRect(barX, barY, barW, barH);
        const hp = this.health / this.maxHealth;
        cx.fillStyle = hp > 0.5 ? '#2ecc71' : hp > 0.25 ? '#f1c40f' : '#e74c3c';
        cx.fillRect(barX, barY, barW * hp, barH);

        // Name
        cx.fillStyle = '#fff';
        cx.font = 'bold 11px sans-serif';
        cx.textAlign = 'center';
        cx.fillText(this.name, mx, this.y - 14);
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
    gamePaused = false;
    gameTime = 120;
    state.kills = 0;
    state.gameInventory = [];
    entities = [];
    particles = [];
    items_on_ground = [];
    abductionBeams = [];
    hsHouses = []; hsPhase = 'counting'; hsCountFrames = 0; hsFoundCount = 0; hsTotalHiders = 0;
    activeEvent = null; eventCooldown = 1200; eventAnnounceTimer = 0;
    state.hasTorch = false;
    keys = {};

    // Premium ability state reset
    state.premUsesLeft = {
        prem_lightning: 1, prem_angel: 1, prem_ghost: 1,
        prem_meteor: 3, prem_blackhole: 2, prem_tornado: 3,
        prem_beast: 1, prem_nuke: 1,
    };
    state.premPhoenixUsed = false;
    state.premAngelActive = false;  state.premAngelTimer = 0;
    state.premGhostActive = false;  state.premGhostTimer = 0;
    state.premBeastActive = false;  state.premBeastTimer = 0;
    state.premMeteorSlam = false;
    state.premMushroomActive = false; state.premMushroomTimer = 0;
    state.premPillActive = false;    state.premPillTimer = 0;

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

    // Spawn extra human-style players from customGame config
    const humanNames = ['Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan'];
    const humanAvatars = ['🧑', '👩', '🧔', '👱', '🧕'];
    for (let i = 1; i < customGame.playerCount; i++) {
        const colorIdx = entities.length % PLAYER_COLORS.length;
        const fighter = new Fighter(
            80 + (i * (canvas.width - 160) / Math.max(customGame.playerCount + customGame.botCount, 1)),
            groundY - 100,
            humanNames[i % humanNames.length],
            PLAYER_COLORS[colorIdx],
            false,
            humanAvatars[i % humanAvatars.length]
        );
        entities.push(fighter);
    }

    // Spawn bots from customGame config
    const botTotal = customGame.botCount > 0 ? customGame.botCount
        : (entities.length < 2 ? 3 : 0); // fallback: at least some bots if none configured
    for (let i = 0; i < botTotal; i++) {
        const idx = Math.floor(Math.random() * botNames.length);
        const colorIdx = entities.length % PLAYER_COLORS.length;
        const fighter = new Fighter(
            100 + Math.random() * (canvas.width - 200),
            groundY - 100,
            botNames[idx],
            PLAYER_COLORS[colorIdx],
            false,
            botAvatars[idx]
        );
        entities.push(fighter);
    }

    // Assign random bot types to non-player fighters
    const BOT_TYPES = ['normal', 'normal', 'berserker', 'tank', 'ninja', 'coward', 'trickster'];
    const BOT_TYPE_HP = { normal: 100, berserker: 80, tank: 200, ninja: 70, coward: 90, trickster: 85 };
    for (let i = 1; i < entities.length; i++) {
        const e = entities[i];
        if (e.isBoss) continue;
        const t = BOT_TYPES[Math.floor(Math.random() * BOT_TYPES.length)];
        e.botType = t;
        e.maxHealth = BOT_TYPE_HP[t] || 100;
        e.health = e.maxHealth;
    }

    // ---- BOSS MODE: spawn the giant boss + hero allies ----
    if (state.gameMode === 'boss') {
        // All existing entities become heroes
        for (const e of entities) { e.team = 'hero'; }

        // Add 3 hero bots as allies if no extra players/bots configured
        const heroCount = entities.length;
        if (heroCount < 2) {
            for (let i = 0; i < 3; i++) {
                const idx = Math.floor(Math.random() * botNames.length);
                const ally = new Fighter(
                    100 + Math.random() * (canvas.width - 200),
                    groundY - 100,
                    botNames[idx],
                    PLAYER_COLORS[(i + 1) % PLAYER_COLORS.length],
                    false,
                    botAvatars[idx]
                );
                ally.team = 'hero';
                entities.push(ally);
            }
        }

        // Spawn giant boss
        const boss = new Fighter(
            canvas.width / 2 - 60,
            groundY - 200,
            'TITAN',
            '#8b0000',
            false,
            '👹'
        );
        boss.isBoss = true;
        boss.team = 'boss';
        boss.width = 120;
        boss.height = 180;
        boss.health = 3000;
        boss.maxHealth = 3000;
        boss.botCoins = 0;
        boss.botDiamonds = 0;
        entities.push(boss);
    }

    // Apply dragon/unicorn premium skin override
    if (state.ownedItems.includes('prem_dragon')) player.skin = '🐉';
    else if (state.ownedItems.includes('prem_unicorn')) player.skin = '🦄';

    // Ice Crown: freeze all bots for 3 seconds on spawn
    if (state.ownedItems.includes('prem_icecrown')) {
        for (let i = 1; i < entities.length; i++) {
            entities[i].frozen = true;
            entities[i].frozenTimer = 180;
        }
        showAbilityPopup('❄️ Ice Crown! Enemies frozen for 3s!');
    }

    // Spawn some items on ground
    spawnGroundItems(groundY);

    // ---- HIDE AND SEEK MODE SETUP ----
    if (state.gameMode === 'hideseek') {
        createHsHouses(groundY);
        // Pick a random entity as the seeker (can be player or bot)
        const seekerIdx = Math.floor(Math.random() * entities.length);
        entities[seekerIdx].hsIsSeeker = true;
        // Freeze seeker during countdown (frozen for 10s + buffer)
        entities[seekerIdx].frozen = true;
        entities[seekerIdx].frozenTimer = HS_COUNT_SECONDS * 60 + 30;
        // Count hiders
        hsTotalHiders = entities.length - 1;
        // Pre-assign target houses for bots (hiders)
        for (let i = 0; i < entities.length; i++) {
            if (i === seekerIdx) continue;
            const e = entities[i];
            const avail = hsHouses.filter(h => h.hiders.length < h.maxHiders);
            if (avail.length > 0) {
                e.hsTargetHouse = avail.reduce((a, b) =>
                    Math.abs(a.x + a.w / 2 - e.x) <= Math.abs(b.x + b.w / 2 - e.x) ? a : b);
            }
        }
        // 90-second seeking phase; timer doesn't count during countdown
        gameTime = 90;
        showAbilityPopup('🙈 HIDE! ' + HS_COUNT_SECONDS + ' seconds!');
    }

    // Build power reset
    state.buildsRemaining = state.ownedItems.includes('builder') ? 5 : 0;
    const buildHud = document.getElementById('hud-build');
    if (state.ownedItems.includes('builder')) {
        buildHud.style.display = 'flex';
        document.getElementById('build-count').textContent = state.buildsRemaining;
    } else {
        buildHud.style.display = 'none';
    }

    // HUD
    document.getElementById('player-name-hud').textContent = state.username;
    document.getElementById('kill-count').textContent = 'Kills: 0';

    // Timer
    clearInterval(gameTimerInterval);
    gameTimerInterval = setInterval(() => {
        if (!gameRunning) return;
        // Pause countdown during hide and seek counting phase
        if (state.gameMode === 'hideseek' && hsPhase === 'counting') return;
        gameTime--;
        const mins = Math.floor(gameTime / 60);
        const secs = gameTime % 60;
        document.getElementById('game-timer').textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;

        if (gameTime <= 0) {
            if (state.gameMode === 'hideseek') {
                const hidersLeft = entities.filter(e => !e.dead && !e.hsIsSeeker).length;
                document.getElementById('gameover-title').textContent =
                    hidersLeft > 0 ? "🙈 Hiders Win! Time's up!" : '🔍 Seeker Wins!';
            }
            endGame();
        }
    }, 1000);

    // Start game loop
    cancelAnimationFrame(animationFrameId);
    gameLoop();
}

function spawnGroundItems(groundY) {
    const itemIcons = ['🍌', '🧪', '🍎', '⭐', '💣', '🫀', '🧊', '🧨', '🍄', '💊', '🗡️', '🎯', '🌀', '🪬', '🔮'];
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
// ==================== RANDOM EVENTS LOGIC ====================
const EVENT_TIPS = {
    tsunami:    '🏔️ Get to HIGH GROUND! Platforms keep you safe!',
    flood:      '🏔️ Jump onto PLATFORMS! Water won\'t reach you!',
    earthquake: '⬇️ Hold S to BRACE! Reduces knockback!',
    meteor:     '👁️ Watch the RED SHADOWS! Dodge impact zones!',
    lightning:  '⚡ Watch for WARNING MARKERS! Move away fast!',
    tornado:    '⬇️ Hold S to CROUCH! Reduces the pull force!',
    blizzard:   '🔥 Find a CAMPFIRE! Keeps you from freezing!',
    volcanic:   '🛡️ Stay in the CENTER! Edge zones are deadly!',
    night:      '🕯️ Grab a TORCH on the ground! Expands sight!',
    gravity:    '⬆️ Float to the CEILING and walk upside-down!',
};

function endEvent() {
    // Clean up any event-spawned permanent ground items
    items_on_ground = items_on_ground.filter(i => !i.eventItem);
    if (activeEvent && activeEvent.type === 'night') state.hasTorch = false;
    activeEvent   = null;
    eventCooldown = 1800 + Math.floor(Math.random() * 1800); // 30-60s
}

function showEventBanner(type) {
    const labels = {
        tsunami:'🌊 TSUNAMI!', flood:'💧 FLOOD!', earthquake:'🌍 EARTHQUAKE!',
        meteor:'☄️ METEOR SHOWER!', lightning:'⚡ LIGHTNING STORM!',
        tornado:'🌪️ TORNADO!', blizzard:'❄️ BLIZZARD!',
        volcanic:'🌋 VOLCANIC ERUPTION!', night:'🌑 DARKNESS!', gravity:'🔄 GRAVITY FLIP!',
    };
    const colors = {
        tsunami:'#00bfff', flood:'#5af', earthquake:'#e8a020',
        meteor:'#ff6622', lightning:'#ffff44', tornado:'#88aaff',
        blizzard:'#cceeff', volcanic:'#ff3300', night:'#aaaaff', gravity:'#cc44ff',
    };
    eventAnnounceText  = '⚠️ ' + (labels[type] || type) + ' — incoming in 3…';
    eventAnnounceColor = colors[type] || '#fff';
    eventAnnounceTimer = 500;
}

function triggerRandomEvent() {
    if (activeEvent) return;
    const types = ['tsunami','flood','earthquake','meteor','lightning','tornado','blizzard','volcanic','night','gravity'];
    startGameEvent(types[Math.floor(Math.random() * types.length)]);
}

function startGameEvent(type) {
    const groundY = canvas.height - GROUND_Y_OFFSET;
    activeEvent = { type, timer: 0, phase: 'warning', warnFrames: 180, data: {} };
    showEventBanner(type);
    const d = activeEvent.data;
    switch (type) {
        case 'tsunami':
            d.dir = Math.random() < 0.5 ? 1 : -1;
            d.x   = d.dir === 1 ? -160 : canvas.width + 160;
            d.hit = new Set();
            break;
        case 'flood':
            d.level = 0; d.maxLevel = 120; d.phase = 'rising'; d.holdTimer = 0;
            break;
        case 'earthquake':
            d.duration = 300; d.shakeX = 0; d.shakeY = 0;
            break;
        case 'meteor':
            d.meteors = []; d.spawnTimer = 0; d.duration = 360;
            break;
        case 'lightning':
            d.bolts = []; d.spawnTimer = 0; d.duration = 300;
            break;
        case 'tornado':
            d.x = -80; d.speed = 3.5 + Math.random() * 3; d.spin = 0;
            break;
        case 'blizzard':
            d.flakes = Array.from({length: 80}, () => ({
                x: Math.random() * canvas.width, y: Math.random() * canvas.height,
                r: 1.5 + Math.random() * 3, vy: 1 + Math.random() * 2, vx: (Math.random()-0.5),
            }));
            d.duration = 360; d.frozeApplied = false;
            break;
        case 'volcanic':
            d.balls = []; d.spawnTimer = 0; d.duration = 360;
            break;
        case 'night':
            d.alpha = 0; d.duration = 420;
            break;
        case 'gravity':
            d.duration = 300;
            break;
    }
}

function isOnPlatform(e, groundY) {
    return e.onGround && e.y + e.height < groundY - 5;
}

function updateGameEvent(groundY) {
    if (!activeEvent) {
        eventCooldown--;
        if (eventCooldown <= 0 && gameRunning) triggerRandomEvent();
        return;
    }
    activeEvent.timer++;
    const d = activeEvent.data;

    // ---- WARNING PHASE: countdown + spawn survival items ----
    if (activeEvent.phase === 'warning') {
        activeEvent.warnFrames--;

        // Spawn survival items on first warning frame
        if (activeEvent.warnFrames === 179) {
            if (activeEvent.type === 'blizzard') {
                // 3 campfires spread across map
                for (let i = 0; i < 3; i++) {
                    items_on_ground.push({
                        x: 120 + i * (canvas.width - 240) / 2, y: groundY - 22,
                        icon: '🔥', type: 'campfire', isCampfire: true, permanent: true,
                        collected: false, bobOffset: i, eventItem: true,
                    });
                }
            }
            if (activeEvent.type === 'night') {
                // 2 torches
                for (let i = 0; i < 2; i++) {
                    items_on_ground.push({
                        x: canvas.width * (i === 0 ? 0.28 : 0.72), y: groundY - 22,
                        icon: '🕯️', type: 'torch', isTorch: true,
                        collected: false, bobOffset: i * 2, eventItem: true,
                    });
                }
            }
        }

        // Update warning countdown text
        const secs = Math.ceil(activeEvent.warnFrames / 60);
        const colors = { tsunami:'#00bfff', flood:'#5af', earthquake:'#e8a020', meteor:'#ff6622', lightning:'#ffff44', tornado:'#88aaff', blizzard:'#cceeff', volcanic:'#ff3300', night:'#aaaaff', gravity:'#cc44ff' };
        const labels = { tsunami:'🌊 TSUNAMI', flood:'💧 FLOOD', earthquake:'🌍 EARTHQUAKE', meteor:'☄️ METEORS', lightning:'⚡ LIGHTNING', tornado:'🌪️ TORNADO', blizzard:'❄️ BLIZZARD', volcanic:'🌋 VOLCANIC', night:'🌑 DARKNESS', gravity:'🔄 GRAVITY FLIP' };
        eventAnnounceText  = '⚠️ ' + (labels[activeEvent.type] || activeEvent.type) + ' in ' + secs + '…  |  ' + (EVENT_TIPS[activeEvent.type] || '');
        eventAnnounceColor = colors[activeEvent.type] || '#fff';
        eventAnnounceTimer = 10;

        if (activeEvent.warnFrames <= 0) {
            activeEvent.phase = 'active';
            // Show "GO" banner
            const goLabels = { tsunami:'🌊 TSUNAMI!', flood:'💧 FLOOD!', earthquake:'🌍 EARTHQUAKE!', meteor:'☄️ METEOR SHOWER!', lightning:'⚡ LIGHTNING STORM!', tornado:'🌪️ TORNADO!', blizzard:'❄️ BLIZZARD!', volcanic:'🌋 VOLCANIC ERUPTION!', night:'🌑 DARKNESS!', gravity:'🔄 GRAVITY FLIP!' };
            eventAnnounceText  = goLabels[activeEvent.type] || activeEvent.type;
            eventAnnounceColor = colors[activeEvent.type] || '#fff';
            eventAnnounceTimer = 200;
        }
        return;
    }

    switch (activeEvent.type) {
        case 'tsunami': {
            d.x += d.dir * 15;
            for (const e of entities) {
                if (e.dead || d.hit.has(e)) continue;
                if (isOnPlatform(e, groundY)) { d.hit.add(e); continue; } // safe on high ground!
                if (Math.abs((e.x + e.width / 2) - d.x) < 90) {
                    e.vx = d.dir * 26; e.vy = -11;
                    e.takeDamage(18, null);
                    d.hit.add(e);
                }
            }
            if ((d.dir === 1 && d.x > canvas.width + 200) || (d.dir === -1 && d.x < -200)) endEvent();
            break;
        }
        case 'flood': {
            if (d.phase === 'rising') {
                d.level += 0.5;
                if (d.level >= d.maxLevel) d.phase = 'hold';
            } else if (d.phase === 'hold') {
                d.holdTimer++;
                if (d.holdTimer >= 200) d.phase = 'receding';
            } else {
                d.level -= 0.4;
                if (d.level <= 0) { d.level = 0; endEvent(); }
            }
            const floodY = groundY - d.level;
            for (const e of entities) {
                if (e.dead) continue;
                if (isOnPlatform(e, groundY)) continue; // safe on platform!
                if (e.y + e.height > floodY && Math.random() < 0.04)
                    e.takeDamage(2, null);
            }
            break;
        }
        case 'earthquake': {
            d.shakeX = (Math.random() - 0.5) * 14;
            d.shakeY = (Math.random() - 0.5) * 7;
            if (Math.random() < 0.1) {
                for (const e of entities) {
                    if (e.dead) continue;
                    // Player bracing: hold S = 70% less knockback
                    const bracing = e.isPlayer ? (keys['s'] || keys['arrowdown']) : Math.random() < 0.4;
                    const mult = bracing ? 0.3 : 1;
                    e.vx += (Math.random()-0.5) * 8 * mult;
                    e.vy -= Math.random() * 3 * mult;
                }
            }
            if (activeEvent.timer >= d.duration) { d.shakeX = 0; d.shakeY = 0; endEvent(); }
            break;
        }
        case 'meteor': {
            d.spawnTimer++;
            if (d.spawnTimer % 50 === 0 && d.spawnTimer < d.duration - 60) {
                const mx = 80+Math.random()*(canvas.width-160);
                d.meteors.push({ x: mx, y: -50,
                    vx: (Math.random()-0.5)*3, vy: 7+Math.random()*4, trail: [], done: false,
                    shadowX: mx, shadowAlpha: 0 }); // shadow shown before impact
            }
            for (let i = d.meteors.length-1; i >= 0; i--) {
                const m = d.meteors[i];
                if (m.done) { d.meteors.splice(i,1); continue; }
                m.trail.push({x:m.x, y:m.y});
                if (m.trail.length > 10) m.trail.shift();
                m.x += m.vx; m.y += m.vy;
                if (m.y >= groundY - 15) {
                    m.done = true;
                    for (let j=0;j<28;j++) particles.push({x:m.x,y:groundY-15,vx:(Math.random()-0.5)*14,vy:-Math.random()*10,life:50,color:Math.random()<0.5?'#ff4400':'#ffcc00',size:3+Math.random()*6});
                    for (const e of entities) {
                        if (e.dead) continue;
                        const dist = Math.hypot(e.x+e.width/2-m.x, e.y+e.height/2-(groundY-15));
                        if (dist < 110) e.takeDamage(Math.floor(40*(1-dist/110)), null);
                    }
                }
            }
            if (activeEvent.timer >= d.duration) endEvent();
            break;
        }
        case 'lightning': {
            if (!d.warnings) d.warnings = [];
            d.spawnTimer++;
            // Spawn a warning marker 60 frames before each bolt
            if (d.spawnTimer % 45 === 0) {
                const bx = 80 + Math.random() * (canvas.width - 160);
                d.warnings.push({ x: bx, timer: 60 }); // 60 frames to dodge
            }
            // Fire bolts from expired warnings
            for (let i = d.warnings.length-1; i >= 0; i--) {
                d.warnings[i].timer--;
                if (d.warnings[i].timer <= 0) {
                    const bx = d.warnings[i].x;
                    d.warnings.splice(i, 1);
                    const segs = [];
                    let cx = bx, cy = 0;
                    while (cy < groundY) {
                        const ny = Math.min(cy + 25 + Math.random()*20, groundY);
                        const nx = cx + (Math.random()-0.5)*50;
                        segs.push({x1:cx, y1:cy, x2:nx, y2:ny});
                        cx = nx; cy = ny;
                    }
                    d.bolts.push({ segs, timer: 0, x: bx });
                    for (const e of entities) {
                        if (!e.dead && Math.abs(e.x+e.width/2 - bx) < 55) e.takeDamage(22, null);
                    }
                }
            }
            for (const b of d.bolts) b.timer++;
            d.bolts = d.bolts.filter(b => b.timer < 18);
            if (activeEvent.timer >= d.duration) endEvent();
            break;
        }
        case 'tornado': {
            d.x += d.speed; d.spin += 0.15;
            for (const e of entities) {
                if (e.dead) continue;
                // Player crouching (hold S): 80% less pull
                const crouching = e.isPlayer ? (keys['s'] || keys['arrowdown']) : false;
                const pullMult = crouching ? 0.2 : 1;
                const dx = d.x - (e.x + e.width/2);
                const dist = Math.abs(dx);
                if (dist < 140) {
                    e.vx += dx * 0.07 * pullMult; e.vy -= 1.2 * pullMult;
                    if (dist < 50 && Math.random() < 0.08 && !crouching) e.takeDamage(6, null);
                }
            }
            if (d.x > canvas.width + 120) endEvent();
            break;
        }
        case 'blizzard': {
            // Check campfire warmth before applying freeze
            const campfires = items_on_ground.filter(i => i.isCampfire && !i.collected);
            for (const e of entities) {
                if (e.dead) continue;
                const nearFire = campfires.some(c => Math.hypot(e.x+e.width/2-c.x, e.y+e.height/2-c.y) < 110);
                if (!nearFire) {
                    if (!d.frozeApplied || Math.random() < 0.005) {
                        e.frozen = true; e.frozenTimer = 80;
                    }
                } else {
                    // Near campfire: thaw
                    e.frozen = false; e.frozenTimer = 0;
                }
            }
            d.frozeApplied = true;
            for (const f of d.flakes) {
                f.x += f.vx; f.y += f.vy;
                if (f.y > canvas.height) { f.y = -5; f.x = Math.random() * canvas.width; }
            }
            if (activeEvent.timer >= d.duration) endEvent();
            break;
        }
        case 'volcanic': {
            d.spawnTimer++;
            const safeZone = canvas.width * 0.18; // center 64% of screen is safe
            if (d.spawnTimer % 40 === 0) {
                const side = Math.random() < 0.5 ? 30 : canvas.width - 30;
                d.balls.push({ x: side, y: groundY-10,
                    vx: side < 100 ? (7+Math.random()*7) : -(7+Math.random()*7),
                    vy: -(14+Math.random()*8), trail: [], landed: false });
            }
            for (let i = d.balls.length-1; i >= 0; i--) {
                const b = d.balls[i];
                if (b.landed) { d.balls.splice(i,1); continue; }
                b.trail.push({x:b.x, y:b.y});
                if (b.trail.length > 8) b.trail.shift();
                b.vy += 0.45; b.x += b.vx; b.y += b.vy;
                if (b.y >= groundY - 10) {
                    b.landed = true;
                    for (let j=0;j<20;j++) particles.push({x:b.x,y:groundY-10,vx:(Math.random()-0.5)*10,vy:-Math.random()*8,life:40,color:Math.random()<0.5?'#ff2200':'#ff8800',size:2+Math.random()*5});
                    for (const e of entities) {
                        if (e.dead) continue;
                        // Safe in center zone!
                        if (e.x + e.width/2 > safeZone && e.x + e.width/2 < canvas.width - safeZone) continue;
                        if (Math.abs(e.x+e.width/2-b.x) < 65) e.takeDamage(18, null);
                    }
                }
            }
            if (activeEvent.timer >= d.duration) endEvent();
            break;
        }
        case 'night': {
            const t = activeEvent.timer;
            d.alpha = t < 60 ? (t/60)*0.87 : t > d.duration-60 ? ((d.duration-t)/60)*0.87 : 0.87;
            if (t >= d.duration) endEvent();
            break;
        }
        case 'gravity': {
            // _grav() returns negative — entities float up; ceiling collision
            for (const e of entities) {
                if (!e.dead && e.y < 2) {
                    e.y = 2; e.vy = Math.abs(e.vy) * 0.3; e.onGround = true;
                }
            }
            if (activeEvent.timer >= d.duration) endEvent();
            break;
        }
    }
}

function drawGameEventEffects(groundY) {
    if (!activeEvent) return;
    const d = activeEvent.data;

    switch (activeEvent.type) {
        case 'tsunami': {
            const wx = d.x;
            ctx.fillStyle = 'rgba(0,140,255,0.78)';
            ctx.beginPath();
            ctx.moveTo(wx - 80, canvas.height);
            ctx.lineTo(wx - 80, groundY + 20);
            ctx.bezierCurveTo(wx-60, groundY-80, wx-20, groundY-190, wx,   groundY-210);
            ctx.bezierCurveTo(wx+20, groundY-190, wx+50, groundY-60,  wx+80, groundY+20);
            ctx.lineTo(wx + 80, canvas.height);
            ctx.closePath();
            ctx.fill();
            ctx.fillStyle = 'rgba(255,255,255,0.7)';
            ctx.beginPath();
            ctx.ellipse(wx, groundY-210, 52, 16, 0, 0, Math.PI*2);
            ctx.fill();
            break;
        }
        case 'flood': {
            if (d.level <= 0) break;
            const floodY = groundY - d.level;
            ctx.fillStyle = 'rgba(0,90,200,0.35)';
            ctx.fillRect(0, floodY, canvas.width, canvas.height - floodY);
            ctx.fillStyle = 'rgba(0,150,255,0.55)';
            ctx.beginPath();
            ctx.moveTo(0, floodY);
            for (let x = 0; x <= canvas.width; x += 40) {
                ctx.lineTo(x, floodY + Math.sin(x * 0.025 + Date.now() * 0.003) * 6);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.closePath();
            ctx.fill();
            break;
        }
        case 'lightning': {
            // Draw warning markers (⚡ X on ground)
            if (d.warnings) {
                for (const w of d.warnings) {
                    const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.015);
                    ctx.fillStyle = `rgba(255,255,0,${0.55 * pulse})`;
                    ctx.beginPath(); ctx.ellipse(w.x, groundY - 10, 50, 12, 0, 0, Math.PI*2); ctx.fill();
                    ctx.strokeStyle = `rgba(255,255,0,${0.9 * pulse})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.ellipse(w.x, groundY - 10, 50, 12, 0, 0, Math.PI*2); ctx.stroke();
                    ctx.font = 'bold 18px sans-serif';
                    ctx.fillStyle = `rgba(255,255,100,${pulse})`;
                    ctx.textAlign = 'center';
                    ctx.fillText('⚡', w.x, groundY - 22);
                }
            }
            for (const b of d.bolts) {
                if (b.timer > 16) continue;
                const alpha = 1 - b.timer / 16;
                ctx.strokeStyle = `rgba(255,255,180,${alpha})`;
                ctx.shadowColor = '#ffff88'; ctx.shadowBlur = 18;
                ctx.lineWidth = Math.max(0.5, 3 - b.timer * 0.15);
                for (const seg of b.segs) {
                    ctx.beginPath(); ctx.moveTo(seg.x1,seg.y1); ctx.lineTo(seg.x2,seg.y2); ctx.stroke();
                }
                ctx.shadowBlur = 0;
                if (b.timer < 5) {
                    ctx.fillStyle = `rgba(255,255,200,${0.3*(1-b.timer/5)})`;
                    ctx.beginPath(); ctx.arc(b.x, groundY, 55, 0, Math.PI*2); ctx.fill();
                }
            }
            break;
        }
        case 'tornado': {
            ctx.save();
            ctx.translate(d.x, groundY);
            const tH = 200, topW = 85, botW = 22;
            const tGrad = ctx.createLinearGradient(0, -tH, 0, 0);
            tGrad.addColorStop(0, 'rgba(150,170,255,0.68)');
            tGrad.addColorStop(1, 'rgba(80,100,200,0.25)');
            ctx.fillStyle = tGrad;
            ctx.beginPath();
            ctx.moveTo(-topW, -tH);
            for (let y = -tH; y <= 0; y += 5) {
                const p = (y + tH) / tH;
                const w = topW*(1-p) + botW*p;
                ctx.lineTo( w + Math.sin(y*0.1 + d.spin)*w*0.3, y);
            }
            for (let y = 0; y >= -tH; y -= 5) {
                const p = (y + tH) / tH;
                const w = topW*(1-p) + botW*p;
                ctx.lineTo(-(w + Math.sin(y*0.1 + d.spin + Math.PI)*w*0.3), y);
            }
            ctx.closePath(); ctx.fill();
            ctx.restore();
            break;
        }
        case 'meteor': {
            for (const m of d.meteors) {
                if (m.done) continue;
                // Impact shadow warning on ground
                const distToGround = (groundY - 20) - m.y;
                const shadowAlpha = Math.max(0, 0.7 - distToGround / (canvas.height * 0.6));
                if (shadowAlpha > 0.05) {
                    ctx.fillStyle = `rgba(255,50,0,${shadowAlpha * 0.45})`;
                    ctx.beginPath(); ctx.ellipse(m.x, groundY - 14, 55, 14, 0, 0, Math.PI*2); ctx.fill();
                    ctx.strokeStyle = `rgba(255,80,0,${shadowAlpha})`;
                    ctx.lineWidth = 2;
                    ctx.beginPath(); ctx.ellipse(m.x, groundY - 14, 55, 14, 0, 0, Math.PI*2); ctx.stroke();
                }
                for (let i = 0; i < m.trail.length; i++) {
                    ctx.fillStyle = `rgba(255,120,0,${(i/m.trail.length)*0.55})`;
                    ctx.beginPath(); ctx.arc(m.trail[i].x, m.trail[i].y, 4*(i/m.trail.length), 0, Math.PI*2); ctx.fill();
                }
                ctx.fillStyle = '#ff6600'; ctx.shadowColor = '#ff4400'; ctx.shadowBlur = 12;
                ctx.beginPath(); ctx.arc(m.x, m.y, 10, 0, Math.PI*2); ctx.fill();
                ctx.shadowBlur = 0;
            }
            break;
        }
        case 'blizzard': {
            ctx.fillStyle = 'rgba(200,230,255,0.22)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(255,255,255,0.85)';
            for (const f of d.flakes) {
                ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI*2); ctx.fill();
            }
            // Campfire warm glow
            for (const c of items_on_ground.filter(i => i.isCampfire && !i.collected)) {
                const rg = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, 110);
                rg.addColorStop(0, 'rgba(255,140,0,0.3)');
                rg.addColorStop(1, 'rgba(255,80,0,0)');
                ctx.fillStyle = rg;
                ctx.beginPath(); ctx.arc(c.x, c.y, 110, 0, Math.PI*2); ctx.fill();
            }
            break;
        }
        case 'volcanic': {
            // Danger zones at edges
            const dz = canvas.width * 0.18;
            ctx.fillStyle = 'rgba(255,40,0,0.12)';
            ctx.fillRect(0, 0, dz, canvas.height);
            ctx.fillRect(canvas.width - dz, 0, dz, canvas.height);
            ctx.strokeStyle = 'rgba(255,80,0,0.5)';
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 6]);
            ctx.beginPath(); ctx.moveTo(dz, 0); ctx.lineTo(dz, canvas.height); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(canvas.width-dz, 0); ctx.lineTo(canvas.width-dz, canvas.height); ctx.stroke();
            ctx.setLineDash([]);
            ctx.font = 'bold 14px sans-serif'; ctx.fillStyle = 'rgba(255,120,0,0.7)'; ctx.textAlign = 'center';
            ctx.fillText('☠️ DANGER', dz/2, 80);
            ctx.fillText('☠️ DANGER', canvas.width - dz/2, 80);
            ctx.fillText('✅ SAFE ZONE', canvas.width/2, 80);
            for (const b of d.balls) {
                for (let i = 0; i < b.trail.length; i++) {
                    ctx.fillStyle = `rgba(255,80,0,${(i/b.trail.length)*0.55})`;
                    ctx.beginPath(); ctx.arc(b.trail[i].x, b.trail[i].y, 4*(i/b.trail.length), 0, Math.PI*2); ctx.fill();
                }
                ctx.fillStyle = '#ff4400'; ctx.beginPath(); ctx.arc(b.x, b.y, 10, 0, Math.PI*2); ctx.fill();
                ctx.fillStyle = '#ffaa00'; ctx.beginPath(); ctx.arc(b.x-2, b.y-2, 5, 0, Math.PI*2); ctx.fill();
            }
            break;
        }
        case 'night': {
            if (d.alpha <= 0) break;
            ctx.fillStyle = `rgba(0,0,8,${d.alpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            const playerN = entities[0];
            if (playerN && !playerN.dead) {
                const px = playerN.x + playerN.width/2, py = playerN.y + playerN.height/2;
                const lightR = state.hasTorch ? 280 : 155;
                const rg = ctx.createRadialGradient(px, py, 0, px, py, lightR);
                rg.addColorStop(0, 'rgba(0,0,8,0)');
                rg.addColorStop(1, `rgba(0,0,8,${d.alpha})`);
                ctx.fillStyle = rg; ctx.fillRect(0, 0, canvas.width, canvas.height);
                // Torch glow tint
                if (state.hasTorch) {
                    const tg = ctx.createRadialGradient(px, py, 0, px, py, 180);
                    tg.addColorStop(0, 'rgba(255,180,50,0.12)');
                    tg.addColorStop(1, 'rgba(255,120,0,0)');
                    ctx.fillStyle = tg; ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
            }
            break;
        }
        case 'gravity': {
            const t = activeEvent.timer, dur = d.duration;
            const a = t < 30 ? (t/30)*0.18 : t > dur-30 ? ((dur-t)/30)*0.18 : 0.18;
            ctx.fillStyle = `rgba(140,0,255,${a})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // "upside down" arrows hint
            ctx.font = 'bold 28px sans-serif';
            ctx.fillStyle = `rgba(220,150,255,${a*3})`;
            ctx.textAlign = 'center';
            ctx.fillText('⬆️ GRAVITY FLIP ⬆️', canvas.width/2, canvas.height - 50);
            break;
        }
    }
}

function drawEventAnnounce() {
    if (eventAnnounceTimer <= 0) return;
    eventAnnounceTimer--;
    const isWarning = activeEvent && activeEvent.phase === 'warning';
    const tip = isWarning && activeEvent ? (EVENT_TIPS[activeEvent.type] || '') : '';
    const boxH = tip ? 76 : 52;
    const alpha = eventAnnounceTimer > 150 ? 1 : eventAnnounceTimer / 150;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0,0,0,0.72)';
    ctx.beginPath();
    ctx.roundRect(canvas.width/2 - 260, 18, 520, boxH, 10);
    ctx.fill();
    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = eventAnnounceColor;
    ctx.textAlign = 'center';
    ctx.fillText(eventAnnounceText, canvas.width/2, 50);
    if (tip) {
        ctx.font = '14px sans-serif';
        ctx.fillStyle = '#ffe';
        ctx.fillText(tip, canvas.width/2, 76);
    }
    ctx.restore();
}

// ==================== HIDE AND SEEK HOUSES ====================
function createHsHouses(groundY) {
    hsHouses = [];
    const count = 10, w = 80, h = 70;
    const colors = ['#c0392b','#2980b9','#27ae60','#8e44ad','#d35400',
                    '#16a085','#b7950b','#1f618d','#784212','#717d7e'];
    for (let i = 0; i < count; i++) {
        const cx = 60 + i * (canvas.width - 120) / (count - 1);
        hsHouses.push({
            x: Math.max(10, Math.min(canvas.width - w - 10, cx - w / 2)),
            y: groundY - h,
            w, h,
            hiders: [],
            maxHiders: 10,
            color: colors[i],
        });
    }
}

function drawHsHouses() {
    for (const house of hsHouses) {
        // Body
        ctx.fillStyle = house.color;
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(house.x, house.y + 22, house.w, house.h - 22);
        ctx.fill(); ctx.stroke();

        // Roof
        ctx.fillStyle = '#3a3a3a';
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.beginPath();
        ctx.moveTo(house.x - 5,           house.y + 22);
        ctx.lineTo(house.x + house.w / 2,  house.y);
        ctx.lineTo(house.x + house.w + 5,  house.y + 22);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        // Door
        const dw = 18, dh = 28;
        const dX = house.x + house.w / 2 - dw / 2;
        const dY = house.y + house.h - dh;
        ctx.fillStyle = '#3a2005';
        ctx.beginPath();
        ctx.roundRect(dX, dY, dw, dh, [3, 3, 0, 0]);
        ctx.fill();
        // Door knob
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(dX + dw - 5, dY + dh / 2, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Windows
        ctx.fillStyle = 'rgba(150,210,255,0.45)';
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 1.5;
        ctx.fillRect(house.x + 7,             house.y + 28, 15, 12);
        ctx.strokeRect(house.x + 7,            house.y + 28, 15, 12);
        ctx.fillRect(house.x + house.w - 22,   house.y + 28, 15, 12);
        ctx.strokeRect(house.x + house.w - 22, house.y + 28, 15, 12);

        // Hider count badge
        if (house.hiders.length > 0) {
            ctx.font = 'bold 11px sans-serif';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'center';
            ctx.fillText('😶×' + house.hiders.length, house.x + house.w / 2, house.y - 4);
        }
    }
}

function gameLoop() {
    if (!gameRunning) return;
    animationFrameId = requestAnimationFrame(gameLoop);

    const groundY = canvas.height - GROUND_Y_OFFSET;
    const player = entities[0];

    // Player input
    if (!player.dead) {
        const beastMult = state.premBeastActive ? 2 : 1;
        const pillMult  = state.premPillActive  ? 1.6 : 1;
        const isExtreme = customGame.difficulty === 'extreme';
        const spd    = isExtreme ? 1000 : (state.equippedGear.includes('boots') ? 1.68 : 1.2) * beastMult * pillMult;
        const maxSpd = isExtreme ? 1000 : (state.equippedGear.includes('boots') ? 8.4  : 6)   * beastMult * pillMult;
        if (keys['a'] || keys['arrowleft'])  { player.vx -= spd; player.facing = -1; }
        if (keys['d'] || keys['arrowright']) { player.vx += spd; player.facing =  1; }
        const canJump = player.onGround || state.premAngelActive;
        if ((keys['w'] || keys['arrowup']) && canJump) {
            player.vy = state.premAngelActive ? -8 : -13;
            if (!state.premAngelActive) {
                player.onGround = false;
                player.jumpsLeft = state.ownedItems.includes('doublejump') ? 1 : 0;
            }
        }
        if (keys[' ']) { player.attack(); }

        // Limit speed
        if (player.vx > maxSpd) player.vx = maxSpd;
        if (player.vx < -maxSpd) player.vx = -maxSpd;
    }

    // Update entities
    for (const e of entities) {
        e.update(groundY);
        e.runAI(groundY);
    }

    // ---- Premium timed effects ----
    if (!player.dead) {
        if (state.premAngelActive) {
            state.premAngelTimer--;
            if (state.premAngelTimer <= 0) { state.premAngelActive = false; showAbilityPopup('👼 Angel Wings expired'); }
        }
        if (state.premGhostActive) {
            state.premGhostTimer--;
            if (state.premGhostTimer <= 0) { state.premGhostActive = false; showAbilityPopup('👻 Ghost Mode expired'); }
        }
        if (state.premBeastActive) {
            state.premBeastTimer--;
            if (state.premBeastTimer <= 0) { state.premBeastActive = false; showAbilityPopup('🐺 Beast Mode expired'); }
        }
        if (state.premMushroomActive) {
            state.premMushroomTimer--;
            if (state.premMushroomTimer <= 0) { state.premMushroomActive = false; }
        }
        if (state.premPillActive) {
            state.premPillTimer--;
            if (state.premPillTimer <= 0) { state.premPillActive = false; showAbilityPopup('💊 Speed Pill expired'); }
        }
        // Meteor slam: deal damage when player lands
        if (state.premMeteorSlam && player.onGround) {
            state.premMeteorSlam = false;
            for (const e of entities) {
                if (e === player || e.dead) continue;
                const dist = Math.sqrt((e.x - player.x) ** 2 + (e.y - player.y) ** 2);
                if (dist < 160) e.takeDamage(80, player);
            }
            for (let i = 0; i < 30; i++) {
                particles.push({ x: player.x + player.width/2, y: player.y + player.height,
                    vx: (Math.random()-0.5)*16, vy: -Math.random()*9,
                    life: 40, color: Math.random()<0.5 ? '#ff6600' : '#ffcc00', size: 4+Math.random()*6 });
            }
            showAbilityPopup('☄️ IMPACT! Enemies blasted!');
        }
        // Fire Trail particles
        if (state.ownedItems.includes('prem_fire') && Math.random() < 0.4) {
            particles.push({ x: player.x + Math.random() * player.width, y: player.y + player.height - 5,
                vx: (Math.random()-0.5)*2, vy: -1 - Math.random()*2,
                life: 22, color: Math.random() < 0.5 ? '#ff4400' : '#ffcc00', size: 3+Math.random()*4 });
        }
    }
    // Update ability HUD
    updateAbilityHud();

    // Item pickup
    const pickupRange = state.ownedItems.includes('magnet') ? 90 : 30;
    for (const item of items_on_ground) {
        if (item.collected) continue;
        if (player.dead) continue;
        const dx = player.x + player.width / 2 - item.x;
        const dy = player.y + player.height / 2 - item.y;
        if (Math.abs(dx) < pickupRange && Math.abs(dy) < pickupRange && item.type !== 'trap') {
            item.collected = true;
            // Apply item effect
            if (item.type === 'coins') {
                state.coins += item.amount;
                const popup = document.getElementById('kill-coins-popup');
                popup.textContent = '+' + item.amount + ' 🪙 recovered!';
                popup.style.opacity = '1';
                clearTimeout(popup._hideTimer);
                popup._hideTimer = setTimeout(() => popup.style.opacity = '0', 1800);
            } else if (item.type === 'diamonds') {
                state.diamonds += item.amount;
                updateCoinsDisplay();
                const popup = document.getElementById('kill-coins-popup');
                popup.textContent = '+' + item.amount + ' 💎 diamonds!';
                popup.style.opacity = '1';
                clearTimeout(popup._hideTimer);
                popup._hideTimer = setTimeout(() => popup.style.opacity = '0', 1800);
            } else if (item.isTorch) {
                // Torch — enlarges light radius during night event
                state.hasTorch = true;
                const popup = document.getElementById('kill-coins-popup');
                popup.textContent = '🕯️ Torch! Sight expanded!';
                popup.style.opacity = '1';
                clearTimeout(popup._hideTimer);
                popup._hideTimer = setTimeout(() => popup.style.opacity = '0', 1500);
            } else if (item.isCampfire) {
                item.collected = false; // campfires can't be picked up
            } else if (!item.isTrap && groundItemDefs[item.icon]) {
                // Add to in-game inventory
                state.gameInventory.push({ ...groundItemDefs[item.icon] });
                const popup = document.getElementById('kill-coins-popup');
                popup.textContent = groundItemDefs[item.icon].icon + ' Added to inventory!';
                popup.style.opacity = '1';
                clearTimeout(popup._hideTimer);
                popup._hideTimer = setTimeout(() => popup.style.opacity = '0', 1200);
            }
        }
    }

    // Trap check (banana 🍌 from player or bot coward/trickster)
    for (const item of items_on_ground) {
        if (item.type !== 'trap' || item.collected) continue;
        for (const e of entities) {
            if (e === item.trapOwner || e.dead) continue; // owner immune
            const dx = e.x + e.width / 2 - item.x;
            const dy = e.y + e.height / 2 - item.y;
            if (Math.abs(dx) < 25 && Math.abs(dy) < 30) {
                item.collected = true;
                e.vx = (Math.random() - 0.5) * 15;
                e.vy = -8;
                e.takeDamage(10, item.trapOwner || entities[0]);
                playLaughSound();
                for (let i = 0; i < 8; i++) {
                    particles.push({
                        x: item.x, y: item.y,
                        vx: (Math.random() - 0.5) * 6,
                        vy: -Math.random() * 5,
                        life: 20, color: item.icon === '⚡' ? '#ccaaff' : '#ffff00', size: 3
                    });
                }
            }
        }
    }

    // Bot coin theft
    for (const item of items_on_ground) {
        if (item.type !== 'coins' || item.collected) continue;
        for (const e of entities) {
            if (e === entities[0] || e.dead) continue;
            const dx = e.x + e.width / 2 - item.x;
            const dy = e.y + e.height / 2 - item.y;
            if (Math.abs(dx) < 35 && Math.abs(dy) < 35) {
                item.collected = true;
                const popup = document.getElementById('kill-coins-popup');
                popup.textContent = '💸 ' + e.name + ' stole your coins!';
                popup.style.opacity = '1';
                clearTimeout(popup._hideTimer);
                popup._hideTimer = setTimeout(() => popup.style.opacity = '0', 2200);
                for (let i = 0; i < 12; i++) {
                    particles.push({
                        x: item.x, y: item.y,
                        vx: (Math.random() - 0.5) * 8,
                        vy: -Math.random() * 6,
                        life: 30, color: 'gold', size: 3 + Math.random() * 3
                    });
                }
            }
        }
    }

    // Bot diamond theft
    for (const item of items_on_ground) {
        if (item.type !== 'diamonds' || item.collected) continue;
        for (const e of entities) {
            if (e === entities[0] || e.dead) continue;
            const dx = e.x + e.width / 2 - item.x;
            const dy = e.y + e.height / 2 - item.y;
            if (Math.abs(dx) < 35 && Math.abs(dy) < 35) {
                item.collected = true;
                const popup = document.getElementById('kill-coins-popup');
                popup.textContent = '💎 ' + e.name + ' stole your diamonds!';
                popup.style.opacity = '1';
                clearTimeout(popup._hideTimer);
                popup._hideTimer = setTimeout(() => popup.style.opacity = '0', 2200);
                for (let i = 0; i < 10; i++) {
                    particles.push({
                        x: item.x, y: item.y,
                        vx: (Math.random() - 0.5) * 8,
                        vy: -Math.random() * 6,
                        life: 30, color: '#7df', size: 3 + Math.random() * 3
                    });
                }
            }
        }
    }

    // Bots leave after 1 minute (60000ms)
    for (let i = entities.length - 1; i >= 1; i--) {
        const e = entities[i];
        if (e.isPlayer || e.dead) continue;
        if (Date.now() - e.spawnTime >= 60000) {
            // Drop their diamonds before leaving
            if (e.botDiamonds > 0) {
                items_on_ground.push({
                    x: e.x + e.width / 2,
                    y: groundY - 20,
                    icon: '💎',
                    type: 'diamonds',
                    amount: e.botDiamonds,
                    collected: false,
                    bobOffset: Math.random() * Math.PI * 2,
                });
            }
            const popup = document.getElementById('kill-coins-popup');
            popup.textContent = '👋 ' + e.name + ' left the game!';
            popup.style.opacity = '1';
            clearTimeout(popup._hideTimer);
            popup._hideTimer = setTimeout(() => popup.style.opacity = '0', 2500);
            entities.splice(i, 1);
        }
    }

    // Update temporary platforms
    for (let i = platforms.length - 1; i >= 0; i--) {
        if (platforms[i].temporary) {
            platforms[i].life--;
            if (platforms[i].life <= 0) platforms.splice(i, 1);
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

    // ==================== RANDOM EVENT UPDATE ====================
    updateGameEvent(groundY);

    // ==================== HIDE AND SEEK PHASE UPDATE ====================
    if (state.gameMode === 'hideseek' && hsPhase === 'counting') {
        hsCountFrames++;
        if (hsCountFrames >= HS_COUNT_SECONDS * 60) {
            hsPhase = 'seeking';
            const seeker = entities.find(e => e.hsIsSeeker);
            if (seeker) { seeker.frozen = false; seeker.frozenTimer = 0; }
            showAbilityPopup('🔍 SEEK! Find the hiders!');
        }
    }

    // Respawn items occasionally
    if (Math.random() < 0.002) {
        const itemIcons = ['🍌', '🧪', '🍎', '⭐', '💣', '🫀', '🧊', '🧨', '🍄', '💊', '🗡️', '🎯', '🌀', '🪬', '🔮'];
        items_on_ground.push({
            x: 80 + Math.random() * (canvas.width - 160),
            y: groundY - 20,
            icon: itemIcons[Math.floor(Math.random() * itemIcons.length)],
            collected: false,
            bobOffset: Math.random() * Math.PI * 2
        });
    }

    // ==================== DRAW ====================
    // Earthquake screen shake
    if (activeEvent && activeEvent.type === 'earthquake') {
        ctx.save();
        ctx.translate(activeEvent.data.shakeX, activeEvent.data.shakeY);
    }

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
    if (state.gameMode === 'space') {
        // Moon surface
        ctx.fillStyle = '#3a3a4a';
        ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
        ctx.fillStyle = '#4a4a5a';
        ctx.fillRect(0, groundY, canvas.width, 6);
        // Moon craters
        ctx.strokeStyle = '#2a2a3a';
        ctx.lineWidth = 2;
        for (let cx2 = 30; cx2 < canvas.width; cx2 += 90) {
            const r = 8 + (cx2 % 3) * 4;
            ctx.beginPath();
            ctx.ellipse(cx2, groundY + r + 4, r, r * 0.4, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
    } else {
        ctx.fillStyle = '#2d5016';
        ctx.fillRect(0, groundY, canvas.width, canvas.height - groundY);
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
    }

    // Draw platforms
    for (const plat of platforms) {
        if (plat.temporary) {
            ctx.globalAlpha = plat.life < 80 ? plat.life / 80 : 1;
            ctx.fillStyle = '#3a2a8a';
            ctx.beginPath();
            ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 4);
            ctx.fill();
            ctx.fillStyle = '#6a5aff';
            ctx.fillRect(plat.x, plat.y, plat.w, 4);
            ctx.globalAlpha = 1;
        } else if (state.gameMode === 'space') {
            // Asteroid / space rock platform
            ctx.fillStyle = '#4a4a5a';
            ctx.strokeStyle = '#7af';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 5);
            ctx.fill();
            ctx.stroke();
            // Glowing top edge
            ctx.fillStyle = 'rgba(100,200,255,0.3)';
            ctx.fillRect(plat.x + 2, plat.y, plat.w - 4, 3);
        } else {
            ctx.fillStyle = '#5a3921';
            ctx.beginPath();
            ctx.roundRect(plat.x, plat.y, plat.w, plat.h, 4);
            ctx.fill();
            ctx.fillStyle = '#3a7d20';
            ctx.fillRect(plat.x, plat.y, plat.w, 4);
        }
    }

    // Draw hide and seek houses
    if (state.gameMode === 'hideseek') drawHsHouses();

    // Draw items on ground
    const now = Date.now();
    for (const item of items_on_ground) {
        if (item.collected) continue;
        const bob = Math.sin(now / 400 + item.bobOffset) * 4;
        ctx.font = '22px serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.icon, item.x, item.y + bob);

        // Coin pile: show amount
        if (item.type === 'coins') {
            ctx.font = 'bold 12px sans-serif';
            ctx.fillStyle = 'gold';
            ctx.fillText(item.amount + ' 🪙', item.x, item.y + bob - 18);
            ctx.beginPath();
            ctx.arc(item.x, item.y + bob - 5, 20, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,215,0,0.15)';
            ctx.fill();
        } else {
            // Glow
            ctx.beginPath();
            ctx.arc(item.x, item.y + bob - 5, 15, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255,255,100,0.1)';
            ctx.fill();
        }
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

    // Draw random event effects
    drawGameEventEffects(groundY);

    // Draw alien abduction beams
    for (let i = abductionBeams.length - 1; i >= 0; i--) {
        const b = abductionBeams[i];
        b.timer++;

        const bot = b.targetBot;
        const bx = bot.x + bot.width / 2;
        const by2 = bot.y + bot.height / 2;

        // Phase 1 (0-40): beam descends, UFO appears
        // Phase 2 (40-80): bot floats up and disappears
        if (b.timer < 80) {
            const progress = b.timer / 40;
            const beamBottom = b.timer < 40 ? (canvas.height * progress) : by2 + (canvas.height - by2) * ((b.timer - 40) / 40);

            // Tractor beam
            ctx.globalAlpha = 0.55;
            const beamGrad = ctx.createLinearGradient(bx, 0, bx, beamBottom);
            beamGrad.addColorStop(0, 'rgba(0,255,200,0)');
            beamGrad.addColorStop(0.6, 'rgba(0,255,200,0.5)');
            beamGrad.addColorStop(1, 'rgba(0,255,200,0.15)');
            ctx.fillStyle = beamGrad;
            ctx.beginPath();
            ctx.moveTo(bx - 5, 0);
            ctx.lineTo(bx - 30, beamBottom);
            ctx.lineTo(bx + 30, beamBottom);
            ctx.lineTo(bx + 5, 0);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1;

            // UFO
            ctx.font = '36px serif';
            ctx.textAlign = 'center';
            ctx.fillText('🛸', bx, 36);

            // Bot floats up in phase 2
            if (b.timer >= 40 && !bot.dead) {
                const lift = (b.timer - 40) / 40;
                bot.y -= 4;
                bot.vx = 0; bot.vy = 0;
                ctx.globalAlpha = 1 - lift;
                bot.draw();
                ctx.globalAlpha = 1;
                if (b.timer === 79) {
                    bot.takeDamage(9999, entities[0]);
                }
            }
        } else {
            abductionBeams.splice(i, 1);
        }
    }

    // ---- Hide and Seek HUD ----
    if (state.gameMode === 'hideseek') {
        // Draw seeker label above the seeker entity
        const seeker = entities.find(e => e.hsIsSeeker && !e.dead);
        if (seeker) {
            ctx.font = 'bold 13px sans-serif';
            ctx.fillStyle = '#ff4';
            ctx.textAlign = 'center';
            ctx.fillText('👁️ SEEKER', seeker.x + seeker.width / 2, seeker.y - 30);
        }

        if (hsPhase === 'counting') {
            const secs = Math.max(1, HS_COUNT_SECONDS - Math.floor(hsCountFrames / 60));
            // Semi-transparent banner
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.fillRect(canvas.width / 2 - 120, canvas.height / 2 - 90, 240, 115);
            ctx.font = 'bold 72px sans-serif';
            ctx.fillStyle = secs <= 3 ? '#f44' : '#ff4';
            ctx.textAlign = 'center';
            ctx.fillText(secs, canvas.width / 2, canvas.height / 2 - 10);
            ctx.font = 'bold 20px sans-serif';
            ctx.fillStyle = '#fff';
            ctx.fillText('🙈  H I D E !', canvas.width / 2, canvas.height / 2 + 20);
        } else {
            // Seeking phase: found counter bottom-left
            ctx.font = 'bold 16px sans-serif';
            ctx.fillStyle = '#fff';
            ctx.textAlign = 'left';
            const hidersLeft = hsTotalHiders - hsFoundCount;
            ctx.fillText('🔍 Found: ' + hsFoundCount + '/' + hsTotalHiders +
                         '  |  Hiding: ' + hidersLeft, 12, canvas.height - 8);
        }
    }

    // F to hide hint for non-seeker players
    if (state.gameMode === 'hideseek' && !player.hsIsSeeker && !player.dead && !player.hsHiding && hsPhase !== 'counting') {
        const nearHouse = hsHouses.find(h => {
            const doorCX = h.x + h.w / 2;
            return Math.abs(player.x + player.width / 2 - doorCX) < 70 && player.onGround;
        });
        if (nearHouse) {
            ctx.font = 'bold 14px sans-serif';
            ctx.fillStyle = '#7f3';
            ctx.textAlign = 'center';
            ctx.fillText('[F] Enter house', player.x + player.width / 2, player.y - 44);
        }
    }
    if (state.gameMode === 'hideseek' && player.hsHiding) {
        ctx.font = 'bold 14px sans-serif';
        ctx.fillStyle = '#7af';
        ctx.textAlign = 'center';
        ctx.fillText('[F] Exit house', canvas.width / 2, 80);
    }

    // Close earthquake screen shake (all drawing is now done)
    if (activeEvent && activeEvent.type === 'earthquake') ctx.restore();

    // Event announcement banner (drawn last so it's always on top)
    drawEventAnnounce();

    // Update secret button visibility
    updateSecretBtn();
}

// ==================== END GAME ====================
function endGame() {
    gameRunning = false;
    clearInterval(gameTimerInterval);
    cancelAnimationFrame(animationFrameId);
    const secretBtn = document.getElementById('secret-space-btn');
    if (secretBtn) secretBtn.style.display = 'none';

    const coinsEarned = state.kills;
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

// ==================== PREMIUM ABILITIES ====================
function showAbilityPopup(text) {
    const popup = document.getElementById('kill-coins-popup');
    popup.textContent = text;
    popup.style.opacity = '1';
    clearTimeout(popup._hideTimer);
    popup._hideTimer = setTimeout(() => popup.style.opacity = '0', 2200);
}

function updateAbilityHud() {
    const el = document.getElementById('prem-ability-hud');
    if (!el) return;
    const owned = state.ownedItems;
    const uses  = state.premUsesLeft || {};
    // Find best ready active ability
    const order = ['prem_nuke','prem_beast','prem_meteor','prem_blackhole','prem_tornado','prem_lightning','prem_angel','prem_ghost'];
    let label = '';
    for (const id of order) {
        if (!owned.includes(id)) continue;
        const left = uses[id] || 0;
        if (id === 'prem_beast' && state.premBeastActive) { label = '🐺 BEAST ACTIVE'; break; }
        if (id === 'prem_angel' && state.premAngelActive) { label = '👼 FLYING'; break; }
        if (id === 'prem_ghost' && state.premGhostActive) { label = '👻 GHOST'; break; }
        if (left > 0) {
            const icons = { prem_nuke:'💥', prem_beast:'🐺', prem_meteor:'☄️', prem_blackhole:'🕳️', prem_tornado:'🌪️', prem_lightning:'⚡', prem_angel:'👼', prem_ghost:'👻' };
            label = `E: ${icons[id]} ${shopData.premium.find(p=>p.id===id)?.name} (${left} left)`;
            break;
        }
    }
    el.textContent = label || '';
    el.style.display = label ? 'block' : 'none';
}

function activatePremAbility() {
    const player = entities[0];
    if (!player || player.dead) return;
    const owned = state.ownedItems;
    const uses  = state.premUsesLeft;

    if (owned.includes('prem_nuke') && uses.prem_nuke > 0) {
        uses.prem_nuke--;
        for (const e of entities) {
            if (e === player || e.dead) continue;
            e.takeDamage(9999, player);
        }
        for (let i = 0; i < 60; i++) {
            particles.push({ x: canvas.width/2, y: canvas.height/2,
                vx: (Math.random()-0.5)*22, vy: (Math.random()-0.5)*22,
                life: 60, color: ['#ff6600','#ffcc00','#ff0000','#fff'][Math.floor(Math.random()*4)], size: 5+Math.random()*9 });
        }
        showAbilityPopup('💥 NUKE! All enemies destroyed!');

    } else if (owned.includes('prem_beast') && uses.prem_beast > 0 && !state.premBeastActive) {
        uses.prem_beast--;
        state.premBeastActive = true;
        state.premBeastTimer = 600;
        showAbilityPopup('🐺 Beast Mode! 2x speed & damage for 10s!');

    } else if (owned.includes('prem_meteor') && uses.prem_meteor > 0) {
        uses.prem_meteor--;
        const target = entities.slice(1).find(e => !e.dead);
        if (target) {
            player.x = target.x + target.width/2 - player.width/2;
            player.y = Math.max(50, (canvas.height - GROUND_Y_OFFSET) - 300);
            player.vy = 22;
            player.vx = 0;
            state.premMeteorSlam = true;
        }
        showAbilityPopup('☄️ Meteor Crash! Brace for impact!');

    } else if (owned.includes('prem_blackhole') && uses.prem_blackhole > 0) {
        uses.prem_blackhole--;
        for (const e of entities) {
            if (e === player || e.dead) continue;
            const dx = (player.x + player.width/2) - (e.x + e.width/2);
            const dy = (player.y + player.height/2) - (e.y + e.height/2);
            const dist = Math.sqrt(dx*dx + dy*dy) || 1;
            e.vx += (dx / dist) * 22;
            e.vy += (dy / dist) * 22;
        }
        for (let i = 0; i < 20; i++) {
            particles.push({ x: player.x+player.width/2, y: player.y+player.height/2,
                vx: Math.cos(i*0.314)*12, vy: Math.sin(i*0.314)*12,
                life: 35, color: '#9900ff', size: 3+Math.random()*5 });
        }
        showAbilityPopup('🕳️ Black Hole! Enemies sucked in!');

    } else if (owned.includes('prem_tornado') && uses.prem_tornado > 0) {
        uses.prem_tornado--;
        for (const e of entities) {
            if (e === player || e.dead) continue;
            const dist = Math.sqrt((e.x-player.x)**2 + (e.y-player.y)**2);
            if (dist < 220) { e.takeDamage(40, player); e.vx = (Math.random()-0.5)*18; e.vy = -10; }
        }
        for (let i = 0; i < 20; i++) {
            particles.push({ x: player.x+player.width/2, y: player.y+player.height/2,
                vx: Math.cos(i*0.314)*11, vy: Math.sin(i*0.314)*11,
                life: 30, color: '#88ccff', size: 3+Math.random()*4 });
        }
        showAbilityPopup('🌪️ Tornado! Enemies scattered!');

    } else if (owned.includes('prem_lightning') && uses.prem_lightning > 0) {
        uses.prem_lightning--;
        let nearest = null, minDist = Infinity;
        for (const e of entities) {
            if (e === player || e.dead) continue;
            const d = Math.sqrt((e.x-player.x)**2 + (e.y-player.y)**2);
            if (d < minDist) { minDist = d; nearest = e; }
        }
        if (nearest) {
            nearest.takeDamage(9999, player);
            for (let i = 0; i < 18; i++) {
                particles.push({ x: nearest.x+nearest.width/2, y: nearest.y+nearest.height/2,
                    vx: (Math.random()-0.5)*12, vy: (Math.random()-0.5)*12,
                    life: 30, color: '#ffff00', size: 3+Math.random()*5 });
            }
        }
        showAbilityPopup('⚡ Lightning Strike! Instant KO!');

    } else if (owned.includes('prem_angel') && uses.prem_angel > 0 && !state.premAngelActive) {
        uses.prem_angel--;
        state.premAngelActive = true;
        state.premAngelTimer = 300;
        showAbilityPopup('👼 Angel Wings! Flying for 5 seconds!');

    } else if (owned.includes('prem_ghost') && uses.prem_ghost > 0 && !state.premGhostActive) {
        uses.prem_ghost--;
        state.premGhostActive = true;
        state.premGhostTimer = 300;
        showAbilityPopup('👻 Ghost Mode! Immune & phase for 5s!');

    } else {
        showAbilityPopup('No premium ability ready! Buy them in Premium shop.');
    }
}

// ==================== INPUT ====================
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;

    if (e.key === 'Escape' && gameRunning) {
        togglePause();
    }

    // Double jump — triggers on keydown only
    if ((e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') && gameRunning) {
        const player = entities[0];
        if (player && !player.dead && !player.onGround && player.jumpsLeft > 0) {
            player.vy = -13;
            player.jumpsLeft--;
        }
    }

    // E to use active premium ability
    if (e.key.toLowerCase() === 'e' && gameRunning && !gamePaused) {
        activatePremAbility();
    }

    // F to hide in / exit a house (hide and seek mode)
    if (e.key.toLowerCase() === 'f' && gameRunning && !gamePaused && state.gameMode === 'hideseek') {
        const player = entities[0];
        if (player && !player.dead && !player.hsIsSeeker) {
            if (player.hsHiding) {
                // Exit house
                player.hsHiding = false;
                if (player.hsHouse) {
                    const idx = player.hsHouse.hiders.indexOf(player);
                    if (idx >= 0) player.hsHouse.hiders.splice(idx, 1);
                    player.x = player.hsHouse.x + player.hsHouse.w / 2 - player.width / 2;
                    player.y = player.hsHouse.y + player.hsHouse.h - player.height - 2;
                    player.hsHouse = null;
                }
            } else {
                // Enter nearest house within range
                const near = hsHouses.find(h => {
                    const doorCX = h.x + h.w / 2;
                    return h.hiders.length < h.maxHiders &&
                           Math.abs(player.x + player.width / 2 - doorCX) < 70 &&
                           player.onGround;
                });
                if (near) {
                    player.hsHiding = true;
                    player.hsHouse  = near;
                    near.hiders.push(player);
                }
            }
        }
    }

    // B to build a platform
    if (e.key.toLowerCase() === 'b' && gameRunning) {
        const player = entities[0];
        if (player && !player.dead && state.ownedItems.includes('builder') && state.buildsRemaining > 0) {
            platforms.push({
                x: player.x - 40,
                y: player.y + player.height,
                w: 120,
                h: 15,
                temporary: true,
                life: 480,
            });
            state.buildsRemaining--;
            document.getElementById('build-count').textContent = state.buildsRemaining;
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
    const pc = document.getElementById('pause-bg-canvas');
    if (pc && gamePaused) {
        pc.width = pc.offsetWidth;
        pc.height = pc.offsetHeight;
    }
});

// ==================== PLAYER NAME INPUT ====================
document.getElementById('player-name-input').addEventListener('input', (e) => {
    const name = e.target.value.trim() || 'Player';
    state.username = name;
    state.players[0].name = name;
    updatePlayerSlots();
    saveState();
});

// ==================== INIT ====================
// Restore saved account data
loadState();

// Restore name field
if (state.username !== 'Player') {
    document.getElementById('player-name-input').value = state.username;
}

// Restore friends list UI
(function () {
    const list = document.getElementById('friends-list');
    list.innerHTML = '';
    for (const name of state.friends) {
        const div = document.createElement('div');
        div.className = 'friend-item';
        div.innerHTML = `<span>🧑 ${name}</span><button class="btn btn-small btn-green" onclick="inviteFriend('${name}')">Invite</button>`;
        list.appendChild(div);
    }
})();

updateCoinsDisplay();
updatePlayerSlots();
startGalaxy();

// ==================== MOBILE TOUCH CONTROLS ====================
(function () {
    function tcHold(keyName) {
        let interval;
        const btn = document.getElementById('tc-' + keyName);
        if (!btn) return;
        const press = () => { keys[keyName] = true; };
        const release = () => { keys[keyName] = false; };
        btn.addEventListener('touchstart', (e) => { press(); e.preventDefault(); }, { passive: false });
        btn.addEventListener('touchend',   (e) => { release(); e.preventDefault(); }, { passive: false });
        btn.addEventListener('touchcancel',(e) => { release(); e.preventDefault(); }, { passive: false });
    }
    tcHold('left');
    tcHold('right');

    // Up = jump
    const btnUp = document.getElementById('tc-up');
    if (btnUp) {
        btnUp.addEventListener('touchstart', (e) => {
            if (!gameRunning) return;
            const player = entities[0];
            // trigger jump same as keydown w
            keys['w'] = true;
            if (player && !player.dead && !player.onGround && player.jumpsLeft > 0) {
                player.vy = -13;
                player.jumpsLeft--;
            }
            e.preventDefault();
        }, { passive: false });
        btnUp.addEventListener('touchend',    (e) => { keys['w'] = false; e.preventDefault(); }, { passive: false });
        btnUp.addEventListener('touchcancel', (e) => { keys['w'] = false; e.preventDefault(); }, { passive: false });
    }

    // Attack = space
    const btnAtk = document.getElementById('tc-attack');
    if (btnAtk) {
        btnAtk.addEventListener('touchstart', (e) => { keys[' '] = true;  e.preventDefault(); }, { passive: false });
        btnAtk.addEventListener('touchend',   (e) => { keys[' '] = false; e.preventDefault(); }, { passive: false });
        btnAtk.addEventListener('touchcancel',(e) => { keys[' '] = false; e.preventDefault(); }, { passive: false });
    }

    // Pause button
    const btnPause = document.getElementById('tc-pause');
    if (btnPause) {
        btnPause.addEventListener('touchstart', (e) => {
            if (gameRunning) togglePause();
            e.preventDefault();
        }, { passive: false });
    }
})();
