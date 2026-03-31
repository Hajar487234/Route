//canvas su cui ci sarà il gioco
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 1920;
canvas.height = 1080;
const editbtn = document.getElementById('editbtn');


//parte animazione quando tutte le immagine si sono caricate
let imagesLoaded = 0;
const totalImages = 6; // Mappa, Collisions, Down, Up, Left, Right


//conta quante immagini sono caricate
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


// Mappa delle collisions (Canvas nascosto)
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


// // controlla se la posizione è camminabile attraverso i dati dei pixel. Se il pixel è rosso allora fa return false
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


// loop del gioco che gestisce movimento animazione e disegno
function animate() {
    window.requestAnimationFrame(animate);


    const speed = 2;
    let moving = false;

    // nuova posizione basata sui tasti
    let nextX = player.x;
    let nextY = player.y;

     //movimento cambio sprite e velocità
    if (keys.a) {
        nextX -= speed;
        moving = true;
        currentPlayerSprite = sprites.left;
    } else if (keys.d) {
        nextX += speed;
        moving = true;
        currentPlayerSprite = sprites.right;
    }


    if (keys.w) {
        nextY -= speed;
        moving = true;
        currentPlayerSprite = sprites.up;
    } else if (keys.s) {
        nextY += speed;
        moving = true;
        currentPlayerSprite = sprites.down;
    }


    // Sliding collision
    if (isWalkable(nextX, player.y)) {
        player.x = nextX;
    }
    if (isWalkable(player.x, nextY)) {
        player.y = nextY;
    }


    // Animazione frame (2x2 sprite sheet)
    if (moving) {
        tick++;
        if (tick % 12 === 0) { // Velocità dell'animazione (12 tick per frame)
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


    // posizione della telecamera sul player con limiti così non esce fuori mappa
    const viewWidth = (canvas.width / 2) / zoom;
    const viewHeight = (canvas.height / 2) / zoom;
    const halfMapW = image.width / 2;
    const halfMapH = image.height / 2;
    let camX = Math.max(-halfMapW + viewWidth, Math.min(halfMapW - viewWidth, player.x));
    let camY = Math.max(-halfMapH + viewHeight, Math.min(halfMapH - viewHeight, player.y));


    // disegni
    c.fillStyle = '#78e3d5';
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(canvas.width / 2, canvas.height / 2);
    c.scale(zoom, zoom);
    c.imageSmoothingEnabled = false;


    // Disegno Mappa
    c.drawImage(image, Math.floor(-halfMapW - camX), Math.floor(-halfMapH - camY));


    // Disegno Giocatore dove ritaglia la sprite sheet
    const sW = currentPlayerSprite.width / 2;
    const sH = currentPlayerSprite.height / 2;
    c.drawImage(
        currentPlayerSprite,
        frameX * sW, frameY * sH,
        sW, sH,                  
        Math.floor(player.x - camX - sW / 2),
        Math.floor(player.y - camY - sH / 2),
        sW, sH                    
    );

    c.restore();

}






