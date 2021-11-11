import { take, put, call, select, delay } from 'redux-saga/effects';
import { eventChannel } from 'redux-saga';
import { RosiGameActions } from '../actions/rosi-game';
import { NotificationActions } from '../actions/notification';
import { AlertActions, UserNotificationTypes } from '../actions/alert';
import _ from 'lodash';
import ChatMessageType from '../../components/ChatMessageWrapper/ChatMessageType';
import { ChatActions } from '../actions/chat';
import { WebsocketsActions, UserMessageRoomId } from '../actions/websockets';
import { createSocket, websocket } from '../../api/websockets';
import { createMatchSelector } from 'connected-react-router';
import Routes from '../../constants/Routes';
import { matchPath } from 'react-router';
import { UNIVERSAL_EVENTS_ROOM_ID } from 'constants/Activities';
import { EventActions } from '../actions/event';
import trackedActivities from '../../components/ActivitiesTracker/trackedActivities';
import { GAMES } from '../../constants/Games';

/**
 *  creates an event Channel from the events happening on the websocket
 *  */
function createSocketChannel(socket) {
  return eventChannel(emit => {
    // const connectHandler = () => {
    //   const message = {
    //     type: 'connect',
    //   };

    //   emit(message);
    // };
    // const chatMessageHandler = event => {
    //   const message = {
    //     ...event,
    //   };

    //   emit(message);
    // };
    // const addBetCreatedHandler = event => {
    //   const message = {
    //     ...event,
    //   };

    //   emit(message);
    // };

    // const addNewBetPlaceHandler = event => {
    //   const message = {
    //     ...event,
    //   };

    //   emit(message);
    // };

    // const addNewBetPullOutHandler = event => {
    //   const message = {
    //     ...event,
    //   };

    //   emit(message);
    // };

    // const notificationHandler = notification => {
    //   emit({
    //     type: 'notification',
    //     ...notification,
    //   });
    // };

    // const errorHandler = errorEvent => {
    //   // create an Error object and put it into the channel
    //   emit(new Error(errorEvent.reason));
    // };

    // const casinoStartHandler = event => {
    //   const message = {
    //     type: ChatMessageType.casinoStart,
    //     ...event,
    //   };

    //   emit(message);
    // };

    // const casinoEndHandler = event => {
    //   const message = {
    //     type: ChatMessageType.casinoEnd,
    //     ...event,
    //   };

    //   emit(message);
    // };

    // const casinoTradeHandler = event => {
    //   const message = {
    //     type: ChatMessageType.casinoTrade,
    //     ...event,
    //   };

    //   emit(message);
    // };

    // const casinoRewardHandler = event => {
    //   const message = {
    //     type: ChatMessageType.casinoReward,
    //     ...event,
    //   };

    //   emit(message);
    // };

    // const casinoBetCanceledHandler = data => {
    //   const message = {
    //     ...data,
    //     type: ChatMessageType.casinoCancel,
    //   };

    //   emit(message);
    // };

    // const betStartedHandler = data => {
    //   const message = {
    //     ...data,
    //     type: UserNotificationTypes.BET_STARTED,
    //   };

    //   emit(message);
    // };

    // const onAnyListener = (eventName, data) => {
    //   const message = {
    //     type: 'any',
    //     eventName,
    //     data,
    //   };
    //   console.log('onAnyListener', eventName, data)
    //   emit(message);
    // };

    socket.onEvent = (eventName, msg) => {
      console.log('a new event was raised', eventName, msg);
      emit({
        type: eventName,
        ...msg,
      });
    };

    // setup the subscription
    // socket.on('connect', connectHandler);
    // socket.on('chatMessage', chatMessageHandler);
    // socket.on('betCreated', addBetCreatedHandler);
    // socket.on('betPlaced', addNewBetPlaceHandler);
    // socket.on('betPulledOut', addNewBetPullOutHandler);
    // socket.on('notification', notificationHandler);
    // socket.on('error', errorHandler);
    // socket.on('CASINO_START', casinoStartHandler);
    // socket.on('CASINO_END', casinoEndHandler);
    // socket.on('CASINO_TRADE', casinoTradeHandler);
    // socket.on('CASINO_REWARD', casinoRewardHandler);
    // socket.on('EVENT_BET_STARTED', betStartedHandler);
    // socket.on('CASINO_CANCEL', casinoBetCanceledHandler);
    // socket.onAny(onAnyListener);

    const unsubscribe = () => {
      socket.onEvent = null;
      // socket.off('chatMessage', chatMessageHandler);
      // socket.off('betCreated', addBetCreatedHandler);
      // socket.off('betPlaced', addNewBetPlaceHandler);
      // socket.off('betPulledOut', addNewBetPullOutHandler);
      // socket.off('notification', notificationHandler);
      // socket.off('CASINO_START', casinoStartHandler);
      // socket.off('CASINO_END', casinoEndHandler);
      // socket.off('CASINO_TRADE', casinoTradeHandler);
      // socket.off('CASINO_REWARD', casinoRewardHandler);
      // socket.off('EVENT_BET_STARTED', betStartedHandler);
      // socket.off('CASINO_CANCEL', casinoBetCanceledHandler);
      // socket.offAny(onAnyListener);
    };

    return unsubscribe;
  });
}

const notificationTypes = {
  EVENT_START: 'Notification/EVENT_START',
  EVENT_USER_REWARD: 'Notification/EVENT_USER_REWARD',
  EVENT_CANCEL: 'Notification/EVENT_CANCEL',
  EVENT_BET_STARTED: 'Notification/EVENT_BET_STARTED',
};

export function* init() {
  const token = yield select(state => state.authentication.token);
  try {
    console.log('init sockets');
    //createSocket(token);
    //let socket = websocket;
    yield call(createSocket, token);
    const socketChannel = yield call(createSocketChannel, websocket);
    yield put(WebsocketsActions.initSucceeded());
    while (true) {
      try {
        const payload = yield take(socketChannel);
        const type = _.get(payload, 'type');
        console.log('socket eventChannel: new event with type ', type);
        const uid = yield select(state => state.authentication.userId);
        switch (type) {
          case 'close':
          case 'error':
            console.log(`on ${type} from eventChannel`);
            yield put(WebsocketsActions.disconnected());
            break;
          case 'connect':
            console.log(`on ${type} from eventChannel`);
            yield put(WebsocketsActions.connected());
            break;
          case ChatMessageType.casinoStart:
            yield put(RosiGameActions.setHasStarted(payload));
            yield put(RosiGameActions.resetCashedOut());
            break;
          case ChatMessageType.casinoEnd:
            yield put(
              RosiGameActions.addLastCrash({
                nextGameAt: payload.nextGameAt,
                crashFactor: payload.crashFactor,
                gameHash: payload.gameId,
                userId: uid,
              })
            );
            break;
          case ChatMessageType.casinoTrade:
            yield put(
              RosiGameActions.addInGameBet({ ...payload, clientUserId: uid })
            );
            break;
          case ChatMessageType.casinoReward:
            yield put(
              RosiGameActions.addReward({ ...payload, clientUserId: uid })
            );
            break;
          case ChatMessageType.casinoCancel:
            yield put(
              RosiGameActions.handleCancelBet({ ...payload, clientUserId: uid })
            );
            break;
          case ChatMessageType.pulloutBet:
          case ChatMessageType.createBet:
          case ChatMessageType.event:
          case ChatMessageType.game:
          case ChatMessageType.user:
            yield put(
              ChatActions.addMessage({
                roomId: payload.roomId,
                message: payload,
              })
            );
            break;
          case ChatMessageType.placeBet:
            const events = yield select(state => state.event.events);
            const event = events.find(e => e._id === payload.roomId);
            if (event?.type === 'non-streamed') {
              const chartParams = yield select(
                state => state.event.chartParams
              );
              yield put(
                EventActions.initiateFetchChartData(payload.betId, chartParams)
              );
            }
            yield put(
              ChatActions.addMessage({
                roomId: payload.roomId,
                message: payload,
              })
            );
            break;
          case 'notification':
          case UserNotificationTypes.BET_RESOLVED:
          case UserNotificationTypes.EVENT_BET_CANCELLED:
          case UserNotificationTypes.EVENT_CANCEL:
          case UserNotificationTypes.EVENT_RESOLVE:
          case UserNotificationTypes.EVENT_USER_REWARD:
          case UserNotificationTypes.USER_AWARD:
            yield put(
              AlertActions.showNotification({
                notification: payload,
              })
            );
            yield put(ChatActions.fetchByRoom({ roomId: UserMessageRoomId }));
            break;
          case notificationTypes.EVENT_BET_STARTED:
            yield put(EventActions.fetchAll());
            break;
          case 'any':
            if (trackedActivities.indexOf(payload.eventName) > -1) {
              yield put(
                NotificationActions.addActivity({
                  activity: payload.data,
                  eventName: payload.eventName,
                })
              );
            }
            break;
        }
      } catch (err) {
        console.error('socket error:', err);
        // socketChannel is still open in catch block
        // if we want end the socketChannel, we need close it explicitly
        // socketChannel.close()
      }
    }
  } catch (error) {
    yield put(WebsocketsActions.initFailed({ error }));
  }
}

const isActivitiesPage = (currentAction, pathSlugs) =>
  currentAction[0] === 'activities' || pathSlugs[0] === 'activities';
const isHomePage = (currentAction, pathSlugs) =>
  currentAction[0] === '' || pathSlugs[0] === '';
const isGamePage = (currentAction, pathSlugs) =>
  (currentAction[0] === 'games' || pathSlugs[0] === 'games') &&
  (pathSlugs.length > 1 || currentAction.length > 1);

/**
 * Initializes the websocket connection or join/leave rooms based on current state
 * @returns
 */
export function* checkWsRoomsWithCurrentState() {
  const ready = yield select(state => state.websockets.init);
  if (!ready) {
    console.log('on route load the sockets arent ready, init and skip');
    return yield call(init);
  }

  const connected = yield select(state => state.websockets.connected);
  if (!connected) {
    console.log('on route load the sockets arent connected, simply skip');
    return;
  }

  const userId = yield select(state => state.authentication.userId);
  const currentRooms = yield select(state => state.websockets.rooms) || [];
  const pathname = yield select(state => state.router.location.pathname);
  const currentAction = pathname.slice(1).split('/');
  const pathSlugs = pathname.slice(1).split('/');
  let newRoomsToJoin = [];

  if (userId) {
    newRoomsToJoin.push(UserMessageRoomId);
  }

  if (currentAction[0] === 'trade' || pathSlugs[0] === 'trade') {
    const eventSlug = pathSlugs[1];
    const events = yield select(state => state.event.events);
    const event = events.find(
      e => e.slug === (!!currentAction[1] ? currentAction[1] : eventSlug)
    );
    if (event) newRoomsToJoin.push(event._id);
  }

  if (
    isActivitiesPage(currentAction, pathSlugs) ||
    isHomePage(currentAction, pathSlugs)
  ) {
    newRoomsToJoin.push(UNIVERSAL_EVENTS_ROOM_ID);
  }

  if (isGamePage(currentAction, pathSlugs)) {
    const game = Object.values(GAMES).find(
      g => g.slug === (pathSlugs[1] || currentAction[1])
    );
    if (game) {
      newRoomsToJoin.push(game.id);
      newRoomsToJoin.push(UNIVERSAL_EVENTS_ROOM_ID);
    }
  }

  // leave all non active rooms except UserMessageRoomId
  for (let roomIdToLeave of currentRooms) {
    if (
      roomIdToLeave !== UserMessageRoomId &&
      !newRoomsToJoin.includes(roomIdToLeave)
    ) {
      yield put(
        WebsocketsActions.leaveRoom({
          userId,
          roomId: roomIdToLeave,
        })
      );
    }
  }

  // join all non already active rooms
  for (let roomId of newRoomsToJoin) {
    if (!currentRooms.includes(roomId)) {
      yield put(
        WebsocketsActions.joinRoom({
          userId,
          roomId: roomId,
        })
      );
    }
  }
}

export function* joinRoom(action) {
  yield call(websocket.emit, 'joinRoom', action);
}

export function* leaveRoom(action) {
  yield call(websocket.emit, 'leaveRoom', action);
}

export function* sendChatMessage(action) {
  const token = yield select(state => state.authentication.token);
  if (token) {
    yield call(websocket.emit, 'chatMessage', action.messageObject);
  }
}

export function* idleCheck() {
  const connected = yield select(state => state.websockets.connected);
  if (!connected) {
    yield put(WebsocketsActions.disconnected());
  }

  yield delay(5000);
  yield call(idleCheck);
}

export default {
  init,
  joinRoom,
  leaveRoom,
  sendChatMessage,
  checkWsRoomsWithCurrentState,
  idleCheck,
};
