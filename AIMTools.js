//////////////////////////////////////////////////////////////////////////
// Node.js Exports
var AIMTools = exports;

var oscar = require('oscar');
var authInfo = require("./AuthInfo");

AIMTools.aim = {};

AIMTools.defaultResponse = "Umm, what?";
AIMTools.keyAndResponseMap = {};

AIMTools.connect = function( screenName, password ) {
	// Our AIM struct
	AIMTools.aim = new oscar.OscarConnection({
		connection: {
			username: screenName,
			password: password
		}
	});
	
	// Connect to AIM
	AIMTools.aim.connect(function(err) {
		if (err) {
			console.log('AIM connection error: ' + err);
		} else {
			console.log('Connected to AIM!');
			AIMTools.aim.getOfflineMsgs();
		}
	});
	
	// Handle IM events
	AIMTools.aim.on('im', function(text, sender, flags, when) {
		if( sender.name.indexOf("izotopesnackbot") != -1 ) {
			console.log( "Got an AIM message from ourselves" );
			return;
		} else if( sender.name.indexOf("AOL System Msg") != -1 ) {
			console.log( "We're signed into AIM in multiple places" );
			AIMTools.aim.sendIM( sender.name, "1" );
			return;
		}
				
		var hasResponded = false;
		for ( var iterator in AIMTools.keyAndResponseMap ) {
			if( text.toLowerCase().indexOf( iterator.toLowerCase() ) != -1 ) {				
				// Respond to the IM
				AIMTools.aim.sendIM( sender.name, AIMTools.keyAndResponseMap[iterator].response );
				
				// If a callback exists, call it
				if( typeof(AIMTools.keyAndResponseMap[iterator].callback) != "undefined" ) {
					AIMTools.keyAndResponseMap[iterator].callback(sender.name, text);
				}
				
				hasResponded = true;
			}
		} // end for each object
		
		if( !hasResponded ) { AIMTools.aim.sendIM( sender.name, AIMTools.defaultResponse ); }
	}); // end on IM
} // end connect()


// Adds a response when the given key is found in an IM
AIMTools.addKeyResponse = function( key, response, callback ) {
	var keyResponse = {
		key: key,
		response: response,
		callback: callback
	}
		
	AIMTools.keyAndResponseMap[key] = keyResponse;
} // end addKeyResponse()


// Changes the default response of the bot
AIMTools.setDefaultResponse = function( response ) { 
	AIMTools.defaultResponse = response;
} // end setDefaultResponse()


// Send a message to someone
AIMTools.sendMessage = function( recipient, message ) {
	AIMTools.aim.sendIM( recipient, message );
} // end sendMessage()