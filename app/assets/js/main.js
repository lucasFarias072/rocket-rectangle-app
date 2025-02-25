

import * as domVar from "./dom_variables.js"
import { backgroundModels } from "./backgrounds.js"
import { CollisionEngine } from "./clsCollisionEngine.js"
import { EnglishGrammar } from "./clsEnglishGrammar.js"
import { Obstacle } from "./clsObstacle.js"
import { ResourceBox } from "../../utils/resource.js"
import { ScoreEngine } from "./clsScoreEngine.js"
import { Spaceship } from "./clsSpaceship.js"
import { StorageObject } from "./clsStorageObject.js"
import { ViewEngine } from "./clsViewEngine.js"

document.addEventListener("DOMContentLoaded", function () {

  const collisionEngine = new CollisionEngine()
  const domVarInstance = new domVar.DOMEngine()
  const englishGrammar = new EnglishGrammar()
  const obstacleInstance = new Obstacle()
  const util = new ResourceBox()
  const scoreInstance = new ScoreEngine()
  const storageInstance = new StorageObject()
  const viewInstance = new ViewEngine()
  
  // Init all variables that change overtime on the browser
  storageInstance.initLocalVariables(backgroundModels.custom)
  
  // Select how many blocks must be created on screen
  let numberBlocks = parseInt(localStorage.getItem("rect-amount"))
  
  // Apply standard background for the game (change on settings)
  document.body.style.backgroundImage = localStorage.getItem("game-background")

  // Grammar resources (other subjects can be included)
  const grammar = englishGrammar.getSubjectData()

  // Game engine linked resources
  const correct = []
  const incorrect = []

  // Player linked resources
  const captured = []
  const capturedIncorrect = []
  const directions = []
  const spaceshipInstance = new Spaceship(domVar.spaceship, directions)

  // Enemy linked resources
  let eachRectStat = []

  // When hit joystick icon: tutorial ON, main page OFF
  domVarInstance.showTutorial('ON')
  // When hit 'Voltar' button: tutorial OFF, main page ON
  domVarInstance.showTutorial('OFF')

  // When hit engine icon: settings ON, main page OFF
  domVarInstance.showSettings('ON')
  // When hit 'Salvar' button: save changes, settings OFF, main page ON
  domVarInstance.showSettings('OFF')

  domVarInstance.suggestGameBackground()

  domVarInstance.controlCustomBackground(
    domVar.allCustomBackgroundInputs, domVar.userCustomBackground, backgroundModels.custom, "game-background"
  )
  
  /*
    . When hit engine icon: 'difficulty-background' local storage applied to corresponding button
    . When settings are opened, only one difficulty is applied (the one set on local storage)
  */ 
  domVarInstance.setupStdLevel("difficulty-background", "white")
  
  // (Within settings) when hit any difficulty button available: set this difficulty on update
  domVarInstance.setEasyLevel()
  domVarInstance.setMediumLevel()
  domVarInstance.setHardLevel()
  
  // When hit a 'background sample' on 'engine/settings': select this background 
  domVarInstance.controlClickedBackground(domVar.allBackgrounds, "game-background")

  /*
    When hit 'iniciar': game page ON, main page OFF
    When game starts: blocks appear gradually & counter starts after it
  */
  domVarInstance.play("last-clock")

  // When hit 'recomeçar': game page OFF, main page ON
  domVarInstance.restart(
    [
      localStorage.setItem("last-number-clicks", 0),
      localStorage.setItem("last-clock", 0)
    ]
  )

  // When hit 'sair': game page OFF, main page ON
  domVarInstance.leave()
  
  // Title of the game colored based on the first rgb tuple of the background
  domVarInstance.adaptTitleToBackground("game-background")
  
  // Make rocket logo rotate sideways
  domVarInstance.animateLogo()

  // Move player with keys from keyboard
  spaceshipInstance.control("player-speed", "last-number-clicks")

  /* ========== CREATION OF ENEMIES ==========
    . Insert objects for collision: player's speed changes according to difficulty
    . second parameter determines the amount of items on screen
  */
  obstacleInstance.putOnScreen(
    domVar.rectanglesArea, 
    numberBlocks,
    0,
    "game-background",
    "player-speed"
  )

  // Captures rectangles for extra procedures
  const allRectangles = [...document.querySelectorAll(".box")]
  
  // From 'numberBlocks', the content inserted each follow the same amount (1st par)
  obstacleInstance.addTxt("rect-amount", allRectangles, grammar[1.2], grammar[1.1])
  
  // Paint each block with colors similar to the game background
  const playerShadow = obstacleInstance.paint("game-background", numberBlocks, allRectangles)
  
  // Result on upper top area after end game (manipulate data with clicks)
  domVarInstance.controlResultTable("game-background")
  
  // ========== MAIN LOOP ==========
  let loopClock = 0
  const loop = setInterval(() => {

    // Display player's current score (right - wrong)
    domVarInstance.showAccuracyOverTime(captured, capturedIncorrect)
    
    // Check if game should change to the result frame
    const endGame = captured.length === 10

    // Get player's stats overtime to check collision
    const spaceshipStats = domVar.spaceship.getBoundingClientRect()
    
    // When hit 'iniciar': collect [x, y, height, width] of each block (for collision)
    if (domVarInstance.isON) {
      allRectangles.forEach(rect => {
        eachRectStat.push(rect.getBoundingClientRect())
      })
      domVarInstance.isON = false
    }

    // [ON GAME] check for collision on each rect stats in relation to the player 
    else {
      eachRectStat.forEach((rectStat, pos) => {
        // Needed data to check collision
        const block = allRectangles[pos]
        const isThereCollision = collisionEngine.isThereCollision(spaceshipStats, rectStat)
        const niceCollision = isThereCollision && grammar[1.1].includes(block.textContent)
        const potatoCollision = isThereCollision && !grammar[1.1].includes(block.textContent)
        
        // Right collision
        niceCollision ? collisionEngine.collectData(captured, block, domVar.spaceship, "nice collision") : null
        // Wrong collision
        potatoCollision ? collisionEngine.collectData(capturedIncorrect, block, domVar.spaceship, "potato collision") : null
      })
    }
    
    if (endGame) {
      // Clean up rect stats to cancel collision (because game is over already)
      eachRectStat = []

      // Make screen adjustments to display the result
      viewInstance.controlTagVisibility(domVarInstance.groupWindows, [0, 0, 1, 1, 0], "std-vanished")
      domVarInstance.expandResultSession()
      domVarInstance.hideClock()
      domVarInstance.showAccuracyTable(domVar.correct, domVar.incorrect, captured, capturedIncorrect)
    
      // Collect data to calculate performance
      const totalClicks = parseInt(localStorage.getItem("last-number-clicks"))
      const completionTime = parseInt(localStorage.getItem("last-clock"))

      // Performance being calculated
      const calculusReport = scoreInstance.calculate(
        capturedIncorrect.length, captured.length, 0.15,
        totalClicks, completionTime
      )
      // const performanceRate = scoreInstance.calculatePerformance(capturedIncorrect.length, captured.length)
      // const performanceRateUpdate = scoreInstance.calculateClicksInfluence(performanceRate, 0.15, totalClicks)
      // const performanceRateUpdateDecay = scoreInstance.calculateTimeInfluence(performanceRateUpdate, completionTime)
      // const punishmentRate = parseFloat(`${scoreInstance.calculatePerformance(performanceRateUpdateDecay, performanceRateUpdate)}`).toFixed(2)
      // const performanceRateScore = scoreInstance.getEndPerformanceRate(performanceRateUpdateDecay)
      
      // Build performance bar progress animation (it requires this loop's closure below)
      calculusReport.performanceRateScore <= 0 
      ? domVarInstance.setupProgressBar(0, "desclassificado!")
      : domVarInstance.setupProgressBar(parseInt(calculusReport.performanceRateScore) > 100 ? 100 : parseInt(calculusReport.performanceRateScore), calculusReport.performanceRateScore)
      
      // Reveal player's result
      domVar.afterEndGameArea.classList.remove("std-vanished")
      const stats = [`${completionTime} seg`, `${totalClicks}`, `${calculusReport.punishmentRate}%`]
      
      // Show player's result OR sign based on player's performance rate score
      domVar.endGameInfos.forEach((tag, pos) => {
        calculusReport.performanceRateScore <= 0 
        ? tag.textContent = `🚫` 
        : tag.textContent = stats[pos]
      })
      
      // Required to stop bar progress animation
      clearInterval(loop)
    }
    
    // Control how colors from texts change
    loopClock += 50
    loopClock = util.updateTextColors(loopClock, allRectangles, 200)
    
    // Change player's shadow overtime
    spaceshipInstance.shiftShade(playerShadow, parseInt(domVar.clock.textContent.split(" ")[1]))
  }, 100)

})