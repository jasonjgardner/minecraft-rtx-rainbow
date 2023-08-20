class Vector {
  x: number;
  y: number;
  z: number;
  constructor(x: number, y: number, z: number) {
    this.x = Math.round(x);
    this.y = Math.round(y);
    this.z = Math.round(z);
  }
}

class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b: number, a = 1) {
    this.r = Math.max(0, Math.min(255, r));
    this.g = Math.max(0, Math.min(255, g));
    this.b = Math.max(0, Math.min(255, b));
    this.a = a;
  }
}

export { Color, Vector };
