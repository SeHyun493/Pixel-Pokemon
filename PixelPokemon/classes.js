//constructor for player and monster sprite sheet
class Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
  }) {
    //creates sprite with specific position, animation, and frame.
    this.position = position;
    this.image = new Image();
    this.frames = { ...frames, val: 0, elapsed: 0 };
    this.image.onload = () => {
      (this.width = this.image.width / this.frames.max),
        (this.height = this.image.height);
    };
    this.image.src = image.src;
    console.log(image);

    this.animate = animate;
    this.sprites = sprites;
    this.opacity = 1;
  }

  //draws the sprite on the canvas
  draw() {
    context.save();
    context.globalAlpha = this.opacity;
    context.drawImage(
      this.image,
      this.frames.val * this.width,
      0,
      this.image.width / this.frames.max,
      this.image.height,
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
    context.restore();

    //animates the sprite if true
    if (!this.animate) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }
    //causes the next frame to be animated
    if (this.frames.elapsed % this.frames.hold === 0) {
      if (this.frames.val < this.frames.max - 1) this.frames.val++;
      else this.frames.val = 0;
    }
  }
}

//constructor for monster sprite sheet
class Monster extends Sprite {
  constructor({
    position,
    image,
    frames = { max: 1, hold: 10 },
    sprites,
    animate = false,
    isEnemy = false,
    name,
    attacks,
  }) {
    super({
      position,
      image,
      frames,
      sprites,
      animate,
    });
    this.health = 100;
    this.isEnemy = isEnemy;
    this.name = name;
    this.attacks = attacks;
  }
  //when hp is at 0, dialogue pops up and sprite disappears
  dead() {
    document.querySelector("#dialogue").innerHTML = this.name + " fainted! :( ";
    gsap.to(this.position, {
      y: this.position.y + 20,
    });
    gsap.to(this, {
      opacity: 0,
    });
  }
  //Giving animation for when they attack
  attack({ attack, enemy }) {
    //shows dialogue box
    document.querySelector("#dialogue").style.display = "block";
    document.querySelector("#dialogue").innerHTML =
      this.name + " used " + attack.name;

    let healthBar = "#enemyHP";
    if (this.isEnemy) healthBar = "#playerHP";

    enemy.health -= attack.damage;

    switch (attack.name) {
      case "Lick":
        //gsap is an animation library
        const tl = gsap.timeline();

        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            //Once the attack finishes, animates enemy animations
            onComplete: () => {
              gsap.to(healthBar, {
                width: enemy.health + "%",
              });
              gsap.to(enemy.position, {
                x: enemy.position.x + 10,
                yoyo: true,
                repeat: 1,
                duration: 0.08,
              });
              gsap.to(enemy, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;
    }
    switch (attack.name) {
      case "Tackle":
        //gsap is an animation library
        const tl = gsap.timeline();

        let movementDistance = 20;
        if (this.isEnemy) movementDistance = -20;

        tl.to(this.position, {
          x: this.position.x - movementDistance,
        })
          .to(this.position, {
            x: this.position.x + movementDistance * 2,
            duration: 0.1,
            //Once the attack finishes, animates enemy animations
            onComplete: () => {
              gsap.to(healthBar, {
                width: enemy.health - attack.damage + "%",
              });
              gsap.to(enemy.position, {
                x: enemy.position.x + 15,
                yoyo: true,
                repeat: 1,
                duration: 0.08,
              });
              gsap.to(enemy, {
                opacity: 0,
                repeat: 5,
                yoyo: true,
                duration: 0.08,
              });
            },
          })
          .to(this.position, {
            x: this.position.x,
          });
        break;
    }
  }
}

//Collision boundaries
class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48;
    this.height = 48;
  }

  draw() {
    //gets rid of the collision red boxes using alpha in rgba
    context.fillStyle = "rgba(255, 0, 0 ,0";
    context.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
