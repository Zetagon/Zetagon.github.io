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
		//document.getElementById("bild").innerHTML = a + i + 'px';
		i++;
	}
}