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