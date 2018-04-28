var gameController = (function (logic, view){

    function gameEnded(){

    }

    function playerChanged(){

    }

    function cardSelected(cardId){
        var cards = manager.players[manager.playerTurn].hand.cards;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].cardId === cardId){
                manager.players[manager.playerTurn].removeCard(cardId);
                view.removePlayerCard(cardId);
                logic.putCard(cardId);
                break;
            }
        }
    }

    return {
        init: function(){
            logic.init();
            view.init();

            view.onCardClick.attach(function(args){
                cardSelected(args.cardId);
            });

            logic.onPlayerChanged.attach(function(args){

            });
        }

    };
})(manager, UI);