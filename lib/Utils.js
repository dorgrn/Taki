// inspired by https://stackoverflow.com/questions/1210701/compute-elapsed-time
var stopWatchFactory = (function () {
    return {
        // from https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript/21294619
        millisToMinutesAndSeconds: function (millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return (seconds === 60 ? (minutes + 1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);
        },

        createStopWatch: function () {
            var stopWatch = {};

            stopWatch.startMillisecs = 0;
            stopWatch.elapsedMillisecs = 0;

            stopWatch.start = function () {
                stopWatch.startMillisecs = new Date().getTime();
            };

            stopWatch.stop = function () {
                stopWatch.elapsedMillisecs = new Date().getTime() - stopWatch.startMillisecs;
                return stopWatch.elapsedMillisecs;
            };

            stopWatch.getElapsedTime = function () {
                return stopWatchFactory.millisToMinutesAndSeconds(new Date().getTime() - stopWatch.startMillisecs);
            };

            stopWatch.getElapsedTimeInMillis = function () {
                return new Date().getTime() - stopWatch.startMillisecs;
            };

            stopWatch.reset = function () {
                stopWatch.startMillisecs = 0;
            };

            return stopWatch;
        }
    };
})();


var eventFactory = (function () {
    return {
        createEvent: function () {
            var event = {
                listeners: []
            };

            event.attach = function (listener) {
                event.listeners.push(listener);
            };

            // event.detach = function(listener){
            //     var idx = this.listeners.indexOf(listener);
            //     if (idx >= 0){
            //         this.listeners.splice(idx, 1);
            //     }
            // };

            event.notify = function (args) {
                for (var i = 0; i < this.listeners.length; i++) {
                    this.listeners[i](args);
                }
            };

            return event;
        }
    };
})();