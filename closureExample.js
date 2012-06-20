function counter() {
    var count = 0;
	
    function increment( value ) {
        count += value;
        console.log( count );
    }
    return increment;
}

var counter1 = counter(),
    counter2 = counter();
	
counter1(1);    // Prints '1'
counter1(7);    // Prints '7'
counter2(1);    // Prints '1'
counter1(1);    // Prints '9'