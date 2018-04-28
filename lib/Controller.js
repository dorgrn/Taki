var gameController = (function (logic, view){

    function gameEnded(){

    }

    function playerChanged(){
    }

    function cardSelected(cardId){
        var player = logic.players[logic.playerTurn];
        var cards = player.hand.cards;

        for (var i = 0; i < cards.length; i++) {
            if (cards[i].cardId === cardId){
                var card = player.hand.getCardById(cardId);
                player.playCard(card);

                view.removeCardFromBoard(cardId);
                view.putCardInPlayzone(card);
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