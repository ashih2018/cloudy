
"use strict";


function examples () {
  const cloudy1 = new Cloudy({
    title: "Word Cloud for Coronavirus Vaccine Analysis",
    id: "#example1",
    selectors: ["#text1"]
  });
  cloudy1.generateWordCloud();
  
  const cloudy2 = new Cloudy();
  cloudy2.title = "Thoughts of Your Future";
  cloudy2.id = "#example2";
  cloudy2.largest = 2;
  const thoughts = ["scared", "work", "work", "family", "family", "scared", "cool", "long", "school", "summer",
                    "work", "family", "excited", "cool", "family", "work",
                    "long", "scary", "california", "life"];
  cloudy2.generateDynamicWordCloud(thoughts);
  
  const cloudy3 = new Cloudy();
  cloudy3.title = "Text Analysis for CSC309 Final Essay"
  cloudy3.id = "#example3";
  cloudy3.selectors.push("#text3");
  cloudy3.updateBannedWords(["the", "a", "of", "this", "and", "of", "to"]);
  cloudy3.generateStats();
  cloudy3.generateSearch();
  
  const cloudy4 = new Cloudy();
  const properties = {
    title: "Word Cloud for Bee Movie Script",
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