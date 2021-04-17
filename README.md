# Cloudy.js


## Getting Started
The following scripts are needed for this library.
```
<script defer type="text/javascript" src="/pub/js/cloudy.js"></script>
```
The following CSS file is needed for this library
```
<link rel="stylesheet" href="/pub/css/cloudy.css">
```
You will also need jQuery as an external module.

### Example Usage
```
<!-- Create a Cloudy instance (this can be in another javascript file.) -->
<script>
  const cloudyInstance = new Cloudy({
    id="example",
    selectors=["#sampleText"],
    
  });
</script>

<div id="sampleText">
  This is some sample text to analyze.
</div>
<div id="example"> </div>
```