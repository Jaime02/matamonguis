export class Sprite {
    constructor(imageId, width, height) {
        this.x = 0;
        this.y = 0;
        this.width = width;
        this.height = height;
        this.image = document.getElementById(imageId);

        this.xSpeed = 0;
        this.ySpeed = 0;

        this.hidden = false;
        this.collected = false;
    }
}