HOST = null; // localhost
PORT = 5325;

var oscar = require("oscar");
var ServerTools = require("./ServerTools");
var AIMTools = require("./AIMTools");
var authInfo = require("./AuthInfo");

// Our map of people who want snack time notifications
var snackers = new Array();

// Start the server on the process specified port if it exists, fall back on PORT
var port = Number(process.env.PORT || PORT);
ServerTools.listen(port, HOST);

// Create a file handler for index.html, so clients can receive it
ServerTools.addRequestHandler("/", ServerTools.createFileHandler("index.html"));

// Connect to aim
AIMTools.connect( authInfo.screenName, authInfo.password );

// Change the default response (response when there is no recognized command)
AIMTools.setDefaultResponse( "That's no command of mine, aren't you hungry?" );

AIMTools.addKeyResponse( "add me", "Okay, adding you", function(sender, text) {
	addSnacker( sender );
});

AIMTools.addKeyResponse( "trigger snacks", "THE TIME IS UPON US", function( sender, text ) {
	triggerSnacks( sender );
});


// Adds a snacker to the list of people who want to be notified of snacks
function addSnacker( screenName ) {
	snackers.push( screenName );
	console.log( "We have " + snackers.length + " snackers now" );
} // end addSnacker()


// Notify the snackers that their time has come
function triggerSnacks( triggeredBy ) {
	for( var iSnacker=0; iSnacker<snackers.length; ++iSnacker ) {
		AIMTools.sendMessage( snackers[iSnacker], "SNACKS! Triggered by " + triggeredBy );
	}
} // end triggerSnacks()