
"use strict";

const cloudy = new Cloudy();
cloudy.addSelector(".text");
cloudy.attachId("#cloudyStats");
cloudy.generateWordCloud();
cloudy.generateStats();
