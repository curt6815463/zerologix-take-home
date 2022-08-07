class Candlesticks {
  constructor(options) {
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.timeSeries = options.data;
    this.properties = Object.values(this.timeSeries)
      .map((timeSerie) => {
        delete timeSerie.volume;
        return timeSerie;
      })
      .reverse();
  }

  arrayOfAllPrices(array) {
    return this.properties.reduce((result, property) => {
      return [...result, ...Object.values(property)];
    }, []);
  }

  draw() {
    console.log(this.arrayOfAllPrices(this.properties));
    this.ctx.save();
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, 400, 10);
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
