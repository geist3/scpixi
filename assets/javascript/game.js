// Pixi app
var pixiApp = {
    states : {
        INITIALIZING : 'initializing',
        RUNNING : 'running',
        SHOWINGQUESTION : 'showingquestion',
        SHOWINGANSWER : 'showinganswer'
    },
    images : {}
};

pixiApp.addLogo = function(){
    pixiApp.images.logo = PIXI.Sprite.fromImage('assets/images/player_01.png')
    pixiApp.images.logo.anchor.set(0.5);
    pixiApp.images.logo.x = pixiApp.app.screen.width / 2;
    pixiApp.images.logo.y = 10;
    pixiApp.app.stage.addChild(pixiApp.images.logo);
}

pixiApp.showPrompt = function(){
    pixiApp.answerText.visible = false;
    pixiApp.answerImage.visible = false;

    // pick enemy
    var keys = Object.keys(pixiApp.stats.Terran.Units);
    var randomIndex = Math.floor(Math.random() * keys.length);
    var enemy = Object.keys(pixiApp.stats.Terran.Units)[randomIndex];
    pixiApp.enemy = pixiApp.stats.Terran.Units[enemy];

    // show info
    pixiApp.promptText.text = 'A random ' + enemy + ' appears';
    pixiApp.promptImage.texture = pixiApp.sheet.textures[pixiApp.enemy.image];
}

pixiApp.showAnswer = function(){
    var answer = pixiApp.enemy.WeakAgainst.Zerg[0];
    pixiApp.answerText.text = 'Weak against ' + answer;
    pixiApp.answerText.visible = true;
    pixiApp.answerImage.texture = pixiApp.sheet.textures[pixiApp.stats.Zerg.Units[answer].image];
    pixiApp.answerImage.visible = true;
}

pixiApp.changeState = function(newState){
    switch(newState){
        case pixiApp.states.INITIALIZING:
            pixiApp.state = newState
            break;
        case pixiApp.states.RUNNING:
        case pixiApp.states.SHOWINGQUESTION:
            pixiApp.showPrompt();
            pixiApp.state = pixiApp.states.SHOWINGQUESTION
            break;
        case pixiApp.states.SHOWINGANSWER:
            pixiApp.showAnswer();
            pixiApp.state = newState
            break;
        default:
            console.log("State not handled: " + newState)
    }
    console.log('new state: ' + pixiApp.state)
}

pixiApp.addGUI = function(){
    //button
    var textureButton = PIXI.Texture.fromImage('assets/images/button.png');
    var button = new PIXI.Sprite(textureButton);
    button.anchor.set(0.5);
    button.x = 200;
    button.y = 565;
    button.interactive = true;
    button.buttonMode = true;

    button.on('pointerup', pixiApp.onButtonUp);
    pixiApp.app.stage.addChild(button);

    // prompt image
    pixiApp.promptImage = new PIXI.Sprite(pixiApp.sheet.textures["marine.png"]);
    pixiApp.promptImage.x = 10
    pixiApp.promptImage.y = 70
    pixiApp.app.stage.addChild(pixiApp.promptImage);

    // prompt text
    pixiApp.promptText = new PIXI.Text('A random marine appears');
    pixiApp.promptText.x = 30;
    pixiApp.promptText.y = 30;
    pixiApp.app.stage.addChild(pixiApp.promptText);

    // answer text
    pixiApp.answerText = new PIXI.Text('......');
    pixiApp.answerText.x = 230;
    pixiApp.answerText.y = 220;
    pixiApp.answerText.visible = false;
    pixiApp.app.stage.addChild(pixiApp.answerText);

    // answer image
    pixiApp.answerImage = new PIXI.Sprite(pixiApp.sheet.textures["zergling.png"]);
    pixiApp.answerImage.x = 340
    pixiApp.answerImage.y = 280
    pixiApp.answerImage.visible = false;
    pixiApp.app.stage.addChild(pixiApp.answerImage);
}

pixiApp.onButtonUp = function() {
    if(pixiApp.state === pixiApp.states.SHOWINGANSWER){
        pixiApp.changeState(pixiApp.states.SHOWINGQUESTION);
    } else {
        pixiApp.changeState(pixiApp.states.SHOWINGANSWER);
    }
}

pixiApp.listenForAnimationUpdate = function(){
    pixiApp.app.ticker.add(function (delta) {
        if(pixiApp.state === pixiApp.states.INITIALIZING){
            if(pixiApp.resourcesToLoad === 0){
                pixiApp.changeState(pixiApp.states.RUNNING);
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
    pixiApp.changeState(pixiApp.states.INITIALIZING);
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
            pixiApp.addGUI();
            pixiApp.resourcesToLoad--;
        });
}

window.onload = function () {
    pixiApp.initGame();
    pixiApp.createPixiApp();
    pixiApp.addLogo();
    pixiApp.loadAssets();
    pixiApp.listenForAnimationUpdate();
}
