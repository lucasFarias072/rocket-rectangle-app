

export class ViewEngine {

  controlTagVisibility(tagsGroup, viewCodes, classForHiding) {
    /*
      . tagsGroup [htmlElement]
        --o tags that have tags within
        --o normally, this tag is populated with 2 tags
        --o one is supposed to be hidden, while the other is shown
      . viewCodes [int]
        --o this array follows the order of the tags involved
        --o populate it according to the status of the tag that is desired
        --o status of the tags (0 is hidden and 1 is shown)
      . classForHiding
        --o html tag that has the css property to hide the target tag
    */
    for (let i = 0; i < tagsGroup.length; i++) {
      if (viewCodes[i]) {
        tagsGroup[i].classList.remove(classForHiding)
      } else {
        tagsGroup[i].classList.add(classForHiding)
      }
    }
  }

}
