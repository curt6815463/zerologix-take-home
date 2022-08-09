class CandleDrawer {
  constructor(options) {
    this.bullColor = options.bullColor;
    this.bearColor = options.bearColor;
    this.canvas = options.canvas;
    this.startDrawPosition = options.startDrawPosition;
    this.heightPadding = options.heightPadding;

    this.CanvasUtilDrawer = new CanvasUtilDrawer({
      ctx: options.ctx,
    });
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

  drawCandle({
    properties,
    canvasActualHeight,
    gridMax,
    gridMin,
    candleWidth,
    candleXGap,
  }) {
    const girdTotalDiff = gridMax - gridMin;
    properties.map((property, index) => {
      const { open, close, high, low } = property;
      const openPrice = Number.parseFloat(open);
      const closePrice = Number.parseFloat(close);
      const highPrice = Number.parseFloat(high);
      const lowPrice = Number.parseFloat(low);

      const candleColor = this.getCandleColor({ openPrice, closePrice });
      const rectUpperValue = openPrice > closePrice ? openPrice : closePrice;
      const rectLeftTopX =
        this.startDrawPosition - index * candleWidth - candleXGap * index;
      const rectLeftTopY =
        canvasActualHeight * ((gridMax - rectUpperValue) / girdTotalDiff) +
        this.heightPadding;
      const isOpenCloseEqual = openPrice === closePrice;
      const openCloseDiff = Math.abs(openPrice - closePrice);
      const rectHeight = isOpenCloseEqual
        ? 1
        : canvasActualHeight * (openCloseDiff / girdTotalDiff);

      this.CanvasUtilDrawer.drawRect({
        leftTopX: rectLeftTopX,
        leftTopY: rectLeftTopY,
        width: candleWidth,
        height: rectHeight,
        color: candleColor,
      });

      const wickStartY =
        canvasActualHeight * ((gridMax - highPrice) / girdTotalDiff) +
        this.heightPadding;
      const wickEndY =
        canvasActualHeight * ((gridMax - lowPrice) / girdTotalDiff) +
        this.heightPadding;

      this.CanvasUtilDrawer.drawLine({
        startX: rectLeftTopX + candleWidth / 2,
        endX: rectLeftTopX + candleWidth / 2,
        startY: wickStartY,
        endY: wickEndY,
        color: candleColor,
      });
    });
  }

  draw(drawInfo) {
    const {
      canvasActualHeight,
      gridMax,
      gridMin,
      properties,
      candleWidth,
      candleXGap,
    } = drawInfo;
    this.drawCandle({
      canvasActualHeight,
      gridMax,
      gridMin,
      properties,
      candleWidth,
      candleXGap,
    });
  }
}
