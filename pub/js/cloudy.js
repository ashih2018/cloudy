

function shuffle(array) {
  // from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function generateColor() {
  // generates random hex value
  let result = '#';
  const hex = '0123456789ABCDEF';
  for (let i = 0; i < 6; i++) {
    result += hex[Math.floor(16 * Math.random())];
  }
  return result;
}

function Cloudy() {
  this.selectors = [];
  this.stats = {};
  this.sortedWords = [];
  this.highlightedWords = [];
  this.id = null;
  this.totalWords = 0;
  this.wordsToDisplay = 100;
  this.bannedWords = new Set();
  this.color = 1;
  this.colorMap = {}
}

Cloudy.prototype = {
  addSelector: function(selectors) {
    this.selectors.push(selectors);
  },

  removeSelector: function(selector) {
    const index = this.selectors.indexOf(selector);
    if (index > -1) {
      this.selectors.splice(index, 1);
    }
    return index;
  },

  attachId: function(id) {
    this.id = id;
  },

  updateBannedWords: function (listOfWords) {
    this.bannedWords = new Set();
    listOfWords.forEach(word => {
      this.bannedWords.add(word.toLowerCase());
    });
  },

  setWordsToDisplay: function(num) {
    this.wordsToDisplay = num;
  },

  generateWordLink: function(word, maxSeen, largestWord) {
    const newWord = document.createElement("li");
    const wordLink = document.createElement("a");
    const name = word[0];
    const numTimes = word[1];

    wordLink.classList.add("wordLink");
    wordLink.id = `cloudyWordLink-${name}`;
    wordLink.innerHTML = `${name}: ${numTimes}`;
    wordLink.onclick = () => this.highlightWords(name);

    let size = ((numTimes / maxSeen) * largestWord).toFixed(2);
    size = size >= 1 ? size : 1;
    const color = generateColor();
    // these lines of css needs to be inline as it is dynamic
    const css = `#cloudyWordLink-${name}:hover{ background: ${color}; color: black }`;
    newWord.style = `font-size: ${size}em; color: ${color}`
    newWord.classList.add("word");
    
    newWord.appendChild(wordLink);
    return [newWord, css];
  },

  generateWordList: function() {
    const wordList = document.createElement("ul");
    wordList.classList.add("wordList");
    const randomWords = shuffle(this.sortedWords.slice(0, this.wordsToDisplay));

    const maxSeen = this.sortedWords[0][1];
    const largestWord = 4;

    const wordsToDisplay = this.sortedWords.length > this.wordsToDisplay ? this.wordsToDisplay : this.sortedWords.length;
    let css = "";
    for (let i = 0; i < wordsToDisplay; i++) {
      const currWord = randomWords[i];
      const result = this.generateWordLink(currWord, maxSeen, largestWord);
      css += result[1];
      wordList.appendChild(result[0]);
    }
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);

    return wordList;
  },

  generateWordCloud: function() {
    const id = this.id ? this.id : 'body';
    const parentContainer = $(id);
    const cloudContainer = document.createElement("div");
    $(cloudContainer).attr("id", "cloudContainer");
    
    const title = document.createElement("h1");
    title.innerHTML = "Your Word Cloud";
    $(title).attr("id", "cloudTitle");
    cloudContainer.appendChild(title);

    if (this.sortedWords.length === 0) {
      this.calculateWordStatistics();
    }
    
    const wordList = this.generateWordList();

    cloudContainer.appendChild(wordList);
    parentContainer.append(cloudContainer);
  },

  replaceWithHighlightedWords: function(selector, word) {
    const elements = $(selector);
    const currColor = this.color;
    for (let i = 0; i < elements.length; i++) {
      let content = elements[i].innerHTML;
      const index = content.toLowerCase().indexOf(word);
      if (index >= 0) {
        let regex = new RegExp("\\b" + word + "\\b", "gi");
        content = content.replace(regex, function(matched) {
          return `<span class=\"cloudyHighlight${currColor}\">${matched}</span>`;
        });
        elements[i].innerHTML = content;
      }
    }
    $(`#cloudyWordLink-${word}`).addClass(`cloudyHighlight${currColor} defaultText`);
    this.colorMap[word] = currColor;
    this.color = (this.color + 1) % 10;
  },

  removeHighlightedWords: function(selector, word) {
    const elements = $(selector);
    const numWords = this.stats[word];
    for (let i = 0; i < elements.length; i++) {
      let content = elements[i].innerHTML;
      const regex = new RegExp(`<span class=\"cloudyHighlight\[0-9]\"\>${word}\<\/span\>`, "gi");
      let index = content.toLowerCase().indexOf(word);
      if (index >= 0) {
        for (let i = 0; i < numWords; i++) {
          matched = content.match(regex);
          matched && matched.forEach(m => {
            const tagLength = m.length - 7;
            const selectedWord = m.substring(tagLength - word.length, tagLength);
            content = content.replace(m, selectedWord);
          })
        }
      }
      elements[i].innerHTML = content;
    }
    const currColor = this.colorMap[word];
    delete this.colorMap[word];
    $(`#cloudyWordLink-${word}`).removeClass(`cloudyHighlight${currColor} defaultText`);
  },

  highlightWords: function(word) {
    const highlightIndex = this.highlightedWords.indexOf(word);
    if (highlightIndex >= 0) {
      this.selectors.forEach(selector => {
        this.removeHighlightedWords(selector, word);
      })
      this.highlightedWords.splice(highlightIndex, 1);
    } else {
      this.selectors.forEach(selector => {
        this.replaceWithHighlightedWords(selector, word);
      })
      this.highlightedWords.push(word);
    }
  },

  calculateWordStatistics: function() {
    const statistics = {};
    this.selectors.forEach(selector => {
      const currText = $(selector).text();
      const words = currText.split(" ");
      words.forEach(word => {
        const strippedWord = word.toLowerCase().replace(/[^A-Z0-9]+/ig, "");
        if (strippedWord.length === 0) {
          return;
        }
        if (this.bannedWords.has(strippedWord.toLowerCase())) {
          return;
        }
        if (!(strippedWord in statistics)) {
          statistics[strippedWord] = 0;
        }
        statistics[strippedWord]++;
        this.totalWords++;
      })
      
    });
    this.stats = statistics;

    
    const sortedWords = [];
    for (let word in statistics) {
      sortedWords.push([word, statistics[word]])
    }

    sortedWords.sort(function(a, b) {
      return b[1] - a[1];
    });

    this.sortedWords = sortedWords;
  },

  generateStats: function() {
    const id = this.id ? this.id : 'body';
    let parentContainer;
    const cloudContainer = $("#cloudContainer");
    if (cloudContainer) {
      parentContainer = cloudContainer
    } else {
      parentContainer = $(id);
    }
    const statsContainer = document.createElement("div");

    const title = document.createElement("h1");
    title.innerHTML = "Top 100 Words Found";
    statsContainer.appendChild(title);

    if (this.sortedWords.length === 0) {
      this.calculateWordStatistics();
    }

    const wordList = document.createElement("ul");
    wordList.style = "height: 200px; overflow-y: scroll";
    for (let i = 0; i < this.wordsToDisplay; i++) {
      const newWord = document.createElement("li");
      const name = this.sortedWords[i][0];
      const count = this.sortedWords[i][1];
      const freq = (this.sortedWords[i][1] / this.totalWords).toFixed(4);
      newWord.innerHTML = `${name}: ${count} (${freq}%)`;
      wordList.appendChild(newWord);
    }
    statsContainer.appendChild(wordList);
    
    parentContainer.append(statsContainer);
  }
}