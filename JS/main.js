//Constantes para la manipulación del DOM
//__________________________________________________________________________________________________________________________________________//

const headerElementsBtn = document.querySelectorAll(".headerElements"),

    loginDiv = document.querySelectorAll(".btn-login"),

    gameConteiner = document.querySelector(".conteiner"),

    h3Score = document.querySelector(".h3-score"),

    h3Name = document.querySelector(".h3-name"),

    h3Coins = document.querySelector(".h3-coins"),

    userDataHeader = document.querySelector(".user-data-header"),

    selectSnakeBtn = document.querySelector(".btn-selectSnake"),

    buySnakeBtn = document.querySelector(".btn-buySnake"),

    scoreBtn = document.querySelector(".btn-showScore"),

    divSnakeValues = document.querySelector(".snake-values"),

    divScoreTable = document.querySelector(".globalScore"),

    scoreTable = document.querySelector(".score-table"),

    scoreDiv = document.querySelector(".score"),

    enterGameBtn = document.querySelector(".btn-enterGame"),

    divInvalid = document.querySelector(".invalid"),

    startPlayBtn = document.querySelector(".btn-startGame"),

    checkBtn = document.querySelector(".checkbox"),

    singUpBtn = document.querySelector(".btn-singUp"),

    logOutBtn = document.querySelector(".btn-logOut"),

    sesionStartOptions = document.querySelector(".conteiner-sesionStart"),

    inputUsername = document.querySelector("#usernameInput"),

    inputPassword = document.querySelector("#passwordInput"),

    btnHome = document.querySelectorAll(".btn-home"),

    selectSnakeConteiner = document.querySelector(".selectSnake-conteiner"),

    selectCardsConteiner = document.querySelector(".select-cards-conteiner"),

    playWithSelectedBtn = document.querySelector(".btn-playWithSelected"),

    buySnakeConteiner = document.querySelector(".buySnake-conteiner"),

    buyCardsConteiner = document.querySelector(".buy-cards-conteiner"),

    buySelectedBtn = document.querySelector(".btn-buySelected");

let snakeChoice;
let gameInterval;
let score = 0;

const bodySnake = [],

    snakeColecction = [];

class Player {
    constructor(usernameLogIn, passwordLogIn, cardRegistered, snakeColecction, maxScore, money) {
        this.usernameLogIn = usernameLogIn;
        this.passwordLogIn = passwordLogIn;
        this.cardRegistered = cardRegistered;
        this.snakeColecction = snakeColecction;
        this.maxScore = maxScore;
        this.money = money;
    }
};
class Snake {
    constructor(id, name, color, speed, startLenghtSnake, owner, secondaryColor, url) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.speed = speed;
        this.startLenghtSnake = startLenghtSnake;
        this.owner = owner;
        this.secondaryColor = secondaryColor;
        this.url = url;
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
//                                          Carga de Datos del snakesDB.json
//__________________________________________________________________________________________________________________________________________//

const getDB = async () => {
    const resp = await fetch('./snakesDB.json');

    const data = await resp.json();

    data.forEach(element => {
        snakeColecction.push(element)
    })
};
getDB();
//__________________________________________________________________________________________________________________________________________//

//                                       Inicio de Sesión y Registro del Usuario
//__________________________________________________________________________________________________________________________________________//
let player = new Player(`Player #${Math.round(Math.random()*100 + 1)}`, undefined, null, snakeColecction, 0, 0);

snakeChoice = player.snakeColecction[Math.round(Math.random() * (snakeColecction.length - 1))];

const saveNewData = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

const saveDB = () => {
    //Elimino la base de datos antigua y la sobre escribo con la actualizada.
    localStorage.removeItem("usersDataBase");
    saveNewData("usersDataBase", usersDataBase);
}

let usersDataBase = JSON.parse(localStorage.getItem("usersDataBase")) || [];
let userSingIn = JSON.parse(sessionStorage.getItem("userSingIn")) || [];

const displayGame = () => {
    sesionStartOptions.style.display = "none";
    enterGameBtn.style.display = "none";
    selectSnakeConteiner.style.display = "none";
    buySnakeConteiner.style.display = "none";

    logOutBtn.style.display = "flex";
    gameConteiner.style.display = "flex";

    headerElementsBtn.forEach(element => {
        //Cada elemento del Header oculto se muestra con display "inline-block"
        element.style.display = "inline-block";
    });
    scoreBtn.style.display = "flex";

    (usersDataBase.some(user => user.usernameLogIn == player.usernameLogIn)) && playerData();

    clearInterval(gameInterval);
    clearCanva();
    drawInstructions();
}

enterGameBtn.addEventListener("click", () => {

    clearInterval(gameInterval);

    sesionStartOptions.style.display = "flex";

    inputUsername.focus();

    gameConteiner.style.display = "none";

    if (checkBtn.checked && userSingIn[0] !== []) {
        inputUsername.value = userSingIn[0].usernameLogIn;
        inputPassword.value = userSingIn[0].passwordLogIn;
    }

    enterGameBtn.style.display = 'none';
    logOutBtn.style.display = 'flex';
});

startPlayBtn.addEventListener("click", () => {
    InputVerification(inputUsername.value.toLowerCase(), inputPassword.value);
});

const InputVerification = (user, password) => {
    divInvalid.innerHTML = ``; //Limpiamos el campo de ingresos inválidos.

    const checkedBtn = () => {
        if (checkBtn.checked) {
            //Guardamos los datos del usuario dentro del Objeto userSingIn y luego en el SesionStorage, para volver a ingresar en el momento.
            userSingIn.pop();
            userSingIn.push(player);
            sessionStorage.clear();
            sessionStorage.setItem("userSingIn", JSON.stringify(userSingIn));
        }
    }

    if (user == "" || password == "") {

        divInvalid.innerHTML = `<p>You must enter a valid name and password.</p>`;

    } else if (startPlayBtn.value === 'Start Play') {

        let userExist = usersDataBase.find(element => element.usernameLogIn === user); //Busco un usuario que coincida con la base de datos, si existe, ejecuto lo siguiente:

        if (userExist !== undefined) { //Accedo si se encontró un usuario con el find()
            let pass = userExist.passwordLogIn;

            if (pass != password) {
                divInvalid.innerHTML = `
            <p>
            Invalid username or password. Try Again!
            </p>`;
            } else {
                player = userExist;
                snakeChoice = player.snakeColecction[0];

                checkedBtn();
                displayGame();
            }
        } else {
            divInvalid.innerHTML = `
                <p>That user dosen't exist.</p>
                <p>Try to Sing Up first!</p>`;
            startPlayBtn.value = 'Sing Up';

        }
    } else { //Accedo cuando el usuario debe REGISTRARSE POR PRIMERA VEZ.

        player = new Player(user, password, null, [snakeColecction[0]], 0, 0);
        snakeChoice = player.snakeColecction[0];

        //Guardamos los datos del usuario dentro del Array de usuarios válidos para ingresar del LocalStorage.
        usersDataBase.push(player);
        saveDB();

        checkedBtn();
        displayGame();
    }
}

logOutBtn.addEventListener("click", () => {
    saveDB();
    displayGame();

    headerElementsBtn.forEach(element => {
        //Cada elemento del Header oculto se muestra con display "inline-block"
        element.style.display = "none";
    });
    scoreBtn.style.display = "flex";
    logOutBtn.style.display = "none";
    enterGameBtn.style.display = "flex";
    userDataHeader.style.display = 'none';



    player = new Player(`Player #${Math.round(Math.random()*100 + 1)}`, undefined, null, snakeColecction, null, 0);

    inputUsername.value = "";
    inputPassword.value = "";
    startPlayBtn.value = 'Start Play';

    clearCanva();
    drawInstructions();
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
//__________________________________________________________________________________________________________________________________________//
//                           Seleccion de la serpiente a utilizar!
//__________________________________________________________________________________________________________________________________________//

btnHome.forEach(element => {
    element.addEventListener("click", () => {
        displayGame();
    })
})
//Boton para iniciar la partida cuando se selecciona una snake.
playWithSelectedBtn.addEventListener("click", () => {
    const cards = [...document.querySelectorAll(".card")];

    for (let crd of cards) {

        if (crd.classList.contains("card-clicked")) {
            snakeChoice = snakeColecction[crd.id];
            break;
        } else {
            snakeChoice = player.snakeColecction[0];
        }
    };

    displayGame();
});

//Para cada boton de los seleccionados con querySelectorAll le damos la opción de ocultar las opciones iniciales y mostrar el div de selección.
selectSnakeBtn.addEventListener("click", () => {

    clearInterval(gameInterval);
    gameConteiner.style.display = 'none';
    buySnakeConteiner.style.display = 'none';

    selectSnakeConteiner.style.display = 'flex';

    selectCardsConteiner.innerHTML = '';

    player.snakeColecction.forEach(element => {

        let {
            name,
            speed,
            startLenghtSnake,
            url,
            id
        } = element;

        selectCardsConteiner.innerHTML += `
        <div class="card" id="${id-1}">
            <div class="img-value">
            
            </div>            
        
            <div class="card-header">
                <div class="card-title">
                    <h2>${name}</h2>
                </div>
                <div class="snake-img">
                    <img src=${url} alt="${name}">
                </div>
            </div>
        
            <div class="atributes">
                <div class="rows speed">
                    <div class="card-title atributes-title">
                        <h3>Speed: ${Math.round((160 - speed)/5.5)} km/h</h3>
                    </div>
                </div>
                <div class="rows lenght">
                    <div class="card-title atributes-title">
                        <h3>Lenght: ${startLenghtSnake}</h3>
                    </div>
                </div>
            </div>
        </div>`
    });

    const cards = document.querySelectorAll(".card");

    cards.forEach(crd => {
        crd.addEventListener("click", () => {
            cards.forEach(c => {
                c.classList.remove("card-clicked");
            });
            crd.classList.add("card-clicked");
        })
    })
});

//__________________________________________________________________________________________________________________________________________//
//                                Compra de una nueva serpiente!
//__________________________________________________________________________________________________________________________________________//

//Boton para comprar la serpiente seleccionada y añadirla a la colección.
buySelectedBtn.addEventListener("click", () => {
    const target = document.getElementsByClassName("card-clicked");

    if (snakeColecction[target[0].id - 1].price <= player.money) {

        swal({
                title: "Are you sure??",
                text: `You are about to spend ${snakeColecction[target[0].id - 1].price} Coins in ${snakeColecction[target[0].id - 1].name}`,
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
            .then((willDelete) => {
                if (willDelete) {
                    //si la promesa se resuelve con true, le descuento de su cantidad de monedas el valor de la serpiente.
                    player.money -= snakeColecction[target[0].id - 1].price;
                    saveDB();

                    //error
                    (!player.snakeColecction.some(element => element.id == target[0].id)) && player.snakeColecction.push(snakeColecction[target[0].id - 1]);

                    swal(`Excelent!! Check your's Snakes for look up your new Snake`, {
                        icon: "success"
                    });

                    displayGame();
                } else {
                    swal("Operation canceled!!");
                }
            });



    } else {
        swal({
            title: 'Insuficient money',
            text: `Try to play again and earn more money
            It's easy: 1 point = 1 coin`,
            icon: 'warning',
        });
    }
})

//Marketplace
buySnakeBtn.addEventListener("click", () => {
    clearInterval(gameInterval);
    gameConteiner.style.display = 'none';
    selectSnakeConteiner.style.display = 'none';

    buySnakeConteiner.style.display = 'flex';

    buyCardsConteiner.innerHTML = '';

    snakeColecction.forEach(element => {

        let {
            name,
            speed,
            startLenghtSnake,
            url,
            id,
            price
        } = element;

        if (!player.snakeColecction.some(snake => snake.id == element.id)) {
            buyCardsConteiner.innerHTML += `
            <div class="card" id="${id}">
                <div class="img-value">
                
                </div>            
            
                <div class="card-header">
                    <div class="card-title">
                        <span class="material-symbols-outlined">paid</span>
                        <h3>${price} - ${name}</h3>
                    </div>
                    <div class="snake-img">
                        <img src=${url} alt="${name}">
                    </div>
                </div>
            
                <div class="atributes">
                    <div class="rows speed">
                        <div class="card-title atributes-title">
                            <h3>Speed: ${Math.round((160 - speed)/5.5)} km/h</h3>
                        </div>
                    </div>
                    <div class="rows lenght">
                        <div class="card-title atributes-title">
                            <h3>Lenght: ${startLenghtSnake}</h3>
                        </div>
                    </div>
                </div>
            </div>`
        }
    });

    const cards = document.querySelectorAll(".card");

    cards.forEach(crd => {
        crd.addEventListener("click", () => {
            cards.forEach(c => {
                c.classList.remove("card-clicked");
            });

            crd.classList.add("card-clicked");
        })
    })
});

//Hasta acá el código corresponde a la identificación del usuario y el ingreso de su 'Snake'
//__________________________________________________________________________________________________________________________________________//
// Configuración del juego y sus funcionalidades.

function startGame(playername) {
    score = 0;

    food.x = Math.round(Math.random() * 47 + 1) * (10);
    food.y = Math.round(Math.random() * 47 + 1) * (10);

    //En caso de que no sea un usuario registrado se selecciona una serpiente aleatoria dentro de las serpientes de la base de datos; y sino se selecciona la serpiente por Default.
    (!usersDataBase.some(element => element.usernameLogIn == playername)) && (snakeChoice = player.snakeColecction[Math.round(Math.random() * (player.snakeColecction.length - 1))]);

    clearCanva();
    if (bodySnake.length > 0) {
        let maxCells = bodySnake.length;
        for (let i = 0; i < maxCells; i++) {
            bodySnake.pop();
        }
    }

    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, snakeChoice.speed);

    bodySnake.unshift(new SnakeCell((snakeChoice.startLenghtSnake * 10), 10, movement.RIGHT));
    for (let i = 1; i < snakeChoice.startLenghtSnake; i++) {
        bodySnake.push(new SnakeCell((snakeChoice.startLenghtSnake - i) * 10, 10, movement.RIGHT));
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
    ctx.fillText(`Welcome to Snake Game...`, 250, 80);
    ctx.fillText(`Let's Start it! ${player.usernameLogIn}!!`, 250, 120);
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
            startGame(player.usernameLogIn);
        }
    } else if (e.code === "Escape") {
        (usersDataBase.some(element => element.usernameLogIn === player.usernameLogIn && element.passwordLogIn === player.passwordLogIn)) ? pushMaxScore(): swal({
            title: "Enter Game First",
            text: "You have to have an account for that!!",
            icon: "warning",
            timer: 2000,
            button: false
        });
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

//Condiciones de finalización, puntaje y continuidad del juego.

const saveMaxScore = () => {
    if (score > player.maxScore) {
        //Guardo el nuevo máximo score obtenido en el objeto player actual.
        player.maxScore = score;

        if (usersDataBase.some(element => element.usernameLogIn === player.usernameLogIn && element.passwordLogIn === player.passwordLogIn)) {
            //Guardo el nuevo máximo score obtenido en la base de datos.
            usersDataBase.find(element => element.usernameLogIn === player.usernameLogIn).maxScore = score;

            //Acomodo la base de datos según los scores máximos.
            usersDataBase.sort((a, b) => ((a.maxScore - b.maxScore) > 0) ? -1 : ((a.maxScore - b.maxScore) < 0) ? 1 : 0);

            saveDB();

        };
    }
}

const pushMaxScore = () => {
    scoreTable.innerHTML = `
        <tr>
            <th>N°</th>
            <th>Player</th>
            <th>Score</th>
        </tr>
        <tr>
            <td class="position">1--</td>
            <td class="playerName">Player One</td>
            <td class="number">9.999.999</td>
        </tr>`;

    let positionCount = 1;

    usersDataBase.forEach(element => {

        scoreTable.innerHTML += `
            <tr>
                <td class="position">${++positionCount}--</td>
                <td class="playerName">${element.usernameLogIn}</td>
                <td class="number">${element.maxScore}</td>
            </tr>`;
    })
};
pushMaxScore();

const ajustData = () => {
    score++;
    h3Score.innerHTML = `Score: ${score}`;
};

const ajustMoney = () => {
    (usersDataBase.some(element => element.usernameLogIn === player.usernameLogIn && element.passwordLogIn === player.passwordLogIn)) && (player.money++, h3Coins.innerHTML = `<h3>Coins: ${player.money}</h3> <span class="material-symbols-outlined">paid</span>`);

}
const playerData = () => {
    userDataHeader.style.display = 'flex';

    h3Name.innerHTML = `<span class="material-symbols-outlined">person</span> <h3>${player.usernameLogIn}</h3>`;

    h3Coins.innerHTML = `<h3>Coins: ${player.money}</h3> <span class="material-symbols-outlined">paid</span>`;
}

const endGame = () => {
    saveMaxScore();

    swal({
        title: `Game Over!!`,
        text: `You Rock It!! ${player.usernameLogIn}.

                Score: ${score}.

                Max Score: ${player.maxScore}.

                Press 'Esc' to send your Score to the Global's Scores.

                Press 'Enter' to play again. Good Luck!`,
        icon: "error",
        timer: 3500,
        button: false,
    });
    clearCanva();
    drawInstructions();
    clearInterval(gameInterval);

    h3Score.innerHTML = `Score: 0`
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
        ajustData();
        ajustMoney();
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