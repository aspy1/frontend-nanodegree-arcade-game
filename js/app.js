var numEnemies = 3; // used to determine number of concurrent enemies on the screen

var enemyWidth = 60;// used by the colision detector
var rowPositions = [ 
    302, // bottom row (before player start)
    219, 
    136, 
    53   // top row (before water)
];

// used to store default start position
var playerStartPos = {
    x:202.5, 
    y:385
}

// resource locations 
var characters = [
    'images/char-boy.png',
    'images/char-cat-girl.png',
    'images/char-horn-girl.png', 
    'images/char-pink-girl.png'
];

var enemies = [
    'images/enemy-bug.png',
    'images/enemy-bus.png',
    // 'images/enemy-ufo.png'
];

var bgtiles = [
    'images/stone-block.png',
    'images/water-block.png',
    'images/grass-block.png'
];

// superclass used to encapsulate some common functionality
var RenderObject = function(sprite, posX, posY)
{
    this.sprite = sprite; // sprite string
    this.x = posX; // current x position
    this.y = posY; // current y postion
    this.render =  function() { // render function is the same for enemies and players
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started   
    var posX = -100;
    var posY = rowPositions[Math.floor(Math.random()*rowPositions.length)]; 
    RenderObject.call(this, enemies[Math.floor(Math.random()*enemies.length)], posX, posY);
    this.speed = Math.random()*800 + 100; // added to determine hold different enemy speeds 
    this.checkColision = function(x, y){ // checks if a colision has occured with this enemy
        if(y == this.y && (x-this.x < enemyWidth && x-this.x > -enemyWidth))
            return true;
        return false;
    }
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
}

Enemy.prototype = Object.create(RenderObject.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    this.x += dt*this.speed;
    if(this.x > 505) { // went over the end of the board
        this.speed = Math.random()*800 + 100; // change speed
        this.x = -100; // reset to left side of screen
        this.y = rowPositions[Math.floor(Math.random()*rowPositions.length)]; // assign random row
        this.sprite = enemies[Math.floor(Math.random()*enemies.length)]; // assign random sprite
    }
}





// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    RenderObject.call(this, 'images/char-boy.png', playerStartPos.x, playerStartPos.y);
    // used to keep with concurrenvy model (hoping all objects are treated safely by default)
    this.deltaX = 0; // used to hold next update to x position
    this.deltaY = 0; // used to hold next update to y position

    // updates deltaX with bounds checks
    this.updateDeltaX = function(dX) {
        if(this.x + this.deltaX + dX > 0 && this.x + this.deltaX  + dX < 505) 
            this.deltaX += dX;
    };
    // updates deltaY with bounds checks
    this.updateDeltaY = function(dY) {
        if(this.y + this.deltaY + dY < 410) 
            this.deltaY += dY;
    };
    // quick function to return Player to the start
    this.moveToStart = function() {
        this.x = playerStartPos.x;
        this.y = playerStartPos.y;
    }

}

Player.prototype = Object.create(RenderObject.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
    // do stuff
    if(this.y + this.deltaY < 0) {
        this.moveToStart();
    }
    else {
        this.x += this.deltaX;
        this.y += this.deltaY;        
    }

    // check for colisions.
    for(enemy in allEnemies) {
        if(allEnemies[enemy].checkColision(this.x, this.y)) {
            this.moveToStart();
        }
    }
    
    this.deltaX = 0;
    this.deltaY = 0;
}

Player.prototype.handleInput = function(movement)
{
    // handles each movement case
    switch(movement)
    {
        case "left": {
            this.updateDeltaX(-101);
        }break;
        case "right": {
            this.updateDeltaX(101);
        }break;
        case "up": {
            this.updateDeltaY(-83);
        }break;
        case "down": {
            this.updateDeltaY(83);
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];

for(var i = 0; i<numEnemies; i++) {
    allEnemies.push(new Enemy());
}

// creates player
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    console.log("Pressed Key");
    player.handleInput(allowedKeys[e.keyCode]);
});
