import * as PIXI from 'pixi.js-legacy';
import '@pixi/math-extras';
import '@pixi/sound';
import * as Sound from '@pixi/sound';

import './TweenLite.min';
import './TweenMax.min';

let y;
let time = 5;
let step = 1;

const cell_y = [0, 22, 31];
const col_x = [-205, -206, -209, -212, -216, -218, -221];

let APP = {};

const spritesheetname = "/images/squid-game/frame.json",
  brokenglass = "/images/squid-game/brokenglassnew.json",
  alpaca = "/images/squid-game/alpaca.png",
  bgn = "/images/squid-game/bg.png",
  normal = "/images/squid-game/normal.png",
  over = "/images/squid-game/over.png",
  loose = "/images/squid-game/loose.png",
  revealed = "/images/squid-game/revealed.png",
  player = "/images/squid-game/playeron.png",
  loader_background = "/images/squid-game/progressBarHolder.png",
  loader_fill = "/images/squid-game/progressBarFill.png";

const initGame = (canvas, options) => {
  // console.log('canvas', canvas);
  // console.log('options', options);
  APP.app = new PIXI.Application({
    width: options.width,
    height: options.height,
    // resolution: 2,
    view: canvas,
    backgroundColor: 0x12132e,
    resizeTo: canvas.parentElement,
    resolution: 1,
    antialias: true,
  });

  // document.body.appendChild(APP.app.view);

  APP.preloader = new PIXI.Container()
  APP.app.stage.addChild(APP.preloader)
  APP.progressBarContainer = new PIXI.Container();
  APP.preloader.addChild(APP.progressBarContainer)
  window.kor = APP;
  APP.progressBarHolder = new PIXI.Sprite.from('progressBarHolder.png');
  APP.progressBarHolder.anchor.set(0.5);
  APP.progressBarHolder.scale.set(0.5);
  APP.progressBarHolder.x = 400
  APP.progressBarHolder.y = 380
  APP.preloader.addChild(APP.progressBarHolder)
  APP.barFill = new PIXI.Graphics().beginFill(0xa752e7, 1).drawRoundedRect(-210, -10, 210, 20, 20).endFill();
  APP.barFill.x = 295
  APP.barFill.y = 380
  APP.barFill.pivot.x = 0;
  APP.barFill.width = 0;
  APP.preloader.addChild(APP.barFill);
  APP.percentageLoaded = new PIXI.Text('0%', {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 0xffffff,
    align: 'center',
  });
  APP.percentageLoaded.anchor.set(0.5);
  APP.percentageLoaded.x = 400
  APP.percentageLoaded.y = 350
  APP.preloader.addChild(APP.percentageLoaded)
  APP.logo = new PIXI.Sprite.from('alpaca.png');
  APP.logo.anchor.set(0.5)
  APP.logo.scale.set(0.5)
  APP.logo.x = 400
  APP.logo.y = 200
  APP.preloader.addChild(APP.logo)

  APP.loader = new PIXI.Loader();
  APP.loader.onProgress.add(updateLoadingProgress)
  APP.loader.onComplete.add(setup)
  APP.loader.add(spritesheetname);
  APP.loader.add(brokenglass);
  APP.loader.add("alpaca", alpaca);
  APP.loader.add("bgn", bgn);
  APP.loader.add("normal", normal);
  APP.loader.add("over", over);
  APP.loader.add("loose", loose);
  APP.loader.add("revealed", revealed);
  APP.loader.add("playeron", player);
  APP.loader.load();

  //JUST SYMPLE TIMER
  APP.playersInPlay = 11;

  return APP;
}

function updateLoadingProgress(data) {
  var percentage = Math.round(data.progress)
  APP.barFill.width = 210 * percentage / 100
  APP.barFill.pivot.x = -210
  APP.percentageLoaded.text = percentage + '%'
}


// SETUP GAME AFTER 1ST LOAD
function setup() {
  APP.app.stage.removeChild(APP.preloader)
  APP.countdown = setInterval(update, 1000)
  APP.container = new PIXI.Container();
  APP.container.name = "GAME";
  APP.app.stage.addChild(APP.container);
  APP.bgimage = new PIXI.Sprite(PIXI.Texture.from(bgn));
  APP.bgimage.x = -251;
  APP.bgimage.y = -243;
  APP.bgimage.scale.x = 0.23;
  APP.bgimage.scale.y = 0.25;
  APP.container.addChild(APP.bgimage);
  APP.text = new PIXI.Text('0:05', {fontFamily: 'Arial', fontSize: 14, fill: 0xffff00, align: 'center'});
  APP.text.y = -215;
  APP.text.x = -68;
  // Create a new texture
  APP.alpacaImg = new PIXI.Sprite(PIXI.Texture.from(alpaca));
  // Move container to the center
  APP.container.x = 650;
  APP.container.y = 470;
  // Center glass sprite in local APP.container coordinates
  APP.container.pivot.x = APP.container.width / 2;
  APP.container.pivot.y = APP.container.height / 2;
  let sheet = APP.loader.resources[brokenglass].spritesheet;
  APP.cells = [];
  for (let z = 0; z < 7; z++) {
    const col = new PIXI.Container();
    col.name = z + "_col";
    col.x = col_x[z];
    col.y = 32;
    for (let i = 0; i < 3; i++) {
      if (i === 0) y = -182;
      if (i === 1) y = -137;
      if (i === 2) y = -79;
      const cell = new PIXI.Container();
      cell.y = cell_y[i];
      const glass = createObj(normal, i, z, true, "img");
      glass.buttonMode = true
      const looseImg = createObj(loose, i, z, false, "img");
      const overImg = createObj(over, i, z, false, "img");
      const revealedImg = createObj(revealed, i, z, false, "img");
      const playerOn = createObj(player, i, z, false, "img");
      const animated = createObj(sheet.animations["glass_anim"], i, z, false, "anim");
      if (z === 0) {
        glass.interactive = true;
      } else {
        glass.interactive = false;
      }
      cell.addChild(glass);
      cell.addChild(overImg);
      cell.addChild(looseImg);
      cell.addChild(revealedImg);
      cell.addChild(playerOn);
      cell.addChild(animated);
      APP.cells.push(cell)
      col.addChild(cell);
      glass.mouseover = function (e) {
        glass.visible = true;
        overImg.visible = true;
      };
      glass.mouseout = function (e) {
        glass.visible = true;
        overImg.visible = false;
      };
      glass.click = (e) => {
        step++;
        APP.winningPosition = randIntInRange(0, 2)
        if (APP.alpacaImg.scale.x > 0) {
          actionMove(APP.alpacaImg, glass.name, glass, overImg, looseImg, revealedImg, playerOn, animated);
        }
        APP.randomPlayers.forEach((randomPlayer) => {
          if (randomPlayer.scale.x > 0) {
            var random = randIntInRange(0, 2)
            actionMove(randomPlayer, random, APP.container.children[step - 1].children[random].children[0], APP.container.children[step - 1].children[random].children[1], APP.container.children[step - 1].children[random].children[2], APP.container.children[step - 1].children[random].children[3], APP.container.children[step - 1].children[random].children[4], APP.container.children[step - 1].children[random].children[5])
          }
        })
      };
      glass.touchstart = (e) => {
        step++;
        APP.winningPosition = randIntInRange(0, 2)
        if (APP.alpacaImg.scale.x > 0) {
          actionMove(APP.alpacaImg, glass.name, glass, overImg, looseImg, revealedImg, playerOn, animated);
        }
        APP.randomPlayers.forEach((randomPlayer) => {
          if (randomPlayer.scale.x > 0) {
            var random = randIntInRange(0, 2)
            actionMove(randomPlayer, random, APP.container.children[step - 1].children[random].children[0], APP.container.children[step - 1].children[random].children[1], APP.container.children[step - 1].children[random].children[2], APP.container.children[step - 1].children[random].children[3], APP.container.children[step - 1].children[random].children[4], APP.container.children[step - 1].children[random].children[5])
          }
        })
      };
    }
    APP.container.addChild(col);
    APP.container.addChild(APP.text);

    APP.restartButton = new PIXI.Graphics().beginFill(0xa752e7, 1).drawRect(0, 0, 40, 15).endFill();
    APP.restartButton.x = 540
    APP.restartButton.y = 120
    APP.restartButton.interactive = true
    APP.restartButton.buttonMode = true
    APP.restartButton.on("pointerup", () => {
      restart()
    })
    APP.app.stage.addChild(APP.restartButton);

    APP.restartButtonText = new PIXI.Text("Restart", {
      fontFamily: 'Arial',
      fontSize: 8,
      fill: 0xffff00,
      align: 'center'
    })
    APP.restartButtonText.anchor.set(0.5)
    APP.restartButtonText.resolution = 2
    APP.restartButtonText.x = APP.restartButton.width / 2
    APP.restartButtonText.y = APP.restartButton.height / 2
    APP.restartButton.addChild(APP.restartButtonText);
  }

  createPlayer();
  createPlayers(10);

  addMultiplier(APP.container);

}

// RESTART THE GAME

function restart() {
  APP.playersInPlay = 11
  APP.alpacaImg.scale.x = 0.07;
  APP.alpacaImg.scale.y = 0.07;
  APP.alpacaImg.x = -280;
  APP.alpacaImg.y = -200;
  APP.alpacaImg.alpha = 0;
  window.TweenLite.to(APP.alpacaImg, 1, {
    alpha: 1,
    ease: window.Back.easeIn.config(2),
  });
  APP.cells.forEach((cell) => {
    cell.children[0].visible = true
    cell.children[1].visible = false
    cell.children[2].visible = false
    cell.children[3].visible = false
    cell.children[4].visible = false
    cell.children[5].visible = false
  })
  for (var i = 3; i < 10; i++) {
    let color;
    i === 3 ? color = 0x90ccf3 : color = 0x503519;
    APP["text" + i].style.fill = color
  }

  APP.randomPlayers.forEach((randomPlayer, index) => {
    randomPlayer.scale.set(0.07)
    randomPlayer.x = -280
    randomPlayer.y = -180 + index * 20
    randomPlayer.alpha = 0
    window.TweenLite.to(randomPlayer, 1, {
      alpha: 1,
      ease: window.Back.easeIn.config(2),
    });
  })
  clearInterval(APP.countdown)
  APP.text.style.fill = 0xffff00
  APP.text.text = "0:05"
  time = 5;
  step = 1;
  APP.countdown = setInterval(update, 1000)
  enableCells()
}

// MOVE THE PLAYER

function actionMove(player, pos, glass, overImg, looseImg, revealedImg, playerOn, animated) {
  let jumpY;
  clearInterval(APP.countdown);
  time = 5
  disableCurrentCells();
  APP.container.addChild(APP.alpacaImg)
  if (glass.name === 0) jumpY = -169
  if (glass.name === 1) jumpY = -104
  if (glass.name === 2) jumpY = -35
  window.TweenLite.to(player, 2, {
    y: jumpY,
    x: glass.x - 225,
    onComplete: () => {
      if (APP.winningPosition === pos) {
        if (player == APP.alpacaImg) {
          disableCells();
        }
        setTimeout(function () {
          glass.interactive = false;
          overImg.visible = false;
          looseImg.visible = false;
          glass.visible = false;
          animated.visible = false;
          playerOn.visible = true;
          if (player === APP.alpacaImg) {
            APP[`text${step + 1}`].style.fill = "yellow";
            APP[`text${step + 2}`].style.fill = "0x90ccf3";
            enableCells();
          }
          if (APP.playersInPlay > 0) {
            APP.text.text = `0:05`;
            time = 5
            clearInterval(APP.countdown);
            APP.countdown = setInterval(update, 1000)
          } else {
            clearInterval(APP.countdown);
          }

          reveal(glass.name, 1)
        }, 5000);
      } else {
        if (player == APP.alpacaImg) {
          disableCells();
        }
        setTimeout(function () {
          overImg.visible = false;
          looseImg.visible = false;
          glass.visible = false;
          glass.interactive = false;
          animated.visible = true;
          animated.play(1);
          window.TweenLite.to(player.scale, 1, {
            x: 0,
            y: 0
          });
          APP.playersInPlay--
          if (player === APP.alpacaImg) {
            APP.text.style.fill = "red";
            APP[`text${step + 1}`].style.fill = "red";
            // eval('text' + (step + 1)).style.fill = "red";
          }
          if (APP.playersInPlay > 0) {
            APP.text.text = `0:05`;
            time = 5
            clearInterval(APP.countdown);
            APP.countdown = setInterval(update, 1000)
          } else {
            clearInterval(APP.countdown);
          }
          reveal(glass.name, 2)
        }, 5000);
      }

    }
  });
}

function randIntInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// CREATE THE MAIN PLAYER
function createPlayer() {
  APP.alpacaImg.y = -45;
  APP.alpacaImg.scale.x = 0.07;
  APP.alpacaImg.scale.y = 0.07;
  APP.alpacaImg.x = -280;
  APP.alpacaImg.y = -200;
  APP.alpacaImg.alpha = 0;
  APP.container.addChild(APP.alpacaImg);

  window.TweenLite.to(APP.alpacaImg, 1, {
    alpha: 1,
    ease: window.Back.easeIn.config(2),
  });
}

function createPlayers(count) {
  APP.randomPlayers = []
  for (var i = 0; i < count; i++) {
    var randomPlayer = new PIXI.Sprite(PIXI.Texture.from(alpaca));
    // Move container to the center
    randomPlayer.scale.x = 0.07;
    randomPlayer.scale.y = 0.07;
    randomPlayer.x = -280;
    randomPlayer.y = -180 + (i * 20);
    randomPlayer.alpha = 0;
    randomPlayer.tint = 0x999999
    APP.container.addChild(randomPlayer);
    APP.randomPlayers.push(randomPlayer)
    window.TweenLite.to(randomPlayer, 1, {
      alpha: 1,
      ease: window.Back.easeIn.config(2),
    });
  }

}

// ADD MOLTIPLIER TO THE TOP BAR
function addMultiplier() {
  let color;
  let x = -194;
  for (var i = 3; i < 10; i++) {
    i === 3 ? color = 0x90ccf3 : color = 0x503519;
    APP["text" + i] = new PIXI.Text(i + 'x', {fontFamily: 'Arial', fontSize: 10, fill: color, align: 'center'});
    ;
    APP["text" + i].y = -195;
    APP["text" + i].x = x;
    APP.container.addChild(APP["text" + i]);
    x = x + 50
  }
}

function createObj(name, i, z, state, type) {
  let obj;
  if (type === 'anim') {
    obj = new PIXI.AnimatedSprite(name);
    obj.animationSpeed = 0.167;
    obj.loop = false;
  } else {
    obj = new PIXI.Sprite(PIXI.Texture.from(name));
  }
  obj.name = i;
  obj.anchor.set(0.5);
  obj.position.set((z % 7) * 51 + 20, y);
  obj.scale.x = 0.4;
  obj.scale.y = 0.4;
  obj.visible = state;
  return obj
}

function createAlpacaObj(name, i, z, state, type) {
  let obj;
  obj = new PIXI.Sprite(PIXI.Texture.from(name));
  obj.name = i;
  obj.anchor.set(0.5);
  obj.position.set(-280, -150 + (i * 10));
  obj.scale.x = 0.07;
  obj.scale.y = 0.07;
  return obj
}

function disableCells(tension) {
  APP.container.children[step - 1].children.forEach(element => {
    if (element.children[0]) {
      element.children[0].interactive = false;
    }
  });
}

function disableCurrentCells(tension) {
  APP.container.children[step - 1].children.forEach(element => {
    if (element.children[0]) {
      element.children[0].interactive = false;
    }
  });
}

//REVEAL THE GLASSES
function reveal(exclude, type) {
  let i = 0;
  APP.container.children[step - 1].children.forEach(element => {
    if (i !== exclude) {
      if (type === 2) {
        element.children[0].visible = false;
        element.children[1].visible = false;
        element.children[2].visible = false;
        element.children[3].visible = true;
        element.children[4].visible = false;
      } else {
        element.children[0].visible = false;
        element.children[1].visible = false;
        element.children[2].visible = true;
        element.children[3].visible = false;
        element.children[4].visible = false;
      }
    }
    i++;
  });
}

// ENABLE NEXT CELLS IF PLAYER CHOOSE THE RIGHT POSITION
function enableCells() {
  APP.container.children[step].children.forEach(element => {
    if (element.children[0]) {
      element.children[0].interactive = true;
    }
  });
}

// JUST A TIMER
function update() {
  let min = Math.floor(time / 60);
  let sec = time % 60;
  sec = sec < 10 ? '0' + sec : sec;
  APP.text.text = `${min}:${sec}`;
  time--;
  if (sec == 0) {
    step++;
    clearInterval(APP.countdown);
    APP.winningPosition = randIntInRange(0, 2)
    var random = randIntInRange(0, 2)
    if (APP.alpacaImg.scale.x > 0) {
      actionMove(APP.alpacaImg, random, APP.container.children[step - 1].children[random].children[0], APP.container.children[step - 1].children[random].children[1], APP.container.children[step - 1].children[random].children[2], APP.container.children[step - 1].children[random].children[3], APP.container.children[step - 1].children[random].children[4], APP.container.children[step - 1].children[random].children[5])
    }
    time = 5;
    APP.randomPlayers.forEach((randomPlayer) => {
      if (randomPlayer.scale.x > 0) {
        var random = randIntInRange(0, 2)
        actionMove(randomPlayer, random, APP.container.children[step - 1].children[random].children[0], APP.container.children[step - 1].children[random].children[1], APP.container.children[step - 1].children[random].children[2], APP.container.children[step - 1].children[random].children[3], APP.container.children[step - 1].children[random].children[4], APP.container.children[step - 1].children[random].children[5])
      }
    })
  }

}

// initGame();

export {
  initGame,
  restart,
  setup,
  enableCells,
  reveal
}
