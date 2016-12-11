////// <reference path="WordListHandler.ts" />
namespace WordListHandler
{
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
            for (var i = 0; i < wordpairs.length; i++)  // Splitting the wordpairs into induvidual words and saving them to a left and right word-list
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
            output = WordList[0][WordListIndex];
            answer = WordList[1][WordListIndex];
            document.getElementById("phrase").innerHTML = output;

        }
    }
}