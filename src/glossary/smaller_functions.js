function swapWordList()
{
	WordList.reverse()
}

document.getElementById("leosinput").addEventListener("keydown", function(event)
{
	switch(event.keyCode)
	{
		case 13:
			HandleInput();
		break;
	}
});

function getRandomArbitrary(min, max)
{
    return Math.floor(Math.random() * (max - min) + min);  // värdet kan aldrig anta MAX då Math.random aldrig kan bli ett därför adderars 1
}

function SaveAndClearInput()
{
	input = document.getElementById("leosinput").value;
	document.getElementById("leosinput").value = "";
}
