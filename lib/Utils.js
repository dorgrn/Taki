// inspired by https://stackoverflow.com/questions/1210701/compute-elapsed-time
const stopWatchFactory = (function () {
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
                return new Date().getTime() - stopWatch.startMillisecs;
            };


            stopWatch.reset = function () {
                stopWatch.startMillisecs = 0;
            };

            return stopWatch;
        }
    };
})();

//TODO: delete if we're not using events
// const dispatcherFactory = (function () {
//     return {
//         createDispatcher: function () {
//             var dispatcher = {
//                 dispatchHandlers: []
//             };
//
//             dispatcher.prototype.on = function (eventName, handler) {
//                 switch (eventName) {
//                     case "dispatch":
//                         return dispatcher.dispatchHandlers.push(handler);
//                     case "somethingElse":
//                         return alert('write something for this event :)');
//                 }
//             };
//
//             dispatcher.prototype.dispatch = function () {
//                 var handler, i, len, ref;
//                 ref = dispatcher.dispatchHandlers;
//                 for (i = 0, len = ref.length; i < len; i++) {
//                     handler = ref[i];
//                     setTimeout(handler, 0);
//                 }
//             };
//
//             return dispatcher;
//         }
//     };
// })
// ();