class YAxisDrawer {
  constructor(options) {
    this.canvas = options.canvas;
    this.heightPadding = options.heightPadding;
    this.CanvasUtilDrawer = new CanvasUtilDrawer({
      ctx: options.ctx,
    });
  }

  drawGrid({ totalAxisInterval, canvasActualHeight, gridMax, scale }) {
    let currentAxisInterval = 0;
    while (currentAxisInterval <= totalAxisInterval) {
      const gridYPosition =
        canvasActualHeight * (currentAxisInterval / totalAxisInterval) +
        this.heightPadding;
      this.CanvasUtilDrawer.drawLine({
        startX: 0,
        startY: gridYPosition,
        endX: this.canvas.width,
        endY: gridYPosition,
        color: "#DBDBDB",
      });
      const gridValue = gridMax - currentAxisInterval * scale;
      const text = `${gridValue.toFixed(2)}`;
      this.CanvasUtilDrawer.drawText({
        text,
        x: this.canvas.width - 2,
        y: gridYPosition,
        textAlign: "right",
      });
      currentAxisInterval++;
    }
  }

  draw(drawInfo) {
    const { scale, gridMax, totalAxisInterval, canvasActualHeight } = drawInfo;
    this.drawGrid({
      totalAxisInterval,
      canvasActualHeight,
      gridMax,
      scale,
    });
  }
}
