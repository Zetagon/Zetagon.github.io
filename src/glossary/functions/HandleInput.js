function HandleInput()
{
	if(playing)
	{
			SaveAndClearInput();
			if (input == answer)
			{
				document.getElementById("response").innerHTML = "<span style = 'color: blue;'>Correct!</span>"
				if(userClearFirstTry)
				{
					WordList[0].splice(WordListIndex,1)
					WordList[1].splice(WordListIndex,1)
				}
				NewWord();
			}
			else
			{
				var exist_here = correct_words.indexOf(answer);
				if(exist_here == -1)
				{
					correct_words.push(answer);
					user_entered.push([]);
					exist_here = (correct_words.length - 1)
				}		
				document.getElementById("response").innerHTML = "<span style = 'color: red;'>Incorrect!</span><br></br><span style = 'color: gray;'>The correct answer is: </span><span style = 'color: blue;'>" + answer + "</span>";
				user_entered[exist_here].push(input);
				userClearFirstTry = false;
			}
	}
	else
	{
		if(firstRound)
		{
			document.getElementById("response").innerHTML = "<span style = 'color: gray;'>Choose something to practice on the left!</span>";
			document.getElementById("phrase").innerHTML = "<span style = 'color: #00ff00;'>? Left</span>";
			document.getElementById("leosinput").value = "";
		}
		else
		{
			document.getElementById("leosinput").value = "";
			document.getElementById("response").innerHTML = "<span style = 'color: Gray;'>The fun is over!</span>";
		}
	}
}