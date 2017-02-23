var assert = buster.assert;
var refute = buster.refute;

buster.testCase("Function splitEscapedString" , {
    "can handle strings without escape-sequences with one split":function(){
        var testString = "abc&def";
        var result = testString.splitEscapedString("&");
        var expected = ["abc", "def"];
        assert.equals(result, expected);
    },
    "can handle strings without escape-sequences with multiple splits":function(){
        var testString = "abc&def&ghi";
        var result = testString.splitEscapedString("&");
        var expected = ["abc", "def", "ghi"];
        assert.equals(result, expected);
    },

    "can handle strings with escape-sequences with one split":function(){
        var testString = "abc\\&def&ghi";
        var result = testString.splitEscapedString("&");
        var expected = ["abc\\&def", "ghi"];
        assert.equals(result, expected);
    },
    "can handle strings with escape-sequences with multiple splits":function(){
        var testString = "abc\\&def&ghi&jkl\\&mno";
        var result = testString.splitEscapedString("&");
        var expected = ["abc\\&def", "ghi", "jkl\\&mno"];
        assert.equals(result, expected);
    }
});
