var ctx = document.getElementById("ctx").getContext("2d");

// Section size for each snake peace and food on the canvas
var section = 20;

var snake;
var snakeColour = "blue";

var score;
var scorePerFood = 100;

var canvas = {
    x: section*25, // 25 blocks in length, 20 px for each block
    y: section*15, // 15 blocks in height, 20 px for each block
    fps: 100       // Note: not 100 in fps, but still.. Do not judge me
};

var newGame = {
    score: 0,
    startPosX: 12*section,
    startPosY: 7*section
};

var snakePart = {
    x: undefined,
    y: undefined,
    dir: undefined
};

var food = {
    x: undefined,
    y: undefined,
    color: "red"
};

// Handle keyboard input
document.addEventListener("keydown", keyDownHandler, false);

// Handle event
function keyDownHandler(e) {
    switch(e.keyCode){
    case 37: // left
	if(snake[snake.length - 1].dir != "right"){
	    snake[snake.length - 1].dir = "left";
	}
	break;
    case 38: // up
	if(snake[snake.length - 1].dir != "down"){
	    snake[snake.length - 1].dir = "up";
	}
	break;
    case 39: // right
	if(snake[snake.length - 1].dir != "left"){
	    snake[snake.length - 1].dir = "right";
	}
	break;
    case 40: // down
	if(snake[snake.length - 1].dir != "up"){
	    snake[snake.length - 1].dir = "down";
	}
	break;
    default:
	break;
    }
}

// Count untill no snake
// TODO: End of game?
function generateFoodHelper(x, y) {
    if(x == 24*section) {
	if(y == 14*section) {
	    return [0,0];
	}
	return [0,(y + section)];
    } else if(y == 14*section) {
	return [(x + section),0];
    } else {
	return [(x + section),y];
    }
}

// Generate the food
function generateFood() {
    var i;
    var x = Math.floor(Math.random() * 24)*section;
    var y = Math.floor(Math.random() * 14)*section;
    for(i = 0; i < snake.length; i++) {
	if (snake[i].x == x && snake[i].y == y) {
	    var returnFood = generateFoodHelper(x, y);
	    x = returnFood[0];
	    y = returnFood[1];
	    i = 0;
	}
    }    
    food.x = x;
    food.y = y;    
}

// Draw food
function drawFood() {    
    generateFood();
    
    ctx.beginPath();
    ctx.fillStyle = food.color;
    ctx.fillRect(food.x, food.y, section, section);
    ctx.fill();
    ctx.closePath();
}

// Draw snake
function drawSnake() {   
    for(var i = snake.length - 1; i >= 0; i--) {
	ctx.beginPath();
	ctx.fillStyle = snakeColour;
	ctx.fillRect(snake[i].x, snake[i].y, section, section);
	ctx.fill();
	ctx.closePath();
    }
}

// Update positions of the snake
function updateSnakePos() {
    // Clear all snake parts
    for(var i = 0; i < snake.length; i++) {
	ctx.clearRect(snake[i].x, snake[i].y, section, section);
    }

    for(i = 0; i < snake.length - 1; i++) {
	if(snake[i].dir == "left") {
	    snake[i].x -= section;
	} else if(snake[i].dir == "up") {
	    snake[i].y -= section;
	} else if(snake[i].dir == "right") {
	    snake[i].x += section;
	} else if(snake[i].dir == "down") {
	    snake[i].y += section;
	}
	snake[i].dir = snake[i + 1].dir;
    }

    if(snake[snake.length - 1].dir == "left") {
	snake[snake.length - 1].x -= section;
    } else if(snake[snake.length - 1].dir == "up") {
	snake[snake.length - 1].y -= section;
    } else if(snake[snake.length - 1].dir == "right") {
	snake[snake.length - 1].x += section;
    } else if(snake[snake.length - 1].dir == "down") {
	snake[snake.length - 1].y += section;
    }
}

// Hit with itself
function hitItself() {
    for(var i = 0; i < snake.length - 1; i++) {
	if(snake[snake.length - 1].x == snake[i].x && snake[snake.length - 1].y == snake[i].y) {
	    alert("Game Over\nScore: " + score);
	    initNewGame();
	}
    }
}

// Have hit occured
function hit() {
    if(snake[snake.length - 1].x < 0 || snake[snake.length - 1].x > canvas.x-section) {
	alert("Game Over\nScore: " + score);
	initNewGame();
    } else if(snake[snake.length - 1].y < 0 || snake[snake.length - 1].y > canvas.y-section) {
	alert("Game Over\nScore: " + score);
	initNewGame();
    }
    hitItself();
}

// Main function
function draw() {
    if(snake[snake.length - 1].dir == "left" && snake[snake.length - 1].x - section == food.x && snake[snake.length - 1].y == food.y ||
       snake[snake.length - 1].dir == "right" && snake[snake.length - 1].x + section == food.x && snake[snake.length - 1].y == food.y ||
       snake[snake.length - 1].dir == "up" && snake[snake.length - 1].y - section == food.y && snake[snake.length - 1].x == food.x ||
       snake[snake.length - 1].dir == "down" && snake[snake.length - 1].y + section == food.y && snake[snake.length - 1].x == food.x) {
	score += scorePerFood;
	snake.push({x: food.x, y: food.y, dir: snake[snake.length - 1].dir});

	// Have player won?
	if(score == scorePerFood*(canvas.x * canvas.y)-100) {
	    alert("Winner!");
	    initNewGame();
	} else {
	    drawFood();
	}
    }

    updateSnakePos();
    hit();
    drawSnake();    
}

// Initialize game variables
function initNewGame() {
    ctx.clearRect(0, 0, canvas.x, canvas.y);
    snake = [];
    snake[0] = {x: newGame.startPosX, y: newGame.startPosY, dir: undefined};
    score = newGame.score;
    drawFood();
    draw();
}

initNewGame();
setInterval(draw, canvas.fps);
