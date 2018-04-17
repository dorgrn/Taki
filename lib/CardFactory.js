const cardFactory = (function () {
    const TYPES = {
        VALUE: "value",
        TAKI: "taki",
        CHANGE: "change",
        STOP: "stop",
        PLUS: "plus",
        TAKE2: "take2"
    };

    return {
        colors: ["blue", "green", "red", "yellow"],
        values: [1, 3, 4, 5, 6, 7, 8, 9],
        specialTypes: ["taki", "stop"],
        superCards: ["change"],

        createCard: function (_color, type, _sourceImg, value) {


            var card = {
                color: _color,
                sourceImg: _sourceImg
            };

            switch (type) {
                case TYPES.VALUE:
                    card.value = value;
                    break;
                case TYPES.TAKI:
                    card.activate = openTaki;
                    break;
                case TYPES.CHANGE:
                    card.activate = changeColor;
                    break;
                case TYPES.TAKE2:
                    card.activate = take2;
                    break;
                case TYPES.STOP:
                    card.activate = stop;
                    break;
                case TYPES.PLUS:
                    card.activate = plus;
                    break;
            }

            function openTaki() {
                console.error("Unimplemented method!");
            }

            function changeColor() {
                console.error("Unimplemented method!");
            }

            function take2() {
                console.error("Unimplemented method!");
            }

            function stop() {
                console.error("Unimplemented method!");
            }

            function plus() {
                console.error("Unimplemented method!");
            }

            return card;
        }
    }
})();