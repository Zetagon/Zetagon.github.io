/// <reference path="AnswerDescriptionPair.ts"/>


class QuestionHandler
{
    public questions:Array<questionAnswerPair> = [];
        public setQuestions(arg:Array<questionAnswerPair>){ this.questions = arg;}
    private clearedQuestions:Array<questionAnswerPair> = [];
    private currentQuestionIndex:number = 0;
    public currentQuestion:questionAnswerPair;

    constructor(json:Array<any>){
        if(!json){
            return;
        }
        for (var i = 0, len = json.length; i < len; i++) {
            if( json[i].question_type == "MultipleChoice-Description"){
                this.questions.push(create_MultipleChoice_DescriptionPair_fromJSON(json[i]));
            }
            else if( json[i].question_type == "SynonymAlternative-Description"){
                this.questions.push(create_AnswerDescriptionPair_fromJSON(json[i]));
            }
        }
    }

    new_Question(){
        this.currentQuestionIndex = getRandomArbitrary(0, this.questions.length);
        this.currentQuestion = this.questions[this.currentQuestionIndex] ;
    }
    handleInput(userInput:string):string{
//        if( this.currentQuestion.questionType != "SynonymAlternative-Description"){
//            throw new Error("Question-type Error! This question is not of type 'SynonymAlternative-Description'");
//        }
        if( isAnswerDescriptionPair(this.currentQuestion) ){
        
            if(this.currentQuestion.checkMatchAndSplice( userInput )){
                if( this.currentQuestion.userHasCleared()){
                }
                return "Correct!";
            }
            else{
                let returnString = "";
                if(this.currentQuestion.getSynonyms.length > 1){
                    returnString = "Wrong! The correct answers were ";
                }
                let synonyms = this.currentQuestion.getSynonyms();
                for (var i = 0, len = synonyms.length; i < len; i++) {
                    returnString += synonyms[i].alternatives[0].text;
                    if(i < len - 1){// this statement is here to avoid trailing commas in returnString
                        returnString += ", ";
                    }
                }
                return returnString;
            }
        }
        else if( isMultipleChoice_DescriptionPair( this.currentQuestion ) ){
            //todo: handle MultipleChoice
        }
    }
}

function createQuestionHandlerFromRawText(texts:Array<string>){
    let questionHandler = new QuestionHandler(null); 
    let questions = [];
    for (var i = 0, len = texts.length; i < len; i++) {
        questions.push( new AnswerDescriptionPair( texts[i] ) );
    }
    questionHandler.setQuestions( questions );
    return questionHandler;
}
