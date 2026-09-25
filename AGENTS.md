# AGENTS.md

## Project summary and core loop
探索昏暗走廊、调查关键物品并逐步解锁逃生条件；同时观察危险红晕与心跳提示，在怪物的巡逻和追逐之间规划路线、躲藏并逃生。

## How to play / controls
在废弃医院中找齐保险丝、门禁卡和逃生密码，再前往出口开门。怪物接近时可冲刺逃跑，或靠近储物柜后点击“躲藏”避开追捕。
Controls: 移动端：左侧摇杆移动，右侧拖动转向，点击“冲刺”切换奔跑，靠近目标后点击情境按钮。桌面：WASD 移动、鼠标观察、Shift 冲刺、E 交互。

## Important files
- `/index.html` — entry point: importmap, canvas/DOM shell, script bootstrap
- `/rosebud-game-defaults.css` — project file
- `/rosebud-game-defaults.js` — game module
- `/rosie/README.md` — Rosie pre-built helper module
- `/rosie/controls/rosieControls.js` — Rosie pre-built helper module
- `/rosie/controls/rosieMobileControls.js` — Rosie pre-built helper module
- `/art_direction.md` — visual direction used for generated art
- `/sound_direction.md` — audio direction used for generated sound
- `/main.js` — game bootstrap and main loop
- `/game.js` — core game logic

## Assets and audio
Images: `assets/hospital-floor-tile.webp`, `assets/hospital-wall-tile.webp`, `assets/keycard-evidence.webp`, `assets/patient-file-evidence.webp`
Models: `assets/models/abandoned-hospital-bed.glb`, `assets/models/hospital-stalker.glb`, `assets/models/rusty-wheelchair.glb`
Audio: `assets/audio/evidence-pickup.mp3`, `assets/audio/hospital-dread-loop.mp3`, `assets/audio/monster-shriek.mp3`
Sound direction: - 音乐为低能量、持续压迫的废弃医院暗氛围，可循环。 - 核心音效：怪物近距离尖啸、拾取关键物品的金属提示音。
Playback note: reference media as `assets/...`; browsers start audio only after the first user gesture.

## Notes for future edits
场景采用 4 米网格，MAP 定义于 game.js；第一人称相机高度 1.62，墙高 4。自定义双区触控避免依赖第三人称 Rosie 控件。生成 GLB 面向本地 +Z，怪物根节点按移动方向旋转；材质和模型均使用 assets/... 相对路径。

## Final validation / runtime status
Static: 0 blocking, 8 advisory; runtime completed (0 error(s)); overall clean.
Finished via the `finish` tool.
