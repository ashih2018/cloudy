
"use strict";

const cloudy1 = new Cloudy();
cloudy1.title = "Word Cloud for Coronavirus Vaccine Analysis"
cloudy1.id = "#example1";
cloudy1.selectors.push("#text1");
cloudy1.generateWordCloud();

const cloudy2 = new Cloudy();
cloudy2.title = "Thoughts of Your Future"
cloudy2.id = "#example2";
cloudy2.largest = 2;
const thoughts = ["scared", "work", "work", "family", "family", "scared", "cool", "long", "school", "summer",
                  "work", "family", "excited", "cool", "family", "work",
                  "long", "scary", "california", "life"]
cloudy2.generateDynamicWordCloud(thoughts);

const cloudy3 = new Cloudy();
cloudy3.title = "Text Analysis for CSC309 Final Essay"
cloudy3.id = "#example3";
cloudy3.selectors.push("#text3");
cloudy3.updateBannedWords(["the", "a", "of", "this","and", "of", "to"]);
cloudy3.generateStats();


const cloudy4 = new Cloudy();
cloudy4.title = "Word Cloud for Bee Movie Script"
cloudy4.id = "#example4";
cloudy4.selectors.push(...[".beeTitle", "#beeginning", $("#dialogue")]);
cloudy4.updateBannedWords(["the", "a", "of", "this", "and", "of", "to", "it"]);
cloudy4.wordsToDisplay = 20;
cloudy4.colors.push(...["#f9c901", "#000000", "#f6e000", "#FFB101", "#985b10", "#6b4701", "#896800"]);
cloudy4.generateWordCloud();

