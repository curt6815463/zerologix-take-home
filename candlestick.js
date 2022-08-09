class Candlesticks {
  constructor(options) {
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.timeSeries = options.data;
    this.properties = Object.values(this.timeSeries).map((timeSerie) => {
      delete timeSerie.volume;
      return timeSerie;
    });
    this.heightPadding = options.heightPadding;
    this.candleWidth = 16;
    this.candleXGap = 7;
    this.candleMaxWidth = 20;
    this.candleXMaxGap = 8;
    this.candleMinWidth = 2;
    this.candleXMinGap = 0;
    this.totalAxisInterval = options.totalAxisInterval;

    this.startDrawPosition = this.canvas.width * 0.8;
    this.candleCountsInChart = Math.floor(
      this.startDrawPosition / (this.candleWidth + this.candleXGap)
    );

    this.YAxisDrawer = new YAxisDrawer({
      ctx: this.canvas.getContext("2d"),
      canvas: this.canvas,
      heightPadding: options.heightPadding,
    });
    this.CandleDrawer = new CandleDrawer({
      ctx: this.canvas.getContext("2d"),
      canvas: options.canvas,
      heightPadding: options.heightPadding,
      bullColor: options.bullColor,
      bearColor: options.bearColor,
      startDrawPosition: this.startDrawPosition,
    });
  }

  zoom(delta) {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    const isZoomIn = delta > 0;

    const bounceRatio =
      (this.candleMaxWidth - this.candleMinWidth) /
      (this.candleXMaxGap - this.candleXMinGap);
    const candleXGapDiff = isZoomIn ? 0.1 : -0.1;
    const candleWidthDiff = isZoomIn ? 0.1 * bounceRatio : -0.1 * bounceRatio;
    this.candleWidth = Math.max(
      Math.min(this.candleMaxWidth, this.candleWidth + candleWidthDiff),
      this.candleMinWidth
    );
    this.candleXGap = Math.max(
      Math.min(this.candleXMaxGap, this.candleXGap + candleXGapDiff),
      this.candleXMinGap
    );
    this.candleCountsInChart = Math.floor(
      this.startDrawPosition / (this.candleWidth + this.candleXGap)
    );
    this.draw();
  }

  arrayOfAllPrices(inChartProperties) {
    return inChartProperties.reduce((result, property) => {
      return [...result, ...Object.values(property)];
    }, []);
  }

  getInChartProperties(candleCountsInChart) {
    return this.properties.filter((value, index) => {
      return index <= candleCountsInChart;
    });
  }

  draw() {
    const inChartProperties = this.getInChartProperties(
      this.candleCountsInChart
    );
    const allPrices = this.arrayOfAllPrices(inChartProperties);

    const max = Math.max(...allPrices);
    const min = Math.min(...allPrices);

    const scale = (max - min) / (this.totalAxisInterval - 1);
    const gridMax = max + scale / 2;
    const gridMin = gridMax - scale * this.totalAxisInterval;
    const canvasActualHeight = this.canvas.height - this.heightPadding * 2;

    const drawInfo = {
      scale,
      gridMax,
      gridMin,
      totalAxisInterval: this.totalAxisInterval,
      canvasActualHeight,
      properties: this.properties,
      candleWidth: this.candleWidth,
      candleXGap: this.candleXGap,
    };
    this.YAxisDrawer.draw(drawInfo);
    this.CandleDrawer.draw(drawInfo);
  }
}

const canvas = document.getElementById("stockChart");
canvas.width = 1000;
canvas.height = 550;

let myCandlesticks = new Candlesticks({
  canvas,
  data,
  heightPadding: 50,
  totalAxisInterval: 4,
  bullColor: "red",
  bearColor: "green",
});

myCandlesticks.draw();

window.addEventListener("wheel", (event) => {
  myCandlesticks.zoom(event.deltaY);
});
