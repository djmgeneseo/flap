/* Class representing a point with 2 coordinates. */
class Point {
    /**
     * Create a point.
     * @param {number} x - The x value.
     * @param {number} y - The y value.
     */
    constructor(x, y) {
        // Fill in code to set attributes of point
        this.x_ = x;
        this.y_ = y;
    }

    get x() {
        return this.x_;
    }

    get y() {
        return this.y_;
    }
}

/**
 * Bird class maintains the position of a bird over time
 */
class Bird {
    /**
     * Create a new Bird.
     * @param {Point} startPosition - The 2D starting position of the Bird (x, y)
     * @param {number} startXSpeed - The starting horizontal speed of the bird (pixels/second)
     * @param {number} gravity - The change in the y velocity due to gravity (pixels/second)
     * @param {number} flapUpSpeed - The y velocity (opposite direction of gravity) caused by a flap
     */

    constructor(startPosition, startXSpeed, gravity, flapUpSpeed) {
        this.gravity_ = gravity;
        this.flapUpSpeed_ = -flapUpSpeed;
        this.currentPosition_ = startPosition;
        this.xSpeed_ = startXSpeed;
        this.ySpeed_ = 0;
    }

    /**
     * Updates the position of the bird (both x and y coordinates)
     * @param {number} secondsElapsed - the number of seconds that passed since the last move
     */

    move(secondsElapsed) {

        let newX = this.currentPosition_.x + secondsElapsed * this.xSpeed_;
        let newY = this.currentPosition_.y + secondsElapsed * this.ySpeed_;
        this.currentPosition_ = new Point(newX, newY);
        this.ySpeed_ = this.ySpeed_ + secondsElapsed * this.gravity_;
    }

    /**
     * Updates the bird's y velocity caused by a flap given by flapUpSpeed
     */

    flap() {
        this.ySpeed_ = this.flapUpSpeed_;
    }

    /**
     * @type {Point}
     */

    get position() {
        // getter for current position of Bird
        return this.currentPosition_;
    }
}

/**
 * BirdView class stores the image data for the bird renders the position of a bird on a given canvas
 */
class BirdView {
    /**
     * Create a new BirdView.
     * @param {bird} bird - An object that maintains the position of a bird over time
     * with a 2D position (x,y)
     */
    constructor(bird) {
        this.bird_ = bird;
        this.birdImage_ = new Image();
        this.birdImage_.src = "https://studio.code.org/blockly/media/skins/flappy/avatar.png"
    }

    render(canvasContext) {
        canvasContext.drawImage(this.birdImage_, 5, this.bird_.position.y, this.birdImage_.width, this.birdImage_.height);
    }
}

/**
 * Pipe class maintains the position of a pipe and its other attributes
 */
class Pipe {
    /**
     * Create a new Pipe.
     * @param {Point} position - The 2D position of the Pipe (x, y)
     *
     */
    constructor(position) {
        this.position_ = position;
        this.gap_ = 100;
        this.width_ = 52;
        this.height_ = 320;
    }

    get position() {
        return this.position_;
    }

    get gap() {
        return this.gap_;
    }

    get width() {
        return this.width_;
    }

    get height() {
        return this.height_;
    }

}

/**
 * PipeWorld class maintains the position of multiple pipes in an array.
 */
class PipeWorld {
    /**
     * Create a new PipeWorld.
     */
    constructor() {
        this.pipes_ = [];
        let currentPoint = new Point(350, -Math.floor(Math.random() * 260));

        for (let i = 1; i <= 4; i++) {
            this.pipes_.push(new Pipe(currentPoint));
            currentPoint = new Point(currentPoint.x + 250, -Math.floor(Math.random() * 260));
        }
    }

    createNewPipe(posX) {
        this.pipes_.push(new Pipe(new Point(posX, -Math.floor(Math.random() * 260))));
    }

    deleteFirstPipe() {
        this.pipes_.shift();
    }

    getPipeNumber(n) {
        return this.pipes_[n];
    }

    getNumberOfPipes() {
        return this.pipes_.length;
    }

    getArray() {
        return this.pipes_;
    }
}

/**
 * PipeWorldView class stores the image pipe image data and renders the positions of
 * multiple pipes.
 */
class PipeWorldView {
    /**
     * Create a new PipeWorldView.
     * @param {PipeWorld} pipeWorld - An object that maintains multiple pipes in an
     * array. Each individual pipe maintains its own 2D position (x, y)
     *
     */
    constructor(pipeWorld) {
        this.pw_ = pipeWorld;
        this.pipeBottomImage_ = new Image();
        this.pipeTopImage_ = new Image();
        this.pipeBottomImage_.src = "https://studio.code.org/blockly/media/skins/flappy/obstacle_bottom.png";
        this.pipeTopImage_.src = "https://studio.code.org/blockly/media/skins/flappy/obstacle_top.png";
    }

    render(drawNewPipeFromThisX, canvasContext) {
        let currentTopPipe;

        for (let i = 0; i < this.pw_.getNumberOfPipes(); i++) {
            currentTopPipe = this.pw_.getPipeNumber(i);

            // Draw top Pipe
            canvasContext.drawImage(this.pipeTopImage_, currentTopPipe.position.x - drawNewPipeFromThisX, currentTopPipe.position.y, currentTopPipe.width, currentTopPipe.height);

            // Draw bottom pipe
            canvasContext.drawImage(this.pipeBottomImage_, currentTopPipe.position.x - drawNewPipeFromThisX, (currentTopPipe.height + currentTopPipe.position.y + currentTopPipe.gap + currentTopPipe.height), currentTopPipe.width, -currentTopPipe.height);
        }
    }
}

/**
 * World class both creates and stores every model (MVC) object requisite for Flappy Bird.
 */
class World {
    /**
     * Create a new World.
     */
    constructor() {
        // startPosition, startXSpeed, gravity, flapUpSpeed
        this.bird_ = new Bird(new Point(5, 5), 130, 200, 130);
        this.pw_ = new PipeWorld();
    }

    checkIfPipeOffScreen() {

        // BUG TESTING
        document.getElementById("input5").value = (this.pw_.getPipeNumber(0).position.x + this.pw_.getPipeNumber(0).width);

        if (this.bird_.position.x > (this.pw_.getPipeNumber(0).position.x + this.pw_.getPipeNumber(0).width)) {
            // BUG TESTING
            document.getElementById("input6").value = "Yes";
            setTimeout(function () {
                document.getElementById("input6").value = "No";
            }, 300);

            this.pw_.deleteFirstPipe();
            this.pw_.createNewPipe((this.pw_.getPipeNumber(this.pw_.getNumberOfPipes() - 1).position.x + 250));
        }
    }

    get bird() {
        return this.bird_;
    }

    get pipeWorld() {
        return this.pw_;
    }
}

/**
 * WorldView class both creates and stores every view (MVC) object requisite for Flappy Bird.
 */
class WorldView {
    /**
     * Create a new WorldView.
     * @param {World} world - An object that both creates and maintains every model
     * object requisite for Flappy Bird.
     *
     */
    constructor(world) {
        // All models (Bird and PipeWorld objects were created in world)
        this.pw_ = world.pipeWorld;
        this.bird_ = world.bird;
        window.addEventListener('click', this.bird_.flap.bind(this.bird_));

        // Views (PipeWorldView and BirdView objects)
        this.pwv_ = new PipeWorldView(this.pw_, this.bird_);
        this.bv_ = new BirdView(this.bird_);

        // Sky background
        this.skyBackgroundImage_ = new Image();
        this.skyBackgroundImage_.src = skyImageData;

        // Canvas element and context
        this.canvasElement_ = document.getElementById("game");
        this.canvasContext_ = this.canvasElement_.getContext("2d");
    }

    render() {
        this.canvasContext_.clearRect(0, 0, this.canvasElement_.width, this.canvasElement_.height);
        this.canvasContext_.drawImage(this.skyBackgroundImage_, -(this.bird_.position.x) % (this.skyBackgroundImage_.width - this.canvasElement_.width), 0, this.skyBackgroundImage_.width, this.skyBackgroundImage_.height);
        this.bv_.render(this.canvasContext_);
        this.pwv_.render(this.bird_.position.x, this.canvasContext_);
    }
}


/**
 * Controller class (MVC) both creates and stores the World and WorldView objects.
 */
class Controller {
    /**
     * Create a new Controller.
     */
    constructor() {
        this.w_ = new World();
        this.wv_ = new WorldView(this.w_);
    }

    start() {
        this.lastTimeMoved = 0;

        this.runGame = ms => {
            this.w_.bird.move(msToSec(ms - this.lastTimeMoved));
            this.w_.checkIfPipeOffScreen();
            this.wv_.render();
            this.lastTimeMoved = ms;

            // BUG TESTING
            document.getElementById("input1").value = (this.w_.bird.position.x);
            document.getElementById("input4").value = (this.w_.pipeWorld.getPipeNumber(0).position.x);

            requestAnimationFrame(this.runGame);
        };

        requestAnimationFrame(this.runGame);
    } //start()

}

// ****** GAME STARTS HERE ******
let msToSec = milliseconds => milliseconds / 1000;

let c = new Controller();
c.start();
