var stats = (function () {
    var gameWatch = stopWatchFactory.createStopWatch();

    return {
        turnAmount: 0,
        gameWatch: gameWatch,
        getElapsedTime: function () {
            return stats.gameWatch.getElapsedTime();
        }
    };
})();