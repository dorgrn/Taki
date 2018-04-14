const cardFactory = (function () {
    return {
        colors: ["blue", "green", "red", "yellow"],
        values: [1, 3, 4, 5, 6, 7, 8, 9],
        specialType: ["taki", "stop"],
        oneOfKind: ["change_colorful"],

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
            }

            function changeColor() {
            }

            function plus() {
            }

            function take2() {
            }


            return card;
        }
    }
})();