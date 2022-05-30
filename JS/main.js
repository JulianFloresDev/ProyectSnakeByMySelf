//Constantes para la manipulación del DOM
//__________________________________________________________________________________________________________________________________________//

const headerElementsBtn = document.querySelectorAll(".headerElements"),

    gameConteiner = document.querySelector(".conteiner"),

    selectSnakeBtn = document.querySelectorAll(".btn-selectSnake"),

    buySnakeBtn = document.querySelector(".btn-buySnake"),

    scoreBtn = document.querySelector(".btn-showScore"),

    divSnakeValues = document.querySelector(".snake-values"),

    divScoreTable = document.querySelector(".globalScore"),

    score = document.querySelector(".score"),

    enterGameBtn = document.querySelector(".btn-enterGame"),

    divInvalid = document.querySelector(".invalid"),

    startPlayBtn = document.querySelector(".btn-startGame"),

    checkBtn = document.querySelector(".checkbox"),

    singUpBtn = document.querySelector(".btn-singUp"),

    logOutBtn = document.querySelector(".btn-logOut"),

    sesionStartOptions = document.querySelector(".conteiner-sesionStart"),

    inputUsername = document.querySelector("#usernameInput"),

    inputPassword = document.querySelector("#passwordInput"),

    selectSnakeConteiner = document.querySelector(".selectSnake-conteiner"),

    playWithSelectedBtn = document.querySelector(".btn-playWithSelected");


let snakeChoice;
let gameInterval;

const bodySnake = [],

    snakeColecction = [{
        name: "Default Snake",
        color: "#477A28",
        speed: 105,
        lenghtSnake: 4,
        owner: false,
        secondaryColor: "#D8DD4A"
    }, {
        name: "Black Piton",
        color: "#0F0E0E",
        speed: 125,
        lenghtSnake: 6,
        owner: false,
        secondaryColor: "#DCE85B"
    }, {
        name: "Red Dragon",
        color: "#B30E09",
        speed: 135,
        lenghtSnake: 10,
        owner: false,
        secondaryColor: "#CF4C05"
    }, {
        name: "Blue Fish Sea Viper",
        color: "#4D86B6",
        speed: 75,
        lenghtSnake: 1,
        owner: false,
        secondaryColor: "#0F0E0E"
    }];

class Player {
    constructor(usernameLogIn, passwordLogIn, cardRegistered, snakeColecction, maxScore) {
        this.usernameLogIn = usernameLogIn;
        this.passwordLogIn = passwordLogIn;
        this.cardRegistered = cardRegistered;
        this.snakeColecction = snakeColecction;
        this.maxScore = maxScore;
    }
};
class Snake {
    constructor(name, color, speed, lenghtSnake, owner, secondaryColor) {
        this.name = name;
        this.color = color;
        this.speed = speed;
        this.lenghtSnake = lenghtSnake;
        this.owner = owner;
        this.secondaryColor = secondaryColor;
    }
};
class SnakeCell {
    constructor(posX, posY, vectorMov) {
        this.posX = posX;
        this.posY = posY;
        this.vectorMov = vectorMov;
    }
};
const movement = {
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT: 4,
};
let food = {
    x: Math.round(Math.random() * 47 + 1) * (10),
    y: Math.round(Math.random() * 47 + 1) * (10),
}

//__________________________________________________________________________________________________________________________________________//

//                                       Inicio de Sesión y Registro del Usuario
//__________________________________________________________________________________________________________________________________________//

let player = new Player(`Player #${Math.round(Math.random()*100 + 1)}`, undefined, null, snakeColecction, 0);

snakeChoice = player.snakeColecction[Math.round(Math.random() * (snakeColecction.length - 1))];

const saveNewData = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
}

let usersDataBase = JSON.parse(localStorage.getItem("usersDataBase")) || [];

const displayGame = () => {
    sesionStartOptions.style.display = "none";
    enterGameBtn.style.display = "none";
    logOutBtn.style.display = "flex";
    gameConteiner.style.display = "flex";

    headerElementsBtn.forEach(element => {
        //Cada elemento del Header oculto se muestra con display "inline-block"
        element.style.display = "inline-block";
    });
    scoreBtn.style.display = "flex";

    clearCanva();
    drawInstructions();
}

enterGameBtn.addEventListener("click", () => {
    sesionStartOptions.style.display = "flex";
    inputUsername.focus();

    gameConteiner.style.display = "none";
});

singUpBtn.addEventListener("click", () => {
    InputVerification(inputUsername.value, inputPassword.value);

    (inputUsername.value != "" && inputPassword.value != "") && userSingUp(inputUsername.value, inputPassword.value);
});


startPlayBtn.addEventListener("click", () => {
    InputVerification(inputUsername.value, inputPassword.value);

    (inputUsername.value != "" && inputPassword.value != "") && userSingInVerication(inputUsername.value, inputPassword.value);
});

logOutBtn.addEventListener("click", () => {

    logOutBtn.style.display = "none";
    headerElementsBtn.forEach(element => {
        //Cada elemento del Header oculto se muestra con display "inline-block"
        element.style.display = "none";
    });
    scoreBtn.style.display = "flex";

    enterGameBtn.style.display = "flex";

    player = new Player(`Player #${Math.round(Math.random()*100 + 1)}`, undefined, null, snakeColecction, null);

    clearCanva();
    drawInstructions();
})

const InputVerification = (user, password) => {
    if (user == "" || password == "") {
        divInvalid.innerHTML = `<p>You must enter a valid name and password.</p>`;
    }
}

const userSingUp = (user, password) => {
    if (checkBtn.checked) {
        player = new Player(user, password, null, snakeColecction, 0);
        usersDataBase.push(player);

        localStorage.removeItem("usersDataBase");
        saveNewData("usersDataBase", usersDataBase);

        displayGame();
    } else {
        player = new Player(user, password, null, snakeColecction, 0);
        displayGame();
        return player
    }
}

const userSingInVerication = (user, password) => {

    let userExist = usersDataBase.find(element => element.usernameLogIn === user);

    if (userExist == undefined) {
        divInvalid.innerHTML = `<p>That user dosen't exist.</p>
        <p>Try to Sing Up first!</p>`;

        singUpBtn.style.display = "flex";
        startPlayBtn.style.display = "none";

    } else { //Accedo si se encontró un usuario con el find()
        let pass = userExist.passwordLogIn;

        if (pass != password) {
            divInvalid.innerHTML = `
            <p>
            Invalid username or password. Try Again!
            </p>`;
        } else {

            player = userExist;
            displayGame();
        }
    }
}


//__________________________________________________________________________________________________________________________________________//
// Ingreso de datos para la seleccion de la serpiente a utilizar, y botones de usabilidad.

//Para cada boton de los seleccionados con querySelectorAll le damos la opción de ocultar las opciones iniciales y mostrar el div de selección.
for (const btn of selectSnakeBtn) {
    btn.addEventListener("click", () => {

        clearInterval(gameInterval);
        gameConteiner.style.display = 'none';

        selectSnakeConteiner.style.display = 'flex';
        selectSnakeConteiner.innerHTML = `

        `;



    })
};

//Boton para iniciar la partida cuando se selecciona una snake
playWithSelectedBtn.addEventListener("click", ()=>{
    displayGame();
});

//El siguiente bloque muestra y oculta el "Global Score".
let btnScoreClicked = false;
scoreBtn.addEventListener("click", () => {
    switch (btnScoreClicked) {
        case false:
            divScoreTable.style.display = "flex";
            btnScoreClicked = true;
            break;

        case true:
            divScoreTable.style.display = "none";
            btnScoreClicked = false;
            break;
    }
});


//Hasta acá el código corresponde a la identificación del usuario y el ingreso de su 'Snake'
//__________________________________________________________________________________________________________________________________________//
// Configuración del juego y sus funcionalidades.

function startGame() {
    food.x = Math.round(Math.random() * 47 + 1) * (10);
    food.y = Math.round(Math.random() * 47 + 1) * (10);

    snakeChoice = player.snakeColecction[Math.round(Math.random() * (snakeColecction.length - 1))];

    clearCanva();
    if (bodySnake.length > 0) {
        let maxCells = bodySnake.length;
        for (let i = 0; i < maxCells; i++) {
            bodySnake.pop();
        }
    }

    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, snakeChoice.speed);

    bodySnake.unshift(new SnakeCell((snakeChoice.lenghtSnake * 10), 10, movement.RIGHT));
    for (let i = 1; i < snakeChoice.lenghtSnake; i++) {
        bodySnake.push(new SnakeCell((snakeChoice.lenghtSnake - i) * 10, 10, movement.RIGHT));
    }

    console.log(snakeChoice); //Ayuda a visualizar la serpiente escogida (me sirve para cuando es Aleatoria)

}

//__________________________________________________________________________________________________________________________________________//

//Uso del canvas para tomar datos y dibujar los elementos necesarios.

let canvas = document.getElementById("mainScreenPlay");
let ctx = canvas.getContext("2d");

const drawBorder = () => {
    ctx.strokeStyle = "#6A6A6C";
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(490, 10);
    ctx.lineTo(490, 490);
    ctx.lineTo(10, 490);
    ctx.lineTo(10, 10);
    ctx.stroke();
    ctx.closePath();
}

let clearCanva = () => {
    ctx.clearRect(0, 0, 500, 500);
    drawBorder();
}

const drawInstructions = () => {

    ctx.font = "26px Righteous";
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.fillText(`Hello ${player.usernameLogIn}!!`, 250, 80);
    ctx.fillText(`Welcome to Snake Game...`, 250, 120);
    ctx.fillText(`Use arrow's key to move the Snake`, 250, 230);
    ctx.fillText(`Press 'Enter' to Start...`, 250, 270);
    ctx.fillText(`Sing In or Registrate for get Full Acces`, 250, 435);
    ctx.fillText(`to Marketplace and Diferents Snakes`, 250, 470);

    drawBorder();
}
drawInstructions();

const drawBox = (xi, yi, color, secondaryColor) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(xi, yi);
    ctx.lineTo((xi + 10), yi);
    ctx.lineTo((xi + 10), (yi + 10));
    ctx.lineTo(xi, (yi + 10));
    ctx.fill();

    ctx.strokeStyle = secondaryColor;
    ctx.beginPath();
    ctx.moveTo((xi - 1), (yi - 1));
    ctx.lineTo(((xi - 1) + 10), (yi - 1));
    ctx.lineTo(((xi - 1) + 10), ((yi - 1) + 10));
    ctx.lineTo((xi - 1), ((yi - 1) + 10));
    ctx.lineTo((xi - 1), (yi - 1));
    ctx.stroke();
    ctx.closePath();
}

const drawFood = () => {
    drawBox(food.x, food.y, "#BC170C", "#EF8E69");

    let empySlot = true;
    for (i = 0; i < bodySnake.length; i++) {
        if (food.x == bodySnake[i].posX && food.y == bodySnake[i].posY) {
            food.x = Math.round(Math.random() * 47 + 1) * (10);
            food.y = Math.round(Math.random() * 47 + 1) * (10);
            empySlot = false;
            break;
        }
    }
    (empySlot == true) ? drawBox(food.x, food.y, "#BC170C", "#EF8E69"): drawFood();
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
    } else if (e.code === "Enter") {
        if (gameConteiner.style.display != "none") {

            startGame();
        }
    } else return;
}
document.addEventListener("keydown", movementKey);

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

const saveMaxScore = () => {
    if (score.value > player.maxScore) {

    }
}

const ajustScore = () => {
    let result = (bodySnake.length - snakeChoice.lenghtSnake);

    let h3 = document.querySelector(".score h3")
    h3.remove();

    let newScore = document.createElement("h3");
    newScore.innerHTML = `Score: ${result}`;
    score.appendChild(newScore);
}

const endGame = () => {
    clearCanva();
    ctx.fillStyle = "#000";
    ctx.textAlign = "center";
    ctx.font = "30px Righteous";
    ctx.fillText("Game over!!", 250, 68);
    ctx.fillText(`Thanks for play ${player.usernameLogIn}`, 250, 110);
    ctx.fillText(`Score: ${bodySnake.length - snakeChoice.lenghtSnake}`, 250, 150);

    ctx.fillText(`Press 'Enter' to Re-Play...`, 250, 430);
    ctx.fillText(`Press 'Esc' to submit Score...`, 250, 470);


    clearInterval(gameInterval);

    score.innerHTML = `<h3>Score: 0</h3>`

    //Agregar puntaje a la tabla de las mejores posiciones!
    if (snakeChoice.owner) {

    }
}

const checkPosition = () => {
    //Verificamos que la cabeza de la serpiente no se encuentre en superposición con el resto del cuerpo
    for (j = 1; j < bodySnake.length; j++) {
        (bodySnake[0].posX == bodySnake[j].posX && bodySnake[0].posY == bodySnake[j].posY) && endGame(); // Estructura if AND
    }

    //Verificamos que la cabeza de la serpiente no se encuentre fuera del margen del juego delimitado por esas posiciones
    (bodySnake[0].posX < 10 || bodySnake[0].posX + 10 > 490 || bodySnake[0].posY < 10 || bodySnake[0].posY + 10 > 490) && endGame(); // Estructura if AND

    //Verificamos si la cabeza de la serpiente coincide con la posicion de la comida; en caso de que coincidan aumentamos la longitud de la serpiente, y redefinimos una nueva posicion para la serpiente
    if (bodySnake[0].posX == food.x && bodySnake[0].posY == food.y) {

        bodySnake.push(new SnakeCell(500, 500, movement.DOWN));
        food.x = Math.round(Math.random() * 47 + 1) * (10);
        food.y = Math.round(Math.random() * 47 + 1) * (10);
        drawFood();
        ajustScore();
    }
}

//__________________________________________________________________________________________________________________________________________//

//Loop del juego para que se repita dependiendo de la frecuencia condicionada por al serpiente elegida.

function gameLoop() {
    clearCanva();
    drawFood();
    ajustPosition();
    drawSnake();
    checkPosition();
}

//__________________________________________________________________________________________________________________________________________//

//Créditos:

//FunFunFunction: https://www.youtube.com/watch?v=jRstJFiWnDQ

//Appdelante: Daniel Macario: https://www.youtube.com/watch?v=GbPAYZ7tXUY

//Juego de AppDelante: https://culebrita-appdelante.vercel.app/juego.html

//__________________________________________________________________________________________________________________________________________//