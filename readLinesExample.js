var fs = require('fs');										// "include" the file system module

function readLines(inputReadStream, printLine) {			// Declare our function to print out the lines of a file
	var remaining = '';
	inputReadStream.on('data', function(data) {				// We got some data from the file!
		remaining += data;									// Grab the entire file into a single line
		var index = remaining.indexOf('\n');				// Find the index of the first newline
		while (index > -1) {								// While there's a newline still coming
			var line = remaining.substring(0, index);			// Grab up until the newline and print it
			remaining = remaining.substring(index + 1);			// Throw out the line we just grabbed, start after the newline
			printLine(line);									// Print the line we grabbed
			index = remaining.indexOf('\n');					// Find the next newline
		}
	});
	inputReadStream.on('end', function() {
		if (remaining.length > 0) { printLine(remaining); }
	});
}

function printLine(data) {
  console.log('Line: ' + data);
}

var inputReadStream = fs.createReadStream('lines.txt');
readLines(inputReadStream, printLine);
