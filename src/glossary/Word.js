/**
*<p>A class representing the alternatives for a synonym</p>
*It's a helper class for {@link Word}
*@class
*@author Leo Okawa Ericson <leo.ericson@yahoo.se>
*/
class Alternatives
{
	/**
	*@param alternativeWords {array} an array of words
	*@author Leo Okawa Ericson <leo.ericson@yahoo.se>
	*/
	constructor(alternativeWords)
	{
		this.alt = alternativeWords;
	}
	
	/**Return true if one alternative matches string
	*@param string to be matched with 
	*@author Leo Okawa Ericson <leo.ericson@yahoo.se>
	*/
	checkAll(string)
	{
		for(var i = 0; i < this.alt.length; i++)
		{
			if(this.alt[i] === string)
				return true;
		}
		return false;
	}
}

/**
*represents a word
*@author Leo Okawa Ericson <leo.ericson@yahoo.se>
*@class
*/
class Word 
{
	constructor(inputString)
	{
		/**
		*raw string that this {@link Word} was created from
		*@member {string} rawString
		*@memberof Word
		*@inner
		*@author Leo Okawa Ericson <leo.ericson@yahoo.se>
		*/
		this.rawString = inputString;
		this.synonyms = []//array of Alternatives
		
	}
}