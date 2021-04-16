
// utility functions
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

function Cloudy() {
  this.selectors = [];
  this.stats = {};
  this.sortedWords = [];
  this.highlightedWords = [];
  this.dynamicWords = {};
  this.id = null;
  this.totalWords = 0;
  this.wordsToDisplay = 100;
  this.bannedWords = new Set();
  this.color = 1;
  this.colorMap = {};
  this.title = "Your Word Cloud";
  this.input = null;
  this.largest = 4;
  this.colors = [];
}

Cloudy.prototype = {
  updateBannedWords: function (listOfWords) {
    this.bannedWords = new Set();
    listOfWords.forEach(word => {
      this.bannedWords.add(word.toLowerCase());
    });
  },

  generateColor: function() {
    const colorRegex = /^#([0-9a-f]{6}|[0-9a-f]{3})$/i;
    // gets random color
    while (this.colors.length != 0) {
      const index = Math.floor(Math.random() * this.colors.length);
      const currColor = this.colors[index]
      if (currColor.match(colorRegex)) {
        return currColor;
      } else {
        console.log(`${currColor} is not a valid color.`);
        this.colors.splice(index, 1);
      }
    };
    // generates random hex value
    let result = '#';
    const hex = '0123456789ABCDEF';
    for (let i = 0; i < 6; i++) {
      result += hex[Math.floor(16 * Math.random())];
    }
    return result;
  },

  _convertToDom: function(selector) {
    if (typeof selector == Object && (selector instanceof Element || selector instanceof HTMLDocument)) {
      return selector;
    } else {
      return $(selector);
    }
  },

  setWordsToDisplay: function(num) {
    this.wordsToDisplay = num;
  },

  generateWordLink: function(word, maxSeen, largestWord) {
    const newWord = document.createElement("li");
    const wordLink = document.createElement("a");
    const name = word[0];
    const numTimes = word[1];

    wordLink.classList.add("cloudyWordLink");
    wordLink.id = `cloudyWordLink-${name}`;
    wordLink.innerHTML = `${name}: ${numTimes}`;
    wordLink.onclick = () => this.highlightWords(name);

    let size = ((numTimes / maxSeen) * largestWord).toFixed(2);
    size = size >= 1 ? size : 1;

    const color = this.generateColor();
    // these lines of css needs to be inline as it is dynamic
    const css = `#cloudyWordLink-${name}:hover{ background: ${color}; color: black }`;
    newWord.style = `font-size: ${size}em; color: ${color}`
    newWord.classList.add("cloudyWord");
    
    newWord.appendChild(wordLink);
    return [newWord, css];
  },

  generateWordList: function(words) {
    if (words.length == 0) {
      return;
    }
    const maxSeen = words[0][1];

    const wordList = document.createElement("ul");
    wordList.id = "cloudyWordList";
    const randomWords = shuffle(words);

    const wordsToDisplay = words.length > this.wordsToDisplay ? this.wordsToDisplay : words.length;
    let css = "";
    for (let i = 0; i < wordsToDisplay; i++) {
      const currWord = randomWords[i];
      const result = this.generateWordLink(currWord, maxSeen, this.largest);
      css += result[1];
      wordList.appendChild(result[0]);
    }
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);

    return wordList;
  },

  setDynamicWords: function(words) {
    this.dynamicWords = words;
  },

  autoupdateWords: function(newWord) {
    const strippedWord = newWord.toLowerCase().replace(/[^A-Z0-9]+/ig, "");
    if (strippedWord.length === 0) {
      return;
    }
    if (this.bannedWords.has(strippedWord.toLowerCase())) {
      return;
    }
    if (!(strippedWord in this.dynamicWords)) {
      this.dynamicWords[strippedWord] = 0;
    }
    this.dynamicWords[strippedWord]++;
    this.totalWords++;

    const allWords = [];
    for (let currWord in this.dynamicWords) {
      allWords.push([currWord, this.dynamicWords[currWord]])
    }

    return allWords;
  },

  generateDynamicWordCloud: function(words) {
    const id = this.id ? this.id : 'body';
    const parentContainer = $(id);
    const cloudContainer = document.createElement("div");
    $(cloudContainer).attr("id", "cloudyContainer");

    
    const title = document.createElement("h1");
    title.innerHTML = this.title;
    $(title).attr("id", "cloudTitle");
    cloudContainer.appendChild(title);

    const inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.value = "";
    $(inputBox).attr("id", "cloudyInputBox");
    cloudContainer.appendChild(inputBox);
    inputBox.classList.add("cloudyInput");
    this.input = inputBox;
    
    const submit = document.createElement("input");
    submit.type = "submit";
    $(submit).attr("id", "cloudyInputBox");
    submit.classList.add("cloudySubmit");
    cloudContainer.appendChild(submit);
    submit.onclick = () => {
      const allWords = this.autoupdateWords(inputBox.value, cloudContainer);
      const wordList = this.generateWordList(allWords);
      if (cloudContainer.childNodes.length > 0) {
        cloudContainer.removeChild(cloudContainer.childNodes[cloudContainer.childNodes.length -1]);
      }
      cloudContainer.appendChild(wordList);
      inputBox.value = "";
    }

    let wordList = document.createElement("ul");
    wordList.id = "cloudyWordList";
    
    if (words) {
      let results = [];
      words.forEach(w => {
        results = this.autoupdateWords(w, cloudContainer, true);
      });
      if (results.length > 0) {
        wordList = this.generateWordList(results);
      }
    }
    
    cloudContainer.appendChild(wordList);
    parentContainer.append(cloudContainer);
  },

  generateWordCloud: function() {
    const id = this.id ? this.id : 'body';
    const parentContainer = $(id);
    const cloudContainer = document.createElement("div");
    $(cloudContainer).attr("id", "cloudContainer");
    
    const title = document.createElement("h1");
    title.innerHTML = this.title;
    $(title).attr("id", "cloudTitle");
    cloudContainer.appendChild(title);

    if (this.sortedWords.length === 0) {
      this.calculateWordStatistics();
    }
    
    const wordList = this.generateWordList(this.sortedWords.slice(0, this.wordsToDisplay));

    cloudContainer.appendChild(wordList);
    parentContainer.append(cloudContainer);
  },

  replaceWithHighlightedWords: function(selector, word) {
    const elements = this._convertToDom(selector);
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
  },

  removeHighlightedWords: function(selector, word) {
    const elements = this._convertToDom(selector);
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
    console.log('currColor :>> ', currColor);
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
      this.color = (this.color + 1) % 10;
    }
  },

  calculateWordStatistics: function() {
    const statistics = {};
    this.selectors.forEach(selector => {
      let currText = this._convertToDom(selector).text();
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
    parentContainer = $(id);
    const statsContainer = document.createElement("div");
    statsContainer.id = "cloudyStatsContainer";


    const title = document.createElement("h1");
    title.innerHTML = `Top ${this.wordsToDisplay} Words Found`;
    statsContainer.appendChild(title);

    if (this.sortedWords.length === 0) {
      this.calculateWordStatistics();
    }

    console.log('this.sortedWords :>> ', this.sortedWords);

    const wordList = document.createElement("ul");
    wordList.id = "cloudyStatsList";
    const maxLength = this.wordsToDisplay < this.sortedWords.length ? this.wordsToDisplay : this.sortedWords.length;
    for (let i = 0; i < maxLength; i++) {
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
