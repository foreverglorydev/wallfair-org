import { useCallback, useEffect, useState } from 'react';
import { GameApi, setInitialEvoplaySession, getUrlgame } from 'api/casino-games';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import BaseContainerWithNavbar from 'components/BaseContainerWithNavbar';
import BackLink from 'components/BackLink';
import Spins from 'components/Spins';
import GameAnimation from 'components/RouletteGameAnimation';
import Chat from 'components/Chat';
import useRosiData from 'hooks/useRosiData';
import styles from './styles.module.scss';
import { AlertActions } from '../../store/actions/alert';
import { RosiGameActions } from '../../store/actions/rosi-game';
import ContentFooter from 'components/ContentFooter';
import ChatMessageType from 'components/ChatMessageWrapper/ChatMessageType';
import { ChatActions } from 'store/actions/chat';
import Share from '../../components/Share';
import PopupTheme from 'components/Popup/PopupTheme';
import Icon from 'components/Icon';
import IconType from 'components/Icon/IconType';
import IconTheme from 'components/Icon/IconTheme';
import { PopupActions } from 'store/actions/popup';
import TabOptions from '../../components/TabOptions';
import Routes from 'constants/Routes';
import { getGameById, ObjectId } from '../../helper/Games';
import { GAMES } from '../../constants/Games';
import {
  trackAlpacaWheelPlaceBetGuest,
  trackAlpacaWheelPlaceBet,
  trackAlpacaWheelCashout,
} from '../../config/gtm';
import { UserActions } from 'store/actions/user';
import EventActivitiesTabs from 'components/EventActivitiesTabs'
import { isMobile } from 'react-device-detect';
import { selectUser } from 'store/selectors/authentication';


const EvoplayGame = ({
  showPopup,
  history,
  connected,
  userId,
  token,
  refreshHighData,
  refreshLuckyData,
  updateUserBalance,
  match
}) => {
  const user = useSelector(selectUser);
  const gameName = match?.params?.game
  console.log("gameName", gameName)
  const EXTERNAL_GAME_EVENT_ID = ObjectId(gameName)//game.id;
  const dispatch = useDispatch();
  const [demo, setDemo] = useState(true);
  const [amount, setAmount] = useState(50);
  const [init, setInit] = useState(null);

  const isMiddleOrLargeDevice = useMediaQuery('(min-width:769px)');
  const [chatTabIndex, setChatTabIndex] = useState(0);
  const chatTabOptions = [{ name: 'CHAT', index: 0 }];

  const handleHelpClick = useCallback(event => {
    showPopup(PopupTheme.explanation);
  }, []);


  useEffect(() => {
  //  if(!user.isLoggedIn){
      //setInit('faebb4a9-eca3-4720-b6fd-82540f55486a')
  //  }else{
      getUrlgame({UserId: userId, GameName: gameName, Provider: 'evoplay' })
        .then(({data}) => {
          if(data?.url) setInit(data?.url)

        })
        .catch(error => {
          dispatch(AlertActions.showError(error.message));
        });


/*
      setInitialEvoplaySession({UserId: userId, GameName: gameName, Provider: 'evoplay' })
        .then(({data}) => {
          console.log("data", data)
        })
        .catch(error => {
          dispatch(AlertActions.showError(error.message));
        });
        */
  //  }
    return () => {
    //  setInit(null)
    }
  }, [])

  useEffect(() => {
    dispatch(ChatActions.fetchByRoom({ roomId: EXTERNAL_GAME_EVENT_ID }));
  }, [dispatch, connected]);


  const handleChatSwitchTab = option => {
    setChatTabIndex(option.index);
  };

  const renderActivities = () => (
    <Grid item xs={12} md={6}>
      <EventActivitiesTabs
        activitiesLimit={50}
        className={styles.activitiesTrackerGamesBlock}
        preselectedCategory={'game'}
        gameId={EXTERNAL_GAME_EVENT_ID}></EventActivitiesTabs>
    </Grid>
  );

  const renderChat = () => (
    <Grid item xs={12} md={6}>
      <div className={styles.chatWrapper}>
        <TabOptions options={chatTabOptions} className={styles.tabLayout}>
          {option => (
            <div
              className={
                option.index === chatTabIndex
                  ? styles.tabItemSelected
                  : styles.tabItem
              }
              onClick={() => handleChatSwitchTab(option)}
            >
              {option.name}
            </div>
          )}
        </TabOptions>
        <Chat
          roomId={EXTERNAL_GAME_EVENT_ID}
          className={styles.chatContainer}
          chatMessageType={ChatMessageType.game}
        />
      </div>
    </Grid>
  );


  //const url = `https://eu-staging.ssgportal.com/GameLauncher/Loader.aspx?&GameName=${gameName}&Token=${init}&PortalName=wallfair&ReturnUrl=${window.location.origin}`

  //const urltest = `https://server.ssg-public.com/GameLauncher/Loader.aspx?Token=DEMO&GameName=${gameName}&ReturnUrl=${window.location.origin}&Lang=en&PortalName=DEMO`

  return (
    <BaseContainerWithNavbar withPaddingTop={true}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.headlineWrapper}>
            <BackLink to="/games" text={gameName} />
            <Share popupPosition="right" className={styles.shareButton} />
            <Icon
              className={styles.questionIcon}
              iconType={IconType.question}
              iconTheme={IconTheme.white}
              height={25}
              width={25}
              onClick={handleHelpClick}
            />
          </div>
          {init && <iframe className={styles.mainContainer} src={user.isLoggedIn?init:null}/>}
          {isMiddleOrLargeDevice ? (
            <div className={styles.bottomWrapper}>
              {renderChat()}
              {renderActivities()}
            </div>
          ) : null}
        </div>
      </div>
    </BaseContainerWithNavbar>
  );
};


const mapStateToProps = state => {
  return {
    connected: state.websockets.connected,
    userId: state.authentication.userId,
    token: state.authentication.token,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    refreshHighData: () => dispatch(RosiGameActions.fetchHighData()),
    refreshLuckyData: () => dispatch(RosiGameActions.fetchLuckyData()),
    hidePopup: () => {
      dispatch(PopupActions.hide());
    },
    showPopup: (popupType, options) => {
      dispatch(
        PopupActions.show({
          popupType,
          options,
        })
      );
    },
    updateUserBalance: (userId) => {
      dispatch(UserActions.fetch({ userId, forceFetch: true }));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EvoplayGame);
