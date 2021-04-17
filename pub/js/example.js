
"use strict";

const cloudy1 = new Cloudy();
const cloudy2 = new Cloudy();
const cloudy3 = new Cloudy();
const cloudy4 = new Cloudy();

function examples () {
  cloudy1.title = "Word Cloud for Coronavirus Vaccine Analysis"
  cloudy1.id = "#example1";
  cloudy1.selectors.push("#text1");
  // cloudy1.generateWordCloud();
  
  cloudy2.title = "Thoughts of Your Future"
  cloudy2.id = "#example2";
  cloudy2.largest = 2;
  const thoughts = ["scared", "work", "work", "family", "family", "scared", "cool", "long", "school", "summer",
                    "work", "family", "excited", "cool", "family", "work",
                    "long", "scary", "california", "life"]
  cloudy2.generateDynamicWordCloud(thoughts);
  
  cloudy3.title = "Text Analysis for CSC309 Final Essay"
  cloudy3.id = "#example3";
  cloudy3.selectors.push("#text3");
  cloudy3.updateBannedWords(["the", "a", "of", "this","and", "of", "to"]);
  cloudy3.generateStats();
  
  cloudy4.title = "Word Cloud for Bee Movie Script"
  const properties = {
    id: "#example4",
    selectors: [".beeTitle", "#beeginning", $("#dialogue")],
    bannedWords: ["the", "a", "of", "this", "and", "of", "to", "it"],
    wordsToDisplay: 20,
    colors: ["#f9c901", "#000000", "#f6e000", "#FFB101", "#985b10", "#6b4701", "#896800"]
  }
  cloudy4.updateProps(properties);
  cloudy4.generateWordCloud();
}

examples()