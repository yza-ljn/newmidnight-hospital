import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const CELL = 4;
const MAPS = {
    1: [
        '#################',
        '#P....#....N...E#',
        '#.###.#.#####.#.#',
        '#...#.#.....#.#.#',
        '###.#.###.#.#.#.#',
        '#...#...#.#...#.#',
        '#.#####.#.#####.#',
        '#.....#.#.....#.#',
        '#.###.#.#####.#.#',
        '#H#...#...#...#.#',
        '#.#.#####.#.#.#.#',
        '#.#.....#.#.#...#',
        '#.#####.#.#.###.#',
        '#...K...#...H...#',
        '#.#####.#####.#.#',
        '#F............M.#',
        '*****************'
    ],
    2: [
        '###########################',
        '#P..........#............E#',
        '#.#########.#.##########.#',
        '#.#.......#.#.#........#.#',
        '#.#.#####.#.#.#.######.#.#',
        '#.#.#...#.#.#.#.#....#.#.#',
        '#.#.#.#.#.#.#.#.#.##.#.#.#',
        '#.#.#.#.#.#...#.#.##.#.#.#',
        '#...#.#.#.#####.#.##.#...#',
        '#####.#.#.......#.##.#####',
        '#.....#.#.#######.##.#...#',
        '#.#####.#.........##.#.#.#',
        '#.#...#.##########.##.#.#.#',
        '#.#.#.#............##.#.#.#',
        '#.#.#.###############.#.#.#',
        '#.#.#.................#.#.#',
        '#.#.###################.#.#',
        '#.#.....................#.#',
        '#.#######################.#',
        '#.......1...2...3.......M.#',
        '###########################'
    ],
    3: [
        '###########################',
        '#P.........#A#..........B##',
        '#.########.#.#.##########.#',
        '#.#......#.#.#.#........#.#',
        '#.#.####.#.#.#.#.######.#.#',
        '#.#.#..#.#...#.#.#....#.#.#',
        '#.#.#.##.#####.#.#.##.#.#.#',
        '#.#.#.##.......#.#.##.#.#.#',
        '#...#.##.#######.#.##.#...#',
        '#####.##.#.......#.##.#####',
        '#.....##.#.#######.##.#...#',
        '#.######.#.........##.#.#.#',
        '#.#....#.##########.##.#.#.#',
        '#.#.##.#............##.#.#.#',
        '#.#.##.###############.#.#.#',
        '#.#.##........S........#.#.#',
        '#.#.####################.#.#',
        '#.#......................#.#',
        '#.########################.#',
        '#..........E.............M.#',
        '###########################'
    ],
    4: [
        '###########################',
        '#P........................#',
        '#..#######....#######.....#',
        '#..#.....#....#.....#.....#',
        '#..#..T..#....#..G..#.....#',
        '#..#.....#....#.....#.....#',
        '#..#######....#######.....#',
        '#.........................#',
        '#.........................#',
        '#.........#######.........#',
        '#.........#.....#.........#',
        '#.........#..Y..#.........#',
        '#.........#.....#.........#',
        '#.........#######.........#',
        '#.........................#',
        '#.........................#',
        '#.........................#',
        '#.........................#',
        '#............E............#',
        '#.......................M.#',
        '###########################'
    ],
    5: [
        '###############',
        '#P............#',
        '#.............#',
        '#.............#',
        '#.............#',
        '#......E......#',
        '#.............#',
        '###############'
    ]
};

const CHAPTER_DATA = {
    1: {
        title: 'CHAPTER 1: IMPRISONMENT',
        objective: '寻找医院的逃生线索并收集散落的文件',
        items: ['fuse', 'card', 'note'],
        nextChapter: 2
    },
    2: {
        title: 'CHAPTER 2: DISCOVERY',
        objective: '进入地下档案室，寻找实验真相 (收集 3 份核心档案)',
        items: ['doc1', 'doc2', 'doc3'],
        nextChapter: 3
    },
    3: {
        title: 'CHAPTER 3: TRUTH',
        objective: '关闭电力系统削弱怪物并获取通行证 (关闭 A/B 电闸)',
        items: ['switchA', 'switchB', 'pass'],
        nextChapter: 4
    },
    4: {
        title: 'CHAPTER 4: ESCAPE',
        objective: '启动备份电力与燃油并获取钥匙 (收集 T/G/Y)',
        items: ['battery', 'fuel', 'helikey'],
        nextChapter: 5
    },
    5: {
        title: 'CHAPTER 5: CHOICE',
        objective: '在直升机前做出你的最终抉择',
        items: [],
        nextChapter: null
    }
};

const ITEM_DATA = {
    F: { key: 'fuse', label: '备用保险丝', message: '电闸恢复了一部分供电……远处有什么醒了。' },
    K: { key: 'card', label: '红色门禁卡', message: '门禁卡沾着还没干透的污迹。' },
    N: { key: 'note', label: '逃生密码', message: '病历背后写着：出口密码 0713。' },
    '1': { key: 'doc1', label: '实验日志 A', message: '档案里记载了初步的人体排异反应。' },
    '2': { key: 'doc2', label: '实验日志 B', message: '变异速度超出了所有人的预期。' },
    '3': { key: 'doc3', label: '实验日志 C', message: 'Cross 院长下令封锁了地下室。' },
    // 第三章物品
    A: { key: 'switchA', label: '电闸 A', message: '第一路电力已断开，怪物似乎发出了一声痛苦的低吼。' },
    B: { key: 'switchB', label: '电闸 B', message: '第二路电力已断开，整层的防御系统正在崩溃。' },
    S: { key: 'pass', label: '主控室通行证', message: '这张卡片能打开通往顶层屋顶的最后一道门。' },
    T: { key: 'battery', label: '备份蓄电池', message: '沉重的蓄电池，直升机需要电力启动。' },
    G: { key: 'fuel', label: '航空燃油', message: '燃油桶，确保我们能飞得足够远。' },
    Y: { key: 'helikey', label: '直升机钥匙', message: '最后的钥匙，希望发动机还能转动。' }
};

const STORY_ITEMS_DATA = {
    1: [
        { x: 3, z: 13, content: "10月12日。实验进入了第三阶段。Cross院长似乎对'圣十字'的成果感到满意。但我每天都能听到走廊尽头的惨叫声……那不是人类的声音。 —— Sarah Chen 医生的日记碎片 #1" },
        { x: 11, z: 9, content: "患者编号 702。注射后理智值迅速下降，体表开始出现灰色的角质层。即使在昏迷中，他仍在低声重复着'它来了'。 —— 剥落的患者档案" }
    ],
    2: [
        { x: 5, z: 5, content: "档案室已经成了迷宫。这里的空气腐烂得令人窒息。我看到它了……那个被院长称为'次级品'的怪物，正在书架间巡逻。 —— 留下的纸条" },
        { x: 20, z: 15, content: "警告：如果电力系统崩溃，所有的收容单元都会打开。不要试图修复总闸，那是院长留下的陷阱。 —— 实验室安全手册" }
    ],
    3: [
        { x: 10, z: 10, content: "Cross 院长的最后日志：'他们说我是疯子。但只有我知道，进化是痛苦的。我将作为第一个成功的案例，带领人类走向永生。即使这意味着我将不再是人类。'" },
        { x: 2, z: 17, content: "手术室记录：由于电力负荷过大，脑部接口出现短路。患者已无法维持人形状态，建议进行完全隔离。 —— 标记为'绝密'的文件夹" }
    ],
    4: [
        { x: 4, z: 4, content: "直升机坪是最后的希望。如果备份发电机失效，我们就彻底被困在这里了……和‘他’在一起。" },
        { x: 22, z: 2, content: "我在梦中听到了螺旋桨的声音。但怪物从不入梦，它们只负责狩猎。 —— 某位幸存者的绝笔" }
    ]
};

export class HospitalGame {
    constructor(container) {
        this.container = container;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.08, 110);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
        this.timer = new THREE.Timer();
        this.loader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.keys = new Set();
        this.inventory = new Set();
        this.storyCollected = new Set();
        this.items = [];
        this.storyObjects = [];
        this.hideSpots = [];
        this.walls = [];
        this.currentChapter = 1;
        this.sanity = 100;
        this.yaw = -Math.PI / 2;
        this.pitch = 0;
        this.velocity = new THREE.Vector3();
        this.running = false;
        this.started = false;
        this.ended = false;
        this.hidden = false;
        this.currentAction = null;
        this.messageTimer = 0;
        this.pathTimer = 0;
        this.monsterPath = [];
        this.monsterState = 'patrol';
        this.monsterAlerted = false;
        this.lastShriek = -20;
        this.joystick = new THREE.Vector2();
        this.lookPointer = null;
        this.joyPointer = null;
        this.touchOrigin = new THREE.Vector2();
        this.audioContext = null;
    }

    async initialize() {
        this.configureRenderer();
        this.cacheUI();
        this.bindInputs();
        this.ui.start.disabled = true;
        this.ui.start.textContent = '载入医院…';
        this.renderer.setAnimationLoop((time) => this.update(time));
        await this.loadChapter(1);
        this.ui.start.disabled = false;
        this.ui.start.textContent = '进入医院';
    }

    async loadChapter(id) {
        this.currentChapter = id;
        this.scene.clear();
        this.items = [];
        this.storyObjects = [];
        this.hideSpots = [];
        this.walls = [];
        
        this.scene.add(this.camera);
        this.scene.add(new THREE.HemisphereLight(0x344840, 0x070807, 0.35));
        this.scene.fog = new THREE.FogExp2(0x06100e, 0.037);
        this.camera.add(this.flashlight, this.flashlight.target);

        await this.buildEnvironment();
        await this.loadPropsAndMonster();
        this.resetGame();
        
        this.ui['chapter-info'].textContent = CHAPTER_DATA[id].title;
    }

    configureRenderer() {
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.65));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.container.appendChild(this.renderer.domElement);
        this.scene.background = new THREE.Color(0x030707);
        this.camera.rotation.order = 'YXZ';
        
        this.flashlight = new THREE.SpotLight(0xddeee9, 16, 24, Math.PI / 5.5, 0.52, 1.5);
        this.flashlight.position.set(0, 0, 0);
        this.flashlight.target.position.set(0, 0, -4);
    }

    cacheUI() {
        const ids = ['start-screen','start','end-screen','end-title','end-copy','restart','objective-text','items-count','story-count','center-message','danger','sanity-filter','joystick','stick','sprint','interact','mute','chapter-info','diary-overlay','diary-content','diary-close'];
        this.ui = Object.fromEntries(ids.map(id => [id, document.getElementById(id)]));
    }

    async buildEnvironment() {
        const map = MAPS[this.currentChapter];
        const wallTexture = await this.loadTexture('assets/hospital-wall-tile.webp', 1, 1);
        const floorTexture = await this.loadTexture('assets/hospital-floor-tile.webp', 17, 17);
        const floorMat = new THREE.MeshStandardMaterial({ map: floorTexture, roughness: 0.92, color: 0x8b9691 });
        const floor = new THREE.Mesh(new THREE.PlaneGeometry(map[0].length * CELL, map.length * CELL), floorMat);
        floor.rotation.x = -Math.PI / 2;
        floor.receiveShadow = true;
        floor.position.set(0, 0, 0);
        this.scene.add(floor);
        
        const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(68, 68), new THREE.MeshStandardMaterial({ color: 0x171c1a, roughness: 1 }));
        ceiling.rotation.x = Math.PI / 2;
        ceiling.position.y = 3.9;
        this.scene.add(ceiling);
        
        const wallMat = new THREE.MeshStandardMaterial({ map: wallTexture, roughness: 0.94, color: 0x9aa39c });
        const wallGeo = new THREE.BoxGeometry(CELL, 4, CELL);
        
        map.forEach((row, z) => row.split('').forEach((cell, x) => {
            const position = this.cellToWorld(x, z);
            if (cell === '#' || cell === '*') {
                const wall = new THREE.Mesh(wallGeo, wallMat);
                wall.position.set(position.x, 2, position.z);
                wall.castShadow = true;
                wall.receiveShadow = true;
                this.scene.add(wall);
                this.walls.push({ x: position.x, z: position.z });
            } else if (cell in ITEM_DATA) {
                this.createItem(cell, position);
            } else if (cell === 'H') {
                this.createLocker(position);
            } else if (cell === 'E') {
                this.createExit(position);
            }
            if (cell !== '#' && cell !== '*' && (x + z) % 9 === 0) {
                this.createCeilingLight(position, (x + z) % 18 === 0);
            }
        }));

        if (STORY_ITEMS_DATA[this.currentChapter]) {
            STORY_ITEMS_DATA[this.currentChapter].forEach((data, index) => {
                this.createStoryItem(data, (this.currentChapter * 10) + index);
            });
        }
        
        this.addBloodMarks();
    }

    createStoryItem(data, index) {
        const position = this.cellToWorld(data.x, data.z);
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0xddddcc, emissive: 0x222222, roughness: 1 });
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.02, 0.4), mat);
        mesh.position.y = 0.1;
        group.add(mesh);
        group.position.copy(position);
        group.userData = { type: 'story', index, content: data.content };
        this.scene.add(group);
        this.storyObjects.push(group);
    }

    update(time) {
        this.timer.update(time);
        const delta = Math.min(this.timer.getDelta(), 0.05);
        if (this.started && !this.ended) {
            this.updatePlayer(delta);
            this.updateItems(delta);
            this.updateInteraction();
            this.updateMonster(delta);
            this.updateAudioPulse();
            this.updateSanityState(delta);
            if (this.messageTimer > 0) {
                this.messageTimer -= delta;
                if (this.messageTimer <= 0) this.ui['center-message'].classList.remove('show');
            }
        }
        this.renderer.render(this.scene, this.camera);
    }

    updateSanityState(delta) {
        if (this.monsterState === 'chase') {
            const dist = this.distance2D(this.camera.position, this.monster.position);
            if (dist < 6) this.sanity = Math.max(0, this.sanity - delta * 12);
        } else {
            this.sanity = Math.min(100, this.sanity + delta * 2);
        }
        
        const insanity = 1 - (this.sanity / 100);
        if (this.ui['sanity-filter']) {
            this.ui['sanity-filter'].style.boxShadow = `inset 0 0 ${insanity * 120}px rgba(130,0,10,${insanity * 0.75})`;
        }
        
        if (insanity > 0.4) {
            this.pitch += (Math.random() - 0.5) * insanity * 0.006;
            this.yaw += (Math.random() - 0.5) * insanity * 0.006;
        }
    }

    updateInteraction() {
        let closest = null;
        let distance = 2.05;

        this.storyObjects.forEach(obj => {
            if (!obj.visible) return;
            const d = this.distance2D(this.camera.position, obj.position);
            if (d < distance) { distance = d; closest = { type:'story', object:obj }; }
        });

        this.items.forEach(item => {
            if (!item.visible) return;
            const d = this.distance2D(this.camera.position, item.position);
            if (d < distance) { distance = d; closest = { type:'item', object:item }; }
        });
        this.hideSpots.forEach(spot => {
            const d = this.distance2D(this.camera.position, spot.position);
            if (d < distance) { distance = d; closest = { type:'hide', object:spot }; }
        });
        if (this.hidden) closest = { type:'leave', object:this.activeLocker };
        if (this.distance2D(this.camera.position, this.exitPosition) < 2.25) closest = { type:'exit', object:this.exitDoor };
        
        this.currentAction = closest;
        this.ui.interact.style.display = closest ? 'block' : 'none';
        const labels = { item:'拾取', hide:'躲藏', leave:'离开', exit:'开门', story:'阅读档案' };
        if (closest) this.ui.interact.textContent = labels[closest.type];
    }

    interact() {
        if (!this.currentAction || this.ended) return;
        const { type, object } = this.currentAction;
        if (type === 'story') this.readDiary(object);
        if (type === 'item') this.collectItem(object);
        if (type === 'hide') this.enterLocker(object);
        if (type === 'leave') this.leaveLocker();
        if (type === 'exit') this.tryExit();
    }

    readDiary(object) {
        this.ui['diary-content'].textContent = object.userData.content;
        this.ui['diary-overlay'].style.display = 'flex';
        this.storyCollected.add(object.userData.index);
        object.visible = false;
        this.updateObjective();
        if (this.pickupSound) { this.pickupSound.currentTime = 0; this.pickupSound.play().catch(() => {}); }
    }

    bindInputs() {
        this.ui['diary-close'].addEventListener('click', () => {
            this.ui['diary-overlay'].style.display = 'none';
        });

        addEventListener('resize', () => {
            this.camera.aspect = innerWidth / innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(innerWidth, innerHeight);
        });
        addEventListener('keydown', event => {
            this.keys.add(event.code);
            if (event.code === 'KeyE') this.interact();
            if (event.code === 'ShiftLeft') this.running = true;
        });
        addEventListener('keyup', event => {
            this.keys.delete(event.code);
            if (event.code === 'ShiftLeft') this.running = false;
        });
        this.renderer.domElement.addEventListener('click', () => {
            if (this.started && document.pointerLockElement !== this.renderer.domElement && matchMedia('(pointer:fine)').matches) {
                this.renderer.domElement.requestPointerLock();
            }
        });
        addEventListener('mousemove', event => {
            if (document.pointerLockElement === this.renderer.domElement) this.applyLook(event.movementX, event.movementY);
        });
        this.renderer.domElement.addEventListener('pointerdown', event => this.onPointerDown(event));
        this.renderer.domElement.addEventListener('pointermove', event => this.onPointerMove(event));
        this.renderer.domElement.addEventListener('pointerup', event => this.onPointerUp(event));
        this.renderer.domElement.addEventListener('pointercancel', event => this.onPointerUp(event));
        this.ui.start.addEventListener('click', () => this.startGame());
        this.ui.restart.addEventListener('click', () => location.reload());
        this.ui.sprint.addEventListener('click', event => {
            event.stopPropagation();
            this.running = !this.running;
            this.ui.sprint.classList.toggle('active', this.running);
            this.ui.sprint.textContent = `冲刺：${this.running ? '开' : '关'}`;
        });
        this.ui.interact.addEventListener('click', event => { event.stopPropagation(); this.interact(); });
        this.ui.mute.addEventListener('click', event => { event.stopPropagation(); this.toggleMute(); });
        
        this.ui.joystick.addEventListener('pointerdown', event => {
            event.stopPropagation();
            this.joyPointer = event.pointerId;
            this.touchOrigin.set(event.clientX, event.clientY);
            try {
                if (event.buttons !== 0 || event.pointerType === 'touch') this.ui.joystick.setPointerCapture(event.pointerId);
            } catch {}
        });
        this.ui.joystick.addEventListener('pointermove', event => {
            if (event.pointerId !== this.joyPointer) return;
            const delta = new THREE.Vector2(event.clientX, event.clientY).sub(this.touchOrigin).clampLength(0, 42);
            this.joystick.set(delta.x / 42, delta.y / 42);
            this.ui.stick.style.transform = `translate(${delta.x}px,${delta.y}px)`;
        });
        const releaseJoy = event => {
            if (event.pointerId !== this.joyPointer) return;
            try {
                if (this.ui.joystick.hasPointerCapture && this.ui.joystick.hasPointerCapture(event.pointerId)) {
                    this.ui.joystick.releasePointerCapture(event.pointerId);
                }
            } catch (e) {}
            this.joyPointer = null;
            this.joystick.set(0,0);
            this.ui.stick.style.transform = 'translate(0,0)';
        };
        this.ui.joystick.addEventListener('pointerup', releaseJoy);
        this.ui.joystick.addEventListener('pointercancel', releaseJoy);
    }

    onPointerDown(event) {
        if (!this.started || event.clientX < innerWidth * 0.38) return;
        this.lookPointer = event.pointerId;
        this.lastLook = new THREE.Vector2(event.clientX, event.clientY);
        try {
            if (event.buttons !== 0 || event.pointerType === 'touch') this.renderer.domElement.setPointerCapture(event.pointerId);
        } catch {}
    }

    onPointerMove(event) {
        if (event.pointerId !== this.lookPointer) return;
        const dx = event.clientX - this.lastLook.x;
        const dy = event.clientY - this.lastLook.y;
        this.lastLook.set(event.clientX, event.clientY);
        this.applyLook(dx, dy);
    }

    onPointerUp(event) {
        if (event.pointerId === this.lookPointer) {
            try {
                if (this.renderer.domElement.hasPointerCapture && this.renderer.domElement.hasPointerCapture(event.pointerId)) {
                    this.renderer.domElement.releasePointerCapture(event.pointerId);
                }
            } catch (e) {}
            this.lookPointer = null;
        }
    }

    applyLook(dx, dy) {
        this.yaw -= dx * 0.0033;
        this.pitch = THREE.MathUtils.clamp(this.pitch - dy * 0.0027, -1.12, 1.12);
    }

    startGame() {
        this.started = true;
        this.ui['start-screen'].style.display = 'none';
        this.unlockAudio();
        this.showMessage('找到三件逃生物品。不要让它看见你。', 3.5);
    }

    unlockAudio() {
        this.music = new Audio('assets/audio/hospital-dread-loop.mp3');
        this.music.loop = true;
        this.music.volume = 0.42;
        this.music.play().catch(() => {});
        this.shriek = new Audio('assets/audio/monster-shriek.mp3');
        this.shriek.volume = 0.72;
        this.pickupSound = new Audio('assets/audio/evidence-pickup.mp3');
        this.pickupSound.volume = 0.7;
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    toggleMute() {
        const muted = this.music ? !this.music.muted : false;
        [this.music, this.shriek, this.pickupSound].forEach(audio => { if (audio) audio.muted = muted; });
        this.ui.mute.textContent = muted ? '×' : '♪';
    }

    resetGame() {
        const start = this.findCell('P');
        this.camera.position.copy(this.cellToWorld(start.x, start.z));
        this.camera.position.y = 1.62;
        this.inventory = new Set();
        this.hidden = false;
        this.updateObjective();
    }

    updatePlayer(delta) {
        if (this.hidden) return;
        let inputX = this.joystick.x;
        let inputZ = this.joystick.y;
        if (this.keys.has('KeyA')) inputX -= 1;
        if (this.keys.has('KeyD')) inputX += 1;
        if (this.keys.has('KeyW')) inputZ -= 1;
        if (this.keys.has('KeyS')) inputZ += 1;
        const input = new THREE.Vector2(inputX, inputZ);
        if (input.lengthSq() > 1) input.normalize();
        const speed = this.running ? 5.6 : 3.25;
        const sin = Math.sin(this.yaw);
        const cos = Math.cos(this.yaw);
        this.velocity.x = (input.x * cos + input.y * sin) * speed;
        this.velocity.z = (-input.x * sin + input.y * cos) * speed;
        const nextX = this.camera.position.clone();
        nextX.x += this.velocity.x * delta;
        if (!this.collides(nextX)) this.camera.position.x = nextX.x;
        const nextZ = this.camera.position.clone();
        nextZ.z += this.velocity.z * delta;
        if (!this.collides(nextZ)) this.camera.position.z = nextZ.z;
        const moving = input.lengthSq() > 0.05;
        const bob = moving ? Math.sin(performance.now() * (this.running ? 0.013 : 0.009)) * 0.035 : 0;
        this.camera.position.y = 1.62 + bob;
        this.camera.rotation.set(this.pitch, this.yaw, 0);
    }

    collides(position) {
        return this.walls.some(wall => Math.abs(position.x - wall.x) < CELL / 2 + 0.28 && Math.abs(position.z - wall.z) < CELL / 2 + 0.28);
    }

    updateItems(delta) {
        const time = performance.now() * 0.001;
        this.items.forEach((item, index) => {
            item.rotation.y += delta * 0.65;
            item.position.y = item.userData.baseY + Math.sin(time * 1.8 + index) * 0.08;
        });
    }

    collectItem(item) {
        item.visible = false;
        this.inventory.add(item.userData.data.key);
        if (this.pickupSound) { this.pickupSound.currentTime = 0; this.pickupSound.play().catch(() => {}); }
        this.showMessage(`${item.userData.data.label}：${item.userData.data.message}`, 3.8);
        this.updateObjective();
        this.monsterAlerted = true;
    }

    enterLocker(locker) {
        this.hidden = true;
        this.activeLocker = locker;
        this.camera.position.set(locker.position.x, 1.6, locker.position.z);
        this.showMessage('你屏住呼吸，躲进了储物柜。', 2.2);
        this.ui.sprint.style.display = 'none';
    }

    leaveLocker() {
        this.hidden = false;
        const forward = new THREE.Vector3(0,0,1).applyAxisAngle(new THREE.Vector3(0,1,0), this.activeLocker.rotation.y);
        this.camera.position.addScaledVector(forward, 1.65);
        this.activeLocker = null;
        this.ui.sprint.style.display = 'block';
    }

    tryExit() {
        const requiredItems = CHAPTER_DATA[this.currentChapter].items;
        const hasAllItems = requiredItems.every(key => this.inventory.has(key));

        if (hasAllItems) {
            const nextId = CHAPTER_DATA[this.currentChapter].nextChapter;
            if (nextId) {
                const nextChapterTitle = CHAPTER_DATA[nextId].title;
                this.showMessage(`正在进入：${nextChapterTitle}`, 4);
                this.ended = true; // Temporary freeze
                setTimeout(() => {
                    this.ended = false;
                    this.loadChapter(nextId);
                }, 2000);
            } else {
                this.finish(true);
            }
        } else {
            this.showMessage(`门锁仍需要 ${requiredItems.length - this.inventory.size} 件物品。`, 2.3);
            this.monsterAlerted = true;
        }
    }

    updateObjective() {
        const chapter = CHAPTER_DATA[this.currentChapter];
        const requiredItems = chapter.items;
        let count = 0;
        requiredItems.forEach(key => { if (this.inventory.has(key)) count++; });

        this.ui['items-count'].textContent = `物品 ${count} / ${requiredItems.length}`;
        
        // 动态计算情报总数
        let totalStoryAvailable = 0;
        Object.values(STORY_ITEMS_DATA).forEach(list => totalStoryAvailable += list.length);
        this.ui['story-count'].textContent = `情报 ${this.storyCollected.size} / ${totalStoryAvailable}`;
        
        if (count < requiredItems.length) {
            this.ui['objective-text'].textContent = chapter.objective;
        } else {
            this.ui['objective-text'].textContent = '逃生路径已开启，寻找出口';
            if (this.exitDoor) {
                this.exitDoor.children[1].material.color.set(0x2f9b71);
                this.exitDoor.children[1].material.emissive.set(0x32c286);
            }
        }
    }

    updateMonster(delta) {
        if (!this.monster) return;
        const playerDistance = this.distance2D(this.camera.position, this.monster.position);
        const detectionRange = this.running ? 12 : 8;
        const canSee = !this.hidden && playerDistance < detectionRange && this.hasLineOfSight(this.monster.position, this.camera.position);
        if (canSee || (this.monsterAlerted && playerDistance < 15)) {
            this.monsterState = 'chase';
        }
        if (this.hidden && playerDistance > 5) {
            this.monsterState = 'patrol';
        }
        this.pathTimer -= delta;
        if (this.pathTimer <= 0) {
            this.pathTimer = this.monsterState === 'chase' ? 0.4 : 1.5;
            const target = this.monsterState === 'chase' ? this.worldToCell(this.camera.position) : this.randomOpenCell();
            this.monsterPath = this.findPath(this.worldToCell(this.monster.position), target).slice(1);
            this.monsterAlerted = false;
        }
        if (this.monsterPath.length) {
            const cell = this.monsterPath[0];
            const target = this.cellToWorld(cell.x, cell.z);
            const direction = target.sub(this.monster.position);
            direction.y = 0;
            if (direction.length() < 0.2) {
                this.monsterPath.shift();
            } else {
                direction.normalize();
                let speed = this.monsterState === 'chase' ? 3.5 : 1.2;
                
                // 第三章特殊逻辑：断开电力后怪物速度减慢
                if (this.currentChapter === 3) {
                    if (this.inventory.has('switchA')) speed *= 0.8;
                    if (this.inventory.has('switchB')) speed *= 0.8;
                }
                
                this.monster.position.addScaledVector(direction, speed * delta);
                this.monster.rotation.y = Math.atan2(direction.x, direction.z);
            }
        }
        const threat = THREE.MathUtils.clamp(1 - playerDistance / 13, 0, 1);
        this.ui.danger.style.opacity = this.monsterState === 'chase' ? String(threat * 0.78) : '0';
        this.flashlight.intensity = 15 + Math.sin(performance.now() * 0.045) * threat * 4;
        if (this.monsterState === 'chase' && playerDistance < 9 && performance.now() / 1000 - this.lastShriek > 8) {
            this.lastShriek = performance.now() / 1000;
            if (this.shriek) { this.shriek.currentTime = 0; this.shriek.play().catch(() => {}); }
            if (navigator.vibrate) navigator.vibrate([80,40,120]);
        }
        if (!this.hidden && playerDistance < 0.85) this.finish(false);
    }

    hasLineOfSight(from, to) {
        const distance = this.distance2D(from, to);
        const steps = Math.ceil(distance / 0.7);
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const point = new THREE.Vector3().lerpVectors(from, to, t);
            const cell = this.worldToCell(point);
            if (MAPS[this.currentChapter][cell.z]?.[cell.x] === '#' || MAPS[this.currentChapter][cell.z]?.[cell.x] === '*') return false;
        }
        return true;
    }

    findPath(start, goal) {
        if (!this.isOpen(goal.x, goal.z)) return [];
        const queue = [start];
        const cameFrom = new Map([[`${start.x},${start.z}`, null]]);
        const directions = [[1,0],[-1,0],[0,1],[0,-1]];
        while (queue.length) {
            const current = queue.shift();
            if (current.x === goal.x && current.z === goal.z) break;
            directions.forEach(([dx,dz]) => {
                const next = { x: current.x + dx, z: current.z + dz };
                const key = `${next.x},${next.z}`;
                if (this.isOpen(next.x,next.z) && !cameFrom.has(key)) {
                    cameFrom.set(key, current);
                    queue.push(next);
                }
            });
        }
        const goalKey = `${goal.x},${goal.z}`;
        if (!cameFrom.has(goalKey)) return [];
        const path = [];
        let current = goal;
        while (current) {
            path.push(current);
            current = cameFrom.get(`${current.x},${current.z}`);
        }
        return path.reverse();
    }

    randomOpenCell() {
        const opens = [];
        MAPS[this.currentChapter].forEach((row,z) => row.split('').forEach((cell,x) => { if (cell !== '#' && cell !== '*') opens.push({x,z}); }));
        return opens[Math.floor(Math.random() * opens.length)];
    }

    isOpen(x,z) {
        const map = MAPS[this.currentChapter];
        return Boolean(map[z] && map[z][x] && map[z][x] !== '#' && map[z][x] !== '*');
    }

    updateAudioPulse() {
        if (!this.audioContext || !this.monster) return;
        const distance = this.distance2D(this.camera.position, this.monster.position);
        if (distance < 8 && (!this.nextBeat || performance.now() > this.nextBeat)) {
            this.nextBeat = performance.now() + THREE.MathUtils.lerp(900, 360, 1 - distance / 8);
            const oscillator = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            oscillator.frequency.setValueAtTime(48, this.audioContext.currentTime);
            gain.gain.setValueAtTime(0.0001, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.12, this.audioContext.currentTime + 0.025);
            gain.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + 0.16);
            oscillator.connect(gain).connect(this.audioContext.destination);
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + 0.18);
        }
    }

    showMessage(text, seconds = 2) {
        this.ui['center-message'].textContent = text;
        this.ui['center-message'].classList.add('show');
        this.messageTimer = seconds;
    }

    finish(won) {
        this.ended = true;
        if (document.pointerLockElement) document.exitPointerLock();
        if (this.music) this.music.volume = won ? 0.18 : 0.08;

        let totalStoryAvailable = 0;
        Object.values(STORY_ITEMS_DATA).forEach(list => totalStoryAvailable += list.length);
        const collected = this.storyCollected.size;
        const collectionRate = collected / totalStoryAvailable;

        let endTitle = won ? '你逃出来了' : '巡房结束';
        let endCopy = '';

        if (!won) {
            endCopy = '最后一束手电光熄灭在空病房深处。';
        } else {
            if (collectionRate < 0.5) {
                endCopy = '结局 A：逃离者。你直接逃离了医院，这里的秘密将永远被埋没。';
            } else if (collectionRate < 0.8) {
                endCopy = '结局 B：揭露者。你选择将证据传送给外界，医院爆炸摧毁了现场。但没人相信你的故事。';
            } else if (collectionRate < 1.0) {
                endCopy = '结局 C：拯救者。你激活了自毁系统，彻底摧毁了这里的实验数据与所有变异体。你是一个无名英雄。';
            } else {
                endCopy = '结局 D：真相。你找齐了所有绝密日志，了解了整个实验的真正目的。你带出的绝密文件将改变世界。';
            }
        }

        this.ui['end-screen'].style.display = 'flex';
        this.ui['end-screen'].className = won ? 'win' : 'lose';
        this.ui['end-title'].textContent = endTitle;
        this.ui['end-copy'].textContent = endCopy;
        
        if (!won && this.shriek) { this.shriek.currentTime = 0; this.shriek.play().catch(() => {}); }
        if (navigator.vibrate) navigator.vibrate(won ? [80,60,80] : [250,80,350]);
    }

    findCell(symbol) {
        const map = MAPS[this.currentChapter];
        for (let z = 0; z < map.length; z++) {
            const x = map[z].indexOf(symbol);
            if (x >= 0) return { x, z };
        }
        return { x:1, z:1 };
    }

    cellToWorld(x,z) {
        const map = MAPS[this.currentChapter];
        return new THREE.Vector3((x - (map[0].length - 1) / 2) * CELL, 0, (z - (map.length - 1) / 2) * CELL);
    }

    worldToCell(position) {
        const map = MAPS[this.currentChapter];
        return {
            x: Math.round(position.x / CELL + (map[0].length - 1) / 2),
            z: Math.round(position.z / CELL + (map.length - 1) / 2)
        };
    }

    distance2D(a,b) {
        return Math.hypot(a.x - b.x, a.z - b.z);
    }

    async loadPropsAndMonster() {
        const monsterCell = this.findCell('M');
        this.monster = new THREE.Group();
        this.monster.position.copy(this.cellToWorld(monsterCell.x, monsterCell.z));
        this.scene.add(this.monster);
        try {
            const gltf = await this.loader.loadAsync('assets/models/hospital-stalker.glb');
            const model = gltf.scene;
            this.normalizeModel(model, 2.75);
            model.traverse(child => { if (child.isMesh) { child.castShadow = true; } });
            this.monster.add(model);
        } catch {
            this.createMonsterFallback();
        }
        await Promise.all([
            this.placePropModel('assets/models/abandoned-hospital-bed.glb', [[3,5,0],[11,3,1.57],[13,9,0]], 2.4),
            this.placePropModel('assets/models/rusty-wheelchair.glb', [[5,1,0.4],[3,11,-1.2],[11,15,2.2]], 1.55)
        ]);
        this.monsterEye = new THREE.PointLight(0x6e0007, 2.5, 4);
        this.monsterEye.position.set(0, 1.9, 0.2);
        this.monster.add(this.monsterEye);
    }

    normalizeModel(model, targetHeight) {
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const scale = targetHeight / Math.max(size.y, 0.01);
        model.scale.setScalar(scale);
        box.setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.x -= center.x;
        model.position.z -= center.z;
        model.position.y -= box.min.y;
    }

    async placePropModel(path, placements, targetHeight) {
        try {
            const gltf = await this.loader.loadAsync(path);
            placements.forEach(([x,z,r]) => {
                const clone = gltf.scene.clone(true);
                this.normalizeModel(clone, targetHeight);
                clone.position.copy(this.cellToWorld(x,z));
                clone.rotation.y = r;
                clone.traverse(child => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
                this.scene.add(clone);
            });
        } catch (error) {}
    }

    createMonsterFallback() {
        const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.38, 1.5, 4, 8), new THREE.MeshStandardMaterial({ color: 0xb8b8a7, roughness: 1 }));
        body.position.y = 1.35;
        this.monster.add(body);
    }

    createCeilingLight(position, broken) {
        const fixture = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 0.35), new THREE.MeshBasicMaterial({ color: broken ? 0x27302d : 0x8ca59d }));
        fixture.position.set(position.x, 3.82, position.z);
        this.scene.add(fixture);
        if (!broken) {
            const light = new THREE.PointLight(0x9ebdb4, 2.2, 7, 2);
            light.position.set(position.x, 3.45, position.z);
            this.scene.add(light);
        }
    }

    createItem(symbol, position) {
        const data = ITEM_DATA[symbol];
        const group = new THREE.Group();
        const color = symbol === 'F' ? 0xd4ae54 : (symbol === 'K' ? 0x8f2430 : 0xc8c0a3);
        const geometry = symbol === 'N' ? new THREE.BoxGeometry(0.75, 0.06, 0.55) : new THREE.BoxGeometry(0.55, 0.16, 0.36);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.3, roughness: 0.5 }));
        mesh.position.y = 0.85;
        group.add(mesh);
        const glow = new THREE.PointLight(color, 1.3, 3.5);
        glow.position.y = 1;
        group.add(glow);
        group.position.copy(position);
        group.userData = { symbol, data, baseY: 0.85 };
        this.scene.add(group);
        this.items.push(group);
    }

    createLocker(position) {
        const group = new THREE.Group();
        const body = new THREE.Mesh(new THREE.BoxGeometry(1.25, 2.7, 1.05), new THREE.MeshStandardMaterial({ color: 0x34443f, roughness: 0.82, metalness: 0.35 }));
        body.position.y = 1.35;
        const slit = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.25, 0.04), new THREE.MeshBasicMaterial({ color: 0x09110f }));
        slit.position.set(0, 1.85, -0.54);
        group.add(body, slit);
        group.position.copy(position);
        group.rotation.y = Math.PI;
        this.scene.add(group);
        this.hideSpots.push(group);
    }

    createExit(position) {
        this.exitPosition = position.clone();
        const frame = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0x3c5450, metalness: 0.5, roughness: 0.58 });
        const door = new THREE.Mesh(new THREE.BoxGeometry(2.6, 3.4, 0.28), mat);
        door.position.y = 1.7;
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.25, 0.18), new THREE.MeshStandardMaterial({ color: 0x4d0e13, emissive: 0x8d1019, emissiveIntensity: 2 }));
        lamp.position.set(0, 3.15, -0.25);
        frame.add(door, lamp);
        frame.position.copy(position);
        this.scene.add(frame);
        this.exitDoor = frame;
    }

    addBloodMarks() {
        const mat = new THREE.MeshBasicMaterial({ color: 0x310509, transparent: true, opacity: 0.7, depthWrite: false });
        [[3,3],[9,7],[14,12],[7,15]].forEach(([x,z], i) => {
            const stain = new THREE.Mesh(new THREE.CircleGeometry(0.35 + i * 0.12, 12), mat);
            stain.rotation.x = -Math.PI / 2;
            stain.position.copy(this.cellToWorld(x,z));
            stain.position.y = 0.012;
            stain.scale.set(2.5, 1, 1);
            this.scene.add(stain);
        });
    }

    async loadTexture(path, repeatX, repeatY) {
        const texture = await this.textureLoader.loadAsync(path);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(repeatX, repeatY);
        return texture;
    }
}
