// const canvas2 = document.getElementById("game") as HTMLCanvasElement;
// const ctx = canvas2.getContext("2d") as CanvasRenderingContext2D;

// interface Canvas2 {
//   x: number;
//   y: number;
//   height: number;
//   width: number;
//   color: string;
// }
// interface Crosshair {
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   color: string;
// }
// interface Wall {
//   x: number;
//   y: number;
//   height: number;
//   width: number;
//   color: string;
// }
// const customMap: Canvas = {
//   x: 0,
//   y: 0,
//   width: 0,
//   height: 0,
//   color: "red",
// };

// const wall: Wall = {
//   x: 100,
//   y: 100,
//   height: 20,
//   width: 100,
//   color: "grey",
// };

// const crosshair: Crosshair = {
//   x: 170,
//   y: 170,
//   width: 10,
//   height: 10,
//   color: "orange",
// };

// function drawWall2(): void {
//   ctx.fillStyle = wall.color;
//   ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
// }
// const xax = document.querySelector(".x") as HTMLElement;
// const yax = document.querySelector(".y") as HTMLElement;
// const targetXY = document.querySelector(".target") as HTMLElement;

// const charXY = document.querySelector(".characterXY") as HTMLElement;
// const wallMode = document.querySelector(".wall");

// wallMode?.addEventListener("click", (e) => {
//   const width = document.querySelector("#wallWidth") as HTMLElement;
//   const height = document.querySelector("#wallHeight") as HTMLElement;
//   const gameTouch = document.querySelector("#game") as HTMLElement;

//   crosshair.width = width.value;
//   crosshair.height = height.value;

//   gameTouch.addEventListener("click", (e) => {
//     console.log("hello");
//   });
// });
// window.addEventListener("mousemove", (e) => {
//   crosshair.x = e.x;
//   crosshair.y = e.y;

//   xax.textContent = `x-axis ` + e.x;
//   yax.textContent = `y-axis ` + e.y;
//   targetXY.textContent = `TARGET : ${e.x}, ${e.y}`;
// });
// // Clear the canvas
// function clearCanvas2(): void {
//   ctx.clearRect(0, 0, canvas.width, canvas.height);
// }

// function drawTarget2(): void {
//   ctx.fillStyle = crosshair.color;
//   ctx.fillRect(crosshair.x, crosshair.y, crosshair.width, crosshair.height);
// }

// function fetchMapData() {
//   fetch("../src/map.json")
//     .then((response) => response.json())
//     .then((data) => {
//       customMap.width = data.canvas[0].width;
//       customMap.height = data.canvas[0].height;
//       customMap.color = data.canvas[0].color;
//     })
//     .catch((error) => console.log(error));
// }

// function drawMap2() {
//   ctx.fillStyle = customMap.color;
//   ctx.fillRect(customMap.x, customMap.y, customMap.width, customMap.height);
// }
// fetchMapData();
// function gameLoop(): void {
//   clearCanvas2();
//   drawMap2();

//   drawTarget2();
//   drawWall2();
//   requestAnimationFrame(gameLoop);
// }

// // Start the game loop
// gameLoop();
