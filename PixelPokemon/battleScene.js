//calling for battle background once animation ends
const battleBackgroundMap = new Image();
battleBackgroundMap.src = "./images/battleBackground.png";
const battleBackground = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  image: battleBackgroundMap,
});

let wisp;
let ribbit;
let renderSprite;
let queue;
let battleAnimationId;

function initBattle() {
  //brings back all the hp bars and dialogues
  document.querySelector("#user").style.display = "block";
  document.querySelector("#dialogue").style.display = "none";
  document.querySelector("#enemyHP").style.width = "100%";
  document.querySelector("#playerHP").style.width = "100%";
  //removes duplicates of attack skills
  document.querySelector("#attackbox").replaceChildren();

  wisp = new Monster(sprite.Wisp);
  ribbit = new Monster(sprite.Ribbit);
  renderSprite = [wisp, ribbit];
  queue = [];

  //shows attack skills when entering battle
  wisp.attacks.forEach((attack) => {
    const button = document.createElement("button");
    button.innerHTML = attack.name;
    document.querySelector("#attackbox").append(button);
  });

  //event listeners for attack buttons
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const chooseAttack = attacks[e.currentTarget.innerHTML];
      wisp.attack({
        attack: chooseAttack,
        enemy: ribbit,
      });

      //stops attacking at 0 hp, ends battle animation and goes back to world map
      if (ribbit.health <= 0) {
        queue.push(() => {
          ribbit.dead();
        });
        queue.push(() => {
          gsap.to("#animation", {
            opacity: 1,
            onComplete: () => {
              cancelAnimationFrame(battleAnimationId);
              animation();
              document.querySelector("#user").style.display = "none";
              gsap.to("#animation", {
                opacity: 0,
              });
              //allows character to move after battle is over
              battle.start = false;
            },
          });
        });
      }

      //randomize ribbits attack pulling from the attacks data array using Object.value
      const randomAttack =
        Object.values(attacks)[
          Math.floor(Math.random() * Object.values(attacks).length)
        ];

      queue.push(() => {
        ribbit.attack({
          attack: randomAttack,
          enemy: wisp,
        });

        //stops attacking at 0 hp, ends battle animation and goes back to world map
        if (wisp.health <= 0) {
          queue.push(() => {
            wisp.dead();
          });
          queue.push(() => {
            gsap.to("#animation", {
              opacity: 1,
              onComplete: () => {
                cancelAnimationFrame(battleAnimationId);
                animation();
                document.querySelector("#user").style.display = "none";
                gsap.to("#animation", {
                  opacity: 0,
                });
                battle.start = false;
              },
            });
          });
        }
      });
    });
  });
}
//draws out the map and sprites
function animateBattle() {
  battleAnimationId = window.requestAnimationFrame(animateBattle);
  battleBackground.draw();

  renderSprite.forEach((sprite) => {
    sprite.draw();
  });
}

animation();
// initBattle();
// animateBattle();

//hides the dialogue box after clicking
document.querySelector("#dialogue").addEventListener("click", (e) => {
  //if theres anything in the array it runs the function below
  if (queue.length > 0) {
    //ribbits turn to attack function will be pushed
    queue[0]();
    //after attacking, everything will be deleted out and will return to attack screen
    queue.shift();
  } else e.currentTarget.style.display = "none";
});
