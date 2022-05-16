class Rectangle {
    constructor(height, width) {
      this.height = height;
      this.width = width;
    }

    berechneFlaeche() {
        return this.hoehe * this.breite;
      }
  }


  window.bring = {
    Rectangle: Rectangle,
};