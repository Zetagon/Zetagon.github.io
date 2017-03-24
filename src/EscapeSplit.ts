/*
* similar to String.prototype.split() but skips over escaped characters
*   Ex.
*     "hello\\&hi&goodbye".splitEscapedString("&")
* > ["hello\\&hi", "goodbye"]
*
*  @param char single character long string. 
*  @return an array containing strings
*/
String.prototype.splitEscapedString = function( char:string )
{

    if(char.length > 1)
    {
        throw "Only single character strings are allowed!";
    }

    let foundBackslash:boolean = false;
    let splitIndex:Array<number> = [0];

    for(let i = 0; i < this.length; i++)
    {
        let currentChar = this.charAt(i);

        if(foundBackslash)
        {
            foundBackslash = false;
            continue;
        }
        if(currentChar == "\\")
        {
            foundBackslash = true;
            continue;
        }
        else
        {
            foundBackslash = false;
        }

        if(currentChar == char)
        {
            splitIndex.push(i);
        }
    }

    splitIndex.push(this.length);
    let returnAry:Array<string> = [];
    for(let i = 1; i < splitIndex.length ; i++)
    {
        // The split will leave char at the beginning of some splits, remove them here
        var splitted = this.slice(splitIndex[i - 1], splitIndex[i]);
        if(splitted.charAt(0) == char)
        {
            splitted = splitted.substr(1);
        }
        returnAry.push(splitted);
    }
    return returnAry;
}
