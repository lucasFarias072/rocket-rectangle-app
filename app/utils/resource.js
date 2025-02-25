

export class ResourceBox {
  getIndice = (tail, head) => {
    return Math.floor(Math.random() * (head - tail) + tail)
  }

  getFloat = (tail, head) => {
    return parseFloat((Math.random() * (head - tail) + tail).toFixed(2))
  }

  decreaseOrIncrease = (value, stdValue, outerValue) => {
    return value <= stdValue ? value + outerValue : value - outerValue
  }
  
  // Used to change colors from rectangles, over time
  updateTextColors(targetValue, htmlTag, switchTime) {
    if (targetValue === switchTime) {
      htmlTag[this.getIndice(0, htmlTag.length)].style.fontWeight = `${this.getIndice(333, 1001)}`
      targetValue = 0
    }
    return targetValue
  }
}
