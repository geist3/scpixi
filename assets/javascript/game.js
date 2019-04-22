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

pixiApp.showPrompt = function(){
    // pick enemy
    var keys = Object.keys(pixiApp.stats);
    var randomIndex = Math.floor(Math.random() * keys.length);
    var enemy = Object.keys(pixiApp.stats)[randomIndex];
    
    // text
    var basicText = new PIXI.Text('A random ' + enemy + ' appears');
    basicText.x = 30;
    basicText.y = 30;
    pixiApp.app.stage.addChild(basicText);

    // image
    var image = new PIXI.Sprite(pixiApp.sheet.textures[enemy.toLowerCase().replace(/ /g, '') + ".png"]);
    image.x = 60
    image.y = 70
    pixiApp.app.stage.addChild(image);
}

pixiApp.listenForAnimationUpdate = function(){
    pixiApp.app.ticker.add(function (delta) {
        if(pixiApp.state !== pixiApp.states.RUNNING){
            if(pixiApp.resourcesToLoad === 0){
                pixiApp.showPrompt();
                pixiApp.state = pixiApp.states.RUNNING;
            }
        }else{
            pixiApp.images.bunny.rotation += 0.1 * delta;
        }
    });
}

pixiApp.createPixiApp = function(){
    pixiApp.app = new PIXI.Application(500, 600, { backgroundColor: 0x1099bb });
    document.body.appendChild(pixiApp.app.view);
}

pixiApp.initGame = function(){
    pixiApp.state = pixiApp.states.INITIALIZING;
}

pixiApp.loadAssets = function(){
    pixiApp.resourcesToLoad = 2;

    loadJSON('assets/javascript/stats.json', function(response) {
        pixiApp.stats = JSON.parse(response);
        pixiApp.resourcesToLoad--;
    });

    PIXI.loader
        .add("assets/images/portraits/portraits.json")
        .load(function(){
            pixiApp.sheet = PIXI.loader.resources["assets/images/portraits/portraits.json"];
            pixiApp.resourcesToLoad--;
        });
}

window.onload = function () {
    pixiApp.initGame();
    pixiApp.createPixiApp();
    pixiApp.addImage();
    pixiApp.loadAssets();
    pixiApp.listenForAnimationUpdate();
}
