function NewWord()
{
	function printScore()
	{
		var outputstring = "";
		if(correct_words == "")
		{
			document.getElementById("phrase").setAttribute("onclick", "Start_Glossary()");
			document.getElementById("phrase").innerHTML = "?";
			document.getElementById("response").innerHTML = "<span style = 'color: Green;'>All Correct!</span><br></br><span style = 'color: gray;'>Congratulations!</span>";
		}
		else
		{
			if (correct_words.length == "")
			{
				percent_correct = 0;
			}
			else
			{
				var percent_correct = Math.floor((100*(1 - correct_words.length/WordList_Unmodified[0].length)) + 0.5);
			}
			document.getElementById("phrase").setAttribute("onclick", "Start_Glossary()");
			document.getElementById("phrase").innerHTML = "?";
			document.getElementById("response").innerHTML = "<span style = 'color: red;'>" + percent_correct + "% correct!</span><br></br><span style = 'color: gray;'>Next time, see if you can get them all right!<br></br>Here are your mistakes.</span>";
			
			outputstring += "<tbody><tr><th>Correct answer</th><th>Your answers</th></tr>"
			for(var i = 0; i < correct_words.length; i++)
			{
				var user_funny_typos = "";
				for(var j = 0; j < user_entered[i].length; j++)
				{
					if (user_entered[i][j] != "")
					{
						if(j + 1 == user_entered[i].length)
						{
							user_funny_typos += (user_entered[i][j]);
						}
						else
						{
							user_funny_typos += (user_entered[i][j] + ", ");
						}
					}
				}
				var temp = "<tr><td>" + correct_words[i] + "</td><td>" + user_funny_typos + "</td></tr>";
				outputstring += temp;
			}
			outputstring += "</tbody>";
			document.getElementById("table_of_wrongs").innerHTML = outputstring;	
		}

	}

	if(WordList[0].length == 0)
	{
		playing = false;
		firstRound = false;
		printScore();
	}
	else
	{
		WordListIndex = getRandomArbitrary(0, (WordList[0].length));
		userClearFirstTry = true
		output = WordList[0][WordListIndex];
		answer = WordList[1][WordListIndex];
		document.getElementById("phrase").innerHTML = output;

	}
}