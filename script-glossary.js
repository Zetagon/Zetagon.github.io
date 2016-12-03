var input;
var reversed = false;
var output;
var answer;
var WordList;
var WordListIndex;
var userClearFirstTry = true;
var userTypos = new function(){
	// var correct_words = [];
	 var temp1 = []
	 var temp2 = []
	// var user_entered = temp1 + temp2
	this.correct_words =[]
	this.user_entered = [[]]
}
// userTypos.correct_words = []
// userTypos.user_entered = [] + []

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
	WordList = GetWordListFromServer("words/" + filepath);
	NewWord();
}

function ReverseButtonPressed()
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
    return Math.floor(Math.random() * (max + 1 - min) + min);  // värdet kan aldrig anta MAX då Math.random aldrig kan bli ett därför adderars 1
}
function NewWord()
{
	function printScore()
	{
		var table = document.getElementById("table_of_wrongs")
		var outputstring;
		for(var i = 0; i < userTypos.correct_words.lengt; i++)
		{
			var temp = "<tr><td>" +
				userTypos.correct_words[i] + 
				"</td><td>" +
				userTypos.user_entered +
				"</td>";
			outputstring += temp;
		}
		table.innerHTML = outputstring;
	}
	
	if(WordList[0].length === 0)
	{
		printScore()
	}
	else
	{
		WordListIndex = getRandomArbitrary(0, (WordList[0].length -1));
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
function HandleInput()
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
		document.getElementById("response").innerHTML = "<span style = 'color: red;'>Incorrect!</span><br></br><span style = 'color: gray;'>The correct answer is: </span><span style = 'color: blue;'>" + answer + "</span>";
		userTypos.correct_words.push(answer)
		userTypos.user_entered.push([])
		userTypos.user_entered[userTypos.correct_words.length - 1].push(input)
		userClearFirstTry = false;
	}
}