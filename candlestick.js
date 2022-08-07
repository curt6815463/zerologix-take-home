class Candlesticks {
  constructor(options) {
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.data = options.data;
  }

  // arrayOfAllPrices() {

  // }

  draw() {
    this.ctx.save();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(1, 1, 400, 10);
    this.ctx.restore();
  }
}

const canvas = document.getElementById("stockChart");
canvas.width = 700;
canvas.height = 350;

let myCandlesticks = new Candlesticks({
  canvas,
  data,
});

myCandlesticks.draw();
