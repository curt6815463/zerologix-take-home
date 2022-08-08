class YAxisDrawer {
  constructor(options) {
    this.ctx = options.ctx;
    this.canvas = options.canvas;
    this.heightPadding = options.heightPadding;
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
