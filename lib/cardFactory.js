const createCard = function (_color, type, value) {
    var card = {
        color: _color
    };

    // card is action type
    switch (type) {
        case "number":
            card.value = value;
            break;
        case "openTaki":
            card.activate = openTaki;
            break;
        case "changeColor":
            card.activate = changeColor;
            break;
        case "takeTwo":
            card.activate = takeTwo;
            break;
        case "stop":
            card.activate = stop;
            break;
        case "plus":
            card.activate = plus;
            break;
    }
    return card;
};

function openTaki() {
    console.log("unimplemented!");
}

function changeColor() {
    console.log("unimplemented!");
}

function takeTwo() {
    console.log("unimplemented!");
}

function stop() {
    console.log("unimplemented!");
}

function plus() {
    console.log("unimplemented!");
}


var card = createCard("red", "number", 10);
var card1 = createCard("red", "openTaki", 10);