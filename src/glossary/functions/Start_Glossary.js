function Start_Glossary()
{
	playing = true;
	if(firstRound == true)
	{
		document.getElementById("response").innerHTML = "<span style = 'color: Gray;'>Type your answer above to get started!</span>";
	}
	else
	{
		document.getElementById("response").innerHTML = "<span style = 'color: Gray;'>You know how this works!</span>";
	}
	document.getElementById("table_of_wrongs").innerHTML = "";
	userClearFirstTry = true;
	user_entered = [[], []];
	correct_words = [];
	WordList = JSON.parse(JSON.stringify(WordList_Unmodified));
	document.getElementById("phrase").removeAttribute("onclick");
	if(reversed)
	{
		swapWordList()
	}
		
	
	SaveAndClearInput();
	NewWord();
}