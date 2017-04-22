var isInit = false;
var callback;

function initializePage() {
    if(!isInit){
    var container = document.getElementsByClassName("container")[0];
    var descriptionContainer = document.createElement("div");
    descriptionContainer.className = "description-container";
    var correctionBox = document.createElement("div");
    correctionBox.className = "correction-container";
    var inputContainer = document.createElement("div");
    inputContainer.className = "input-container";
    container.appendChild(descriptionContainer);
    container.appendChild(inputContainer);
    container.appendChild(correctionBox);
    }
}
function setDescriptions(descriptions) { // descriptions is an array of description objects containing a string and a image url
    var container = document.getElementsByClassName("description-container")[0];
    while(container.lastChild) { // remove all the current children
        container.removeChild(container.lastChild);
    }
    for(var i = 0; i < descriptions.length; i++) {
        var box = document.createElement("div");
        box.className = "description-box";
        if(descriptions[i].text != "") {
            var text = document.createElement("div");
            text.className = "description-text";
            var textNode = document.createTextNode(descriptions[i].text);
            text.appendChild(textNode);
            box.appendChild(text);
        }
        if(descriptions[i].url != "") {
            var image = document.createElement("div");
            image.className = "description-image"
            image.style.backgroundImage = "url(" + descriptions[i].url + ")"
            box.appendChild(image);
        }
        container.appendChild(box);
    }
}
function setInputboxes(numberOfBoxes) {
    var container = document.getElementsByClassName("input-container")[0];
    while(container.lastChild) { // remove all the current children
        container.removeChild(container.lastChild);
    }
    var flexContainer = document.createElement("div");
    flexContainer.className = "input-flex-container";
    for(var i = 0; i < numberOfBoxes; i++) {
        var wrapper = document.createElement("div");
        wrapper.className = "input-box";
        var input = document.createElement("input");
        input.className = "the-input";
        input.addEventListener("keypress", function(event) { handleInputKeypress(event); });
        input.addEventListener("input", function(event) { handleInput(event); });
        input.addEventListener("focus", function(event) { addInputFocus(event); });
        input.addEventListener("blur", function(event) { removeInputFocus(event); });
        input.tabIndex = "1";
        wrapper.appendChild(input);
        flexContainer.appendChild(wrapper);
    }
    var submit = document.createElement("div");
    submit.className = "submit-button";
    submit.tabIndex = "1";
    submit.addEventListener("click", function() { handleSubmit(); });
    submit.addEventListener("focus", function(event) { addSubmitFocus(event); });
    submit.addEventListener("blur", function(event) { removeSubmitFocus(event); });
    submit.addEventListener("keypress", function(event) { handleSubmitKeypress(event); })
    submitText = document.createTextNode("Click here or press enter to submit");
    submit.appendChild(submitText);
    container.appendChild(flexContainer);
    container.appendChild(submit);
}
function setCorrectionString(correctionMessage) {
    var container = document.getElementsByClassName("correction-container")[0];
    while(container.lastChild) { // remove all the current children
        container.removeChild(container.lastChild);
    }
    if(correctionMessage != "") {
        var box = document.createElement("div");
        var text = document.createElement("div");
        text.className = "error-text";
        var textNode = document.createTextNode(correctionMessage);
        text.appendChild(textNode);
        box.appendChild(text);
        container.appendChild(box);
    }
}
function handleSubmitKeypress(event) {
    if(event.keyCode == 13) {
        handleSubmit();
    }
}
function handleInputKeypress(event) {
   if(event.keyCode == 13) {
        var element = event.target.parentElement;
        var wrappers = document.getElementsByClassName("input-flex-container")[0].children;
        var nextIndex = 0;
        while(wrappers[nextIndex] != element) {
            nextIndex++;
        }
        nextIndex++;
        while(nextIndex < wrappers.length && wrappers[nextIndex].classList.contains("correct-answer")) {
            nextIndex++;
        }
        if(nextIndex == wrappers.length) { // we are on the last element
            handleSubmit();
        } else {
            wrappers[nextIndex].lastChild.focus();
        }
    }
}
function addInputFocus(event) {
    event.target.parentElement.classList.add("focus-answer");
}
function removeInputFocus(event) {
    event.target.parentElement.classList.remove("focus-answer");
}
function addSubmitFocus(event) {
    event.target.classList.add("focus-answer");
}
function removeSubmitFocus(event) {
    event.target.classList.remove("focus-answer");
}

function handleInput(event) {
    event.target.parentElement.classList.remove("incorrect-answer");
    event.target.parentElement.classList.remove("correct-answer");
    event.target.tabIndex = "1";
}
function handleSubmit() {
    var elements = document.getElementsByClassName("input-flex-container")[0].children;
    var answers = [];
    for(var i = 0; i < elements.length; i++) {
        answers.push(elements[i].lastChild.value);
    }
    callback(answers);
}
function setCallback(Callback) {
    callback = Callback;
}
function markAnswers(correctArray) {
    var elements = document.getElementsByClassName("input-flex-container")[0].children;
    if(elements.length != correctArray.length) {
        return console.log("Incorrect array length sent to markAnswers");
    }
    for(var i = 0; i < correctArray.length; i++) {
        if(correctArray[i]) {
            elements[i].classList.remove("incorrect-answer");
            elements[i].classList.add("correct-answer");
            elements[i].lastChild.tabIndex = "-1";
        } else {
            elements[i].classList.remove("correct-answer");
            elements[i].classList.add("incorrect-answer");
        }
    }
}
function focusFirstIncorrectInput() {
    document.getElementsByClassName("incorrect-answer")[0].lastChild.focus();
}
