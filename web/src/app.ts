
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

// Define the character
const character: Character = {
    x: 150,
    y: 100,
    width: 50,
    height: 50,
    color: 'red',
    speed: 0.8,
};

// Draw the character
function drawCharacter(): void {
    ctx.fillStyle = character.color;
    ctx.fillRect(character.x, character.y, character.width, character.height);
}

// Clear the canvas
function clearCanvas(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
const keys: { [key: string]: boolean } = {};

// Listen for keydown and keyup events
window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
    console.log(keys)
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

// Update the character's position
function updateCharacter(): void {
    if (keys['ArrowUp']) character.y -= character.speed;
    if (keys['ArrowDown']) character.y += character.speed;
    if (keys['ArrowLeft']) character.x -= character.speed;
    if (keys['ArrowRight']) character.x += character.speed;

    // Prevent the character from leaving the canvas
    character.x = Math.max(0, Math.min(canvas.width - character.width, character.x));
    character.y = Math.max(0, Math.min(canvas.height - character.height, character.y));
}
// Game loop
function gameLoop(): void {
    clearCanvas();
    drawCharacter();
    updateCharacter();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
