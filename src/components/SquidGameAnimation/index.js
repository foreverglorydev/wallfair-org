import * as PIXI from 'pixi.js-legacy';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector, connect } from 'react-redux';
import _ from 'lodash';
import styles from './styles.module.scss';
import { RosiGameActions } from '../../store/actions/rosi-game';
import GameAudioControlsLocal from '../GameAudioControlsLocal';
import { isMobile } from 'react-device-detect';
import AnimationController from "../SquidGameAnimation/AnimationController";
import {AlertActions} from "../../store/actions/alert";
import { selectUser } from '../../store/selectors/authentication';

const SquidGameAnimation = ({
  connected,
  muteButtonClick,
  setMines,
  mines,
  onInit,
  onEnd,
  setBet,
  bet,
  setAmount,
  amount,
  gameInProgress,
  setGameInProgress,
  gameApi,
  setCurrentStep,
  setCashouts,
  cashouts,
  gameOver,
  setGameOver,
  currentStep,
  outcomes,
  setOutcomes,
  demoCount,
  setDemoCount,
  gameInstance,
  setGameInstance,
  getLastCashout,
  onCashout
}) => {
  const dispatch = useDispatch();
  const canvasRef = useRef(null);
  const backgroundRef = useRef(null);
  const user = useSelector(selectUser);

  const [gameConfig, setGameConfig] = useState({});
  const [audio, setAudio] = useState(null);
  const [array, setArray] = useState([]);
  const [automine, setAutomine] = useState(0);
  const [running, setRunning] = useState(false);

  const getTranslatedReveal = (clientBoard, result = 0) => {
      let col = 0;
      let row = 0;

      const toReveal = clientBoard?.map((entry, index)=> {
        if(index % 5 === 0) {
          row++;
          col = 0;
        }

        const item = {
          row: row-1,
          col: col,
          isMine: false,
          isRevealed: entry === result ? true : false,
          isEmpty: true,
          isFlagged: false,
          text: ""
        };
        col++;

        return item;
      }).filter((entry)=> {
        return entry.isRevealed;
      });

    return toReveal;
  }

  const cellClickHandler = (data) => {
  // setCurrentStep((current)=> {
    //   return current+1;
    // })
  }

  //get position in proper notation 5*5
  const getCellPosition = (row,col) => {
    return ((row * 5) + col);
  }

  const checkDemo = async (props) => {
    setCurrentStep((step) => step+1);
  }

  const loseDemo = async (props) => {
    setGameInProgress(false);
    //disable place button before
    getLastCashout({profit: -amount})
    setBet((bet) => {
      return {
        ...bet,
        pending: true
      }
    })

    setTimeout(()=> {
      setBet((bet) => {
          return {
            pending: false,
            done: false
          }
      });
    }, 3000)
    setCurrentStep(0);
    setRunning(false)

  }

  const checkSelectedCell = async (props) => {
    const {row, col} = props;
    let allMinesPos = null;
    setCurrentStep((step) => step+1);

    const queryPayload = {
      position: getCellPosition(row, col) //0-24
    }

    if(user.isLoggedIn) {
      const checkMine = await gameApi.checkCellMines(queryPayload).catch((err)=> {
        dispatch(AlertActions.showError(err.message));
      });

      const isMine = checkMine?.data?.result === 0 ? false : true;

      if(isMine) {
        allMinesPos = getTranslatedReveal(checkMine?.data?.board, 1);
        handleLost(checkMine?.data);
      }

      const hiddenFields = checkMine?.data.clientBoard.filter((item)=> {
        return item === 2;
      }).length;

      if(hiddenFields === mines) {
        //wait for animation
        setTimeout(()=> {
          document.getElementById('mines-cashout-btn').click();
        }, 500)
      }

      return {
        col,
        row,
        isEmpty: true,
        isFlagged: false,
        isMine,
        isRevealed: true,
        text: "",
        allMinesPos
      }
    } else {
      //handle demo
      return null;
    }
  }

  const handleLost = (checkMine) => {
    setGameInProgress(false);
    //disable place button before
    setBet((bet) => {
      return {
        ...bet,
        pending: true
      }
    })

    setTimeout(()=> {
      setBet((bet) => {
        if(bet.autobet){
          return {
            ...bet,
            pending: false,
            done: false,
            win: false
          }
        } else{
          return {
            pending: false,
            done: false
          }
        }
      });
    }, 3000)

    setCurrentStep(0);
    setRunning(false)

    const prepareObj = {
      type: 'loss',
      value: '-' + amount,
      gameHash: checkMine?.gameHash
    }
    setCashouts((cashouts) => [prepareObj, ...cashouts]);
  }

  async function nextMine(array, automine, aux){
    if(!running && !aux) return
    const {value} = await gameInstance.game.controller.onClickOnCell(array[automine]);
    if(!value) {
      //setTimeout(() => {setBet((bet) => {console.log("lose");return {...bet, done: false}});}, 5000)
    }
    else if(automine >= bet.cleared-1){
      setTimeout(() => {
        setBet((bet) => {return {...bet, done: false, win: true}})},
      2000)
    }
    else if(value) {
      setTimeout(() => nextMine(array, automine + 1, true), 500)
    }
  }

  useEffect(() => {
    const configBase = _.cloneDeep({
      testCfg: 'test'
    });
    configBase.isLoggedIn = user.isLoggedIn;

    if(user.isLoggedIn) {

      setGameConfig({
        ...configBase
      })

      // gameApi.getCurrentMines()
      //   .then(response => {
      //     const {data} = response;
      //     const {game_payload} = data;
      //
      //     if(data?._inProgress) {
      //       setGameInProgress(true);
      //       setBet((bet)=>{return{
      //         ...bet,
      //         pending: false,
      //         done: true
      //       }});
      //       _.set(configBase, 'initialReveal', getTranslatedReveal(game_payload.clientBoard));
      //
      //       const tries = data._tries;
      //       setOutcomes(data?._outcomes);
      //       setCurrentStep(tries);
      //     } else {
      //       setGameInProgress(false);
      //       setBet((bet)=>{return{
      //         ...bet,
      //         pending: false,
      //         done: false
      //       }});
      //     }
      //
      //     setGameConfig({
      //       ...configBase
      //     })
      //   }).catch(error => {
      //   dispatch(AlertActions.showError(error.message));
      // });
    } else {
      // //init demo rounds / show grid
      // configBase.setGridManually = false;
      //
      // setGameConfig({
      //   ...configBase
      // })
    }


  }, [user.isLoggedIn])

  useEffect(()=> {
    let audioInstance = null;

    console.log('gameConfig', gameConfig);

    if(!_.isEmpty(gameConfig)) {
      //avoid attaching multiple click events, when re-init
      // if(gameInstance) {
      //   gameInstance.game.controller.removeListeners();
      // }
      const applicationConfig = {
        width: backgroundRef.current.clientWidth,
        height: backgroundRef.current.clientHeight,
        "antialias": false,
        "backgroundColor": 0xffffff,
        view: canvasRef.current
      }

      const { audio, that } = AnimationController.init(canvasRef.current, {
        width: applicationConfig.width,
        height: applicationConfig.height,
        applicationConfig
      });
      // setGameInstance(that);
      setAudio(audio);
      audioInstance = audio;
      onInit(audio);

      return () => {
        audioInstance.stopBgm();
        // that.destroy();
      }
    }

  },[gameConfig])


  useEffect(()=> {
    if(gameOver) {
      gameInstance.game.controller.view.gameOver("win");
      setGameOver(false);
    }
  },[gameOver])


  // useEffect(()=> {
  //   if(demoCount > 0) {
  //     const gameConfigDemo = _.cloneDeep(gameConfigBase);
  //     gameConfigDemo.setGridManually = false;
  //     gameConfigDemo.grid = [];
  //     gameConfigDemo.defaultGrid.minesAmount = mines;
  //
  //     setGameConfig({
  //         ...gameConfigDemo
  //     })
  //   }
  // },[demoCount])

  return (
    <div
      ref={backgroundRef}
      className={classNames(
        styles.animation,
        isMobile && styles.animationMobile
      )}
    >
      <div className={styles.audioControls}>
        {audio && <GameAudioControlsLocal audio={audio} muteButtonClick={muteButtonClick} color={'#ffd401'}/>}
      </div>

      <div>
        {/*{(!bet.done && !bet.autobet) && <div className={classNames(styles.notBetYetScreen)}>*/}
        {/*  <div className={classNames(styles.notBetYetText)}>Place a bet in order to start the game!</div>*/}
        {/*</div>}*/}
        <canvas id="squid-canvas" className={classNames(styles.canvas, {
          [styles.notClickable]: false
        })} ref={canvasRef}></canvas>
      </div>


    </div>
  );
};

const mapStateToProps = state => {
  return {
    connected: state.websockets.connected
  };
};

const mapDispatchToProps = dispatch => {
  return {
    muteButtonClick: () => {
      dispatch(RosiGameActions.muteButtonClick());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(SquidGameAnimation));
