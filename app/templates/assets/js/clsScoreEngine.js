

export class ScoreEngine {

  constructor() {
    this.stepOne
    this.stepTwo
    this.stepThree
    this.stepFour
    this.stepFive
  }
  
  /*
    . If lesser value > greater value: performance = 0
    . Users with no mistakes have as outset: performance = 100%
    . Users who have more mistakes than dexterity> performance = 0%
  */
  calculatePerformance(lesserVal, greaterVal) {
    let lesser
    let greater
    let pipe
    let trigger = false

    if (lesserVal > greaterVal) {
      pipe = greaterVal
      lesser = pipe
      greater = lesser
      trigger = true
    } 
    return trigger ? parseFloat(100 - ((lesser / greater) * 100)) : parseFloat(100 - ((lesserVal / greaterVal) * 100))
  }

  testCalculatePerformance() {
    let tail = 0
    const head = 5
    for (let i = 0; i < 10; i++) {
      console.log(`this.calculatePerformance(${tail}, ${head}) = ${this.calculatePerformance(tail, head)}`)
      tail++
    }
  }

  getRounded (value) {
    let modular = parseInt(value) - value
    modular = -modular
    return modular >= 0.5 ? parseInt(value) + 1 : parseInt(value) 
  }

  getValueSlice(value, sliceValue) {
    return value * sliceValue
  }

  calculateClicksInfluence(performanceTailValue, sliceValue, numberClicks) {
    let backupForNull
    let currentScore
    if (performanceTailValue === 0) {
      backupForNull = 50
      const badPerformanceraise = this.getRounded(this.getValueSlice(backupForNull, sliceValue))
      currentScore = backupForNull + badPerformanceraise
    } else {
      const goodPerformanceraise = this.getRounded(this.getValueSlice(performanceTailValue, sliceValue / 1.2))
      currentScore = performanceTailValue + goodPerformanceraise
    }
    
    for (let i = 0; i < numberClicks; i++) {
      if (performanceTailValue === 0) {
        currentScore -= 0.01
      } else {
        currentScore -= 0.07
      }
    }
    return currentScore
  }

  calculateTimeInfluence(performanceValue, completionTime) {
    let currentScore = performanceValue
    if (currentScore > 0) {
      for (let i = 0; i < completionTime; i++) {
        currentScore -= this.getValueSlice(completionTime, 0.01)
      }
    }
    return currentScore
  }

  getEndPerformanceRate(performanceValue) {
    return performanceValue < 0 ? 0 : parseFloat(`${performanceValue}`).toFixed(2)
  }

  calculate(mistakes, accuracy, punishmentRate, nClicks, completionTime) {
    this.stepOne = this.calculatePerformance(mistakes, accuracy)
    this.stepTwo = this.calculateClicksInfluence(this.stepOne, punishmentRate, nClicks)
    this.stepThree = this.calculateTimeInfluence(this.stepTwo, completionTime)
    this.stepFour = parseFloat(`${this.calculatePerformance(this.stepThree, this.stepTwo)}`).toFixed(2)
    this.stepFive = this.getEndPerformanceRate(this.stepThree)

    return {
      performanceRate: this.stepOne,
      performanceRateUpdate: this.stepTwo,
      performanceRateUpdateDecay: this.stepThree,
      punishmentRate: this.stepFour,
      performanceRateScore: this.stepFive,
    }
  }
}