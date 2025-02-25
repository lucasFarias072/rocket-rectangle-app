

import { ResourceBox } from "../../utils/resource.js"

export class CollisionEngine {

  constructor() {
    this.util = new ResourceBox()
  }
  
  isThereCollision(player, target) {
    return player.x < target.x + target.width &&
    player.x + player.width > target.x &&
    player.y < target.y + target.height &&
    player.y + player.height > target.y
  }

  vanish(htmlBlockElement) {
    htmlBlockElement.classList.add("std-captured")
    htmlBlockElement.style.color = "transparent"
  }

  crash(htmlBlockElement) {
    htmlBlockElement.style.transform = `rotate(${this.util.getFloat(-1000, 1001)}deg)`
  }

  collectData(source, htmlElement, htmlElementPlayer, eventType) {
    if (!source.includes(htmlElement)) {
      source.push(htmlElement)
    }
    
    if (eventType === "nice collision") {
      this.vanish(htmlElement)
    } else {
      this.crash(htmlElementPlayer)
      this.crash(htmlElement)
    }
  }

}
