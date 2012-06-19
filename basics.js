var myObject = { text: "test" };
console.log(myObject.text);		// Prints "test"
function myFunction( myObject ) { 
  myObject.text = 2; 
  console.log(myObject.text);
}

myFunction( myObject );
console.log(myObject.text);
