var player;
var life;
var myAnimation;

var floor;
var pillar;
var platform;
var platforms;

var endDoor;

var coins;
var coinBonus;
var buttonTen;
var buttonTwenty;
var buttonThirty;
var buttonStart;
var timer;

var gameOver = false;
var gameStart = true;

var coinsGenerated = 0;
var coinsCollected = 0;
var coinsLeft = 0;
var gravity = 1;
var jump = 15;
var jumpCount = 0;
var score = 0;
var lives = 3;

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/* This function is called once, when the page loads. Anything that you want to show up initially should be created here! To start out, try drawing some shapes. */
function setup() {
  createCanvas(1800, 800)
  noStroke()
  animationSetup()

  life = loadImage("assets/playerLife.png")

  floor = createSprite(0, 705, 10000, 10)

  pillar1 = createSprite(450, 510, 100, 400)
  pillar2 = createSprite(780, 275, 100, 400)
  pillar3 = createSprite(980, 425, 300, 100)
  pillar4 = createSprite(1400, 500, 100, 420)

  endDoor = createSprite(1675, 670, 75, 60)

  coins = new Group()
  platforms = new Group()
  pillars = new Group()

  pillars.add(pillar1)
  pillars.add(pillar2)
  pillars.add(pillar3)
  pillars.add(pillar4)

  //  buttonTen = createButton("10 Coin Game")
  //  buttonTen.position((width / 2) + 75, (height / 2) + 100)
  //
  //  buttonTwenty = createButton("20 Coin Game")
  //  buttonTwenty.position((width / 2) + 75, (height / 2) + 150)
  //
  //  buttonThirty = createButton("30 Coin Game")
  //  buttonThirty.position((width / 2) + 75, (height / 2) + 200)

  buttonStart = createButton("Game Start")
  buttonStart.position((width / 2) + 75, (height / 2) + 150)
}


/* This function is called over and over again by P5. Animation should happen here! */
function draw() {
  userInterface()
  backgroundSetup()

  if (gameStart) {
    background("lightblue")

    textAlign(CENTER, CENTER)
    fill("black")
    textSize(40)
    text("Choose Your Difficulty: ", width / 2, (height / 2) - 120)

    //buttonTen.mousePressed(gameTenBegin)
    //buttonTwenty.mousePressed(gameTwentyBegin)
    //buttonThirty.mousePressed(gameThirtyBegin)
    buttonStart.mousePressed(beginGame)

  } else if (!gameOver && !gameStart) {
    player.velocity.y += gravity;

    if (keyDown(RIGHT_ARROW) || keyDown("d")) {
      player.changeAnimation("moving")
      player.mirrorX(1)
      player.velocity.x = 2
      if (player.position.x == width) {
        player.velocity.x = 0
      }
    } else if (keyDown(LEFT_ARROW) || keyDown("a")) {
      player.changeAnimation("moving")
      player.mirrorX(-1)
      player.velocity.x = -2
      if (player.position.x == 0) {
        player.velocity.x = 0
      }
    } else {
      player.changeAnimation("idle")
      player.velocity.x = 0
    }

    if (player.collide(floor)) {
      player.velocity.y = 0
      jumpCount = 0
    }

    if (player.collide(platforms)) {
      player.velocity.y = 0
      jumpCount = 0
    }

    if (player.collide(pillars)) {
      player.velocity.y = 0
      jumpCount = 0
    }

    if (keyWentDown(UP_ARROW) || keyWentDown("w")) {
      if (jumpCount < 2) {
        player.changeAnimation("jumping")
        player.velocity.y = -jump
        jumpCount++
      }
    }

    if (player.velocity.y > 1 || player.velocity.y < 0) {
      player.changeAnimation("jumping")
    }

    //    if (coinsCollected == coinsGenerated) {
    //      gameOver = true;
    //      score = score + (timer * 10)
    //    }

    if (frameCount % 60 == 0 && timer > 0) { // if the frameCount is divisible by 60, then a second has passed. it will stop at 0
      timer--;
    }

    if (timer == 0) {
      gameOver = true;
    }

    if (player.collide(endDoor)) {
      gameOver = true;
      score = score + (timer * 10)
    }

    if (player.position.y > 800) {
      lives--
      player.position.x = 100
      player.position.y = 500
    }

    if (lives == 0) {
      gameOver = true;
    }

    player.collide(coins, getCoin)
    pillars.displace(coins)

    drawSprites();

  } else if (gameOver) {
    background("black")
    textAlign(CENTER, CENTER)
    fill("white")

    if (timer > 0 && lives > 0) {
      if (coinsGenerated = 15) {
        text("You got " + coinsCollected + " / " + coinsGenerated + " coins! ", width / 2, (height / 2) - 80)
      } else {
        text("You got all " + coinsCollected + " coins!", width / 2, (height / 2) - 80)
      }
      if (coinsCollected == coinsGenerated) {
        text("You got all the coins! Coin Bonus: + 1000", width / 2, (height / 2) - 40)
        coinBonus = 1000;
      } else {
        text("You did not get all the coins! No coin bonus!", width / 2, (height / 2) - 40)
        coinBonus = 0;
      }
      if (timer == 1) {
        text("You finished with " + timer + " second left!", width / 2, (height / 2))
      } else {
        text("You finished with " + timer + " seconds left!", width / 2, (height / 2))
      }
      text("Final Score: " + (score + coinBonus) + " points.", width / 2, (height / 2) + 40)
      text("To retry, please refresh the page.", width / 2, (height / 2) + 80)
    } else if (timer == 0 && lives > 0) {
      text("TIME UP!", width / 2, (height / 2) - 80)
      text("You got " + coinsCollected + " coins!", width / 2, (height / 2) - 40)
      if (coinsCollected == coinsGenerated) {
        text("You got all the coins! Coin Bonus: + 1000", width / 2, (height / 2))
        coinBonus = 1000;
      } else {
        text("You did not get all the coins! No coin bonus!", width / 2, (height / 2))
        coinBonus = 0;
      }
      text("Final Score: " + (score + coinBonus) + " points.", width / 2, (height / 2) + 40)
      text("To retry, please refresh the page.", width / 2, (height / 2) + 80)
    }

    if (lives == 0) {
      text("You ran out of lives!", width / 2, (height / 2) - 80)
      text("You got " + coinsCollected + " coins!", width / 2, (height / 2) - 40)
      text("You could not finish the level... no coin bonus.", width / 2, (height / 2))
      text("Final Score: " + (score + coinBonus) + " points.", width / 2, (height / 2) + 40)
      text("To retry, please refresh the page.", width / 2, (height / 2) + 80)
    }
  }
}

function mouseClicked() {
  if (platforms.length == 3) {
    var platToRemove = platforms[0]
    removeSprite(platToRemove)
  }

  platform = createSprite(mouseX, mouseY, 100, 20)
  platforms.add(platform)
}

function userInterface() {
  background("#67c8ef")

  //Box holding UI
  fill("gray")
  rect(0, 0, 1800, 75)

  //Lives & Coin Counters
  fill("black")
  textSize(20)
  text("Lives: " + lives, 50, 45)
  text("Score: " + score, 250, 45)
  text("Timer: " + timer, 1650, 45)

  if (coinsGenerated = 15) {
    text("Coins: " + coinsCollected, 1450, 45)
  } else {
    text("Coins Left: " + coinsLeft, 1450, 45)
  }
}

function backgroundSetup() {
  fill("#96e0ff")
  rect(0, 640, 1800, 60)

  arc(50, 500, 70, 70, PI, 0, CHORD)
  rect(15, 500, 70, 140)

  arc(125, 570, 70, 70, PI, 0, CHORD)
  rect(90, 570, 70, 70)

  triangle(170, 640, 320, 500, 470, 640)
  arc(320, 535, 30, 69, PI, 0, CHORD)

  ellipse(550, 625, 100, 150)
  ellipse(600, 650, 200, 100)

  rect(1575, 590, 200, 50)
  rect(1605, 540, 140, 50)
  rect(1670, 440, 10, 100)
  triangle(1680, 440, 1720, 460, 1680, 480)

  fill("#67c8ef")
  rect(1585, 600, 15, 30)
  rect(1615, 600, 15, 30)
  rect(1650, 600, 15, 30)
  rect(1685, 600, 15, 30)
  rect(1720, 600, 15, 30)
  rect(1750, 600, 15, 30)

  rect(1620, 550, 15, 30)
  rect(1650, 550, 15, 30)
  rect(1680, 550, 15, 30)
  rect(1710, 550, 15, 30)

  rect(1605, 645, 25, 45)
  rect(1720, 645, 25, 45)

  arc(1675, 660, 60, 40, PI, 0, CHORD)
  rect(1645, 660, 60, 70)

  fill("#96e0ff")
  rect(1674, 660, 2, 70)
  rect(1645, 660, 60, 1)

  fill("#a85c06")
  rect(0, 700, 1800, 100)

  fill("#00891d")
  rect(0, 700, 1000, 10)
}

function animationSetup() {
  player = createSprite(100, 500)
  player.setCollider("rectangle", -5, -20, 30, 70)

  myAnimation = player.addAnimation("idle", "assets/player1-1.png", "assets/player1-1.png")
  player.addAnimation("moving", "assets/player1-1.png", "assets/player1-2.png")
  player.addAnimation("jumping", "assets/player1-3.png", "assets/player1-3.png")
}

function getCoin(player, collected) {
  collected.remove();
  score += 100;
  coinsCollected++;
  coinsLeft--;
}

function gameTenBegin() {
  gameStart = false;

  for (var i = 0; i < 10; i++) {
    var coin = createSprite(random(0, width), random(200, 490), 10, 10)
    coin.shapeColor = color("yellow")
    coins.add(coin)
    coinsGenerated++;
    coinsLeft++;
  }

  buttonTen.remove()
  buttonTwenty.remove()
  buttonThirty.remove()

  timer = 15;
}

function gameTwentyBegin() {
  gameStart = false;

  for (var i = 0; i < 20; i++) {
    var coin = createSprite(random(0, width), random(200, 490), 10, 10)
    coin.shapeColor = color("yellow")
    coins.add(coin)
    coinsGenerated++;
    coinsLeft++;
  }

  buttonTen.remove()
  buttonTwenty.remove()
  buttonThirty.remove()

  timer = 17;
}

function gameThirtyBegin() {
  gameStart = false;

  for (var i = 0; i < 30; i++) {
    var coin = createSprite(random(0, width), random(200, 490), 10, 10)
    coin.shapeColor = color("yellow")
    coins.add(coin)
    coinsGenerated++;
    coinsLeft++;
  }

  buttonTen.remove()
  buttonTwenty.remove()
  buttonThirty.remove()

  timer = 20000;
}

function beginGame() {
  gameStart = false;

  for (var i = 0; i < 15; i++) {
    var coin = createSprite(random(0, width), random(100, (height - 100)), 10, 10)
    coin.shapeColor = color("yellow")
    coins.add(coin)
  }

  buttonStart.remove()

  timer = 100;
}