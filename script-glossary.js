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
    return Math.floor(Math.random() * (max - min) + min);
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
			 alert("Data: " + data + "\nStatus: " + status);
			 //document.getElementById("bild").innerHTML = "Data: " + data + "\nStatus: " + status;
			fileone = data.split(/\r\n|\r|\n/g)
			
			
		},"text")
		$.get(filename + "-2.txt", function(data, status)
		{
			// alert("Data: " + data + "\nStatus: " + status);
			 //document.getElementById("bild").innerHTML = "Data: " + data + "\nStatus: " + status;
			filetwo = data.split(/\r\n|\r|\n/g)

		},"text")
	}
	
	var SaveInput = function(){
		input =  document.getElementById("input").value;
		$("#input").val("")
	}
	this.newWord = function(){
		 integer = getRandomArbitrary(0, fileone.length);
		 $("#output").text(fileone[integer]);
		 answer = filetwo[integer];
	};
	this.handleInput = function(){
		SaveInput();
		if(input == answer){
			$("#error").text( "correct!");
			var index = filetwo.indexOf(answer);
			fileone.splice(index, 1);
			filetwo.splice(index, 1);
			
		}
		else{
			$("#error").text( "Incorrect! The correct answer was:" + answer + ", you typed: " + input);
		}
		this.newWord();
	}

 };



$(document).ready(function(){
	
	$.get("words/words.filepath", function(data, status){
		var ary = data.split(/\r\n|\r|\n/g)
		for( element in ary){
			jQuery("<p class = \"button\" id = "+ary[element] + ">" + ary[element] + "</p>").appendTo("#menu")
			alert(ary[element])
		}
		setTimeout(function(){
		$(".button").click(function(){
			var identity = $(this).attr('id')
			var path = "words/"
			wordFiles.openWordFiles(path + identity)
			setTimeout(function(){
				wordFiles.newWord()	
			},100)
		})
		},100)
	})
	// $("button").click(function(){
		
		// $("#restart").text( "restart");
		// wordFiles.openWordFiles("English_must_words");
		// setTimeout(function(){
			// wordFiles.newWord();
		// }, 300)
		
	// })
		
	
	//add event handling, check if user presses \n save input
	document.addEventListener('keydown', function(event){
		switch(event.keyCode){
			case 13://enter
				wordFiles.handleInput();
			break;
		}
	})
	
	
	
	
	
})
