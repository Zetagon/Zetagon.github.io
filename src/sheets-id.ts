/**
 * @param Spreadsheet-id to fetch word-lists from
 */
function getSheetGlossaryNames(id:string, callback):Array<string>
{
    let returnAry:Array<string> = ["test1", "test2"];
    let xml = new XMLHttpRequest();
    let range= "A1:Z1";
    let url = "https://sheets.googleapis.com/v4/spreadsheets/" + id +"/values/Sheet1!" +range+ "?majorDimension=ROWS&key=AIzaSyDgNYnXmkRA6ctBDYfiwXdB3lXcwz9rEHQ";
    //let url = "https://sheets.googleapis.com/v4/spreadsheets/1IJ9_VHEtmQlKoVnT93Y7Dz-uyWShaOH9N2LqFGgHbds?ranges=A1%3AZ&key=AIzaSyDgNYnXmkRA6ctBDYfiwXdB3lXcwz9rEHQ"
    xml.open("GET", url, true);
    xml.setRequestHeader("Content-type", "application/json");
    xml.onreadystatechange = function(){
        if(this.readyState == XMLHttpRequest.DONE)
        {
            //returnAry = JSON.parse(xml.response).values;
            //for(let i = 0; i < returnAry.length; i++)
            //{
            //    if(returnAry[i].length == 0)
            //    {
            //        returnAry.splice(i, 1);
            //    }
           // }
           // alert(returnAry)
           callback(this.responseText)
        }
    }
    xml.send();
    return returnAry;
}

/**
 * return a wordlist from a google Spreadsheet
 * @param id Spreadsheet-id
 * @param name the name of the wordlist to get
 */
function getWordListFromSheet(id:string , name:string, callback):Array<Array<string>>
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
            //returnAry = JSON.parse(xml.response).values;
            //for(let i = 0; i < returnAry.length; i++)
            //{
            //    if(returnAry[i].length == 0)
            //    {
            //        returnAry.splice(i, 1);
            //    }
           // }
           // alert(returnAry)
           callback(this.responseText)
        }
    }
    xml.send();
   return returnAry; 
}