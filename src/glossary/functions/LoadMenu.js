window.onload = function LoadMenu()
{
	document.title = "English Plus";
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