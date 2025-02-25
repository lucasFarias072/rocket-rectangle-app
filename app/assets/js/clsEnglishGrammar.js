

export class EnglishGrammar {
  constructor(subject) {
    this.subject = subject
  }

  getSubjectData() {
    return {
      1: "adjetivos possessivos",
      1.1: ["My", "Your", "His", "Her", "Its", "Our", "Their"],
      1.2: ["I", "You", "He", "She", "It", "We", "They", "Mine", "Yours", "Hers", "Ours", "Theirs", "is", "is not", "isn't", "are", "are not", "aren't", "am", "am not", "will", "will not", "won't", "would", "would not", "wouldn't", "can", "cannot", "couldn't", "must", "must not", "musn't", "should", "should not", "shouldn't"]
    }
  }
}

// function getIndice (tail, head) {
//   return Math.floor(Math.random() * (head - tail) + tail)
// }

// const i = new EnglishGrammar()
// const dict = i.getSubjectData()
// console.log(dict["1.2"][getIndice(0, dict["1.2"].length)])
// console.log(i.getSubjectData())
// export const adjectives = ["My", "Your", "His", "Her", "Its", "Our", "Their"]
// export const pronouns = ["I", "You", "He", "She", "It", "We", "They"]