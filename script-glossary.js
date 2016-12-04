var input = "";
var reversed = false;
var output = "";
var answer = "";
var WordList = [];
var Wordlist_Unmodified;
var WordListIndex = [];
var userClearFirstTry = true;
var user_entered = [[], []];
var correct_words = [];
var playing = false;
var firstRound = true;

window.onload = function LoadMenu()
{
	var ListIndex = GetWordListFromServer("Word_List_Index.txt");
	for(i = 0; i < ListIndex[0].length; i++)
	{
		document.getElementById("left_menu").innerHTML += "<li class = 'navigation_item' onclick='CallbackFunction(\"" + ListIndex[1][i] + "\")'>" + ListIndex[0][i] + "</li>";
	}
}

function CallbackFunction(filepath)
{
	WordList_Unmodified = GetWordListFromServer("words/" + filepath);
	Start_Glossary();
}

function ReverseButtonPressed()
{
	if(playing)
	{
		if (reversed == false)
		{
			reversed = true;
		}
		else
		{
			reversed = false;
		}
		NewWord();
	}
	else
	{
		if(firstRound == true)
		{
			HandleInput();
		}
		else
		{
			document.getElementById("response").innerHTML = "<span style = 'color: Gray;'>Click the button just above that one to restart!</span>";
		}
	}
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

function GetWordListFromServer(filename)
{
var ListLeft = [];
var ListRight = [];
var BothLists;
var server_file_request;
if(window.XMLHttpRequest)  // checking if the browser is using the old or the new system for XMLHttpRequests and adapting
{
    server_file_request = new XMLHttpRequest();
}
else
{
    server_file_request = new ActiveXObject("Microsoft.XMLHTTP");  // Detta är för att skräpläsaren Internet explorer också ska fatta ;)
}
server_file_request.onreadystatechange = function()  // This function will run whenever there the state of the XMLHttpRequest updates
{
    if (server_file_request.readyState==4 && server_file_request.status==200)  // When this is the case the response is ready to collect
	{
		var wordfiletext = server_file_request.responseText;  // The file is saved to a variable in order to not rely on the XMLHttpRequest anymore
		var wordpairs = wordfiletext.split(/\r\n|\r|\n/g);  // Splitting the text by newlines. Many different versions of newline are used to make sure all browsers understand
		for (i = 0; i < wordpairs.length; i++)  // Splitting the wordpairs into induvidual words and saving them to a left and right word-list
		{
			var wordpair = wordpairs[i].split("=");
			ListLeft[i]=wordpair[0];
			ListRight[i]=wordpair[1];
		}
		BothLists = [ListLeft, ListRight];
    }
}

server_file_request.open("GET",filename ,false);  // Preparing a GET request for the word-list-file
server_file_request.send();  // Sending the request
return BothLists;
}
function getRandomArbitrary(min, max)
{
    return Math.floor(Math.random() * (max - min) + min);  // värdet kan aldrig anta MAX då Math.random aldrig kan bli ett därför adderars 1
}
function NewWord()
{
	function printScore()
	{
		var outputstring = "";
		if(correct_words == "")
		{
			document.getElementById("phrase").setAttribute("onclick", "Start_Glossary()");
			document.getElementById("phrase").innerHTML = "⟳";
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
			document.getElementById("phrase").innerHTML = "⟳";
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
		if(reversed)
		{
			var left = 0;
			var right = 1;
		}
		else
		{
			var left = 1;
			var right = 0;
		}
		output = WordList[left][WordListIndex];
		answer = WordList[right][WordListIndex];
		document.getElementById("phrase").innerHTML = output;

	}
}
function SaveAndClearInput()
{
	input = document.getElementById("leosinput").value;
	document.getElementById("leosinput").value = "";
}

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
	
	SaveAndClearInput();
	NewWord();
}

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
			document.getElementById("phrase").innerHTML = "<span style = 'color: blue;'>🡰 Left</span>";
			document.getElementById("leosinput").value = "";
		}
		else
		{
			document.getElementById("leosinput").value = "";
			document.getElementById("response").innerHTML = "<span style = 'color: Gray;'>The fun is over!</span>";
		}
	}
}
