class CandleTimeDrawer {
  constructor(options) {
    this.canvas = options.canvas;
    this.ctx = options.ctx;
    this.CanvasUtilDrawer = options.CanvasUtilDrawer;
  }

  setDrawInterval({ text, candleWidth, candleXGap }) {
    this.ctx.font = "bold 10px Arial";
    const textWidth = this.ctx.measureText(text).width + 20;
    const number = Math.ceil(textWidth / (candleWidth + candleXGap)) + 2;
    this.drawInterval = number;
  }

  draw(drawInfo) {
    const { startX, time, index } = drawInfo;
    if (index % this.drawInterval === 0) {
      this.ctx.save();
      this.ctx.globalCompositeOperation = "destination-over";
      this.CanvasUtilDrawer.drawLine({
        startX: startX,
        endX: startX,
        startY: 0,
        endY: this.canvas.height,
        textAlign: "center",
        color: "#DBDBDB",
      });

      this.CanvasUtilDrawer.drawText({
        text: time,
        x: startX,
        y: this.canvas.height,
        textAlign: "center",
      });
      this.ctx.restore();
    }
  }
}
