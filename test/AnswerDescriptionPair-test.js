var assert = buster.assert;
var refute = buster.refute;
buster.testCase("Class AnswerDescriptionPair", {

    "has working synonyms":function(){
	   var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]");
        var synonyms = [["synonym1" , "synonymer1" , "syno1"], ["synonym2" , "synonymer2" , "syno2"], ["synonym3" , "synonymer3" , "syno3"]];
        assert.equals(leosTemp.synonyms, synonyms);

    },


    "has working images and descriptions":function(){
	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]");
        var images = [["bild1", "bild2"], ["bild1.png", "bild2.png"]];
        assert.equals(leosTemp.descriptionImagePairs, images);

        //check white space
 	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 |   syno3 = bild1 [  bild1.png ] bild2 [   bild2.png]");
        var images = [["bild1", "bild2"], ["bild1.png", "bild2.png"]];
        assert.equals(leosTemp.descriptionImagePairs, images);
   },
    "can handle empty imagees":function(){
	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [] bild2 []");
        var images = [["bild1", "bild2"], ["", ""]];
        assert.equals(leosTemp.descriptionImagePairs, images);

        //check one empty image
 	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 |   syno3 = bild1 [] bild2 [   bild2.png]");
        var images = [["bild1", "bild2"], ["", "bild2.png"]];
        assert.equals(leosTemp.descriptionImagePairs, images);
    },

    "passed input test":function(){
	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]");
        assert(leosTemp.checkMatchAndSplice("synonym1"));;
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
        var synonyms = [["guns\\&roses", "guns n roses"], ["hej\\=tjena", "\\[bra\\]dåligt"], ["\\#yolo", "\\$money", "good\\|bad"]];
        assert.equals(leosTemp.synonyms, synonyms);
    }
});
