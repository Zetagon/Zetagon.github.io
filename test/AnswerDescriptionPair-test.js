var assert = buster.assert;
var refute = buster.refute;
buster.testCase("Class AnswerDescriptionPair", {

    "has working synonyms":function(){
	   var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]");
        var synonyms = [["synonym1" , "synonymer1" , "syno1"], ["synonym2" , "synonymer2" , "syno2"], ["synonym3" , "synonymer3" , "syno3"]];
        var synonyms = [
            { 
                alternatives:[
                    { text: "synonym1"},
                    { text: "synonymer1"},
                    { text: "syno1"},
                ]
            },
            {
                alternatives:[
                    { text: "synonym2"},
                    { text: "synonymer2"},
                    { text: "syno2"},
                ]
            },
            {
                alternatives:[
                    { text: "synonym3"},
                    { text: "synonymer3"},
                    { text: "syno3"},
                ]
            }
        ];

        assert.equals(leosTemp.synonyms, synonyms);

    },


    "has working images and descriptions":function(){
	var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]");
        var images = [
            {
                text:"bild1",
                url: "bild1.png"
            },
            {
                text: "bild2",
                url: "bild2.png"
            }
        ];
        assert.equals(leosTemp.descriptionImagePairs, images);

        //check white space
 	leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 |   syno3 = bild1 [  bild1.png ] bild2 [   bild2.png]");
        images = [
            {
                text:"bild1",
                url: "bild1.png"
            },
            {
                text: "bild2",
                url: "bild2.png"
            }
        ];
        assert.equals(leosTemp.descriptionImagePairs, images);
   },
    "can handle empty imagees":function(){
	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [] bild2 []");
        var images = [
            {
                text:"bild1",
                url: ""
            },
            {
                text: "bild2",
                url: ""
            }
        ];

        assert.equals(leosTemp.descriptionImagePairs, images);

        //check one empty image
 	leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 |   syno3 = bild1 [] bild2 [   bild2.png]");
        images = [
            {
                text:"bild1",
                url: ""
            },
            {
                text: "bild2",
                url: "bild2.png"
            }
        ];       
        assert.equals(leosTemp.descriptionImagePairs, images);
    },

    "passed input test":function(){
	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]");
        assert(leosTemp.checkMatchAndSplice("synonym1"));
        refute(leosTemp.checkMatchAndSplice("synonym1"));

        assert(leosTemp.checkMatchAndSplice("syno2"));
        refute(leosTemp.checkMatchAndSplice("syno2"));

        refute(leosTemp.checkMatchAndSplice("Synonym1"));

        assert(leosTemp.checkMatchAndSplice("synonym3"));
        refute(leosTemp.checkMatchAndSplice("synonym3"));

        refute(leosTemp.checkMatchAndSplice("synonymer1"));
    },


    "passed questionType test":function(){
	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]", "glossary");
        assert(leosTemp.questionType);
    },
    "passed ultimate test":function(){
	    var leosTemp = new AnswerDescriptionPair("guns\\&roses | guns n roses & hej\\=tjena | \\[bra\\]dåligt & \\#yolo | \\$money | good\\|bad = adasdfadf asdf [asdf] hej hej hallå [asdf] ", "glossary");
        //var synonyms = [["guns\\&roses", "guns n roses"], ["hej\\=tjena", "\\[bra\\]dåligt"], ["\\#yolo", "\\$money", "good\\|bad"]];
        var synonyms = [
            {
                alternatives: [
                    {text: "guns\\&roses"},
                    {text:  "guns n roses"}
                ]
            },
            {
                alternatives: [
                    {text: "hej\\=tjena"},
                    {text: "\\[bra\\]dåligt"} 
                ]
            },
            {
                alternatives: [
                    {text: "\\#yolo"}, 
                    {text: "\\$money"},
                    {text: "good\\|bad" } 
                ]
            }
        ];
        assert.equals(leosTemp.synonyms, synonyms);
    }
});
