var UI = (function () {
    var cardsDir = "textures/cards/";
    var imageFormat = ".png";
    // cache DOM elements
    var timeElapsedGameText = document.getElementById("time_elapsed_game");
    var playerText = document.getElementById("turn_indicator");
    var turnAmountText = document.getElementById("turn_amount");
    var playZone = document.getElementById("playZone");
    var deck = document.getElementById("card-deck");
    var userCards = document.getElementById("user").children;
    var colorMenu = document.getElementById("color-menu");
    var colorOptions = document.getElementsByClassName("color-option");
    var endGameMenu = document.getElementById("end-game-menu");
    var quitButton = document.getElementById("quit-button");

    function initStats() {
        UI.elapsedTimeInterval = window.setInterval(function () {
            timeElapsedGameText.innerText = "Time: " + stats.gameWatch.getElapsedTime();
        }, 1000);

        UI.updateTurnText(1, manager.getActivePlayer());

        quitButton.onclick = function () {
            UI.onPlayerQuit.notify();
        };
    }

    function initColorMenu() {
        for (var i = 0; i < colorOptions.length; i++) {
            colorOptions[i].addEventListener("click", function (event) {
                UI.colorsMenu.style.display = "none";
                UI.onColorClick.notify({color: this.getAttribute("data-color")});
            });
        }
    }

    function notifyDeck() {
        deck.removeEventListener("click", notifyDeck);
        UI.onDeckClick.notify();
    }

    function playAgain() {
        // TODO: do we implement to do this?
        // manager.init();
        // UI.init();
    }

    return {
        onCardClick: eventFactory.createEvent(),
        onDeckClick: eventFactory.createEvent(),
        onColorClick: eventFactory.createEvent(),
        onTakiCloseClick: eventFactory.createEvent(),
        onPlayerQuit: eventFactory.createEvent(),
        elapsedTimeInterval: {},
        colorsMenu: {},

        init: function () {
            UI.putCardInPlayZone(manager.playZone.getTop());
            UI.initColorsMenu();

            initStats();
            initColorMenu();
        },

        initColorsMenu: function () {
            UI.colorsMenu = document.getElementById("color-menu");
            var colors = document.getElementsByClassName("color-option");
            for (var i = 0; i < colors.length; i++) {
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

        putCardInPlayZone: function (card) {
            var cardDOM = UI.createCardDOM(card);
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
            var isLegal = false;

            for (var i = 0; i < userCards.length; i++) {
                for (var j = 0; j < legalCards.length && !isLegal; j++) {
                    if (parseInt(userCards[i].getAttribute("data-cardId")) === legalCards[j].cardId) {
                        userCards[i].setAttribute("class", "legal-card");
                        isLegal = true;
                    }
                }
                if (!isLegal) {
                    userCards[i].setAttribute("class", "illegal-card");
                }

                userCards[i].addEventListener("click", function (event) {
                    UI.onCardClick.notify({cardDOM: this});
                });
                isLegal = false;
            }
        },

        setHoverOnDeck: function () {
            if (manager.getActivePlayer().hasLegalCard()) {
                deck.setAttribute("class", "card-deck illegal-card");
                deck.removeEventListener("click", notifyDeck);
            }
            else {
                deck.setAttribute("class", "card-deck legal-card");
                deck.addEventListener("click", notifyDeck);
            }
        },

        clearHoverOnUserCards: function () {
            for (var i = 0; i < userCards.length; i++) {
                userCards[i].setAttribute("class", "card");
                userCards[i].removeEventListener("click", function () {
                });
            }
        },

        clearHoverOnDeck: function () {
            deck.setAttribute("class", "card-deck");
            deck.removeEventListener("click", function () {
            });
        },

        showChangeColorMenu: function () {
            colorMenu.style.display = "block";
        },

        showEndGameMenu: function (winnerPlayer) {
            endGameMenu.style.display = "block";
            document.getElementById("winner-player-text").innerText =
                (winnerPlayer.playerType === "user" ? "You win!" : "PC wins!");
            document.getElementById("elapsed-time-text").innerText = "Game " + timeElapsedGameText.innerText;
            document.getElementById("avg-time-text").innerText = "Average time per turn: " + winnerPlayer.getAvgTurnTime();
            document.getElementById("last-card-text").innerText = "Last card counter: " + winnerPlayer.getLastCardCounter();
        },

        replaceColorfulWithColor: function (color) {
            var top = playZone.lastChild;
            var newSrc = top.getAttribute("src").replace("colorful", color);
            top.setAttribute("src", newSrc);
        },

        showCloseTakiButton: function () {
            var btnCloseTaki = document.createElement("button");
            var btnText = document.createTextNode("Close Taki");

            btnCloseTaki.appendChild(btnText);
            btnCloseTaki.setAttribute("class", "close-taki button-UI");
            playZone.appendChild(btnCloseTaki);

            btnCloseTaki.addEventListener("click", function (event) {
                UI.onTakiCloseClick.notify();
                playZone.removeChild(btnCloseTaki);
            });
        },

        updateTurnText: function (turnAmount, activePlayer) {
            turnAmountText.innerText = "Turn amount: " + turnAmount;
            playerText.innerText = activePlayer.playerType === "user" ? "Your turn" : "PC turn";
        },

        deckRefill: function (){
            deck.setAttribute("style", "display: none");
            var cards = playZone.children;
            var timeOffset = 0;
            for (var i = 0; i<cards.length-1; i++){
                shiftNflip(cards[i]);
            }
            setTimeout(function () {
                deck.setAttribute("style", "display: block");
                while (playZone.children.length > 1) {
                    playZone.removeChild(playZone.firstChild);
                }
            }, timeOffset);

            function shiftNflip(card){
                setTimeout(function () {
                    card.setAttribute("style", "margin-left: 50px;");
                    card.setAttribute("src", deck.src);
                }, timeOffset);
                timeOffset = timeOffset + 100;

            }
        }

    };
})
();