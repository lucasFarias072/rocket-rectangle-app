

export class StorageObject {
  checkExistance(keyName) {
    return localStorage.getItem(keyName) != null
  }
  configure(keyName, value) {
    localStorage.setItem(keyName, value)
  }
  exhibit(keyName) {
    console.log(this.checkExistance(keyName) ? localStorage.getItem(keyName) : "void") 
  }
  attribute(htmlProperty, storageItem) {
    htmlProperty = storageItem
  }
  // Merge of "checkExistance" & "configure"
  analyse(keyName, value) {
    !this.checkExistance(keyName) ? this.configure(keyName, value) : null
  }

  initLocalVariables(stdBackground) {
    this.analyse("difficulty-background", "green")
    this.analyse("game-background", stdBackground)
    this.analyse("last-clock", 0)
    this.analyse("last-number-clicks", 0)
    this.analyse("player-speed", 60)
    this.analyse("rect-amount", 30)
  }
}