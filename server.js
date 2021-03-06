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
app.use(express.static(path.join(__dirname, '/pub')))
app.use('/pub/images', express.static(path.join(__dirname, "/pub/images")));

// load css
app.get('/cloudy.css', function(req, res) {
  res.sendFile(path.join(__dirname, "/pub/css/cloudy.css"));
});

app.use('/css', express.static(path.join(__dirname, 'public')))

app.get('/examples.html', (req, res) => {
	res.sendFile(path.join(__dirname, '/pub/examples.html'))
});

app.get('/api.html', (req, res) => {
	res.sendFile(path.join(__dirname, '/pub/api.html'))
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/pub/landing.html'))
})

// Express server listening...
const port = process.env.PORT || 5000
app.listen(port, () => {
	log(`Listening on port ${port}...`)
}) 

