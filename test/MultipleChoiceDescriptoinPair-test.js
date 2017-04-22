var assert = buster.assert;
var refute = buster.refute;

buster.testCase("Class Multiple_ChoicesDescriptionPair", {
    "passes a basic test": function(){

        var json = {
            descriptions:
            [
                {
                    text: "Detta är en otroligt fantastisk beskrivning",
                    url: "http://hexeye.se/leo/roliga-projekt/snurr.png"
                }
            ],
            choices: 
            [
                {
                    correct: false,
                    text: "Det här är fel svar",
                    url: "http://hexeye.se/leo/roliga-projekt/snurr.png"
                },
                {
                    correct: true,
                    text: "Det här är rätt svar",
                    url: "http://hexeye.se/leo/roliga-projekt/snurr.png"
                }
            ]
        };
    
        var mcdp = create_MultipleChoice_DescriptionPair_fromJSON(json);    
        assert.equals(mcdp.checkNegativeMatch([0, 1]), [0]);
        assert.equals(mcdp.checkNegativeMatch([0]), [0, 1]);
        assert.equals(mcdp.checkNegativeMatch([1]), []);
        
    }
});
