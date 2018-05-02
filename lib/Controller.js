var gameController = (function (logic, view) {

    function initGame(){
        logic.init();
        view.init();
    }

    function quitGame(){
        gameEnded(manager.players[manager.getNextPlayer()]);
    }

    function gameEnded(winner) {
        stats.gameWatch.stop();
        clearInterval(view.elapsedTimeInterval);
        view.showEndGameMenu(winner);
    }

    function cardSelected(cardId) {
        var player = logic.getActivePlayer();
        var cards = player.hand.cards;

        for (var i = 0; i < cards.length; i++) {
            if (cards[i].cardId === cardId) {
                var card = player.hand.getCardById(cardId);
                player.playCard(card);
                break;
            }
        }
    }

    function updateCardsAnimation(player) {
        if (player.playerType === "user") {
            view.clearHoverOnUserCards();
            view.clearHoverOnDeck();
            view.setHoverOnUserCards();
            if (!player.inTakiMode.status) {
                view.setHoverOnDeck();
            }
        }
        else {
            view.clearHoverOnUserCards();
            view.clearHoverOnDeck();
        }
    }

    return {
        init: function () {

            logic.create();
            view.create();

            view.onPlayAgain.attach(function () {
                view.clear();
                initGame();
            });

            view.onCardClick.attach(function (args) {
                var cardId = parseInt(args.cardDOM.getAttribute("data-cardId"));
                cardSelected(cardId);
            });

            view.onDeckClick.attach(function () {
                manager.getActivePlayer().drawWhenNoLegalCards();
            });

            view.onPlayerQuit.attach(function () {
                quitGame();
            });

            logic.onPlayerChanged.attach(function (args) {
                view.updateTurnText(stats.turnAmount, args.activePlayer);
            });

            logic.onGameEnded.attach(function (args) {
                gameEnded(args.activePlayer);
            });

            logic.onDeckRefill.attach(function (args) {
                view.deckRefill();
            });

            for (var i = 0; i < logic.players.length; i++) {
                logic.players[i].onRemovedCardFromHand.attach(function (args) {
                    view.removeCardFromBoard(args.card.cardId);
                });
                logic.players[i].onPutCardInPlayZone.attach(function (args) {
                    view.putCardInPlayZone(args.card);
                });
                logic.players[i].onDrawCardFromDeck.attach(function (args) {
                    view.drawCardToPlayerHand(args.player, args.card);
                });
                logic.players[i].onUpdateLegalCards.attach(function (args) {
                    updateCardsAnimation(args.activePlayer);
                });

            }

            // ----------taki card routine-----------
            logic.onTakiCard.attach(function () {
                view.showCloseTakiButton();
            });

            view.onTakiCloseClick.attach(function () {
                logic.getActivePlayer().closeTaki();
            });
            // ----------color change routine------------
            logic.onChangeColor.attach(function () {
                view.showChangeColorMenu();
            });

            view.onColorClick.attach(function (args) {
                logic.getActivePlayer().selectColor(args.color);
            });

            logic.onColorChanged.attach(function (args) {
                UI.replaceColorfulWithColor(args.color);
            });
            //-----------------------------------

            logic.init();
            view.init();
        }

    };
})(manager, UI);