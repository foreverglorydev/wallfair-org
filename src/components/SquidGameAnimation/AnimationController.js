import styles from './styles.module.scss';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { isMobile } from 'react-device-detect';
import * as PIXI from 'pixi.js-legacy';
import '@pixi/math-extras';
import '@pixi/sound';
import TWEEN from '@tweenjs/tween.js';


const app = new PIXI.Application({
    width: 800, height: 600, resolution: 2
});

let cell_y = [0,22,31]
let col_x = [-205,-206,-209,-212,-216,-218,-221]
let tension;
let step = 2;
let previous;
let spritesheetname = "frame.json";
let brokenglass = "brokenglassnew.json";
let alpaca = "alpaca.png";
let bgn = "bg.png";
let normal = "normal.png";
let over = "over.png";
let loose = "loose.png";
let revealed = "revealed.png";
let player = "playeron.png";
let loader = new PIXI.Loader
loader
    .add(spritesheetname)
    .add(brokenglass)
    .add("alpaca",alpaca)
    .add("bgn",bgn)
    .add("normal",normal)
    .add("over",over)
    .add("loose",loose)
    .add("revealed",revealed)
    .add("playeron",player)
    .load(setup);
const container = new PIXI.Container();
container.name="GAME";
app.stage.addChild(container);
const bgimage = new PIXI.Sprite(PIXI.Texture.from(bgn));
bgimage.x=-251;
bgimage.y=-243;
bgimage.scale.x=0.23;
bgimage.scale.y=0.25;
container.addChild(bgimage);

let text = new PIXI.Text('00:00',{fontFamily : 'Arial', fontSize: 14, fill : 0xffff00, align : 'center'});
text.y=-215;
text.x=-68;


// Create a new texture
const alpacaImg = new PIXI.Sprite(PIXI.Texture.from(alpaca));
// Move container to the center
container.x = app.screen.width / 2;
container.y = app.screen.height / 2;

// Center glass sprite in local container coordinates
container.pivot.x = container.width / 2;
container.pivot.y = container.height / 2;
app.ticker.add((delta) => {
    // rotate the container!
    // use delta to create frame-independent transform
    //container.rotation -= 0.01 * delta;
});
class AnimationController {
  init(body) {
    body.appendChild(app.view);

  }

}
export default new AnimationController();

function setup() {

    let sheet = loader.resources[brokenglass].spritesheet;
    for(let z = 0; z < 7; z++) {
        const col = new PIXI.Container();
        col.x=col_x[z];
        col.y=32;
        let y
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
            const animated = createObj(sheet?.animations["glass_anim"],i,z,false, "anim");
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
            col.addChild(cell);
            glass.mouseover = function (e) {
                glass.visible=true;
                overImg.visible = true;
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
    container.addChild(text);

}
//createPlayers(10);
createPlayer();
addMultiplier(container);

}
function actionMove(glass,overImg,looseImg,revealedImg,playerOn,animated) {
    disableCurrentCells();
    let jumpY
    if(glass.name === 0) jumpY = -169
    if(glass.name === 1) jumpY = -104
    if(glass.name === 2) jumpY = -35
     TWEEN.to(alpacaImg, 2, {
         y: jumpY,
         x: glass.x-225,
         onComplete: () => {
             const random  = Math.floor((Math.random() * 2) + 1);
             if(random === 1) {
                 disableCells();
                 console.log(step);
                 eval('text'+step).style.fill="yellow";
                 eval('text'+(step+1)).style.fill="0x90ccf3";
                 console.log("GALSS NAME",glass.name);
                 glass.interactive=false;
                 overImg.visible=false;
                 looseImg.visible=false;
                 glass.visible=false;
                 animated.visible=false;
                 playerOn.visible=true;
                 enableCells();
                 reveal(glass.name,1)
             } else {
                 disableCells();
                 console.log(step);
                 overImg.visible=false;
                 looseImg.visible=false;
                 glass.visible=false;
                 glass.interactive=false;
                 animated.visible=true;
                 animated.play(1);
                 // console.log(text3);
                 TWEEN.to(alpacaImg.scale, 1, {
                     x:0,
                     y:0
                  });
                  text.style.fill="red";
                  console.log(step);
                  eval('text'+(step)).style.fill="red";
                  clearInterval(countdown);
                  reveal(glass.name,2)
                 // app.stage.removeChild();
                  //for (var i = app.stage.children.length - 1; i >= 0; i--) {	app.stage.removeChild(app.stage.children[i]);};
                  //setup();
             }

         }
     });
}
function createPlayers(players) {
    let alpacaImgOtherPlayers = []
    for (let index = 0; index < players; index++) {
        alpacaImgOtherPlayers[index] = createAlpacaObj('alpaca',index);
        container.addChild(alpacaImgOtherPlayers[index]);
    }
}
function createPlayer(paras) {
alpacaImg.y=-45;
alpacaImg.scale.x=0.07;
alpacaImg.scale.y=0.07;
alpacaImg.x=-280;
alpacaImg.y=-150;
alpacaImg.alpha=0;
container.addChild(alpacaImg);

 TWEEN.to(alpacaImg, 1, {
    alpha:1,
    //ease: Back.easeIn.config(2),
 });
}
function addMultiplier() {
    let x=-194;
    let color;
    for (var i = 3; i < 10; i++) {
        i === 3 ? color = 0x90ccf3 : color= 0x503519;
        this["text"+i] = new PIXI.Text(i+'x',{fontFamily : 'Arial', fontSize: 10, fill : color, align : 'center'});;
        this["text"+i].y=-195;
        this["text"+i].x=x;
        container.addChild(this["text"+i]);
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
        let y = 0
        //y not init
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
    container.children[step-1].children.forEach(element => {
        element.children[0].interactive=false;
    });
    step++;
}

function disableCurrentCells(tension){
    container.children[step-1].children.forEach(element => {
        element.children[0].interactive=false;
    });
}
//REVEAL THE GLASSES
function reveal(exclude,type){
    let i=0;
    let previousreveal;
    console.log("EXCLUDE",exclude);
     container.children[step-2].children.forEach(element => {
         console.log(element);

        if(i !== exclude) {
            if(type === 2) {
                element.children[0].visible=false;
                element.children[1].visible=false;
                element.children[2].visible=false;
                element.children[3].visible=true;
                element.children[4].visible=false;
            } else {
                console.log("sddsds");
                element.children[0].visible=false;
                element.children[1].visible=false;
                element.children[2].visible=true;
                element.children[3].visible=false;
                element.children[4].visible=false;
                //element.children[4].play();

            }

        }

         i++;
     });
}
// ENABLE NEXT CELLS IF PLAYER CHOOSE THE RIGHT POSITION
function enableCells() {
    console.log(step);
    container.children[step-1].children.forEach(element => {
        element.children[0].interactive=true;
    });
}
//JUST SYMPLE TIMER
let sMin = 5;
let time = sMin * 60;
let countdown = setInterval(update, 1000)
function update() {
  let min = Math.floor(time / 60);
  let sec = time % 60;
  sec = sec < 10 ? '0' + sec : sec;
  text.text=`${min}:${sec}`;
  time--;
  min == 0 && sec == 0 ? clearInterval(countdown) : console.log(countdown);

}
