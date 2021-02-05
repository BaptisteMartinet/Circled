/*
# header
*/

class Player {
  constructor(_pos, _radius, _color, _isMine) {
    this.pos = _pos;
    this.destination = createVector(this.pos.x, this.pos.y);
    this.radius = _radius;
    this.color = _color;
    this.isMine = _isMine;
  }

  update() {
    this.pos.x = lerp(this.pos.x, this.destination.x, 0.3)
    this.pos.y = lerp(this.pos.y, this.destination.y, 0.3)
  }

  draw() {
    stroke(255, 255, 255, 150)
    strokeWeight(6)
    fill(this.color)
    circle(this.pos.x, this.pos.y, this.radius);

    if (this.isMine) {
      fill(255);
      stroke(255, 255, 255, 150);
      strokeWeight(5)
      textAlign(CENTER, CENTER);
      textSize(10);
      text('+', this.pos.x, this.pos.y);
    }
  }
  
  setDestination(_x, _y) {
    this.destination.x = _x;
    this.destination.y = _y;
  }
}

class Zone {
  constructor(_center, _radius) {
    this.center = _center;
    this.radius = _radius;
  }
  
  draw() {
    noFill();
    stroke(0);
    strokeWeight(2);
    arc(this.center.x, this.center.y, this.radius * 2, this.radius * 2, 0, PI*2);
  }
  
  setCenter(players) {
    this.center.x = lerp(players[0].pos.x, players[1].pos.x, 0.5);
    this.center.y = lerp(players[0].pos.y, players[1].pos.y, 0.5);
  }
}

const PLAYERS = Object.freeze({"ME":0, "HIM":1});

var players = [null, null];
var zone = null;

var Socket = null;

function drawBackground()
{
  noFill();
  stroke(0, 0, 0, 100)
  strokeWeight(6)
  arc(400, 400, 800, 800, 0, PI * 2);

  stroke(255)
  strokeWeight(800)
  arc(400, 400, 1600, 1600, 0, PI * 2);
}

function drawLineBetweenPLayers()
{
  stroke(0,0,0,30);
  strokeWeight(6)
  line(players[0].pos.x, players[0].pos.y, players[1].pos.x, players[1].pos.x);
}

function preload() {}

function setup() {
  createCanvas(800, 800);

  players[PLAYERS.ME] = new Player(createVector(400, 400), 50, color(0, 0, 200), true);
  players[PLAYERS.HIM] = new Player(createVector(400, 400), 50, color(200, 0, 0), false);
  
  zone = new Zone(createVector(400, 400), 200);

  noCursor()

  socket = io.connect();
  socket.on('connect', function() {
    console.log('Socket status', socket.connected);
  });
}

function draw() {
  background(255);

  drawLineBetweenPLayers();
  
  /* PLAYERS */
  for (let i = 1; i >= 0; i--) {
    players[i].update();
    players[i].draw();
  }
  
  /* ZONE */
  zone.setCenter(players);
  zone.draw();
  
  /* BACKGROUND */
  drawBackground();
}

function mouseMoved() {
  players[PLAYERS.ME].setDestination(mouseX, mouseY);
  //send on network
}