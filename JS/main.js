const bodySnake = [];
const movement = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
}
class Snake {
    constructor(color, usuarioVelocidad, lenghtSnake, usuarioSnake, skin, secondaryColor) {
        this.color = color;
        this.velocidad = usuarioVelocidad;
        this.lenghtSnake = lenghtSnake;
        this.owner = usuarioSnake;
        this.skin = skin;
        this.secondaryColor = secondaryColor;
    }
}
class SnakeCell {
    constructor(posX, posY, vectorMov) {
        this.posX = posX;
        this.posY = posY;
        this.vectorMov = vectorMov;
    }
}
let food = {
    x: Math.round(Math.random() * 47 + 1) * (10),
    y: Math.round(Math.random() * 47 + 1) * (10),
}

function startGame() {

    bodySnake.unshift(new SnakeCell(250, 20, movement.DOWN));
    bodySnake.push(new SnakeCell(250, 10, movement.DOWN));
    bodySnake.push(new SnakeCell(250, 0, movement.DOWN));
}


// Ingreso de datos para la seleccion de la serpiente a utilizar.

let usuarioNombreIngresado = prompt("Bienvenido al Snake Game NFT!!!! \n¿Como quieres que se vea tu record en la tabla mundial?");
let usuarioSnakeChoice = prompt("Perfecto " + usuarioNombreIngresado + " bienvenido al 'Snake Game NFT'!\nAntes de iniciar el juego deberás elegir una 'Snake' desde tu portafolio de NFTs, o comprar una si aún no tienes ninguna!\nEscoge la opción de tu preferencia a continuación:\n\n1 - Seleccionar desde Portafolio.\n2 - Comprar una nueva desde Marketplace.");

let snakeChoice = new Snake("#484848", 100, 3, false, false, "#484848"); //default snake.

let datoIngresado = false;
while (datoIngresado == false) {
    for (intentos = 0; intentos < 2; intentos++) {
        if (usuarioSnakeChoice == '1') {
            seleccionarSnakeUsuario();
            datoIngresado = true;
            break;
        } else if (usuarioSnakeChoice == '2') {
            comprarSnakeNueva();
            datoIngresado = true;
            break;
        } else {
            usuarioSnakeChoice = prompt("Perfecto " + usuarioNombreIngresado + " bienvenido al 'Snake Game NFT'!\nAntes de iniciar el juego deberás elegir una 'Snake' desde tu portafolio de NFTs, o comprar una si aún no tienes ninguna!\nEscoge la opción de tu preferencia a continuación:\n\n1 - Seleccionar desde Portafolio.\n2 - Comprar una nueva desde Marketplace.");
        }
    }
    if (intentos == 2) {
        alert("Lo siento " + usuarioNombreIngresado + " se agotaron los intentos para seleccionar una opción.\n\nIntente jugar mañana!")
        datoIngresado = true;
    }
}

function seleccionarSnakeUsuario() {
    let colorSnake = prompt("Hola de nuevo " + usuarioNombreIngresado + " selecciona una de tus 'Snake' de tu portafolio personal:\n\n1 - Snake Red\n2 - Snake Black \n3 - Snake Blue \n4 - Snake Green \n0 - Comprar otra 'Snake' nueva.");

    switch (colorSnake) {
        case '0':
            comprarSnakeNueva();
            break;
        case '1':
            snakeChoice = new Snake("#D94945", 90, 3, true, false, "#D94945");
            startGame();
            break;
        case '2':
            snakeChoice = new Snake("#0F0E0E", 120, 3, true, false, "#DCE85B");
            startGame();
            break;
        case '3':
            snakeChoice = new Snake("#4D86B6", 60, 3, true, false, "#0F0E0E");
            startGame();
            break;
        case '4':
            snakeChoice = new Snake("#2A662B", (1000 / 15), 3, true, false, "#79820B");
            startGame();
            break;
        default:
            snakeChoice = new Snake("#484848", 75, 3, false, false, "#484848");
            startGame();
            alert("Bueno puede ingresar igualmente y jugar con el prediseñado.\n\nSu score no se guardará.");
            intentos = 4;
    }
    return snakeChoice
}

function comprarSnakeNueva() {

    snakeChoice = new Snake("#484848", 180, 3, false, false, "#484848");
    alert('Por le momento esta sección no está disponible.\nIgualmente podrá jugar con una versión clásica.\n\nMucha Suerte!!')

    startGame();

    return snakeChoice
}


//Hasta acá el código corresponde a la identificación del usuario y el ingreso de su 'Snake'

//__________________________________________________________________________________________________________________________________________//

//Uso del canvas para tomar datos y dibujar los elementos necesarios.

let lienzo = document.getElementById("mainScreenPlay");
let pincel = lienzo.getContext("2d");

const drawBorder = () => {
    pincel.strokeStyle = "#6A6A6C";
    pincel.beginPath();
    pincel.moveTo(10, 10);
    pincel.lineTo(490, 10);
    pincel.lineTo(490, 490);
    pincel.lineTo(10, 490);
    pincel.lineTo(10, 10);
    pincel.stroke();
    pincel.closePath();
}

let clearCanva = () => {
    pincel.clearRect(0, 0, 500, 500);
    drawBorder();

}

const drawBox = (xi, yi, color, secondaryColor) => {
    pincel.fillStyle = color;
    pincel.beginPath();
    pincel.moveTo(xi, yi);
    pincel.lineTo((xi + 10), yi);
    pincel.lineTo((xi + 10), (yi + 10));
    pincel.lineTo(xi, (yi + 10));
    pincel.fill();

    pincel.strokeStyle = secondaryColor;
    pincel.beginPath();
    pincel.moveTo((xi - 1), (yi - 1));
    pincel.lineTo(((xi - 1) + 10), (yi - 1));
    pincel.lineTo(((xi - 1) + 10), ((yi - 1) + 10));
    pincel.lineTo((xi - 1), ((yi - 1) + 10));
    pincel.lineTo((xi - 1), (yi - 1));
    pincel.stroke();
    pincel.closePath();
}

const drawFood = () => {
    drawBox(food.x, food.y, "#254925", "#254925");

    let empySlot = true;
    for (i = 0; i < bodySnake.length; i++) {
        if (food.x == bodySnake[i].posX && food.y == bodySnake[i].posY) {
            food.x = Math.round(Math.random() * 47 + 1) * (10);
            food.y = Math.round(Math.random() * 47 + 1) * (10);
            empySlot = false;
            break;
        }
    }
    if (empySlot == true) {
        drawBox(food.x, food.y, "#254925", "#254925");
    } else drawFood();
}

let drawSnake = () => {
    for (const cell of bodySnake) {
        drawBox(cell.posX, cell.posY, snakeChoice.color, snakeChoice.secondaryColor);
    }
}

//__________________________________________________________________________________________________________________________________________//

//Creación de los bucles e iteraciones para generar el movimiento de la serpiente.

const movementKey = (e) => {
    if (e.code === "ArrowUp" && bodySnake[0].vectorMov !== movement.DOWN) {
        bodySnake[0].vectorMov = movement.UP;
    } else if (e.code === "ArrowDown" && bodySnake[0].vectorMov !== movement.UP) {
        bodySnake[0].vectorMov = movement.DOWN;
    } else if (e.code === "ArrowLeft" && bodySnake[0].vectorMov !== movement.RIGHT) {
        bodySnake[0].vectorMov = movement.LEFT;
    } else if (e.code === "ArrowRight" && bodySnake[0].vectorMov !== movement.LEFT) {
        bodySnake[0].vectorMov = movement.RIGHT;
    } else if (e.code === "Enter") startGame();
    else return;
}
document.addEventListener('keyup', movementKey);


const ajustPosition = () => {
    let cabezaPosX = bodySnake[0].posX;
    let cabezaPosY = bodySnake[0].posY;
    let vecMov = bodySnake[0].vectorMov;

    if (bodySnake[0].vectorMov === movement.UP) {

        cabezaPosY -= 10;

    } else if (bodySnake[0].vectorMov === movement.DOWN) {

        cabezaPosY += 10;

    } else if (bodySnake[0].vectorMov === movement.LEFT) {

        cabezaPosX -= 10;

    } else if (bodySnake[0].vectorMov === movement.RIGHT) {

        cabezaPosX += 10;

    } else ajustPosition();

    bodySnake.unshift(new SnakeCell(cabezaPosX, cabezaPosY, vecMov));

    return bodySnake.pop();
}

//__________________________________________________________________________________________________________________________________________//

//Condiciones de finalización y continuidad del juego.

const checkPosition = () => {
    //Verificamos que la cabeza de la serpiente no se encuentre en superposición con el resto del cuerpo
    for (i = 0; i < bodySnake.length; i++) {
        for (j = 0; j < bodySnake.length; j++) {
            if (bodySnake[i] != bodySnake[j]) {
                if (bodySnake[i].posX == bodySnake[j].posX && bodySnake[i].posY == bodySnake[j].posY) {

                    pincel.font = '38px Press Start 2P';
                    pincel.fillText("Game over!!", 230, 250);
                    clearInterval(gameInterval);

                    console.log("¡¡Game Over!! Press F5 for play again");
                }
            }
        }
    }
    //Verificamos que la cabeza de la serpiente no se encuentre fuera del margen del juego delimitado por esas posiciones
    if (bodySnake[0].posX < 10 || bodySnake[0].posX + 10 > 490 || bodySnake[0].posY < 10 || bodySnake[0].posY + 10 > 490) {
        pincel.font = "30px Press Start";
        pincel.fillText("Game over!!", 190, 250);
        clearInterval(gameInterval);

        console.log("¡¡Game Over!! Press F5 for play again");
    }
    //Verificamos si la cabeza de la serpiente coincide con la posicion de la comida; en caso de que coincidan aumentamos la longitud de la serpiente, y redefinimos una nueva posicion para la serpiente
    if (bodySnake[0].posX == food.x && bodySnake[0].posY == food.y) {
        snakeChoice.lenghtSnake++;
        bodySnake.push(new SnakeCell(500, 500, movement.DOWN));
        food.x = Math.round(Math.random() * 47 + 1) * (10);
        food.y = Math.round(Math.random() * 47 + 1) * (10);
        drawFood();
        console.log(usuarioNombreIngresado + " score: " + (snakeChoice.lenghtSnake - 3));

    }
}

//__________________________________________________________________________________________________________________________________________//

//Loop del juego para que se repita dependiendo de la frecuencia condicionada por al serpiente elegida.

function gameLoop() {
    clearCanva();
    drawFood();
    ajustPosition();
    checkPosition();
    drawSnake();
}

let gameInterval = setInterval(gameLoop, snakeChoice.velocidad);

console.log(snakeChoice);

//__________________________________________________________________________________________________________________________________________//

//Créditos:

//FunFunFunction: https://www.youtube.com/watch?v=jRstJFiWnDQ

//Appdelante: Daniel Macario: https://www.youtube.com/watch?v=GbPAYZ7tXUY

//Juego de AppDelante: https://culebrita-appdelante.vercel.app/juego.html