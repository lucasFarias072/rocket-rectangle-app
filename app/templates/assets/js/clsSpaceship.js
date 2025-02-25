

import { ResourceBox } from "../../utils/resource.js"

export class Spaceship {
  constructor(spaceship, arrayForKeys) {
    this.spaceship = spaceship
    this.arrayForKeys = arrayForKeys
    this.speed = 60
    this.utilInstance = new ResourceBox()
  }

  /* OLD FORMAT
    localStorage.setItem(localStorageClicksClass, parseInt(localStorage.getItem(localStorageClicksClass)) + 1)
    this.spaceship.style.left = `${currentLeft - offsetStdSpeed}px`
    this.spaceship.style.transform = `rotate(-135deg)`
    this.arrayForKeys.push("l")

    localStorage.setItem(localStorageClicksClass, parseInt(localStorage.getItem(localStorageClicksClass)) + 1)
    this.spaceship.style.left = `${currentLeft + offsetStdSpeed}px`
    this.spaceship.style.transform = "rotate(45deg)"
    this.arrayForKeys.push("r")

    // 's' key was never changed because rotation patterns are complex 

    localStorage.setItem(localStorageClicksClass, parseInt(localStorage.getItem(localStorageClicksClass)) + 1)
    this.spaceship.style.top = `${currentTop - offsetStdSpeed}px`
    this.spaceship.style.transform = "rotate(-45deg)"
    this.arrayForKeys.push("u")
  */

  updateOffsetReport(keyName, degree, keyPushed, localStorageClicksClass, currentLeft, currentTop, offsetStdSpeed) {
    const negatives = ["a", "w"]
    const positives = ["d", "s"]
    localStorage.setItem(localStorageClicksClass, parseInt(localStorage.getItem(localStorageClicksClass)) + 1)
    
    if (negatives.includes(keyName)) {
      if (keyName === "a") {
        this.spaceship.style.left = `${currentLeft - offsetStdSpeed}px`
      } else {
        this.spaceship.style.top = `${currentTop - offsetStdSpeed}px`
      }
    } 
    if (positives.includes(keyName)) {
      if (keyName === "d") {
        this.spaceship.style.left = `${currentLeft + offsetStdSpeed}px`
      }
      // There should be an "else" for "s" key is a bit different due to rotation issues
    }

    this.spaceship.style.transform = `rotate(${degree}deg)`
    this.arrayForKeys.push(keyPushed)
  }

  control(localStorageOffsetClass, localStorageClicksClass) {
    document.addEventListener("keydown", (e) => {
      const offsetStdSpeed = parseInt(localStorage.getItem(localStorageOffsetClass))
      const currentLeft = parseInt(window.getComputedStyle(this.spaceship).left)
      const currentTop = parseInt(window.getComputedStyle(this.spaceship).top)
      
      switch (e.key.toLowerCase()) {
        // go left (- values)
        case "a":
          this.updateOffsetReport("a", -135, "l", localStorageClicksClass, currentLeft, currentTop, offsetStdSpeed)
          break
        
        // go down (+ values)
        case "s":
          localStorage.setItem(localStorageClicksClass, parseInt(localStorage.getItem(localStorageClicksClass)) + 1)
          this.spaceship.style.top = `${currentTop + offsetStdSpeed}px`
          if (
            this.arrayForKeys[this.arrayForKeys.length - 1] === "u" || 
            this.arrayForKeys[this.arrayForKeys.length - 1] === "r" || 
            this.arrayForKeys[this.arrayForKeys.length - 1] === "d"
          ) {
            this.spaceship.style.transform = "rotate(135deg)"
          } else if (this.arrayForKeys[this.arrayForKeys.length - 1] === "l") {
            this.spaceship.style.transform = "rotate(-225deg)"
          }
          this.arrayForKeys.push("d")
          break
        
        // go right (+ values)
        case "d":
          this.updateOffsetReport("d", 45, "r", localStorageClicksClass, currentLeft, currentTop, offsetStdSpeed)
          break
  
        // go up (- value)
        case "w":
          this.updateOffsetReport("w", -45, "u", localStorageClicksClass, currentLeft, currentTop, offsetStdSpeed)
          break
      }
    })
  }

  shiftShade(rgbArray, clockController) {
    let color = "rgb("
    for (let i = 0; i < 3; i++) {
      const pos = this.utilInstance.getIndice(0, rgbArray.length)
      if (i < 2) {
        color += rgbArray[pos] + ","
      } else {
        color += rgbArray[pos]
      }
    }
    color += ")"
    clockController % 3 === 0 ? this.spaceship.style.textShadow = `0 0 5rem ${color}` : null
  }
}
