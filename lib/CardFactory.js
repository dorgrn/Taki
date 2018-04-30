var cardFactory = (function () {
        var TYPES = {
            VALUE: "value",
            TAKI: "taki",
            CHANGE: "change",
            STOP: "stop",
            PLUS: "plus",
            TAKE2: "take2",
            SUPER_TAKI: "superTaki"
        };

        return {
            colors: ["blue", "green", "red", "yellow"],
            values: [1, 3, 4, 5, 6, 7, 8, 9],
            specialTypes: ["taki", "stop"],
            superCards: ["change"],

            //Functions:
            funcOpenTaki: {},
            funcChangeColor: {},
            funcTake2: {},
            funcStop: {},
            funcPlus: {},

            createCard: function (_cardId, _color, _type, _sourceImg, value) {
                var card = {
                    cardId: _cardId,
                    type: _type,
                    color: _color,
                    frontImg: _sourceImg,
                    backImg: "card_back",

                    isValueCard: function () {
                        return this.type === TYPES.VALUE;
                    },

                    isSpecialCard: function () {
                        return cardFactory.specialTypes.indexOf(this.type) !== -1;
                    },

                    isSuperCard: function () {
                        return cardFactory.superCards.indexOf(this.type) !== -1;
                    },

                    compareColor: function(card) {
                        return this.color === card.color;
                    },

                    compareValue: function(card) {
                        return this.type === TYPES.VALUE && card.type === TYPES.VALUE && this.value === card.value;
                    },

                    compareType: function(card){
                        return this.type === card.type;
                    }
                };

                switch (_type) {
                    case TYPES.VALUE:
                        card.value = value;
                        break;
                    case TYPES.TAKI:
                        card.activate = cardFactory.funcOpenTaki;
                        break;
                    case TYPES.CHANGE:
                        card.activate = cardFactory.funcChangeColor;
                        break;
                    case TYPES.TAKE2:
                        card.activate = cardFactory.funcTake2;
                        break;
                    case TYPES.STOP:
                        card.activate = cardFactory.funcStop;
                        break;
                    case TYPES.PLUS:
                        card.activate = cardFactory.funcPlus;
                        break;
                    case TYPES.SUPER_TAKI:
                        card.activate = superTaki;
                        break;
                }
                return card;
            },

            getTypes: function () {
                return TYPES;
            },

            findCardInArray: function (array, type, color, value) {
                return array.find(function (card) {
                        return ((type ? card.type === type : true) && (color ? card.color === color : true) &&
                            (value ? card.value === value : true));
                    }
                );
            }

        };
    }
)();