const cardFactory = (function () {
    return {
        colors: ["blue", "green", "red", "yellow"],
        values: [1, 3, 4, 5, 6, 7, 8, 9],
        specialTypes: ["taki", "stop"],
        superCards: ["change_colorful"],

        createCard: function (_color, type, _sourceImg, value) {
            var card = {
                color: _color,
                sourceImg: _sourceImg
            };

            switch (type) {
                case "number":
                    card.value = value;
                    break;
                case "taki":
                    card.activate = openTaki;
                    break;
                case "change_colorful":
                    card.activate = changeColor;
                    break;
                case "2plus":
                    card.activate = take2;
                    break;
                case "stop":
                    card.activate = stop;
                    break;
                case "plus":
                    card.activate = plus;
                    break;
            }

            function openTaki() {
                console.error("Unimplemented method!");
            }

            function changeColor() {
                console.error("Unimplemented method!");
            }

            function plus() {
                console.error("Unimplemented method!");
            }

            function take2() {
                console.error("Unimplemented method!");
            }

            function stop(){
                console.error("Unimplemented method!");
            }

            function plus(){
                console.error("Unimplemented method!");
            }


            return card;
        }
    }
})();