var timer;
function func(n)
{
	var i = 0;
	clearInterval(timer);
	timer = setInterval(test, 1, n);
	
	function test(a)
	{
//		document.getElementById("bild").style.top = a + i + 'px';
//		document.getElementById("bild").style.left = a + i + 'px';
//		document.getElementById("bild").innerHTML = a + i + 'px';
		i++;
		document.getElementById("bild").innerHTML = "f\u00F6\u00E4rra(--- something)"
	}
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
 var wordFiles = new function(){
	 
	var fileone = [];
	var filetwo = [];
	var input;
	var answer;
	var integer;
	var encodeHTML = function(str){
 		var aStr = str.split(''),
     	i = aStr.length,
     	aRet = [];

   		while (--i) {
    		var iC = aStr[i].charCodeAt();
    		if (iC < 65 || iC > 127 || (iC>90 && iC<97)) {
   			   aRet.push('&#'+iC+';');
   			} else {
    			aRet.push(aStr[i]);
   			}
  		}
		return aRet.reverse().join('');
	}
	this.openWordFiles = function(filename){
		$.get(filename + "-1.txt", function(data, status)
		{
			// alert("Data: " + data + "\nStatus: " + status);
			 //document.getElementById("bild").innerHTML = "Data: " + data + "\nStatus: " + status;
			fileone = data.split(/\r\n|\r|\n/g)
			
			alert(fileone);
		},"text")
		$.get(filename + "-2.txt", function(data, status)
		{
			// alert("Data: " + data + "\nStatus: " + status);
			 //document.getElementById("bild").innerHTML = "Data: " + data + "\nStatus: " + status;
			filetwo = data.split(/\r\n|\r|\n/g)
			
			alert(filetwo);
		},"text")
	}
	
	var SaveInput = function(){
		return $("#input").html();
	}
	this.newWord = function(){
		 integer = getRandomArbitrary(0, fileone.length);
		 $("#output").text(fileone[integer]);
		 answer = filetwo[integer];
	};
	var handleInput = function(){
		input = saveInput();
		if(input == answer){
			$("#output").html() = "correct!";
			var index = filetwo.indexOf(answer);
			fileone.splice(index, 1);
			filetwo.splice(index, 1);
			
		}
		else{
			$("#output").html() = "Incorrect! The correct answer was: " + answer;
		}
		newWord();
	}

 };



$(document).ready(function(){
	$("button").click(function(){
		
		$("#restart").text( "start");
		wordFiles.openWordFiles("English_must_words");
		wordFiles.newWord();
		alert("hello")
	})
		
	$("p").click(function()
	{
		wordFiles.openWordFiles("English_must_words");
	})
	
	//add event handling, check if user presses \n save input
	document.addEventListener('keydown', function(event){
		switch(event.keyCode){
			case 13:
				wordFiles.handleInput();
			break;
		}
	})
})