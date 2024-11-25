const canvas = document.getElementById("game") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
interface Character {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  speed: number;
}
interface Ammo {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
}

interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  color: string;
}
interface Crosshair {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}
interface Target {
  x: number;
  y: number;
}
const target: Target = {
  x: 0,
  y: 0,
};
const ammolist: Ammo[] = [];
// Define the character
const character: Character = {
  x: 150,
  y: 100,
  width: 50,
  height: 50,
  color: "blue",
  speed: 1,
};
const enemy: Enemy = {
  x: 250,
  y: 300,
  width: 50,
  height: 50,
  color: "red",
  speed: 1,
};
const crosshair: Crosshair = {
  x: 170,
  y: 170,
  width: 10,
  height: 10,
  color: "orange",
};
// Draw the character
function drawCharacter(): void {
  ctx.fillStyle = character.color;
  ctx.fillRect(character.x, character.y, character.width, character.height);
}
function drawEnemy(): void {
  ctx.fillStyle = enemy.color;
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}
const xax = document.querySelector(".x");
const yax = document.querySelector(".y");
const targetXY = document.querySelector(".target");

const charXY = document.querySelector(".characterXY");

// Clear the canvas
function clearCanvas(): void {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
const keys: { [key: string]: boolean } = {};
let fire: boolean = false;
// Listen for keydown and keyup events
window.addEventListener("keydown", (event) => {
  keys[event.key] = true;
});

window.addEventListener("keyup", (event) => {
  keys[event.key] = false;
});

window.addEventListener("mousedown", (event) => {
  if (event.button === 0) {
    target.x = crosshair.x;
    target.y = crosshair.y;
    spawnAmmo();
  }
});
window.addEventListener("mousemove", (e) => {
  crosshair.x = e.x;
  crosshair.y = e.y;

  xax?.textContent = `x-axis ` + e.x;
  yax?.textContent = `y-axis ` + e.y;
  targetXY?.textContent = `TARGET : ${e.x}, ${e.y}`;
});

function drawTarget(): void {
  ctx.fillStyle = crosshair.color;
  ctx.fillRect(crosshair.x, crosshair.y, crosshair.width, crosshair.height);
}
function spawnAmmo(): void {
  const newAmmo: Ammo = {
    x: character.x + character.width / 2 - 5, //to create ammo at center of the character
    y: character.y,
    width: 5,
    speed: 0.005,
    color: "black",
    height: 5,
  };
  ammolist.push(newAmmo);
}
function detectCollision(): void {
  // console.log("sdfsd");
  //
  // let enemyHitbox = enemy.x
  // if (character.x == enemy.x && character.y == enemy.y) {
  //   console.log("bulls eyeeeeee");
  // }
  // for (let i = ammolist.length - 1; i >= 0; i--) {
  //   const ammo = ammolist[i];
  //   // y=y-speed
  //   //
  //   if (
  //     ammo.y + ammo.height < 0 ||
  //     ammo.y > 590 ||
  //     ammo.x < 0 ||
  //     ammo.x > 850
  //   ) {
  //     ammolist.splice(i, 1);
  //   }
  // }
}
function updateAmmo(): void {
  for (let i = ammolist.length - 1; i >= 0; i--) {
    const ammo = ammolist[i];
    // y=y-speed

    let diffY = target.y - character.y;
    let diffX = target.x - character.x;

    let dy = ammo.y + 2.5 - (enemy.y + 25);
    let dx = ammo.x + 2.5 - (enemy.x + 25);
    let distance = Math.sqrt(dy * dy + dx * dx);
    // console.log(distance);
    ammo.y += ammo.speed * diffY;
    ammo.x += ammo.speed * diffX;

    if (distance < 40) {
      enemy.width = 0;
      enemy.height = 0;
      console.log("bulls eye");
    }

    if (
      ammo.y + ammo.height < 0 ||
      ammo.y > 590 ||
      ammo.x < 0 ||
      ammo.x > 850
    ) {
      ammolist.splice(i, 1);
    }
  }
}

function drawAmmo(): void {
  ammolist.forEach((ammo) => {
    ctx.fillStyle = ammo.color;
    ctx.fillRect(ammo.x, ammo.y, ammo.width, ammo.height);
  });
}
// Update the character's position
function updateCharacter(): void {
  if (keys["ArrowUp"]) character.y -= character.speed;
  if (keys["ArrowDown"]) character.y += character.speed;
  if (keys["ArrowLeft"]) character.x -= character.speed;
  if (keys["ArrowRight"]) character.x += character.speed;

  // Prevent the character from leaving the canvas
  character.x = Math.max(
    0,
    Math.min(canvas.width - character.width, character.x),
  );
  character.y = Math.max(
    0,
    Math.min(canvas.height - character.height, character.y),
  );

  charXY?.textContent = `X: ${parseInt(character.x)}  y: ${parseInt(character.y)}`;
}

function updateEnemy(): void {
  // if (keys["ArrowUp"]) character.y -= character.speed;
  // if (keys["ArrowDown"]) character.y += character.speed;
  // if (keys["ArrowLeft"]) character.x -= character.speed;
  // if (keys["ArrowRight"]) character.x += character.speed;

  // Prevent the character from leaving the canvas
  character.x = Math.max(
    0,
    Math.min(canvas.width - character.width, character.x),
  );
  if (enemy.x > 600) {
    enemy.x -= enemy.speed;
  } else if (enemy.x < 0) {
    enemy.x += enemy.speed;
  } else {
    enemy.x += enemy.speed;
  }
  // enemy.x += enemy.speed;
  // //
  // let i = 100;
  // while (i < 20) {
  //   if (i < 5) enemy.x += enemy.speed;
  //   if (i > 5 && i < 10) enemy.y -= enemy.speed;
  //   if (i > 10 && i < 15) enemy.x -= enemy.speed;
  //   if (i > 15 && i < 20) enemy.y += enemy.speed;
  //   i++;
  //   console.log(i);
  // }
  character.y = Math.max(
    0,
    Math.min(canvas.height - character.height, character.y),
  );
}
// Game loop
function gameLoop(): void {
  clearCanvas();

  updateCharacter();
  detectCollision();
  updateEnemy();
  updateAmmo();
  drawTarget();
  drawCharacter();
  drawEnemy();
  drawAmmo();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
