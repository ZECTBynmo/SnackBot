HOST = null; // localhost
PORT = 5325;

//----------------------------------------------------------------------------------------------------
//	Requires
//----------------------------------------------------------------------------------------------------		
var oscar = require("./oscar/oscar");
var ServerTools = require("./ServerTools");
var AIMTools = require("./AIMTools");

// use try/catch on our auth info require
try {
	var authInfo = require("./AuthInfo");
} catch( err ) {
	// If we don't have the module, look for environment variables
	var authInfo = {
		screenName: process.env.AIM_SCREEN,
		password: process.env.AIM_PASS
	}
}

console.log( authInfo.screenName );
console.log( authInfo.password );

//----------------------------------------------------------------------------------------------------
//	File scope variables
//----------------------------------------------------------------------------------------------------		
var snackers = new Array();						// Our array of people who want snack time notifications
var port = Number(process.env.PORT || PORT);	// Start the server on the process specified port if it 
												// exists, otherwise fall back on PORT


//----------------------------------------------------------------------------------------------------
//	Server
//----------------------------------------------------------------------------------------------------											
ServerTools.listen(port, HOST);

// Create a file handler for index.html, so clients can receive it
ServerTools.addRequestHandler("/", ServerTools.createFileHandler("index.html"));
ServerTools.addRequestHandler("/jquery-1.7.1.min.js", ServerTools.createFileHandler("jquery-1.7.1.min.js"));

// Respond to the client requesting the current list of snackers
ServerTools.addRequestHandler("/getSnackers", function(request, response) {
	response.respondJSON(200, {
		snackers: snackers
	});
});


//----------------------------------------------------------------------------------------------------
//	AIM
//----------------------------------------------------------------------------------------------------	
// Connect to aim
AIMTools.connect( authInfo.screenName, authInfo.password );

// Change the default response (response when there is no recognized command)
AIMTools.setDefaultResponse( "That's no command of mine, aren't you hungry?" );

AIMTools.addKeyResponse( "add me", "Okay, adding you", function(sender, text) {
	addSnacker( sender );
});

AIMTools.addKeyResponse( "trigger snacks", "THE TIME IS UPON US", function(sender, text) {	
	triggerSnacks( sender );
});

// Adds a snacker to the list of people who want to be notified of snacks
function addSnacker( screenName ) {
	var isSnackerInList = false;

	// Look through our list of snackers and make sure we don't have this screen name already
	for( iSnacker=0; iSnacker<snackers.length; ++iSnacker ) {
		if( snackers[iSnacker].name == screenName ) {
			isSnackerInList = true;
			break;
		}
	} // end for each snacker
	
	if( !isSnackerInList ) {
		var newSnacker = { name: screenName }
		snackers.push( screenName );
		console.log( screenName + " wants snacks. We have " + snackers.length + " snackers now" );
	} else {
		console.log( screenName + " was already in the list of snackers" );
		AIMTools.sendMessage( screenName, "You're already on the list, don't make me take you off..." );
	}
} // end addSnacker()

// Notify the snackers that their time has come
function triggerSnacks( triggeredBy ) {
	for( var iSnacker=0; iSnacker<snackers.length; ++iSnacker ) {
		AIMTools.sendMessage( snackers[iSnacker].name, "SNACKS! Triggered by " + triggeredBy );
	}
} // end triggerSnacks()