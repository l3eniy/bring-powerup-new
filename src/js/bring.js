class Rectangle {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }

    berechneFlaeche() {
        return this.height * this.width;
      }
  }


  window.bring = {
    Rectangle: Rectangle,
};