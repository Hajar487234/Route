// canvas su cui ci sarà il gioco
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1920;
canvas.height = 1080;

import { drawGriglia, qua } from './piante.js';

// parte animazione quando tutte le immagine si sono caricate
let imagesLoaded = 0;
const totalImages = 7; // Mappa, Collisions, Down, Up, Left, Right + Immagine Fiore per Canvas

function checkImages() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        animate();
    }
}

// Mappa di sfondo
const image = new Image();
image.src = './spazio.png';
image.onload = checkImages;

// Mappa delle collisions
const collisionImage = new Image();
collisionImage.src = './collision.png';
const collisionCanvas = document.createElement('canvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionImage.onload = () => {
    collisionCanvas.width = collisionImage.width;
    collisionCanvas.height = collisionImage.height;
    collisionCtx.drawImage(collisionImage, 0, 0);
    checkImages();
};

const flowerImg = new Image();
flowerImg.src = './flower1finalphase.PNG';
flowerImg.onload = checkImages;

// Sprite sheet del giocatore per ogni direzione
const sprites = {
    down: new Image(),
    up: new Image(),
    left: new Image(),
    right: new Image()
};

sprites.down.src = './ACharDown.png';
sprites.up.src = './ACharUp.png';
sprites.left.src = './ACharLeft.png';
sprites.right.src = './ACgarRight.png';

// Controllo caricamento per ogni sprite
Object.values(sprites).forEach(img => img.onload = checkImages);

// variabili del gioco
let zoom = 4;
const player = { x: 0, y: 0 };
const keys = { w: false, a: false, s: false, d: false };

// Variabili per l'animazione dei passi
let currentPlayerSprite = sprites.down;
let frameX = 0;
let frameY = 0;
let tick = 0;

// variabili per la gestione della grigli, piazzamento fiori e cestino
let showGrid = false;
let isHoldingFlower = false;
let isTrashMode = false;
const posizionatiFiori = [];
const shovelIcon = document.getElementById('shovel');
const backHome = document.getElementById('backHome');
const trashIcon = document.querySelector('.strumenti img[alt="Trash"]');
const list = document.getElementById('list');
const flowerSelector = document.getElementById('flower1finalphase');
const ghostFlower = document.getElementById('ghost-flower');
let camX = 0;
let camY = 0;
const halfMapW = () => image.width / 2;
const halfMapH = () => image.height / 2;

// Click sulla Pala
shovelIcon.addEventListener('click', () => {
    isTrashMode = false; 
    trashIcon.style.opacity = "0.6";

    showGrid = !showGrid; 
    if (showGrid) {
        list.style.display = "block";
    } else {
        list.style.display = "none";
        isHoldingFlower = false;
        ghostFlower.style.display = "none";
    }
    shovelIcon.style.opacity = showGrid ? "1" : "0.6";
});

// Click sul Cestino
trashIcon.addEventListener('click', () => {
    isHoldingFlower = false;
    ghostFlower.style.display = "none";
    shovelIcon.style.opacity = "0.6";
    list.style.display = "none";
    isTrashMode = !isTrashMode; 
    showGrid = isTrashMode;
    trashIcon.style.opacity = isTrashMode ? "1" : "0.6";
});

// Seleziona il fiore dalla lista
flowerSelector.addEventListener('click', (e) => {
    if (!showGrid || isTrashMode) return;
    isHoldingFlower = true;
    ghostFlower.style.display = "block";
    ghostFlower.style.left = e.clientX + 'px';
    ghostFlower.style.top = e.clientY + 'px';
});

// Muove il fiore insieme al mouse
window.addEventListener('mousemove', (e) => {
    if (isHoldingFlower) {
        ghostFlower.style.left = e.clientX + 'px';
        ghostFlower.style.top = e.clientY + 'px';
    }
});

backHome.addEventListener('click', () => {
    window.location.href = '../HTML/Schermata_Home.html';
});

// click per Piazzare o Rimuovere i fiori
canvas.addEventListener('click', (e) => {
    if (!showGrid) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const hW = halfMapW();
    const hH = halfMapH();

    const worldX = (mouseX - canvas.width / 2) / zoom + camX + hW;
    const worldY = (mouseY - canvas.height / 2) / zoom + camY + hH;

    const gridX = Math.floor(worldX / qua) * qua;
    const gridY = Math.floor(worldY / qua) * qua;

    // mod cestino
    if (isTrashMode) {
        const index = posizionatiFiori.findIndex(f => f.x === gridX && f.y === gridY);
        if (index !== -1) {
            posizionatiFiori.splice(index, 1);
        }
        return; 
    }

    // modalità piazzamento fiore
    if (isHoldingFlower) {
        if (gridX >= 0 && gridX < collisionImage.width && gridY >= 0 && gridY < collisionImage.height) {
            const giaPresente = posizionatiFiori.some(f => f.x === gridX && f.y === gridY);

            if (!giaPresente) {
                posizionatiFiori.push({ x: gridX, y: gridY });
                isHoldingFlower = false;
                ghostFlower.style.display = "none";
            }
        }
    }
});

// Controlla se la posizione è camminabile
function isWalkable(x, y) {
    const imgX = Math.floor(x + collisionImage.width / 2);
    const imgY = Math.floor(y + collisionImage.height / 2 + 15);
    if (imgX < 0 || imgX >= collisionImage.width || imgY < 0 || imgY >= collisionImage.height) {
        return false;
    }
    const pixel = collisionCtx.getImageData(imgX, imgY, 1, 1).data;
    const isRed = pixel[0] > 150 && pixel[1] < 100;
    return !isRed;
}

// tastiera e mouse
window.addEventListener('keydown', (e) => {
    const key = e.key.toLowerCase();
    if(keys.hasOwnProperty(key)) keys[key] = true;
});

window.addEventListener('keyup', (e) => {
    const key = e.key.toLowerCase();
    if(keys.hasOwnProperty(key)) keys[key] = false;
});

window.addEventListener('wheel', (e) => {
    const minZoom = Math.max(canvas.width / image.width, canvas.height / image.height) + 0.02;
    if (e.deltaY > 0) {
        if (zoom > minZoom) zoom -= 0.1;
    } else {
        if (zoom < 10) zoom += 0.1;
    }
    zoom = Math.max(minZoom, Math.round(zoom * 100) / 100);
});

// loop del gioco
function animate() {
    window.requestAnimationFrame(animate);

    const speed = 2;
    let moving = false;
    let nextX = player.x;
    let nextY = player.y;

    if (keys.a) { nextX -= speed; moving = true; currentPlayerSprite = sprites.left; } 
    else if (keys.d) { nextX += speed; moving = true; currentPlayerSprite = sprites.right; }

    if (keys.w) { nextY -= speed; moving = true; currentPlayerSprite = sprites.up; } 
    else if (keys.s) { nextY += speed; moving = true; currentPlayerSprite = sprites.down; }

    if (isWalkable(nextX, player.y)) { player.x = nextX; }
    if (isWalkable(player.x, nextY)) { player.y = nextY; }

    if (moving) {
        tick++;
        if (tick % 12 === 0) {
            frameX++;
            if (frameX > 1) {
                frameX = 0;
                frameY = (frameY === 0) ? 1 : 0;
            }
        }
    } else {
        frameX = 0;
        frameY = 0;
    }

    const viewWidth = (canvas.width / 2) / zoom;
    const viewHeight = (canvas.height / 2) / zoom;
    const hW = image.width / 2;
    const hH = image.height / 2;
    
    camX = Math.max(-hW + viewWidth, Math.min(hW - viewWidth, player.x));
    camY = Math.max(-hH + viewHeight, Math.min(hH - viewHeight, player.y));

    // Sfondo del canvas
    c.fillStyle = '#78e3d5';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(canvas.width / 2, canvas.height / 2);
    c.scale(zoom, zoom);
    c.imageSmoothingEnabled = false;

    // Disegno Mappa 
    c.drawImage(image, Math.floor(-hW - camX), Math.floor(-hH - camY));

    // Sistema di coordinate relative alla mappa
    c.save();
    c.translate(Math.floor(-hW - camX), Math.floor(-hH - camY));
    
    // i fiori posizionati sulla mappa
    posizionatiFiori.forEach(fiore => {
        const dimensioneFiore = qua * 0.8;
        const offset = (qua - dimensioneFiore) / 2;
        c.drawImage(flowerImg, fiore.x + offset, fiore.y + offset, dimensioneFiore, dimensioneFiore);
    });

    // Disegno della griglia (Se attiva)
    if (showGrid) {
        drawGriglia(c, collisionCtx, collisionImage);
    }
    c.restore();
    
    // Disegno Giocatore con Ridimensionamento proporzionale
    const sW = currentPlayerSprite.width / 2;
    const sH = currentPlayerSprite.height / 2;

    const scalaPlayer = 1.8; // Aumenta questo valore per far diventare il personaggio ancora più grande
    const targetW = sW * scalaPlayer;
    const targetH = sH * scalaPlayer;

    c.drawImage(
        currentPlayerSprite,
        frameX * sW, frameY * sH,
        sW, sH,                  
        Math.floor(player.x - camX - targetW / 2),
        Math.floor(player.y - camY - targetH / 2),
        targetW, targetH                    
    );

    c.restore();
}