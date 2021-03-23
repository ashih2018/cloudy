/* server.js, with mongodb API */
'use strict';
const log = console.log
const path = require('path')

const express = require('express')
// starting the express server
const app = express();

/* Webpage routes below 
* Only allow specific parts of our pub directory to be access, rather than giving
* access to the entire directory.
*/


// static js directory
app.use("/js", express.static(path.join(__dirname, '/pub/js')));

app.use('/pub', express.static(__dirname + "/pub"));

// load css
app.get('/cloudy.css', function(req, res) {
  res.sendFile(__dirname + "/pub/cloudy.css");
});

// route for root
app.get('/examples', (req, res) => {
	res.sendFile(path.join(__dirname, '/pub/examples.html'))
});

app.get('/', (req, res) => {
	res.send('<h1>Root Route for cloudy.js!</h1>')
})

// Express server listening...
const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 

