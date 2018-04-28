var gameController = (function (logic, view) {

    function gameEnded() {

    }

    function playerChanged(activePlayer) {
        if (activePlayer.playerType == "user") {
            view.setHoverOnUserCards();
        }
        else {
            view.clearHoverOnUserCards();
        }
    }

    function cardSelected(cardId) {
        var player = logic.players[logic.playerTurn];
        var cards = player.hand.cards;

        for (var i = 0; i < cards.length; i++) {
            if (cards[i].cardId === cardId) {
                var card = player.hand.getCardById(cardId);
                player.playCard(card);
                break;
            }
        }
    }

    return {
        init: function () {


            view.onCardClick.attach(function (args) {
            // TODO: this is the modal for color menu. shouldnt be here, just for checking
            //var modal = document.getElementById("color-menu");
            //modal.style.display = "block";

            view.onCardClick.attach(function(args){
                var cardId = parseInt(args.cardDOM.getAttribute("data-cardId"));
                cardSelected(cardId);
            });

            logic.onPlayerChanged.attach(function (args) {
                playerChanged(args.activePlayer);
            });

            logic.onCardRemovedFromHand.attach(function (args) {
                view.removeCardFromBoard(args.card.cardId);
            });

            logic.onPutCardInPlayZone.attach(function (args) {
                view.putCardInPlayzone(args.card);
            });

            logic.onPlayerDrawCardFromDeck.attach(function (args) {
                view.drawCardToPlayerHand(args.player, args.card);
            });


            logic.init();
            view.init();
            view.setHoverOnUserCards();
        }

    };
})(manager, UI);