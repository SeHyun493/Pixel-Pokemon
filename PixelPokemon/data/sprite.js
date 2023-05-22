const sprite = {
  Wisp: {
    position: {
      x: 100,
      y: 400,
    },
    image: {
      src: "./images/Ghost.png",
    },
    frames: {
      max: 5,
      hold: 30,
    },
    animate: true,
    name: "Wisp",
    attacks: [attacks.Tackle, attacks.Lick],
  },

  Ribbit: {
    position: {
      x: 800,
      y: 400,
    },
    image: {
      src: "./images/Frog.png",
    },
    frames: {
      max: 5,
      hold: 30,
    },
    animate: true,
    isEnemy: true,
    name: "Ribbit",
    attacks: [attacks.Tackle, attacks.Lick],
  },
};
