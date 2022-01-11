
this.app = new PIXI.Application({
    width: 800, height: 600, resolution: 2
});
cell_y = [0,22,31]
col_x = [-205,-206,-209,-212,-216,-218,-221]
document.body.appendChild(this.app.view);
let spritesheetname;
let tension;
let normal;
let over;
let loose;
let revealed;
let player;
let step = 2;
let previous;
spritesheetname = "frame.json";
brokenglass = "brokenglassnew.json";
alpaca = "alpaca.png";
bgn = "bg.png";
normal = "normal.png";
over = "over.png";
loose = "loose.png";
revealed = "revealed.png";
player = "playeron.png";
loader_background = "progressBarHolder.png";
loader_fill = "progressBarFill.png";

this.preloader = new PIXI.Container()
this.app.stage.addChild(this.preloader)
this.progressBarContainer = new PIXI.Container();
this.preloader.addChild(this.progressBarContainer)
window.kor = this
this.progressBarHolder = new PIXI.Sprite.from('progressBarHolder.png');
this.progressBarHolder.anchor.set(0.5);
this.progressBarHolder.scale.set(0.5);
this.progressBarHolder.x = 400
this.progressBarHolder.y = 380
this.preloader.addChild(this.progressBarHolder)
this.barFill = new PIXI.Graphics().beginFill(0xa752e7, 1).drawRoundedRect(-210, -10, 210, 20, 20).endFill();
this.barFill.x = 295
this.barFill.y = 380
this.barFill.pivot.x = 0;
this.barFill.width = 0;
this.preloader.addChild(this.barFill);
this.percentageLoaded = new PIXI.Text('0%', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    align: 'center',
});
this.percentageLoaded.anchor.set(0.5);
this.percentageLoaded.x = 400
this.percentageLoaded.y = 350
this.preloader.addChild(this.percentageLoaded)
this.logo = new PIXI.Sprite.from('alpaca.png');
this.logo.anchor.set(0.5)
this.logo.scale.set(0.5)
this.logo.x = 400
this.logo.y = 200
this.preloader.addChild(this.logo)

this.loader = new PIXI.Loader();
this.loader.onProgress.add(updateLoadingProgress)
this.loader.onComplete.add(setup)
this.loader.add(spritesheetname);
this.loader.add(brokenglass);
this.loader.add("alpaca",alpaca);
this.loader.add("bgn",bgn);
this.loader.add("normal",normal);
this.loader.add("over",over);
this.loader.add("loose",loose);
this.loader.add("revealed",revealed);
this.loader.add("playeron",player);
this.loader.load()

function updateLoadingProgress(data) {
    var percentage = Math.round(data.progress)
    this.barFill.width = 210 * percentage / 100
    this.barFill.pivot.x = -210
    this.percentageLoaded.text = percentage + '%'
}


//JUST SYMPLE TIMER
let time = 5; 

// SETUP GAME AFTER 1ST LOAD
function setup() {
    this.app.stage.removeChild(this.preloader)
    this.countdown = setInterval(update, 1000) 
    this.container = new PIXI.Container();
    container.name="GAME";
    this.app.stage.addChild(this.container);
    this.bgimage = new PIXI.Sprite(PIXI.Texture.from(bgn));
    this.bgimage.x=-251;
    this.bgimage.y=-243;
    this.bgimage.scale.x=0.23;
    this.bgimage.scale.y=0.25;
    this.container.addChild(this.bgimage);    
    this.text = new PIXI.Text('0:05',{fontFamily : 'Arial', fontSize: 14, fill : 0xffff00, align : 'center'});
    this.text.y=-215;
    this.text.x=-68;
    // Create a new texture
    this.alpacaImg = new PIXI.Sprite(PIXI.Texture.from(alpaca));
    // Move container to the center
    this.container.x = 650;
    this.container.y = 470;
    // Center glass sprite in local this.container coordinates
    this.container.pivot.x = this.container.width / 2;
    this.container.pivot.y = this.container.height / 2;
    let sheet = this.loader.resources[brokenglass].spritesheet;
    this.cells = []
    for(let z = 0; z < 7; z++) {
        const col = new PIXI.Container();
        col.name=z+"_col";
        col.x=col_x[z];
        col.y=32;
        for (let i = 0; i < 3; i++) {
            if(i===0) y =-182;
            if(i===1) y =-137;
            if(i===2) y =-79;
            const cell = new PIXI.Container();
            cell.y = cell_y[i];
            const glass = createObj(normal,i,z,true,"img");
            const looseImg = createObj(loose,i,z,false,"img");
            const overImg = createObj(over,i,z,false,"img");
            const revealedImg = createObj(revealed,i,z,false,"img");
            const playerOn = createObj(player,i,z,false,"img");
            const animated = createObj(sheet.animations["glass_anim"],i,z,false, "anim");
            if(z===0) {
                glass.interactive=true;
            } else {
                glass.interactive=false;
            }       
            cell.addChild(glass);
            cell.addChild(overImg);
            cell.addChild(looseImg);
            cell.addChild(revealedImg);
            cell.addChild(playerOn);
            cell.addChild(animated);
            this.cells.push(cell)
            col.addChild(cell);
            glass.mouseover = function (e) {
                glass.visible=true;
                overImg.visible = true;
                console.log(col.children[1]);
            };
            glass.mouseout = function (e) {
                glass.visible=true;
                overImg.visible = false;
            };
            glass.click = function (e) {
                actionMove(glass,overImg,looseImg,revealedImg,playerOn,animated);
            };
            glass.touchstart = function (e) {
                actionMove(glass,overImg,looseImg,revealedImg,playerOn,animated);
            };
        }
    container.addChild(col);  
    container.addChild(this.text);

    this.restartButton = new PIXI.Graphics().beginFill(0xa752e7, 1).drawRect(0, 0, 40, 15).endFill();
    this.restartButton.x = 540
    this.restartButton.y = 120
    this.restartButton.interactive = true
    this.restartButton.buttonMode = true
    this.restartButton.on("pointerup", () => {
        this.restart()
    })
    this.app.stage.addChild(this.restartButton);

    this.restartButtonText = new PIXI.Text("Restart", {fontFamily : 'Arial', fontSize: 8, fill : 0xffff00, align : 'center'})
    this.restartButtonText.anchor.set(0.5)
    this.restartButtonText.resolution = 2
    this.restartButtonText.x = this.restartButton.width / 2
    this.restartButtonText.y = this.restartButton.height / 2
    this.restartButton.addChild(this.restartButtonText);    
}
//createPlayers(10);

createPlayer();
addMultiplier(this.container);
    
}

// RESTART THE GAME

function restart() {
    this.alpacaImg.scale.x=0.07;
    this.alpacaImg.scale.y=0.07;
    this.alpacaImg.x=-280;
    this.alpacaImg.y=-150;
    this.alpacaImg.alpha=0;
    TweenLite.to(this.alpacaImg, 1, {
        alpha:1,
        ease: Back.easeIn.config(2),
     });
    this.cells.forEach((cell) => {
        cell.children[0].visible = true
        cell.children[1].visible = false
        cell.children[2].visible = false
        cell.children[3].visible = false
        cell.children[4].visible = false
        cell.children[5].visible = false
    })   
    for (var i = 3; i < 10; i++) {
        i === 3 ? color = 0x90ccf3 : color= 0x503519;
        this["text"+i].style.fill = color
     } 
    clearInterval(this.countdown)
    this.text.style.fill = 0xffff00
    this.text.text = "0:05"
    time = 5;
    step = 2;
    this.countdown = setInterval(update, 1000)
    this.enableCells()
}

// MOVE THE PLAYER

function actionMove(glass,overImg,looseImg,revealedImg,playerOn,animated) {
    console.log(glass);
    clearInterval(this.countdown);
    time = 5
    disableCurrentCells();
    if(glass.name === 0) jumpY = -169
    if(glass.name === 1) jumpY = -104
    if(glass.name === 2) jumpY = -35
     TweenLite.to(this.alpacaImg, 2, {
         y: jumpY,
         x: glass.x-225,
         onComplete: () => {
             const random  = Math.floor((Math.random() * 2) + 1);
             if(random === 1) {
                disableCells();
                setTimeout(function () {
                 eval('text'+step).style.fill="yellow";
                 eval('text'+(step+1)).style.fill="0x90ccf3";
                 glass.interactive=false;
                 overImg.visible=false;
                 looseImg.visible=false;
                 glass.visible=false;
                 animated.visible=false;
                 playerOn.visible=true;
                 enableCells();
                 reveal(glass.name,1)
                 this.text.text=`0:05`;
                 time = 5
                 clearInterval(this.countdown);
                 this.countdown = setInterval(update, 1000) 
                }, 5000);
             } else {

                 disableCells();
                 setTimeout(function () {
                 console.log(step);
                 overImg.visible=false;
                 looseImg.visible=false;
                 glass.visible=false;
                 glass.interactive=false;
                 animated.visible=true;
                 animated.play(1);
                 console.log(text3);
                 TweenLite.to(this.alpacaImg.scale, 1, {
                     x:0,
                     y:0
                  });
                  this.text.style.fill="red";
                  console.log(step);
                  eval('text'+(step)).style.fill="red";
                  time = 5
                  clearInterval(this.countdown);
                  reveal(glass.name,2)
                }, 5000);
             }
             
         }
     }); 
}
// CREATE THE MAIN PLAYER
function createPlayer() {
    this.alpacaImg.y=-45;
    this.alpacaImg.scale.x=0.07;
    this.alpacaImg.scale.y=0.07;
    this.alpacaImg.x=-280;
    this.alpacaImg.y=-150;
    this.alpacaImg.alpha=0;
    this.container.addChild(this.alpacaImg);

    TweenLite.to(this.alpacaImg, 1, {
        alpha:1,
        ease: Back.easeIn.config(2),
    });
}
function createPlayers() {
    this.alpacaImg2 = new PIXI.Sprite(PIXI.Texture.from(alpaca));
    // Move container to the center
    this.alpacaImg2.y=-45;
    this.alpacaImg2.scale.x=0.07;
    this.alpacaImg2.scale.y=0.07;
    this.alpacaImg2.x=-280;
    this.alpacaImg2.y=-100;
    this.alpacaImg2.alpha=0;
    this.container.addChild(this.alpacaImg2);

    TweenLite.to(this.alpacaImg2, 1, {
        alpha:1,
        ease: Back.easeIn.config(2),
    });
}
// ADD MOLTIPLIER TO THE TOP BAR
function addMultiplier() {
    let x=-194;
    for (var i = 3; i < 10; i++) {
        i === 3 ? color = 0x90ccf3 : color= 0x503519;
        this["text"+i] = new PIXI.Text(i+'x',{fontFamily : 'Arial', fontSize: 10, fill : color, align : 'center'});;
        this["text"+i].y=-195;
        this["text"+i].x=x;
        this.container.addChild(this["text"+i]);
        x= x+50
     } 
}

function createObj(name,i,z, state,type) {
    let obj;
    if(type==='anim') {
         obj = new PIXI.AnimatedSprite(name);
         obj.animationSpeed = 0.167; 
         obj.loop=false;
    } else {
         obj = new PIXI.Sprite(PIXI.Texture.from(name));
    }
        obj.name=i;
        obj.anchor.set(0.5);
        obj.position.set((z % 7)*51+20, y);
        obj.scale.x=0.4;
        obj.scale.y=0.4;
        obj.visible = state;
        return obj
}
function createAlpacaObj(name,i,z, state,type) {
        let obj;
        obj = new PIXI.Sprite(PIXI.Texture.from(name));
        obj.name=i;
        obj.anchor.set(0.5);
        obj.position.set(-280, -150+(i*10));
        obj.scale.x=0.07;
        obj.scale.y=0.07;
        return obj
}

function disableCells(tension){    
    this.container.children[step-1].children.forEach(element => {
        if (element.children[0]) {
            element.children[0].interactive=false;
        }
    });
    step++;
}

function disableCurrentCells(tension){    
    this.container.children[step-1].children.forEach(element => {
        if (element.children[0]) {
            element.children[0].interactive=false;
        }
    });
}
//REVEAL THE GLASSES
function reveal(exclude,type){  
    let i=0;
     this.container.children[step-2].children.forEach(element => {
        if(i !== exclude) {
            if(type === 2) {
                element.children[0].visible=false;
                element.children[1].visible=false;
                element.children[2].visible=false;
                element.children[3].visible=true;
                element.children[4].visible=false;
            } else {
                element.children[0].visible=false;
                element.children[1].visible=false;
                element.children[2].visible=true;
                element.children[3].visible=false;
                element.children[4].visible=false;                
            } 
        } 
         i++;
     });
}
// ENABLE NEXT CELLS IF PLAYER CHOOSE THE RIGHT POSITION
function enableCells() {
    this.container.children[step-1].children.forEach(element => {
        if (element.children[0]) {
            element.children[0].interactive=true;
        }
    });
}
// JUST A TIMER
function update() {    
  let min = Math.floor(time / 60);
  let sec = time % 60; 
  sec = sec < 10 ? '0' + sec : sec;
  this.text.text=`${min}:${sec}`;
  time--;
  if(sec == 0) {
      console.log('1');
    clearInterval(this.countdown);
    const random  = Math.floor((Math.random() * 2) + 1);
    console.log(container.children[1].children[0]);
    actionMove(container.children[step-1].children[random].children[0],container.children[step-1].children[random].children[1],container.children[step-1].children[random].children[2],container.children[step-1].children[random].children[3],container.children[step-1].children[random].children[4],container.children[step-1].children[random].children[5])
    time = 5;
  }
   
}
