import {options} from 'components/EmailNotifications/options';
import {init} from 'store/sagas/websockets';

import * as PIXI from 'pixi.js-legacy';
import '@pixi/math-extras';
import '@pixi/sound';
import * as Sound from '@pixi/sound';

//game deps
import {initGame} from './game/container';


PIXI.utils.skipHello();



export class AudioController {
  constructor(bgmIndex = 0) {
    let volume = 0.0;
    try {
      const savedVolume = localStorage.getItem('gameVolume');
      this.volume = savedVolume ? parseFloat(savedVolume) : volume;
    } catch (e) {
      this.volume = 0;
      console.error(e);
    }
    this.errors = [];
    this.bgmIndex = bgmIndex;
    this.elapsed = 0;
    this.ready = true;

    Sound.sound.add(
      {
        bgm: {
          url: '/sounds/mines/bgm.mp3',
          loop: true,
        },
        lose: {
          url: '/sounds/elon/sfx_lose.mp3',
          loop: false,
        },
        cashout: {
          url: '/sounds/elon/sfx_cashout3.mp3',
          loop: false,
        },
        placebet: {
          url: '/sounds/elon/sfx_placebet.mp3',
          loop: false,
        },
        coin: {
          url: '/sounds/mines/sfx-coin.mp3',
          loop: false,
        },
        poop: {
          url: '/sounds/mines/sfx-poop.mp3',
          loop: false,
        }
      },
      {
        loaded: (err, data) => {
          if (err) {
            this.errors = [...this.errors, err];
          }
        },
        preload: false
      }
    );
  }

  setVolume(volume = 1) {
    try {
      if (volume === 1 || volume === '1') {
        this.volume = 1.0;
      } else if (!volume) {
        this.volume = 0.0;
      } else {
        this.volume = volume;
      }
      localStorage.setItem('gameVolume', `${volume}`);
      Sound.sound.volume('bgm', volume);
    } catch (e) {
      console.error('Audio output error');
    }
  }

  mute() {
    localStorage.setItem('gameVolume', 0);
    this.setVolume(0);
  }

  setElapsed(elapsed) {
    this.elapsed = elapsed;
  }

  setBgmIndex(idx = 0) {
    this.bgmIndex = idx;
  }

  playSound(name, loop = false, volume) {
    try {
      if (this.ready) {
        Sound.sound.volume(name, volume && this.volume != 0 ? volume : this.volume === 0 ? '0.0' : this.volume);
        Sound.sound.play(name, {
          loop: loop
        });
      }
    } catch (e) {
      console.error('Audio output error');
    }
  }

  stopSound(name) {
    Sound.sound.stop(name);
  }

  startBgm() {
    const diff = this.elapsed / 1000;
    if (this.bgmIndex === 0) {
      this.playSound('bgm', true);
    }
  }

  stopBgm() {
    this.stopSound('bgm');
  }

  playTick() {
    this.playSound('tick', false, 1);
  }

  playGameOverSound() {
    this.playSound('gameover');
  }

  playLoseSound() {
    this.playSound('lose', false, 1);
  }

  playWinSound() {
    this.playSound('cashout', false, 1);
  }

  playBetSound() {
    this.playSound('placebet');
  }

  playCoinSfx() {
    this.playSound('coin');
  }

  playPoopSfx() {
    this.playSound('poop');
  }
}

class AnimationController {
  init(canvas, options) {
    const {applicationConfig, width, height} = options;
    this.game = initGame(canvas, options);
    this.canvas = canvas;
    this.canvas.width = width;
    this.canvas.height = height;
    this.audio = new AudioController(0);
    this.audio.startBgm();

    this.idle = true
    this.risk = options.risk
    this.amount = options.amount

    return {
      audio: this.audio,
      that: this
    };
  }

  destroy() {
    this.idle = false;
  }

  async clickCell(props) {

  }

  restart() {

  }
}

export default new AnimationController();
