
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

(function(global, document, $) {
  function Cloudy(id, title) {
    this.id = id;
    this.title = title || "Your Word Cloud";
    this.selectors = [];
    this.bannedWords = new Set();
    this.wordsToDisplay = 50;
    this.colors = [];
    this.largest = 4;
  }

  // private variables
  let _color = 1;
  let _colorMap = {};
  let _sortedWords = [];
  let _highlightedWords = [];
  let _stats = {};
  let _dynamicWords = {};
  let _totalWords = 0;

  Cloudy.prototype = {

    _generateColor: function() {
      /*
      * Private method that returns a random color in this.colors
      * or a random color if this.colors is empty.
      */
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
      /*
      * Private method that returns a DOM element for the selector if it is not already a DOM element.
      * Otherwise, return the DOM element itself.
      */
      if (typeof selector == Object && (selector instanceof Element || selector instanceof HTMLElement|| selector instanceof HTMLDocument)) {
        return selector;
      } else {
        return $(selector);
      }
    },

    _generateWordLink: function(word, maxSeen, largestWord) {
      /*
      * Private method that creates a word link in a word cloud and returns it as a DOM element
      * and dynamic CSS values for highlighting to attach to the body.
      * Parameters:
      * word - word to generate word link for
      * maxSeen - the number of times this word has been seen.
      * largestWord - the maximum times a word has been seen. Used for scaling the size of this word link.
      */
      const newWord = document.createElement("li");
      const wordLink = document.createElement("a");
      const name = word[0];
      const numTimes = word[1];

      wordLink.classList.add("cloudyWordLink");
      wordLink.id = `cloudyWordLink-${name}`;
      wordLink.innerHTML = `${name}: ${numTimes}`;
      wordLink.onclick = () => this._highlightWords(name);

      let size = ((numTimes / maxSeen) * largestWord).toFixed(2);
      size = size >= 1 ? size : 1;

      const color = this._generateColor();
      // these lines of css needs to be inline as it is dynamic
      const css = `#cloudyWordLink-${name}:hover{ background: ${color}; color: black }`;
      newWord.style = `font-size: ${size}em; color: ${color}`
      newWord.classList.add("cloudyWord");
      
      newWord.appendChild(wordLink);
      return [newWord, css];
    },

    _generateWordList: function(words) {
      /*
      * Private method that generates the list of word links for the word cloud and
      * returns it as a DOM element.
      * Parameters:
      * words - list of strings to generate a word list for
      */
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
        const result = this._generateWordLink(currWord, maxSeen, this.largest);
        css += result[1];
        wordList.appendChild(result[0]);
      }
      const style = document.createElement("style");
      style.appendChild(document.createTextNode(css));
      document.getElementsByTagName("head")[0].appendChild(style);

      return wordList;
    },

    _autoupdateWords: function(newWord) {
      /*
      * Private method that generates updates the list of words in the word cloud for
      * dynamic word clouds with the word passed in as a parameter.
      */
      const strippedWord = newWord.toLowerCase().replace(/[^A-Z0-9]+/ig, "");
      if (strippedWord.length === 0) {
        return;
      }
      if (this.bannedWords.has(strippedWord.toLowerCase())) {
        return;
      }
      if (!(strippedWord in _dynamicWords)) {
        _dynamicWords[strippedWord] = 0;
      }
      _dynamicWords[strippedWord]++;
      _totalWords++;

      const allWords = [];
      for (let currWord in _dynamicWords) {
        allWords.push([currWord, _dynamicWords[currWord]])
      }

      return allWords;
    },

    _highlightWords: function(word) {
      /*
      * onClick method set to a word link. 
      * Searches selectors for this word cloud and highlights the clicked word within
      * the text of the selectors if not already highlighted. Otherwise, the currently
      * highlighted words are unhighlighted.
      */
      const highlightIndex = _highlightedWords.indexOf(word);
      if (highlightIndex >= 0) {
        this.selectors.forEach(selector => {
          this._removeHighlightedWords(selector, word);
        })
        _highlightedWords.splice(highlightIndex, 1);
      } else {
        this.selectors.forEach(selector => {
          this._replaceWithHighlightedWords(selector, word);
        })
        _highlightedWords.push(word);
        _color = (_color + 1) % 10;
      }
    },

    _replaceWithHighlightedWords: function(selector, word) {
      const elements = this._convertToDom(selector);
      const currColor = _color;
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
      _colorMap[word] = currColor;
    },

    _calculateWordStatistics: function() {
      const statistics = {};
      console.log('this.selectors :>> ', this.selectors);
      this.selectors.forEach(selector => {
        console.log('selector :>> ', selector);
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
          _totalWords++;
        })
        
      });
      _stats = statistics;
      
      const sortedWords = [];
      for (let word in statistics) {
        sortedWords.push([word, statistics[word]])
      }

      sortedWords.sort(function(a, b) {
        return b[1] - a[1];
      });

      _sortedWords = sortedWords;
    },

    _removeHighlightedWords: function(selector, word) {
      const elements = this._convertToDom(selector);
      const numWords = _stats[word];
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
      const currColor = _colorMap[word];
      delete _colorMap[word];
      $(`#cloudyWordLink-${word}`).removeClass(`cloudyHighlight${currColor} defaultText`);
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
      
      const submit = document.createElement("input");
      submit.type = "submit";
      $(submit).attr("id", "cloudyInputBox");
      submit.classList.add("cloudySubmit");
      cloudContainer.appendChild(submit);
      submit.onclick = () => {
        const allWords = this._autoupdateWords(inputBox.value, cloudContainer);
        const wordList = this._generateWordList(allWords);
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
          results = this._autoupdateWords(w, cloudContainer, true);
        });
        if (results.length > 0) {
          wordList = this._generateWordList(results);
        }
      }
      
      cloudContainer.appendChild(wordList);
      parentContainer.append(cloudContainer);
    },

    generateWordCloud: function() {
      const id = this.id ? this.id : 'body';
      console.log('id :>> ', id);
      const parentContainer = $(id);
      const cloudContainer = document.createElement("div");
      $(cloudContainer).attr("id", "cloudContainer");
      
      const title = document.createElement("h1");
      title.innerHTML = this.title;
      $(title).attr("id", "cloudTitle");
      cloudContainer.appendChild(title);


      this._calculateWordStatistics();

      const wordList = this._generateWordList(_sortedWords.slice(0, this.wordsToDisplay));

      cloudContainer.appendChild(wordList);
      parentContainer.append(cloudContainer);
    },

    updateBannedWords: function (listOfWords) {
      /*
      * Updates banned words 
      */ 
      this.bannedWords = new Set();
      listOfWords.forEach(word => {
        this.bannedWords.add(word.toLowerCase());
      });
    },

    generateStats: function() {
      const id = this.id ? this.id : 'body';
      let parentContainer;
      parentContainer = $(id);
      const statsContainer = document.createElement("div");
      statsContainer.id = "cloudyStatsContainer";

      this._calculateWordStatistics();

      const maxLength = this.wordsToDisplay < _sortedWords.length ? this.wordsToDisplay : _sortedWords.length;
      const title = document.createElement("h1");
      title.innerHTML = `Top ${maxLength} Words Found`;
      statsContainer.appendChild(title);

      const wordList = document.createElement("ul");
      wordList.id = "cloudyStatsList";
      
      for (let i = 0; i < maxLength; i++) {
        const newWord = document.createElement("li");
        const name = _sortedWords[i][0];
        const count = _sortedWords[i][1];
        const freq = (_sortedWords[i][1] * 100/ _totalWords).toFixed(2);
        newWord.innerHTML = `${name}: ${count} (${freq}%)`;
        wordList.appendChild(newWord);
      }
      statsContainer.appendChild(wordList);
      
      parentContainer.append(statsContainer);
    },

    updateSelectors: function(selectors) {
      this.selectors = selectors;
    }
  }

  global.Cloudy = global.Cloudy || Cloudy;

})(window, window.document, $); 
