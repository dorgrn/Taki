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
        onDeckClick: eventFactory.createEvent(),
        onColorClick: eventFactory.createEvent(),
        onTakiCloseClick: eventFactory.createEvent(),
        colorsMenu: {},

        init: function () {
            UI.putCardInPlayzone(manager.playZone.getTop());
            UI.initColorsMenu();
        },

        initColorsMenu: function () {
            UI.colorsMenu = document.getElementById("color-menu");
            var colors = document.getElementsByClassName("color-option");
            for (var i = 0; i < colors.length; i++){
                var color = (colors[i].id.split("-"))[0];
                colors[i].setAttribute("data-color", color);
            }
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

                cards[i].addEventListener("click", function (event) {
                    UI.onCardClick.notify({cardDOM: this});
                    event.stopPropagation();
                });
                isLegal = false;
            }
        },




        setHoverOnDeck: function() {
            var deck = document.getElementById("card-deck");
            if (manager.getActivePlayer().hasLegalCard()) {
                deck.setAttribute("class", "card-deck illegal-card");
            }
            else {
                deck.setAttribute("class", "card-deck legal-card");
                deck.addEventListener("click", function (event) {
                    UI.onDeckClick.notify();
                    event.stopPropagation();
                });
            }
        },

        clearHoverOnUserCards: function () {
            var cards = document.getElementById("user").children;

            for (var i = 0; i < cards.length; i++) {
                cards[i].setAttribute("class", "card");
                cards[i].removeEventListener("click", function () {});
            }
        },

        clearHoverOnDeck: function () {
            var deck = document.getElementById("card-deck");
            deck.setAttribute("class", "card-deck");
            deck.removeEventListener("click", function () {});
        },

        showChangeColorMenu : function(){
            var modal = document.getElementById("color-menu");
            var colors = document.getElementsByClassName("color-option");
            modal.style.display = "block";

            for(var i = 0; i < colors.length; i++){
                colors[i].addEventListener("click", function (event) {
                    UI.colorsMenu.style.display = "none";
                    UI.onColorClick.notify({color: this.getAttribute("data-color")});
                    event.stopPropagation();
                });
            }
        },

        replaceColorfulWithColor : function(color) {
            var playZone = document.getElementById("playZone");
            var top = playZone.lastChild;
            var newSrc = top.getAttribute("src").replace("colorful",color);
            top.setAttribute("src",newSrc);
        },

        showCloseTakiButton : function() {
            var playZone = document.getElementById("playZone");
            var btnCloseTaki = document.createElement("button");
            var btnText = document.createTextNode("Close Taki");

            btnCloseTaki.appendChild(btnText);
            btnCloseTaki.setAttribute("class", "close-taki");
            playZone.appendChild(btnCloseTaki);

            btnCloseTaki.addEventListener("click", function (event) {
                UI.onTakiCloseClick.notify();
                playZone.removeChild(btnCloseTaki);
                event.stopPropagation();
            });
        },

        showGameResults: function () {

        }
    };

})();