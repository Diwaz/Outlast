
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
    x:number;
    y:number;
    width:number;
    height:number;
    speed:number;
    color:string;

}
interface Crosshair {
    x: number,
    y:number,
    width:number,
    height:number,
    color:string
}
interface Target {
    x: number;
    y: number;
}
const target: Target = {
    x:0,
    y:0
}
const ammolist: Ammo[] = [];
// Define the character
const character: Character = {
    x: 150,
    y: 100,
    width: 50,
    height: 50,
    color: 'red',
    speed: 0.8,
};
const crosshair : Crosshair ={
    x:170,
    y:170,
    width:10,
    height:10,
    color:'blue'
}
// Draw the character
function drawCharacter(): void {
    ctx.fillStyle = character.color;
    ctx.fillRect(character.x, character.y, character.width, character.height);
}
const xax=document.querySelector('.x');
const yax=document.querySelector('.y');
const targetXY=document.querySelector('.target');

const charXY=document.querySelector('.characterXY')

// Clear the canvas
function clearCanvas(): void {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
const keys: { [key: string]: boolean } = {};
let fire : boolean= false;
// Listen for keydown and keyup events
window.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

window.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

window.addEventListener('mousedown',(event)=>{
if(event.button===0){
    target.x=crosshair.x;
    target.y=crosshair.y;
    spawnAmmo();

}

})
window.addEventListener('mousemove',(e)=>{
    crosshair.x=e.x;
    crosshair.y=e.y;

    xax?.textContent=`x-axis `+e.x;
    yax?.textContent=`y-axis `+e.y;
    targetXY?.textContent=`TARGET : ${e.x}, ${e.y}`
})

function drawTarget():void{
    ctx.fillStyle=crosshair.color;
    ctx.fillRect(crosshair.x,crosshair.y,crosshair.width,crosshair.height)
}
function spawnAmmo ():void

{
    const newAmmo : Ammo ={
        x: character.x+character.width/2-5,//to create ammo at center of the character
        y:character.y,
        width:5,
        speed:0.005,
        color:'black',
        height:5,
    }
    ammolist.push(newAmmo)
}
function updateAmmo ():void{
   
    for (let i=ammolist.length-1;i>=0;i--){
        const ammo = ammolist[i];
        // y=y-speed
        let diffY = target.y-character.y;
        let diffX = target.x-character.x;
        
        ammo.y +=ammo.speed*diffY;
        ammo.x +=ammo.speed*diffX;


        // ammo.y=diffY*ammo.speed;
        // ammo.x=diffX*ammo.speed;
        // if(diffY>0 && diffX > 0){
        //     ammo.y -=diffY*ammo.speed;
        //     ammo.x +=diffX*ammo.speed;
        // }
        // if(diffY>0 && diffX <0){
        //     ammo.y -=diffY*ammo.speed;
        //     ammo.x -=diffX*ammo.speed;
        // }
        // if(diffY<0 && diffX > 0){
        //     ammo.y +=diffY*ammo.speed;
        //     ammo.x +=diffX*ammo.speed;
        // }
        // if(diffY<0 && diffX < 0){
        //     ammo.y +=diffY*ammo.speed;
        //     ammo.x -=diffX*ammo.speed;
        // }

        
        // if(target.y>character.y && target.x < character.x){

        // }
        // if(target.y<character.y && target.x < character.x){

        // }
        // if(target.y<character.y && target.x > character.x){

        // }


        // if(target.y>character.y){
        //     ammo.y -=ammo.speed
        // }else{
        //     ammo.y += ammo.speed
        // }
        //  if(target.x>character.x){
        //     ammo.x +=ammo.speed
        // }else{
        //     ammo.x -= ammo.speed
        // }
        

        

        //remove if goes out of bound
        if(ammo.y+ammo.height<0){
            ammolist.splice(i,1);
        }
    }

}

function drawAmmo():void {
    ammolist.forEach((ammo)=>{
        ctx.fillStyle = ammo.color;
        ctx.fillRect(ammo.x,ammo.y,ammo.width,ammo.height);
    })
}
// Update the character's position
function updateCharacter(): void {
    if (keys['ArrowUp']) character.y -= character.speed;
    if (keys['ArrowDown']) character.y += character.speed;
    if (keys['ArrowLeft']) character.x -= character.speed;
    if (keys['ArrowRight']) character.x += character.speed;

    // Prevent the character from leaving the canvas
    character.x = Math.max(0, Math.min(canvas.width - character.width, character.x));
    character.y = Math.max(0, Math.min(canvas.height - character.height, character.y));

    charXY?.textContent=`X: ${parseInt(character.x)}  y: ${parseInt(character.y)}`
}
// Game loop
function gameLoop(): void {
    clearCanvas();
    
    updateCharacter();
    updateAmmo();
    drawTarget();
    drawCharacter();
    drawAmmo();
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
