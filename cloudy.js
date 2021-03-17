

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

function getRandomColor() {
  let result = '#';
  const hex = '0123456789ABCDEF';
  for (let i = 0; i < 6; i++) {
    result += hex[Math.floor(16 * Math.random())];
  }
  return result;
}

function Cloudy() {
  this.classNames = [];
  this.ids = [];
  this.stats = {};
  this.sortedWords = [];
  this.highlightedWords = [];
  this.id = null;
  this.totalWords = 0;
  this.wordsToDisplay = 100;
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

  attachId: function(id) {
    this.id = id;
  },

  setWordsToDisplay: function(num) {
    this.wordsToDisplay = num
  },

  generateWordCloud: function() {
    const id = this.id ? this.id : 'body';
    const parentContainer = $(id);
    const cloudContainer = document.createElement("div");
    cloudContainer.id = "cloudContainer";
    cloudContainer.style = "border-style: solid; border-width: 2px; border-color: black";
    
    const title = document.createElement("h1");
    title.innerHTML = "Your Word Cloud";
    title.style = `text-align: center;`

    cloudContainer.appendChild(title);

    if (this.sortedWords.length === 0) {
      this.calculateWordStatistics();
    }
    
    const wordList = document.createElement("ul");
    wordList.classList.add("wordList");
    const randomWords = shuffle(this.sortedWords.slice(0, this.wordsToDisplay));

    const maxSeen = this.sortedWords[0][1];
    const largestWord = 4;

    const wordsToDisplay = this.sortedWords.length > this.wordsToDisplay ? this.wordsToDisplay : this.sortedWords.length;
    let css = "";
    for (let i = 0; i < wordsToDisplay; i++) {
      const newWord = document.createElement("li");
      const wordLink = document.createElement("a");
      const name = randomWords[i][0];
      const numTimes = randomWords[i][1];

      wordLink.classList.add("wordLink");
      wordLink.id = `wordLink-${i}`;
      wordLink.innerHTML = `${name}: ${numTimes}`;
      wordLink.onclick = () => this.highlightWords(name);

      let size = ((numTimes / maxSeen) * largestWord).toFixed(2);
      size = size >= 1 ? size : 1;
      const color = getRandomColor();
      css += `#wordLink-${i}:hover{ background: ${color}; color: black }`;

      newWord.style = `font-size: ${size}em; color: ${color}`
      newWord.classList.add("word");
      
      newWord.appendChild(wordLink);
      wordList.appendChild(newWord);
    }
    const style = document.createElement("style");
    style.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(style);

    cloudContainer.appendChild(wordList);
    parentContainer.append(cloudContainer);
  },

  replaceWithHighlightedWords: function(selector, word) {
    console.log('selector :>> ', selector);
    const element = $(selector);
    const content = element.html();
    const index = content.indexOf(word);
    if (index >= 0) {
      content = content.substring(0,index) + "<span class='cloudyHighlight'>" + content.substring(index,index+text.length) + "</span>" + content.substring(index + text.length);
      $(selector).html(content);
    }
  },

  highlightWords: function(word) {
    const highlightIndex = this.highlightedWords.indexOf(word);
    if (highlightIndex >= 0) {

    } else {
      this.ids.forEach(id => {
        replaceWithHighlightedWords(id, word);
      });
      this.classNames.forEach(className => {
        this.replaceWithHighlightedWords(className, word);
      })
    }
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

// const wordListStyle = `{ 
//                           list-style: none;
//                           display: flex;
//                           flex-wrap: wrap;
//                           justify-content: center;
//                           max-width: 800px;
//                           margin: auto;
//                         }`
// $(`<style>.wordList ${wordListStyle}</style>`).appendTo('body');
// const wordStyle = `{
//                     padding: 4px;
//                     }` 
// $(`<style>.word ${wordStyle}</style>`).appendTo('body');
// const wordLink = `{
//                     cursor: pointer;
//                   }` 
// $(`<style>.wordLink ${wordLink}</style>`).appendTo('body');
