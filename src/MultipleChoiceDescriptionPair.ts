/// <reference path="AnswerDescriptionPair.ts" />
interface Choice{
    correct:boolean;
    text:string;
    url:string;
}
class MultipleChoice_DescriptionPair implements questionAnswerPair 
{
    public questionType = "MultipleChoice-Description";
    private descriptionImagePairs:Array<Description> = [];
        setDescriptionImagePairs(arg:Array<Description>){ this.descriptionImagePairs = arg; }

    private choices:Array<Choice> = [];
        setChoices( arg:Array<Choice> = []){ this.choices = arg};
    
    /*
     * check which of users choices are correct
     * 
     * @param pInput an array with indicies of which alternatives the user chose
     *
     * @return an array with indices over which choices were wrong
     */
    checkNegativeMatch(pInput:Array<number>){
        let returnArray:Array<number> = [];
        for( let choiceIndex = 0; choiceIndex < this.choices.length; choiceIndex++){

            let foundMatch = false
            for( let inputIndex = 0; inputIndex < pInput.length; inputIndex++){
                if( pInput[inputIndex] == choiceIndex){
                    foundMatch = true;
                }
            }
            if( this.choices[choiceIndex].correct ){
                if(!foundMatch){
                    returnArray.push(choiceIndex);
                }
            }
            else{
                if(foundMatch){
                    returnArray.push(choiceIndex);
                }
            }

        }
        return returnArray;
    }
}

function create_MultipleChoice_DescriptionPair_fromJSON(json:any):MultipleChoice_DescriptionPair {
    let descriptionImagePairs = json.descriptions;
    let choices = json.choices;
    let adp = new MultipleChoice_DescriptionPair();
    adp.setDescriptionImagePairs(descriptionImagePairs);
    adp.setChoices(choices);
    return adp;
}
