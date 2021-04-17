/* JS Library */
"use strict"; // always need a semicolon before an IIFE

/* 
Wrap the code that creates your library in an Immediately-Invoked function expression (IIFE).
This allows you to do any setup necessary in this function scope and then only put on the
the global scope the variables needed for developers to access.  Prevents pollution of the 
global scope and conflicts with variables from other libraries, and gives some control over functionality access.
*/

// We use parameters to create *local* variables in the function, which are faster to lookup than globals, for performance.
// We can also name them something else - like `global` for the window object.
(function(global, document, $) { 

	// this function is currently only in the scope of the anonymous function at the moment.
	function CircleGenerator() {
		this.circles = [];
	}

	/* Private properties and functions */
	// unless we attach these to the global window object, they cannot be accessed directly.
	// they will only be in the closure of this function, and can be accessed only the places we use them (such as in the functions of the CircleGenerator prototype)
		// (see examples.js for what we can and cannot access)
	let _totalNumberOfCirclesEverCreated = 0
	function _incrementTotalCircles() {
		_totalNumberOfCirclesEverCreated++;
	}
	/* End of private properties/functions */

	CircleGenerator.prototype = {

		makeCircle: function() {
			const circle = document.createElement('div')
			circle.style = 'width: 60px; height: 60px; border-radius: 50%; margin: 10px; background-color: Aqua;'
			const body = $('body') // using jQuery local variable
			body.append(circle)
			this.circles.push(circle)

			_incrementTotalCircles() // calling the private function
		},

		changeCirclesColor: function() {
			for (let i = 0; i < this.circles.length; i++) {
				this.circles[i].style.backgroundColor = 'darkmagenta'
			}
		},

		// public function that provides data of private properties
		getTotalCircles: function() { return _totalNumberOfCirclesEverCreated } 
	}

	/* Can do all other library setup below without conflicting with the global namespace */
	// ...
	// ...

	// After setup:
	// Add the CircleGenerator to the window object if it doesn't already exist.
	global.CircleGenerator = global.CircleGenerator || CircleGenerator

})// pass the global window object and jquery to the anonymous function. They will now be locally scoped inside of the function.


