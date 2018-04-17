var cards;

function setHoverOnCards() {
    cards = document.getElementsByClassName("card");
    // cards.forEach(function (card){
    //     card.addEventListener("mouseover", function (){
    //         card.setAttribute("style", "position:relative;");
    //         card.setAttribute("style", "top:-10px;");
    //     })
    // })


    for (var i = 0; i < cards.length; i++) {
        cards[i].addEventListener("mouseover", function () {
            this.setAttribute("style", "position:relative;");
            this.setAttribute("style", "top:-10px;");
        });
    }

    // for(card in cards){
    //     console.log(cards[card]);
    //     cards[card].addEventListener("mouseover", function(){
    //         cards[card].setAttribute("style", "position:relative;");
    //         cards[card].setAttribute("style", "top:-10px;");
    //     });
    // }
}

setHoverOnCards();