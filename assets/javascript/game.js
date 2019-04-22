// Pixi app
var pixiApp = {
    states : {
        INITIALIZING : 'initializing',
        RUNNING : 'running'
    },
    images : {}
};

pixiApp.addImage = function(){
    pixiApp.images.logo = PIXI.Sprite.fromImage('assets/images/player_01.png')
    pixiApp.images.logo.anchor.set(0.5);
    pixiApp.images.logo.x = pixiApp.app.screen.width / 2;
    pixiApp.images.logo.y = 10;
    pixiApp.state === pixiApp.states.INITIALIZING && pixiApp.app.stage.addChild(pixiApp.images.logo);
}

pixiApp.showPrompt = function(){
    // pick enemy
    var keys = Object.keys(pixiApp.stats);
    var randomIndex = Math.floor(Math.random() * keys.length);
    var enemy = Object.keys(pixiApp.stats)[randomIndex];
    
    // text
    if(pixiApp.state === pixiApp.states.INITIALIZING){
        pixiApp.promptText = new PIXI.Text('A random ' + enemy + ' appears');
        pixiApp.promptText.x = 30;
        pixiApp.promptText.y = 30;
        pixiApp.app.stage.addChild(pixiApp.promptText);
    }else{
        pixiApp.promptText.text = 'A random ' + enemy + ' appears';
    } 

    // image
    if(pixiApp.state === pixiApp.states.INITIALIZING){
        pixiApp.promptImage = new PIXI.Sprite(pixiApp.sheet.textures[enemy.toLowerCase().replace(/ /g, '') + ".png"]);
        pixiApp.promptImage.x = 60
        pixiApp.promptImage.y = 70
        pixiApp.app.stage.addChild(pixiApp.promptImage);
    }else{
        pixiApp.promptImage.texture = pixiApp.sheet.textures[enemy.toLowerCase().replace(/ /g, '') + ".png"];
    }
}

pixiApp.addGUI = function(){
    //button
    var textureButton = PIXI.Texture.fromImage('assets/images/button.png');
    var button = new PIXI.Sprite(textureButton);
    button.anchor.set(0.5);
    button.x = 200;
    button.y = 500;
    button.interactive = true;
    button.buttonMode = true;

    button.on('pointerup', pixiApp.onButtonUp);
    pixiApp.app.stage.addChild(button);
}

pixiApp.onButtonUp = function() {
    pixiApp.showPrompt();
}

pixiApp.listenForAnimationUpdate = function(){
    pixiApp.app.ticker.add(function (delta) {
        if(pixiApp.state !== pixiApp.states.RUNNING){
            if(pixiApp.resourcesToLoad === 0){
                pixiApp.showPrompt();
                pixiApp.state = pixiApp.states.RUNNING;
            }
        }else{
            pixiApp.images.logo.rotation += 0.1 * delta;
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
    pixiApp.addGUI();
    pixiApp.listenForAnimationUpdate();
}
