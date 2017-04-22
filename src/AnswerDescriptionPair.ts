/// <reference path="EscapeSplit.ts" />
interface AnswerDescriptionResult{
    cleared:boolean;
    text:string;
}
interface questionAnswerPair
{
    questionType:string;
    descriptionImagePairs:Array<Description>;
//    checkMatch(pInput:string):number;
//    checkMatchAndSplice(pInput:string):boolean;
//    userHasCleared():boolean;
}

interface Alternative{
    text:string;
}
interface Synonym{
    alternatives:Array<Alternative>;
}

interface Description{
   text:string; 
   url:string;
}

class AnswerDescriptionPair implements questionAnswerPair
{
    public questionType = "SynonymAlternative-Description";
    private synonyms:Array<Synonym> = []; 
        getSynonyms(){return this.synonyms; }
        setSynonyms(arg:Array<Synonym>){ this.synonyms = arg; }
    private cleared_synonyms:Array<Synonym> = [];
    public descriptionImagePairs:Array<Description>  = [];
        setDescriptionImagePairs(arg:Array<Description>){ this.descriptionImagePairs = arg; }

    /*;
    * @param rawstring Raw-formatted answerDescriptionpair on the form:"synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 = bild1 [bild1.png] bild2 [bild2.png]"
    *
    */
    constructor(rawString:string)
    {
        if(!rawString){
            return;
        }

        let answerDescription =  rawString.splitEscapedString("=");
        let answers = answerDescription[0].splitEscapedString("&");
        for(let i:number = 0; i < answers.length; i++)
        {
            let x = answers[i].splitEscapedString("|");
            for(let a = 0 ; a < x.length; a ++)
            {
                x[a] = { text: x[a].trim() };// match the structure of the interface Alternative
            }
            this.synonyms.push({ alternatives: x });//match the structure of the interface Synonym
        }
        let y:any = answerDescription[1];
        let imageMatches = y.match(/\[([^\]]*)\]/g);//get image-links ( [image.png] )

        //remove the surrounding square-parentheses
        for(let i = 0; i < imageMatches.length ; i++)
        {
            imageMatches[i] = imageMatches[i].slice(1);
            imageMatches[i] = imageMatches[i].slice(0,-1)
            imageMatches[i] = imageMatches[i].trim();
        }

        //remove the image-links( [image.png] )
        let descriptionMatches = y.replace(/\[([^\]]*)\]/g, '|').splitEscapedString('|');
        descriptionMatches.pop();
        for(let i = 0; i < descriptionMatches.length; i++)
        {
            descriptionMatches[i] = descriptionMatches[i].trim();
        }

        //fill in the images and descriptions
        for(let i = 0; i < descriptionMatches.length; i++){
            this.descriptionImagePairs.push({
                text:descriptionMatches[i],
                url:imageMatches[i]
            });
        }
        //this.descriptionImagePairs[0] = descriptionMatches;
        //this.descriptionImagePairs[1] = imageMatches;
    }

    /*
     * @param pInput input from the user
     *
     * @return the index of the synonym that matched pInput
     *
     * Check if pInput is matching any of the synonyms
     */
    checkMatch(pInput:string):number
    {
        for(let x:number = 0; x < this.synonyms.length ; x++)
        {
            for(let y:number = 0; y < this.synonyms[x].alternatives.length ; y++)
            {
                if(pInput == this.synonyms[x].alternatives[y].text)
                {
                    return x;
                }
            }
        }
        return -1;
    }


    /*
    *
    * @param pInput input from the user
    *
    * @return true if a match was found, false if not
    *
    * call checkMatch and remove the matched synonym
    *
    */
    checkMatchAndSplice(pInput:string):boolean
    {
        let x = this.checkMatch(pInput);
        if(x != -1)
        {
            this.cleared_synonyms.push(this.synonyms.splice(x, 1)[0]);
            return true;
        }
        return false;
    }

    /*
     *
     * @param pInput input from the user
     *
     * @return an array with an object with the following properties:
     *  - text: the input that the user entered
     *  - cleared: whether the input was correct or not
     *
     */
    checkMatchAndSpliceOnArray(pInput:Array<string>):Array<AnswerDescriptionResult>{
        let returnAry = [];
        for(let i = 0; i < pInput.length ; i++){
            if( this.checkMatchAndSplice( pInput[i] ) ){
                let obj = { cleared:true, text:pInput[i] };
                returnAry.push(obj);
            }
            else{
                let obj = { cleared:false, text:pInput[i] };
                returnAry.push(obj);
            }
        }
        return returnAry;
    }

    /*
     * determine wheter user has cleared this AnswerDescriptionPair
     *
     * @return true if user has cleared, false if not 
     *
     */
    userHasCleared():boolean {
        return this.synonyms.length === 0;
    }
}

function create_AnswerDescriptionPair_fromJSON(json:any):AnswerDescriptionPair {
    let descriptionImagePairs = json.descriptions;
    let synonyms = json.synonyms
    let adp = new AnswerDescriptionPair("");
    adp.setDescriptionImagePairs(descriptionImagePairs);
    adp.setSynonyms(synonyms);
    return adp;
}

function isAnswerDescriptionPair( pair:questionAnswerPair ): pair is AnswerDescriptionPair {
    return  pair.questionType ===  "SynonymAlternative-Description" ;
}
