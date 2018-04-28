var UI = (function () {

    var cardsDir = "textures/cards/";
    var imageFormat = ".png";
    //var movTimeout = 0;
    //var movOffset = 500;

    function dealCardsToPlayerHand(player, cardsAmount) {
        for (var i = player.hand.cards.length - 1; i > player.hand.cards.length - 1 - cardsAmount; i--) {
            UI.putPlayerCard(player, player.hand.cards[i]);
        }
    }





    function setHoverOnUserCards() {
        var legalCards = manager.players[manager.playerTurn].hand.legalCards;
        var isLegal = false;
        var cards = document.getElementsByClassName("user-card");

        for (var i = 0; i < cards.length; i++) {
            for (var j = 0; j < legalCards.length && !isLegal; j++) {
                if (cards[i].alt === legalCards[j].frontImg) {
                    cards[i].setAttribute("class", "card user-card legal-card");
                    isLegal = true;
                }
            }
            if (!isLegal) {
                cards[i].setAttribute("class", "card user-card illegal-card");
            }


            cards[i].addEventListener("click", function () {
                UI.onCardClick.notify({cardName: this.alt, cardDOM: this});
            });
            isLegal = false;
        }
    }

    function clearHoverOnUserCards() {
        var cards = document.getElementsByClassName("user-card");

        for (var i = 0; i < cards.length; i++) {
            cards[i].setAttribute("class", "card user-card");
            cards[i].removeEventListener("click", function(){});
        }
    }

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


        init : function(){
            for (var i = 0; i < manager.players.length; i++){
                dealCardsToPlayerHand(manager.players[i], playerFactory.HAND_INITIAL_SIZE);
            }
            UI.putPlayzoneCard(manager.getPlayZoneTop());

        },

        update: function () {

            if (manager.players[manager.playerTurn].playerType === "user") {
                setHoverOnUserCards.call(this);
            }
        },

        putPlayzoneCard: function (card) {
            var cardImage = document.createElement("IMG");
            var playZone = document.getElementById("playZone");

            var sign = Math.random() > 0.5 ? 1 : -1;
            var angleAbs = Math.random() * 20;
            var angle = (angleAbs * sign) + "deg";

            cardImage.setAttribute("class", "card card-playZone");
            cardImage.setAttribute("src", cardsDir + card.frontImg + imageFormat);
            cardImage.setAttribute("style", "transform: rotate(" + angle + ");");
            playZone.appendChild(cardImage);
        },

        putPlayerCard: function (player, card) {
            var cardImage = document.createElement("IMG");
            var playerHand = document.getElementById(player.playerType);
            var imageSrc;

            if (player.playerType === "pc") {
                imageSrc = cardsDir + card.backImg + imageFormat;
            }
            else {
                imageSrc = cardsDir + card.frontImg + imageFormat;
                cardImage.setAttribute("alt", card.frontImg);
            }

            cardImage.setAttribute("src", imageSrc);
            cardImage.setAttribute("class", "card " + player.playerType + "-card");
            playerHand.appendChild(cardImage);
        },

        // removePlayerCard : function(player, card){
        //     var playerHand = document.getElementById(player.playerType);
        //     playerHand.removeChild(card);
        // }

        removePlayerCard : function(cardId){
            var playerHand = document.getElementById(player.playerType);
            var card = document.querySelector("[cardId="+cardId+"]");
            playerHand.removeChild(card);
        }
    }

})();