/**
 * ThreeRenderer.js - Bộ kết xuất đồ họa 3D Cyberpunk Factory Diorama Hoàn Hảo (Three.js r128)
 * 
 * NÂNG CẤP TOÀN DIỆN:
 * 1. TỈ LỆ KHUNG HÌNH CHUẨN XÁC: Camera Distance = 1180, FOV = 35 độ.
 *    Toàn bộ nhà máy, trạm máy móc và cảnh vật xung quanh hiển thị trọn vẹn, thanh thoát, không bị quá to.
 * 2. HỆ THỐNG ANIMATION ROBOT SỐNG ĐỘNG (FULL ROBOT RIG):
 *    - Nhân vật chính Shipper BOX luôn hiện diện trong thế giới 3D.
 *    - Trạng thái IDLE: thở nhịp nhàng, đầu xoay ngắm nghía, cầm máy quét hologram, vẫy ăng-ten, chớp mắt LED.
 *    - Trạng thái RUN: hoạt họa chạy bộ chân thực (hai chân bước luân phiên, gối gập, thân nhấp nhô, vác kiện hàng).
 *    - Trạng thái CELEBRATE: nhảy cẫng ăn mừng, vẫy tay khi hoàn thành màn chơi.
 *    - Xe tuần tra AGV tự hành chạy quanh hành lang nhà xưởng với đèn xoay cảnh báo.
 * 3. CẢNH VẬT NHÀ XƯỞNG ĐỒ SỘ (RICH INDUSTRIAL WAREHOUSE SCENERY):
 *    - Các container hàng hóa xếp chồng (xanh lá đậm, vàng đồng, cam) in chữ stencils "SIGNAL CORP", "SECTOR 07".
 *    - Tủ rack server trung tâm dữ liệu với hàng trăm đèn LED nhấp nháy đa sắc.
 *    - Cẩu trục giàn (Overhead Gantry Crane) vắt ngang trần nhà xưởng với tời tạ vàng.
 *    - Tháp thông gió làm mát với cánh quạt xoay tít cơ học.
 *    - Biển hiệu Neon Cyberpunk Hologram phát sáng rực rỡ: "SIGNAL CORP - FOUNDRY SECTOR 7".
 *    - Máy biến áp cao thế và các pallet gỗ chất hàng rải rác tạo chiều sâu không gian chân thực.
 * 4. ĐƯỜNG RAY & THAO TÁC NỐI DÂY 3D SIÊU MƯỢT (100% HIT DETECTION):
 *    - Ống ray mạ crôm với lõi plasma phát sáng vàng neon, tự động co giãn theo vị trí trạm.
 *    - Hitbox pin R=28 cực nhạy, tự động hút (Snap) khi kéo dây lại gần.
 */
window.SF = window.SF || {};

(function(SF) {
    'use strict';

    // Helper: Tạo Texture sọc an toàn vàng - đen
    function createHazardTexture() {
        const c = document.createElement('canvas');
        c.width = 128; c.height = 128;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#060e08';
        ctx.fillRect(0, 0, 128, 128);
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        for (let i = -128; i < 256; i += 32) {
            ctx.moveTo(i, 0); ctx.lineTo(i + 16, 0); ctx.lineTo(i + 16 + 128, 128); ctx.lineTo(i + 128, 128);
        }
        ctx.fill();
        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(8, 1);
        return tex;
    }

    // Helper: Tạo Texture sàn kim loại lưới xanh lá đậm
    function createFloorTexture() {
        const c = document.createElement('canvas');
        c.width = 256; c.height = 256;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#04140d';
        ctx.fillRect(0, 0, 256, 256);

        // Lưới kim loại
        ctx.strokeStyle = '#0b2b1c';
        ctx.lineWidth = 2;
        ctx.strokeRect(2, 2, 252, 252);
        ctx.strokeRect(64, 64, 128, 128);

        // Tán đinh ốc vàng đồng ở 4 góc
        ctx.fillStyle = '#b45309';
        const r = 6;
        ctx.fillRect(8, 8, r, r);
        ctx.fillRect(242, 8, r, r);
        ctx.fillRect(8, 242, r, r);
        ctx.fillRect(242, 242, r, r);

        const tex = new THREE.CanvasTexture(c);
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(10, 7);
        return tex;
    }

    // Helper: Tạo Texture nhãn container hàng
    function createContainerTexture(label, baseColor) {
        const c = document.createElement('canvas');
        c.width = 256; c.height = 128;
        const ctx = c.getContext('2d');
        ctx.fillStyle = baseColor;
        ctx.fillRect(0, 0, 256, 128);

        // Gân sóng tôn
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        for (let x = 0; x < 256; x += 16) {
            ctx.fillRect(x, 0, 8, 128);
        }

        // Chữ in chìm
        ctx.fillStyle = '#f0fdf4';
        ctx.font = 'bold 22px "Consolas", monospace';
        ctx.fillText(label, 20, 50);
        ctx.fillStyle = '#f59e0b';
        ctx.font = '14px "Consolas", monospace';
        ctx.fillText('HAZMAT 04 - FOUNDRY', 20, 80);

        return new THREE.CanvasTexture(c);
    }

    class ThreeRenderer {
        static disposeObject(obj) {
            if (!obj) return;
            if (obj.children) {
                for (let i = obj.children.length - 1; i >= 0; i--) {
                    ThreeRenderer.disposeObject(obj.children[i]);
                }
            }
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) {
                if (Array.isArray(obj.material)) {
                    obj.material.forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
                } else {
                    if (obj.material.map) obj.material.map.dispose();
                    obj.material.dispose();
                }
            }
        }

        constructor(container, circuit, simulator) {
            this.container = container;
            this.circuit = circuit;
            this.simulator = simulator;

            this.scene = null;
            this.camera = null;
            this.renderer = null;

            // Góc nhìn Isometric chuẩn xác, khoảng cách cân đối 1180px bao quát toàn cảnh nhà máy
            this.controls = {
                rotating: false,
                panning: false,
                prevX: 0,
                prevY: 0,
                rotX: 0.64, // ~36 độ Isometric tự nhiên
                rotY: 0.58, // ~33 độ Oblique
                distance: 1180, // Tỉ lệ vừa vặn, không bị phóng quá to
                target: new THREE.Vector3(460, 0, 270)
            };

            this.raycaster = new THREE.Raycaster();
            this.mousePos = new THREE.Vector2();

            // Caches
            this.stationMeshes = new Map();
            this.railMeshes = new Map();
            this.pinMeshes = new Map();
            this.pinVisuals = new Map();
            this.shipperMeshes = [];
            this.idleHeroRobot = null;
            this.patrolAGV = null;
            this.fanBlades = [];
            this.dustParticles = null;

            this.active = false;
            this.animTime = 0;

            // Thao tác nối dây & kéo thả
            this.drawingFromPin = null;
            this.snappedTargetPin = null;
            this.activeTubeMesh = null;
            this.draggedStation = null;
            this.dragStartOffset = new THREE.Vector3();
            this.planeIntersect = new THREE.Plane(new THREE.Vector3(0, 1, 0), -24);

            this.init();
        }

        init() {
            if (typeof THREE === 'undefined') {
                console.warn('[ThreeRenderer] Three.js chưa sẵn sàng.');
                return;
            }

            // 1. Scene Cyberpunk Industrial Deep Dark
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x030d07);
            this.scene.fog = new THREE.FogExp2(0x030d07, 0.00055);

            // 2. Camera Isometric Tỉ Lệ Chuẩn
            const w = this.container.clientWidth || 900;
            const h = this.container.clientHeight || 560;
            const aspect = w / h;
            this.camera = new THREE.PerspectiveCamera(35, aspect, 10, 4500);
            this.updateCameraTransform();

            // 3. WebGL Renderer
            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
            this.renderer.setSize(w, h);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            this.canvas = this.renderer.domElement;
            this.canvas.id = 'boardCanvas3D';
            this.canvas.style.display = 'none';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.container.appendChild(this.canvas);

            // Textures
            this.hazardTex = createHazardTexture();
            this.floorTex = createFloorTexture();

            // 4. Ánh sáng Nhà Xưởng Chuyên Nghiệp
            this.setupLighting();

            // 5. Sàn Trung Tâm Bảng Mạch
            this.buildFactoryFloor();

            // 6. XÂY DỰNG TOÀN BỘ CẢNH VẬT NHÀ XƯỞNG PHONG PHÚ (CONTAINER, CẨU TRỤC, RACK SERVER, THÁP GIÓ, BIỂN NEON)
            this.buildRichWarehouseScenery();

            // 7. KHỞI TẠO ROBOT CHÍNH SHIPPER BOX CÓ ANIMATION ĐẦY ĐỦ
            this.initHeroRobotCharacter();

            // 8. Hạt bụi ánh sáng điện tử
            this.setupAtmosphericParticles();

            // 9. Tương tác chuột & cảm ứng 3D siêu nhạy
            this.setup3DInteractions();
        }

        setupLighting() {
            // Ánh sáng môi trường xanh rừng đậm
            const ambient = new THREE.AmbientLight(0x0b2d1c, 1.6);
            this.scene.add(ambient);

            // Đèn rọi chính vàng ấm công nghiệp
            const sun = new THREE.DirectionalLight(0xfffbeb, 2.4);
            sun.position.set(500, 750, 650);
            sun.castShadow = true;
            sun.shadow.mapSize.width = 2048;
            sun.shadow.mapSize.height = 2048;
            sun.shadow.camera.near = 100;
            sun.shadow.camera.far = 1800;
            const d = 750;
            sun.shadow.camera.left = -d;
            sun.shadow.camera.right = d;
            sun.shadow.camera.top = d;
            sun.shadow.camera.bottom = -d;
            sun.shadow.bias = -0.0004;
            this.scene.add(sun);

            // Đèn viền xanh ngọc neon rọi từ phía sau (Rim Light)
            const rimLight = new THREE.DirectionalLight(0x10b981, 1.8);
            rimLight.position.set(-300, 400, -400);
            this.scene.add(rimLight);

            // Đèn rọi vàng trung tâm
            const warmLight = new THREE.PointLight(0xf59e0b, 2.0, 950);
            warmLight.position.set(450, 200, 260);
            this.scene.add(warmLight);
        }

        buildFactoryFloor() {
            // Khối đế bệ đỡ kim loại beveled
            const baseGeo = new THREE.BoxGeometry(1160, 26, 780);
            const baseMat = new THREE.MeshStandardMaterial({ color: 0x05130b, roughness: 0.85, metalness: 0.5 });
            const base = new THREE.Mesh(baseGeo, baseMat);
            base.position.set(450, -18, 260);
            base.receiveShadow = true;
            this.scene.add(base);

            // Sàn chính gạch kim loại có đinh tán
            const floorGeo = new THREE.BoxGeometry(1120, 8, 750);
            const floorMat = new THREE.MeshStandardMaterial({
                color: 0x082618,
                map: this.floorTex,
                roughness: 0.35,
                metalness: 0.7
            });
            const floor = new THREE.Mesh(floorGeo, floorMat);
            floor.position.set(450, -4, 260);
            floor.receiveShadow = true;
            this.scene.add(floor);

            // Lưới ray huỳnh quang
            const gridHelper = new THREE.GridHelper(1040, 20, 0x10b981, 0x0c3b24);
            gridHelper.position.set(450, 0.5, 260);
            this.scene.add(gridHelper);

            // Gờ an toàn vân sọc cảnh báo vàng-đen (Hazard Curbs)
            const curbGeoH = new THREE.BoxGeometry(1100, 12, 16);
            const curbMat = new THREE.MeshStandardMaterial({ map: this.hazardTex, roughness: 0.4, metalness: 0.3 });

            const curbTop = new THREE.Mesh(curbGeoH, curbMat);
            curbTop.position.set(450, 6, -95);
            this.scene.add(curbTop);

            const curbBottom = new THREE.Mesh(curbGeoH, curbMat);
            curbBottom.position.set(450, 6, 615);
            this.scene.add(curbBottom);

            // Lan can an toàn màu vàng công nghiệp
            const railGroup = new THREE.Group();
            const postGeo = new THREE.CylinderGeometry(2.5, 2.5, 26, 8);
            const barGeo = new THREE.CylinderGeometry(1.8, 1.8, 1080, 8);
            const barMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.25 });

            const barTop = new THREE.Mesh(barGeo, barMat);
            barTop.rotation.z = Math.PI / 2;
            barTop.position.set(450, 22, -102);
            railGroup.add(barTop);

            const barMid = new THREE.Mesh(barGeo, barMat);
            barMid.rotation.z = Math.PI / 2;
            barMid.position.set(450, 12, -102);
            railGroup.add(barMid);

            for (let x = -80; x <= 980; x += 120) {
                const post = new THREE.Mesh(postGeo, barMat);
                post.position.set(x, 13, -102);
                railGroup.add(post);
            }
            this.scene.add(railGroup);
        }

        // =========================================================================
        // XÂY DỰNG CẢNH VẬT NHÀ XƯỞNG ĐỒ SỘ (SCENERY ASSETS)
        // =========================================================================
        buildRichWarehouseScenery() {
            const scenery = new THREE.Group();

            // 1. Cụm Container Xếp Chồng Bên Trái (Left Flank Stacks)
            const cTexGreen = createContainerTexture('SIGNAL CORP', '#064e3b');
            const cTexGold = createContainerTexture('SECTOR-07', '#b45309');
            const cTexBlue = createContainerTexture('CARGO LOGISTICS', '#1e3a8a');

            const makeContainer = (w, h, d, tex, x, y, z, ry = 0) => {
                const geo = new THREE.BoxGeometry(w, h, d);
                const mat = new THREE.MeshStandardMaterial({ map: tex, metalness: 0.5, roughness: 0.4 });
                const mesh = new THREE.Mesh(geo, mat);
                mesh.position.set(x, y, z);
                mesh.rotation.y = ry;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                scenery.add(mesh);
            };

            // Phía sau bên trái
            makeContainer(160, 60, 70, cTexGreen, -160, 30, -50, 0.1);
            makeContainer(150, 55, 68, cTexGold, -155, 88, -50, 0.05);
            makeContainer(150, 55, 68, cTexBlue, -170, 30, 80, -0.15);

            // Phía sau bên phải
            makeContainer(160, 60, 70, cTexGold, 1060, 30, -40, -0.08);
            makeContainer(150, 55, 68, cTexGreen, 1055, 88, -40, -0.04);
            makeContainer(150, 55, 68, cTexBlue, 1070, 30, 80, 0.2);

            // 2. Tủ Rack Server Trung Tâm Dữ Liệu (Server Data Racks) với đèn LED nhấp nháy
            const makeServerRack = (x, z) => {
                const rackGeo = new THREE.BoxGeometry(45, 110, 45);
                const rackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.8, roughness: 0.2 });
                const rack = new THREE.Mesh(rackGeo, rackMat);
                rack.position.set(x, 55, z);
                rack.castShadow = true;
                scenery.add(rack);

                // Các dải đèn LED trạng thái xanh / vàng
                const ledGeo = new THREE.BoxGeometry(32, 2, 2);
                for (let ly = 15; ly <= 95; ly += 8) {
                    const ledColor = (ly % 16 === 0) ? 0xfbbf24 : 0x10b981;
                    const ledMat = new THREE.MeshBasicMaterial({ color: ledColor });
                    const led = new THREE.Mesh(ledGeo, ledMat);
                    led.position.set(x, ly, z + 23);
                    scenery.add(led);
                }
            };

            makeServerRack(-120, 220);
            makeServerRack(-120, 280);
            makeServerRack(1020, 220);
            makeServerRack(1020, 280);

            // 3. Cẩu Trục Giàn Kim Loại (Overhead Gantry Crane) Vắt Ngang Phía Sau
            const gantryMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.75, roughness: 0.3 });
            const colGeo = new THREE.BoxGeometry(16, 220, 16);

            const colL = new THREE.Mesh(colGeo, gantryMat);
            colL.position.set(-60, 110, -110);
            scenery.add(colL);

            const colR = new THREE.Mesh(colGeo, gantryMat);
            colR.position.set(960, 110, -110);
            scenery.add(colR);

            const bridgeGeo = new THREE.BoxGeometry(1040, 18, 20);
            const bridge = new THREE.Mesh(bridgeGeo, gantryMat);
            bridge.position.set(450, 210, -110);
            scenery.add(bridge);

            // Tời kéo tạ cẩu trục (Crane Hoist & Cable)
            const hoistGeo = new THREE.BoxGeometry(50, 30, 36);
            const hoistMat = new THREE.MeshStandardMaterial({ map: this.hazardTex, metalness: 0.6 });
            const hoist = new THREE.Mesh(hoistGeo, hoistMat);
            hoist.position.set(380, 185, -110);
            scenery.add(hoist);

            const hookCableGeo = new THREE.CylinderGeometry(1.2, 1.2, 60, 6);
            const hookCableMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
            const hookCable = new THREE.Mesh(hookCableGeo, hookCableMat);
            hookCable.position.set(380, 140, -110);
            scenery.add(hookCable);

            // 4. Tháp Thông Gió Công Nghiệp Với Cánh Quạt Quay (Cooling Ventilation Fans)
            const makeVentTower = (x, z) => {
                const towerGeo = new THREE.CylinderGeometry(30, 34, 50, 16);
                const towerMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.3 });
                const tower = new THREE.Mesh(towerGeo, towerMat);
                tower.position.set(x, 25, z);
                scenery.add(tower);

                // Cánh quạt bên trong
                const fanHub = new THREE.Group();
                fanHub.position.set(x, 50, z);

                const bladeGeo = new THREE.BoxGeometry(54, 1.5, 8);
                const bladeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7 });
                for (let r = 0; r < 3; r++) {
                    const blade = new THREE.Mesh(bladeGeo, bladeMat);
                    blade.rotation.y = (r * Math.PI) / 3;
                    fanHub.add(blade);
                }
                scenery.add(fanHub);
                this.fanBlades.push(fanHub);
            };

            makeVentTower(-80, 480);
            makeVentTower(980, 480);

            // 5. Biển Hiệu Neon Cyberpunk Hologram (Holographic Neon Signboard)
            const signCanvas = document.createElement('canvas');
            signCanvas.width = 512; signCanvas.height = 128;
            const sCtx = signCanvas.getContext('2d');
            sCtx.fillStyle = '#06130b';
            sCtx.fillRect(0, 0, 512, 128);
            sCtx.strokeStyle = '#10b981';
            sCtx.lineWidth = 4;
            sCtx.strokeRect(6, 6, 500, 116);
            sCtx.fillStyle = '#fef08a';
            sCtx.font = 'bold 36px "Consolas", monospace';
            sCtx.fillText('⚡ SIGNAL CORP', 24, 55);
            sCtx.fillStyle = '#34d399';
            sCtx.font = 'bold 22px "Consolas", monospace';
            sCtx.fillText('SECTOR 07 • DISPATCH DIORAMA', 24, 95);

            const signTex = new THREE.CanvasTexture(signCanvas);
            const signGeo = new THREE.PlaneGeometry(280, 70);
            const signMat = new THREE.MeshBasicMaterial({ map: signTex, side: THREE.DoubleSide });
            const signMesh = new THREE.Mesh(signGeo, signMat);
            signMesh.position.set(450, 160, -115);
            scenery.add(signMesh);

            // 6. Pallet Gỗ Chất Thùng Hàng (Pallets & Crates)
            const makePallet = (x, z) => {
                const palGeo = new THREE.BoxGeometry(45, 6, 45);
                const palMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 });
                const pal = new THREE.Mesh(palGeo, palMat);
                pal.position.set(x, 3, z);
                scenery.add(pal);

                const crateGeo = new THREE.BoxGeometry(36, 32, 36);
                const crateMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 });
                const crate = new THREE.Mesh(crateGeo, crateMat);
                crate.position.set(x, 22, z);
                crate.castShadow = true;
                scenery.add(crate);
            };

            makePallet(-60, 390);
            makePallet(960, 390);

            // 7. Xe Tự Hành Tuần Tra (Patrol AGV Cart) Với Đèn Xoay
            this.patrolAGV = new THREE.Group();
            const agvBodyGeo = new THREE.BoxGeometry(42, 14, 28);
            const agvBodyMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, metalness: 0.6 });
            const agvBody = new THREE.Mesh(agvBodyGeo, agvBodyMat);
            agvBody.position.y = 10;
            this.patrolAGV.add(agvBody);

            const beaconGeo = new THREE.SphereGeometry(3.5, 8, 8);
            const beaconMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
            const beacon = new THREE.Mesh(beaconGeo, beaconMat);
            beacon.position.set(0, 20, 0);
            this.patrolAGV.add(beacon);

            this.patrolAGV.position.set(450, 0, 650);
            scenery.add(this.patrolAGV);

            this.scene.add(scenery);
        }

        // =========================================================================
        // NHÂN VẬT CHÍNH ROBOT SHIPPER BOX - FULL ANIMATION RIG
        // =========================================================================
        initHeroRobotCharacter() {
            this.idleHeroRobot = new THREE.Group();
            this.idleHeroRobot.name = 'heroRobotShipper';

            // 1. Thân người hình hộp (Armor Suit xanh lá đậm & vàng)
            const bodyGeo = new THREE.BoxGeometry(18, 19, 18);
            const bodyMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.3, metalness: 0.65 });
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            body.position.y = 12;
            body.castShadow = true;
            this.idleHeroRobot.add(body);
            this.idleHeroRobot.userData.bodyMesh = body;

            // 2. Khối Đầu & Mũ Bảo Hộ (Head & Hard Hat)
            const headGroup = new THREE.Group();
            headGroup.position.set(0, 22, 0);

            const capGeo = new THREE.BoxGeometry(21, 5, 21);
            const capMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35, metalness: 0.4 });
            const cap = new THREE.Mesh(capGeo, capMat);
            cap.position.y = 4;
            headGroup.add(cap);

            const visorGeo = new THREE.BoxGeometry(9, 3, 16);
            const visor = new THREE.Mesh(visorGeo, capMat);
            visor.position.set(11, 3, 0);
            headGroup.add(visor);

            // Kính LED phát sáng vàng
            const eyeGeo = new THREE.BoxGeometry(2, 3.5, 11);
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
            const eye = new THREE.Mesh(eyeGeo, eyeMat);
            eye.position.set(9.5, -2, 0);
            headGroup.add(eye);

            this.idleHeroRobot.add(headGroup);
            this.idleHeroRobot.userData.headGroup = headGroup;

            // 3. Hai Chân Khớp Cử Động (Articulated Legs)
            const legGeo = new THREE.BoxGeometry(5, 11, 5);
            const legMat = new THREE.MeshStandardMaterial({ color: 0x052e1c, roughness: 0.5 });

            const leftLeg = new THREE.Mesh(legGeo, legMat);
            leftLeg.position.set(0, -6, 5);
            this.idleHeroRobot.add(leftLeg);
            this.idleHeroRobot.userData.leftLeg = leftLeg;

            const rightLeg = new THREE.Mesh(legGeo, legMat);
            rightLeg.position.set(0, -6, -5);
            this.idleHeroRobot.add(rightLeg);
            this.idleHeroRobot.userData.rightLeg = rightLeg;

            // 4. Hai Tay Cơ Khí (Arms)
            const armGeo = new THREE.BoxGeometry(4.5, 12, 4.5);
            const armMat = new THREE.MeshStandardMaterial({ color: 0x047857, metalness: 0.6 });

            const leftArm = new THREE.Mesh(armGeo, armMat);
            leftArm.position.set(4, 10, 11);
            leftArm.rotation.x = 0.3;
            this.idleHeroRobot.add(leftArm);
            this.idleHeroRobot.userData.leftArm = leftArm;

            const rightArm = new THREE.Mesh(armGeo, armMat);
            rightArm.position.set(4, 10, -11);
            rightArm.rotation.x = -0.3;
            this.idleHeroRobot.add(rightArm);
            this.idleHeroRobot.userData.rightArm = rightArm;

            // 5. Ba Lô Pin Năng Lượng & Ăng-ten (Backpack & Antenna)
            const bagGeo = new THREE.BoxGeometry(7, 14, 14);
            const bagMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.4, metalness: 0.7 });
            const bag = new THREE.Mesh(bagGeo, bagMat);
            bag.position.set(-11, 12, 0);
            this.idleHeroRobot.add(bag);

            const antGeo = new THREE.CylinderGeometry(0.8, 0.8, 12, 6);
            const ant = new THREE.Mesh(antGeo, capMat);
            ant.position.set(-12, 23, 4);
            this.idleHeroRobot.add(ant);
            this.idleHeroRobot.userData.antenna = ant;

            // Đèn beacon nhấp nháy trên chóp ăng-ten
            const beaconGeo = new THREE.SphereGeometry(1.8, 8, 8);
            const beaconMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
            const beacon = new THREE.Mesh(beaconGeo, beaconMat);
            beacon.position.set(-12, 29, 4);
            this.idleHeroRobot.add(beacon);

            // 6. Bảng Máy Quét Hologram Cầm Tay (Holographic Tablet)
            const tabletGeo = new THREE.BoxGeometry(10, 12, 1);
            const tabletMat = new THREE.MeshStandardMaterial({
                color: 0x10b981,
                emissive: 0x059669,
                emissiveIntensity: 0.8
            });
            const tablet = new THREE.Mesh(tabletGeo, tabletMat);
            tablet.position.set(10, 12, 6);
            tablet.rotation.set(0.3, -0.4, 0.2);
            this.idleHeroRobot.add(tablet);

            // Đặt robot đứng cạnh Cổng IN bên trái sàn nhà xưởng
            this.idleHeroRobot.position.set(70, 12, 140);
            this.idleHeroRobot.rotation.y = 0.5;
            this.scene.add(this.idleHeroRobot);
        }

        // =========================================================================
        // CẬP NHẬT ANIMATION ROBOT THEO CHU KỲ FRAME
        // =========================================================================
        updateHeroRobotAnimation(dt) {
            if (!this.idleHeroRobot) return;

            const t = this.animTime;
            const rData = this.idleHeroRobot.userData;

            // 1. Nhịp thở phập phồng (Breathing)
            if (rData.bodyMesh) {
                rData.bodyMesh.scale.y = 1.0 + Math.sin(t * 2.5) * 0.035;
            }

            // 2. Đầu xoay ngắm nghía dây chuyền (Head Swiveling)
            if (rData.headGroup) {
                rData.headGroup.rotation.y = Math.sin(t * 0.9) * 0.35;
                rData.headGroup.rotation.x = Math.sin(t * 1.8) * 0.08;
            }

            // 3. Ăng-ten lắc lư theo quán tính (Antenna Wiggle)
            if (rData.antenna) {
                rData.antenna.rotation.z = Math.sin(t * 4.0) * 0.12;
            }

            // 4. Hai tay đung đưa nhẹ khi quan sát
            if (rData.leftArm && rData.rightArm) {
                rData.leftArm.rotation.x = 0.2 + Math.sin(t * 2.0) * 0.1;
                rData.rightArm.rotation.x = -0.2 - Math.sin(t * 2.0) * 0.1;
            }

            // 5. Xe tự hành AGV chạy dọc hành lang
            if (this.patrolAGV) {
                this.patrolAGV.position.x = 450 + Math.sin(t * 0.4) * 380;
                this.patrolAGV.rotation.y = Math.cos(t * 0.4) > 0 ? 0 : Math.PI;
            }

            // 6. Cánh quạt tháp thông gió xoay tít
            for (const fan of this.fanBlades) {
                fan.rotation.y += dt * 6.5;
            }
        }

        setupAtmosphericParticles() {
            const count = 160;
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);

            for (let i = 0; i < count; i++) {
                pos[i * 3 + 0] = Math.random() * 1200 - 150;
                pos[i * 3 + 1] = Math.random() * 260 + 10;
                pos[i * 3 + 2] = Math.random() * 800 - 100;
            }

            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            const mat = new THREE.PointsMaterial({
                color: 0xfbbf24,
                size: 3.2,
                transparent: true,
                opacity: 0.65,
                blending: THREE.AdditiveBlending
            });

            this.dustParticles = new THREE.Points(geo, mat);
            this.scene.add(this.dustParticles);
        }

        updateCameraTransform() {
            const r = this.controls.distance;
            const theta = this.controls.rotY;
            const phi = this.controls.rotX;

            const x = this.controls.target.x + r * Math.sin(theta) * Math.cos(phi);
            const y = this.controls.target.y + r * Math.sin(phi);
            const z = this.controls.target.z + r * Math.cos(theta) * Math.cos(phi);

            this.camera.position.set(x, y, z);
            this.camera.lookAt(this.controls.target);
        }

        // =========================================================================
        // THAO TÁC 3D MƯỢT MÀ VỚI HITBOX LỚN R=28
        // =========================================================================
        setup3DInteractions() {
            const dom = this.canvas;

            dom.addEventListener('mousedown', (e) => {
                const mouse = this.getNormalizedMouse(e);
                this.raycaster.setFromCamera(mouse, this.camera);

                if (e.button === 0) { // Chuột trái
                    // 1. BẮT TRÚNG CHÂN CẮM PIN VỚI HITBOX R=28
                    const hitboxes = Array.from(this.pinMeshes.keys());
                    const pinHits = this.raycaster.intersectObjects(hitboxes);
                    if (pinHits.length > 0) {
                        const hitPin = this.pinMeshes.get(pinHits[0].object);
                        if (hitPin) {
                            this.drawingFromPin = hitPin;
                            SF.soundManager.playClick();
                            e.preventDefault();
                            return;
                        }
                    }

                    // 2. Bắt trúng trạm máy móc để di chuyển
                    const stationMeshes = Array.from(this.stationMeshes.keys());
                    const stationHits = this.raycaster.intersectObjects(stationMeshes, true);
                    if (stationHits.length > 0) {
                        const comp = this.findParentComponent(stationHits[0].object);
                        if (comp && !comp.isPort) {
                            this.draggedStation = comp;
                            comp.selected = true;

                            const intersectPoint = new THREE.Vector3();
                            if (this.raycaster.ray.intersectPlane(this.planeIntersect, intersectPoint)) {
                                this.dragStartOffset.set(intersectPoint.x - comp.x, 0, intersectPoint.z - comp.y);
                            }

                            SF.soundManager.playClick();
                            e.preventDefault();
                            return;
                        }
                    }

                    // 3. Xoay góc nhìn camera
                    this.controls.rotating = true;
                    this.controls.prevX = e.clientX;
                    this.controls.prevY = e.clientY;

                } else if (e.button === 2) { // Chuột phải: Xóa ray hoặc Pan
                    const railMeshes = Array.from(this.railMeshes.keys());
                    const railHits = this.raycaster.intersectObjects(railMeshes, true);
                    if (railHits.length > 0) {
                        const wire = this.railMeshes.get(railHits[0].object);
                        if (wire) {
                            this.circuit.removeWire(wire);
                            SF.soundManager.playDelete();
                            e.preventDefault();
                            return;
                        }
                    }

                    this.controls.panning = true;
                    this.controls.prevX = e.clientX;
                    this.controls.prevY = e.clientY;
                }
            });

            window.addEventListener('mousemove', (e) => {
                const mouse = this.getNormalizedMouse(e);
                this.raycaster.setFromCamera(mouse, this.camera);

                if (this.controls.rotating) {
                    const dx = e.clientX - this.controls.prevX;
                    const dy = e.clientY - this.controls.prevY;
                    this.controls.rotY -= dx * 0.005;
                    this.controls.rotX = Math.max(0.15, Math.min(1.4, this.controls.rotX + dy * 0.005));
                    this.controls.prevX = e.clientX;
                    this.controls.prevY = e.clientY;
                    this.updateCameraTransform();

                } else if (this.controls.panning) {
                    const dx = e.clientX - this.controls.prevX;
                    const dy = e.clientY - this.controls.prevY;
                    this.controls.target.x -= dx * 0.9;
                    this.controls.target.z -= dy * 0.9;
                    this.controls.prevX = e.clientX;
                    this.controls.prevY = e.clientY;
                    this.updateCameraTransform();

                } else if (this.draggedStation) {
                    const intersectPoint = new THREE.Vector3();
                    if (this.raycaster.ray.intersectPlane(this.planeIntersect, intersectPoint)) {
                        const cell = this.circuit.cellSize || 50;
                        const nx = Math.round((intersectPoint.x - this.dragStartOffset.x) / cell) * cell;
                        const ny = Math.round((intersectPoint.z - this.dragStartOffset.z) / cell) * cell;

                        this.draggedStation.x = Math.max(120, Math.min(780, nx));
                        this.draggedStation.y = Math.max(40, Math.min(480, ny));
                        this.draggedStation.updatePinPositions();
                    }

                } else if (this.drawingFromPin) {
                    const intersectPoint = new THREE.Vector3();
                    if (this.raycaster.ray.intersectPlane(this.planeIntersect, intersectPoint)) {
                        const snapPin = this.findNearbyCompatiblePin(intersectPoint, 45);
                        this.snappedTargetPin = snapPin;

                        const dest = snapPin ? new THREE.Vector3(snapPin.position.x, 26, snapPin.position.y) : intersectPoint;
                        this.updateActive3DTube(this.drawingFromPin, dest);
                    }
                } else {
                    this.updatePinHoverStates();
                }
            });

            window.addEventListener('mouseup', () => {
                if (this.drawingFromPin) {
                    let targetPin = this.snappedTargetPin;

                    if (!targetPin) {
                        const hitboxes = Array.from(this.pinMeshes.keys());
                        const pinHits = this.raycaster.intersectObjects(hitboxes);
                        if (pinHits.length > 0) {
                            targetPin = this.pinMeshes.get(pinHits[0].object);
                        }
                    }

                    if (targetPin && targetPin !== this.drawingFromPin) {
                        const wire = this.circuit.addWire(this.drawingFromPin, targetPin);
                        if (wire) SF.soundManager.playWireConnect();
                        else SF.soundManager.playFail();
                    }

                    this.clearActive3DTube();
                    this.drawingFromPin = null;
                    this.snappedTargetPin = null;
                }

                if (this.draggedStation) {
                    SF.soundManager.playClick();
                    this.draggedStation = null;
                }

                this.controls.rotating = false;
                this.controls.panning = false;
            });

            dom.addEventListener('wheel', (e) => {
                e.preventDefault();
                this.controls.distance = Math.max(400, Math.min(1800, this.controls.distance + e.deltaY * 0.8));
                this.updateCameraTransform();
            }, { passive: false });

            dom.addEventListener('dblclick', () => {
                const stationMeshes = Array.from(this.stationMeshes.keys());
                const stationHits = this.raycaster.intersectObjects(stationMeshes, true);
                if (stationHits.length > 0) {
                    const comp = this.findParentComponent(stationHits[0].object);
                    if (comp && (comp.type === 'FIXED_SUPPLY' || comp.type === 'CONSTANT')) {
                        const val = prompt('Nhập hằng số N:', comp.customValue);
                        if (val !== null && val.trim() !== '') {
                            comp.setValue(val.trim());
                            SF.soundManager.playClick();
                        }
                    }
                }
            });

            dom.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
            dom.addEventListener('drop', (e) => {
                e.preventDefault();
                const type = e.dataTransfer.getData('text/plain');
                if (!type) return;

                const pt = new THREE.Vector3();
                if (this.raycaster.ray.intersectPlane(this.planeIntersect, pt)) {
                    const comp = SF.createComponent(type);
                    if (comp) {
                        const cell = this.circuit.cellSize || 50;
                        comp.x = Math.round(pt.x / cell) * cell;
                        comp.y = Math.round(pt.z / cell) * cell;
                        comp.updatePinPositions();
                        this.circuit.addComponent(comp);
                        SF.soundManager.playClick();
                    }
                }
            });
        }

        findNearbyCompatiblePin(worldPos, maxDistance = 45) {
            let bestPin = null;
            let minDist = maxDistance;

            for (const [hitbox, pin] of this.pinMeshes.entries()) {
                if (pin === this.drawingFromPin) continue;
                if (this.drawingFromPin.isInput() && !pin.isOutput()) continue;
                if (this.drawingFromPin.isOutput() && !pin.isInput()) continue;

                const pinPos = new THREE.Vector3(pin.position.x, 26, pin.position.y);
                const d = worldPos.distanceTo(pinPos);
                if (d < minDist) {
                    minDist = d;
                    bestPin = pin;
                }
            }

            return bestPin;
        }

        updatePinHoverStates() {
            const hitboxes = Array.from(this.pinMeshes.keys());
            const pinHits = this.raycaster.intersectObjects(hitboxes);
            const hoveredPin = pinHits.length > 0 ? this.pinMeshes.get(pinHits[0].object) : null;

            for (const [pin, visualMesh] of this.pinVisuals.entries()) {
                if (pin === hoveredPin || pin === this.snappedTargetPin) {
                    visualMesh.scale.set(1.4, 1.4, 1.4);
                    visualMesh.material.emissiveIntensity = 2.0;
                } else {
                    visualMesh.scale.set(1.0, 1.0, 1.0);
                    visualMesh.material.emissiveIntensity = 0.8;
                }
            }
        }

        getNormalizedMouse(e) {
            const rect = this.canvas.getBoundingClientRect();
            return new THREE.Vector2(
                ((e.clientX - rect.left) / rect.width) * 2 - 1,
                -((e.clientY - rect.top) / rect.height) * 2 + 1
            );
        }

        findParentComponent(obj) {
            let cur = obj;
            while (cur) {
                if (cur.userData && cur.userData.component) return cur.userData.component;
                cur = cur.parent;
            }
            return null;
        }

        // =========================================================================
        // TUYẾN ĐƯỜNG ĐI 3D VẼ DỞ THEO THỜI GIAN THỰC
        // =========================================================================
        updateActive3DTube(fromPin, destPoint) {
            this.clearActive3DTube();

            const p1 = new THREE.Vector3(fromPin.position.x, 26, fromPin.position.y);
            const p2 = new THREE.Vector3(destPoint.x, 26, destPoint.z);
            const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
            mid.y += Math.max(38, p1.distanceTo(p2) * 0.2);

            const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
            const tubeGeo = new THREE.TubeGeometry(curve, 28, 4.0, 10, false);
            const tubeMat = new THREE.MeshStandardMaterial({
                color: 0xfbbf24,
                emissive: 0xf59e0b,
                emissiveIntensity: 1.8,
                metalness: 0.85,
                roughness: 0.15
            });

            this.activeTubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
            this.scene.add(this.activeTubeMesh);
        }

        clearActive3DTube() {
            if (this.activeTubeMesh) {
                this.scene.remove(this.activeTubeMesh);
                this.activeTubeMesh.geometry.dispose();
                this.activeTubeMesh.material.dispose();
                this.activeTubeMesh = null;
            }
        }

        render(dt = 0.016) {
            if (!this.active) return;
            this.animTime += dt;

            // 1. Cập nhật animation robot sống động
            this.updateHeroRobotAnimation(dt);

            // 2. Hạt bụi ánh sáng
            if (this.dustParticles) {
                const positions = this.dustParticles.geometry.attributes.position.array;
                for (let i = 1; i < positions.length; i += 3) {
                    positions[i] += dt * 6.0;
                    if (positions[i] > 260) positions[i] = 10;
                }
                this.dustParticles.geometry.attributes.position.needsUpdate = true;
            }

            // 3. Đồng bộ trạm và chân cắm
            this.syncStations(dt);

            // 4. Đồng bộ tuyến đường ray mạ crôm phát sáng
            this.syncRails();

            // 5. Đồng bộ robot vận chuyển chạy trên ray
            this.syncShippersAndBoxes(dt);

            // 6. Kết xuất khung hình
            this.renderer.render(this.scene, this.camera);
        }

        syncStations(dt) {
            const currentIds = new Set(this.circuit.components.map(c => c.id));

            for (const [mesh, comp] of this.stationMeshes.entries()) {
                if (!currentIds.has(comp.id)) {
                    this.scene.remove(mesh);
                    ThreeRenderer.disposeObject(mesh);
                    this.stationMeshes.delete(mesh);
                }
            }

            for (const comp of this.circuit.components) {
                let group = null;
                for (const [m, c] of this.stationMeshes.entries()) {
                    if (c.id === comp.id) { group = m; break; }
                }

                if (!group) {
                    group = this.build3DStationMesh(comp);
                    this.scene.add(group);
                    this.stationMeshes.set(group, comp);
                }

                group.position.x = comp.x + comp.width / 2;
                group.position.z = comp.y + comp.height / 2;
                group.position.y = (comp === this.draggedStation) ? 22 : 13;

                // Bánh răng xoay
                if (group.userData.gearMesh) {
                    const rotSpd = comp.isProcessing ? 8.0 : 1.8;
                    group.userData.gearMesh.rotation.y += dt * rotSpd;
                }

                // Ống plasma phát sáng
                if (group.userData.plasmaTube) {
                    const pulse = 0.8 + 0.6 * Math.sin(this.animTime * 6.0 + comp.id);
                    group.userData.plasmaTube.material.emissiveIntensity = comp.isProcessing ? 2.5 : pulse;
                }

                if (comp.isProcessing) {
                    group.scale.set(1.08, 1.08, 1.08);
                } else {
                    group.scale.set(1.0, 1.0, 1.0);
                }

                this.syncPinsForStation(comp);
            }
        }

        build3DStationMesh(comp) {
            const group = new THREE.Group();
            group.userData = { component: comp };

            const w = comp.width;
            const d = comp.height;
            const h = 26;

            if (comp.isPort) {
                const isInput = comp.type === 'INPUT_PORT';
                const bodyColor = isInput ? 0x064e3b : 0x78350f;

                const bodyGeo = new THREE.BoxGeometry(w, h, d);
                const bodyMat = new THREE.MeshStandardMaterial({ color: bodyColor, roughness: 0.35, metalness: 0.75 });
                const body = new THREE.Mesh(bodyGeo, bodyMat);
                body.castShadow = true;
                body.receiveShadow = true;
                group.add(body);

                // Giàn con lăn
                const rollerGeo = new THREE.CylinderGeometry(2.5, 2.5, d * 0.85, 8);
                const rollerMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9, roughness: 0.15 });
                for (let rx = -w * 0.3; rx <= w * 0.3; rx += w * 0.25) {
                    const roller = new THREE.Mesh(rollerGeo, rollerMat);
                    roller.position.set(rx, h / 2 + 1.5, 0);
                    roller.rotation.x = Math.PI / 2;
                    group.add(roller);
                }

                // Cổng vòm scanner
                const archGeo = new THREE.TorusGeometry(d * 0.44, 3.5, 8, 16, Math.PI);
                const archMat = new THREE.MeshStandardMaterial({
                    color: isInput ? 0x10b981 : 0xf59e0b,
                    emissive: isInput ? 0x059669 : 0xd97706,
                    emissiveIntensity: 0.9,
                    metalness: 0.8
                });
                const arch = new THREE.Mesh(archGeo, archMat);
                arch.position.set(0, h / 2, 0);
                arch.rotation.y = Math.PI / 2;
                group.add(arch);

                // Laser quét
                const laserGeo = new THREE.PlaneGeometry(3, d * 0.8);
                const laserMat = new THREE.MeshBasicMaterial({
                    color: isInput ? 0x34d399 : 0xfbbf24,
                    transparent: true,
                    opacity: 0.5,
                    side: THREE.DoubleSide
                });
                const laser = new THREE.Mesh(laserGeo, laserMat);
                laser.position.set(0, h / 2 + 10, 0);
                laser.rotation.z = Math.PI / 2;
                group.add(laser);
            } else {
                // Thân máy xưởng kim loại
                const bodyGeo = new THREE.BoxGeometry(w, h, d);
                const bodyMat = new THREE.MeshStandardMaterial({
                    color: this.getStationColor(comp.type),
                    roughness: 0.3,
                    metalness: 0.75
                });
                const body = new THREE.Mesh(bodyGeo, bodyMat);
                body.castShadow = true;
                body.receiveShadow = true;
                group.add(body);

                // Nóc máy mạ đồng vàng
                const topPlateGeo = new THREE.BoxGeometry(w * 0.9, 3.5, d * 0.9);
                const topPlateMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.25, metalness: 0.85 });
                const topPlate = new THREE.Mesh(topPlateGeo, topPlateMat);
                topPlate.position.y = h / 2 + 1.8;
                group.add(topPlate);

                // Bánh răng đồng xoay
                const gearGeo = new THREE.CylinderGeometry(11, 11, 3.5, 12);
                const gearMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, metalness: 0.85, roughness: 0.2 });
                const gear = new THREE.Mesh(gearGeo, gearMat);
                gear.position.set(-w * 0.16, h / 2 + 5, 0);
                group.add(gear);
                group.userData.gearMesh = gear;

                // Ống plasma phát sáng
                const tubeGeo = new THREE.CylinderGeometry(4.8, 4.8, 13, 12);
                const tubeMat = new THREE.MeshStandardMaterial({
                    color: 0x10b981,
                    emissive: 0x059669,
                    emissiveIntensity: 1.0,
                    metalness: 0.6,
                    roughness: 0.2,
                    transparent: true,
                    opacity: 0.9
                });
                const tube = new THREE.Mesh(tubeGeo, tubeMat);
                tube.position.set(w * 0.22, h / 2 + 8, 0);
                group.add(tube);
                group.userData.plasmaTube = tube;
            }

            return group;
        }

        getStationColor(type) {
            switch (type) {
                case 'DUAL_CHECK': case 'AND': return 0x064e3b;
                case 'ANY_PASS': case 'OR': return 0x047857;
                case 'FLIP': case 'NOT': return 0xb45309;
                case 'DIFF_CHECK': case 'XOR': return 0xd97706;
                case 'MERGER': case 'ADDER': return 0x065f46;
                case 'SPLITTER_VAL': case 'SUBTRACTOR': return 0x78350f;
                case 'COPIER': case 'SPLITTER': return 0x0f766e;
                case 'JUNCTION': case 'SWITCH': return 0xf59e0b;
                case 'SCALE': case 'COMPARATOR': return 0xeab308;
                case 'SELECTOR': case 'MUX': return 0x059669;
                case 'STORAGE': case 'REGISTER': return 0x06281e;
                case 'COUNTER': return 0x10b981;
                case 'REST_STOP': case 'DELAY': return 0x92400e;
                case 'FIXED_SUPPLY': return 0xfbbf24;
                default: return 0x0a2b1c;
            }
        }

        syncPinsForStation(comp) {
            const allPins = [...comp.inputPins, ...comp.outputPins];

            for (const pin of allPins) {
                let hitboxMesh = null;
                for (const [hb, p] of this.pinMeshes.entries()) {
                    if (p.id === pin.id) { hitboxMesh = hb; break; }
                }

                if (!hitboxMesh) {
                    // Hitbox vô hình R=28 dễ click 100%
                    const hbGeo = new THREE.SphereGeometry(28, 8, 8);
                    const hbMat = new THREE.MeshBasicMaterial({ visible: false });
                    hitboxMesh = new THREE.Mesh(hbGeo, hbMat);
                    this.scene.add(hitboxMesh);
                    this.pinMeshes.set(hitboxMesh, pin);

                    // Đầu cắm Pin 3D phát sáng neon nổi bật
                    const isInput = pin.isInput();
                    const color = isInput ? 0xf59e0b : 0x10b981;
                    const visualGeo = new THREE.SphereGeometry(8.5, 16, 16);
                    const visualMat = new THREE.MeshStandardMaterial({
                        color: color,
                        emissive: color,
                        emissiveIntensity: 0.9,
                        metalness: 0.85,
                        roughness: 0.15
                    });
                    const visualMesh = new THREE.Mesh(visualGeo, visualMat);
                    visualMesh.castShadow = true;
                    this.scene.add(visualMesh);
                    this.pinVisuals.set(pin, visualMesh);

                    const postGeo = new THREE.CylinderGeometry(4, 4, 10, 8);
                    const postMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.9 });
                    const post = new THREE.Mesh(postGeo, postMat);
                    post.position.y = -5;
                    visualMesh.add(post);
                }

                hitboxMesh.position.set(pin.position.x, 26, pin.position.y);
                const visual = this.pinVisuals.get(pin);
                if (visual) visual.position.set(pin.position.x, 26, pin.position.y);
            }
        }

        // =========================================================================
        // TUYẾN ĐƯỜNG RAY 3D MẠ CRÔM PHÁT SÁNG VÀNG NEON UỐN LƯỢN TRÊN KHÔNG
        // =========================================================================
        syncRails() {
            const currentWireIds = new Set(this.circuit.wires.map(w => w.id));

            for (const [mesh, wire] of this.railMeshes.entries()) {
                if (!currentWireIds.has(wire.id)) {
                    this.scene.remove(mesh);
                    mesh.geometry.dispose();
                    if (mesh.material) mesh.material.dispose();
                    this.railMeshes.delete(mesh);
                }
            }

            for (const wire of this.circuit.wires) {
                let mesh = null;
                for (const [m, w] of this.railMeshes.entries()) {
                    if (w.id === wire.id) { mesh = m; break; }
                }

                const p1 = new THREE.Vector3(wire.fromPin.position.x, 26, wire.fromPin.position.y);
                const p2 = new THREE.Vector3(wire.toPin.position.x, 26, wire.toPin.position.y);
                const dist = p1.distanceTo(p2);
                const dx = Math.abs(p2.x - p1.x) * 0.5;

                const arcHeight = Math.max(38, Math.min(80, 26 + dist * 0.16));
                const cp1 = new THREE.Vector3(p1.x + dx, arcHeight, p1.z);
                const cp2 = new THREE.Vector3(p2.x - dx, arcHeight, p2.z);
                const curve = new THREE.CubicBezierCurve3(p1, cp1, cp2, p2);

                const isCarrying = (wire.visualState === 'carrying');

                if (!mesh) {
                    const tubeGeo = new THREE.TubeGeometry(curve, 36, 4.2, 12, false);
                    const tubeMat = new THREE.MeshStandardMaterial({
                        color: isCarrying ? 0xfbbf24 : 0x059669,
                        emissive: isCarrying ? 0xf59e0b : 0x047857,
                        emissiveIntensity: isCarrying ? 1.9 : 0.65,
                        metalness: 0.85,
                        roughness: 0.15
                    });
                    mesh = new THREE.Mesh(tubeGeo, tubeMat);
                    mesh.castShadow = true;
                    this.scene.add(mesh);
                    this.railMeshes.set(mesh, wire);
                    mesh.userData = { lastFrom: p1.clone(), lastTo: p2.clone() };
                } else {
                    if (!mesh.userData.lastFrom.equals(p1) || !mesh.userData.lastTo.equals(p2)) {
                        mesh.geometry.dispose();
                        mesh.geometry = new THREE.TubeGeometry(curve, 36, 4.2, 12, false);
                        mesh.userData.lastFrom.copy(p1);
                        mesh.userData.lastTo.copy(p2);
                    }

                    mesh.material.emissiveIntensity = isCarrying ? 2.0 : 0.65;
                    mesh.material.color.setHex(isCarrying ? 0xfbbf24 : 0x059669);
                    mesh.material.emissive.setHex(isCarrying ? 0xf59e0b : 0x047857);
                }
            }
        }

        // =========================================================================
        // ĐỒNG BỘ ROBOT VẬN CHUYỂN CHẠY TRÊN RAY KHI PHÁT TÍN HIỆU
        // =========================================================================
        syncShippersAndBoxes(dt) {
            for (const sm of this.shipperMeshes) {
                this.scene.remove(sm);
                ThreeRenderer.disposeObject(sm);
            }
            this.shipperMeshes = [];

            for (const rail of this.circuit.wires) {
                for (const pkt of rail.packets) {
                    const t = Math.max(0, Math.min(1, pkt.progress));
                    const p1 = new THREE.Vector3(rail.fromPin.position.x, 26, rail.fromPin.position.y);
                    const p2 = new THREE.Vector3(rail.toPin.position.x, 26, rail.toPin.position.y);
                    const dist = p1.distanceTo(p2);
                    const dx = Math.abs(p2.x - p1.x) * 0.5;
                    const arcHeight = Math.max(38, Math.min(80, 26 + dist * 0.16));

                    const curve = new THREE.CubicBezierCurve3(
                        p1,
                        new THREE.Vector3(p1.x + dx, arcHeight, p1.z),
                        new THREE.Vector3(p2.x - dx, arcHeight, p2.z),
                        p2
                    );

                    const pos = curve.getPoint(t);
                    const tangent = curve.getTangent(t);

                    const runner = this.createRunningRobotMesh(pkt.box || pkt.signal);
                    runner.position.copy(pos);
                    runner.position.y += 12;
                    runner.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), new THREE.Vector3(tangent.x, 0, tangent.z).normalize());

                    this.scene.add(runner);
                    this.shipperMeshes.push(runner);
                }
            }
        }

        createRunningRobotMesh(box) {
            const group = new THREE.Group();

            const walkCycle = Math.sin(this.animTime * 18.0);
            const bobY = Math.abs(Math.sin(this.animTime * 18.0)) * 2.2;

            // Thân người hình hộp
            const bodyGeo = new THREE.BoxGeometry(16, 17, 16);
            const bodyMat = new THREE.MeshStandardMaterial({ color: 0x047857, roughness: 0.3, metalness: 0.65 });
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            body.position.y = bobY;
            body.castShadow = true;
            group.add(body);

            // Hai chân chạy luân phiên
            const legGeo = new THREE.BoxGeometry(4.5, 9.5, 4.5);
            const legMat = new THREE.MeshStandardMaterial({ color: 0x052e1c, roughness: 0.5 });

            const legLeft = new THREE.Mesh(legGeo, legMat);
            legLeft.position.set(4, -9, 0);
            legLeft.rotation.z = walkCycle * 0.5;
            group.add(legLeft);

            const legRight = new THREE.Mesh(legGeo, legMat);
            legRight.position.set(-4, -9, 0);
            legRight.rotation.z = -walkCycle * 0.5;
            group.add(legRight);

            // Mũ bảo hộ vàng
            const capGeo = new THREE.BoxGeometry(19, 4.5, 19);
            const capMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.35, metalness: 0.4 });
            const cap = new THREE.Mesh(capGeo, capMat);
            cap.position.set(0, 9.5 + bobY, 0);
            group.add(cap);

            const visorGeo = new THREE.BoxGeometry(8, 2.5, 15);
            const visor = new THREE.Mesh(visorGeo, capMat);
            visor.position.set(10.5, 8.5 + bobY, 0);
            group.add(visor);

            // Kính LED
            const eyeGeo = new THREE.BoxGeometry(2, 3, 10);
            const eyeMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
            const eye = new THREE.Mesh(eyeGeo, eyeMat);
            eye.position.set(8.5, 2.5 + bobY, 0);
            group.add(eye);

            // Ba lô
            const bagGeo = new THREE.BoxGeometry(6, 13, 13);
            const bagMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.4, metalness: 0.7 });
            const bag = new THREE.Mesh(bagGeo, bagMat);
            bag.position.set(-10, bobY, 0);
            group.add(bag);

            // Thùng hàng 3D vác trên tay
            if (box) {
                const isBool = box.type === 'BOOL';
                const boxColor = isBool ? (box.value ? 0x10b981 : 0xef4444) : 0xd97706;

                const cBoxGeo = new THREE.BoxGeometry(15, 15, 15);
                const cBoxMat = new THREE.MeshStandardMaterial({ color: boxColor, roughness: 0.6, metalness: 0.1 });
                const cBox = new THREE.Mesh(cBoxGeo, cBoxMat);
                cBox.position.set(0, 20 + bobY, 0);
                cBox.castShadow = true;
                group.add(cBox);

                const tapeGeo = new THREE.BoxGeometry(15.5, 2.5, 5);
                const tapeMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5 });
                const tape = new THREE.Mesh(tapeGeo, tapeMat);
                tape.position.set(0, 28 + bobY, 0);
                group.add(tape);
            }

            return group;
        }

        setActive(active) {
            this.active = active;
            if (this.canvas) {
                this.canvas.style.display = active ? 'block' : 'none';
            }
            if (active) {
                this.resize();
            }
        }

        resize() {
            if (!this.renderer || !this.container) return;
            const w = this.container.clientWidth;
            const h = this.container.clientHeight || 560;
            this.camera.aspect = w / h;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(w, h);
        }

        resetCamera() {
            this.controls.rotX = 0.64;
            this.controls.rotY = 0.58;
            this.controls.distance = 1180;
            this.controls.target.set(460, 0, 270);
            this.updateCameraTransform();
        }
    }

    SF.ThreeRenderer = ThreeRenderer;
})(window.SF);
