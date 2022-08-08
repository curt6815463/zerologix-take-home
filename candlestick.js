class Candlesticks {
  constructor(options) {
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.timeSeries = options.data;
    this.properties = Object.values(this.timeSeries).map((timeSerie) => {
      delete timeSerie.volume;
      return timeSerie;
    });
    this.renderedProperties = this.properties;

    this.heightPadding = options.heightPadding;
    this.startDrawPosition = this.canvas.width * 0.8;
    this.candleWidth = 16;
    this.candleXGap = 7;
    this.candleMaxWidth = 20;
    this.candleXMaxGap = 8;
    this.candleMinWidth = 2;
    this.candleXMinGap = 0;
    this.totalAxisInterval = 4;

    this.candleCountsInChart = Math.floor(
      this.startDrawPosition / (this.candleWidth + this.candleXGap)
    );
    this.bullColor = "red";
    this.bearColor = "green";
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

  drawLine({ startX, startY, endX, endY, color }) {
    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(startX, startY);
    this.ctx.lineTo(endX, endY);
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawText({ text, x, y }) {
    this.ctx.save();
    this.ctx.fillStyle = "grey";
    this.ctx.font = "bold 10px Arial";
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  arrayOfAllPrices(renderedProperties) {
    return renderedProperties.reduce((result, property) => {
      return [...result, ...Object.values(property)];
    }, []);
  }

  drawGrid({ totalAxisInterval, canvasActualHeight, gridMax, scale }) {
    let currentAxisInterval = 0;
    while (currentAxisInterval <= totalAxisInterval) {
      const gridYPosition =
        canvasActualHeight * (currentAxisInterval / totalAxisInterval) +
        this.heightPadding;
      this.drawLine({
        startX: 0,
        startY: gridYPosition,
        endX: this.canvas.width,
        endY: gridYPosition,
        color: "#DBDBDB",
      });
      const gridValue = gridMax - currentAxisInterval * scale;
      const text = `${gridValue.toFixed(2)}`;
      this.drawText({
        text,
        x: 0,
        y: gridYPosition + 2,
      });
      currentAxisInterval++;
    }
  }

  drawRect({ leftTopX, leftTopY, width, height, color }) {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(leftTopX, leftTopY, width, height);
    this.ctx.restore();
  }

  getCandleColor({ openPrice, closePrice }) {
    if (openPrice > closePrice) {
      return this.bearColor;
    } else if (openPrice < closePrice) {
      return this.bullColor;
    } else {
      return "#000";
    }
  }

  drawCandle({ renderedProperties, canvasActualHeight, gridMax, gridMin }) {
    const girdTotalDiff = gridMax - gridMin;
    renderedProperties.map((property, index) => {
      const { open, close, high, low } = property;
      const openPrice = Number.parseFloat(open);
      const closePrice = Number.parseFloat(close);
      const highPrice = Number.parseFloat(high);
      const lowPrice = Number.parseFloat(low);

      const candleColor = this.getCandleColor({ openPrice, closePrice });
      const rectUpperValue = openPrice > closePrice ? openPrice : closePrice;
      const rectLeftTopX =
        this.startDrawPosition -
        index * this.candleWidth -
        this.candleXGap * index;
      const rectLeftTopY =
        canvasActualHeight * ((gridMax - rectUpperValue) / girdTotalDiff) +
        this.heightPadding;
      const isOpenCloseEqual = openPrice === closePrice;
      const openCloseDiff = Math.abs(openPrice - closePrice);
      const rectHeight = isOpenCloseEqual
        ? 1
        : canvasActualHeight * (openCloseDiff / girdTotalDiff);
      this.drawRect({
        leftTopX: rectLeftTopX,
        leftTopY: rectLeftTopY,
        width: this.candleWidth,
        height: rectHeight,
        color: candleColor,
      });

      const wickStartY =
        canvasActualHeight * ((gridMax - highPrice) / girdTotalDiff) +
        this.heightPadding;
      const wickEndY =
        canvasActualHeight * ((gridMax - lowPrice) / girdTotalDiff) +
        this.heightPadding;

      this.drawLine({
        startX: rectLeftTopX + this.candleWidth / 2,
        endX: rectLeftTopX + this.candleWidth / 2,
        startY: wickStartY,
        endY: wickEndY,
        color: candleColor,
      });
    });
  }
  getRenderedProperties(candleCountsInChart) {
    return this.renderedProperties.filter((value, index) => {
      return index <= candleCountsInChart;
    });
  }

  draw() {
    const renderedProperties = this.getRenderedProperties(
      this.candleCountsInChart
    );
    const allPrices = this.arrayOfAllPrices(renderedProperties);

    const max = Math.max(...allPrices);
    const min = Math.min(...allPrices);

    const scale = (max - min) / (this.totalAxisInterval - 1);
    const gridMax = max + scale / 2;
    const gridMin = gridMax - scale * this.totalAxisInterval;
    const canvasActualHeight = this.canvas.height - this.heightPadding * 2;

    this.drawGrid({
      totalAxisInterval: this.totalAxisInterval,
      canvasActualHeight,
      gridMax,
      scale,
    });
    this.drawCandle({
      canvasActualHeight,
      gridMax,
      gridMin,
      renderedProperties: this.properties,
    });
  }
}

const canvas = document.getElementById("stockChart");
canvas.width = 700;
canvas.height = 350;

let myCandlesticks = new Candlesticks({
  canvas,
  data,
  columnCount: 2,
  heightPadding: 10,
});

myCandlesticks.draw();

window.addEventListener("wheel", (event) => {
  myCandlesticks.zoom(event.deltaY);
});
