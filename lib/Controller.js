var gameController = (function (logic, view){

    function gameEnded(){

    }

    function playerChanged(){
    }

    function cardSelected(cardId){
        var cards = manager.players[manager.playerTurn].hand.cards;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].cardId === cardId){
                var card = manager.players[manager.playerTurn].hand.getCardById(cardId);
                manager.players[manager.playerTurn].hand.removeCard(cardId);
                view.removePlayerCard(cardId);

                logic.putCard(card);
                view.putPlayzoneCard(card);
                break;
            }
        }
    }

    return {
        init: function(){
            logic.init();
            view.init();

            view.setHoverOnUserCards();

            view.onCardClick.attach(function(args){
                var cardId = parseInt(args.cardDOM.getAttribute("data-cardId"));
                cardSelected(cardId);
            });

            logic.onPlayerChanged.attach(function(args){
                playerChanged();
            });
        }

    };
})(manager, UI);