

import { ResourceBox } from "../../utils/resource.js"

export class Obstacle {

  constructor() {
    this.utilInstance = new ResourceBox()
  }

  margin(lvl, orientation) {
    if (lvl === "e" && orientation === "h") {
      return this.utilInstance.getFloat(1.5, 4.0)
    } else if (lvl === "e" && orientation === "v") {
      return this.utilInstance.getFloat(1.7, 3.8)
    } else if (lvl === "m" && orientation === "h") {
      return this.utilInstance.getFloat(1.2, 3.7)
    } else if (lvl === "m" && orientation === "v") {
      return this.utilInstance.getFloat(1.4, 3.5)
    } else if (lvl === "h" && orientation === "h") {
      return this.utilInstance.getFloat(0.9, 3.4)
    } else if (lvl === "h" && orientation === "v") {
      return this.utilInstance.getFloat(1.1, 3.2)
    }
  }

  create(containerTag, amount) {
    const newTag = document.createElement("span")
    
    newTag.style.color = "white"
    newTag.style.borderRadius = ".3rem"
    newTag.style.position = "relative"
    newTag.style.textAlign = "center"
    newTag.style.transition = "linear all 1.5s"
    
    if (amount === 30) {
      newTag.style.height = "2.7rem"
      newTag.style.width = "3.2rem"
      newTag.style.margin = `${this.margin("e", "v")}rem ${this.margin("e", "h")}rem ${this.margin("e", "v")}rem ${this.margin("e", "h")}rem`
    } else if (amount === 40) {
      newTag.style.height = "2.2rem"
      newTag.style.width = "2.7rem"
      newTag.style.margin = `${this.margin("m", "v")}rem ${this.margin("m", "h")}rem ${this.margin("m", "v")}rem ${this.margin("m", "h")}rem`
    } else {
      newTag.style.height = "1.9rem"
      newTag.style.width = "2.4rem"
      newTag.style.margin = `${this.margin("h", "v")}rem ${this.margin("h", "h")}rem ${this.margin("h", "v")}rem ${this.margin("h", "h")}rem`
      newTag.style.fontSize = ".8rem"
    }
    
    newTag.setAttribute("class", "box flex row going-center")
    containerTag.appendChild(newTag)
  }

  putOnScreen(containerTag, amount, errorGap, localStorageBackgroundClass, localStoragePlayerSpeedClass) {
    let levelSpeed
    
    // There were problems with the amount of blocks, so it takes the total - 5
    for (let i = 0; i < amount - errorGap; i++) {
      this.create(containerTag, amount, localStorageBackgroundClass)
      if (i === 0) {
        if (amount === 30) {
          levelSpeed = 60
        } else if (amount === 40) {
          levelSpeed = 55
        } else {
          levelSpeed = 50
        }
      }

      // Apply player's standard speed only once during indice 0
      if (i === 0) {
        localStorage.setItem(localStoragePlayerSpeedClass, levelSpeed)
      }
    }
  }

  addTxt(blocksRef, blocksQuery, incorrectDataArray, correctDataArray) {
  
    let blocksToBeCreated = 0
    const posArray = []
    const blocksArrayLength = parseInt(localStorage.getItem(blocksRef))
    
    // Take the position of the 10 blocks that will hold the proper answers
    while (blocksToBeCreated < 10) {
      const pos = this.utilInstance.getIndice(0, blocksArrayLength)
      
      if (!posArray.includes(pos)) {
        posArray.push(pos)
        blocksToBeCreated++
      }
    }
    console.log(posArray)
    
    // Put on the chosen blocks, the text where there is a correct term 
    let i = 0
    while (i < 10) {
      blocksQuery[posArray[i]].textContent = correctDataArray[this.utilInstance.getIndice(0, correctDataArray.length)]
      i++
    }
    
    // And, on the blocks with no text, insert random texts to create confusion
    blocksQuery.forEach((tag, pos) => {
      tag.textContent === "" ? tag.textContent = incorrectDataArray[this.utilInstance.getIndice(0, incorrectDataArray.length)] : null
    })
    
  }

  checkTextColor(statement, htmlElement) {
    statement ? htmlElement.style.color = "black" : htmlElement.style.color = "white"
  }

  paint(backgroundRef, blocksAmount, allBlocks) {
    const queryRgb = localStorage.getItem(backgroundRef).split("g,")[1]
    let rgbCode = ""
    const rgb = []
    
    for (let i = 0; i < queryRgb.length; i++) {
      if (queryRgb[i] === "(") {
        for (let j = i; j < queryRgb.length; j++) {
          if (queryRgb[j + 1] != ")") {
            rgbCode += queryRgb[j + 1]
          } else {
            rgbCode += ", "
            break
          }
        }
        
      }
    }
    
    rgbCode = rgbCode.split(",")

    for(let i of rgbCode) {
      i != " " ? rgb.push(parseInt(i)) : null
    }

    for (let i = 0; i < blocksAmount; i++) {
      const l = this.utilInstance.getIndice(1, 34)
      const m = this.utilInstance.getIndice(1, 34)
      const r = this.utilInstance.getIndice(1, 34)
      
      const leftSide = `rgb(${rgb[0] + l}, ${rgb[1] + m}, ${rgb[2] + r})`
      const middleSide = `rgb(${rgb[3] + m}, ${rgb[4] + r}, ${rgb[5] + l})`
      const rightSide = `rgb(${rgb[6] + r}, ${rgb[7] + l}, ${rgb[8] + m})`
      const isLeftSideBright = (rgb[0] + rgb[1] + rgb[2]) / 3 > 128
      const isMiddleSideBright = (rgb[3] + rgb[4] + rgb[5]) / 3 > 128
      const isRightSideBright = (rgb[6] + rgb[7] + rgb[8]) / 3 > 128

      const method = this.utilInstance.getIndice(1, 7)
      
      if (method === 1) {
        allBlocks[i].style.backgroundImage = `linear-gradient(15deg, ${leftSide}, ${middleSide})`
        this.checkTextColor(isLeftSideBright, allBlocks[i])
      } else if (method === 2) {
        allBlocks[i].style.backgroundImage = `linear-gradient(15deg, ${leftSide}, ${rightSide})`
        this.checkTextColor(isLeftSideBright, allBlocks[i])
      } else if (method === 3) {
        allBlocks[i].style.backgroundImage = `linear-gradient(15deg, ${middleSide}, ${leftSide})`
        this.checkTextColor(isMiddleSideBright, allBlocks[i])
      } else if (method === 4) {
        allBlocks[i].style.backgroundImage = `linear-gradient(15deg, ${middleSide}, ${rightSide})`
        this.checkTextColor(isMiddleSideBright, allBlocks[i])
      } else if (method === 5) {
        allBlocks[i].style.backgroundImage = `linear-gradient(15deg, ${rightSide}, ${leftSide})`
        this.checkTextColor(isRightSideBright, allBlocks[i])
      } else {
        allBlocks[i].style.backgroundImage = `linear-gradient(15deg, ${rightSide}, ${middleSide})`
        this.checkTextColor(isRightSideBright, allBlocks[i])
      }
      
    }
    return rgb
  
  }

}
