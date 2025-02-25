

import { ViewEngine } from "./clsViewEngine.js"
import { ResourceBox } from "../../utils/resource.js"

export class DOMEngine {

  constructor() {
    this.utilInstance = new ResourceBox()
    this.viewInstance = new ViewEngine()
    this.buttonsArray = [easyBtn, mediumBtn, hardBtn]
    this.groupWindows = [engineCheat, giveUpBtn, dexterityBar, rebootBtn, rectanglesArea]
    this.colorsArray = ["green", "orange", "red"]
    this.tilesAmountArray = [30, 40, 50]
    this.isON = false
  }
  
  showSettings(actionName) {
    if (actionName === 'ON') {
      settingsBtn.addEventListener("click", () => {
        this.viewInstance.controlTagVisibility([menuArea, settingsArea], [0, 1], "std-vanished")
        // Place menu in the middle of the screen
        settingsArea.style.height = "90vh"
        settingsArea.style.width = "50%"
        settingsArea.style.marginLeft = "25%"
      })
    }
    //
    else {
      saveBtn.addEventListener("click", () => {
        window.location.reload()
      })
    }
  }

  suggestGameBackground() {
    suggestBtn.addEventListener("click", () => {
      allCustomBackgroundInputs.forEach(box => {
        box.value = this.utilInstance.getIndice(0, 256)
      })
    })
  }

  showTutorial(actionName) {
    if (actionName === 'ON') {
      // Joystick icon
      controlsBtn.addEventListener("click", () => {
        this.viewInstance.controlTagVisibility([menuArea, controlsArea], [0, 1], "std-vanished")
        controlsArea.style.height = "90vh"
      })
    } 
    //
    else {
      // 'Voltar' button
      returnTutorialBtn.addEventListener("click", () => {
        this.viewInstance.controlTagVisibility([controlsArea, menuArea], [0, 1], "std-vanished")
        controlsArea.style.height = "90vh"
      })
    }
  }

  setupStdLevel (levelKeyName, stdValue) {
    for (let i = 0; i < this.colorsArray.length; i++) {
      // If what is in local storage matches the color of the button: paint it
      if (localStorage.getItem(levelKeyName) === this.colorsArray[i]) {
        this.buttonsArray[i].style.backgroundColor = localStorage.getItem(levelKeyName)
      } 
      // If not: let it with the standard color (to indicate not picked)
      else {
        this.buttonsArray[i].style.backgroundColor = stdValue
      }
    }
  }

  controlDifficulty(buttonFocusedIndice, speedRef, levelRef) {
    for (let i = 0; i < this.buttonsArray.length; i++) {
      if (i === buttonFocusedIndice) {
        this.buttonsArray[i].style.backgroundColor = this.colorsArray[i]
      } else {
        this.buttonsArray[i].style.backgroundColor = "white"
      }
    }
    localStorage.setItem(speedRef, this.tilesAmountArray[buttonFocusedIndice])
    localStorage.setItem(levelRef, this.colorsArray[buttonFocusedIndice])
  } 

  controlClickedBackground(backgroundsQuery, backgroundRef) {
    let backgroundPos
    
    backgroundsQuery.forEach((tag, pos) => {
      tag.addEventListener("click", () => {
        // Save the position of the background clicked
        backgroundPos = pos
        // Iterate and hide anyone else that was not clicked (to highlight the one clicked)
        for (let i = 0; i < backgroundsQuery.length; i++) {
          if (i != backgroundPos) {
            backgroundsQuery[i].classList.add("std-vanished")
          } else {
            // Highlight and save this background for the next time page loads
            tag.style.border = "orangered solid 2px"
            localStorage.setItem(backgroundRef, window.getComputedStyle(backgroundsQuery[i]).backgroundImage)
          }
        }
      })
    })
  }

  controlCustomBackground(inputsRgb, targetTag, modelsMap, backgroundRefKey) {
    
    // Empty pallet that will host all input color codes
    const pallet = new Array(9)
    
    const loop = setInterval(() => {
      
      // Treatments to avoid stupid input values
      inputsRgb.forEach((inputTag, pos) => {
        const verificationA = parseInt(inputTag.value) 
        if (verificationA.toString() === "NaN" && inputTag.value != "") {
          inputTag.value = "0"
        }
        else if (inputTag.value.includes(".")) {
          inputTag.value = "0"
        }
        else if (parseInt(inputTag.value) < 0 || (parseInt(inputTag.value) > 255)) {
          inputTag.value = "0"
        }
        else if (inputTag.value[0] === "0" && inputTag.value.length > 1) {
          inputTag.value = "0"
        }
      })
      
      // Populate "pallet" (fill undefined indices for actual values)
      inputsRgb.forEach((inputTag, pos) => {
        pallet[pos] = inputTag.value
      })

      let red = "rgb("
      let green = "rgb("
      let blue = "rgb("
      
      for (let i = 0; i < pallet.length; i++) {
        // from indices 0 to 2: first color
        if (i >= 0 && i <= 2) {
          if (i < 2) {
            red += inputsRgb[i].value + ","
          } else {
            red += inputsRgb[i].value
          }
        }
        // from indices 3 to 5: second color
        else if (i > 2 && i <= 5) {
          if (i < 5) {
            green += inputsRgb[i].value + ","
          } else {
            green += inputsRgb[i].value
          }
        } 
        // from indices 6 to 8: third color
        else {
          if (i < inputsRgb.length -1) {
            blue += inputsRgb[i].value + ","
          } else {
            blue += inputsRgb[i].value
          }
          
        }
      }

      red += ")"
      green += ")"
      blue += ")"
      
      // Fill the tag (here: a black box container to be painted) with this color
      targetTag.style.backgroundImage = `linear-gradient(15deg, ${red}, ${green}, ${blue})`
      
      // Check if no input was changed (not touched, standard settings)
      let counter = 0
      for (let i = 0; i < inputsRgb.length; i++) {
        counter += parseInt(inputsRgb[i].value)
      }
      
      // If all inputs have values && current background != background suggested
      if (counter != 0 && modelsMap != window.getComputedStyle(targetTag).backgroundImage) {
        // Save it + put it into local storage to validate change
        modelsMap = window.getComputedStyle(targetTag).backgroundImage
        localStorage.setItem(backgroundRefKey, modelsMap)
      }

    }, 1000)
  }

  setEasyLevel() {
    easyBtn.addEventListener("click", () => {
      this.controlDifficulty(0, "rect-amount", "difficulty-background")
    })
  }

  setMediumLevel() {
    mediumBtn.addEventListener("click", () => {
      this.controlDifficulty(1,  "rect-amount", "difficulty-background")
    })
  }

  setHardLevel() {
    hardBtn.addEventListener("click", () => {
      this.controlDifficulty(2, "rect-amount", "difficulty-background")
    })
  }

  updateGameClock(localStorageClockClass) {
    let clockValue = 0
    const clockLoop = setInterval(() => {
      clockValue++
      clock.textContent = `${clock.textContent.split(" ")[0]} ${clockValue}`
      localStorage.setItem(localStorageClockClass, clockValue)
    }, 1000)
  }

  triggerGameIntroduction(localStorageClockClass) {
    setTimeout(() => {
      rectanglesArea.style.opacity = `${parseFloat(window.getComputedStyle(rectanglesArea).opacity) + this.utilInstance.getFloat(0.15, 0.34)}`
      setTimeout(() => {
          rectanglesArea.style.opacity = `${parseFloat(window.getComputedStyle(rectanglesArea).opacity) + this.utilInstance.getFloat(0.15, 0.34)}`
          setTimeout(() => {
            rectanglesArea.style.opacity = `${parseFloat(window.getComputedStyle(rectanglesArea).opacity) + this.utilInstance.getFloat(0.15, 0.34)}`
            setTimeout(() => {
              rectanglesArea.style.opacity = "1"
              // Start game counter when animation is done loading
              this.updateGameClock(localStorageClockClass)
            }, 500)
          }, 500)
        }, 500)
    }, 500)
  }

  play(localStorageClockClass) {
    launcherBtn.addEventListener("click", () => {
      this.viewInstance.controlTagVisibility([menuArea, spaceshipArea, rectanglesArea], [0, 1, 1], "std-vanished")
      this.triggerGameIntroduction(localStorageClockClass)
      this.isON = true
    })
  }

  restart(localStorageClasses) {
    rebootBtn.addEventListener("click", () => {
      for(let i = 0; i < localStorageClasses.length; i++) {
        localStorage.setItem(localStorageClasses[i], 0)
      }
      window.location.reload()
    })
  }

  leave() {
    giveUpBtn.addEventListener("click", () => {
      window.location.reload()
    })
  }

  setupTitleBackground = (htmlBackgroundImageValue) => {
    const query = htmlBackgroundImageValue.split("(")[2].split(",").join(" ").split(")")[0].split(" ")
    /*
      . The first color of the rgb group on the background is passed into 'query'
      . Based on its values, an alternative color is created
      . The standard value is half color: 128
      . If rgb color is greater than 128: rgb color - random value 
      . If rgb color is lesser than 128: rgb color + random value 
    */
    return [
      this.utilInstance.decreaseOrIncrease(parseInt(query[0]), 128, this.utilInstance.getIndice(10, 21)), 
      this.utilInstance.decreaseOrIncrease(parseInt(query[2]), 128, this.utilInstance.getIndice(10, 21)), 
      this.utilInstance.decreaseOrIncrease(parseInt(query[4]), 128, this.utilInstance.getIndice(10, 21))
    ]
  }

  adaptTitleToBackground = (backgroundRef) => {
    const newRgb = this.setupTitleBackground(localStorage.getItem(backgroundRef))
    const shades = window.getComputedStyle(gameTitle).textShadow.split(" ")
    gameTitle.style.color = `rgb(${newRgb.join(", ")})`
    gameTitle.style.textShadow = `rgb(${newRgb[2]}, ${newRgb[0]}, ${newRgb[1]}) ${shades[3]} ${shades[4]} ${shades[5]}`
  }

  animateLogo() {
    const loop = setInterval(() => {
      gameLogo.style.transform = `rotate(${45 + this.utilInstance.getIndice(-50, 51)}deg)`
    }, 500)
  }

  showAccuracyOverTime(arrayCorrect, arrayIncorrect) {
    correct.textContent = arrayCorrect.length - arrayIncorrect.length
  }

  expandResultSession() {
    spaceshipArea.style.height = "100vh"
  }

  hideClock() {
    clock.classList.add("std-vanished")
  }

  showAccuracyTable(correctTag, incorrectTag, correct, incorrect) {
    correctTag.textContent = `acertos: ${correct.length}`
    incorrectTag.textContent = `erros: ${incorrect.length}`
  }

  setupProgressBar(percentageObtained, alternativeMsg) {
    let outset = 0
    
    const loop = setInterval(() => {
      const increased = this.utilInstance.getIndice(1, 6)
      
      if (outset + increased > percentageObtained) {
        outset += (percentageObtained - outset)
        
        // This is here because I wanted the real percentage to be shown
        const percentageProgressLoop = setInterval(() => {
          dexterityPercentage.textContent = parseFloat(alternativeMsg) > 100 ? "100%" : `${alternativeMsg.length >= 10 ? alternativeMsg : `${alternativeMsg}%`}`
        }, 100)
        clearInterval(loop)
      } else {
        outset += increased
      }
  
      dexterityBar.style.backgroundImage = `linear-gradient(to top, rgb(0, 0, 200) ${outset}%, white ${outset + 1}%)`
      dexterityPercentage.textContent = percentageObtained === 0 ? alternativeMsg : `${outset}%`
      dexterityPercentage.style.fontSize = `${this.utilInstance.getFloat(1.2, 1.8)}rem`
    }, 100)
  }

  controlResultTable(localStorageBackgroundClass) {
    afterEndGameArea.style.backgroundImage = localStorage.getItem(localStorageBackgroundClass)
    afterEndGameArea.addEventListener("click", () => {
      afterEndGameArea.style.color === "black" ? afterEndGameArea.style.color = "white" : afterEndGameArea.style.color = "black"
    })
  }
}

// Main frame that shelters the entire game
export const mainFrame = document.getElementById("main-frame")

// Element that determines player's speed
export const speedInput = document.getElementById("speed-input")

// Player
export const spaceship = document.getElementById("spaceship")

// Miscellania
export const allBackgrounds = [...document.querySelectorAll(".std-frame")]
export const allCustomBackgroundInputs = [...document.querySelectorAll(".rgb")]
export const clock = document.getElementById("clock")
export const userCustomBackground = document.getElementById("user-custom-background")
export const engineCheat = document.getElementById("cheat")
export const dexterityBar = document.getElementById("dexterity-bar")
export const dexterityPercentage = document.getElementById("dexterity-percentage")
export const endGameInfos = [...document.querySelectorAll(".std-criteria")]
export const gameLogo = document.getElementById("game-logo")
export const gameTitle = document.getElementById("game-title")
export const infoBlock = document.getElementById("info-block")

// Sections
export const afterEndGameArea = document.getElementById("after-end-game-area")
export const controlsArea = document.getElementById("controls-area")
export const menuArea = document.getElementById("menu-area")
export const settingsArea = document.getElementById("settings-area")
export const spaceshipArea = document.getElementById("spaceship-area")
export const rectanglesArea = document.getElementById("rectangles-area")

// Scores
export const correct = document.getElementById("correct")
export const incorrect = document.getElementById("incorrect")

// Buttons
export const controlsBtn = document.getElementById("controls-settings") 
export const easyBtn = document.getElementById("easy-btn") 
export const giveUpBtn = document.getElementById("give-up-btn")
export const hardBtn = document.getElementById("hard-btn")
export const launcherBtn = document.getElementById("game-launcher-btn")
export const mediumBtn = document.getElementById("medium-btn") 
export const rebootBtn = document.getElementById("reboot-btn")
export const returnTutorialBtn = document.getElementById("tutorial-return-btn")
export const saveBtn = document.getElementById("save-btn")
export const settingsBtn = document.getElementById("game-settings")
export const suggestBtn = document.getElementById("suggest-btn")