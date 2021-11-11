import AlertSagas from './alert';
import AuthenticationSagas from './authentication';
import BetSagas from './bet';
import EventSagas from './event';
import TransactionSagas from './transaction';
import UserSagas from './user';
import ChatSagas from './chat';
import WebsocketsSagas from './websockets';
import LeaderboardSagas from './leaderboard';
import { all, select, takeLatest, takeEvery, put } from 'redux-saga/effects';
import { AuthenticationTypes } from '../actions/authentication';
import { BetTypes } from '../actions/bet';
import { EventActions } from '../actions/event';
import { EventTypes } from '../actions/event';
import { REHYDRATE } from 'redux-persist';
import { TransactionTypes } from '../actions/transaction';
import { UserTypes } from '../actions/user';
import { AlertTypes } from '../actions/alert';
import { ChatActions, ChatTypes } from '../actions/chat';
import {
  WebsocketsTypes,
  WebsocketsActions,
  UserMessageRoomId,
} from '../actions/websockets';
import { LOCATION_CHANGE } from 'connected-react-router';
import { LeaderboardTypes } from '../actions/leaderboard';
import { RosiGameTypes } from '../actions/rosi-game';
import * as RosiGameSagas from './rosi-game';

const root = function* () {
  yield all([
    // @formatter:off
    takeLatest([AuthenticationTypes.LOGOUT], AuthenticationSagas.logout),
    takeLatest(
      [AuthenticationTypes.FORCED_LOGOUT],
      AuthenticationSagas.forcedLogout
    ),
    takeLatest([AuthenticationTypes.VERIFY_SMS], AuthenticationSagas.verifySms),
    takeLatest(
      [AuthenticationTypes.REQUEST_SMS],
      AuthenticationSagas.requestSms
    ),
    takeLatest(
      [AuthenticationTypes.SET_NAME, AuthenticationTypes.SET_EMAIL],
      AuthenticationSagas.setAdditionalInformation
    ),
    takeLatest(
      [AuthenticationTypes.VERIFY_EMAIL],
      AuthenticationSagas.verifyEmail
    ),
    takeLatest(
      [AuthenticationTypes.FETCH_REFERRALS],
      AuthenticationSagas.fetchReferrals
    ),
    takeLatest(
      [AuthenticationTypes.FETCH_REFERRALS_SUCCEEDED],
      AuthenticationSagas.fetchReferralsSucceeded
    ),
    takeLatest(
      [AuthenticationTypes.SAVE_ADDITIONAL_INFO_SUCCEEDED],
      AuthenticationSagas.registrationSucceeded
    ),
    takeLatest(
      [
        AuthenticationTypes.VERIFY_SMS_SUCCEEDED,
        AuthenticationTypes.SAVE_ADDITIONAL_INFO_SUCCEEDED,
        AuthenticationTypes.LOGIN_SUCCESS,
      ],
      AuthenticationSagas.authenticationSucceeded
    ),
    takeLatest([AuthenticationTypes.SIGN_UP], AuthenticationSagas.signUp),
    takeLatest([AuthenticationTypes.LOGIN], AuthenticationSagas.login),
    takeLatest(
      [AuthenticationTypes.FORGOT_PASSWORD],
      AuthenticationSagas.forgotPassword
    ),
    takeLatest(
      [AuthenticationTypes.RESET_PASSWORD],
      AuthenticationSagas.resetPassword
    ),
    takeLatest(
      AuthenticationTypes.UPDATE_STATUS,
      AuthenticationSagas.updateStatus
    ),
    takeEvery(
      [
        AuthenticationTypes.FETCH_REFERRALS_FAILED,
        EventTypes.CREATE_EVENT_FAILED,
        EventTypes.EDIT_EVENT_FAILED,
        EventTypes.FETCH_ALL_FAILED,
        EventTypes.DELETE_EVENT_FAILED,
        BetTypes.CREATE_FAILED,
        BetTypes.EDIT_FAILED,
        BetTypes.PLACE_FAILED,
        BetTypes.PULL_OUT_BET_FAILED,
      ],
      AlertSagas.handleFail
    ),
    takeEvery(
      [
        EventTypes.CREATE_EVENT_SUCCEEDED,
        EventTypes.EDIT_EVENT_SUCCEEDED,
        EventTypes.DELETE_EVENT_SUCCEEDED,
        BetTypes.CREATE_SUCCEEDED,
        BetTypes.EDIT_SUCCEEDED,
        BetTypes.PLACE_SUCCEEDED,
        BetTypes.PULL_OUT_BET_SUCCEEDED,
      ],
      AlertSagas.handleSuccess
    ),
    takeEvery(
      [
        AlertTypes.SHOW_SUCCESS,
        AlertTypes.SHOW_ERROR,
        AlertTypes.SHOW_NOTIFICATION,
      ],
      AlertSagas.handleShown
    ),
    takeLatest([EventTypes.FETCH_ALL], EventSagas.fetchAll),
    takeLatest([EventTypes.FETCH_ALL_SUCCEEDED], EventSagas.fetchAllSucceeded),
    takeLatest([EventTypes.FETCH_FILTERED], EventSagas.fetchFilteredEvents),
    takeEvery([EventTypes.FETCH_HOME_EVENTS], EventSagas.fetchHomeEvents),
    takeLatest([BetTypes.PLACE], BetSagas.place),
    takeLatest([BetTypes.CREATE], BetSagas.create),
    takeLatest([BetTypes.EDIT], BetSagas.edit),
    takeEvery([BetTypes.FETCH_OUTCOMES], BetSagas.fetchOutcomes),
    takeEvery([BetTypes.FETCH_SELL_OUTCOMES], BetSagas.fetchSellOutcomes),
    takeLatest([BetTypes.FETCH_OPEN_BETS], BetSagas.fetchOpenBets),
    takeLatest([BetTypes.FETCH_TRADE_HISTORY], BetSagas.fetchTradeHistory),
    takeLatest(
      [BetTypes.FETCH_OPEN_BETS_SUCCEEDED],
      BetSagas.fetchOpenBetsSucceeded
    ),
    takeEvery([BetTypes.PULL_OUT_BET], BetSagas.pullOut),
    takeLatest(
      [TransactionTypes.FETCH_ALL],
      TransactionSagas.fetchTransactions
    ),
    takeEvery([UserTypes.FETCH], UserSagas.fetch),
    takeEvery([UserTypes.FETCH_SUCCEEDED], UserSagas.fetchSucceeded),
    takeLatest([UserTypes.UPDATE_PREFERENCES], UserSagas.updatePreferences),
    takeEvery([ChatTypes.ADD_MESSAGE], ChatSagas.addMessage),
    takeEvery([ChatTypes.SET_MESSAGE_READ], ChatSagas.setMessageRead),
    takeEvery([ChatTypes.FETCH_BY_ROOM], ChatSagas.fetchByRoom),
    takeLatest(
      [WebsocketsTypes.INIT],
      WebsocketsSagas.checkWsRoomsWithCurrentState
    ),
    takeLatest(
      [WebsocketsTypes.CONNECTED],
      WebsocketsSagas.checkWsRoomsWithCurrentState
    ),
    takeLatest(
      [WebsocketsTypes.DISCONNECTED],
      WebsocketsSagas.checkWsRoomsWithCurrentState
    ),
    takeEvery([WebsocketsTypes.JOIN_ROOM], WebsocketsSagas.joinRoom),
    takeEvery([WebsocketsTypes.LEAVE_ROOM], WebsocketsSagas.leaveRoom),
    takeEvery(
      [WebsocketsTypes.SEND_CHAT_MESSAGE],
      WebsocketsSagas.sendChatMessage
    ),
    takeLatest([REHYDRATE], WebsocketsSagas.idleCheck),
    takeEvery([LOCATION_CHANGE], WebsocketsSagas.checkWsRoomsWithCurrentState),
    takeLatest([REHYDRATE], AuthenticationSagas.restoreToken),
    takeLatest(
      [REHYDRATE, AuthenticationTypes.LOGIN_SUCCESS],
      AuthenticationSagas.refreshImportantData
    ),
    takeLatest([REHYDRATE], AuthenticationSagas.firstSignUpPopup),
    takeLatest([LeaderboardTypes.FETCH_ALL], LeaderboardSagas.fetchAll),
    takeLatest([LeaderboardTypes.FETCH_BY_USER], LeaderboardSagas.fetchByUser),
    takeLatest([EventTypes.FETCH_TAGS], EventSagas.fetchTags),
    takeLatest([REHYDRATE], rehydrationDone),
    takeLatest(
      [AuthenticationTypes.INITIATE_UPDATE_USER_DATA],
      AuthenticationSagas.updateUserData
    ),
    takeLatest(
      [EventTypes.FETCH_HISTORY_CHART_DATA, EventTypes.UPDATE_CHART_PARAMS],
      EventSagas.fetchHistoryChartData
    ),
    takeLatest([EventTypes.FETCH_NEWS_DATA], EventSagas.fetchNewsData),
    takeLatest([EventTypes.CREATE_EVENT], EventSagas.createEvent),
    takeLatest([EventTypes.EDIT_EVENT], EventSagas.editEvent),
    takeLatest([EventTypes.DELETE_EVENT], EventSagas.deleteEvent),
    takeLatest([EventTypes.BOOKMARK_EVENT], EventSagas.bookmarkEvent),
    takeLatest(
      [EventTypes.BOOKMARK_EVENT_CANCEL],
      EventSagas.bookmarkEventCancel
    ),
    takeEvery([RosiGameTypes.ADD_LAST_CRASH], RosiGameSagas.endGame),
    takeEvery([UserTypes.REQUEST_TOKENS], UserSagas.requestTokens),
    takeLatest(
      [RosiGameTypes.FETCH_HIGH_DATA_STARTED],
      RosiGameSagas.fetchHighData
    ),
    takeLatest(
      [RosiGameTypes.FETCH_LUCKY_DATA_STARTED],
      RosiGameSagas.fetchLuckyData
    ),
    // @formatter:on
  ]);
};

const rehydrationDone = function* () {
  yield preLoading();
};

const preLoading = function* () {
  yield put(EventActions.fetchAll());
  yield put(WebsocketsActions.init());

  const userId = yield select(state => state.authentication.userId);

  if (userId) {
    yield put(ChatActions.fetchByRoom({ roomId: UserMessageRoomId }));
  }
};

export default {
  root,
};
