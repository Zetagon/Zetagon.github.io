/// <reference path = "client-glos.ts" />
/// <reference path = "QuestionHandler.ts" />
/// <reference path = "helper-functions.ts" />
let globals = {
    questionHandler: <QuestionHandler> null //should be a QuestionHandler
}


function init(){
    initializePage(); // Called only once to layout the page
    GetJSONFromServer("words/json.txt")
    nextQuestion();
}

function printArray( inputAry:Array<string> ) {
    let currentQuestion = globals.questionHandler.currentQuestion;
    if(isAnswerDescriptionPair( currentQuestion ) ){
        let answerMarks = [];
        let result = currentQuestion.checkMatchBooleanArray(inputAry);
        for( let i = 0; i < result.length ; i++){
            answerMarks.push(result[i].cleared);
        }
        markAnswers(answerMarks);
        let correctAnswers = [];
        let synonyms = currentQuestion.getSynonyms();
        let unclearedSynonyms = currentQuestion.getUnclearedSynonyms();
        for(let i = 0; i < unclearedSynonyms.length ; i++){
            // TODO: display only synonyms that the user had wrong
            let text = unclearedSynonyms[i].alternatives[0].text;
            correctAnswers.push( text );
        }
        setCorrectionString("Fel! Rätt svar var: " + correctAnswers.toString().replace(/,/g, ", "));

        if(currentQuestion.userHasCleared){
            setCorrectionString("Correct!");
            nextQuestion();
        }
        else{
            focusFirstIncorrectInput()
        }
    }
}

function nextQuestion(){

    globals.questionHandler.new_Question();
    let currentQuestion = globals.questionHandler.currentQuestion;


    if (isAnswerDescriptionPair(currentQuestion) ){
        setInputboxes(currentQuestion.getSynonyms().length); // Generating the inputboxes insert the number of inputboxes required
    }
    else{
        // TODO:
    }
    setCallback(printArray); // Sets the function to be called when the user submit their response this can be reset at any time

    // These are called every new question
    setDescriptions(globals.questionHandler.currentQuestion.descriptionImagePairs); // Sending the array of descriptions for display
}
