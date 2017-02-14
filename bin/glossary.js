////// <reference path="sheets-id.ts" />
var input = "";
var reversed = true;
var output = "";
var answer = "";
var WordList = [];
var Wordlist_Unmodified = [[]];
var WordListIndex;
var userClearFirstTry = true;
var user_entered = [[], []];
var correct_words = [];
var playing = false;
var firstRound = true;
var sheetAry;
function swapWordList() {
    WordList.reverse();
}
window.onload = function LoadMenu() {
    document.title = "English Plus";
    var sheetID = "1PSbyHpSwYwezRiUTRo6lsn4b9O13R_xPjEZ50-ehjEM";
    Spreadsheet.getSheet(sheetID, function (returnAry) {
        sheetAry = returnAry;
        for (var i = 0; i < sheetAry.length; i++) {
            if (sheetAry[i][0]) {
                document.getElementById("left_menu").innerHTML += "<li class = 'navigation_item' onclick = 'callbackSheetAry(\"" + sheetAry[i][0] + "\")'>" + sheetAry[i][0] + "</li>";
            }
        }
    });
    var ListIndex = GetWordListFromServer("Word_List_Index.txt");
    for (var i = 0; i < ListIndex[0].length; i++) {
        var teacherApproved = ListIndex[0][i].match(/\@approved/);
        if (teacherApproved) {
            ListIndex[0][i] = ListIndex[0][i].replace(/\@approved/g, '');
            document.getElementById("left_menu").innerHTML += "<li class = 'navigation_item tooltip' onclick='CallbackFunction(\"" + ListIndex[1][i] + "\")'>" + ListIndex[0][i] + "<span class = 'tooltiptext'>Teacher approved!</span></li>";
        }
        else {
            document.getElementById("left_menu").innerHTML += "<li class = 'navigation_item' onclick='CallbackFunction(\"" + ListIndex[1][i] + "\")'>" + ListIndex[0][i] + "</li>";
        }
    }
};
/**
 * The callbackfunction that is called by html DOM #left_menu .navigation_item which was created with data from spreadsheets
 * Puts the glossary named 'name' into Wordlist_Unmodified and runs Start_Glossary()
 * @param {string} name name of the glossary to use
 *
 */
function callbackSheetAry(name) {
    for (var i = 0; i < sheetAry.length; i++) {
        if (sheetAry[i][0] == name) {
            Wordlist_Unmodified = JSON.parse(JSON.stringify([sheetAry[i], sheetAry[i + 1]]));
            Wordlist_Unmodified[0].splice(0, 1); //delete first row, i.e the names
            Wordlist_Unmodified[1].splice(0, 1); //delete first row, i.e the names
            Start_Glossary();
            return;
        }
    }
}
/**
 * currently not in use
 * Puts the glossary named 'name' into Wordlist_Unmodified and runs Start_Glossary(), but it does a http request every time. It is therefore recommended to use callbackSheetAry instead
 *
 * @param {string} id
 * @param {string} name
 * @deprecated
 */
function CallbackSheets(id, name) {
    Spreadsheet.getWordListFromSheet(id, name, function (ary) {
        ary = JSON.parse(ary).values;
        for (var i = 0; i < ary.length; i++) {
            if (ary[i][0] == name) {
                ary[i].splice(0, 1);
                ary[i + 1].splice(0, 1);
                Wordlist_Unmodified = [ary[i], ary[i + 1]];
            }
        }
        Start_Glossary();
    });
}
function CallbackFunction(filepath) {
    Wordlist_Unmodified = GetWordListFromServer("words/" + filepath);
    Start_Glossary();
}
function ReverseButtonPressed() {
    if (playing) {
        if (reversed == false) {
            reversed = true;
        }
        else {
            reversed = false;
        }
        swapWordList();
        NewWord();
    }
    else {
        if (firstRound == true) {
            HandleInput();
        }
        else {
            document.getElementById("response").innerHTML = "<span style = 'color: Gray;'>Click the button just above that one to restart!</span>";
        }
    }
}
document.getElementById("leosinput").addEventListener("keydown", function (event) {
    switch (event.keyCode) {
        case 13:
            HandleInput();
            break;
    }
});
function GetWordListFromServer(filename) {
    var ListLeft = [];
    var ListRight = [];
    var BothLists;
    var server_file_request;
    if (window.XMLHttpRequest) {
        server_file_request = new XMLHttpRequest();
    }
    else {
        server_file_request = new ActiveXObject("Microsoft.XMLHTTP"); // Detta är för att skräpläsaren Internet explorer också ska fatta ;)
    }
    server_file_request.onreadystatechange = function () {
        if (server_file_request.readyState == 4 && server_file_request.status == 200) {
            var wordfiletext = server_file_request.responseText; // The file is saved to a variable in order to not rely on the XMLHttpRequest anymore
            var wordpairs = wordfiletext.split(/\r\n|\r|\n/g); // Splitting the text by newlines. Many different versions of newline are used to make sure all browsers understand
            for (var i = 0; i < wordpairs.length; i++) {
                var wordpair = wordpairs[i].split("=");
                ListLeft[i] = wordpair[0];
                ListRight[i] = wordpair[1];
            }
            BothLists = [ListLeft, ListRight];
        }
    };
    server_file_request.open("GET", filename, false); // Preparing a GET request for the word-list-file
    server_file_request.send(); // Sending the request
    return BothLists;
}
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min); // värdet kan aldrig anta MAX då Math.random aldrig kan bli ett därför adderars 1
}
function NewWord() {
    function printScore() {
        var outputstring = "";
        if (correct_words == []) {
            document.getElementById("phrase").setAttribute("onclick", "Start_Glossary()");
            document.getElementById("phrase").innerHTML = "⟳";
            document.getElementById("response").innerHTML = "<span style = 'color: Green;'>All Correct!</span><br></br><span style = 'color: gray;'>Congratulations!</span>";
        }
        else {
            if (correct_words.length == 0) {
                percent_correct = 0;
            }
            else {
                var percent_correct = Math.floor((100 * (1 - correct_words.length / Wordlist_Unmodified[0].length)) + 0.5);
            }
            document.getElementById("phrase").setAttribute("onclick", "Start_Glossary()");
            document.getElementById("phrase").innerHTML = "⟳";
            document.getElementById("response").innerHTML = "<span style = 'color: red;'>" + percent_correct + "% correct!</span><br></br><span style = 'color: gray;'>Next time, see if you can get them all right!<br></br>Here are your mistakes.</span>";
            outputstring += "<tbody><tr><th>Correct answer</th><th>Your answers</th></tr>";
            for (var i = 0; i < correct_words.length; i++) {
                var user_funny_typos = "";
                for (var j = 0; j < user_entered[i].length; j++) {
                    if (user_entered[i][j] != "") {
                        if (j + 1 == user_entered[i].length) {
                            user_funny_typos += (user_entered[i][j]);
                        }
                        else {
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
    if (WordList[0].length == 0) {
        playing = false;
        firstRound = false;
        printScore();
    }
    else {
        WordListIndex = getRandomArbitrary(0, (WordList[0].length));
        userClearFirstTry = true;
        output = WordList[0][WordListIndex];
        answer = WordList[1][WordListIndex];
        document.getElementById("phrase").innerHTML = output;
    }
}
function SaveAndClearInput() {
    input = document.getElementById("leosinput").value;
    document.getElementById("leosinput").value = "";
}
function Start_Glossary() {
    playing = true;
    if (firstRound == true) {
        document.getElementById("response").innerHTML = "<span style = 'color: Gray;'>Type your answer above to get started!</span>";
    }
    else {
        document.getElementById("response").innerHTML = "<span style = 'color: Gray;'>You know how this works!</span>";
    }
    document.getElementById("table_of_wrongs").innerHTML = "";
    userClearFirstTry = true;
    user_entered = [[], []];
    correct_words = [];
    WordList = JSON.parse(JSON.stringify(Wordlist_Unmodified));
    document.getElementById("phrase").removeAttribute("onclick");
    if (reversed) {
        swapWordList();
    }
    SaveAndClearInput();
    NewWord();
}
/*
*  @param pInput input from the user
*  @param pInput the correct answer. | are used to indicate pluralis or singularis
*  Ex.
*    pAnswer = "cylinder|s"
*    pInput = "cylinder" and pInput = "cylinders" will return true
*
*  if | is placed att the beginning of pAnswer then it indicates synonyms
*  Ex.
*     pAnswer = "|candy|sweets"
*/
function checkCorrectness(pInput, pAnswer, pAnswerAry) {
    var stam = pAnswer.split(/\|/g);
    pAnswerAry.length = 0; // clear so that pAnswerAry only consist of the possible answers
    pAnswerAry.push(stam[0]);
    if (stam[0] && pInput == stam[0]) {
        return true;
    }
    for (var i = 1; i < stam.length; i++) {
        pAnswerAry.push(stam[0].concat(stam[i]));
        if (stam[0].concat(stam[i]) == pInput) {
            return true;
        }
    }
    return false;
}
function HandleInput() {
    if (playing) {
        SaveAndClearInput();
        var answerAry = [];
        if (checkCorrectness(input, answer, answerAry)) {
            document.getElementById("response").innerHTML = "<span style = 'color: blue;'>Correct!</span>";
            if (userClearFirstTry) {
                WordList[0].splice(WordListIndex, 1);
                WordList[1].splice(WordListIndex, 1);
            }
            NewWord();
        }
        else {
            var exist_here = correct_words.indexOf(answer);
            if (exist_here == -1) {
                correct_words.push(answer);
                user_entered.push([]);
                exist_here = (correct_words.length - 1);
            }
            if (answerAry.length > 1) {
                document.getElementById("response").innerHTML = "<span style = 'color: red;'>Incorrect!</span><br></br><span style = 'color: gray;'>The correct answers are: </span><span style = 'color: blue;'>" + answerAry + "</span>";
            }
            else {
                document.getElementById("response").innerHTML = "<span style = 'color: red;'>Incorrect!</span><br></br><span style = 'color: gray;'>The correct answer is: </span><span style = 'color: blue;'>" + answerAry + "</span>";
            }
            user_entered[exist_here].push(input);
            userClearFirstTry = false;
        }
    }
    else {
        if (firstRound) {
            document.getElementById("response").innerHTML = "<span style = 'color: gray;'>Choose something to practice on the left!</span>";
            document.getElementById("phrase").innerHTML = "<span style = 'color: #00ff00;'>← Left</span>";
            document.getElementById("leosinput").value = "";
        }
        else {
            document.getElementById("leosinput").value = "";
            document.getElementById("response").innerHTML = "<span style = 'color: Gray;'>The fun is over!</span>";
        }
    }
}
/**
 * Namespace for dealing with google spreadsheets
 * @namespace
 */
var Spreadsheet;
/**
 * Namespace for dealing with google spreadsheets
 * @namespace
 */
(function (Spreadsheet) {
    /**
     * Retrieve data from spreadsheet
     *
     * @param {string} id the id of the spreadsheet
     * @param {function} callback Is a callback function. takes a parameter. The parameter is the values returned by the httprequest
     * @memberOf Spreadsheet
     */
    function getSheet(id, callback) {
        var xml = new XMLHttpRequest();
        var range = "A1:Z";
        var url = "https://sheets.googleapis.com/v4/spreadsheets/" + id + "/values/" + range + "?majorDimension=COLUMNS&key=AIzaSyDgNYnXmkRA6ctBDYfiwXdB3lXcwz9rEHQ";
        xml.open("GET", url, true);
        xml.setRequestHeader("Content-type", "application/json");
        xml.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE) {
                var returnAry = JSON.parse(this.responseText).values;
                for (var i = 0; i < returnAry.length; i++) {
                    for (var x = 0; x < returnAry[i].length; x++) {
                        returnAry[i][x] = returnAry[i][x].replace("<script", "Don't put code in my code!");
                    }
                }
                callback(returnAry);
            }
        };
        xml.send();
    }
    Spreadsheet.getSheet = getSheet;
    /**
     * @param {string} id Spreadsheet-id to fetch word-lists from
     * @deprecated
     */
    function getSheetGlossaryNames(id, callback) {
        var returnAry = ["test1", "test2"];
        var xml = new XMLHttpRequest();
        var range = "A1:Z1";
        var url = "https://sheets.googleapis.com/v4/spreadsheets/" + id + "/values/" + range + "?majorDimension=ROWS&key=AIzaSyDgNYnXmkRA6ctBDYfiwXdB3lXcwz9rEHQ";
        //let url = "https://sheets.googleapis.com/v4/spreadsheets/1IJ9_VHEtmQlKoVnT93Y7Dz-uyWShaOH9N2LqFGgHbds?ranges=A1%3AZ&key=AIzaSyDgNYnXmkRA6ctBDYfiwXdB3lXcwz9rEHQ"
        xml.open("GET", url, true);
        xml.setRequestHeader("Content-type", "application/json");
        xml.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE) {
                callback(this.responseText);
            }
        };
        xml.send();
        return returnAry;
    }
    Spreadsheet.getSheetGlossaryNames = getSheetGlossaryNames;
    /**
     *
     *@deprecated
    * @param {string} id
    */
    function putSheetGlossaryNames(id) {
        getSheetGlossaryNames(id, function (ary) {
            var wordNames = JSON.parse(ary).values;
            wordNames = wordNames[0];
            for (var i = 0; i < wordNames.length; i++) {
                if (wordNames[i] == "") {
                    wordNames.splice(i, 1);
                }
            }
            for (var i = 0; i < wordNames.length; i++) {
                var temp = "<li class = 'navigation_item' onclick='CallbackSheets(\"" + id + "\",\"" + wordNames[i] + "\")'>" + wordNames[i] + "</li>";
                document.getElementById("left_menu").innerHTML += temp;
            }
        });
    }
    Spreadsheet.putSheetGlossaryNames = putSheetGlossaryNames;
    /**
     * return a wordlist from a google Spreadsheet
     * @param id Spreadsheet-id
     * @param name the name of the wordlist to get
     * @deprecated
     */
    function getWordListFromSheet(id, name, callback) {
        var returnAry;
        var xml = new XMLHttpRequest();
        var range = "A1:Z";
        var url = "https://sheets.googleapis.com/v4/spreadsheets/" + id + "/values/Sheet1!" + range + "?majorDimension=COLUMNS&key=AIzaSyDgNYnXmkRA6ctBDYfiwXdB3lXcwz9rEHQ";
        //let url = "https://sheets.googleapis.com/v4/spreadsheets/1IJ9_VHEtmQlKoVnT93Y7Dz-uyWShaOH9N2LqFGgHbds?ranges=A1%3AZ&key=AIzaSyDgNYnXmkRA6ctBDYfiwXdB3lXcwz9rEHQ"
        xml.open("GET", url, true);
        xml.setRequestHeader("Content-type", "application/json");
        xml.onreadystatechange = function () {
            if (this.readyState == XMLHttpRequest.DONE) {
                callback(this.responseText);
            }
        };
        xml.send();
        return returnAry;
    }
    Spreadsheet.getWordListFromSheet = getWordListFromSheet;
})(Spreadsheet || (Spreadsheet = {}));
//# sourceMappingURL=glossary.js.map