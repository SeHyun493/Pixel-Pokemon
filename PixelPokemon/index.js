const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

//how big the screen is
canvas.width = 1024;
canvas.height = 576;

//loop through the collision array, 70 is the width of the map
const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}

//loop through the battle data array, 70 is the width of the map
const battleMap = [];
for (let i = 0; i < battle.length; i += 70) {
  battleMap.push(battle.slice(i, 70 + i));
}

//fixing the boundaries on the map
const boundaries = [];
const offset = {
  x: -2165,
  y: -250,
};

//if there is a 1268 in the array, boundary is set and unable to walk through the map
collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1268)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const battleZones = [];
//checks for battle zones in the map
battleMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1268)
      battleZones.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

//load the map
const map = new Image();
map.src = "./images/Map.png";

//loads the character animation sheet
const playerDown = new Image();
playerDown.src = "./images/playerDown.png";

const playerUp = new Image();
playerUp.src = "./images/playerUp.png";

const playerLeft = new Image();
playerLeft.src = "./images/playerLeft.png";

const playerRight = new Image();
playerRight.src = "./images/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - playerDown.width / 20,
    y: canvas.height / 1.5 - playerDown.height / 20,
  },
  image: playerDown,
  frames: {
    max: 4,
    hold: 10,
  },
  sprites: {
    down: playerDown,
    up: playerUp,
    left: playerLeft,
    right: playerRight,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: map,
});

//allows keys to be functional when pressed
const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const movingItems = [background, ...boundaries, ...battleZones];
//checks if character and collision blocks are colliding
function boxCollision({ boxOne, boxTwo }) {
  return (
    boxOne.position.x + boxOne.width >= boxTwo.position.x &&
    boxOne.position.x <= boxTwo.position.x + boxTwo.width &&
    boxOne.position.y <= boxTwo.position.y + boxTwo.height &&
    boxOne.position.y + boxOne.height >= boxTwo.position.y
  );
}

//animation
function animation() {
  //starts animation loop
  const animationId = window.requestAnimationFrame(animation);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  battleZones.forEach((battleZone) => {
    battleZone.draw();
  });
  player.draw();

  let moving = true;
  player.animate = false;

  if (battle.start) return;

  //activates a battle when value is last than 0.001
  if (keys.w.pressed || keys.a.pressed || keys.s.pressed || keys.d.pressed) {
    for (let i = 0; i < battleZones.length; i++) {
      const battleZone = battleZones[i];
      if (
        boxCollision({
          boxOne: player,
          boxTwo: battleZone,
        }) &&
        Math.random() < 0.001
      ) {
        //cancels animation loop
        window.cancelAnimationFrame(animationId);
        //turns canvas black to switch canvas
        battle.start = true;
        gsap.to("#animation", {
          opacity: 1,
          repeat: 3,
          yoyo: true,
          duration: 0.4,
          onComplete() {
            gsap.to("#animation", {
              opacity: 1,
              duration: 0.4,
              //starts animation loop for battle
              onComplete() {
                initBattle();
                animateBattle();
                gsap.to("#animation", {
                  opacity: 0,
                  duration: 0.3,
                });
              },
            });
          },
        });
        break;
      }
    }
  }

  //character animation sprite, setting collision blocks
  if (keys.w.pressed && lastKey === "w") {
    player.animate = true;
    player.image = player.sprites.up;

    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        boxCollision({
          boxOne: player,
          boxTwo: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movingItems.forEach((movingItem) => {
        movingItem.position.y += 3;
      });
  } else if (keys.a.pressed && lastKey === "a") {
    player.animate = true;
    player.image = player.sprites.left;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        boxCollision({
          boxOne: player,
          boxTwo: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movingItems.forEach((movingItem) => {
        movingItem.position.x += 3;
      });
  } else if (keys.s.pressed && lastKey === "s") {
    player.animate = true;
    player.image = player.sprites.down;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        boxCollision({
          boxOne: player,
          boxTwo: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movingItems.forEach((movingItem) => {
        movingItem.position.y -= 3;
      });
  } else if (keys.d.pressed && lastKey === "d") {
    player.animate = true;
    player.image = player.sprites.right;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        boxCollision({
          boxOne: player,
          boxTwo: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        moving = false;
        break;
      }
    }

    if (moving)
      movingItems.forEach((movingItem) => {
        movingItem.position.x -= 3;
      });
  }
}
// animation();

//see which key was pressed last
let lastKey = "";
//checks if the keys are pressed down
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = true;
      lastKey = "w";
      break;
    case "a":
      keys.a.pressed = true;
      lastKey = "a";
      break;
    case "s":
      keys.s.pressed = true;
      lastKey = "s";
      break;
    case "d":
      keys.d.pressed = true;
      lastKey = "d";
      break;
  }
});

//checks if the keys are not pressed
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
  }
});

// plays audio when left click
let clicked = false;
addEventListener("click", () => {
  if (!clicked) {
    audio.Map.loop = true;
    audio.Map.play();
    clicked = true;
  }
});
