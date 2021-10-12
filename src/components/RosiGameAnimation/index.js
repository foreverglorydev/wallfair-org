import cn from 'classnames';
import classNames from 'classnames';
import { useEffect, useRef, useState } from 'react';
import { useSelector, connect } from 'react-redux';
import { ROSI_GAME_AFTER_CRASH_DELAY } from 'constants/RosiGame';
import {
  selectHasStarted,
  selectTimeStarted,
  selectLastCrash,
  selectCashedOut,
  selectNextGameAt,
} from 'store/selectors/rosi-game';
import Timer from './Timer';
import Counter from './Counter';
import styles from './styles.module.scss';
import RosiGameAnimationController from './canvas/RosiGameAnimationController';
import { CircularProgress } from '@material-ui/core';
import { calcCrashFactorFromElapsedTime } from './canvas/utils';

const PreparingRound = ({ nextGameAt }) => (
  <div className={styles.preparingRound}>
    <div>
      <h2 className={styles.title}>Preparing Round</h2>
      <div className={styles.description}>
        <span>
          Starting in <Counter className={styles.counter} from={nextGameAt} />
        </span>
      </div>
    </div>
  </div>
);

const GameOffline = () => (
  <div className={styles.preparingRound}>
    <div>
      <h2 className={styles.title}>You are disconnected</h2>
      <div className={styles.description}>Attempting to reconnect...</div>
    </div>
  </div>
);

const setRandomInterval = (intervalFunction, minDelay, maxDelay) => {
  let timeout;

  const runInterval = () => {
    const timeoutFunction = () => {
      intervalFunction();
      runInterval();
    };

    const delay =
      Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

    timeout = setTimeout(timeoutFunction, delay);
  };

  runInterval();

  return {
    clear() {
      clearTimeout(timeout);
    },
  };
};

const RosiGameAnimation = ({ connected }) => {
  const canvasRef = useRef(null);
  const lastCrashValue = useSelector(selectLastCrash);
  const gameStarted = useSelector(selectHasStarted);
  const cashedOut = useSelector(selectCashedOut);
  const nextGameAtTimeStamp = useSelector(selectNextGameAt);
  // const gameStartedTimeStamp = useSelector(selectTimeStarted);
  const gameStartedTimeStamp = Date.now();
  const gameStartedTime = new Date(gameStartedTimeStamp).getTime();

  const [cashedOutCount, setCashedOutCount] = useState(0);
  const [isPreparingRound, setIsPreparingRound] = useState(!gameStarted);
  const [isAnimationReady, setAnimationReady] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      RosiGameAnimationController.init(canvasRef.current);
      RosiGameAnimationController.load(() => {
        setAnimationReady(true);
        if (isPreparingRound) {
          RosiGameAnimationController.preparingRound.show();
        }
      });
    }
  }, []);

  useEffect(() => {
    if (!isAnimationReady) {
      return;
    }

    if (gameStarted) {
      setCashedOutCount(0);
      setIsPreparingRound(false);
      RosiGameAnimationController.start(gameStartedTime);

      setTimeout(() => {
        RosiGameAnimationController.doCashedOutAnimation({
          amount: 345,
          crashFactor: calcCrashFactorFromElapsedTime(
            Date.now() - gameStartedTime
          ),
        });
      }, 100);

      const interval = setRandomInterval(
        () => {
          RosiGameAnimationController.doCashedOutAnimation({
            amount: 345,
            crashFactor: calcCrashFactorFromElapsedTime(
              Date.now() - gameStartedTime
            ),
          });
        },
        2500,
        6500
      );

      // return () => interval.clear();

      // const timeout = setTimeout(() => {
      //   RosiGameAnimationController.doCashedOutAnimation({ amount: 345, crashFactor: 1.24 });
      // }, 2000);

      // return () => clearTimeout(timeout);
    }

    if (!gameStarted && !isPreparingRound) {
      RosiGameAnimationController.end();

      // leave some time for player to see crash value
      setTimeout(() => {
        RosiGameAnimationController.preparingRound.show();
        setIsPreparingRound(true);
      }, ROSI_GAME_AFTER_CRASH_DELAY);
    }
  }, [gameStarted, isAnimationReady]); // eslint-disable-line

  useEffect(() => {
    if (!isAnimationReady || !gameStarted) {
      return;
    }

    if (cashedOut && cashedOut.length > cashedOutCount) {
      setCashedOutCount(cashedOutCount + 1);
      RosiGameAnimationController.doCashedOutAnimation(cashedOut[0]);
    }
  }, [isAnimationReady, gameStarted, cashedOut]); // eslint-disable-line

  function render() {
    if (!connected) return <GameOffline />;

    if (isPreparingRound) {
      return <PreparingRound nextGameAt={nextGameAtTimeStamp} />;
    }

    return (
      <div
        className={cn(styles.timer, { [styles.flashAnimation]: !gameStarted })}
      >
        {gameStarted ? (
          <Timer pause={!gameStarted} startTimeMs={gameStartedTime} />
        ) : (
          <span>{lastCrashValue.toFixed(2)}</span>
        )}
        <span>x</span>
      </div>
    );
  }

  return (
    <div className={styles.animation}>
      <canvas
        className={classNames(
          styles.canvas,
          !connected ? styles.gameOffline : null
        )}
        id="rosi-game-animation"
        ref={canvasRef}
      />
      {isAnimationReady ? (
        render()
      ) : (
        <CircularProgress style={{ position: 'absolute', margin: '0 auto' }} />
      )}
    </div>
  );
};

const mapStateToProps = state => {
  return {
    connected: state.websockets.connected,
  };
};

export default connect(mapStateToProps, null)(RosiGameAnimation);
