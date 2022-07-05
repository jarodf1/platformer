// define variables
var game;
var player;
var platforms;
var badges;
var items;
var cursors;
var jumpButton;
var text;
var winningMessage;
var won = false;
var currentScore = 0;
var winningScore = 95;

// add collectable items to the game
function addItems() {
  items = game.add.physicsGroup();
  createItem(375, 300, "poison");
  createItem(500, 500, "coin");
  createItem(200, 200, "coin");
  createItem(100, 100, "star");
  createItem(250, 400, "coin");
  createItem(550, 100, "coin");
  createItem(625, 325, "coin");
  createItem(100, 300, "coin");
  createItem(300, 50, "coin");
}

// add platforms to the game
function addPlatforms() {
  platforms = game.add.physicsGroup();
  platforms.create(450, 175, "platform");
  platforms.create(300, 350, "platform2");
  platforms.create(500, 375, "platform");
  platforms.create(20, 350, "platform2");
  platforms.create(150, 450, "platform");
  platforms.create(400, 550, "platform");
  platforms.create(150, 250, "platform2");
  platforms.create(40, 150, "platform");
  platforms.create(225, 100, "platform2");
  platforms.setAll("body.immovable", true);
}

// create a single animated item and add to screen
function createItem(left, top, image) {
  var item = items.create(left, top, image);
  item.animations.add("spin");
  item.animations.play("spin", 10, true);
}

// create the winning badge and add to screen
function createBadge() {
  badges = game.add.physicsGroup();
  var badge = badges.create(750, 400, "badge");
  badge.animations.add("spin");
  badge.animations.play("spin", 10, true);
}


// when the player collects an item on the screen
function itemHandler(player, item) {
  item.kill();
  console.log(item.key)
    if(item.key == "coin"){
      currentScore = currentScore + 10;
    }
    if(item.key == "poison"){
    currentScore = currentScore - 25;
    }
    if(item.key == "star"){
      currentScore = currentScore + 25;
    }

  if (currentScore === winningScore) {
    createBadge();
  }
}

// when the player collects the badge at the end of the game
function badgeHandler(player, badge) {
  badge.kill();
  won = true;
}

// setup game when the web page loads
window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, "", {
    preload: preload,
    create: create,
    update: update,
    render: render,
  });

  // before the game begins
  function preload() {
    game.stage.backgroundColor = "#5db1ad";

    //Load images
    game.load.image("platform", "assets/platform_1.png");
    game.load.image("platform2", "assets/platform_2.png");

    //Load spritesheets
    game.load.spritesheet("player", "assets/poketrainer.png", 64, 61);
    game.load.spritesheet("coin", "assets/coin.png", 36, 44);
    game.load.spritesheet("badge", "assets/badge.png", 42, 54);
    game.load.spritesheet("poison", "assets/poison.png", 32, 32);
    game.load.spritesheet("star", "assets/star.png", 32, 32);
  }

  // initial game set up
  function create() {
    player = game.add.sprite(50, 600, "player");
    player.animations.add("walk");
    player.anchor.setTo(0.5, 1);
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 600;

    addItems();
    addPlatforms();

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    text = game.add.text(16, 16, "SCORE: " + currentScore, {
      font: "bold 24px Arial",
      fill: "white",
    });
    winningMessage = game.add.text(game.world.centerX, 275, "", {
      font: "bold 48px Arial",
      fill: "white",
    });
    winningMessage.anchor.setTo(0.5, 1);
  }

  // while the game is running
  function update() {
    text.text = "SCORE: " + currentScore;
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, items, itemHandler);
    game.physics.arcade.overlap(player, badges, badgeHandler);
    player.body.velocity.x = 0;

    // is the left cursor key presssed?
    if (cursors.left.isDown) {
      player.animations.play("walk", 10, true);
      player.body.velocity.x = -300;
      player.scale.x = -1;
    }
    // is the right cursor key pressed?
    else if (cursors.right.isDown) {
      player.animations.play("walk", 10, true);
      player.body.velocity.x = 300;
      player.scale.x = 1;
    }
    // player doesn't move
    else {
      player.animations.stop();
    }

    if (
      jumpButton.isDown &&
      (player.body.onFloor() || player.body.touching.down)
    ) {
      player.body.velocity.y = -500;
    }
    // when the player winw the game
    if (won) {
      winningMessage.text = "YOU WIN!!!";
    }
  }

  function render() {}
};
