# Cloudy.js
Link to landing page: https://cloudyjs.herokuapp.com/ <br>
Direct link to documentation: https://cloudyjs.herokuapp.com/api.html


## Getting Started
You can include the following in the <head> of your HTML document.
The following scripts are needed for this library.
```
<script defer type="text/javascript" src="/pub/js/cloudy.js"></script>
```
The following CSS file is needed for this library
```
<link rel="stylesheet" href="/pub/css/cloudy.css">
```
You will also need jQuery as an external module.

## Example Usage
```
<!-- Create a Cloudy instance (this can be in another javascript file.) -->
<script>
  const cloudyInstance = new Cloudy({
    id: "example",
    selectors: ["#sampleText"],
    bannedWords: ["to"],
    wordsToDisplay: 5,
  });
  cloudyInstance.generateWordCloud();
</script>

<div id="sampleText">
  This is some sample text to analyze.
</div>
<div id="example"> </div>
```

## Options
Available global options/properties.
| Property       | Default           | Type                       | Description                                                                                                                                                                                                                                                                                             |
|----------------|-------------------|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| id             | null              | String                     | ID of HTML element to attach word cloud/statistics list to. If not specified, the word cloud/statistics list will be appended to the body.                                                                                                                                                              |
| title          | "Your Word Cloud" | String                     | Title for the generated word cloud/statistics list. Will be displayed as an <h1> tag.                                                                                                                                                                                                                   |
| selectors      | []                | Array<String, HTMLElement> | An array of selectors to analyze for the word cloud/statistics list. This accepts ids and class names of HTML elements as strings (e.g. "#myId" or ".myClass") or DOM elements (e.g. document.getElementById("myId") or $(".myClass"))                                                                  |
| bannedWords    | {}                | Set                        | A set of banned words that is checked when analyzing and generating a word cloud/statistics list. This can be directly updated by setting it to a new set or calling the function updateBannedWords and passing in an array of words. The resulting bannedWords will be equal to the words in this set. |
| wordsToDisplay | 50                | Integer                    | The number of words to display for either the word cloud or the statistics list. The words displayed will be the most frequently used wordsToDisplay words.                                                                                                                                             |
| colors         | []                | Array<String>              | Used only for the word cloud. If colors has at least one valid hex color value (e.g. "#000000", "#1F85DE")  in it, when generating the word cloud, colors will be randomly chosen from this Array to display the words. Otherwise, colors will be generated randomly.                                   |
| largest        | 4                 | Integer                    | Used only for the word cloud. The font size for the largest word in the word cloud. Decrease this value to make the largest word smaller and all other words will be scaled appropriately.                                                                                                              |


## API
`Cloudy(props)` <br>
The constructor accepts an optional object of properties with keys being valid properties for a Cloudy instance. An example of initializing a Cloudy instance is shown above.
#### Parameters: 
- props: An optional object of properties with keys being valid properties for the Cloudy instance.
#### Return Value: None

`generateWordCloud()`<br>
  Generates a word cloud of the most frequent <code>wordsToDisplay</code> by analyzing the text of the selectors.
  The word cloud is created as a list of word links. When a word link in the word cloud is clicked, it will highlight each occurance
  of the word in the selectors and unhighlight these words when clicked again. If multiple words are clicked at once,
  they will be highlighted in different colors. <br>
  This word cloud can be dynamically generated by setting this function to an event handler, such as an onClick
  to generate a word cloud whenever text in a selector is updated. If you want to generate word cloud based on user input,
  refer to the <code>generateDynamicWordCloud</code> function.
  #### Parameters: None
  #### Return Value: None
<br>

`generateDynamicWordCloud(words)` <br>
  Generates a dynamic word cloud with an input and submit button. For any word input by the user, this word cloud will automatically refresh with the updated analysis of the words including the one just input. The word cloud can be customized with any of the customizable options for a word cloud displayed above. <br>
  #### Parameters: 
  - words: Optional argument to prepopulate the dynamic word cloud.
  #### Return Value: None
<br>

`generateStats()` <br>
  Generates a list of statistics of the most frequent <code>wordsToDisplay</code> by analyzing the text of the selectors.
  This will be ordered by most frequently used to least frequently used and display how often the word is used in a percentage
  of number of times used to total number of words in the entirety of the text in the selectors.
  #### Parameters: None
  #### Return Value: None
<br>

`generateSearch()` <br>
  Generates a search feature by providing an input box for the user to search for a word of the text among the selectors.
  Each search will display how many times the word is referenced in the selectors as well as highlight the words in the text.<br>
  #### Parameters: None
  #### Return Value: None
<br>

`updateBannedWords(listOfWords)` <br>
  Updates banned words that will be ommited from text analysis for word cloud or statistics list generation.
  #### Parameters: 
  - listOfWords: An array or a set of words that this Cloudy instance will ban when analyzing for a word cloud or statistics list.
  #### Return Value: None
<br>

`updateProps(listOfWords)` <br>
  Updates the configurable properties for the Cloudy instance as an object.
  Will `console.log` any invalid property values.
  #### Parameters: 
  - Properties: An object with the following optional keys: id, title, selectors, bannedWords, wordsToDisplay, colors, largest. Each key corresponds to one of the configurable properties.
  #### Return Value: None