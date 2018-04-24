var cards;
var imageFormat = ".png";
var folderDir = "textures/cards/";
var cardBack = "card_back";
var movTimeout = 0;
var movOffset = 500;

function setHoverOnPlayerCards(legalCards) {
    var isLegal = false;
    cards = document.getElementsByClassName("user-card");

    for (var i = 0; i < cards.length; i++) {
        for (var j = 0; j < legalCards.length && !isLegal; j++){
            if (cards[i].alt === legalCards[j].sourceImg){
                cards[i].addEventListener("mouseover", function () {
                    this.setAttribute("style", "position: relative; top: -10px; " +
                        "border-style: solid; border-width: 5px; border-color: lime;");
                });
                isLegal = true;
            }
        }

        if (!isLegal){
            cards[i].addEventListener("mouseover", function () {
                this.setAttribute("style", "position: relative; top: -10px; " +
                    "border-style: solid; border-width: 5px; border-color: red;");
            });
        }

        cards[i].addEventListener("mouseout", function () {
            this.setAttribute("style", "position: static; top: 10px; border-style: none;");
        });

        isLegal = false;
    }
}

function moveCardFromDeckToPlayzone(card){
    var deck = document.getElementById("deck");
    var cardImage = document.createElement("IMG");
    var playZone = document.getElementById(playZone);

    cardImage.setAttribute("src", folderDir+card.sourceImg+imageFormat);
    cardImage.setAttribute("alt", card.sourceImg);
    cardImage.setAttribute("style", "position: absolute; top: "+deck.offsetTop+"px; left: "+deck.offsetLeft+"px;");
    playZone.appendChild(cardImage);

    //movement
    moveCardAnimation(cardImage, playZone.offsetTop);
}

function moveCardFromDeckToPlayerHand(player, card){
    var deck = document.getElementById("deck");
    var cardImage = document.createElement("IMG");
    var playerType = player.playerType;
    var playerHand = document.getElementById(playerType);
    var imageSrc;
    if (playerType === "pc"){
        imageSrc = folderDir+cardBack+imageFormat;
    }
    else {
        imageSrc = folderDir+card.sourceImg+imageFormat;
    }
    cardImage.setAttribute("src", imageSrc);
    cardImage.setAttribute("alt", card.sourceImg);
    cardImage.setAttribute("class", "card "+playerType+"-card");
    cardImage.setAttribute("style", "position: absolute; top: "+deck.offsetTop+"px; left: "+deck.offsetLeft+"px;");
    playerHand.insertBefore(cardImage, playerHand.childNodes[0]);

    //movement
    setTimeout(moveCardAnimation, movTimeout, cardImage, playerHand.offsetTop);
    movTimeout = movTimeout + movOffset;
}

function moveCardAnimation(card, endTop) {
    var startTop = card.offsetTop;
    var offTop = 0;
    card.style.top = (startTop + offTop) + 'px';

    var interval = setInterval(frame, 10);
    function frame() {
        if (card.style.top === endTop+'px') {
            clearInterval(interval);
            setTimeout(function () {
                card.style.position = "static";
                card.style.top = "0px";
                }, 500);
        } else {
            if (startTop >= endTop) {
                offTop--;
            }
            else {
                offTop++;
            }
            card.style.top = (startTop + offTop) + 'px';
        }
    }

}
