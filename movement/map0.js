const pi = Math.PI;

const map0 = {
  type: "line",
  dVector: [0, 310],
  length: 310
};

const map1 = {
  type: "circle",
  center: [140, 310],
  radius: 40,
  shift: 0.5,
  direction: 1,
  factor: 4,
  length: 20 * pi
};

const map2 = {
  type: "line",
  dVector: [210, 0],
  length: 210
};

const map3 = {
  type: "circle",
  center: [350, 325],
  radius: 25,
  shift: 0.25,
  direction: -1,
  factor: 4,
  length: 12.5 * pi
};

const map4 = {
  type: "line",
  dVector: [0, -195],
  length: 195
};

const map5 = {
  type: "circle",
  center: [425, 130],
  radius: 50,
  shift: 0.5,
  direction: 1,
  factor: 3,
  length: 100 / 3 * pi
};

const map6 = {
  type: "line",
  dVector: [195, 88.7],
  length: 214.2
};

const map7 = {
  type: "circle",
  center: [625, 210],
  radius: 40,
  shift: 1 / 6,
  direction: 1,
  factor: 6,
  length: 40 / 3 * pi
};

const map8 = {
  type: "line",
  dVector: [0, 240],
  length: 240
};

const map9 = {
  type: "circle",
  center: [635, 450],
  radius: 30,
  shift: 0,
  direction: 1,
  factor: 4,
  length: 15 * pi
};

const map10 = {
  type: "line",
  dVector: [-385, 0],
  length: 385
};

const map11 = {
  type: "circle",
  center: [250, 530],
  radius: 50,
  shift: 0.75,
  direction: -1,
  factor: 4,
  length: 25 * pi
};

const map12 = {
  type: "line",
  dVector: [0, 70],
  length: 70
};

export const map = [map0, map1, map2, map3, map4, map5, map6, map7, map8, map9, map10, map11, map12];
