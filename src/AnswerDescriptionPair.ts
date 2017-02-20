class AnswerDescriptionPair
{
    type:string = "";
	synonyms:Array<Array<string>> = []; //The subarray are the alternatives
    cleared_synonyms:Array<Array<string>> = [];// the words that the user has cleared
	descriptionImagePairs:Array<Array<string>>  = [];//descriptionImagePairs[0] is the description in textform, and descriptionImagePairs[1] is the accompanying image-link

    /*
    * @param rawstring Raw-formatted answerDescriptionpair on the form:"synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 = bild1 [bild1.png] bild2 [bild2.png]"
    *
    */
    constructor(rawString:string)
    {
        let answerDescription =  rawString.split("=");
		let answers = answerDescription[0].split("&");
        for(let i:number = 0; i < answers.length; i++)
        {
            let x = answers[i].split("|");
            for(let a = 0 ; a < x.length; a ++)
            {
                x[a] = x[a].trim();
            }
			this.synonyms.push(x);
        }
		let y:any = answerDescription[1];
		let imageMatches = y.match(/\[([^\]]+)\]/g);//get image-links ( [image.png] )

        //remove the surrounding square-parentheses
        for(let i = 0; i < imageMatches.length ; i++)
        {
            imageMatches[i] = imageMatches[i].slice(1);
            imageMatches[i] = imageMatches[i].slice(0,-1)
            imageMatches[i] = imageMatches[i].trim();
        }

        //remove the image-links( [image.png] )
        let descriptionMatches = y.replace(/\[([^\]]+)\]/g, '|').split('|');
        descriptionMatches.pop();
        for(let i = 0; i < descriptionMatches.length; i++)
        {
            descriptionMatches[i] = descriptionMatches[i].trim();
        }

        //fill in the images and descriptions
        this.descriptionImagePairs = [[]];
        this.descriptionImagePairs[0] = descriptionMatches;
        this.descriptionImagePairs[1] = imageMatches;
        //testing
		for(let hej = 0; hej < this.synonyms.length ; hej++)
		{
			//alert(this.synonyms[hej]);
		}
		for(let hej = 0; hej < this.descriptionImagePairs.length ; hej++)
		{
			//alert(this.descriptionImagePairs[hej]);
		}
    }
    /*
    * @param pInput input from the user
    *
    * @return the index of the synonym that matched pInput
    *
    * Check if pInput is matching any of the synonyms
    */
    checkMatch(pInput:string)
    {
        for(let x:number = 0; x < this.synonyms.length ; x++)
        {
            for(let y:number = 0; y < this.synonyms[x].length ; y++)
            {
                if(pInput == this.synonyms[x][y])
				{
                    //alert("true");
                    //this.cleared_synonyms.push(this.synonyms.splice(x,1)[0]);
                    //return true;
                    return x;
				}
            }
        }
		//alert("false");
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
    checkMatchAndSplice(pInput:string)
    {
        let x = this.checkMatch(pInput);
        if(x != -1)
        {
            this.cleared_synonyms.push(this.synonyms.splice(x, 1)[0]);
            return true;
        }
        return false;
    }

}
