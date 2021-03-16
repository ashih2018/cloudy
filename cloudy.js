

function Cloudy() {
  this.classNames = [];
  this.ids = [];
  this.stats = {};
}

Cloudy.prototype = {
  addClassName: function(className) {
    this.classNames.push(className);
  },

  removeClassName: function(className) {
    const index = this.classNames.indexOf(className);
    if (index > -1) {
      this.classNames.splice(index, 1);
    }
    return index;
  },

  addId: function(id) {
    this.ids.push(id);
  },

  removeId: function(id) {
    const index = this.ids.indexOf(id);
    if (index > -1) {
      this.ids.splice(index, 1);
    }
    return index;
  },

  generateWordCloud: function(id) {

  },

  calculateWordStatistics: function() {
    const statistics = {};
    this.classNames.forEach(className => {
      const currText = $(className).text();
      const words = currText.split(" ");
      words.forEach(word => {
        const strippedWord = word.replace(/[^A-Z0-9]+/ig, "");
        if (strippedWord.length === 0) {
          return;
        }
        if (!(strippedWord in statistics)) {
          statistics[strippedWord] = 0;
        }
        statistics[strippedWord]++;
      })
      
    });
    console.log('statistics :>> ', statistics);
    return statistics;
  },

  generateStats: function(id) {
    const parentContainer = $(id);
    const statsContainer = document.createElement("div");
    statsContainer.style = "border-style: solid; border-width: 2px; border-color: red";

    const title = document.createElement("h1");
    title.innerHTML = "Top 20 Words Found";
    statsContainer.appendChild(title);

    const statistics = this.calculateWordStatistics();
    console.log('statistics :>> ', statistics);

    const sortedWords = [];
    for (let word in statistics) {
      sortedWords.push([word, statistics[word]])
    }

    sortedWords.sort(function(a, b) {
      return b[1] - a[1];
    });
    console.log('sortedWords :>> ', sortedWords);

    const wordList = document.createElement("ul");
    wordList.style = "height: 200px; overflow-y: scroll";
    for (let i = 0; i < 20; i++) {
      const newWord = document.createElement("li");
      newWord.innerHTML = `${sortedWords[i][0]}: ${sortedWords[i][1]}`;
      wordList.appendChild(newWord);
    }
    statsContainer.appendChild(wordList);
    
    parentContainer.append(statsContainer);
    this.stats = parentContainer;
  }
}
