var stats = (function () {
    var gameWatch = stopWatchFactory.createStopWatch();

    return {
        gamesAmount: 0,
        turnAmount: 0,
        gameWatch: gameWatch,
        getElapsedTime: function () {
            return stats.gameWatch.getElapsedTime();
        }
    };
})();