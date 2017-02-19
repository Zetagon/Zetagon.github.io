var assert = buster.assert;
var refute = buster.refute;
buster.testCase("My class", {
    "states the obvious": function () {
        assert(true);
    },

    "has working synonyms":function(){
	   var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]");
        var synonyms = [["synonym1" , "synonymer1" , "syno1"], ["synonym2" , "synonymer2" , "syno2"], ["synonym3" , "synonymer3" , "syno3"]];
        assert.equals(leosTemp.synonyms, synonyms);

    },
    "has working images and descriptions":function(){
	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]");
        var images = [["bild1", "bild2", "bild3"], ["bild1.png", "bild2.png", "bild3.png"]];
        assert.equals(leosTemp.descriptionImagePairs, images);
    },
    "passed input test no.1":function(){
	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]");
        assert(leosTemp.checkMatch("synonym1"));
    },
    "passed input test no.3":function(){
	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]");
        assert(leosTemp.checkMatch("syno2"));
    },
    "passed input test no.4":function(){
	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]");
        refute(leosTemp.checkMatch("Synonym1"));
    },
    "passed input test no.5":function(){
	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]");
        assert(leosTemp.checkMatch("synonym3"));
    },
    "passed input test no.6":function(){
	    var leosTemp = new AnswerDescriptionPair("synonym1 | synonymer1 | syno1 & synonym2 | synonymer2 | syno2 & synonym3 | synonymer3 | syno3 = bild1 [bild1.png] bild2 [bild2.png]");
        assert(leosTemp.checkMatch("synonymer1"));
    },
});
