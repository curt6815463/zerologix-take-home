class CandleDrawer {
  constructor(options) {
    this.bullColor = options.bullColor;
    this.bearColor = options.bearColor;
    this.startDrawPosition = options.startDrawPosition;
    this.heightPadding = options.heightPadding;

    this.CanvasUtilDrawer = new CanvasUtilDrawer({
      ctx: options.ctx,
    });
    this.CandleTimeDrawer = new CandleTimeDrawer({
      ctx: options.ctx,
      canvas: options.canvas,
      CanvasUtilDrawer: this.CanvasUtilDrawer,
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
    this.CandleTimeDrawer.setDrawInterval({
      text: properties[0].time,
      candleWidth,
      candleXGap,
    });
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

      const wickStartX = rectLeftTopX + candleWidth / 2;
      const wickEndX = rectLeftTopX + candleWidth / 2;

      const wickStartY =
        canvasActualHeight * ((gridMax - highPrice) / girdTotalDiff) +
        this.heightPadding;
      const wickEndY =
        canvasActualHeight * ((gridMax - lowPrice) / girdTotalDiff) +
        this.heightPadding;

      this.CanvasUtilDrawer.drawLine({
        startX: wickStartX,
        endX: wickEndX,
        startY: wickStartY,
        endY: wickEndY,
        color: candleColor,
      });

      this.CandleTimeDrawer.draw({
        startX: wickStartX,
        time: property.time,
        index,
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
