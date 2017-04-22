/// <reference path = "client-glos.ts" />
/// <reference path = "QuestionHandler.ts" />
let globals = {
    questionHandler: <QuestionHandler> null //should be a QuestionHandler
}

function getRandomArbitrary(min:number, max:number) {
    return Math.floor(Math.random() * (max - min) + min);  // värdet kan aldrig anta MAX då Math.random aldrig kan bli ett därför adderars 1
}

function GetJSONFromServer(filename:string) {
    var ListLeft:Array<string> = [];
    var ListRight:Array<string> = [];
    var BothLists:Array<Array<string>>;
    var server_file_request:XMLHttpRequest;
    if(window.XMLHttpRequest) {// checking if the browser is using the old or the new system for XMLHttpRequests and adapting

        server_file_request = new XMLHttpRequest();
    }
    else {
        server_file_request = new ActiveXObject("Microsoft.XMLHTTP");  // Detta är för att skräpläsaren Internet explorer också ska fatta ;)
    }
    server_file_request.onreadystatechange = function(){  // This function will run whenever there the state of the XMLHttpRequest updates

        if (server_file_request.readyState==4 && server_file_request.status==200){  // When this is the case the response is ready to collect
            var wordfiletext = server_file_request.responseText;  // The file is saved to a variable in order to not rely on the XMLHttpRequest anymore
            let isInJsonFormat = true
            try{// determine if text is in jsonformat
                var json = JSON.parse(wordfiletext);
                //if(!json.answerDescriptionPairs){ // check if json is in the correct format
                    //isInJsonFormat = false;
                //}
            }
            catch(e){
                isInJsonFormat = false;
            }
            if(isInJsonFormat){
                var json = JSON.parse(wordfiletext);
                globals.questionHandler = new QuestionHandler(json.answerDescriptionPairs);
                globals.questionHandler.new_Question();
                alert(globals.questionHandler);
            }else{
                var wordpairs:Array<string> = wordfiletext.split(/\r\n|\r|\n/g);  // Splitting the text by newlines. Many different versions of newline are used to make sure all browsers understand
                globals.questionHandler =  createQuestionHandlerFromRawText(wordpairs);
                globals.questionHandler.new_Question();
                alert(globals.questionHandler);
            }
        }
    }

    server_file_request.open("GET",filename ,false);  // Preparing a GET request for the word-list-file
    server_file_request.send();  // Sending the request
    return BothLists;
}

function init(){
    initializePage(); // Called only once to layout the page

    GetJSONFromServer("words/json.txt")
    globals.questionHandler.new_Question();

    // Tutorial begin here!
    function printArray( inputAry:Array<string> ) {

        let currentQuestion = globals.questionHandler.currentQuestion;
        if(isAnswerDescriptionPair( currentQuestion ) ){
            // TODO: Make the textboxes become red or green
            let answerMarks = [];
            let result = currentQuestion.checkMatchAndSpliceOnArray(inputAry);
            for( let i = 0; i < result.length ; i++){
                answerMarks.push(result[i].cleared);
            }
            markAnswers(answerMarks);
            let correctAnswers = [];
            let synonyms = currentQuestion.getSynonyms();
            for(let i = 0; i < synonyms.length ; i++){
                correctAnswers.push( synonyms[i].alternatives[0].text );
            }
            setCorrectionString("Du svarade: " + correctAnswers.toString().replace(/,/g, ", ")); // Setting the correction string as a demonstration

        }

        // Do whatever, maybe check if the answers are correct
    }

    setCallback(printArray); // Sets the function to be called when the user submit their response this can be reset at any time

    // These are called every new question
    setDescriptions(globals.questionHandler.currentQuestion.descriptionImagePairs); // Sending the array of descriptions for display
    setInputboxes(2); // Generating the inputboxes insert the number of inputboxes required
    setCorrectionString(""); // Maybe clear the correction on new question Setting a new strinf will however replace the current text
}
