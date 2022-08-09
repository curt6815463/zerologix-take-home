class CanvasUtilDrawer {
  constructor(options) {
    this.ctx = options.ctx;
  }

  drawText({ text, x, y, textAlign = "left" }) {
    this.ctx.save();
    this.ctx.textAlign = textAlign;
    this.ctx.fillStyle = "grey";
    this.ctx.font = "bold 10px Arial";
    this.ctx.fillText(text, x, y);
    this.ctx.restore();
  }

  drawRect({ leftTopX, leftTopY, width, height, color }) {
    this.ctx.save();
    this.ctx.fillStyle = color;
    this.ctx.fillRect(leftTopX, leftTopY, width, height);
    this.ctx.restore();
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
}
