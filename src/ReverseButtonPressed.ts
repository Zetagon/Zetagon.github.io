////// <reference path="WordListHandler.ts" />
namespace WordListHandler
{
    function ReverseButtonPressed()
    {
        if(playing)
        {
            if (reversed == false)
            {
                reversed = true;
            }
            else
            {
                reversed = false;
            }
            swapWordList()
            NewWord();
        }
        else
        {
            if(firstRound == true)
            {
                HandleInput();
            }
            else
            {
                document.getElementById("response").innerHTML = "<span style = 'color: Gray;'>Click the button just above that one to restart!</span>";
            }
        }
    }
}