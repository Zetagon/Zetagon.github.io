/**
 * Namespace for dealing with google spreadsheets
 * @namespace
 */
namespace Spreadsheet{
    /**
     * Retrieve data from spreadsheet
     * 
     * @param {string} id the id of the spreadsheet
     * @param {function} callback Is a callback function. takes a parameter. The parameter is the values returned by the httprequest 
     * @memberOf Spreadsheet
     */
    export function getSheet(id:string, callback:any)
    {
        let xml = new XMLHttpRequest();
        let range = "A1:Z"
        let url = "https://sheets.googleapis.com/v4/spreadsheets/" + id +"/values/" +range+ "?majorDimension=COLUMNS&key=AIzaSyDgNYnXmkRA6ctBDYfiwXdB3lXcwz9rEHQ"
        xml.open("GET", url, true)
        xml.setRequestHeader("Content-type", "application/json");
        xml.onreadystatechange= function(){
            if(this.readyState == XMLHttpRequest.DONE)
            {
		let returnAry = JSON.parse(this.responseText).values;
		for(let i = 0; i < returnAry.length; i++)
		{
			for(let x = 0; x < returnAry[i].length; x++)
			{
				returnAry[i][x] = returnAry[i][x].replace("<script", "Don't put code in my code!"); 
			}
		}
                callback(returnAry);
            }
        }
        xml.send()
    }
    /**
     * @param {string} id Spreadsheet-id to fetch word-lists from
     * @deprecated
     */
    export function getSheetGlossaryNames(id:string, callback:any):Array<string>
    {
        let returnAry:Array<string> = ["test1", "test2"];
        let xml = new XMLHttpRequest();
        let range= "A1:Z1";
        let url = "https://sheets.googleapis.com/v4/spreadsheets/" + id +"/values/" +range+ "?majorDimension=ROWS&key=AIzaSyDgNYnXmkRA6ctBDYfiwXdB3lXcwz9rEHQ";
        //let url = "https://sheets.googleapis.com/v4/spreadsheets/1IJ9_VHEtmQlKoVnT93Y7Dz-uyWShaOH9N2LqFGgHbds?ranges=A1%3AZ&key=AIzaSyDgNYnXmkRA6ctBDYfiwXdB3lXcwz9rEHQ"
        xml.open("GET", url, true);
        xml.setRequestHeader("Content-type", "application/json");
        xml.onreadystatechange = function(){
            if(this.readyState == XMLHttpRequest.DONE)
            {
            callback(this.responseText)
            }
        }
        xml.send();
        return returnAry;
    }

    /**
     * 
     *@deprecated 
    * @param {string} id
    */
    export function putSheetGlossaryNames(id:string)
    {
    getSheetGlossaryNames(id, function(ary:any){
            
            
            let wordNames  = JSON.parse(ary).values;
            wordNames = wordNames[0]
            for(let i = 0; i < wordNames.length; i++)
            {
                if(wordNames[i] == "")
                {
                    wordNames.splice(i,1);
                }	
            }
            
            for(let i = 0; i < wordNames.length ; i++)
            {
                let temp =  "<li class = 'navigation_item' onclick='CallbackSheets(\"" + id + "\",\"" + wordNames[i] + "\")'>" + wordNames[i] + "</li>"
                document.getElementById("left_menu").innerHTML +=temp;
            }
            
            
        }); 
    }

    /**
     * return a wordlist from a google Spreadsheet
     * @param id Spreadsheet-id
     * @param name the name of the wordlist to get
     * @deprecated
     */
    export function getWordListFromSheet(id:string , name:string, callback:any):Array<Array<string>>
    {
    let returnAry:Array<Array<string>>;
    let xml = new XMLHttpRequest();
        let range= "A1:Z";
        let url = "https://sheets.googleapis.com/v4/spreadsheets/" + id +"/values/Sheet1!" +range+ "?majorDimension=COLUMNS&key=AIzaSyDgNYnXmkRA6ctBDYfiwXdB3lXcwz9rEHQ";
        //let url = "https://sheets.googleapis.com/v4/spreadsheets/1IJ9_VHEtmQlKoVnT93Y7Dz-uyWShaOH9N2LqFGgHbds?ranges=A1%3AZ&key=AIzaSyDgNYnXmkRA6ctBDYfiwXdB3lXcwz9rEHQ"
        xml.open("GET", url, true);
        xml.setRequestHeader("Content-type", "application/json");
        xml.onreadystatechange = function(){
            if(this.readyState == XMLHttpRequest.DONE)
            {
            callback(this.responseText)
            }
        }
        xml.send();
    return returnAry; 
    }
}
