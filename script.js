var timer;
function func(n)
{
	var i = 0;
	clearInterval(timer);
	timer = setInterval(test, 1, n);
	
	function test(a)
	{
		document.getElementById("bild").style.top = a + i + 'px';
		document.getElementById("bild").style.left = a + i + 'px';
		document.getElementById("bild").innerHTML = a + i + 'px';
		i++;
		$("h1").innerHTML = "\u0074"
	}
}

// var wordFiles = {
	String.prototype.toUnicode = function(){
    var result = "";
    for(var i = 0; i < this.length; i++){
        result += "\\u" + ("000" + this[i].charCodeAt(0).toString(16)).substr(-4);
    }
    return result;
	};
	var fileone;
	var filetwo;
	// function getFile(name)
	// {
		$(document).ready(function(){
			$("p").click(function()
			{
				$.get("English_must_words-1.txt", function(data, status)
				{
					// alert("Data: " + data + "\nStatus: " + status);
					 document.getElementById("bild").innerHTML = "Data: " + data.toUnicode() + "\nStatus: " + status;
				},"text")
			})
		})
	// }
// }


