var UI = (function () {
    var cardsDir = "textures/cards/";
    var imageFormat = ".png";
    //var movTimeout = 0;
    //var movOffset = 500;

    // function moveCardFromDeckToPlayerHand(player, card){
    //     var deck = document.getElementById("deck");
    //     var cardImage = document.createElement("IMG");
    //     var playerType = player.playerType;
    //     var playerHand = document.getElementById(playerType);
    //     var imageSrc;
    //     if (playerType === "pc"){
    //         imageSrc = cardsDir+card.backImg+imageFormat;
    //     }
    //     else {
    //         imageSrc = cardsDir+card.frontImg+imageFormat;
    //         cardImage.setAttribute("alt", card.frontImg);
    //     }
    //     cardImage.setAttribute("src", imageSrc);
    //     cardImage.setAttribute("class", "card "+playerType+"-card");
    //     cardImage.setAttribute("style", "position: absolute; top: "+deck.offsetTop+"px; left: "+deck.offsetLeft+"px;");
    //     playerHand.insertBefore(cardImage, playerHand.childNodes[0]);
    //
    //     //movement
    //     setTimeout(moveCardAnimation, movTimeout, cardImage, playerHand.offsetTop, deck.offsetLeft);
    //     movTimeout = movTimeout + movOffset;
    // }
    //
    // //function moveCard(cardImg, )
    // function moveCardAnimation(card, endTop, endLeft) {
    //     var startTop = card.offsetTop;
    //     var startLeft = card.offsetLeft;
    //     var offTop = 0;
    //     var offLeft = 0;
    //     card.style.top = (startTop + offTop) + 'px';
    //     card.style.left = (startLeft + offLeft) + 'px';
    //
    //     var interval = setInterval(frame, 10);
    //     function frame() {
    //         if (card.style.top === endTop+'px' && card.style.left === endLeft+'px') {
    //             card.style.position = "static";
    //             card.style.top = "0px";
    //             card.style.left = "0px";
    //             clearInterval(interval);
    //
    //         } else {
    //             if (card.style.top != endTop+'px'){
    //                 if (startTop > endTop) {
    //                     offTop--;
    //                 }
    //                 else {
    //                     offTop++;
    //                 }
    //             }
    //             if (card.style.left != endLeft+'px'){
    //                 if (startLeft > endLeft) {
    //                     offLeft--;
    //                 }
    //                 else {
    //                     offLeft++;
    //                 }
    //             }
    //
    //             card.style.top = (startTop + offTop) + 'px';
    //             card.style.left = (startLeft + offLeft) + 'px';
    //         }
    //     }
    // }


    return {
        onCardClick: eventFactory.createEvent(),
        //
        // dealCardsToPlayerHand: function (player, card) {
        //     UI.drawCardToPlayerHand(player, card);
        // },

        init: function () {
            // for (var i = 0; i < manager.players.length; i++) {
            //     dealCardsToPlayerHand(manager.players[i], playerFactory.HAND_INITIAL_SIZE);
            // }
            UI.putCardInPlayzone(manager.getPlayZoneTop());
        },

        createCardDOM: function (card) {
            var cardDOM = document.createElement("IMG");
            cardDOM.setAttribute("class", "card");
            cardDOM.setAttribute("data-cardId", card.cardId);
            return cardDOM;
        },

        putCardInPlayzone: function (card) {
            var cardDOM = UI.createCardDOM(card);
            var playZone = document.getElementById("playZone");
            var sign = Math.random() > 0.5 ? 1 : -1;
            var angleAbs = Math.random() * 20;
            var angle = (angleAbs * sign) + "deg";
            cardDOM.setAttribute("class", "card-playZone");
            cardDOM.setAttribute("src", cardsDir + card.frontImg + imageFormat);
            cardDOM.setAttribute("style", "transform: rotate(" + angle + ");");
            playZone.appendChild(cardDOM);
        },

        drawCardToPlayerHand: function (player, card) {
            var cardDOM = UI.createCardDOM(card);
            var playerHand = document.getElementById(player.playerType);
            var imageSrc = (player.playerType === "pc") ? card.backImg : card.frontImg;
            cardDOM.setAttribute("src", cardsDir + imageSrc + imageFormat);
            cardDOM.setAttribute("class", "card");
            playerHand.appendChild(cardDOM);
        },

        removeCardFromBoard: function (cardId) {
            var card = document.querySelector("[data-cardId='" + cardId + "']");
            var hand = card.parentNode;
            hand.removeChild(card);
        },

        setHoverOnUserCards: function () {
            var legalCards = manager.players[manager.playerTurn].hand.legalCards;
            var cards = document.getElementById("user").children;
            var isLegal = false;

            for (var i = 0; i < cards.length; i++) {
                for (var j = 0; j < legalCards.length && !isLegal; j++) {
                    if (cards[i].getAttribute("data-cardId") == legalCards[j].cardId) {
                        cards[i].setAttribute("class", "legal-card");
                        isLegal = true;
                    }
                }
                if (!isLegal) {
                    cards[i].setAttribute("class", "illegal-card");
                }

                cards[i].addEventListener("click", function () {
                    UI.onCardClick.notify({cardDOM: this});
                });
                isLegal = false;
            }
        },

        clearHoverOnUserCards: function () {
            var cards = document.getElementById("user").children;

            for (var i = 0; i < cards.length; i++) {
                cards[i].setAttribute("class", "card");
                cards[i].removeEventListener("click", function () {
                });
            }
        },

        showGameResults: function () {

        }
    };

})();