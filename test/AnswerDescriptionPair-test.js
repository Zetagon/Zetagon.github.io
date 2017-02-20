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
    }
});
