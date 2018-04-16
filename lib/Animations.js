

function initAnimations(){
    console.log(manager.getEventPlayerChanged());
    this.addEventListener(manager.getEventPlayerChanged(), setHoverOnCards);
}

function setHoverOnCards(player) {
    var cards = document.getElementsByClassName("card");

    for (var i = 0; i < cards.length; i++) {
        cards[i].addEventListener("mouseover", function () {
            this.setAttribute("style", "position: relative;top: -10px;");
        });
        cards[i].addEventListener("mouseout", function () {
            this.setAttribute("style", "position: static;top: 10px;");
        });
    }
}

initAnimations();


