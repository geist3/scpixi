// Pixi app
var pixiApp = {
    states : {
        INITIALIZING : 'initializing',
        RUNNING : 'running'
    },
    images : {}
};

pixiApp.addImage = function(){
    pixiApp.images.bunny = PIXI.Sprite.fromImage('assets/images/player_01.png')
    pixiApp.images.bunny.anchor.set(0.5);
    pixiApp.images.bunny.x = pixiApp.app.screen.width / 2;
    pixiApp.images.bunny.y = 10;
    pixiApp.app.stage.addChild(pixiApp.images.bunny);
}

pixiApp.addText = function(){
    var enemy = Object.keys(pixiApp.stats)[0];
    var basicText = new PIXI.Text('A random ' + enemy + ' appears');
    basicText.x = 30;
    basicText.y = 90;
    pixiApp.app.stage.addChild(basicText);
}

pixiApp.listenForAnimationUpdate = function(){
    pixiApp.app.ticker.add(function (delta) {
        pixiApp.images.bunny.rotation += 0.1 * delta;
    });
}

pixiApp.createPixiApp = function(){
    pixiApp.app = new PIXI.Application(800, 600, { backgroundColor: 0x1099bb });
    document.body.appendChild(pixiApp.app.view);
}

pixiApp.initGame = function(){
    pixiApp.state = pixiApp.states.INITIALIZING;
}

pixiApp.loadAssets = function(){
    loadJSON('assets/javascript/stats.json', function(response) {
        pixiApp.stats = JSON.parse(response);
        pixiApp.listenForAnimationUpdate();
        pixiApp.addText();
        pixiApp.state = pixiApp.states.RUNNING;
    });
}

window.onload = function () {
    pixiApp.initGame();
    pixiApp.loadAssets();
    pixiApp.createPixiApp();
    pixiApp.addImage();
}
