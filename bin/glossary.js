/*
* similar to String.prototype.split() but skips over escaped characters
*   Ex.
*     "hello\\&hi&goodbye".splitEscapedString("&")
* > ["hello\\&hi", "goodbye"]
*
*  @param char single character long string.
*  @return an array containing strings
*/
String.prototype.splitEscapedString = function (char) {
    if (char.length > 1) {
        throw "Only single character strings are allowed!";
    }
    var foundBackslash = false;
    var splitIndex = [0];
    for (var i = 0; i < this.length; i++) {
        var currentChar = this.charAt(i);
        if (foundBackslash) {
            foundBackslash = false;
            continue;
        }
        if (currentChar == "\\") {
            foundBackslash = true;
            continue;
        }
        else {
            foundBackslash = false;
        }
        if (currentChar == char) {
            splitIndex.push(i);
        }
    }
    splitIndex.push(this.length);
    var returnAry = [];
    for (var i = 1; i < splitIndex.length; i++) {
        // The split will leave char at the beginning of some splits, remove them here
        var splitted = this.slice(splitIndex[i - 1], splitIndex[i]);
        if (splitted.charAt(0) == char) {
            splitted = splitted.substr(1);
        }
        returnAry.push(splitted);
    }
    return returnAry;
};
/// <reference path="EscapeSplit.ts" />
var AnswerDescriptionPair = (function () {
    /*;
    * @param rawstring Raw-formatted answerDescriptionpair on the form:"synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 = bild1 [bild1.png] bild2 [bild2.png]"
    *
    */
    function AnswerDescriptionPair(rawString) {
        this.questionType = "SynonymAlternative-Description";
        this.synonyms = [];
        this.cleared_synonyms = [];
        this.descriptionImagePairs = [];
        if (!rawString) {
            return;
        }
        var answerDescription = rawString.splitEscapedString("=");
        var answers = answerDescription[0].splitEscapedString("&");
        for (var i = 0; i < answers.length; i++) {
            var x = answers[i].splitEscapedString("|");
            for (var a = 0; a < x.length; a++) {
                x[a] = { text: x[a].trim() }; // match the structure of the interface Alternative
            }
            this.synonyms.push({ alternatives: x }); //match the structure of the interface Synonym
        }
        var y = answerDescription[1];
        var imageMatches = y.match(/\[([^\]]*)\]/g); //get image-links ( [image.png] )
        //remove the surrounding square-parentheses
        for (var i = 0; i < imageMatches.length; i++) {
            imageMatches[i] = imageMatches[i].slice(1);
            imageMatches[i] = imageMatches[i].slice(0, -1);
            imageMatches[i] = imageMatches[i].trim();
        }
        //remove the image-links( [image.png] )
        var descriptionMatches = y.replace(/\[([^\]]*)\]/g, '|').splitEscapedString('|');
        descriptionMatches.pop();
        for (var i = 0; i < descriptionMatches.length; i++) {
            descriptionMatches[i] = descriptionMatches[i].trim();
        }
        //fill in the images and descriptions
        for (var i = 0; i < descriptionMatches.length; i++) {
            this.descriptionImagePairs.push({
                text: descriptionMatches[i],
                url: imageMatches[i]
            });
        }
        //this.descriptionImagePairs[0] = descriptionMatches;
        //this.descriptionImagePairs[1] = imageMatches;
    }
    AnswerDescriptionPair.prototype.getSynonyms = function () { return this.synonyms; };
    AnswerDescriptionPair.prototype.setSynonyms = function (arg) { this.synonyms = arg; };
    AnswerDescriptionPair.prototype.setDescriptionImagePairs = function (arg) { this.descriptionImagePairs = arg; };
    /*
     * @param pInput input from the user
     *
     * @return the index of the synonym that matched pInput
     *
     * Check if pInput is matching any of the synonyms
     */
    AnswerDescriptionPair.prototype.checkMatch = function (pInput) {
        for (var x = 0; x < this.synonyms.length; x++) {
            for (var y = 0; y < this.synonyms[x].alternatives.length; y++) {
                if (pInput == this.synonyms[x].alternatives[y].text) {
                    return x;
                }
            }
        }
        return -1;
    };
    /*
    *
    * @param pInput input from the user
    *
    * @return true if a match was found, false if not
    *
    * call checkMatch and remove the matched synonym
    *
    */
    AnswerDescriptionPair.prototype.checkMatchAndSplice = function (pInput) {
        var x = this.checkMatch(pInput);
        if (x != -1) {
            this.cleared_synonyms.push(this.synonyms.splice(x, 1)[0]);
            return true;
        }
        return false;
    };
    /*
     *
     * @param pInput input from the user
     *
     * @return an array with an object with the following properties:
     *  - text: the input that the user entered
     *  - cleared: whether the input was correct or not
     *
     */
    AnswerDescriptionPair.prototype.checkMatchAndSpliceOnArray = function (pInput) {
        var returnAry = [];
        for (var i = 0; i < pInput.length; i++) {
            if (this.checkMatchAndSplice(pInput[i])) {
                var obj = { cleared: true, text: pInput[i] };
                returnAry.push(obj);
            }
            else {
                var obj = { cleared: false, text: pInput[i] };
                returnAry.push(obj);
            }
        }
        return returnAry;
    };
    /*
     * determine wheter user has cleared this AnswerDescriptionPair
     *
     * @return true if user has cleared, false if not
     *
     */
    AnswerDescriptionPair.prototype.userHasCleared = function () {
        return this.synonyms.length === 0;
    };
    return AnswerDescriptionPair;
}());
function create_AnswerDescriptionPair_fromJSON(json) {
    var descriptionImagePairs = json.descriptions;
    var synonyms = json.synonyms;
    var adp = new AnswerDescriptionPair("");
    adp.setDescriptionImagePairs(descriptionImagePairs);
    adp.setSynonyms(synonyms);
    return adp;
}
function isAnswerDescriptionPair(pair) {
    return pair.questionType === "SynonymAlternative-Description";
}
/// <reference path="AnswerDescriptionPair.ts" />
var MultipleChoice_DescriptionPair = (function () {
    function MultipleChoice_DescriptionPair() {
        this.questionType = "MultipleChoice-Description";
        this.descriptionImagePairs = [];
        this.choices = [];
    }
    MultipleChoice_DescriptionPair.prototype.setDescriptionImagePairs = function (arg) { this.descriptionImagePairs = arg; };
    MultipleChoice_DescriptionPair.prototype.setChoices = function (arg) {
        if (arg === void 0) { arg = []; }
        this.choices = arg;
    };
    ;
    /*
     * check which of users choices are correct
     *
     * @param pInput an array with indicies of which alternatives the user chose
     *
     * @return an array with indices over which choices were wrong
     */
    MultipleChoice_DescriptionPair.prototype.checkNegativeMatch = function (pInput) {
        var returnArray = [];
        for (var choiceIndex = 0; choiceIndex < this.choices.length; choiceIndex++) {
            var foundMatch = false;
            for (var inputIndex = 0; inputIndex < pInput.length; inputIndex++) {
                if (pInput[inputIndex] == choiceIndex) {
                    foundMatch = true;
                }
            }
            if (this.choices[choiceIndex].correct) {
                if (!foundMatch) {
                    returnArray.push(choiceIndex);
                }
            }
            else {
                if (foundMatch) {
                    returnArray.push(choiceIndex);
                }
            }
        }
        return returnArray;
    };
    return MultipleChoice_DescriptionPair;
}());
function create_MultipleChoice_DescriptionPair_fromJSON(json) {
    var descriptionImagePairs = json.descriptions;
    var choices = json.choices;
    var adp = new MultipleChoice_DescriptionPair();
    adp.setDescriptionImagePairs(descriptionImagePairs);
    adp.setChoices(choices);
    return adp;
}
function isMultipleChoice_DescriptionPair(pair) {
    return pair.questionType === "MultipleChoice-Description";
}
/// <reference path="AnswerDescriptionPair.ts"/>
var QuestionHandler = (function () {
    function QuestionHandler(json) {
        this.questions = [];
        this.clearedQuestions = [];
        this.currentQuestionIndex = 0;
        if (!json) {
            return;
        }
        for (var i = 0, len = json.length; i < len; i++) {
            if (json[i].question_type == "MultipleChoice-Description") {
                this.questions.push(create_MultipleChoice_DescriptionPair_fromJSON(json[i]));
            }
            else if (json[i].question_type == "SynonymAlternative-Description") {
                this.questions.push(create_AnswerDescriptionPair_fromJSON(json[i]));
            }
        }
        this.currentQuestionIndex = 0;
        this.currentQuestion = this.questions[0];
    }
    QuestionHandler.prototype.setQuestions = function (arg) { this.questions = arg; };
    QuestionHandler.prototype.new_Question = function () {
        if (isAnswerDescriptionPair(this.currentQuestion)) {
            if (this.currentQuestion.userHasCleared()) {
                this.clearedQuestions.push(this.questions.splice(this.currentQuestionIndex, 1)[0]);
            }
        }
        this.currentQuestionIndex = getRandomArbitrary(0, this.questions.length);
        this.currentQuestion = this.questions[this.currentQuestionIndex];
    };
    QuestionHandler.prototype.handleInput = function (userInput) {
        //        if( this.currentQuestion.questionType != "SynonymAlternative-Description"){
        //            throw new Error("Question-type Error! This question is not of type 'SynonymAlternative-Description'");
        //        }
        if (isAnswerDescriptionPair(this.currentQuestion)) {
            if (this.currentQuestion.checkMatchAndSplice(userInput)) {
                if (this.currentQuestion.userHasCleared()) {
                }
                return "Correct!";
            }
            else {
                var returnString = "";
                if (this.currentQuestion.getSynonyms.length > 1) {
                    returnString = "Wrong! The correct answers were ";
                }
                var synonyms = this.currentQuestion.getSynonyms();
                for (var i = 0, len = synonyms.length; i < len; i++) {
                    returnString += synonyms[i].alternatives[0].text;
                    if (i < len - 1) {
                        returnString += ", ";
                    }
                }
                return returnString;
            }
        }
        else if (isMultipleChoice_DescriptionPair(this.currentQuestion)) {
        }
    };
    return QuestionHandler;
}());
function createQuestionHandlerFromRawText(texts) {
    var questionHandler = new QuestionHandler(null);
    var questions = [];
    for (var i = 0, len = texts.length; i < len; i++) {
        questions.push(new AnswerDescriptionPair(texts[i]));
    }
    questionHandler.setQuestions(questions);
    return questionHandler;
}
var isInit = false;
var callback;
function initializePage() {
    if (!isInit) {
        var container = document.getElementsByClassName("container")[0];
        var descriptionContainer = document.createElement("div");
        descriptionContainer.className = "description-container";
        var correctionBox = document.createElement("div");
        correctionBox.className = "correction-container";
        var inputContainer = document.createElement("div");
        inputContainer.className = "input-container";
        container.appendChild(descriptionContainer);
        container.appendChild(inputContainer);
        container.appendChild(correctionBox);
    }
}
function setDescriptions(descriptions) {
    var container = document.getElementsByClassName("description-container")[0];
    while (container.lastChild) {
        container.removeChild(container.lastChild);
    }
    for (var i = 0; i < descriptions.length; i++) {
        var box = document.createElement("div");
        box.className = "description-box";
        if (descriptions[i].text != "") {
            var text = document.createElement("div");
            text.className = "description-text";
            var textNode = document.createTextNode(descriptions[i].text);
            text.appendChild(textNode);
            box.appendChild(text);
        }
        if (descriptions[i].url != "") {
            var image = document.createElement("div");
            image.className = "description-image";
            image.style.backgroundImage = "url(" + descriptions[i].url + ")";
            box.appendChild(image);
        }
        container.appendChild(box);
    }
}
function setInputboxes(numberOfBoxes) {
    var container = document.getElementsByClassName("input-container")[0];
    while (container.lastChild) {
        container.removeChild(container.lastChild);
    }
    var flexContainer = document.createElement("div");
    flexContainer.className = "input-flex-container";
    for (var i = 0; i < numberOfBoxes; i++) {
        var wrapper = document.createElement("div");
        wrapper.className = "input-box";
        var input = document.createElement("input");
        input.className = "the-input";
        input.addEventListener("keypress", function (event) { handleInputKeypress(event); });
        input.addEventListener("input", function (event) { handleInput(event); });
        input.addEventListener("focus", function (event) { addInputFocus(event); });
        input.addEventListener("blur", function (event) { removeInputFocus(event); });
        input.tabIndex = "1";
        wrapper.appendChild(input);
        flexContainer.appendChild(wrapper);
    }
    var submit = document.createElement("div");
    submit.className = "submit-button";
    submit.tabIndex = "1";
    submit.addEventListener("click", function () { handleSubmit(); });
    submit.addEventListener("focus", function (event) { addSubmitFocus(event); });
    submit.addEventListener("blur", function (event) { removeSubmitFocus(event); });
    submit.addEventListener("keypress", function (event) { handleSubmitKeypress(event); });
    submitText = document.createTextNode("Click here or press enter to submit");
    submit.appendChild(submitText);
    container.appendChild(flexContainer);
    container.appendChild(submit);
}
function setCorrectionString(correctionMessage) {
    var container = document.getElementsByClassName("correction-container")[0];
    while (container.lastChild) {
        container.removeChild(container.lastChild);
    }
    if (correctionMessage != "") {
        var box = document.createElement("div");
        var text = document.createElement("div");
        text.className = "error-text";
        var textNode = document.createTextNode(correctionMessage);
        text.appendChild(textNode);
        box.appendChild(text);
        container.appendChild(box);
    }
}
function handleSubmitKeypress(event) {
    if (event.keyCode == 13) {
        handleSubmit();
    }
}
function handleInputKeypress(event) {
    if (event.keyCode == 13) {
        var element = event.target.parentElement;
        var wrappers = document.getElementsByClassName("input-flex-container")[0].children;
        var nextIndex = 0;
        while (wrappers[nextIndex] != element) {
            nextIndex++;
        }
        nextIndex++;
        while (nextIndex < wrappers.length && wrappers[nextIndex].classList.contains("correct-answer")) {
            nextIndex++;
        }
        if (nextIndex == wrappers.length) {
            handleSubmit();
        }
        else {
            wrappers[nextIndex].lastChild.focus();
        }
    }
}
function addInputFocus(event) {
    event.target.parentElement.classList.add("focus-answer");
}
function removeInputFocus(event) {
    event.target.parentElement.classList.remove("focus-answer");
}
function addSubmitFocus(event) {
    event.target.classList.add("focus-answer");
}
function removeSubmitFocus(event) {
    event.target.classList.remove("focus-answer");
}
function handleInput(event) {
    event.target.parentElement.classList.remove("incorrect-answer");
    event.target.parentElement.classList.remove("correct-answer");
    event.target.tabIndex = "1";
}
function handleSubmit() {
    var elements = document.getElementsByClassName("input-flex-container")[0].children;
    var answers = [];
    for (var i = 0; i < elements.length; i++) {
        answers.push(elements[i].lastChild.value);
    }
    callback(answers);
}
function setCallback(Callback) {
    callback = Callback;
}
function markAnswers(correctArray) {
    var elements = document.getElementsByClassName("input-flex-container")[0].children;
    if (elements.length != correctArray.length) {
        return console.log("Incorrect array length sent to markAnswers");
    }
    for (var i = 0; i < correctArray.length; i++) {
        if (correctArray[i]) {
            elements[i].classList.remove("incorrect-answer");
            elements[i].classList.add("correct-answer");
            elements[i].lastChild.tabIndex = "-1";
        }
        else {
            elements[i].classList.remove("correct-answer");
            elements[i].classList.add("incorrect-answer");
        }
    }
}
function focusFirstIncorrectInput() {
    document.getElementsByClassName("incorrect-answer")[0].lastChild.focus();
}
/// <reference path = "client-glos.ts" />
/// <reference path = "QuestionHandler.ts" />
var globals = {
    questionHandler: null //should be a QuestionHandler
};
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min); // värdet kan aldrig anta MAX då Math.random aldrig kan bli ett därför adderars 1
}
function GetJSONFromServer(filename) {
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
            var isInJsonFormat = true;
            try {
                var json = JSON.parse(wordfiletext);
            }
            catch (e) {
                isInJsonFormat = false;
            }
            if (isInJsonFormat) {
                var json = JSON.parse(wordfiletext);
                globals.questionHandler = new QuestionHandler(json.answerDescriptionPairs);
                globals.questionHandler.new_Question();
            }
            else {
                var wordpairs = wordfiletext.split(/\r\n|\r|\n/g); // Splitting the text by newlines. Many different versions of newline are used to make sure all browsers understand
                globals.questionHandler = createQuestionHandlerFromRawText(wordpairs);
                globals.questionHandler.new_Question();
            }
        }
    };
    server_file_request.open("GET", filename, false); // Preparing a GET request for the word-list-file
    server_file_request.send(); // Sending the request
    return BothLists;
}
function init() {
    initializePage(); // Called only once to layout the page
    GetJSONFromServer("words/json.txt");
    nextQuestion();
}
function nextQuestion() {
    globals.questionHandler.new_Question();
    var currentQuestion = globals.questionHandler.currentQuestion;
    // Tutorial begin here!
    function printArray(inputAry) {
        var currentQuestion = globals.questionHandler.currentQuestion;
        if (isAnswerDescriptionPair(currentQuestion)) {
            var answerMarks = [];
            var result = currentQuestion.checkMatchAndSpliceOnArray(inputAry);
            for (var i = 0; i < result.length; i++) {
                answerMarks.push(result[i].cleared);
            }
            markAnswers(answerMarks);
            var correctAnswers = [];
            var synonyms = currentQuestion.getSynonyms();
            for (var i = 0; i < synonyms.length; i++) {
                correctAnswers.push(synonyms[i].alternatives[0].text);
            }
            setCorrectionString("Fel! Rätt svar var: " + correctAnswers.toString().replace(/,/g, ", ")); // Setting the correction string as a demonstration
            if (currentQuestion.userHasCleared()) {
                nextQuestion();
                setCorrectionString("Correct!");
            }
            else {
                setInputboxes(currentQuestion.getSynonyms().length); // Generating the inputboxes insert the number of inputboxes required
            }
        }
        // Do whatever, maybe check if the answers are correct
    }
    if (isAnswerDescriptionPair(currentQuestion)) {
        setInputboxes(currentQuestion.getSynonyms().length); // Generating the inputboxes insert the number of inputboxes required
    }
    else {
    }
    setCallback(printArray); // Sets the function to be called when the user submit their response this can be reset at any time
    // These are called every new question
    setDescriptions(globals.questionHandler.currentQuestion.descriptionImagePairs); // Sending the array of descriptions for display
    setCorrectionString(""); // Maybe clear the correction on new question Setting a new strinf will however replace the current text
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