
"use strict";

const cloudy = new Cloudy();
cloudy.addSelector(".text");
cloudy.attachId("#cloudyStats");
cloudy.updateBannedWords(["the", "a", "of"]);
cloudy.generateWordCloud();
cloudy.generateStats();
