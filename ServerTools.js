//////////////////////////////////////////////////////////////////////////
// Node.js Exports
var ServerTools = exports;

// Note: If we were defining a class, it would be better served to do this
//
/* 
	var globalNamespace = {};
	(function (exports) {												// Inline function with an arugument
		exports.getNewInstance = function( ..constructor arguments.. ) {
			newInstance= new MyClass( ..constructor arguments.. );
			return newInstance;
		};
	}(typeof exports === 'object' && exports || globalNamespace)); 		// pass exports into the function if its an object, otherwise use the global namespace
*/

var createServer = require("http").createServer;
var readFile = require("fs").readFile;
var sys = require("sys");
var url = require("url");

// Our map of request handlers
var requestHandlers = {};


// Create a server using the built in HTTP and declare our response to client requests
var server = createServer(function (request, response) {
	// Handle GET requests
	if( request.method === "GET" ) {
		// Grab the request handler from our map
		var handler = requestHandlers[url.parse(request.url).pathname] || notFound;

		// Give the response a function to respond to the request with a JSON object
		response.respondJSON = function (code, obj) {
			var body = new Buffer(JSON.stringify(obj));
			response.writeHead(code, { "Content-Type": "text/json",
									   "Content-Length": body.length
			});
			response.end(body);
		};

		handler(request, response);
	} // handle GET requests
}); // end createServer()


// Listen for requests on a given port
ServerTools.listen = function( port, host ) {
	server.listen( port, host );
	console.log("Server at http://" + (host || "localhost") + ":" + port.toString() + "/");
} // end listen()


// Create a response handler for a static file
ServerTools.createFileHandler = function( filename ) {
	var body, headers;
	var content_type = "text/html";
	console.log( "Creating handler for file: " + filename );
	
	function loadResponseData(response) {
		// If we've already loaded this file, get out
		if ( body && headers ) {
			response();
			return;
		}
		
		// Read the file from disk asynchronously 
		readFile(filename, function ( error, data ) {
			if ( error ) {
				console.log("Error loading " + filename);
			} else {
				body = data;
				
				headers = { "Content-Type": content_type,
							"Content-Length": body.length
			};
				
			console.log( "static file " + filename + " loaded" );
			response();	
			}
		});
	}

	return function (req, res) {
		loadResponseData(function () {
			res.writeHead(200, headers);
			res.end(body);
		});
	}
} // end createFileHandler()


// Add a request handler to our map
ServerTools.addRequestHandler = function( path, handler ) {
	requestHandlers[path] = handler;
}; // end addRequestHandler()


// Construct a not found response
function notFound(req, res) {
	var notFoundString = "Not Found\n";
	
	res.writeHead(404, { "Content-Type": "text/plain", 
						 "Content-Length": notFoundString.length
	});
	
	res.end(notFoundString);
} // end notFound()


// Get the extension of a file
function extname (path) {
	var index = path.lastIndexOf(".");
	return index < 0 ? "" : path.substring(index);
}