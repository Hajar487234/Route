export const qua = 20;


export function drawGriglia(ctx, collisionCtx, collisionImage) {
    const col = Math.ceil(collisionImage.width / qua);
    const rig = Math.ceil(collisionImage.height / qua);


    ctx.strokeStyle = "rgba(128, 128, 128, 0.5)";
    ctx.lineWidth = 1;
   
    const collisionData = collisionCtx.getImageData(0, 0, collisionImage.width, collisionImage.height).data;


    for (let i = 0; i < rig; i++) {
        for (let j = 0; j < col; j++) {
            const x = j * qua;
            const y = i * qua;
            const checkX = Math.floor(x);
            const checkY = Math.floor(y);
            const index = (checkY * collisionImage.width + checkX) * 4;
            const r = collisionData[index];
            const g = collisionData[index + 1];
            const isRed = r > 150 && g < 100;
            if (!isRed) {
                ctx.strokeRect(x, y, qua, qua);
            }
        }
    }
}







