// CircleGenerator simple examples
"use strict"; 

const cg = new CircleGenerator()

function examples() {	
	cg.makeCircle()
	cg.makeCircle()
	cg.changeCirclesColor()
	cg.makeCircle()

	console.log("Total Circles made so far:", cg.getTotalCircles())

	// cannot access private variables
	console.log("Private variable:", cg._totalNumberOfCirclesEverCreated) 
	// console.log(cg._incrementCircles()) // can not find this private function
}

examples();
