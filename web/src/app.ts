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

interface Canvas {
  x: number;
  y: number;
  height: number;
  width: number;
  color: string;
}

interface Camera {
  x: number;
  y: number;
  height: number;
  width: number;
  color: string;
}

interface Wall {
  x: number;
  y: number;
  height: number;
  width: number;
  color: string;
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

const customMap: Canvas = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  color: "red",
};

const cameraView: Camera = {
  x: 0,
  y: 0,
  width: 200,
  height: 200,
  color: "red",
};
const wall: Wall = {
  x: 100,
  y: 100,
  height: 20,
  width: 100,
  color: "grey",
};
const ammolist: Ammo[] = [];
// Define the character
const character: Character = {
  x: 0,
  y: 0,
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
  // ctx.fillStyle = "rgba(100,100,100,0.5)";
  // ctx.globalAlpha = 0.5;
  ctx.fillStyle = character.color;
  ctx.fillRect(character.x, character.y, character.width, character.height);
}
function drawCamera(): void {
  ctx.fillStyle = "rgba(100,100,100,0.5)";

  ctx.fillRect(
    character.x - cameraView.width / 2 + character.width / 2,
    character.y - cameraView.height / 2 + character.height / 2,
    cameraView.width,
    cameraView.height,
  );
}
function drawEnemy(): void {
  ctx.fillStyle = enemy.color;
  ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
}
function drawWall(): void {
  ctx.fillStyle = wall.color;
  ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
}
const xax = document.querySelector(".x") as HTMLElement;
const yax = document.querySelector(".y") as HTMLElement;
const targetXY = document.querySelector(".target") as HTMLElement;

const charXY = document.querySelector(".characterXY") as HTMLElement;

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

  xax.textContent = `x-axis ` + e.x;
  yax.textContent = `y-axis ` + e.y;
  targetXY.textContent = `TARGET : ${e.x}, ${e.y}`;
});

function fetchMapData() {
  fetch("../src/map.json")
    .then((response) => response.json())
    .then((data) => {
      customMap.width = data.canvas[0].width;
      customMap.height = data.canvas[0].height;
      customMap.color = data.canvas[0].color;
    })
    .catch((error) => console.log(error));
}
function drawMap() {
  ctx.fillStyle = customMap.color;
  var img = new Image();

  img.src = "../src/desert.jpg";
  // img.onload = function () {
  ctx.drawImage(
    img,
    customMap.x,
    customMap.y,
    customMap.width,
    customMap.height,
  );
  // };
  // ctx.fillRect(customMap.x, customMap.y, customMap.width, customMap.height)
}
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

// function detectCollision(): void {
//   // console.log("sdfsd");
//   //
//   // let enemyHitbox = enemy.x
//   // if (character.x == enemy.x && character.y == enemy.y) {
//   //   console.log("bulls eyeeeeee");
//   // }
//   // for (let i = ammolist.length - 1; i >= 0; i--) {
//   //   const ammo = ammolist[i];
//   //   // y=y-speed
//   //   //
//   //   if (
//   //     ammo.y + ammo.height < 0 ||
//   //     ammo.y > 590 ||
//   //     ammo.x < 0 ||
//   //     ammo.x > 850
//   //   ) {
//   //     ammolist.splice(i, 1);
//   //   }
//   // }
// }

//
function updateAmmo(): void {
  for (let i = ammolist.length - 1; i >= 0; i--) {
    const ammo = ammolist[i];
    // y=y-speed

    let diffY = target.y - character.y;
    let diffX = target.x - character.x;

    let targetAngle = Math.atan2(diffY, diffX) * (180 / 3.14);
    let dy = ammo.y + 2.5 - (enemy.y + 25);
    let dx = ammo.x + 2.5 - (enemy.x + 25);
    let distance = Math.sqrt(dy * dy + dx * dx);
    const angleHTML = document.querySelector(".angle");
    angleHTML?.textContent = `angle: ` + targetAngle; // let characterCentre = ((character.x + character.width) / 2);
    // let targetCenterX = ((crosshair.x + crosshair.width) / 2);
    // let base =characterCentre - target.x;
    // let perpendicular =
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

  charXY.textContent = `X: ${Math.round(character.x)}  y: ${Math.round(character.y)}`;
}

function updateEnemy(): void {
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
  character.y = Math.max(
    0,
    Math.min(canvas.height - character.height, character.y),
  );
}
function updateWall(): void {
  if (
    wall.x + wall.width > character.x &&
    wall.y + wall.height > character.y &&
    wall.y < character.y + character.height &&
    wall.x < character.x + character.width
  ) {
    if (character.x + character.width < wall.x + 5) {
      character.x -= 1;
    } else if (character.x + 5 > wall.x + wall.width) {
      character.x += 1;
    } else if (character.y + character.height > wall.y + wall.height) {
      character.y += 1;
    } else if (character.y + character.height < wall.y) {
      character.y -= 1;
    } else {
      character.y -= 1;
    }
  }
}

// Game loop

let devMode: boolean = false;
let gameMode: boolean = true;

// const devBtn = document.querySelector(".mapMode");
// const gameBtn = document.querySelector(".devMode");
// devBtn?.addEventListener("click", (e) => {
//   gameMode = false;

//   devBtn?.style = "display:none";
//   gameBtn?.style = "display:flex";
// });

// gameBtn?.addEventListener("click", (e) => {
//   gameMode = true;
//   devBtn?.style = "display:flex";
//   gameBtn?.style = "display:none";
// });

fetchMapData();
function gameLoop(): void {
  clearCanvas();

  updateWall();
  updateCharacter();
  updateEnemy();
  updateAmmo();
  drawMap();
  drawCamera();
  drawTarget();
  drawCharacter();
  drawEnemy();
  drawAmmo();
  drawWall();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
