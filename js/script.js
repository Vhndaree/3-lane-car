var laneArray = [30, 125, 225];
var speed = 5;

function Car(containerID) {
  this.x = 0;
  this.y = 0;
  this.element = null;

  this.init = function () {
    this.element = document.createElement('img');
    this.element.setAttribute('class', 'car');
    this.carWidth = this.carWidth;
    this.carHeight = this.carHeight;

    container = document.getElementById(containerID);
    container && container.appendChild(this.element);
  }

  this.setCarPosition = function (randX, randY) {
    this.x = laneArray[randX];
    this.y = -50;
  }

  this.draw = function () {
    this.element.style.top = this.y + 'px';
    this.element.style.left = this.x + 'px';
  }

  var that = this;
  this.removeCar = function () {
    this.element.remove();
  }
}

function CarWorldAnimation(container, background) {
  var obsCars = [];
  var obstacleGap = 0;
  var player = new Car(container);
  var gamePlayInterval = null;
  var isplayerAlive = true;
  var gameOver = document.getElementById('gameOver');
  var score = document.getElementById('score');
  score.style.display= 'block';
  var scoreCount = 1;

  this.init = function () {
    gameOver.style.display = 'none';
    generatePlayer();
    gamePlayInterval = setInterval(moveObstacles, 60);
  }

  function generatePlayer() {
    player.x = laneArray[1];
    player.y = ROAD_DISPLAY_HEIGHT - CAR_HEIGHT - 15;
    player.init();
    player.element.setAttribute('class', 'player');
    player.element.setAttribute('src', './assets/my_car.png');
    applyStyles(player.element, {
      position: 'absolute',
      height: CAR_HEIGHT + 'px',
      width: CAR_WIDTH + 'px',
      top: player.y + 'px',
      left: player.x + 'px',
    });
    player.draw();
    document.addEventListener('keydown', handleMyCar);
  }

  var stopGame = function () {
    clearInterval(gamePlayInterval);
    isplayerAlive = false;
  }

  var colissionDetection = function () {
    obsCars.forEach(obs => {
      if ((player.x < obs.x + CAR_WIDTH) && (player.x + CAR_WIDTH > obs.x) &&
        (player.y < obs.y + CAR_HEIGHT) && (CAR_HEIGHT + player.y > obs.y)) {
        stopGame();
        gameOver.style.display = 'block';
        gameOver.innerHTML = "Game Over, press any key to restart.";
      }
    });
  }

  function handleMyCar(event) {

    if (event.keyCode == 39 && isplayerAlive) {
      if (player.x < 125) {
        player.x = 125;
      } else if (player.x < 225) {
        player.x = 225;
      }
    }

    if (event.keyCode == 37 && isplayerAlive) {
      if (player.x > 125) {
        player.x = 125;
      } else if (player.x > 30) {
        player.x = 30;
      }
    }
    player.draw();

    if(!isplayerAlive && event.keyCode != 0) {
      isplayerAlive = true;
      player.removeCar();
      obsCars.forEach(obstacle => {
        obstacle.removeCar();
      })
      delete(player);
      delete(startGame);
      scoreCount = 0; 
      score.innerHTML='';
      speed = 5;
      startGame = new CarWorldAnimation(container, background).init();
    }

  }

  var createObstacles = function () {
    var obstacle = new Car(container);
    var randX = getRandomNumber(0, 2);
    var randY = 0;
    obstacle.setCarPosition(randX, randY);
    obstacle.init();
    obstacle.element.setAttribute('class', 'obstacle');
    obstacle.element.setAttribute('src', './assets/opponent_car.png');
    applyStyles(obstacle.element, {
      position: 'absolute',
      height: CAR_HEIGHT + 'px',
      width: CAR_WIDTH + 'px',
      top: player.y + 'px',
      left: player.x + 'px',
    });
    obstacle.draw();
    obsCars.push(obstacle);
  }

  var moveObstacles = function () {
    obstacleGap++;
    if (obstacleGap == 40) {
      createObstacles();
      obstacleGap = 0;
    }
    moveBackground();
    for (var i = 0; i < obsCars.length; i++) {
      var car = obsCars[i];
      car.y += speed;
      if (car.y >= ROAD_DISPLAY_HEIGHT-CAR_HEIGHT) {
        scoreCount+=i;
        score.innerHTML = "Your Score: " + scoreCount;
        car.removeCar();
        obsCars.splice(i, i);
      }
      colissionDetection();
      car.draw();
    }
  }

  var background_road = document.getElementById(background);
  applyStyles(background_road, {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: TOTAL_ROAD_HEIGHT + 'px',
    backgroundImage: "url('./assets/laneBackground.png')",
    backgroundRepeat: 'repeat-y',
    marginTop: (ROAD_DISPLAY_HEIGHT - TOTAL_ROAD_HEIGHT) + 'px',
  });

  function moveBackground(background) {
    var margin = parseInt(getComputedStyle(background_road).getPropertyValue('margin-top'));
    margin += speed;
    speed += VELOCITY;

    if (margin > 0) {
      margin = ROAD_DISPLAY_HEIGHT - TOTAL_ROAD_HEIGHT;
    }
    background_road.style.marginTop = margin + 'px';
  }
}
